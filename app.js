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
    dashboardBtn.addEventListener('click', showDashboard);
    newEstimateBtn.addEventListener('click', showNewEstimate);
   
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
        document.body.style.overflow = '';
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
        document.body.style.overflow = '';
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
    document.getElementById('waiveEstimateFeeBtn').classList.remove('active');
    document.getElementById('waiveEstimateFeeBtn').innerHTML = '<i class="fas fa-dollar-sign"></i> Waive $75 Estimate Fee';
}


function initPhoneNumberFormatting() {
    const phoneInput = document.getElementById('customerPhone');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        let input = e.target.value.replace(/\D/g,'').substring(0,10);
        let formatted = input.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        e.target.value = formatted;
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
        id: currentJobId++,
        name: "New Job " + (currentJobId - 1),
        days: 1,
        workers: 1,
        hasApprentice: false,
        labor: 0,
        materials: [],
        fees: [],
        discountPercentage: 0,
        waiveEstimateFee: false
    };
    currentEstimate.jobs.push(newJob);
    showJobDetails(newJob.id);
    updateJobTabs();
    updateEstimatePreview();
}


function showJobDetails(jobId) {
    // Save current job details before switching
    const currentJob = currentEstimate.jobs.find(j => j.id === currentJobId);
    if (currentJob) {
        currentJob.name = document.getElementById('jobDescription').value || "New Job " + currentJob.id;
        currentJob.days = parseFloat(document.getElementById('jobDays').value) || 1;
        currentJob.workers = parseInt(document.getElementById('jobWorkers').value) || 1;
        currentJob.hasApprentice = document.getElementById('hasApprentice').checked;
        currentJob.labor = parseFloat(document.getElementById('jobLabor').value) || 0;
    }


    currentJobId = jobId;
    const job = currentEstimate.jobs.find(j => j.id === jobId);
   
    // Update form with selected job's data
    document.getElementById('jobDescription').value = job.name;
    document.getElementById('jobDays').value = job.days;
    document.getElementById('jobWorkers').value = job.workers;
    document.getElementById('hasApprentice').checked = job.hasApprentice;
    document.getElementById('jobLabor').value = job.labor;
    document.getElementById('jobDiscountPercentage').value = job.discountPercentage;
   
    // Update estimate fee button
    const feeBtn = document.getElementById('waiveEstimateFeeBtn');
    if (job.waiveEstimateFee) {
        feeBtn.classList.add('active');
        feeBtn.innerHTML = '<i class="fas fa-check"></i> Estimate Fee Waived';
    } else {
        feeBtn.classList.remove('active');
        feeBtn.innerHTML = '<i class="fas fa-dollar-sign"></i> Waive $75 Estimate Fee';
    }
   
    // Update materials and fees lists
    updateMaterialsList();
    updateJobFeesList(jobId);
    updateJobDiscountDisplay(jobId);
    updateEstimatePreview();
}


function updateJobTabs() {
    const jobTabsContainer = document.getElementById('jobTabsContainer');
    jobTabsContainer.innerHTML = '';
    
    currentEstimate.jobs.forEach(job => {
        const tab = document.createElement('div');
        tab.className = `job-tab ${job.id === currentJobId ? 'active' : ''}`;
        tab.innerHTML = `
            <span>${job.name || 'Job ' + (currentEstimate.jobs.indexOf(job) + 1)}</span>
            ${currentEstimate.jobs.length > 1 ? `
            <button class="remove-job-btn"><i class="fas fa-times"></i></button>
            ` : ''}
        `;
        
        tab.onclick = (e) => {
            if (!e.target.classList.contains('remove-job-btn')) {
                showJobDetails(job.id);
            }
        };
        
        if (currentEstimate.jobs.length > 1) {
            const removeBtn = tab.querySelector('.remove-job-btn');
            removeBtn.onclick = (e) => {
                e.stopPropagation();
                removeJob(job.id);
            };
        }
        
        jobTabsContainer.appendChild(tab);
    });
    
    // Add "+" tab for new jobs
    const addTab = document.createElement('div');
    addTab.className = 'job-tab add-job-tab';
    addTab.innerHTML = '<i class="fas fa-plus"></i>';
    addTab.onclick = addNewJob;
    jobTabsContainer.appendChild(addTab);
}
// Update job details when typing
document.getElementById('jobDescription').addEventListener('input', function(e) {
    const job = currentEstimate.jobs.find(j => j.id === currentJobId);
    if (job) {
        job.name = e.target.value || 'Job ' + (currentEstimate.jobs.indexOf(job) + 1);
        updateJobTabs();
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
                showNewEstimate();
                showJobDetails(currentEstimate.jobs[0].id);
                nextStep(2);
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
        // Save current job details
        const currentJob = currentEstimate.jobs.find(j => j.id === currentJobId);
        if (currentJob) {
            currentJob.name = document.getElementById('jobDescription').value || "New Job " + currentJob.id;
            currentJob.days = parseFloat(document.getElementById('jobDays').value) || 1;
            currentJob.workers = parseInt(document.getElementById('jobWorkers').value) || 1;
            currentJob.hasApprentice = document.getElementById('hasApprentice').checked;
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
    let materialsTotal = 0;
    let feesTotal = 0;
    let discountTotal = 0;
    let estimateFeeTotal = 0;
   
    const jobsHTML = currentEstimate.jobs.map(job => {
        const jobMaterialsTotal = job.materials.reduce((sum, mat) => sum + mat.total, 0);
        const jobFeesTotal = job.fees.reduce((sum, fee) => sum + fee.amount, 0);
        const jobSubtotal = job.labor + jobMaterialsTotal + jobFeesTotal;
        const jobDiscount = jobSubtotal * (job.discountPercentage / 100);
        const jobEstimateFee = job.waiveEstimateFee ? -75 : 75;
        const jobTotal = jobSubtotal - jobDiscount + jobEstimateFee;
       
        laborTotal += job.labor || 0;
        materialsTotal += jobMaterialsTotal;
        feesTotal += jobFeesTotal;
        discountTotal += jobDiscount;
        estimateFeeTotal += jobEstimateFee;
       
        return `
            <div class="estimate-job-section">
                <h4>${job.name || 'New Job'} (${job.days} days, ${job.workers} worker${job.workers > 1 ? 's' : ''}${job.hasApprentice ? ' (includes apprentice)' : ''})</h4>
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
    }).join('');
   
    const grandTotal = laborTotal + materialsTotal + feesTotal - discountTotal + estimateFeeTotal;
    currentEstimate.total = grandTotal;
   
    const html = `
        <div class="estimate-section">
            <h3>Customer Information</h3>
            <div class="estimate-row">
                <span>Name:</span>
                <span>${currentEstimate.customer.name}</span>
            </div>
            <div class="estimate-row">
                <span>Email:</span>
                <span>${currentEstimate.customer.email}</span>
            </div>
            <div class="estimate-row">
                <span>Phone:</span>
                <span>${currentEstimate.customer.phone}</span>
            </div>
            <div class="estimate-row">
                <span>Location:</span>
                <span>${currentEstimate.customer.location}</span>
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
        <img src="${base64Image}" alt="Ace Handyman Services Logo">
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
            <p>${estimate.customer.location}</p>
        </div>
    </div>
   
    <p>Dear ${estimate.customer.name.split(' ')[0]},</p>
    <p>Thank you for considering Ace Handyman Services for your repair needs. Based on our assessment, we are pleased to provide the following estimate for the project(s) at ${estimate.customer.location}.</p>
   
    ${estimate.jobs.map((job, index) => {
        const jobMaterialsTotal = job.materials.reduce((sum, mat) => sum + mat.total, 0);
        const jobFeesTotal = job.fees.reduce((sum, fee) => sum + fee.amount, 0);
        const jobSubtotal = job.labor + jobMaterialsTotal + jobFeesTotal;
        const jobDiscount = jobSubtotal * (job.discountPercentage / 100);
        const jobEstimateFee = job.waiveEstimateFee ? -75 : 75;
        const jobTotal = jobSubtotal - jobDiscount + jobEstimateFee;
       
        return `
            <div class="section">
                <div class="section-title">${index + 1}. Scope of Work</div>
                <p><strong>Project:</strong> ${job.name}</p>
                <p><strong>Duration:</strong> ${job.days} days with ${job.workers} worker${job.workers > 1 ? 's' : ''}${job.hasApprentice ? ' (includes apprentice)' : ''}</p>
                <p><strong>Repair Work:</strong></p>
                <p>${job.name}</p>
               
                <p><strong>Materials:</strong></p>
                <ul>
                    ${job.materials.map(mat => `<li>${mat.name} (${mat.quantity} @ $${formatAccounting(mat.price)})</li>`).join('')}
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
                    ${job.materials.map(mat => `
                    <tr>
                        <td>Material</td>
                        <td>${mat.name}</td>
                        <td>${mat.quantity}</td>
                        <td>$${formatAccounting(mat.price)}</td>
                        <td>$${formatAccounting(mat.total)}</td>
                    </tr>
                    `).join('')}
                    ${job.fees.map(fee => `
                    <tr>
                        <td>Fee</td>
                        <td>${fee.name}</td>
                        <td>1</td>
                        <td>$${formatAccounting(fee.amount)}</td>
                        <td>$${formatAccounting(fee.amount)}</td>
                    </tr>
                    `).join('')}
                    ${job.waiveEstimateFee ? `
                    <tr>
                        <td>Fee</td>
                        <td>Estimate Fee Removed</td>
                        <td>1</td>
                        <td>($75.00)</td>
                        <td>($75.00)</td>
                    </tr>
                    ` : `
                    <tr>
                        <td>Fee</td>
                        <td>Estimate Fee</td>
                        <td>1</td>
                        <td>$75.00</td>
                        <td>$75.00</td>
                    </tr>
                    `}
                    ${job.discountPercentage > 0 ? `
                    <tr>
                        <td colspan="4" style="text-align: right;">Subtotal:</td>
                        <td>$${formatAccounting(jobSubtotal)}</td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: right;">Discount (${job.discountPercentage}%):</td>
                        <td>-$${formatAccounting(jobDiscount)}</td>
                    </tr>
                    ` : ''}
                    <tr class="total-row">
                        <td colspan="4" style="text-align: right;">Total:</td>
                        <td>$${formatAccounting(jobTotal)}</td>
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
                <td>$${formatAccounting(materialsTotal)}</td>
            </tr>
            ${feesTotal > 0 ? `
            <tr>
                <td style="text-align: right; font-weight: bold;">Fees Total:</td>
                <td>$${formatAccounting(feesTotal)}</td>
            </tr>
            ` : ''}
            <tr>
                <td style="text-align: right; font-weight: bold;">Subtotal:</td>
                <td>$${formatAccounting(laborTotal + materialsTotal + feesTotal)}</td>
            </tr>
            ${discountTotal > 0 ? `
            <tr>
                <td style="text-align: right; font-weight: bold;">Discount:</td>
                <td>-$${formatAccounting(discountTotal)}</td>
            </tr>
            ` : ''}
            <tr>
                <td style="text-align: right; font-weight: bold;">Estimate Fee:</td>
                <td>$${formatAccounting(estimateFeeTotal)}</td>
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
            <li><strong>Deposit Required:</strong> ${paymentTerms.depositPercentage}% deposit to schedule work</li>
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
