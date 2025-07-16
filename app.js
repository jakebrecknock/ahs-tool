// DOM Elements
const base64Image = "https://raw.githubusercontent.com/jakebrecknock/ahs-tool/refs/heads/main/ace-handy-logos.webp"
const dashboardView = document.getElementById('dashboardView');
const newEstimateView = document.getElementById('newEstimateView');
const dashboardBtn = document.getElementById('dashboardBtn');
const newEstimateBtn = document.getElementById('newEstimateBtn');
const estimatesList = document.getElementById('estimatesList');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const timeFilter = document.getElementById('timeFilter');
const monthFilter = document.getElementById('monthFilter');
const yearFilter = document.getElementById('yearFilter');
const estimateModal = document.getElementById('estimateModal');
const closeModal = document.querySelector('.close-modal');
const editEstimateBtn = document.getElementById('editEstimateBtn');
const deleteEstimateBtn = document.getElementById('deleteEstimateBtn');
const exportEstimateBtn = document.getElementById('exportEstimateBtn');
const modalContent = document.getElementById('modalContent');
const editFieldsContainer = document.getElementById('editFieldsContainer');
const saveChangesBtn = document.getElementById('saveChangesBtn');
let isEditing = false;
const PASSWORD = "AHS"; // Change at some point
const passwordModal = document.getElementById('passwordModal');
const passwordInput = document.getElementById('passwordInput');
const passwordError = document.getElementById('passwordError');
const submitPassword = document.getElementById('submitPassword');
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
const categorySelection = document.getElementById('categorySelection');
const jobDetailsContainer = document.getElementById('jobDetailsContainer');
const jobDetailsContent = document.getElementById('jobDetailsContent');
const materialsContainer = document.getElementById('materialsContainer');
const addCustomMaterial = document.getElementById('addCustomMaterial');
const estimatePreview = document.getElementById('estimatePreview');
const saveEstimateBtn = document.getElementById('saveEstimateBtn');

// Current estimate data
let currentEstimate = {
    customer: {},
    jobs: [], // This will now contain job objects with their own materials and discounts
    fees: [],
    total: 0,
    waiveEstimateFee: false
};

const priceSheet = {
    categories: {
        custom: {
            name: "Custom",
            jobs: [
                { name: "Custom job", days: "1", labor: "$0" }
            ],
            materials: {}
        }
    }
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Check password
    checkPassword();

    // Set up event listeners
    setupEventListeners();
    
    // Load estimates from Firebase
    loadEstimates();
    
    // Initialize category selection
    initCategorySelection();
    
    // Initialize phone number formatting
    initPhoneNumberFormatting();
    
    // Initialize month/year filters
    initDateFilters();
});

function setupEventListeners() {
    // Navigation buttons
    if (dashboardBtn) dashboardBtn.addEventListener('click', showDashboard);
    if (newEstimateBtn) newEstimateBtn.addEventListener('click', showNewEstimate);
    if (saveChangesBtn) saveChangesBtn.addEventListener('click', saveEstimateChanges);
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchEstimates();
            }
        });
    }
    if (searchBtn) searchBtn.addEventListener('click', searchEstimates);
    
    // Time filter
    if (timeFilter) {
        timeFilter.addEventListener('change', function() {
            if (this.value === 'month') {
                if (monthFilter) monthFilter.style.display = 'inline-block';
                if (yearFilter) yearFilter.style.display = 'inline-block';
            } else {
                if (monthFilter) monthFilter.style.display = 'none';
                if (yearFilter) yearFilter.style.display = 'none';
                loadEstimates();
            }
        });
    }
    
    if (monthFilter) monthFilter.addEventListener('change', filterByDate);
    if (yearFilter) yearFilter.addEventListener('change', filterByDate);
    
    // Modal buttons
    if (closeModal) closeModal.addEventListener('click', closeEstimateModal);
    if (editEstimateBtn) editEstimateBtn.addEventListener('click', editEstimate);
    if (deleteEstimateBtn) deleteEstimateBtn.addEventListener('click', deleteEstimate);
    if (exportEstimateBtn) exportEstimateBtn.addEventListener('click', exportEstimateToWord);
    
    // Estimate form buttons
    if (addCustomMaterial) addCustomMaterial.addEventListener('click', addCustomMaterialToEstimate);
    if (saveEstimateBtn) saveEstimateBtn.addEventListener('click', saveEstimate);

    const waiveEstimateFeeCheckbox = // Replace the checkbox event listener with button click handler
document.getElementById('waiveEstimateFeeBtn').addEventListener('click', function() {
    currentEstimate.waiveEstimateFee = !currentEstimate.waiveEstimateFee;
    
    if (currentEstimate.waiveEstimateFee) {
        this.classList.add('active');
        this.innerHTML = '<i class="fas fa-check"></i> Estimate Fee Waived';
    } else {
        this.classList.remove('active');
        this.innerHTML = '<i class="fas fa-dollar-sign"></i> Waive $75 Estimate Fee';
    }
    
    updateEstimatePreview();
});
}

function checkPassword() {
    // Check if already authenticated
    if (localStorage.getItem('authenticated')) {
        passwordModal.style.display = 'none';
        return;
    }

    // Show the modal initially (with full coverage)
    passwordModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling

    // Handle password submission
    function verifyPassword() {
        if (passwordInput.value === PASSWORD) {
            localStorage.setItem('authenticated', 'true');
            passwordModal.style.display = 'none';
            passwordError.style.display = 'none';
            document.body.style.overflow = ''; // Re-enable scrolling
        } else {
            passwordError.style.display = 'block';
            passwordInput.value = '';
        }
    }

    // Click event
    submitPassword.addEventListener('click', verifyPassword);

    // Enter key event
    passwordInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            verifyPassword();
        }
    });
}

function showDashboard() {
    dashboardView.classList.add('active-view');
    newEstimateView.classList.remove('active-view');
    dashboardBtn.classList.add('active');
    newEstimateBtn.classList.remove('active');
    loadEstimates();
}

let currentJobId = 1; // Track the current job being edited

function addNewJob() {
    currentJobId++;
    const newJob = {
        id: currentJobId,
        category: "custom", // Default to custom
        name: "",
        days: 1,
        labor: 0,
        materials: [],
        customMaterials: [],
        discountPercentage: 0
    };
    currentEstimate.jobs.push(newJob);
    showJobDetails(currentJobId);
}

function showJobDetails(jobId) {
    const job = currentEstimate.jobs.find(j => j.id === jobId);
    if (!job) return;

    currentJobId = jobId;
    
    // Update UI to show job tabs
    const jobTabsContainer = document.getElementById('jobTabsContainer');
    jobTabsContainer.innerHTML = '';
    
    currentEstimate.jobs.forEach(j => {
        const tab = document.createElement('div');
        tab.className = `job-tab ${j.id === jobId ? 'active' : ''}`;
        tab.textContent = `Job ${j.id}`;
        tab.onclick = () => showJobDetails(j.id);
        
        if (currentEstimate.jobs.length > 1) {
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.className = 'remove-job-btn';
            removeBtn.onclick = (e) => {
                e.stopPropagation();
                removeJob(j.id);
            };
            tab.appendChild(removeBtn);
        }
        
        jobTabsContainer.appendChild(tab);
    });
    
    // Add "+" tab for new jobs
    const addTab = document.createElement('div');
    addTab.className = 'job-tab add-job-tab';
    addTab.innerHTML = '<i class="fas fa-plus"></i>';
    addTab.onclick = addNewJob;
    jobTabsContainer.appendChild(addTab);
    
    // Show job details for the selected job
    renderJobDetails(job);
}

function renderJobDetails(job) {
    const jobDetailsContent = document.getElementById('jobDetailsContent');
    jobDetailsContent.innerHTML = '';
    
    // Job details form - simplified for custom jobs only
    const detailsSection = document.createElement('div');
    detailsSection.className = 'job-section';
    detailsSection.innerHTML = `
        <h4>Custom Job Details</h4>
        <div class="form-group">
            <label>Job Description:</label>
            <input type="text" class="job-description" value="${job.name || ''}" 
                onchange="currentEstimate.jobs.find(j => j.id === ${job.id}).name = this.value">
        </div>
        <div class="form-group">
            <label>Estimated Days:</label>
            <input type="number" class="job-days" value="${job.days || 1}" min="0" step="0.5"
                onchange="currentEstimate.jobs.find(j => j.id === ${job.id}).days = this.value">
        </div>
        <div class="form-group">
            <label>Labor Cost ($):</label>
            <input type="number" class="job-labor" value="${job.labor || 0}" min="0" step="0.01"
                onchange="currentEstimate.jobs.find(j => j.id === ${job.id}).labor = parseFloat(this.value)">
        </div>
    `;
    jobDetailsContent.appendChild(detailsSection);
}
    
    // Job details form
    const detailsSection = document.createElement('div');
    detailsSection.className = 'job-section';
    detailsSection.innerHTML = `
        <h4>Job Details</h4>
        <div class="form-group">
            <label>Job Description:</label>
            <input type="text" class="job-description" value="${job.name}" 
                onchange="currentEstimate.jobs.find(j => j.id === ${job.id}).name = this.value">
        </div>
        <div class="form-group">
            <label>Estimated Days:</label>
            <input type="number" class="job-days" value="${job.days}" min="0" step="0.5"
                onchange="currentEstimate.jobs.find(j => j.id === ${job.id}).days = this.value">
        </div>
        <div class="form-group">
            <label>Labor Cost ($):</label>
            <input type="number" class="job-labor" value="${job.labor}" min="0" step="0.01"
                onchange="currentEstimate.jobs.find(j => j.id === ${job.id}).labor = parseFloat(this.value)">
        </div>
    `;
    jobDetailsContent.appendChild(detailsSection);
    
    // Show feedback when category is selected
    if (job.category) {
        const feedback = document.createElement('div');
        feedback.className = 'feedback-message success';
        feedback.innerHTML = `<i class="fas fa-check-circle"></i> ${priceSheet.categories[job.category].name} job added`;
        detailsSection.appendChild(feedback);
        
        // Remove feedback after 3 seconds
        setTimeout(() => {
            feedback.classList.add('fade-out');
            setTimeout(() => feedback.remove(), 300);
        }, 3000);
    }

function showNewEstimate() {
    dashboardView.classList.remove('active-view');
    newEstimateView.classList.add('active-view');
    dashboardBtn.classList.remove('active');
    newEstimateBtn.classList.add('active');
    resetEstimateForm();
}

function resetEstimateForm() {
    // Reset current estimate
    currentEstimate = {
        customer: {},
        jobs: [],
        fees: [],
        total: 0,
        waiveEstimateFee: false
    };
    
    // Add initial custom job
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
    
       
    // Reset form inputs
    customerInfoForm.reset();
    document.getElementById('discountPercentage').value = 0;
    document.getElementById('feesList').innerHTML = '';
    document.getElementById('customMaterialsList').innerHTML = '<p class="no-materials">No custom materials added yet</p>';

}

function initPhoneNumberFormatting() {
    customerPhone.addEventListener('input', function(e) {
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

function initCategorySelection() {
    categorySelection.innerHTML = '';
    
    // Only show the custom category card
    const categoryCard = document.createElement('div');
    categoryCard.className = 'category-card selected'; // Start selected
    categoryCard.setAttribute('data-category', 'custom');
    categoryCard.innerHTML = `
        <div class="category-icon">
            <i class="fas fa-pencil-alt"></i>
        </div>
        <div class="category-info">
            <h3>Custom</h3>
            <p>Create your own job</p>
        </div>
    `;
    
    categoryCard.addEventListener('click', function() {
        // For custom category, just show job details
        this.classList.add('selected');
        showJobDetails(currentJobId);
    });
    
    categorySelection.appendChild(categoryCard);
}

function getCategoryIcon(categoryId) {
    const icons = {
        custom: '<i class="fas fa-pencil-alt"></i>',
        bathroom: '<i class="fas fa-bath"></i>',
        kitchen: '<i class="fas fa-utensils"></i>',
        bedroom: '<i class="fas fa-bed"></i>',
        decking: '<i class="fas fa-border-all"></i>',
        garage: '<i class="fas fa-warehouse"></i>',
        basement: '<i class="fas fa-boxes"></i>',
        flooring: '<i class="fas fa-th-large"></i>',
        concrete: '<i class="fas fa-border-style"></i>',
        glass: '<i class="fas fa-window-maximize"></i>',
        repairs: '<i class="fas fa-tools"></i>'
    };
    
    return icons[categoryId] || '';
}

function showJobDetails(categoryId) {
    const selectedCategories = document.querySelectorAll('.category-card.selected');
    
    if (selectedCategories.length > 0) {
        jobDetailsContainer.style.display = 'block';
        jobDetailsContent.innerHTML = '';
        
        selectedCategories.forEach(card => {
            const categoryName = card.querySelector('h3').textContent;
            const categoryId = card.getAttribute('data-category');
            const category = priceSheet.categories[categoryId];
            
            const categorySection = document.createElement('div');
            categorySection.className = 'job-option';
            categorySection.innerHTML = `
                <h4>${category.name}</h4>
            `;
            
            if (categoryId === 'custom') {
                // Custom job input fields
                categorySection.innerHTML += `
                    <div class="form-group">
                        <label>Job Description:</label>
                        <input type="text" id="customJobName" placeholder="Describe the work">
                    </div>
                    <div class="form-group">
                        <label>Estimated Days:</label>
                        <input type="number" id="customJobDays" min="0" step="0.5" value="1">
                    </div>
                    <div class="form-group">
                        <label>Labor Cost ($):</label>
                        <input type="number" id="customJobLabor" min="0" step="0.01" value="0">
                    </div>
                    <button onclick="addCustomJob('${categoryId}')">Add Custom Job</button>
                `;
            } else {
                // Existing job selection logic
                category.jobs.forEach((job, index) => {
                    const jobId = `${categoryId}-job-${index}`;
                    
                    const jobOption = document.createElement('div');
                    jobOption.innerHTML = `
                        <label>
                            <input type="radio" name="${categoryId}" value="${index}" 
                                onchange="updateSelectedJob('${categoryId}', ${index})">
                            ${job.name} (${job.days} days) - ${job.labor}
                        </label>
                    `;
                    
                    if (job.days.includes('-')) {
                        const [minDays, maxDays] = job.days.split('-').map(Number);
                        const daysSelect = document.createElement('div');
                        daysSelect.className = 'days-selection';
                        daysSelect.innerHTML = `
                            <label>Days:</label>
                            <select id="${jobId}-days" onchange="updateJobDays('${categoryId}', ${index}, this.value)">
                                ${Array.from({length: maxDays - minDays + 1}, (_, i) => 
                                    `<option value="${minDays + i}">${minDays + i}</option>`).join('')}
                            </select>
                        `;
                        jobOption.appendChild(daysSelect);
                    }
                    
                    categorySection.appendChild(jobOption);
                });
            }
            
            jobDetailsContent.appendChild(categorySection);
        });
    } else {
        jobDetailsContainer.style.display = 'none';
    }
}


function addCustomJob(categoryId) {
    const name = document.getElementById('customJobName').value.trim();
    const days = parseFloat(document.getElementById('customJobDays').value) || 1;
    const labor = parseFloat(document.getElementById('customJobLabor').value) || 0;
    
    if (!name) {
        alert('Please enter a job description');
        return;
    }
    
    // Remove any existing job for this category
    currentEstimate.jobs = currentEstimate.jobs.filter(j => j.category !== categoryId);
    
    // Add the new custom job
    currentEstimate.jobs.push({
        category: categoryId,
        name: name,
        days: days,
        labor: labor
    });
    
    // Create and show feedback element
    const feedback = document.createElement('div');
    feedback.className = 'feedback-message success';
    feedback.innerHTML = `<i class="fas fa-check-circle"></i> Custom job added: ${name}`;
    
    // Find the custom job section and append feedback
    const customJobSection = document.querySelector('.job-option');
    if (customJobSection) {
        // Remove any existing feedback first
        const existingFeedback = customJobSection.querySelector('.feedback-message');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        customJobSection.appendChild(feedback);
    }
    
    // Remove feedback after 3 seconds
    setTimeout(() => {
        feedback.classList.add('fade-out');
        setTimeout(() => feedback.remove(), 300);
    }, 3000);
    
    updateEstimatePreview();
}

function updateSelectedJob(categoryId, jobIndex) {
    const category = priceSheet.categories[categoryId];
    const job = category.jobs[jobIndex];
    
    // Remove any existing job for this category
    currentEstimate.jobs = currentEstimate.jobs.filter(j => j.category !== categoryId);
    
    // Parse labor cost
    let laborCost = 0;
    if (job.labor.includes('-')) {
        const [min, max] = job.labor.replace(/[$,]/g, '').split('-').map(Number);
        const days = job.days.includes('-') ? 
            parseInt(document.getElementById(`${categoryId}-job-${jobIndex}-days`).value) : 
            parseInt(job.days);
        
        // Calculate cost based on days (simple linear interpolation)
        const [minDays, maxDays] = job.days.split('-').map(Number);
        const ratio = (days - minDays) / (maxDays - minDays);
        laborCost = min + ((max - min) * ratio);
        
        // Ensure labor cost is never negative
        laborCost = Math.max(0, laborCost);
    } else {
        laborCost = Math.max(0, parseFloat(job.labor.replace(/[$,]/g, '')));
    }
    
    // Add the new job
    currentEstimate.jobs.push({
        category: categoryId,
        name: job.name,
        days: job.days.includes('-') ? 
            document.getElementById(`${categoryId}-job-${jobIndex}-days`).value : 
            job.days,
        labor: laborCost
    });
    
    updateEstimatePreview();
}

function updateJobField(categoryId, jobIndex, field, value) {
    if (field === 'labor') {
        value = Math.max(0, parseFloat(value));
    } else if (field === 'days') {
        value = Math.max(0, parseFloat(value));
    }
    currentEstimate.jobs[jobIndex][field] = value;
}

function updateJobDays(categoryId, jobIndex, days) {
    // Find the job in currentEstimate and update days
    const job = currentEstimate.jobs.find(j => 
        j.category === categoryId && j.name === priceSheet.categories[categoryId].jobs[jobIndex].name);
    
    if (job) {
        job.days = days;
        updateSelectedJob(categoryId, jobIndex); // Recalculate labor cost
    }
}

function nextStep(step) {
    // Validate current step before proceeding
    if (step === 2 && !validateCustomerInfo()) return;
    if (step === 3 && currentEstimate.jobs.length === 0) {
        alert('Please select at least one job');
        return;
    }
    
    // Hide current step
    document.querySelector(`.estimate-step.active-step`).classList.remove('active-step');
    
    // Show next step
    document.getElementById(`${getStepName(step)}Step`).classList.add('active-step');
    
    // Update progress indicator
    document.querySelector('.progress-step.active').classList.remove('active');
    document.querySelector(`.progress-step[data-step="${step}"]`).classList.add('active');
    
    // If moving to materials step, initialize materials
    if (step === 3) {
        initMaterialsSelection();
        updateCustomMaterialsList(); // Add this line
    }
    
    // If moving to review step, update preview
    if (step === 4) {
        updateEstimatePreview();
    }
}

function prevStep(step) {
    // Hide current step
    document.querySelector(`.estimate-step.active-step`).classList.remove('active-step');
    
    // Show previous step
    document.getElementById(`${getStepName(step)}Step`).classList.add('active-step');
    
    // Update progress indicator
    document.querySelector('.progress-step.active').classList.remove('active');
    document.querySelector(`.progress-step[data-step="${step}"]`).classList.add('active');
}

function getStepName(step) {
    switch(step) {
        case 1: return 'customerInfo';
        case 2: return 'jobSelection';
        case 3: return 'materials';
        case 4: return 'review';
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

function initMaterialsSelection() {
    materialsContainer.innerHTML = '';
    
    // Show current job tab
    const materialsHeader = document.createElement('div');
    materialsHeader.className = 'materials-header';
    materialsHeader.innerHTML = `
        <h3>Materials for Job ${currentJobId}</h3>
        <div class="job-tabs-mini" id="jobTabsMini"></div>
    `;
    materialsContainer.appendChild(materialsHeader);
    
    // Populate mini job tabs
    const jobTabsMini = document.getElementById('jobTabsMini');
    currentEstimate.jobs.forEach(job => {
        const tab = document.createElement('div');
        tab.className = `job-tab-mini ${job.id === currentJobId ? 'active' : ''}`;
        tab.textContent = `Job ${job.id}`;
        tab.onclick = () => {
            currentJobId = job.id;
            initMaterialsSelection();
        };
        jobTabsMini.appendChild(tab);
    });
    
    // Get current job
    const job = currentEstimate.jobs.find(j => j.id === currentJobId);
    if (!job) return;
    
    // Get materials from selected category
    if (job.category && priceSheet.categories[job.category]) {
        const category = priceSheet.categories[job.category];
        
        for (const [materialName, price] of Object.entries(category.materials)) {
            const existingMat = job.materials.find(m => m.name === materialName);
            
            const materialItem = document.createElement('div');
            materialItem.className = 'material-item';
            materialItem.innerHTML = `
                <div class="material-info">
                    <h4>${materialName}</h4>
                    <p>$${formatAccounting(price)}</p>
                </div>
                <div class="material-qty">
                    <button class="qty-btn minus" onclick="adjustMaterialQty('${materialName}', -1, ${job.id})">-</button>
                    <input type="number" id="qty-${job.id}-${materialName.replace(/\s+/g, '-')}" 
                        value="${existingMat ? existingMat.quantity : 0}" min="0" 
                        onchange="updateMaterialQty('${materialName}', this.value, ${job.id})">
                    <button class="qty-btn plus" onclick="adjustMaterialQty('${materialName}', 1, ${job.id})">+</button>
                </div>
            `;
            
            materialsContainer.appendChild(materialItem);
        }
    }
    
    // Custom materials section
    const customMaterialsSection = document.createElement('div');
    customMaterialsSection.className = 'custom-materials';
    customMaterialsSection.innerHTML = `
        <h3>Custom Materials</h3>
        <div id="customMaterialsList-${job.id}" class="custom-materials-list">
            ${job.customMaterials.length > 0 ? 
                job.customMaterials.map(mat => `
                    <div class="custom-material-item">
                        <span>${mat.name} (${mat.quantity} @ $${formatAccounting(mat.price)}) = $${formatAccounting(mat.total)}</span>
                        <button onclick="removeCustomMaterial(${job.id}, '${mat.name}')"><i class="fas fa-times"></i></button>
                    </div>
                `).join('') : 
                '<p class="no-materials">No custom materials added yet</p>'}
        </div>
        <div class="custom-material-form">
            <input type="text" id="customMaterialName-${job.id}" placeholder="Material Name">
            <input type="number" id="customMaterialPrice-${job.id}" placeholder="Price" min="0" step="0.01">
            <input type="number" id="customMaterialQty-${job.id}" placeholder="Qty" min="1" value="1">
            <button onclick="addCustomMaterialToEstimate(${job.id})">Add Material</button>
        </div>
    `;
    materialsContainer.appendChild(customMaterialsSection);
    
    // Job discount
    const discountSection = document.createElement('div');
    discountSection.className = 'job-discount-section';
    discountSection.innerHTML = `
        <h3>Job Discount</h3>
        <div class="discount-controls">
            <input type="number" id="jobDiscount-${job.id}" min="0" max="100" 
                value="${job.discountPercentage}" placeholder="Discount %">
            <button onclick="applyJobDiscount(${job.id})">Apply Discount</button>
        </div>
        <div id="jobDiscountDisplay-${job.id}" class="discount-display">
            ${job.discountPercentage > 0 ? 
                `${job.discountPercentage}% Discount Applied` : 
                'No discount applied'}
        </div>
    `;
    materialsContainer.appendChild(discountSection);
}

function applyJobDiscount(jobId) {
    const job = currentEstimate.jobs.find(j => j.id === jobId);
    if (!job) return;
    
    const discountValue = parseFloat(document.getElementById(`jobDiscount-${jobId}`).value) || 0;
    job.discountPercentage = Math.min(100, Math.max(0, discountValue));
    
    const discountDisplay = document.getElementById(`jobDiscountDisplay-${jobId}`);
    if (job.discountPercentage > 0) {
        discountDisplay.textContent = `${job.discountPercentage}% Discount Applied`;
        discountDisplay.classList.add('active');
    } else {
        discountDisplay.textContent = 'No discount applied';
        discountDisplay.classList.remove('active');
    }
    
    updateEstimatePreview();
}

function adjustMaterialQty(materialName, change) {
    const input = document.getElementById(`qty-${materialName.replace(/\s+/g, '-')}`);
    let newVal = parseInt(input.value) + change;
    if (newVal < 0) newVal = 0;
    input.value = newVal;
    updateMaterialQty(materialName, newVal);
}

function updateMaterialQty(materialName, qty) {
    qty = parseInt(qty);
    if (isNaN(qty) || qty < 0) qty = 0;
    
    // Find the material in currentEstimate
    const materialIndex = currentEstimate.materials.findIndex(m => m.name === materialName);
    
    if (qty > 0) {
        // Add or update material
        const price = getMaterialPrice(materialName);
        if (materialIndex >= 0) {
            currentEstimate.materials[materialIndex].quantity = qty;
            currentEstimate.materials[materialIndex].total = price * qty;
        } else {
            currentEstimate.materials.push({
                name: materialName,
                price: price,
                quantity: qty,
                total: price * qty
            });
        }
    } else if (materialIndex >= 0) {
        // Remove material if quantity is 0
        currentEstimate.materials.splice(materialIndex, 1);
    }
    
    updateEstimatePreview();
}

function getMaterialPrice(materialName) {
    // Search through all categories to find the material price
    for (const category of Object.values(priceSheet.categories)) {
        if (category.materials[materialName] !== undefined) {
            return category.materials[materialName];
        }
    }
    return 0;
}

function addCustomMaterialToEstimate() {
    const name = document.getElementById('customMaterialName').value.trim();
    const price = parseFloat(document.getElementById('customMaterialPrice').value);
    const qty = parseInt(document.getElementById('customMaterialQty').value);
    
    if (!name || isNaN(price) || price <= 0 || isNaN(qty) || qty <= 0) {
        alert('Please enter valid material details');
        return;
    }
    
    // Add custom material
    currentEstimate.customMaterials.push({
        name: name,
        price: price,
        quantity: qty,
        total: price * qty
    });
    
    // Update custom materials list display
    updateCustomMaterialsList();
    
    // Clear form
    document.getElementById('customMaterialName').value = '';
    document.getElementById('customMaterialPrice').value = '';
    document.getElementById('customMaterialQty').value = '1';
    
    updateEstimatePreview();
}

function addFee() {
    const name = document.getElementById('feeName').value.trim();
    const amount = parseFloat(document.getElementById('feeAmount').value);
    
    if (!name || isNaN(amount)) {
        alert('Please enter valid fee details');
        return;
    }
    
    if (!currentEstimate.fees) {
        currentEstimate.fees = [];
    }
    
    currentEstimate.fees.push({
        name: name,
        amount: amount
    });
    
    document.getElementById('feeName').value = '';
    document.getElementById('feeAmount').value = '';
    
    updateFeesList();
    updateEstimatePreview();
}

function updateFeesList() {
    const feesList = document.getElementById('feesList');
    feesList.innerHTML = '';
    
    if (!currentEstimate.fees || currentEstimate.fees.length === 0) {
        return;
    }
    
    currentEstimate.fees.forEach((fee, index) => {
        const feeItem = document.createElement('div');
        feeItem.className = 'fee-row';
        feeItem.innerHTML = `
            <span>${fee.name}</span>
            <span>$${formatAccounting(fee.amount)}</span>
            <button onclick="removeFee(${index})"><i class="fas fa-times"></i></button>
        `;
        feesList.appendChild(feeItem);
    });
}

function removeFee(index) {
    currentEstimate.fees.splice(index, 1);
    updateFeesList();
    updateEstimatePreview();
}

function updateDiscount() {
    currentEstimate.discountPercentage = parseFloat(document.getElementById('discountPercentage').value) || 0;
    updateEstimatePreview();
}

function updateEstimatePreview() {
    // Calculate subtotals
    const laborTotal = currentEstimate.jobs.reduce((sum, job) => sum + job.labor, 0);
    const materialsTotal = currentEstimate.materials.reduce((sum, mat) => sum + mat.total, 0);
    const customMaterialsTotal = currentEstimate.customMaterials.reduce((sum, mat) => sum + mat.total, 0);
    const feesTotal = (currentEstimate.fees ? currentEstimate.fees.reduce((sum, fee) => sum + fee.amount, 0) : 0);
    
    // Get the current waiver status
    const waiveFee = currentEstimate.waiveEstimateFee || false;
    const estimateFee = waiveFee ? -75:75;
    
    const subtotal = laborTotal + materialsTotal + customMaterialsTotal + feesTotal;
    const discount = currentEstimate.discountPercentage ? (subtotal * currentEstimate.discountPercentage / 100) : 0;
    const total = subtotal - discount + estimateFee;
    
    currentEstimate.total = total;
    
    // Generate preview HTML
    let html = `
        <div class="estimate-section">
            <h3>Customer Information</h3>
            <div class="estimate-row">
                <span>Name:</span>
                <span>${currentEstimate.customer.name || 'Not provided'}</span>
            </div>
            <div class="estimate-row">
                <span>Email:</span>
                <span>${currentEstimate.customer.email || 'Not provided'}</span>
            </div>
            <div class="estimate-row">
                <span>Phone:</span>
                <span>${currentEstimate.customer.phone || 'Not provided'}</span>
            </div>
            <div class="estimate-row">
                <span>Job Location:</span>
                <span>${currentEstimate.customer.location || 'Not provided'}</span>
            </div>
        </div>
        
        <div class="estimate-section">
            <h3>Jobs</h3>
            ${currentEstimate.jobs.map(job => {
                const categoryName = priceSheet.categories[job.category].name;
                return `
                    <div class="estimate-row">
                        <span>${categoryName} - ${job.name} (${job.days} days)</span>
                        <span>$${formatAccounting(job.labor)}</span>
                    </div>
                `;
            }).join('')}
            <div class="estimate-row estimate-total-row">
                <span>Total Labor:</span>
                <span>$${formatAccounting(laborTotal)}</span>
            </div>
        </div>
        
        <div class="estimate-section">
            <h3>Materials</h3>
            ${currentEstimate.materials.length > 0 ? 
                currentEstimate.materials.map(mat => `
                    <div class="estimate-row">
                        <span>${mat.name} (${mat.quantity} @ $${formatAccounting(mat.price)})</span>
                        <span>$${formatAccounting(mat.total)}</span>
                    </div>
                `).join('') : '<p>No materials selected</p>'}
            ${currentEstimate.customMaterials.length > 0 ? 
                currentEstimate.customMaterials.map(mat => `
                    <div class="estimate-row">
                        <span>${mat.name} (Custom) (${mat.quantity} @ $${formatAccounting(mat.price)})</span>
                        <span>$${formatAccounting(mat.total)}</span>
                    </div>
                `).join('') : ''}
            <div class="estimate-row estimate-total-row">
                <span>Total Materials:</span>
                <span>$${formatAccounting(materialsTotal + customMaterialsTotal)}</span>
            </div>
        </div>
        
        <div class="estimate-section">
            <h3>Fees</h3>
            ${currentEstimate.fees && currentEstimate.fees.length > 0 ? 
                currentEstimate.fees.map(fee => `
                    <div class="estimate-row">
                        <span>${fee.name}</span>
                        <span>$${formatAccounting(fee.amount)}</span>
                    </div>
                `).join('') : '<p>No fees added</p>'}
            <div class="estimate-row">
                <span>Estimate Fee:</span>
                <span>${waiveFee ? 'Waived (-$75.00)' : '$75.00'}</span>
            </div>
            <div class="estimate-row estimate-total-row">
                <span>Total Fees:</span>
                <span>$${formatAccounting(feesTotal + estimateFee)}</span>
            </div>
        </div>
        
        ${currentEstimate.discountPercentage > 0 ? `
            <div class="estimate-section">
                <div class="estimate-row">
                    <span>Subtotal:</span>
                    <span>$${formatAccounting(subtotal)}</span>
                </div>
                <div class="estimate-row">
                    <span>Discount (${currentEstimate.discountPercentage}%):</span>
                    <span>-$${formatAccounting(discount)}</span>
                </div>
            </div>
        ` : ''}
        
        <div class="estimate-section">
            <div class="estimate-row estimate-total-row">
                <span>Total Estimate:</span>
                <span>$${formatAccounting(total)}</span>
            </div>
        </div>
    `;
    
    estimatePreview.innerHTML = html;
}

function saveEstimate() {
    if (!currentEstimate.customer.name || currentEstimate.jobs.length === 0) {
        alert('Please complete all required fields and select at least one job');
        return;
    }

    // Get the current waiver status from the button state
    const waiveFeeBtn = document.getElementById('waiveEstimateFeeBtn');
    currentEstimate.waiveEstimateFee = waiveFeeBtn.classList.contains('active');
    
    // Add timestamp with proper date formatting
    currentEstimate.createdAt = new Date().toISOString();
    currentEstimate.updatedAt = currentEstimate.createdAt;

    // Calculate total before saving
    currentEstimate.total = calculateEstimateTotal(currentEstimate);

    // Save to Firestore (automatically generates ID)
    db.collection("estimates").add(currentEstimate)
        .then(() => {
            alert('Estimate saved successfully!');
            showDashboard();
            loadEstimates(); // Explicitly reload estimates to show the new one
        })
        .catch(error => {
            console.error('Error saving estimate:', error);
            alert('Error saving estimate. Please try again.');
        });
}

function saveEstimateChanges() {
    if (!currentEstimate.customer.name || currentEstimate.jobs.length === 0) {
        alert('Please complete all required fields and select at least one job');
        return;
    }

    // Update customer info from edit fields
    currentEstimate.customer = {
        name: document.getElementById('editCustomerName').value,
        email: document.getElementById('editCustomerEmail').value,
        phone: document.getElementById('editCustomerPhone').value,
        location: document.getElementById('editJobLocation').value
    };

    // Update discount percentage
    currentEstimate.discountPercentage = parseFloat(document.getElementById('editDiscountPercentage').value) || 0;

    // Recalculate total
    currentEstimate.total = calculateEstimateTotal(currentEstimate);

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
            loadEstimates(); // This will refresh the dashboard
            openEstimateModal(currentEstimate);
        })
        .catch(error => {
            console.error('Error updating estimate:', error);
            alert('Error updating estimate. Please try again.');
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
                // Ensure total is calculated if missing
                if (typeof estimateData.total === 'undefined') {
                    estimateData.total = calculateEstimateTotal(estimateData);
                }
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

// Helper function
function calculateEstimateTotal(estimate) {
    const laborTotal = estimate.jobs.reduce((sum, job) => sum + (job.labor || 0), 0);
    const materialsTotal = estimate.materials.reduce((sum, mat) => sum + (mat.total || 0), 0);
    const customMaterialsTotal = estimate.customMaterials.reduce((sum, mat) => sum + (mat.total || 0), 0);
    const feesTotal = estimate.fees ? estimate.fees.reduce((sum, fee) => sum + (fee.amount || 0), 0) : 0;
    
    // Check if the estimate fee is waived (default to false if not set)
    const waiveFee = estimate.waiveEstimateFee || false;
    const estimateFee = waiveFee ? -75:75;
    
    const subtotal = laborTotal + materialsTotal + customMaterialsTotal + feesTotal;
    const discount = estimate.discountPercentage ? (subtotal * estimate.discountPercentage / 100) : 0;
    return subtotal - discount + estimateFee;
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
    
    // Sort by date (newest first)
    estimates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
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

function applyDiscount() {
    const discountValue = parseFloat(document.getElementById('discountPercentage').value) || 0;
    currentEstimate.discountPercentage = Math.min(100, Math.max(0, discountValue));
    
    const discountDisplay = document.getElementById('discountDisplay');
    if (currentEstimate.discountPercentage > 0) {
        discountDisplay.innerHTML = `
            <span class="discount-value">${currentEstimate.discountPercentage}% Discount Applied</span>
            <button onclick="removeDiscount()" class="remove-discount"><i class="fas fa-times"></i></button>
        `;
        discountDisplay.classList.add('active');
    } else {
        discountDisplay.innerHTML = 'No discount applied';
        discountDisplay.classList.remove('active');
    }
    
    updateEstimatePreview();
}

function removeDiscount() {
    document.getElementById('discountPercentage').value = 0;
    currentEstimate.discountPercentage = 0;
    document.getElementById('discountDisplay').innerHTML = 'No discount applied';
    document.getElementById('discountDisplay').classList.remove('active');
    updateEstimatePreview();
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
    `;
    
    estimate.jobs.forEach(job => {
        const categoryName = priceSheet.categories[job.category].name;
        html += `
            <div class="estimate-row">
                <span>${categoryName} - ${job.name} (${job.days} days)</span>
                <span>$${formatAccounting(job.labor)}</span>
            </div>
        `;
    });
    
    html += `
            <div class="estimate-row estimate-total-row">
                <span>Total Labor:</span>
                <span>$${formatAccounting(estimate.jobs.reduce((sum, job) => sum + job.labor, 0))}</span>
            </div>
        </div>
        
        <div class="estimate-section">
            <h3>Materials</h3>
    `;
    
    if (estimate.materials.length === 0 && estimate.customMaterials.length === 0) {
        html += `<p>No materials selected</p>`;
    } else {
        estimate.materials.forEach(mat => {
            html += `
                <div class="estimate-row">
                    <span>${mat.name} (${mat.quantity} @ $${formatAccounting(mat.price)})</span>
                    <span>$${formatAccounting(mat.total)}</span>
                </div>
            `;
        });
        
        estimate.customMaterials.forEach(mat => {
            html += `
                <div class="estimate-row">
                    <span>${mat.name} (Custom) (${mat.quantity} @ $${formatAccounting(mat.price)})</span>
                    <span>$${formatAccounting(mat.total)}</span>
                </div>
            `;
        });
    }
    
    // Add fees section if any fees exist
    if (estimate.fees && estimate.fees.length > 0) {
        html += `
            <div class="estimate-section">
                <h3>Fees</h3>
        `;
        
        estimate.fees.forEach(fee => {
            html += `
                <div class="estimate-row">
                    <span>${fee.name}</span>
                    <span>$${formatAccounting(fee.amount)}</span>
                </div>
            `;
        });
        
        const feesTotal = estimate.fees.reduce((sum, fee) => sum + fee.amount, 0);
        
        html += `
                <div class="estimate-row estimate-total-row">
                    <span>Total Fees:</span>
                    <span>$${formatAccounting(feesTotal)}</span>
                </div>
            </div>
        `;
    }
    

  // Calculate totals with the waiver status
    const laborTotal = estimate.jobs.reduce((sum, job) => sum + job.labor, 0);
    const materialsTotal = estimate.materials.reduce((sum, mat) => sum + mat.total, 0);
    const customMaterialsTotal = estimate.customMaterials.reduce((sum, mat) => sum + mat.total, 0);
    const feesTotal = estimate.fees ? estimate.fees.reduce((sum, fee) => sum + fee.amount, 0) : 0;
    const waiveFee = estimate.waiveEstimateFee || false;
    const estimateFee = waiveFee ? -75:75;
    const subtotal = laborTotal + materialsTotal + customMaterialsTotal + feesTotal;
    const discount = estimate.discountPercentage ? (subtotal * estimate.discountPercentage / 100) : 0;
    const total = subtotal - discount + estimateFee;
    
    // Add subtotal and discount if discount exists
    if (estimate.discountPercentage > 0) {
        html += `
            <div class="estimate-section">
                <div class="estimate-row">
                    <span>Subtotal:</span>
                    <span>$${formatAccounting(subtotal)}</span>
                </div>
                <div class="estimate-row">
                    <span>Discount (${estimate.discountPercentage}%):</span>
                    <span>-$${formatAccounting(discount)}</span>
                </div>
            </div>
        `;
    }
    
    html += `
        <div class="estimate-section">
            <div class="estimate-row estimate-total-row">
                <span>Total Estimate:</span>
                <span>$${formatAccounting(total)}</span>
            </div>
        </div>
    `;
    
    modalContent.innerHTML = html;
    estimateModal.style.display = 'block';
    
    // Store the current estimate ID for editing/deleting
    modalContent.dataset.estimateId = estimate.id;
}

function closeEstimateModal() {
    estimateModal.style.display = 'none';
}

function editEstimate() {
    const estimateId = modalContent.dataset.estimateId;
    const estimateData = JSON.parse(modalContent.dataset.estimateData);
    
    // Create a new object that combines the document data with the ID
    currentEstimate = {
        id: estimateId,
        ...estimateData
    };
    
    // Ensure we have the latest data
    db.collection("estimates").doc(estimateId).get()
        .then(doc => {
            if (doc.exists) {
                currentEstimate = {
                    id: doc.id,
                    ...doc.data()
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
        })
        .catch(error => {
            console.error('Error loading estimate for editing:', error);
            alert('Error loading estimate for editing');
        });
}

function showEditFields(estimate) {
    editFieldsContainer.style.display = 'block';
    editFieldsContainer.innerHTML = `
        <div class="estimate-section">
            <h3>Edit Customer Information</h3>
            <div class="form-group">
                <label>Name:</label>
                <input type="text" class="editable-field" id="editCustomerName" value="${estimate.customer.name || ''}">
            </div>
            <div class="form-group">
                <label>Email:</label>
                <input type="email" class="editable-field" id="editCustomerEmail" value="${estimate.customer.email || ''}">
            </div>
            <div class="form-group">
                <label>Phone:</label>
                <input type="tel" class="editable-field" id="editCustomerPhone" value="${estimate.customer.phone || ''}">
            </div>
            <div class="form-group">
                <label>Job Location:</label>
                <input type="text" class="editable-field" id="editJobLocation" value="${estimate.customer.location || ''}">
            </div>
        </div>
        
        <div class="estimate-section">
            <h3>Edit Jobs</h3>
            <div id="editJobsContainer"></div>
        </div>
        
        <div class="estimate-section">
            <h3>Edit Materials</h3>
            <div id="editMaterialsContainer"></div>
        </div>
        
        <div class="estimate-section">
            <h3>Edit Fees & Discount</h3>
            <div class="form-group">
                <label>Discount Percentage:</label>
                <input type="number" class="editable-field" id="editDiscountPercentage" 
                    min="0" max="100" value="${estimate.discountPercentage || 0}">
            </div>
            <div id="editFeesContainer"></div>
            <button type="button" class="btn-next" onclick="addNewFeeField()">Add New Fee</button>
        </div>
    `;
    
    // Populate jobs
    const jobsContainer = document.getElementById('editJobsContainer');
    estimate.jobs.forEach((job, index) => {
        const categoryName = priceSheet.categories[job.category].name;
        const jobOptions = priceSheet.categories[job.category].jobs.map((j, i) => 
            `<option value="${i}" ${i === index ? 'selected' : ''}>${j.name}</option>`
        ).join('');
        
        jobsContainer.innerHTML += `
            <div class="job-edit-section">
                <h4>${categoryName}</h4>
                <div class="form-group">
                    <label>Job Type:</label>
                    <select class="editable-select" onchange="updateJobSelection('${job.category}', ${index}, this.value)">
                        ${jobOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>Days:</label>
                    <input type="text" class="editable-field" value="${job.days}" 
                        onchange="updateJobField('${job.category}', ${index}, 'days', this.value)">
                </div>
                <div class="form-group">
                    <label>Labor Cost ($):</label>
                    <input type="number" class="editable-field" value="${job.labor}" 
                        onchange="updateJobField('${job.category}', ${index}, 'labor', this.value)">
                </div>
                <div class="form-group">
                    <label>Scope of Work:</label>
                    <textarea class="editable-field" style="width: 100%; min-height: 80px;"
                        onchange="updateJobField('${job.category}', ${index}, 'name', this.value)">${job.name}</textarea>
                </div>
            </div>
        `;
    });
    
    // Populate materials
    const materialsContainer = document.getElementById('editMaterialsContainer');
    materialsContainer.innerHTML = `
        <h4>Standard Materials</h4>
        <div class="edit-materials-list" id="editStandardMaterials"></div>
        <h4>Custom Materials</h4>
        <div class="edit-materials-list" id="editCustomMaterials"></div>
        <button type="button" class="btn-next" onclick="addNewCustomMaterialField()">Add Custom Material</button>
    `;
    
    // Standard materials
    const standardMaterialsContainer = document.getElementById('editStandardMaterials');
    estimate.materials.forEach((mat, index) => {
        standardMaterialsContainer.innerHTML += `
            <div class="edit-material-item">
                <div style="flex: 1;">
                    <div class="form-group">
                        <label>Name:</label>
                        <input type="text" class="editable-field" value="${mat.name}" 
                            onchange="updateMaterialField(${index}, false, 'name', this.value)">
                    </div>
                </div>
                <div style="margin-left: 15px;">
                    <div class="form-group">
                        <label>Price:</label>
                        <input type="number" class="editable-field" value="${mat.price}" 
                            onchange="updateMaterialField(${index}, false, 'price', this.value)">
                    </div>
                </div>
                <div style="margin-left: 15px;">
                    <div class="form-group">
                        <label>Qty:</label>
                        <input type="number" class="editable-field" value="${mat.quantity}" 
                            onchange="updateMaterialField(${index}, false, 'quantity', this.value)">
                    </div>
                </div>
            </div>
        `;
    });
    
    // Custom materials
    const customMaterialsContainer = document.getElementById('editCustomMaterials');
    estimate.customMaterials.forEach((mat, index) => {
        customMaterialsContainer.innerHTML += `
            <div class="edit-material-item">
                <div style="flex: 1;">
                    <div class="form-group">
                        <label>Name:</label>
                        <input type="text" class="editable-field" value="${mat.name}" 
                            onchange="updateMaterialField(${index}, true, 'name', this.value)">
                    </div>
                </div>
                <div style="margin-left: 15px;">
                    <div class="form-group">
                        <label>Price:</label>
                        <input type="number" class="editable-field" value="${mat.price}" 
                            onchange="updateMaterialField(${index}, true, 'price', this.value)">
                    </div>
                </div>
                <div style="margin-left: 15px;">
                    <div class="form-group">
                        <label>Qty:</label>
                        <input type="number" class="editable-field" value="${mat.quantity}" 
                            onchange="updateMaterialField(${index}, true, 'quantity', this.value)">
                    </div>
                </div>
                <button class="qty-btn" onclick="removeMaterial(${index}, true)"><i class="fas fa-trash"></i></button>
            </div>
        `;
    });
    
    // Fees
    const feesContainer = document.getElementById('editFeesContainer');
    estimate.fees?.forEach((fee, index) => {
        feesContainer.innerHTML += `
            <div class="edit-material-item">
                <div style="flex: 1;">
                    <div class="form-group">
                        <label>Fee Name:</label>
                        <input type="text" class="editable-field" value="${fee.name}" 
                            onchange="updateFeeField(${index}, 'name', this.value)">
                    </div>
                </div>
                <div style="margin-left: 15px;">
                    <div class="form-group">
                        <label>Amount:</label>
                        <input type="number" class="editable-field" value="${fee.amount}" 
                            onchange="updateFeeField(${index}, 'amount', this.value)">
                    </div>
                </div>
                <button class="qty-btn" onclick="removeFee(${index})"><i class="fas fa-trash"></i></button>
            </div>
        `;
    });
}

// Add these new functions for editing
function updateJobSelection(categoryId, jobIndex, newJobIndex) {
    newJobIndex = parseInt(newJobIndex);
    const job = priceSheet.categories[categoryId].jobs[newJobIndex];
    
    // Update the job in currentEstimate
    currentEstimate.jobs[jobIndex] = {
        ...currentEstimate.jobs[jobIndex],
        name: job.name,
        days: job.days,
        labor: parseFloat(job.labor.replace(/[^0-9.-]+/g,""))
    };
    
    // Update the display
    showEditFields(currentEstimate);
}

function updateJobField(categoryId, jobIndex, field, value) {
    if (field === 'labor') value = parseFloat(value);
    currentEstimate.jobs[jobIndex][field] = value;
}

function updateMaterialField(index, isCustom, field, value) {
    if (field === 'price' || field === 'quantity') {
        value = Math.max(0, parseFloat(value));
    }
    
    if (isCustom) {
        currentEstimate.customMaterials[index][field] = value;
        currentEstimate.customMaterials[index].total = 
            currentEstimate.customMaterials[index].price * currentEstimate.customMaterials[index].quantity;
    } else {
        currentEstimate.materials[index][field] = value;
        currentEstimate.materials[index].total = 
            currentEstimate.materials[index].price * currentEstimate.materials[index].quantity;
    }
}

function addCustomMaterialToEstimate() {
    const name = document.getElementById('customMaterialName').value.trim();
    const price = parseFloat(document.getElementById('customMaterialPrice').value);
    const qty = parseInt(document.getElementById('customMaterialQty').value);
    
    if (!name || isNaN(price) || price <= 0 || isNaN(qty) || qty <= 0) {
        alert('Please enter valid material details');
        return;
    }
    
    // Add custom material
    currentEstimate.customMaterials.push({
        name: name,
        price: price,
        quantity: qty,
        total: price * qty
    });
    
    // Update custom materials list display
    updateCustomMaterialsList();
    
    // Clear form
    document.getElementById('customMaterialName').value = '';
    document.getElementById('customMaterialPrice').value = '';
    document.getElementById('customMaterialQty').value = '1';
    
    updateEstimatePreview();
}

function updateCustomMaterialsList() {
    const container = document.getElementById('customMaterialsList');
    container.innerHTML = '';
    
    if (currentEstimate.customMaterials.length === 0) {
        container.innerHTML = '<p class="no-materials">No custom materials added yet</p>';
        return;
    }
    
    currentEstimate.customMaterials.forEach((mat, index) => {
        const item = document.createElement('div');
        item.className = 'custom-material-item';
        item.innerHTML = `
            <span>${mat.name} (${mat.quantity} @ $${formatAccounting(mat.price)}) = $${formatAccounting(mat.total)}</span>
            <button onclick="removeCustomMaterial(${index})"><i class="fas fa-times"></i></button>
        `;
        container.appendChild(item);
    });
}

function removeCustomMaterial(index) {
    currentEstimate.customMaterials.splice(index, 1);
    updateCustomMaterialsList();
    updateEstimatePreview();
}

function updateFeeField(index, field, value) {
    if (field === 'amount') {
        value = Math.max(0, parseFloat(value));
    }
    currentEstimate.fees[index][field] = value;
}

function addNewFeeField() {
    if (!currentEstimate.fees) currentEstimate.fees = [];
    currentEstimate.fees.push({
        name: "New Fee",
        amount: 0
    });
    showEditFields(currentEstimate);
}

function addNewCustomMaterialField() {
    currentEstimate.customMaterials.push({
        name: "New Material",
        price: 0,
        quantity: 1,
        total: 0
    });
    showEditFields(currentEstimate);
}

function removeMaterial(index, isCustom) {
    if (isCustom) {
        currentEstimate.customMaterials.splice(index, 1);
    } else {
        currentEstimate.materials.splice(index, 1);
    }
    showEditFields(currentEstimate);
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
    const laborTotal = estimate.jobs.reduce((sum, job) => sum + job.labor, 0);
    const materialsTotal = estimate.materials.reduce((sum, mat) => sum + mat.total, 0);
    const customMaterialsTotal = estimate.customMaterials.reduce((sum, mat) => sum + mat.total, 0);
    const feesTotal = estimate.fees ? estimate.fees.reduce((sum, fee) => sum + fee.amount, 0) : 0;
    const waiveFee = estimate.waiveEstimateFee || false;
    const estimateFee = waiveFee ? -75 : 75;
    const subtotal = laborTotal + materialsTotal + customMaterialsTotal + feesTotal;
    const discount = estimate.discountPercentage ? (subtotal * estimate.discountPercentage / 100) : 0;
    const total = subtotal - discount + estimateFee;

    // Payment terms options (you can make these configurable)
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
window.updateJobSelection = updateJobSelection;
window.updateJobField = updateJobField;
window.updateMaterialField = updateMaterialField;
window.updateFeeField = updateFeeField;
window.addNewFeeField = addNewFeeField;
window.addNewCustomMaterialField = addNewCustomMaterialField;
window.removeMaterial = removeMaterial;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.updateSelectedJob = updateSelectedJob;
window.updateJobDays = updateJobDays;
window.adjustMaterialQty = adjustMaterialQty;
window.updateMaterialQty = updateMaterialQty;
window.addFee = addFee;
window.removeFee = removeFee;
window.updateDiscount = updateDiscount;
window.cancelEstimate = cancelEstimate;