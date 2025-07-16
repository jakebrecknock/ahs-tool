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
const PASSWORD = "AHS";
const passwordModal = document.getElementById('passwordModal');
const passwordInput = document.getElementById('passwordInput');
const passwordError = document.getElementById('passwordError');
const submitPassword = document.getElementById('submitPassword');
let currentJobId = 1;

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

// Estimate form elements
const customerInfoForm = document.getElementById('customerInfoForm');
const customerPhone = document.getElementById('customerPhone');
const jobDetailsContent = document.getElementById('jobDetailsContent');
const estimatePreview = document.getElementById('estimatePreview');
const saveEstimateBtn = document.getElementById('saveEstimateBtn');

// Current estimate data
let currentEstimate = {
    customer: {},
    jobs: [], // Array of job objects
    total: 0,
    waiveEstimateFee: false
};



// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    checkPassword();
    setupEventListeners();
    loadEstimates();
    initPhoneNumberFormatting();
    addNewJob(); // Start with one job by default
});

function setupEventListeners() {
    dashboardBtn.addEventListener('click', showDashboard);
    newEstimateBtn.addEventListener('click', showNewEstimate);
    saveChangesBtn.addEventListener('click', saveEstimateChanges);
    
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') searchEstimates();
    });
    searchBtn.addEventListener('click', searchEstimates);
    
    closeModal.addEventListener('click', closeEstimateModal);
    editEstimateBtn.addEventListener('click', editEstimate);
    deleteEstimateBtn.addEventListener('click', deleteEstimate);
    exportEstimateBtn.addEventListener('click', exportEstimateToWord);
    
    saveEstimateBtn.addEventListener('click', saveEstimate);
    document.getElementById('addMaterial').addEventListener('click', addMaterialToJob);
    document.getElementById('waiveEstimateFeeBtn').addEventListener('click', toggleEstimateFee);
    
    // Add these global functions for HTML onclick handlers
    window.nextStep = nextStep;
    window.prevStep = prevStep;
    window.cancelEstimate = cancelEstimate;
    window.addNewJob = addNewJob;
    window.removeJob = removeJob;
    window.addMaterialToJob = addMaterialToJob;
    window.removeMaterialFromJob = removeMaterialFromJob;
    window.toggleEstimateFee = toggleEstimateFee;
}

function checkPassword() {
    if (localStorage.getItem('authenticated')) {
        passwordModal.style.display = 'none';
        return;
    }

    passwordModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    function verifyPassword() {
        if (passwordInput.value === PASSWORD) {
            localStorage.setItem('authenticated', 'true');
            passwordModal.style.display = 'none';
            passwordError.style.display = 'none';
            document.body.style.overflow = '';
        } else {
            passwordError.style.display = 'block';
            passwordInput.value = '';
        }
    }

    submitPassword.addEventListener('click', verifyPassword);
    passwordInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') verifyPassword();
    });
}

function showDashboard() {
    dashboardView.classList.add('active-view');
    newEstimateView.classList.remove('active-view');
    dashboardBtn.classList.add('active');
    newEstimateBtn.classList.remove('active');
    loadEstimates();
}

function showNewEstimate() {
    dashboardView.classList.remove('active-view');
    newEstimateView.classList.add('active-view');
    dashboardBtn.classList.remove('active');
    newEstimateBtn.classList.add('active');
    resetEstimateForm();
}

function resetEstimateForm() {
    currentEstimate = {
        customer: {},
        jobs: [],
        total: 0,
        waiveEstimateFee: false
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
    customerInfoForm.reset();
    document.getElementById('discountPercentage').value = 0;
    document.getElementById('feesList').innerHTML = '';
    document.getElementById('waiveEstimateFeeBtn').classList.remove('active');
    document.getElementById('waiveEstimateFeeBtn').innerHTML = '<i class="fas fa-dollar-sign"></i> Waive $75 Estimate Fee';
}

function initPhoneNumberFormatting() {
    const phoneInput = document.getElementById('customerPhone');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        const input = e.target.value.replace(/\D/g, '').substring(0, 10);
        const areaCode = input.substring(0, 3);
        const middle = input.substring(3, 6);
        const last = input.substring(6, 10);
        
        if (input.length > 6) {
            e.target.value = `(${areaCode}) ${middle}-${last}`;
        } else if (input.length > 3) {
            e.target.value = `(${areaCode}) ${middle}`;
        } else if (input.length > 0) {
            e.target.value = `(${areaCode}`;
        }
    });
}

function addNewJob() {
    const newJob = {
        id: currentJobId++,
        name: "New Job " + (currentJobId - 1), // Changed from currentJobId to (currentJobId - 1)
        days: 1,
        labor: 0,
        materials: [],
        fees: [],
        discountPercentage: 0
    };
    currentEstimate.jobs.push(newJob);
    showJobDetails(newJob.id);
    updateJobTabs(); // Added this line
    updateEstimatePreview();
}

// Add functions to handle job-specific fees:
function addFeeToJob(jobId) {
    const feeName = document.getElementById(`job-${jobId}-feeName`).value.trim();
    const feeAmount = parseFloat(document.getElementById(`job-${jobId}-feeAmount`).value);
    
    if (!feeName || isNaN(feeAmount) || feeAmount <= 0) {
        alert('Please enter valid fee details');
        return;
    }
    
    const job = currentEstimate.jobs.find(j => j.id === jobId);
    if (!job) return;
    
    job.fees.push({
        name: feeName,
        amount: feeAmount
    });
    
    updateJobFeesList(jobId);
    updateEstimatePreview();
}

function updateJobFeesList(jobId) {
    const job = currentEstimate.jobs.find(j => j.id === jobId);
    const feesList = document.getElementById(`job-${jobId}-feesList`);
    
    if (!job || job.fees.length === 0) {
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
    if (!job) return;
    
    job.fees.splice(index, 1);
    updateJobFeesList(jobId);
    updateEstimatePreview();
}

function updateJobDiscount(jobId, discountPercentage) {
    const job = currentEstimate.jobs.find(j => j.id === jobId);
    if (!job) return;
    
    job.discountPercentage = parseFloat(discountPercentage) || 0;
    updateEstimatePreview();
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


function showJobDetails(jobId) {
    // Save current job details before switching
    const currentJob = currentEstimate.jobs.find(j => j.id === currentJobId);
    if (currentJob) {
        const jobDescInput = document.getElementById('jobDescription');
        if (jobDescInput) {
            currentJob.name = jobDescInput.value || "New Job " + currentJob.id;
        }
        currentJob.days = parseFloat(document.getElementById('jobDays').value) || 1;
        currentJob.labor = parseFloat(document.getElementById('jobLabor').value) || 0;
    }

    currentJobId = jobId;
    const job = currentEstimate.jobs.find(j => j.id === jobId);
    
    // Update job tabs
    updateJobTabs();
    
    // Update form with selected job's data
    document.getElementById('jobDescription').value = job.name;
    document.getElementById('jobDays').value = job.days;
    document.getElementById('jobLabor').value = job.labor;
    
    updateMaterialsList();
    updateJobFeesList(jobId);
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
    
    // Update display
    const discountDisplay = document.getElementById('jobDiscountDisplay');
    if (job.discountPercentage > 0) {
        discountDisplay.textContent = `${job.discountPercentage}% discount applied`;
        discountDisplay.style.color = '#28a745';
    } else {
        discountDisplay.textContent = 'No discount applied';
        discountDisplay.style.color = '';
    }
    
    updateEstimatePreview();
}

function updateJobTabs() {
    const jobTabsContainer = document.getElementById('jobTabsContainer');
    jobTabsContainer.innerHTML = '';
    
    currentEstimate.jobs.forEach(job => {
        const tab = document.createElement('div');
        tab.className = `job-tab ${job.id === currentJobId ? 'active' : ''}`;
        tab.textContent = `Job ${job.id}: ${job.name || 'New Job ' + job.id}`; // Updated this line
        tab.onclick = () => showJobDetails(job.id);
        
        if (currentEstimate.jobs.length > 1) {
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.className = 'remove-job-btn';
            removeBtn.onclick = (e) => {
                e.stopPropagation();
                removeJob(job.id);
            };
            tab.appendChild(removeBtn);
        }
        
        jobTabsContainer.appendChild(tab);
    });
    
    // Add "+" tab for new jobs
    const addTab = document.createElement('div');
    addTab.className = 'job-tab add-job-tab';
    addTab.innerHTML = '<i class="fas fa-plus"></i> Add Job';
    addTab.onclick = addNewJob;
    jobTabsContainer.appendChild(addTab);
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

function toggleEstimateFee() {
    currentEstimate.waiveEstimateFee = !currentEstimate.waiveEstimateFee;
    const btn = document.getElementById('waiveEstimateFeeBtn');
    
    if (currentEstimate.waiveEstimateFee) {
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
        // Save current job details
        const currentJob = currentEstimate.jobs.find(j => j.id === currentJobId);
        if (currentJob) {
            currentJob.name = document.getElementById('jobDescription').value || "New Job " + currentJob.id;
            currentJob.days = parseFloat(document.getElementById('jobDays').value) || 1;
            currentJob.labor = parseFloat(document.getElementById('jobLabor').value) || 0;
        }
        
        if (currentEstimate.jobs.length === 0 || currentEstimate.jobs.some(job => !job.name || job.name === "")) {
            alert('Please add at least one job with a description');
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
    if (!customerInfoForm.checkValidity()) {
        alert('Please fill out all customer information fields');
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

function updateJobDetails() {
    const job = currentEstimate.jobs.find(j => j.id === currentJobId);
    if (!job) return;
    
    // Only update fields if they exist (not during initialization)
    const jobDescInput = document.getElementById('jobDescription');
    const jobDaysInput = document.getElementById('jobDays');
    const jobLaborInput = document.getElementById('jobLabor');
    
    if (jobDescInput) job.name = jobDescInput.value;
    if (jobDaysInput) job.days = parseFloat(jobDaysInput.value) || 1;
    if (jobLaborInput) job.labor = parseFloat(jobLaborInput.value) || 0;
}


function updateEstimatePreview() {
    let laborTotal = 0;
    let materialsTotal = 0;
    let feesTotal = 0;
    let discountTotal = 0;
    
    const jobsHTML = currentEstimate.jobs.map(job => {
        const jobMaterialsTotal = job.materials.reduce((sum, mat) => sum + mat.total, 0);
        const jobFeesTotal = job.fees.reduce((sum, fee) => sum + fee.amount, 0);
        const jobSubtotal = job.labor + jobMaterialsTotal + jobFeesTotal;
        const jobDiscount = jobSubtotal * (job.discountPercentage / 100);
        const jobTotal = jobSubtotal - jobDiscount;
        
        laborTotal += job.labor || 0;
        materialsTotal += jobMaterialsTotal;
        feesTotal += jobFeesTotal;
        discountTotal += jobDiscount;
        
        return `
            <div class="estimate-job-section">
                <h4>${job.name || 'New Job'} (${job.days} days)</h4>
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
                
                <div class="estimate-job-total">
                    <span>Job Total:</span>
                    <span>$${formatAccounting(jobTotal)}</span>
                </div>
            </div>
        `;
    }).join('');
    
    const estimateFee = currentEstimate.waiveEstimateFee ? -75 : 75;
    const grandTotal = laborTotal + materialsTotal + feesTotal - discountTotal + estimateFee;
    currentEstimate.total = grandTotal;
    
    const html = `
        <div class="estimate-section">
            <h3>Customer Information</h3>
            <!-- Existing customer info... -->
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
            <div class="estimate-row">
                <span>Estimate Fee:</span>
                <span>${currentEstimate.waiveEstimateFee ? 'Waived (-$75.00)' : '$75.00'}</span>
            </div>
            <div class="estimate-row estimate-total-row">
                <span>Grand Total:</span>
                <span>$${formatAccounting(grandTotal)}</span>
            </div>
        </div>
    `;
    
    estimatePreview.innerHTML = html;
}

function saveEstimate() {
    if (!currentEstimate.customer.name || currentEstimate.jobs.length === 0) {
        alert('Please complete all required fields and add at least one job');
        return;
    }

    // Add timestamp
    currentEstimate.createdAt = new Date().toISOString();
    currentEstimate.updatedAt = currentEstimate.createdAt;

    // Save to Firestore
    db.collection("estimates").add(currentEstimate)
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
            <div class="estimate-header">
                <h3>${estimate.customer.name}</h3>
                <span class="estimate-date">${formattedDate}</span>
            </div>
            <p class="estimate-location"><i class="fas fa-map-marker-alt"></i> ${estimate.customer.location}</p>
            <p class="estimate-jobs"><i class="fas fa-tools"></i> ${estimate.jobs.map(job => job.name).join(', ')}</p>
            <p class="estimate-total">$${formatAccounting(estimate.total)}</p>
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
    
    estimate.jobs.forEach(job => {
        laborTotal += job.labor || 0;
        materialsTotal += job.materials.reduce((sum, mat) => sum + mat.total, 0);
    });
    
    const estimateFee = estimate.waiveEstimateFee ? -75 : 75;
    const total = laborTotal + materialsTotal + estimateFee;

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
            ${estimate.jobs.map(job => `
                <div class="estimate-row">
                    <span>${job.name} (${job.days} days)</span>
                    <span>$${formatAccounting(job.labor)}</span>
                </div>
                ${job.materials.map(mat => `
                    <div class="estimate-row">
                        <span>${mat.name} (${mat.quantity} @ $${formatAccounting(mat.price)})</span>
                        <span>$${formatAccounting(mat.total)}</span>
                    </div>
                `).join('')}
            `).join('')}
            <div class="estimate-row estimate-total-row">
                <span>Total Labor:</span>
                <span>$${formatAccounting(laborTotal)}</span>
            </div>
            <div class="estimate-row estimate-total-row">
                <span>Total Materials:</span>
                <span>$${formatAccounting(materialsTotal)}</span>
            </div>
        </div>
        
        <div class="estimate-section">
            <div class="estimate-row">
                <span>Estimate Fee:</span>
                <span>${estimate.waiveEstimateFee ? 'Waived (-$75.00)' : '$75.00'}</span>
            </div>
            <div class="estimate-row estimate-total-row">
                <span>Total Estimate:</span>
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
    
    // Show edit fields
    showEditFields(currentEstimate);
    isEditing = true;
    
    // Hide the static view and show edit fields
    modalContent.style.display = 'none';
    editFieldsContainer.style.display = 'block';
    
    // Update button visibility
    editEstimateBtn.style.display = 'none';
    saveChangesBtn.style.display = 'inline-block';
    exportEstimateBtn.style.display = 'none';
    deleteEstimateBtn.style.display = 'none';
}

function showEditFields(estimate) {
    editFieldsContainer.innerHTML = `
        <div class="estimate-section">
            <h3>Edit Customer Information</h3>
            <!-- Existing customer fields... -->
        </div>
        
        <div class="estimate-section">
            <h3>Edit Jobs</h3>
            <div id="editJobsContainer"></div>
            <button type="button" class="btn-next" onclick="addNewJobForEdit()">Add New Job</button>
        </div>
    `;
    
    // Populate jobs
    const jobsContainer = document.getElementById('editJobsContainer');
    estimate.jobs.forEach((job, index) => {
        jobsContainer.innerHTML += `
            <div class="job-edit-section">
                <h4>Job ${job.id}</h4>
                <!-- Existing job fields... -->
                
                <div class="form-group">
                    <label>Discount Percentage:</label>
                    <input type="number" class="edit-job-field" data-job-id="${job.id}" 
                           data-field="discountPercentage" value="${job.discountPercentage}" min="0" max="100">
                </div>
                
                <div class="form-group">
                    <label>Fees:</label>
                    <div id="editFees-${job.id}" class="edit-fees-list"></div>
                    <div class="fee-form">
                        <input type="text" id="editFeeName-${job.id}" placeholder="Fee Name">
                        <input type="number" id="editFeeAmount-${job.id}" placeholder="Amount" min="0" step="0.01">
                        <button onclick="addNewFeeForEdit(${job.id})">Add Fee</button>
                    </div>
                </div>
                
                ${estimate.jobs.length > 1 ? `
                <button type="button" class="btn-cancel" onclick="removeJobFromEdit(${job.id})">Remove Job</button>
                ` : ''}
            </div>
        `;
        
        // Populate fees for this job
        const feesContainer = document.getElementById(`editFees-${job.id}`);
        job.fees.forEach((fee, feeIndex) => {
            feesContainer.innerHTML += `
                <div class="edit-fee-item">
                    <span>${fee.name}: $${formatAccounting(fee.amount)}</span>
                    <button onclick="removeFeeFromEdit(${job.id}, ${feeIndex})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
    });
    
    // Add event listeners for editing
    document.querySelectorAll('.edit-job-field').forEach(input => {
        input.addEventListener('change', function() {
            const jobId = parseInt(this.dataset.jobId);
            const field = this.dataset.field;
            const value = field === 'days' || field === 'labor' ? parseFloat(this.value) : this.value;
            
            const job = currentEstimate.jobs.find(j => j.id === jobId);
            if (job) job[field] = value;
        });
    });
    
function addNewFeeForEdit(jobId) {
    const name = document.getElementById(`editFeeName-${jobId}`).value.trim();
    const amount = parseFloat(document.getElementById(`editFeeAmount-${jobId}`).value);
    
    if (!name || isNaN(amount) || amount <= 0) {
        alert('Please enter valid fee details');
        return;
    }
    
    const job = currentEstimate.jobs.find(j => j.id === jobId);
    if (!job) return;
    
    if (!job.fees) job.fees = [];
    job.fees.push({ name, amount });
    
    showEditFields(currentEstimate);
}

function removeFeeFromEdit(jobId, feeIndex) {
    const job = currentEstimate.jobs.find(j => j.id === jobId);
    if (!job || !job.fees) return;
    
    job.fees.splice(feeIndex, 1);
    showEditFields(currentEstimate);
}

    document.querySelectorAll('.edit-material-field').forEach(input => {
        input.addEventListener('change', function() {
            const jobId = parseInt(this.dataset.jobId);
            const matIndex = parseInt(this.dataset.matIndex);
            const field = this.dataset.field;
            const value = parseFloat(this.value);
            
            const job = currentEstimate.jobs.find(j => j.id === jobId);
            if (job && job.materials[matIndex]) {
                job.materials[matIndex][field] = value;
                job.materials[matIndex].total = job.materials[matIndex].price * job.materials[matIndex].quantity;
            }
        });
    });
}

function addNewJobForEdit() {
    const newJob = {
        id: currentJobId++,
        name: "New Job",
        days: 1,
        labor: 0,
        materials: []
    };
    currentEstimate.jobs.push(newJob);
    showEditFields(currentEstimate);
}

function addNewMaterialField(jobId) {
    const job = currentEstimate.jobs.find(j => j.id === jobId);
    if (!job) return;
    
    job.materials.push({
        name: "New Material",
        price: 0,
        quantity: 1,
        total: 0
    });
    
    showEditFields(currentEstimate);
}

function removeJobFromEdit(jobId) {
    if (currentEstimate.jobs.length <= 1) {
        alert("You must have at least one job");
        return;
    }
    
    currentEstimate.jobs = currentEstimate.jobs.filter(job => job.id !== jobId);
    showEditFields(currentEstimate);
}

function removeMaterialFromEdit(jobId, matIndex) {
    const job = currentEstimate.jobs.find(j => j.id === jobId);
    if (!job) return;
    
    job.materials.splice(matIndex, 1);
    showEditFields(currentEstimate);
}

function addFee() {
    const feeName = document.getElementById('feeName').value.trim();
    const feeAmount = parseFloat(document.getElementById('feeAmount').value);
    
    if (!feeName || isNaN(feeAmount) || feeAmount <= 0) {
        alert('Please enter valid fee details');
        return;
    }
    
    if (!currentEstimate.fees) currentEstimate.fees = [];
    currentEstimate.fees.push({ name: feeName, amount: feeAmount });
    
    updateEstimatePreview();
}

function removeFee(index) {
    if (!currentEstimate.fees) return;
    currentEstimate.fees.splice(index, 1);
    updateEstimatePreview();
}

function updateDiscount() {
    const discountPercentage = parseFloat(document.getElementById('discountPercentage').value) || 0;
    currentEstimate.discountPercentage = discountPercentage;
    updateEstimatePreview();
}

function applyDiscount() {
    updateDiscount();
}

function saveEstimateChanges() {
    if (!currentEstimate.customer.name || currentEstimate.jobs.length === 0) {
        alert('Please complete all required fields and add at least one job');
        return;
    }

    // Update customer info from edit fields
    currentEstimate.customer = {
        name: document.getElementById('editCustomerName').value,
        email: document.getElementById('editCustomerEmail').value,
        phone: document.getElementById('editCustomerPhone').value,
        location: document.getElementById('editJobLocation').value
    };

    // Update timestamp
    currentEstimate.updatedAt = new Date().toISOString();

    // Save to Firestore
    db.collection("estimates").doc(currentEstimate.id).update(currentEstimate)
        .then(() => {
            alert('Estimate updated successfully!');
            
            // Reset editing state
            isEditing = false;
            editFieldsContainer.style.display = 'none';
            modalContent.style.display = 'block';
            
            // Update button visibility
            editEstimateBtn.style.display = 'inline-block';
            saveChangesBtn.style.display = 'none';
            exportEstimateBtn.style.display = 'inline-block';
            deleteEstimateBtn.style.display = 'inline-block';
            
            // Reload the estimate to show changes
            loadEstimates();
            openEstimateModal(currentEstimate);
        })
        .catch(error => {
            console.error('Error updating estimate:', error);
            alert('Error updating estimate. Please try again.');
        });
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

function cancelEstimate() {
    if (confirm('Are you sure you want to cancel this estimate? All progress will be lost.')) {
        resetEstimateForm();
        showDashboard();
    }
}

function exportEstimateToWord() {
    const estimateId = modalContent.dataset.estimateId;
    
    db.collection("estimates").doc(estimateId).get()
        .then(doc => {
            if (doc.exists) {
                exportEstimate(doc.data());
            } else {
                alert('Estimate not found');
            }
        })
        .catch(error => {
            console.error('Error loading estimate for export:', error);
            alert('Error loading estimate for export');
        });
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
    let materialsTotal = 0;
    
    estimate.jobs.forEach(job => {
        laborTotal += job.labor || 0;
        materialsTotal += job.materials.reduce((sum, mat) => sum + mat.total, 0);
    });
    
    const estimateFee = estimate.waiveEstimateFee ? -75 : 75;
    const total = laborTotal + materialsTotal + estimateFee;

    // Payment terms
    const paymentTerms = {
        depositRequired: true,
        depositPercentage: 50,
        progressPayments: true,
        finalPaymentDue: "upon completion",
        paymentMethods: ["Check", "Credit Card", "Bank Transfer"]
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
            border-bottom: 2px solid #e63946;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #e63946;
            font-size: 28px;
            margin-bottom: 5px;
        }
        .header h2 {
            color: #333;
            font-size: 18px;
            margin-top: 0;
            margin-bottom: 10px;
        }
        .header p {
            margin: 5px 0;
            color: #666;
        }
        .client-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .info-block {
            width: 48%;
        }
        .info-block h3 {
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            color: #e63946;
            font-size: 16px;
        }
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        .section-title {
            color: #e63946;
            font-size: 18px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th {
            background-color: #e63946;
            color: white;
            text-align: left;
            padding: 8px;
        }
        td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }
        .total-row {
            font-weight: bold;
            background-color: #f8f9fa;
        }
        .highlight-green {
            background-color: #d4edda;
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
            font-size: 0.9em;
            margin-top: 30px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 0.8em;
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
            max-width: 50px;
            height: auto;
        }
        .payment-terms {
            margin-top: 30px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 8px;
        }
        .payment-terms h3 {
            color: #e63946;
            margin-top: 0;
        }
        .payment-terms ul {
            margin-bottom: 0;
        }
    </style>
</head>
<body>
    <div class="logo">
        <img src="https://raw.githubusercontent.com/jakebrecknock/ahs-tool/refs/heads/main/ace-handy-logos.webp" alt="Ace Handyman Services Logo">
    </div>
    <div class="header">
        <h2>Ace Handyman Services Oak Park River Forest</h2>
        <p>207 N Harlem Ave. Oak Park, IL 60302 | (708) 773-0218</p>
        <h3>ESTIMATE: Home Repair Projects</h3>
        <p>Date: ${formattedDate}</p>
    </div>
    
    <div class="client-info">
        <div class="info-block">
            <h3>Bill To:</h3>
            <p>${estimate.customer.name}</p>
            <p>${estimate.customer.location}</p>
            <p>${estimate.customer.email}</p>
            <p>${estimate.customer.phone}</p>
        </div>
        <div class="info-block">
            <h3>Service Address:</h3>
            <p>${estimate.customer.name}</p>
            <p>${estimate.customer.location}</p>
            <p>${estimate.customer.email}</p>
            <p>${estimate.customer.phone}</p>
        </div>
    </div>
    
    <p>Dear ${estimate.customer.name.split(' ')[0]},</p>
    <p>Thank you for considering Ace Handyman Services for your repair needs. Based on our assessment, we are pleased to provide the following estimate for the project(s) at ${estimate.customer.location}.</p>
    
    ${estimate.jobs.map((job, index) => {
        const categoryName = priceSheet.categories[job.category].name;
        const jobMaterials = estimate.materials.filter(mat => 
            priceSheet.categories[job.category].materials[mat.name] !== undefined
        );
        const jobSubtotal = job.labor + 
            jobMaterials.reduce((sum, mat) => sum + mat.total, 0) +
            estimate.customMaterials.reduce((sum, mat) => sum + mat.total, 0) +
            (estimate.fees ? estimate.fees.reduce((sum, fee) => sum + fee.amount, 0) : 0);
        const jobDiscount = estimate.discountPercentage ? (jobSubtotal * estimate.discountPercentage / 100) : 0;
        
        return `
            <div class="section">
                <div class="section-title">${index + 1}. Scope of Work</div>
                <p><strong>Area:</strong> ${categoryName}</p>
                <p><strong>Repair Work:</strong></p>
                <ul>
                    ${job.name.split(',').map(item => `<li>${item.trim()}</li>`).join('')}
                </ul>
                <p><strong>Materials:</strong></p>
                <ul>
                    ${jobMaterials.map(mat => `<li>${mat.name} (${mat.quantity} @ $${formatAccounting(mat.price)})</li>`).join('')}
                    ${estimate.customMaterials.map(mat => `<li>${mat.name} (Custom) (${mat.quantity} @ $${formatAccounting(mat.price)})</li>`).join('')}
                </ul>
                <table>   
                    <tr>
                        <th>Description</th>
                        <th>Details</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                    </tr>
                    <tr>
                        <td>Labor</td>
                        <td>${job.name} (${job.days} days)</td>
                        <td>1</td>
                        <td>$${formatAccounting(job.labor)}</td>
                        <td>$${formatAccounting(job.labor)}</td>
                    </tr>
                    ${jobMaterials.map(mat => `
                    <tr>
                        <td>Material</td>
                        <td>${mat.name}</td>
                        <td>${mat.quantity}</td>
                        <td>$${formatAccounting(mat.price)}</td>
                        <td>$${formatAccounting(mat.total)}</td>
                    </tr>
                    `).join('')}
                    ${estimate.customMaterials.map(mat => `
                    <tr>
                        <td>Material</td>
                        <td>${mat.name} (Custom)</td>
                        <td>${mat.quantity}</td>
                        <td>$${formatAccounting(mat.price)}</td>
                        <td>$${formatAccounting(mat.total)}</td>
                    </tr>
                    `).join('')}
                    ${estimate.fees && estimate.fees.length > 0 ? estimate.fees.map(fee => `
                    <tr>
                        <td>Fee</td>
                        <td>${fee.name}</td>
                        <td>1</td>
                        <td>$${formatAccounting(fee.amount)}</td>
                        <td>$${formatAccounting(fee.amount)}</td>
                    </tr>
                    `).join('') : ''}
                    ${!waiveFee ? `
                    <tr>
                        <td>Fee</td>
                        <td>Estimate Fee</td>
                        <td>1</td>
                        <td>$75.00</td>
                        <td>$75.00</td>
                    </tr>
                    ` : `
                    <tr>
                        <td>Fee</td>
                        <td>Estimate Fee Removed</td>
                        <td>1</td>
                        <td>($75.00)</td>
                        <td>($75.00)</td>
                    </tr>
                    `}
                    ${estimate.discountPercentage > 0 ? `
                    <tr>
                        <td colspan="4" style="text-align: right;">Subtotal:</td>
                        <td>$${formatAccounting(jobSubtotal)}</td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: right;">Discount (${estimate.discountPercentage}%):</td>
                        <td>-$${formatAccounting(jobDiscount)}</td>
                    </tr>
                    ` : ''}
                    <tr class="total-row">
                        <td colspan="4" style="text-align: right;">Total:</td>
                        <td>$${formatAccounting(jobSubtotal - jobDiscount + (waiveFee ? -75 : 75))}</td>
                    </tr>
                </table>
            </div>
        `;
    }).join('')}
    
    <div class="page-break"></div>
    
    <div class="section">
        <div class="section-title">Payment Summary</div>
        <table>
            <tr>
                <td style="text-align: right; font-weight: bold;">Labor Total:</td>
                <td>$${formatAccounting(laborTotal)}</td>
            </tr>
            <tr>
                <td style="text-align: right; font-weight: bold;">Materials Total:</td>
                <td>$${formatAccounting(materialsTotal + customMaterialsTotal)}</td>
            </tr>
            ${estimate.fees && estimate.fees.length > 0 ? `
            <tr>
                <td style="text-align: right; font-weight: bold;">Fees Total:</td>
                <td>$${formatAccounting(feesTotal)}</td>
            </tr>
            ` : ''}
            <tr>
                <td style="text-align: right; font-weight: bold;">Subtotal:</td>
                <td>$${formatAccounting(subtotal)}</td>
            </tr>
            ${estimate.discountPercentage > 0 ? `
            <tr>
                <td style="text-align: right; font-weight: bold;">Discount (${estimate.discountPercentage}%):</td>
                <td>-$${formatAccounting(discount)}</td>
            </tr>
            ` : ''}
            <tr>
                <td style="text-align: right; font-weight: bold;">Estimate Fee:</td>
                <td>${waiveFee ? '-$75.00' : '$75.00'}</td>
            </tr>
            <tr class="highlight-green">
                <td style="text-align: right; font-weight: bold; font-size: 1.1em;">Final Total:</td>
                <td style="font-weight: bold; font-size: 1.1em;">$${formatAccounting(total)}</td>
            </tr>
        </table>
    </div>
    
    <div class="payment-terms">
        <h3>Payment Terms</h3>
        <ul>
           
            ${paymentTerms.progressPayments ? `
            <li><strong>Progress Payments:</strong> Payments due at agreed milestones during project</li>
            ` : ''}
            <li><strong>Final Payment:</strong> Due ${paymentTerms.finalPaymentDue}</li>
            <li><strong>Accepted Payment Methods:</strong> ${paymentTerms.paymentMethods.join(", ")}</li>
  
        </ul>
    </div>
    
    <div class="page-break"></div>
    
    <div class="section terms">
        <div class="section-title">Terms and Conditions</div>
        <ul>
            <li><strong>Validity:</strong> this estimate is valid until ${validUntilDate}</li>
            <li><strong>Payment Terms:</strong> invoiced for time and material daily</li>
            <li><strong>Project Timeline:</strong> to be determined between owner and Ace Handyman Services</li>
            <li><strong>Warranty:</strong> 12 Months: labor and materials provided by Ace Handyman Services</li>
            <li><strong>Disclosure:</strong> Ace Handyman Services operates on a time and materials model. The above estimate is subject to change.</li>
            <li><strong>Change Orders:</strong> Any changes to scope of work will require a signed change order</li>
        </ul>
    </div>
    
    <div class="section">
        <div class="section-title">Additional Notes</div>
        <p>We look forward to the opportunity to work with you.</p>
        <p>Please review this estimate and let us know if you have any questions or require any modifications.</p>
        <p>To accept this estimate, please sign and return a copy or contact us to confirm your acceptance.</p>
        <p>Thank you for your consideration.</p>
    </div>
    
    <div class="signature-section">
        <p>Sincerely,</p>
        <p><strong>Samuel Cundari</strong><br>
        Operations Manager<br>
        Ace Handyman Services Oak Park River Forest<br>
        scund@acehandymanservices.com<br>
        O: 708-773-0218</p>
        
        <div style="margin-top: 50px;">
            <p><strong>Client Acceptance</strong></p>
            <p>I, ${estimate.customer.name}, accept the terms and scope of the estimate provided above.</p>
            <div style="margin-top: 30px;">
                <p>Signature: ___________________________________________</p>
                <p>Date: ____________________</p>
            </div>
        </div>
    </div>
    
    <div class="footer">
        <p>207 N Harlem Ave Oak Park IL 60302 | AceHandymanServices.com | 708.773.0218 | OakParkRiverForest@AceHandymanServices.com</p>
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
                const estimate = doc.data();
                // Check if customer name contains search term (case insensitive)
                if (estimate.customer.name.toLowerCase().includes(searchTerm)) {
                    estimates.push({
                        id: doc.id,
                        ...estimate
                    });
                }
            });
            displayEstimates(estimates);
        })
        .catch(error => {
            console.error('Error searching estimates:', error);
        });
}

function initDateFilters() {
    // Populate month dropdown
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    monthFilter.innerHTML = '<option value="">Select Month</option>';
    months.forEach((month, index) => {
        monthFilter.innerHTML += `<option value="${index + 1}">${month}</option>`;
    });
    
    // Populate year dropdown (current year and 5 years back)
    const currentYear = new Date().getFullYear();
    yearFilter.innerHTML = '<option value="">Select Year</option>';
    for (let year = currentYear; year >= currentYear - 5; year--) {
        yearFilter.innerHTML += `<option value="${year}">${year}</option>`;
    }
}

function filterByDate() {
    const month = monthFilter.value;
    const year = yearFilter.value;
    
    if (!month || !year) {
        loadEstimates();
        return;
    }
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    
    db.collection("estimates")
        .where("createdAt", ">=", startDate.toISOString())
        .where("createdAt", "<", endDate.toISOString())
        .orderBy("createdAt", "desc")
        .get()
        .then(querySnapshot => {
            const estimates = [];
            querySnapshot.forEach(doc => {
                estimates.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            displayEstimates(estimates);
        })
        .catch(error => {
            console.error('Error filtering estimates:', error);
        });
}

// Make functions available globally for HTML event handlers
// Update this section at the bottom of app.js:
window.nextStep = nextStep;
window.prevStep = prevStep;
window.cancelEstimate = cancelEstimate;
window.addNewJob = addNewJob;
window.removeJob = removeJob;
window.addMaterialToJob = addMaterialToJob;
window.removeMaterialFromJob = removeMaterialFromJob;
window.toggleEstimateFee = toggleEstimateFee;
window.addFee = addFee;
window.removeFee = removeFee;
window.updateDiscount = updateDiscount;