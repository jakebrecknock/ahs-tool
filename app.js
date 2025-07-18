// DOM Elements
const base64Image = "https://raw.githubusercontent.com/jakebrecknock/ahs-tool/refs/heads/main/ace-handy-logos.webp";
const dashboardView = document.getElementById('dashboardView');
const newEstimateView = document.getElementById('newEstimateView');
const dashboardBtn = document.getElementById('dashboardBtn');
const newEstimateBtn = document.getElementById('newEstimateBtn');
const estimatesList = document.getElementById('estimatesList');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const estimateModal = document.getElementById('estimateModal');
const closeModal = document.querySelector('.close-modal');
const editEstimateBtn = document.getElementById('editEstimateBtn');
const deleteEstimateBtn = document.getElementById('deleteEstimateBtn');
const exportEstimateBtn = document.getElementById('exportEstimateBtn');
const modalContent = document.getElementById('modalContent');
const editFieldsContainer = document.getElementById('editFieldsContainer');
const saveChangesBtn = document.getElementById('saveChangesBtn');
let isEditing = false;
const PASSWORD = "AHS!";
const passwordModal = document.getElementById('passwordModal');
const passwordInput = document.getElementById('passwordInput');
const passwordError = document.getElementById('passwordError');
const submitPassword = document.getElementById('submitPassword');
let currentJobId = 1;
let autocomplete;


function formatAccounting(num) {
    return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}


const firebaseConfig = {
    apiKey: "AIzaSyC37V1uqBjG4kEyH81vzNQ-eGfTz5XZrc8",
    authDomain: "ahs-tool.firebaseapp.com",
    projectId: "ahs-tool",
    storageBucket: "ahs-tool.appspot.com",
    messagingSenderId: "613725752549",
    appId: "1:613725752549:web:6fcdb627422efbc68b580c",
    measurementId: "G-X90TBYBYWD"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


// Current estimate data
let currentEstimate = {
    customer: {},
    jobs: [], // Array of job objects
    total: 0
};


// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    checkPassword();
    loadEstimates();
    initPhoneNumberFormatting();
    initDateFilters();
    addNewJob();
    setupEventListeners();
    // Add this line to set up the password submit listener
    submitPassword.addEventListener('click', verifyPassword);
    
    // Also add keypress listener for Enter key
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') verifyPassword();
    });
});


function setupEventListeners() {
    // Dashboard elements
    dashboardBtn.addEventListener('click', showDashboard);
    newEstimateBtn.addEventListener('click', showNewEstimate);
    
    // Search elements
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') searchEstimates();
    });
    searchBtn.addEventListener('click', searchEstimates);
    
    // Modal elements
    closeModal.addEventListener('click', closeEstimateModal);
    editEstimateBtn.addEventListener('click', editEstimate);
    deleteEstimateBtn.addEventListener('click', deleteEstimate);
    exportEstimateBtn.addEventListener('click', exportEstimate);
    
    // Estimate form elements
    saveEstimateBtn.addEventListener('click', saveEstimate);
    
    // Labor calculation inputs
const laborInputs = [
    'jobDays', 'jobHours', 'jobWorkers', 
    'apprenticeDays', 'apprenticeHours', 'apprenticeCount'
];

laborInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
        input.addEventListener('input', function() {
            updateCurrentJobDetails();
            updateEstimatePreview();
        });
        input.addEventListener('change', function() {
            updateCurrentJobDetails();
            updateEstimatePreview();
        });
    }
});

    // Material and fee buttons
    document.getElementById('addMaterial')?.addEventListener('click', addMaterialToJob);
    document.getElementById('waiveEstimateFeeBtn')?.addEventListener('click', toggleEstimateFee);
    
    // Add global functions for HTML onclick handlers
    window.nextStep = nextStep;
    window.prevStep = prevStep;
    window.cancelEstimate = cancelEstimate;
    window.addNewJob = addNewJob;
    window.removeJob = removeJob;
    window.addMaterialToJob = addMaterialToJob;
    window.removeMaterialFromJob = removeMaterialFromJob;
    window.toggleEstimateFee = toggleEstimateFee;
    window.addFeeToJob = addFeeToJob;
    window.removeFeeFromJob = removeFeeFromJob;
    window.updateJobDiscount = updateJobDiscount;
}

function verifyPassword() {
    const password = passwordInput.value.trim();
    if (password === PASSWORD) {
        sessionStorage.setItem('ahs-authenticated', 'true');
        passwordModal.style.display = 'none';
        passwordError.style.display = 'none';
        passwordInput.value = '';
        document.body.style.overflow = 'auto'; // Fix: Change from '' to 'auto'
        return true;
    } else {
        passwordError.style.display = 'block';
        passwordInput.value = '';
        passwordInput.focus();
        return false;
    }
}

function checkPassword() {
    if (sessionStorage.getItem('ahs-authenticated') === 'true') {
        passwordModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Fix: Change from '' to 'auto'
        return;
    }
    
    passwordModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    passwordInput.focus();
}


function showDashboard() {
    dashboardView.classList.add('active-view');
    newEstimateView.classList.remove('active-view');
    dashboardBtn.classList.add('active');
    newEstimateBtn.classList.remove('active');
    loadEstimates();
    document.getElementById('dashboardView').style.display = 'block';
    document.getElementById('newEstimateView').style.display = 'none';
}

function showNewEstimate() {
    dashboardView.classList.remove('active-view');
    newEstimateView.classList.add('active-view');
    dashboardBtn.classList.remove('active');
    newEstimateBtn.classList.add('active');
    resetEstimateForm();
    document.getElementById('dashboardView').style.display = 'none';
    document.getElementById('newEstimateView').style.display = 'block';
}


function resetEstimateForm() {
    currentEstimate = {
        customer: {},
        jobs: [],
        total: 0
    };
    currentJobId = 1;
    addNewJob();
    
    // Reset form steps
    document.querySelectorAll('.estimate-step').forEach(step => {
        step.classList.remove('active-step');
    });
    document.getElementById('customerInfoStep').classList.add('active-step');
    
    // Reset progress steps
    document.querySelectorAll('.progress-step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector('.progress-step[data-step="1"]').classList.add('active');
    
    // Clear form inputs
    document.getElementById('customerInfoForm').reset();
    
    // Set fee waiver to active by default
    const feeBtn = document.getElementById('waiveEstimateFeeBtn');
    if (feeBtn) {
        feeBtn.classList.add('active');
        feeBtn.innerHTML = '<i class="fas fa-check"></i> Estimate Fee Waived';
    }
    
    document.getElementById('liveLaborTotal').textContent = '$0.00';
}
    
/*    // Safely handle apprentice checkbox
    const hasApprentice = document.getElementById('hasApprentice');
    if (hasApprentice) {
        hasApprentice.checked = false;
    }
    
    // Safely handle apprentice labor group
    const apprenticeLaborGroup = document.getElementById('apprenticeLaborGroup');
    if (apprenticeLaborGroup) {
        apprenticeLaborGroup.style.display = 'none';
    }
}*/


function initPhoneNumberFormatting() {
    const phoneInput = document.getElementById('customerPhone');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        const input = e.target.value.replace(/\D/g,'').substring(0,10);
        const areaCode = input.substring(0,3);
        const middle = input.substring(3,6);
        const last = input.substring(6,10);
        
        if (input.length > 6) {
            e.target.value = `(${areaCode}) ${middle}-${last}`;
        } else if (input.length > 3) {
            e.target.value = `(${areaCode}) ${middle}`;
        } else if (input.length > 0) {
            e.target.value = `(${areaCode}`;
        }
    });
}


function initDateFilters() {
    const yearFilter = document.getElementById('yearFilter');
    const currentYear = new Date().getFullYear();
   
    for (let year = currentYear; year >= currentYear - 5; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    }
   
    document.getElementById('monthFilter').addEventListener('change', filterByDate);
    document.getElementById('yearFilter').addEventListener('change', filterByDate);
}


function addNewJob() {
    const newJob = {
        id: Date.now(),
        name: 'Job description required!', // Default text
        days: 0,
        hours: 0,
        workers: 1, // Default to 1 worker
        apprenticeDays: 0,
        apprenticeHours: 0,
        apprenticeCount: 0,
        labor: 0,
        apprenticeLabor: 0,
        materials: [],
        fees: [],
        discountPercentage: 0,
        waiveEstimateFee: true // Default to waived
    };
    
    currentEstimate.jobs.push(newJob);
    currentJobId = newJob.id;
    
    // Set placeholder text for job description
    const jobDescInput = document.getElementById('jobDescription');
    jobDescInput.value = "Job description required!";
    jobDescInput.placeholder = "Describe the work (required)";
    jobDescInput.focus();
    
    // Update UI after job is fully initialized
    updateJobTabs();
    showJobDetails(newJob.id);
    updateEstimatePreview();
    
    // Set fee waiver button to active by default
    const feeBtn = document.getElementById('waiveEstimateFeeBtn');
    if (feeBtn) {
        feeBtn.classList.add('active');
        feeBtn.innerHTML = '<i class="fas fa-check"></i> Estimate Fee Waived';
    }
}


function calculateLaborCost(days, hours, workers, apprenticeDays, apprenticeHours, apprenticeCount) {
    const WORKER_RATE = 135; // $135/hour for skilled workers
    const APPRENTICE_RATE = 65; // $65/hour for apprentices
    const SERVICE_FEE = 65; // $65 service fee per worker per day
    
    // Calculate worker labor (days are 8-hour packages)
    const workerFullDays = days * 8 * WORKER_RATE * workers;
    const workerPartialDay = hours * WORKER_RATE * workers;
    
    // Calculate apprentice labor
    const apprenticeFullDays = apprenticeDays * 8 * APPRENTICE_RATE * apprenticeCount;
    const apprenticePartialDay = apprenticeHours * APPRENTICE_RATE * apprenticeCount;
    
    // Calculate service fees (one per worker per day, including partial days)
    const totalWorkerDays = hours > 0 ? days + 1 : days;
    const serviceFees = totalWorkerDays * SERVICE_FEE * workers;
    
    const totalApprenticeDays = apprenticeHours > 0 ? apprenticeDays + 1 : apprenticeDays;
    const apprenticeServiceFees = apprenticeCount > 0 ? totalApprenticeDays * SERVICE_FEE * apprenticeCount : 0;
    
    return {
        workerLabor: workerFullDays + workerPartialDay + serviceFees,
        apprenticeLabor: apprenticeFullDays + apprenticePartialDay + apprenticeServiceFees,
        total: workerFullDays + workerPartialDay + serviceFees + apprenticeFullDays + apprenticePartialDay + apprenticeServiceFees
    };
}


function updateCurrentJobDetails() {
    const job = currentEstimate.jobs.find(j => j.id === currentJobId);
    if (job) {
        job.name = document.getElementById('jobDescription').value || `Job ${currentEstimate.jobs.findIndex(j => j.id === currentJobId) + 1}`;
        job.days = parseInt(document.getElementById('jobDays').value) || 0;
        job.hours = parseInt(document.getElementById('jobHours').value) || 0;
        job.workers = parseInt(document.getElementById('jobWorkers').value) || 1;
        job.apprenticeDays = parseInt(document.getElementById('apprenticeDays').value) || 0;
        job.apprenticeHours = parseInt(document.getElementById('apprenticeHours').value) || 0;
        job.apprenticeCount = parseInt(document.getElementById('apprenticeCount').value) || 0;
        
        const laborCosts = calculateLaborCost(
            job.days, 
            job.hours, 
            job.workers,
            job.apprenticeDays,
            job.apprenticeHours,
            job.apprenticeCount
        );
        
        job.labor = laborCosts.workerLabor;
        job.apprenticeLabor = laborCosts.apprenticeLabor;
        
        // Update live display immediately
        const liveLaborDisplay = document.getElementById('liveLaborTotal');
        if (liveLaborDisplay) {
            liveLaborDisplay.textContent = `$${formatAccounting(laborCosts.total)}`;
        }
    }
}


function showJobDetails(jobId) {
    // Save current job details before switching
    if (currentJobId) {
        const currentJob = currentEstimate.jobs.find(j => j.id === currentJobId);
        if (currentJob) {
            currentJob.name = document.getElementById('jobDescription').value || 'Job description required!';
            currentJob.days = parseInt(document.getElementById('jobDays').value) || 0;
            currentJob.hours = parseInt(document.getElementById('jobHours').value) || 0;
            currentJob.workers = parseInt(document.getElementById('jobWorkers').value) || 1;
            currentJob.apprenticeDays = parseInt(document.getElementById('apprenticeDays').value) || 0;
            currentJob.apprenticeHours = parseInt(document.getElementById('apprenticeHours').value) || 0;
            currentJob.apprenticeCount = parseInt(document.getElementById('apprenticeCount').value) || 0;
            currentJob.discountPercentage = parseFloat(document.getElementById('jobDiscountPercentage').value) || 0;
            
            const feeBtn = document.getElementById('waiveEstimateFeeBtn');
            currentJob.waiveEstimateFee = feeBtn.classList.contains('active');
        }
    }

    currentJobId = jobId;
    const job = currentEstimate.jobs.find(j => j.id === jobId);
    
    if (!job) return;

    // Update form fields with the job's values
    document.getElementById('jobDescription').value = job.name === 'Job description required!' ? '' : job.name;
    document.getElementById('jobDays').value = job.days;
    document.getElementById('jobHours').value = job.hours;
    document.getElementById('jobWorkers').value = job.workers;
    document.getElementById('apprenticeDays').value = job.apprenticeDays;
    document.getElementById('apprenticeHours').value = job.apprenticeHours;
    document.getElementById('apprenticeCount').value = job.apprenticeCount;
    document.getElementById('jobDiscountPercentage').value = job.discountPercentage || 0;
    
    // Update estimate fee button state
    const feeBtn = document.getElementById('waiveEstimateFeeBtn');
    if (job.waiveEstimateFee) {
        feeBtn.classList.add('active');
        feeBtn.innerHTML = '<i class="fas fa-check"></i> Estimate Fee Waived';
    } else {
        feeBtn.classList.remove('active');
        feeBtn.innerHTML = '<i class="fas fa-dollar-sign"></i> Waive $75 Estimate Fee';
    }
    
    // Update labor calculations
    updateCurrentJobDetails();
    updateMaterialsList();
    updateJobFeesList(jobId);
    updateJobDiscountDisplay(jobId);
    updateEstimatePreview();
    updateJobTabs();
}


function updateJobTabs() {
    const jobTabsContainer = document.getElementById('jobTabsContainer');
    jobTabsContainer.innerHTML = '';
    
    currentEstimate.jobs.forEach((job, index) => {
        const tab = document.createElement('div');
        tab.className = `job-tab ${job.id === currentJobId ? 'active' : ''}`;
        tab.dataset.jobId = job.id;
        tab.innerHTML = `
            <span>${job.name || `Job ${index + 1}`}</span>
            ${currentEstimate.jobs.length > 1 ? `
            <button class="remove-job-btn"><i class="fas fa-times"></i></button>
            ` : ''}
        `;
        
        // Improved click handler
        tab.addEventListener('click', function(e) {
            if (!e.target.classList.contains('remove-job-btn') && 
                !e.target.closest('.remove-job-btn')) {
                const clickedJobId = parseInt(this.dataset.jobId);
                
                // Save current job details before switching
                const currentJob = currentEstimate.jobs.find(j => j.id === currentJobId);
                if (currentJob) {
                    currentJob.name = document.getElementById('jobDescription').value || `Job ${currentEstimate.jobs.findIndex(j => j.id === currentJobId) + 1}`;
                    currentJob.days = parseInt(document.getElementById('jobDays').value) || 0;
                    currentJob.hours = parseInt(document.getElementById('jobHours').value) || 0;
                    currentJob.workers = parseInt(document.getElementById('jobWorkers').value) || 1;
                    currentJob.apprenticeDays = parseInt(document.getElementById('apprenticeDays').value) || 0;
                    currentJob.apprenticeHours = parseInt(document.getElementById('apprenticeHours').value) || 0;
                    currentJob.apprenticeCount = parseInt(document.getElementById('apprenticeCount').value) || 0;
                }
                
                showJobDetails(clickedJobId);
            }
        });
        
        // Add click handler for remove button if it exists
        if (currentEstimate.jobs.length > 1) {
            const removeBtn = tab.querySelector('.remove-job-btn');
            removeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                removeJob(job.id);
            });
        }
        
        jobTabsContainer.appendChild(tab);
    });
    
    // Add "+" tab for new jobs
    const addTab = document.createElement('div');
    addTab.className = 'job-tab add-job-tab';
    addTab.innerHTML = '<i class="fas fa-plus"></i>';
    addTab.addEventListener('click', addNewJob);
    jobTabsContainer.appendChild(addTab);
}
// Update job details when typing

document.getElementById('jobDescription')?.addEventListener('input', function(e) {
    const job = currentEstimate.jobs.find(j => j.id === currentJobId);
    if (job) {
        job.name = e.target.value || `Job ${currentEstimate.jobs.findIndex(j => j.id === currentJobId) + 1}`;
        updateJobTabs();
        updateEstimatePreview();
    }
});

function editEstimateFromCard(estimateId) {
    db.collection("estimates").doc(estimateId).get()
        .then(doc => {
            if (doc.exists) {
                const estimateData = doc.data();
                currentEstimate = {
                    id: doc.id,
                    ...estimateData
                };
                
                // Populate all customer info fields
                document.getElementById('customerName').value = currentEstimate.customer.name || '';
                document.getElementById('customerEmail').value = currentEstimate.customer.email || '';
                document.getElementById('customerPhone').value = currentEstimate.customer.phone || '';
                document.getElementById('jobLocation').value = currentEstimate.customer.location || '';
                
                showNewEstimate();
                
                // Update job tabs and details for all jobs
                if (currentEstimate.jobs.length > 0) {
                    // Clear any existing jobs
                    currentEstimate.jobs = [...estimateData.jobs];
                    currentJobId = currentEstimate.jobs[0].id;
                    
                    // Update UI for all jobs
                    updateJobTabs();
                    showJobDetails(currentJobId);
                    
                    // Force update of all fields
                    const firstJob = currentEstimate.jobs[0];
                    if (firstJob) {
                        document.getElementById('jobDescription').value = firstJob.name || 'Job description required!';
                        document.getElementById('jobDays').value = firstJob.days || 0;
                        document.getElementById('jobHours').value = firstJob.hours || 0;
                        document.getElementById('jobWorkers').value = firstJob.workers || 1;
                        document.getElementById('apprenticeDays').value = firstJob.apprenticeDays || 0;
                        document.getElementById('apprenticeHours').value = firstJob.apprenticeHours || 0;
                        document.getElementById('apprenticeCount').value = firstJob.apprenticeCount || 0;
                        document.getElementById('jobDiscountPercentage').value = firstJob.discountPercentage || 0;
                        
                        // Update estimate fee button state
                        const feeBtn = document.getElementById('waiveEstimateFeeBtn');
                        if (firstJob.waiveEstimateFee) {
                            feeBtn.classList.add('active');
                            feeBtn.innerHTML = '<i class="fas fa-check"></i> Estimate Fee Waived';
                        } else {
                            feeBtn.classList.remove('active');
                            feeBtn.innerHTML = '<i class="fas fa-dollar-sign"></i> Waive $75 Estimate Fee';
                        }
                        
                        // Update materials and fees lists
                        updateMaterialsList();
                        updateJobFeesList(currentJobId);
                        updateJobDiscountDisplay(currentJobId);
                        updateCurrentJobDetails();
                    }
                }
                
                nextStep(2); // Skip to jobs step
            }
        });
}

function deleteEstimateFromCard(estimateId) {
    if (confirm('Are you sure you want to delete this estimate?')) {
        db.collection("estimates").doc(estimateId).delete()
            .then(() => {
                loadEstimates();
            });
    }
}

function exportEstimateFromCard(estimateId) {
    db.collection("estimates").doc(estimateId).get()
        .then(doc => {
            if (doc.exists) {
                exportEstimate(doc.data());
            }
        });
}

function removeJob(jobId) {
    if (currentEstimate.jobs.length <= 1) {
        alert("You must have at least one job");
        return;
    }
   
    const jobIndex = currentEstimate.jobs.findIndex(job => job.id === jobId);
    if (jobIndex === -1) return;
   
    currentEstimate.jobs.splice(jobIndex, 1);
   
    // Set currentJobId to the first remaining job
    if (currentEstimate.jobs.length > 0) {
        currentJobId = currentEstimate.jobs[0].id;
        showJobDetails(currentJobId);
    }
   
    updateEstimatePreview();
}


function updateMaterialsList() {
    const job = currentEstimate.jobs.find(j => j.id === currentJobId);
    if (!job) return;
   
    const materialsList = document.getElementById('materialsList');
   
    if (!job.materials || job.materials.length === 0) {
        materialsList.innerHTML = '<p class="no-materials">No materials added yet</p>';
        return;
    }
   
    materialsList.innerHTML = '';
    job.materials.forEach((mat, index) => {
        const item = document.createElement('div');
        item.className = 'material-item';
        item.innerHTML = `
            <span>${mat.name} (${mat.quantity} @ $${formatAccounting(mat.price)}) = $${formatAccounting(mat.total)}</span>
            <button onclick="removeMaterialFromJob(${index})"><i class="fas fa-times"></i></button>
        `;
        materialsList.appendChild(item);
    });
}


function addMaterialToJob() {
    const name = document.getElementById('materialName').value.trim();
    const price = parseFloat(document.getElementById('materialPrice').value);
    const qty = parseInt(document.getElementById('materialQty').value);
   
    if (!name || isNaN(price) || price <= 0 || isNaN(qty) || qty <= 0) {
        alert('Please enter valid material details');
        return;
    }
   
    const job = currentEstimate.jobs.find(j => j.id === currentJobId);
    if (!job) return;
   
    job.materials.push({
        name: name,
        price: price,
        quantity: qty,
        total: price * qty
    });
   
    // Clear form
    document.getElementById('materialName').value = '';
    document.getElementById('materialPrice').value = '';
    document.getElementById('materialQty').value = '1';
   
    updateMaterialsList();
    updateEstimatePreview();
}


function removeMaterialFromJob(index) {
    const job = currentEstimate.jobs.find(j => j.id === currentJobId);
    if (!job) return;
   
    job.materials.splice(index, 1);
    updateMaterialsList();
    updateEstimatePreview();
}


function addFeeToJob(jobId) {
    const name = document.getElementById('jobFeeName').value.trim();
    const amount = parseFloat(document.getElementById('jobFeeAmount').value);
   
    if (!name || isNaN(amount) || amount <= 0) {
        alert('Please enter valid fee details');
        return;
    }
   
    const job = currentEstimate.jobs.find(j => j.id === jobId);
    if (!job) return;
   
    if (!job.fees) job.fees = [];
    job.fees.push({ name, amount });
   
    // Clear inputs
    document.getElementById('jobFeeName').value = '';
    document.getElementById('jobFeeAmount').value = '';
   
    updateJobFeesList(jobId);
    updateEstimatePreview();
}


function updateJobFeesList(jobId) {
    const job = currentEstimate.jobs.find(j => j.id === jobId);
    const feesList = document.getElementById('jobFeesList');
   
    if (!job || !job.fees || job.fees.length === 0) {
        feesList.innerHTML = '<p class="no-fees">No fees added yet</p>';
        return;
    }
   
    feesList.innerHTML = '';
    job.fees.forEach((fee, index) => {
        const item = document.createElement('div');
        item.className = 'fee-item';
        item.innerHTML = `
            <span>${fee.name}: $${formatAccounting(fee.amount)}</span>
            <button onclick="removeFeeFromJob(${jobId}, ${index})"><i class="fas fa-times"></i></button>
        `;
        feesList.appendChild(item);
    });
}


function removeFeeFromJob(jobId, index) {
    const job = currentEstimate.jobs.find(j => j.id === jobId);
    if (!job || !job.fees) return;
   
    job.fees.splice(index, 1);
    updateJobFeesList(jobId);
    updateEstimatePreview();
}


function updateJobDiscount(jobId, discountPercentage) {
    const job = currentEstimate.jobs.find(j => j.id === jobId);
    if (!job) return;
   
    job.discountPercentage = parseFloat(discountPercentage) || 0;
    updateJobDiscountDisplay(jobId);
    updateEstimatePreview();
}


function updateJobDiscountDisplay(jobId) {
    const job = currentEstimate.jobs.find(j => j.id === jobId);
    const discountDisplay = document.getElementById('jobDiscountDisplay');
   
    if (!job) return;
   
    if (job.discountPercentage > 0) {
        discountDisplay.textContent = `${job.discountPercentage}% discount applied`;
        discountDisplay.style.color = '#28a745';
    } else {
        discountDisplay.textContent = 'No discount applied';
        discountDisplay.style.color = '';
    }
}


function toggleEstimateFee() {
    const job = currentEstimate.jobs.find(j => j.id === currentJobId);
    if (!job) return;
   
    job.waiveEstimateFee = !job.waiveEstimateFee;
    const btn = document.getElementById('waiveEstimateFeeBtn');
   
    if (job.waiveEstimateFee) {
        btn.classList.add('active');
        btn.innerHTML = '<i class="fas fa-check"></i> Estimate Fee Waived';
    } else {
        btn.classList.remove('active');
        btn.innerHTML = '<i class="fas fa-dollar-sign"></i> Waive $75 Estimate Fee';
    }
   
    updateEstimatePreview();
}


function nextStep(step) {
    // Validate current step before proceeding
    if (step === 2 && !validateCustomerInfo()) return;
   
    // Update job details before checking
if (step === 3) {
    // Validate job descriptions
    for (const job of currentEstimate.jobs) {
        const description = job.name.trim();
        if (!description || description === "New Job" || description === "Describe the work (required)") {
            alert('Please enter a valid description for all jobs');
            // Find and focus on the job tab with empty description
            const jobIndex = currentEstimate.jobs.findIndex(j => j.id === job.id);
            if (jobIndex >= 0) {
                showJobDetails(job.id);
                document.getElementById('jobDescription').focus();
            }
            return;
        }
    }
    
    if (currentEstimate.jobs.length === 0) {
        alert('Please add at least one job');
        return;
    }
}
   
    // Hide current step
    document.querySelector('.estimate-step.active-step').classList.remove('active-step');
   
    // Show next step
    document.getElementById(`${getStepName(step)}Step`).classList.add('active-step');
   
    // Update progress indicator
    document.querySelector('.progress-step.active').classList.remove('active');
    document.querySelector(`.progress-step[data-step="${step}"]`).classList.add('active');
   
    // If moving to review step, update preview
    if (step === 3) {
        updateEstimatePreview();
    }
}


function prevStep(step) {
    // Hide current step
    document.querySelector('.estimate-step.active-step').classList.remove('active-step');
   
    // Show previous step
    document.getElementById(`${getStepName(step)}Step`).classList.add('active-step');
   
    // Update progress indicator
    document.querySelector('.progress-step.active').classList.remove('active');
    document.querySelector(`.progress-step[data-step="${step}"]`).classList.add('active');
}


function getStepName(step) {
    switch(step) {
        case 1: return 'customerInfo';
        case 2: return 'jobs';
        case 3: return 'review';
        default: return '';
    }
}


function validateCustomerInfo() {
    if (!document.getElementById('customerInfoForm').checkValidity()) {
        alert('Please fill out all required customer information fields');
        return false;
    }
   
    // Save customer info to current estimate
    currentEstimate.customer = {
        name: document.getElementById('customerName').value,
        email: document.getElementById('customerEmail').value,
        phone: document.getElementById('customerPhone').value,
        location: document.getElementById('jobLocation').value
    };
   
    return true;
}


function updateEstimatePreview() {
    let laborTotal = 0;
    let apprenticeLaborTotal = 0;
    let materialsTotal = 0;
    let feesTotal = 0;
    let discountTotal = 0;
    let estimateFeeTotal = 0;
    
    const jobsHTML = currentEstimate.jobs.map(job => {
        const jobMaterialsTotal = job.materials.reduce((sum, mat) => sum + mat.total, 0);
        const jobFeesTotal = job.fees.reduce((sum, fee) => sum + fee.amount, 0);
        const jobSubtotal = job.labor + (job.apprenticeLabor || 0) + jobMaterialsTotal + jobFeesTotal;
        const jobDiscount = jobSubtotal * (job.discountPercentage / 100);
        const jobEstimateFee = job.waiveEstimateFee ? -75 : 75;
        const jobTotal = jobSubtotal - jobDiscount + jobEstimateFee;
        
        // Accumulate totals
        laborTotal += job.labor || 0;
        apprenticeLaborTotal += job.apprenticeLabor || 0;
        materialsTotal += jobMaterialsTotal;
        feesTotal += jobFeesTotal;
        discountTotal += jobDiscount;
        estimateFeeTotal += jobEstimateFee;

        return `
    <div class="estimate-job-section">
        <h4>${job.name || 'New Job'} (${job.days}d ${job.hours}h, ${job.workers} worker${job.workers > 1 ? 's' : ''}${job.apprenticeCount > 0 ? `, ${job.apprenticeCount} apprentice${job.apprenticeCount > 1 ? 's' : ''}` : ''})</h4>
        <div class="estimate-row">
            <span>Skilled Labor (${job.workers} worker${job.workers > 1 ? 's' : ''}):</span>
            <span>$${formatAccounting(job.labor)}</span>
        </div>
        ${job.apprenticeCount > 0 ? `
        <div class="estimate-row">
            <span>Apprentice Labor (${job.apprenticeCount} apprentice${job.apprenticeCount > 1 ? 's' : ''}):</span>
            <span>$${formatAccounting(job.apprenticeLabor || 0)}</span>
        </div>
        ` : ''}
                ${job.materials.map(mat => `
                <div class="estimate-row">
                    <span>${mat.name} (${mat.quantity} @ $${formatAccounting(mat.price)})</span>
                    <span>$${formatAccounting(mat.total)}</span>
                </div>
                `).join('')}
                ${job.fees.map(fee => `
                <div class="estimate-row">
                    <span>${fee.name}</span>
                    <span>$${formatAccounting(fee.amount)}</span>
                </div>
                `).join('')}
                ${job.discountPercentage > 0 ? `
                <div class="estimate-row">
                    <span>Discount (${job.discountPercentage}%)</span>
                    <span>-$${formatAccounting(jobDiscount)}</span>
                </div>
                ` : ''}
                <div class="estimate-row">
                    <span>Estimate Fee:</span>
                    <span>${job.waiveEstimateFee ? 'Waived (-$75.00)' : '$75.00'}</span>
                </div>
                <div class="estimate-job-total">
                    <span>Job Total:</span>
                    <span>$${formatAccounting(jobTotal)}</span>
                </div>
            </div>
        `;
    }).join('');
    
    const grandTotal = laborTotal + apprenticeLaborTotal + materialsTotal + feesTotal - discountTotal + estimateFeeTotal;
    currentEstimate.total = grandTotal;

    const html = `
        <div class="estimate-section">
            <h3>Customer Information</h3>
            <div class="estimate-row">
                <span>Name:</span>
                <span>${currentEstimate.customer.name || 'Not specified'}</span>
            </div>
            <div class="estimate-row">
                <span>Email:</span>
                <span>${currentEstimate.customer.email || 'Not specified'}</span>
            </div>
            <div class="estimate-row">
                <span>Phone:</span>
                <span>${currentEstimate.customer.phone || 'Not specified'}</span>
            </div>
            <div class="estimate-row">
                <span>Location:</span>
                <span>${currentEstimate.customer.location || 'Not specified'}</span>
            </div>
        </div>
       
        <div class="estimate-section">
            <h3>Jobs Breakdown</h3>
            ${jobsHTML}
        </div>
        
        <div class="estimate-section">
            <div class="estimate-row estimate-total-row">
                <span>Total Labor:</span>
                <span>$${formatAccounting(laborTotal)}</span>
            </div>
            ${apprenticeLaborTotal > 0 ? `
            <div class="estimate-row estimate-total-row">
                <span>Total Apprentice Labor:</span>
                <span>$${formatAccounting(apprenticeLaborTotal)}</span>
            </div>
            ` : ''}
            <div class="estimate-row estimate-total-row">
                <span>Total Materials:</span>
                <span>$${formatAccounting(materialsTotal)}</span>
            </div>
            <div class="estimate-row estimate-total-row">
                <span>Total Fees:</span>
                <span>$${formatAccounting(feesTotal)}</span>
            </div>
            ${discountTotal > 0 ? `
            <div class="estimate-row estimate-total-row">
                <span>Total Discounts:</span>
                <span>-$${formatAccounting(discountTotal)}</span>
            </div>
            ` : ''}
            <div class="estimate-row estimate-total-row">
                <span>Total Estimate Fees:</span>
                <span>$${formatAccounting(estimateFeeTotal)}</span>
            </div>
            <div class="estimate-row estimate-grand-total">
                <span>Grand Total:</span>
                <span>$${formatAccounting(grandTotal)}</span>
            </div>
        </div>
    `;
    
    const estimatePreview = document.getElementById('estimatePreview');
    if (estimatePreview) {
        estimatePreview.innerHTML = html;
    }
}


function saveEstimate() {
    // First update all job details before saving
    currentEstimate.jobs.forEach(job => {
        if (job.id === currentJobId) {
            // Update current job from form fields
            job.name = document.getElementById('jobDescription').value || `Job ${currentEstimate.jobs.findIndex(j => j.id === currentJobId) + 1}`;
            job.days = parseInt(document.getElementById('jobDays').value) || 0;
            job.hours = parseInt(document.getElementById('jobHours').value) || 0;
            job.workers = parseInt(document.getElementById('jobWorkers').value) || 1;
            job.apprenticeDays = parseInt(document.getElementById('apprenticeDays').value) || 0;
            job.apprenticeHours = parseInt(document.getElementById('apprenticeHours').value) || 0;
            job.apprenticeCount = parseInt(document.getElementById('apprenticeCount').value) || 0;
            job.discountPercentage = parseFloat(document.getElementById('jobDiscountPercentage').value) || 0;
            
            const feeBtn = document.getElementById('waiveEstimateFeeBtn');
            job.waiveEstimateFee = feeBtn.classList.contains('active');
            
            // Recalculate labor costs
            const laborCosts = calculateLaborCost(
                job.days, 
                job.hours, 
                job.workers,
                job.apprenticeDays,
                job.apprenticeHours,
                job.apprenticeCount
            );
            
            job.labor = laborCosts.workerLabor;
            job.apprenticeLabor = laborCosts.apprenticeLabor;
        }
    });

    if (!currentEstimate.customer.name || currentEstimate.jobs.length === 0) {
        alert('Please complete all required fields and add at least one job');
        return;
    }

    // Ensure customer info is saved
    currentEstimate.customer = {
        name: document.getElementById('customerName').value,
        email: document.getElementById('customerEmail').value,
        phone: document.getElementById('customerPhone').value,
        location: document.getElementById('jobLocation').value
    };

    // Add timestamp
    const now = new Date().toISOString();
    currentEstimate.updatedAt = now;
    
    if (!currentEstimate.id) {
        currentEstimate.createdAt = now;
    }

    const estimateRef = currentEstimate.id ? 
        db.collection("estimates").doc(currentEstimate.id) :
        db.collection("estimates").doc();

    estimateRef.set(currentEstimate)
        .then(() => {
            alert('Estimate saved successfully!');
            showDashboard();
            loadEstimates();
        })
        .catch(error => {
            console.error('Error saving estimate:', error);
            alert('Error saving estimate. Please try again.');
        });
}


function loadEstimates() {
    db.collection("estimates")
        .orderBy("createdAt", "desc")
        .get()
        .then(querySnapshot => {
            const estimates = [];
            querySnapshot.forEach(doc => {
                const estimateData = doc.data();
                estimates.push({
                    id: doc.id,
                    ...estimateData
                });
            });
            displayEstimates(estimates);
        })
        .catch(error => {
            console.error('Error loading estimates:', error);
        });
}


function displayEstimates(estimates) {
    estimatesList.innerHTML = '';
   
    // Calculate totals
    const totalCount = estimates.length;
    const totalAmount = estimates.reduce((sum, estimate) => sum + estimate.total, 0);
   
    // Update counter display
    document.getElementById('estimatesCount').textContent = totalCount;
    document.getElementById('estimatesTotal').textContent = formatAccounting(totalAmount);
   
    if (estimates.length === 0) {
        estimatesList.innerHTML = '<p class="no-estimates">No estimates found</p>';
        return;
    }
   
    estimates.forEach(estimate => {
        const date = new Date(estimate.createdAt);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
       
        const estimateCard = document.createElement('div');
        estimateCard.className = 'estimate-card';
        estimateCard.innerHTML = `
           <div class="estimate-card">
                <div class="card-actions">
                    <button class="edit" onclick="event.stopPropagation(); editEstimateFromCard('${estimate.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete" onclick="event.stopPropagation(); deleteEstimateFromCard('${estimate.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="export" onclick="event.stopPropagation(); exportEstimateFromCard('${estimate.id}')">
                        <i class="fas fa-file-export"></i>
                    </button>
                </div>
                <p class="estimate-customer"><i class="fas fa-user"></i> ${estimate.customer.name}</p>
                <p class="estimate-location"><i class="fas fa-map-marker-alt"></i> ${estimate.customer.location}</p>
                <p class="estimate-jobs"><i class="fas fa-tools"></i> ${estimate.jobs.map(job => job.name).join(', ')}</p>
                <p class="estimate-total">$${formatAccounting(estimate.total)}</p>
            </div>
        `;
       
        estimateCard.addEventListener('click', () => openEstimateModal(estimate));
        estimatesList.appendChild(estimateCard);
    });
}


function openEstimateModal(estimate) {
    const date = new Date(estimate.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
   
    modalContent.dataset.estimateId = estimate.id;
    modalContent.dataset.estimateData = JSON.stringify(estimate);


    // Calculate totals
    let laborTotal = 0;
    let materialsTotal = 0;
    let feesTotal = 0;
    let discountTotal = 0;
    let estimateFeeTotal = 0;
   
    estimate.jobs.forEach(job => {
        laborTotal += job.labor || 0;
        materialsTotal += job.materials.reduce((sum, mat) => sum + mat.total, 0);
        feesTotal += job.fees.reduce((sum, fee) => sum + fee.amount, 0);
        discountTotal += (job.labor + materialsTotal + feesTotal) * (job.discountPercentage / 100);
        estimateFeeTotal += job.waiveEstimateFee ? -75 : 75;
    });
   
    const total = laborTotal + materialsTotal + feesTotal - discountTotal + estimateFeeTotal;


    let html = `
        <div class="estimate-section">
            <h2>Estimate for ${estimate.customer.name}</h2>
            <p>Created: ${formattedDate}</p>
        </div>
       
        <div class="estimate-section">
            <h3>Customer Information</h3>
            <div class="estimate-row">
                <span>Name:</span>
                <span>${estimate.customer.name}</span>
            </div>
            <div class="estimate-row">
                <span>Email:</span>
                <span>${estimate.customer.email}</span>
            </div>
            <div class="estimate-row">
                <span>Phone:</span>
                <span>${estimate.customer.phone}</span>
            </div>
            <div class="estimate-row">
                <span>Job Location:</span>
                <span>${estimate.customer.location}</span>
            </div>
        </div>
       
        <div class="estimate-section">
            <h3>Jobs</h3>
            ${estimate.jobs.map(job => {
                const jobMaterialsTotal = job.materials.reduce((sum, mat) => sum + mat.total, 0);
                const jobFeesTotal = job.fees.reduce((sum, fee) => sum + fee.amount, 0);
                const jobSubtotal = job.labor + jobMaterialsTotal + jobFeesTotal;
                const jobDiscount = jobSubtotal * (job.discountPercentage / 100);
                const jobEstimateFee = job.waiveEstimateFee ? -75 : 75;
                const jobTotal = jobSubtotal - jobDiscount + jobEstimateFee;
               
                return `
                    <div class="estimate-job-section">
                        <h4>${job.name} (${job.days} days, ${job.workers} worker${job.workers > 1 ? 's' : ''}${job.hasApprentice ? ' (includes apprentice)' : ''})</h4>
                        <div class="estimate-row">
                            <span>Labor:</span>
                            <span>$${formatAccounting(job.labor)}</span>
                        </div>
                        ${job.materials.map(mat => `
                        <div class="estimate-row">
                            <span>${mat.name} (${mat.quantity} @ $${formatAccounting(mat.price)})</span>
                            <span>$${formatAccounting(mat.total)}</span>
                        </div>
                        `).join('')}
                        ${job.fees.map(fee => `
                        <div class="estimate-row">
                            <span>${fee.name}</span>
                            <span>$${formatAccounting(fee.amount)}</span>
                        </div>
                        `).join('')}
                        ${job.discountPercentage > 0 ? `
                        <div class="estimate-row">
                            <span>Discount (${job.discountPercentage}%)</span>
                            <span>-$${formatAccounting(jobDiscount)}</span>
                        </div>
                        ` : ''}
                        <div class="estimate-row">
                            <span>Estimate Fee:</span>
                            <span>${job.waiveEstimateFee ? 'Waived (-$75.00)' : '$75.00'}</span>
                        </div>
                        <div class="estimate-job-total">
                            <span>Job Total:</span>
                            <span>$${formatAccounting(jobTotal)}</span>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
       
        <div class="estimate-section">
            <div class="estimate-row estimate-total-row">
                <span>Total Labor:</span>
                <span>$${formatAccounting(laborTotal)}</span>
            </div>
            <div class="estimate-row estimate-total-row">
                <span>Total Materials:</span>
                <span>$${formatAccounting(materialsTotal)}</span>
            </div>
            <div class="estimate-row estimate-total-row">
                <span>Total Fees:</span>
                <span>$${formatAccounting(feesTotal)}</span>
            </div>
            <div class="estimate-row estimate-total-row">
                <span>Total Discounts:</span>
                <span>-$${formatAccounting(discountTotal)}</span>
            </div>
            <div class="estimate-row estimate-total-row">
                <span>Total Estimate Fees:</span>
                <span>$${formatAccounting(estimateFeeTotal)}</span>
            </div>
            <div class="estimate-row estimate-grand-total">
                <span>Grand Total:</span>
                <span>$${formatAccounting(total)}</span>
            </div>
        </div>
    `;
   
    modalContent.innerHTML = html;
    estimateModal.style.display = 'block';
}


function closeEstimateModal() {
    estimateModal.style.display = 'none';
}


function editEstimate() {
    const estimateId = modalContent.dataset.estimateId;
    const estimateData = JSON.parse(modalContent.dataset.estimateData);
   
    currentEstimate = {
        id: estimateId,
        ...estimateData
    };
   
    // Set currentJobId to the first job
    if (currentEstimate.jobs.length > 0) {
        currentJobId = currentEstimate.jobs[0].id;
    }
   
    showNewEstimate();
    showJobDetails(currentJobId);
    nextStep(2); // Skip to jobs step
   
    // Close the modal
    closeEstimateModal();
}


function deleteEstimate() {
    if (confirm('Are you sure you want to delete this estimate?')) {
        const estimateId = modalContent.dataset.estimateId;
       
        db.collection("estimates").doc(estimateId).delete()
            .then(() => {
                alert('Estimate deleted successfully');
                closeEstimateModal();
                loadEstimates();
            })
            .catch(error => {
                console.error('Error deleting estimate:', error);
                alert('Error deleting estimate');
            });
    }
}


function exportEstimate(estimate) {
    const date = new Date(estimate.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const validUntilDate = new Date(date.setDate(date.getDate() + 30)).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Calculate totals
    let laborTotal = 0;
    let apprenticeLaborTotal = 0;
    let materialsTotal = 0;
    let feesTotal = 0;
    let discountTotal = 0;
    let estimateFeeTotal = 0;
    
    estimate.jobs.forEach(job => {
        laborTotal += job.labor || 0;
        apprenticeLaborTotal += job.apprenticeLabor || 0;
        materialsTotal += job.materials.reduce((sum, mat) => sum + mat.total, 0);
        feesTotal += job.fees.reduce((sum, fee) => sum + fee.amount, 0);
        discountTotal += (job.labor + (job.apprenticeLabor || 0) + materialsTotal + feesTotal) * (job.discountPercentage / 100);
        estimateFeeTotal += job.waiveEstimateFee ? -75 : 75;
    });
    
    const total = laborTotal + apprenticeLaborTotal + materialsTotal + feesTotal - discountTotal + estimateFeeTotal;

    // Payment terms
    const paymentTerms = {
        depositRequired: true,
        depositPercentage: 50,
        progressPayments: true,
        finalPaymentDue: "upon completion",
        paymentMethods: ["Check", "Credit Card", "Bank Transfer"],
        lateFee: "1.5% monthly (18% APR) on balances over 30 days",
        changeOrders: "Any changes to scope require written approval"
    };

    // Warranty information
    const warranty = {
        labor: "12 months on all workmanship",
        materials: "Manufacturer's warranty applies to all materials",
        limitations: "Does not cover damage from misuse, neglect, or acts of nature"
    };

    // Insurance information
    const insurance = {
        generalLiability: "$2,000,000 coverage",
        workersComp: "Fully insured",
        additionalInsured: "Available upon request with 48 hours notice"
    };

    let html = `
<!DOCTYPE html>
<html>
<head>
    <title>Estimate for ${estimate.customer.name}</title>
    <style>
        @page {
            size: letter;
            margin: 1in;
        }
        body {
            font-family: 'Arial', sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #D64045;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #D64045;
            font-size: 24pt;
            margin-bottom: 5px;
        }
        .header h2 {
            color: #333;
            font-size: 14pt;
            margin-top: 0;
            margin-bottom: 10px;
        }
        .header p {
            margin: 5px 0;
            color: #666;
            font-size: 11pt;
        }
        .client-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .info-block {
            width: 48%;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 5px;
        }
        .info-block h3 {
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            color: #D64045;
            font-size: 12pt;
            margin-top: 0;
        }
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        .section-title {
            color: #D64045;
            font-size: 14pt;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 11pt;
        }
        th {
            background-color: #D64045;
            color: white;
            text-align: left;
            padding: 8px;
            font-weight: bold;
        }
        td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
            vertical-align: top;
        }
        .total-row {
            font-weight: bold;
            background-color: #f8f9fa;
        }
        .highlight {
            background-color: #f0f8ff;
        }
        .grand-total {
            font-weight: bold;
            background-color: #D64045;
            color: white;
        }
        .signature-section {
            margin-top: 50px;
            page-break-inside: avoid;
        }
        .signature-line {
            border-top: 1px solid #333;
            width: 300px;
            margin-top: 30px;
            padding-top: 5px;
        }
        .terms {
            font-size: 10pt;
            margin-top: 30px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 9pt;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .page-break {
            page-break-after: always;
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        .logo img {
            max-width: 150px;
            height: auto;
        }
        .payment-terms, .warranty-info, .insurance-info {
            margin-top: 20px;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 5px;
            font-size: 10pt;
        }
        .payment-terms h3, .warranty-info h3, .insurance-info h3 {
            color: #D64045;
            margin-top: 0;
            font-size: 12pt;
        }
        ul {
            margin-bottom: 0;
            padding-left: 20px;
        }
        li {
            margin-bottom: 5px;
        }
        .project-summary {
            margin-bottom: 20px;
            font-size: 11pt;
        }
        .note {
            font-style: italic;
            color: #666;
            font-size: 10pt;
        }
        .material-markup {
            font-size: 9pt;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="logo">
        <img src="${base64Image}" alt="Ace Handyman Services Logo">
    </div>
    
    <div class="header">
        <h1>ACE HANDYMAN SERVICES</h1>
        <h2>Detailed Estimate</h2>
        <p>207 N Harlem Ave. Oak Park, IL 60302 | (708) 773-0218</p>
        <p>Estimate Date: ${formattedDate} | Valid Until: ${validUntilDate}</p>
    </div>
    
    <div class="client-info">
        <div class="info-block">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${estimate.customer.name}</p>
            <p><strong>Address:</strong> ${estimate.customer.location}</p>
            <p><strong>Email:</strong> ${estimate.customer.email}</p>
            <p><strong>Phone:</strong> ${estimate.customer.phone}</p>
        </div>
        <div class="info-block">
            <h3>Project Summary</h3>
            <p><strong>Project ID:</strong> ${estimate.id || 'N/A'}</p>
            <p><strong>Total Jobs:</strong> ${estimate.jobs.length}</p>
            <p><strong>Total Estimate:</strong> $${formatAccounting(total)}</p>
            <p><strong>Priority:</strong> Standard</p>
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">Project Overview</div>
        <div class="project-summary">
            <p>This estimate outlines the proposed work to be completed at ${estimate.customer.location}. The scope includes all labor, materials, and incidentals required to complete the project to industry standards.</p>
            <p class="note">Note: This estimate is based on our initial assessment. Final costs may vary if project scope changes or unforeseen conditions are encountered.</p>
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">Detailed Scope of Work</div>
        
        ${estimate.jobs.map((job, index) => {
            const jobMaterialsTotal = job.materials.reduce((sum, mat) => sum + mat.total, 0);
            const jobFeesTotal = job.fees.reduce((sum, fee) => sum + fee.amount, 0);
            const jobSubtotal = job.labor + (job.apprenticeLabor || 0) + jobMaterialsTotal + jobFeesTotal;
            const jobDiscount = jobSubtotal * (job.discountPercentage / 100);
            const jobEstimateFee = job.waiveEstimateFee ? -75 : 75;
            const jobTotal = jobSubtotal - jobDiscount + jobEstimateFee;
            
            return `
                <h4>Job ${index + 1}: ${job.name}</h4>
                <p><strong>Work Description:</strong> ${job.name}</p>
                <p><strong>Duration:</strong> ${job.days} days (${job.hours} hours) with ${job.workers} skilled worker${job.workers > 1 ? 's' : ''} 
                ${job.apprenticeCount > 0 ? `and ${job.apprenticeCount} apprentice${job.apprenticeCount > 1 ? 's' : ''}` : ''}</p>
                
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Description</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Skilled Labor -->
                        <tr>
                            <td>1.1</td>
                            <td>Skilled Labor (${job.workers} worker${job.workers > 1 ? 's' : ''})</td>
                            <td>${job.days} days</td>
                            <td>$${formatAccounting(job.labor/job.days)}/day</td>
                            <td>$${formatAccounting(job.labor)}</td>
                        </tr>
                        
                        <!-- Apprentice Labor -->
                        ${job.apprenticeCount > 0 ? `
                        <tr>
                            <td>1.2</td>
                            <td>Apprentice Labor (${job.apprenticeCount} apprentice${job.apprenticeCount > 1 ? 's' : ''})</td>
                            <td>${job.apprenticeDays} days</td>
                            <td>$${formatAccounting(job.apprenticeLabor/job.apprenticeDays)}/day</td>
                            <td>$${formatAccounting(job.apprenticeLabor)}</td>
                        </tr>
                        ` : ''}
                        
                        <!-- Materials -->
                        ${job.materials.map((mat, matIndex) => `
                        <tr>
                            <td>2.${matIndex + 1}</td>
                            <td>${mat.name} <span class="material-markup">(includes 50% markup)</span></td>
                            <td>${mat.quantity}</td>
                            <td>$${formatAccounting(mat.price)}</td>
                            <td>$${formatAccounting(mat.total)}</td>
                        </tr>
                        `).join('')}
                        
                        <!-- Fees -->
                        ${job.fees.map((fee, feeIndex) => `
                        <tr>
                            <td>3.${feeIndex + 1}</td>
                            <td>${fee.name}</td>
                            <td>1</td>
                            <td>$${formatAccounting(fee.amount)}</td>
                            <td>$${formatAccounting(fee.amount)}</td>
                        </tr>
                        `).join('')}
                        
                        <!-- Estimate Fee -->
                        <tr>
                            <td>4.1</td>
                            <td>Estimate Fee</td>
                            <td>1</td>
                            <td>${job.waiveEstimateFee ? '($75.00)' : '$75.00'}</td>
                            <td>${job.waiveEstimateFee ? '($75.00)' : '$75.00'}</td>
                        </tr>
                        
                        <!-- Subtotal -->
                        <tr class="total-row">
                            <td colspan="4" style="text-align: right;">Subtotal:</td>
                            <td>$${formatAccounting(jobSubtotal)}</td>
                        </tr>
                        
                        <!-- Discount -->
                        ${job.discountPercentage > 0 ? `
                        <tr>
                            <td colspan="4" style="text-align: right;">Discount (${job.discountPercentage}%):</td>
                            <td>-$${formatAccounting(jobDiscount)}</td>
                        </tr>
                        ` : ''}
                        
                        <!-- Job Total -->
                        <tr class="highlight">
                            <td colspan="4" style="text-align: right;"><strong>Job Total:</strong></td>
                            <td><strong>$${formatAccounting(jobTotal)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            `;
        }).join('')}
    </div>
    
    <div class="page-break"></div>
    
    <div class="section">
        <div class="section-title">Summary of Costs</div>
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Total Skilled Labor</td>
                    <td>$${formatAccounting(laborTotal)}</td>
                </tr>
                ${apprenticeLaborTotal > 0 ? `
                <tr>
                    <td>Total Apprentice Labor</td>
                    <td>$${formatAccounting(apprenticeLaborTotal)}</td>
                </tr>
                ` : ''}
                <tr>
                    <td>Total Materials</td>
                    <td>$${formatAccounting(materialsTotal)}</td>
                </tr>
                ${feesTotal > 0 ? `
                <tr>
                    <td>Total Fees</td>
                    <td>$${formatAccounting(feesTotal)}</td>
                </tr>
                ` : ''}
                <tr>
                    <td>Subtotal</td>
                    <td>$${formatAccounting(laborTotal + apprenticeLaborTotal + materialsTotal + feesTotal)}</td>
                </tr>
                ${discountTotal > 0 ? `
                <tr>
                    <td>Total Discounts</td>
                    <td>-$${formatAccounting(discountTotal)}</td>
                </tr>
                ` : ''}
                <tr>
                    <td>Estimate Fee</td>
                    <td>$${formatAccounting(estimateFeeTotal)}</td>
                </tr>
                <tr class="grand-total">
                    <td><strong>GRAND TOTAL</strong></td>
                    <td><strong>$${formatAccounting(total)}</strong></td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div class="payment-terms">
        <h3>Payment Terms & Schedule</h3>
        <ul>
            <li><strong>Deposit:</strong> ${paymentTerms.depositPercentage}% deposit ($${formatAccounting(total * paymentTerms.depositPercentage/100)}) required to secure start date</li>
            <li><strong>Progress Payments:</strong> ${paymentTerms.progressPayments ? 'Due at agreed milestones' : 'Not applicable'}</li>
            <li><strong>Final Payment:</strong> Due ${paymentTerms.finalPaymentDue} ($${formatAccounting(total * (100-paymentTerms.depositPercentage)/100)})</li>
            <li><strong>Accepted Payment Methods:</strong> ${paymentTerms.paymentMethods.join(", ")}</li>
            <li><strong>Late Fees:</strong> ${paymentTerms.lateFee}</li>
            <li><strong>Change Orders:</strong> ${paymentTerms.changeOrders}</li>
        </ul>
    </div>
    
    <div class="warranty-info">
        <h3>Warranty Information</h3>
        <ul>
            <li><strong>Labor Warranty:</strong> ${warranty.labor}</li>
            <li><strong>Materials Warranty:</strong> ${warranty.materials}</li>
            <li><strong>Limitations:</strong> ${warranty.limitations}</li>
        </ul>
    </div>
    
    <div class="insurance-info">
        <h3>Insurance Information</h3>
        <ul>
            <li><strong>General Liability:</strong> ${insurance.generalLiability}</li>
            <li><strong>Workers Compensation:</strong> ${insurance.workersComp}</li>
            <li><strong>Additional Insured:</strong> ${insurance.additionalInsured}</li>
        </ul>
    </div>
    
    <div class="page-break"></div>
    
    <div class="section">
        <div class="section-title">Terms & Conditions</div>
        <div class="terms">
            <p><strong>1. Acceptance:</strong> This estimate is valid for 30 days from the date above. Work will commence upon receipt of signed agreement and deposit.</p>
            <p><strong>2. Pricing:</strong> Prices are based on current material costs and labor rates. Significant changes may require adjustment.</p>
            <p><strong>3. Change Orders:</strong> Any changes to the scope of work must be approved in writing and may affect timeline and budget.</p>
            <p><strong>4. Access:</strong> Client agrees to provide uninterrupted access to the work area during scheduled work hours.</p>
            <p><strong>5. Cleanup:</strong> Daily job site cleanup is included. Final cleanup will be completed upon project conclusion.</p>
            <p><strong>6. Permits:</strong> Client is responsible for obtaining all necessary permits unless otherwise agreed in writing.</p>
            <p><strong>7. Scheduling:</strong> While we make every effort to adhere to the proposed schedule, unforeseen circumstances may cause delays.</p>
            <p><strong>8. Termination:</strong> Either party may terminate this agreement with 7 days written notice.</p>
        </div>
    </div>
    
    <div class="signature-section">
        <h3>Acceptance of Estimate</h3>
        <p>By signing below, I acknowledge that I have reviewed and accept this estimate in its entirety, including all terms and conditions.</p>
        
        <div style="margin-top: 40px;">
            <p><strong>For Ace Handyman Services:</strong></p>
            <p>Samuel Cundari, Operations Manager</p>
            <div class="signature-line"></div>
            <p>Date: _________________________</p>
        </div>
        
        <div style="margin-top: 60px;">
            <p><strong>Client Acceptance:</strong></p>
            <p>${estimate.customer.name}</p>
            <div class="signature-line"></div>
            <p>Date: _________________________</p>
        </div>
    </div>
    
    <div class="footer">
        <p>Ace Handyman Services Oak Park River Forest | 207 N Harlem Ave, Oak Park, IL 60302</p>
        <p>Phone: (708) 773-0218 | Email: OakParkRiverForest@AceHandymanServices.com</p>
        <p>License #: 123456 | Insured and Bonded</p>
    </div>
</body>
</html>
`;

    // Create and download the Word document
    const blob = new Blob([html], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `AHS_Estimate_${estimate.customer.name.replace(/\s+/g, '_')}_${formattedDate.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function searchEstimates() {
    const searchTerm = searchInput.value.trim().toLowerCase();
   
    if (searchTerm === '') {
        loadEstimates();
        return;
    }
   
    db.collection("estimates")
        .orderBy("createdAt", "desc")
        .get()
        .then(querySnapshot => {
            const estimates = [];
            querySnapshot.forEach(doc => {
                const estimateData = doc.data();
                if (estimateData.customer.name.toLowerCase().includes(searchTerm)) {
                    estimates.push({
                        id: doc.id,
                        ...estimateData
                    });
                }
            });
            displayEstimates(estimates);
        })
        .catch(error => {
            console.error('Error searching estimates:', error);
        });
}

function filterByDate() {
    const month = document.getElementById('monthFilter').value;
    const year = document.getElementById('yearFilter').value;
    
    if (!month && !year) {
        loadEstimates();
        return;
    }
    
    db.collection("estimates")
        .orderBy("createdAt", "desc")
        .get()
        .then(querySnapshot => {
            const estimates = [];
            querySnapshot.forEach(doc => {
                const estimateData = doc.data();
                const date = new Date(estimateData.createdAt);
                const estimateMonth = date.getMonth() + 1; // Months are 0-indexed
                const estimateYear = date.getFullYear();
                
                if ((!month || estimateMonth == month) && (!year || estimateYear == year)) {
                    estimates.push({
                        id: doc.id,
                        ...estimateData
                    });
                }
            });
            displayEstimates(estimates);
        })
        .catch(error => {
            console.error('Error filtering estimates:', error);
        });
}

function cancelEstimate() {
    if (confirm('Are you sure you want to cancel this estimate? All unsaved changes will be lost.')) {
        showDashboard();
    }
}