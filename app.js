// DOM Elements
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
    jobs: [],
    materials: [],
    customMaterials: [],
    fees: [],
    discountPercentage: 0,
    total: 0
};

// Price sheet data (from your PDF)
const priceSheet = {
    categories: {
        bathroom: {
            name: "Bathroom",
            jobs: [
                { name: "Small remodel", days: "5-7", labor: "$12,200-$18,000" },
                { name: "Full renovation", days: "10-15", labor: "$24,400-$36,600" },
                { name: "Minor updates", days: "1-2", labor: "$2,000" }
            ],
            materials: {
                "Vents (8x8 with light)": 100,
                "Vents (8x8 no light)": 75,
                "Herringbone tile (per sqft)": 18,
                "Glazed wall tile (per sqft)": 6,
                "Floor tile (per sqft)": 4,
                "Single vanity": 300,
                "Double vanity": 2000,
                "Faucet": 100,
                "Can lighting (per 4 lights)": 100,
                "Heated floor (per sqft)": 9.5,
                "Supply lines (per ft)": 7,
                "GFCI outlets": 75,
                "Shower head": 120,
                "Bath spout": 40,
                "Bath": 350,
                "Toilet": 400
            }
        },
        kitchen: {
            name: "Kitchen",
            jobs: [
                { name: "Full remodel", days: "15-25", labor: "$36,600-$61,000" },
                { name: "Cabinet replacement only", days: "3-5", labor: "$1,320-$12,200" },
                { name: "Countertops + backsplash", days: "2-4", labor: "$4,880-$9,760" },
                { name: "Appliance/light updates", days: "1-2", labor: "$2,000" }
            ],
            materials: {
                "Stock cabinets (per ft)": 300,
                "Custom cabinets (per ft)": 900,
                "Laminate countertops (per sqft)": 45,
                "Quartz countertops (per sqft)": 120,
                "Granite countertops (per sqft)": 110,
                "Butcher block countertops (per sqft)": 80,
                "Subway tile backsplash (per sqft)": 15,
                "Glass tile backsplash (per sqft)": 22,
                "Mosaic backsplash (per sqft)": 28,
                "Range (Electric/Gas)": 1000,
                "Refrigerator (Standard)": 1500,
                "Dishwasher": 800,
                "Microwave (Over-range)": 450,
                "Range Hood": 300,
                "Undermount Sink": 350,
                "Farmhouse Sink": 600,
                "Kitchen Faucet": 180,
                "Pendant Lights (each)": 120,
                "Recessed/Can Lights (peer 4 lights)": 100,
                "Under Cabinet Lighting (per foot)": 35,
                "GFCI Outlets": 75,
                "Switches/Dimmers": 60
            }
        },
        bedroom: {
            name: "Bedroom",
            jobs: [
                { name: "Basic refresh (paint, lights, trim)", days: "1-3", labor: "$1,220-$1,320" },
                { name: "Closet upgrade", days: "1-2", labor: "$1,220-$4,880" },
                { name: "Flooring install", days: "1-2", labor: "$2,440-$4,880" }
            ],
            materials: {
                "Standard Reach-In closet": 600,
                "Walk-In Shelving/Storage": 1500,
                "Ceiling Fan w/ Light": 200,
                "Flush Mount Light": 100,
                "Recessed Lighting (each)": 100,
                "Interior Door": 200,
                "Closet Bifold": 180,
                "Paint (Walls & Ceiling per sqft)": 2.5,
                "Standard Molding (per linear foot)": 5
            }
        },
        decking: {
            name: "Decking",
            jobs: [
                { name: "New deck (10x10-12x16)", days: "5-10", labor: "$12,200-$24,400" },
                { name: "Stairs/railing replacement", days: "1-2", labor: "$2,440-$4,880" },
                { name: "Resurfacing/staining", days: "1-3", labor: "$1,220-$1,320" }
            ],
            materials: {
                "Pressure-Treated Joists/Framing (per sqft)": 12,
                "Steel Framing (optional upgrade per sqft)": 18,
                "Pressure-Treated Lumber (per sqft)": 16,
                "Cedar (per sqft)": 20,
                "Composite (e.g., Trex, TimberTech per sqft)": 28,
                "PVC (per sqft)": 32,
                "Wood Railing (per linear foot)": 40,
                "Composite Railing (per linear foot)": 60,
                "Cable Railing (per linear foot)": 90,
                "Basic Wood Steps (per flight up to 4 steps)": 350,
                "Composite Steps (per flight)": 500,
                "Additional Steps (each)": 90,
                "Lattice Wood Skirt (per sqft)": 18,
                "Composite/Decorative Skirt (per sqft)": 25,
                "Concrete Footings w/ support posts": 250,
                "Post Cap Lights (each)": 80,
                "Stair Lights (each)": 60,
                "Initial Seal/Stain (wood only per sqft)": 3.5,
                "Maintenance Recoat (wood only per sqft)": 2
            }
        },
        garage: {
            name: "Garage",
            jobs: [
                { name: "Door + opener replacement", days: "1", labor: "$2,440" },
                { name: "Epoxy floor coating", days: "2-3", labor: "$4,880-$1,320" },
                { name: "Storage & lighting", days: "1-2", labor: "$2,000" }
            ],
            materials: {
                "Single Door (Manual)": 900,
                "Single Door (Automatic)": 1300,
                "Double Door (Automatic)": 1900,
                "Chain Drive opener": 300,
                "Belt Drive opener": 450,
                "Wall-mounted Shelving": 400,
                "Ceiling Storage Rack": 300,
                "LED Strip Light (each)": 120,
                "Epoxy floor coating (per sqft)": 6
            }
        },
        basement: {
            name: "Basement",
            jobs: [
                { name: "Full finish", days: "15-25", labor: "$36,600-$61,000" },
                { name: "Bathroom addition", days: "5-10", labor: "$12,200-$24,400" },
                { name: "Minor upgrades", days: "2-5", labor: "$2,440-$12,200" }
            ],
            materials: {
                "Framing & Insulation (per sqft)": 28,
                "Drywall (per sqft)": 4.5,
                "Can Lights (each)": 100,
                "Sump Pump System": 1600,
                "Dehumidifier Unit": 850,
                "Full Bath (with fixtures)": 9000
            }
        },
        flooring: {
            name: "Flooring",
            jobs: [
                { name: "Hardwood/LVP (400-600 sqft)", days: "2-4", labor: "$4,880-$9,760" },
                { name: "Tile flooring", days: "3-5", labor: "$1,320-$12,200" },
                { name: "Carpet replacement", days: "1", labor: "$2,440" }
            ],
            materials: {
                "Solid Hardwood (per sqft)": 10,
                "Engineered Hardwood (per sqft)": 8,
                "Laminate (per sqft)": 4.5,
                "Luxury Vinyl Plank (LVP per sqft)": 6,
                "Porcelain Tile (per sqft)": 6.5,
                "Stone Tile (per sqft)": 9,
                "Carpet (includes padding and install per sqft)": 5.5
            }
        },
        concrete: {
            name: "Concrete",
            jobs: [
                { name: "Driveway (400-600 sqft)", days: "3-5", labor: "$1,320-$12,200" },
                { name: "Walkway or steps", days: "1-3", labor: "$2,440-$1,320" },
                { name: "Stamped patio", days: "3-4", labor: "$1,320-$9,760" }
            ],
            materials: {
                "Standard Pour Driveway (per sqft)": 10,
                "Stamped Driveway (per sqft)": 16,
                "Standard Walkway (per sqft)": 8,
                "Decorative Walkway (per sqft)": 14,
                "Plain Patio (per sqft)": 9,
                "Decorative/Stained Patio (per sqft)": 15,
                "Steps (per step)": 350
            }
        },
        glass: {
            name: "Glass",
            jobs: [
                { name: "Window replacement (≤6 windows)", days: "1-2", labor: "$2,440-$4,880" },
                { name: "Shower glass install", days: "0.5-1", labor: "$1,220" },
                { name: "Mirror install", days: "0.25-0.5", labor: "$400" }
            ],
            materials: {
                "Standard Double-Hung Window": 500,
                "Picture Window": 700,
                "Bay Window": 1600,
                "Frameless Shower Enclosure": 1200,
                "Sliding Glass Shower Doors": 850,
                "Standard Vanity Mirror": 200,
                "Custom Cut Mirror": 400
            }
        },
        repairs: {
            name: "Misc. Repairs",
            jobs: [
                { name: "Door replacement", days: "0.5-1", labor: "$400" },
                { name: "Trim/baseboard install", days: "1-2", labor: "$2,440-$4,880" },
                { name: "Drywall patch/paint", days: "0.25-1", labor: "$225-$1,220" }
            ],
            materials: {
                "Exterior Door (Steel)": 750,
                "Exterior Door (Wood)": 900,
                "French Doors": 1200,
                "Sliding Glass Door": 1400,
                "Small Drywall Patch (under 2x2 ft)": 150,
                "Large Drywall Patch": 300,
                "Caulking/Sealant Work (per foot)": 5,
                "Baseboard Heater Replacement (each)": 250,
                "Smoke/CO Detector Install (each)": 90
            }
        }
    }
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
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
}

    // Search functionality
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchEstimates();
        }
    });
    searchBtn.addEventListener('click', searchEstimates);
    
    // Time filter
    timeFilter.addEventListener('change', function() {
        if (this.value === 'month') {
            monthFilter.style.display = 'inline-block';
            yearFilter.style.display = 'inline-block';
        } else {
            monthFilter.style.display = 'none';
            yearFilter.style.display = 'none';
            loadEstimates();
        }
    });
    
    monthFilter.addEventListener('change', filterByDate);
    yearFilter.addEventListener('change', filterByDate);
    
    // Modal buttons
    closeModal.addEventListener('click', closeEstimateModal);
    editEstimateBtn.addEventListener('click', editEstimate);
    deleteEstimateBtn.addEventListener('click', deleteEstimate);
    exportEstimateBtn.addEventListener('click', exportEstimateToWord);
    
    // Estimate form buttons
    addCustomMaterial.addEventListener('click', addCustomMaterialToEstimate);
    saveEstimateBtn.addEventListener('click', saveEstimate);


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
    // Reset current estimate
    currentEstimate = {
        customer: {},
        jobs: [],
        materials: [],
        customMaterials: [],
        fees: [],
        discountPercentage: 0,
        total: 0
    };
    
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
    
    for (const categoryId in priceSheet.categories) {
        const category = priceSheet.categories[categoryId];
        
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.setAttribute('data-category', categoryId);
        categoryCard.innerHTML = `
            <div class="category-icon">
                ${getCategoryIcon(categoryId)}
            </div>
            <div class="category-info">
                <h3>${category.name}</h3>
                <p>Click to select</p>
            </div>
        `;
        
        categoryCard.addEventListener('click', function() {
            this.classList.toggle('selected');
            showJobDetails(categoryId);
        });
        
        categorySelection.appendChild(categoryCard);
    }
}

function getCategoryIcon(categoryId) {
    const icons = {
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
            const categoryId = Object.keys(priceSheet.categories).find(
                key => priceSheet.categories[key].name === categoryName
            );
            
            const category = priceSheet.categories[categoryId];
            
            const categorySection = document.createElement('div');
            categorySection.className = 'job-option';
            categorySection.innerHTML = `
                <h4>${category.name}</h4>
            `;
            
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
                
                // Add days selection if there's a range
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
            
            jobDetailsContent.appendChild(categorySection);
        });
    } else {
        jobDetailsContainer.style.display = 'none';
    }
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
        laborCost = min + ((max - min) * ((days - minDays) / (maxDays - minDays)));
    } else {
        laborCost = parseFloat(job.labor.replace(/[$,]/g, ''));
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
    
    // Get all materials from selected categories
    const selectedCategories = document.querySelectorAll('.category-card.selected');
    const materialsMap = new Map();
    
    selectedCategories.forEach(card => {
        const categoryName = card.querySelector('h3').textContent;
        const categoryId = Object.keys(priceSheet.categories).find(
            key => priceSheet.categories[key].name === categoryName
        );
        
        const category = priceSheet.categories[categoryId];
        
        for (const [materialName, price] of Object.entries(category.materials)) {
            materialsMap.set(materialName, price);
        }
    });
    
    // Add materials to the container
    materialsMap.forEach((price, materialName) => {
        const materialItem = document.createElement('div');
        materialItem.className = 'material-item';
        materialItem.innerHTML = `
            <div class="material-info">
                <h4>${materialName}</h4>
                <p>$${price.toFixed(2)}</p>
            </div>
            <div class="material-qty">
                <button class="qty-btn minus" onclick="adjustMaterialQty('${materialName}', -1)">-</button>
                <input type="number" id="qty-${materialName.replace(/\s+/g, '-')}" 
                    value="0" min="0" onchange="updateMaterialQty('${materialName}', this.value)">
                <button class="qty-btn plus" onclick="adjustMaterialQty('${materialName}', 1)">+</button>
            </div>
        `;
        
        materialsContainer.appendChild(materialItem);
    });
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
            <span>$${fee.amount.toFixed(2)}</span>
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
    
    // Calculate fees total
    const feesTotal = currentEstimate.fees ? currentEstimate.fees.reduce((sum, fee) => sum + fee.amount, 0) : 0;
    
    // Calculate subtotal before discount
    const subtotal = laborTotal + materialsTotal + customMaterialsTotal + feesTotal;
    
    // Apply discount
    const discount = currentEstimate.discountPercentage ? (subtotal * currentEstimate.discountPercentage / 100) : 0;
    const total = subtotal - discount;
    
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
    `;
    
    if (currentEstimate.jobs.length === 0) {
        html += `<p>No jobs selected</p>`;
    } else {
        currentEstimate.jobs.forEach(job => {
            const categoryName = priceSheet.categories[job.category].name;
            html += `
                <div class="estimate-row">
                    <span>${categoryName} - ${job.name} (${job.days} days)</span>
                    <span>$${job.labor.toFixed(2)}</span>
                </div>
            `;
        });
    }
    
    html += `
            <div class="estimate-row estimate-total-row">
                <span>Total Labor:</span>
                <span>$${laborTotal.toFixed(2)}</span>
            </div>
        </div>
        
        <div class="estimate-section">
            <h3>Materials</h3>
    `;
    
    if (currentEstimate.materials.length === 0 && currentEstimate.customMaterials.length === 0) {
        html += `<p>No materials selected</p>`;
    } else {
        currentEstimate.materials.forEach(mat => {
            html += `
                <div class="estimate-row">
                    <span>${mat.name} (${mat.quantity} @ $${mat.price.toFixed(2)})</span>
                    <span>$${mat.total.toFixed(2)}</span>
                </div>
            `;
        });
        
        currentEstimate.customMaterials.forEach(mat => {
            html += `
                <div class="estimate-row">
                    <span>${mat.name} (Custom) (${mat.quantity} @ $${mat.price.toFixed(2)})</span>
                    <span>$${mat.total.toFixed(2)}</span>
                </div>
            `;
        });
    }
    
    html += `
            <div class="estimate-row estimate-total-row">
                <span>Total Materials:</span>
                <span>$${(materialsTotal + customMaterialsTotal).toFixed(2)}</span>
            </div>
        </div>
    `;
    
    // Add fees section if any fees exist
    if (currentEstimate.fees && currentEstimate.fees.length > 0) {
        html += `
            <div class="estimate-section">
                <h3>Fees</h3>
        `;
        
        currentEstimate.fees.forEach(fee => {
            html += `
                <div class="estimate-row">
                    <span>${fee.name}</span>
                    <span>$${fee.amount.toFixed(2)}</span>
                </div>
            `;
        });
        
        html += `
                <div class="estimate-row estimate-total-row">
                    <span>Total Fees:</span>
                    <span>$${feesTotal.toFixed(2)}</span>
                </div>
            </div>
        `;
    }
    
    // Add subtotal and discount if discount exists
    if (currentEstimate.discountPercentage > 0) {
        html += `
            <div class="estimate-section">
                <div class="estimate-row">
                    <span>Subtotal:</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="estimate-row">
                    <span>Discount (${currentEstimate.discountPercentage}%):</span>
                    <span>-$${discount.toFixed(2)}</span>
                </div>
            </div>
        `;
    }
    
    html += `
        <div class="estimate-section">
            <div class="estimate-row estimate-total-row">
                <span>Total Estimate:</span>
                <span>$${total.toFixed(2)}</span>
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

    // Add timestamp with proper date formatting
    currentEstimate.createdAt = new Date().toISOString();
    currentEstimate.updatedAt = currentEstimate.createdAt;

    // Save to Firestore (automatically generates ID)
    db.collection("estimates").add(currentEstimate)
        .then(() => {
            alert('Estimate saved successfully!');
            showDashboard();
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

    // Update timestamp
    currentEstimate.updatedAt = new Date().toISOString();

    // Save to Firestore
    db.collection("estimates").doc(currentEstimate.id).update(currentEstimate)
        .then(() => {
            alert('Estimate updated successfully!');
            
            // Reset editing state
            isEditing = false;
            editFieldsContainer.style.display = 'none';
            
            // Update button visibility
            editEstimateBtn.style.display = 'inline-block';
            saveChangesBtn.style.display = 'none';
            exportEstimateBtn.style.display = 'inline-block';
            deleteEstimateBtn.style.display = 'inline-block';
            
            // Reload the estimate to show changes
            openEstimateModal(currentEstimate);
            loadEstimates();
        })
        .catch(error => {
            console.error('Error updating estimate:', error);
            alert('Error updating estimate. Please try again.');
        });
}

function loadEstimates() {
    db.collection("estimates")
        .orderBy("createdAt", "desc")  // Newest first
        .get()
        .then(querySnapshot => {
            const estimates = [];
            querySnapshot.forEach(doc => {
                estimates.push({
                    id: doc.id,       // Include Firestore document ID
                    ...doc.data()     // Spread all estimate data
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
    
    if (estimates.length === 0) {
        estimatesList.innerHTML = '<p>No estimates found</p>';
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
            <h3>${estimate.customer.name}</h3>
            <p>${estimate.customer.location}</p>
            <p>${formattedDate}</p>
            <p>${estimate.jobs.map(job => job.name).join(', ')}</p>
            <p class="estimate-total">Total: $${estimate.total.toFixed(2)}</p>
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
                <span>$${job.labor.toFixed(2)}</span>
            </div>
        `;
    });
    
    html += `
            <div class="estimate-row estimate-total-row">
                <span>Total Labor:</span>
                <span>$${estimate.jobs.reduce((sum, job) => sum + job.labor, 0).toFixed(2)}</span>
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
                    <span>${mat.name} (${mat.quantity} @ $${mat.price.toFixed(2)})</span>
                    <span>$${mat.total.toFixed(2)}</span>
                </div>
            `;
        });
        
        estimate.customMaterials.forEach(mat => {
            html += `
                <div class="estimate-row">
                    <span>${mat.name} (Custom) (${mat.quantity} @ $${mat.price.toFixed(2)})</span>
                    <span>$${mat.total.toFixed(2)}</span>
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
                    <span>$${fee.amount.toFixed(2)}</span>
                </div>
            `;
        });
        
        const feesTotal = estimate.fees.reduce((sum, fee) => sum + fee.amount, 0);
        
        html += `
                <div class="estimate-row estimate-total-row">
                    <span>Total Fees:</span>
                    <span>$${feesTotal.toFixed(2)}</span>
                </div>
            </div>
        `;
    }
    
    // Calculate totals
    const laborTotal = estimate.jobs.reduce((sum, job) => sum + job.labor, 0);
    const materialsTotal = estimate.materials.reduce((sum, mat) => sum + mat.total, 0);
    const customMaterialsTotal = estimate.customMaterials.reduce((sum, mat) => sum + mat.total, 0);
    const feesTotal = estimate.fees ? estimate.fees.reduce((sum, fee) => sum + fee.amount, 0) : 0;
    const subtotal = laborTotal + materialsTotal + customMaterialsTotal + feesTotal;
    const discount = estimate.discountPercentage ? (subtotal * estimate.discountPercentage / 100) : 0;
    const total = subtotal - discount;
    
    // Add subtotal and discount if discount exists
    if (estimate.discountPercentage > 0) {
        html += `
            <div class="estimate-section">
                <div class="estimate-row">
                    <span>Subtotal:</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="estimate-row">
                    <span>Discount (${estimate.discountPercentage}%):</span>
                    <span>-$${discount.toFixed(2)}</span>
                </div>
            </div>
        `;
    }
    
    html += `
        <div class="estimate-section">
            <div class="estimate-row estimate-total-row">
                <span>Total Estimate:</span>
                <span>$${total.toFixed(2)}</span>
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
    
    db.collection("estimates").doc(estimateId).get()
        .then(doc => {
            if (doc.exists) {
                currentEstimate = doc.data();
                currentEstimate.id = doc.id;
                
                // Show edit fields
                showEditFields(currentEstimate);
                isEditing = true;
                
                // Update button visibility
                editEstimateBtn.style.display = 'none';
                saveChangesBtn.style.display = 'inline-block';
                exportEstimateBtn.style.display = 'none';
                deleteEstimateBtn.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error loading estimate:', error);
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
    if (field === 'price' || field === 'quantity') value = parseFloat(value);
    
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

function updateFeeField(index, field, value) {
    if (field === 'amount') value = parseFloat(value);
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
    
    // Calculate totals
    const laborTotal = estimate.jobs.reduce((sum, job) => sum + job.labor, 0);
    const materialsTotal = estimate.materials.reduce((sum, mat) => sum + mat.total, 0);
    const customMaterialsTotal = estimate.customMaterials.reduce((sum, mat) => sum + mat.total, 0);
    const feesTotal = estimate.fees ? estimate.fees.reduce((sum, fee) => sum + fee.amount, 0) : 0;
    const subtotal = laborTotal + materialsTotal + customMaterialsTotal + feesTotal;
    const discount = estimate.discountPercentage ? (subtotal * estimate.discountPercentage / 100) : 0;
    const total = subtotal - discount;

    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Estimate for ${estimate.customer.name}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .header { text-align: center; margin-bottom: 30px; }
                .address { margin-bottom: 20px; }
                .client-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
                .section { margin-bottom: 20px; }
                .section-title { font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ccc; }
                .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
                .total-row { font-weight: bold; margin-top: 10px; border-top: 1px solid #ccc; padding-top: 5px; }
                .signature { margin-top: 50px; }
                .terms { margin-top: 30px; font-size: 0.9em; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
                th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>ACE HANDYMAN SERVICES</h1>
                <h2>Ace Handyman Services Oak Park River Forest</h2>
                <p>207 N Harlem Ave. Oak Park, IL 60302</p>
                <p>(708) 773-0218</p>
                <h3>ESTIMATE: Home Repair Projects</h3>
                <p>Date: ${formattedDate}</p>
            </div>
            
            <div class="client-info">
                <div>
                    <p><strong>Bill To:</strong></p>
                    <p>${estimate.customer.name}</p>
                    <p>${estimate.customer.location}</p>
                    <p>${estimate.customer.email}</p>
                    <p>${estimate.customer.phone}</p>
                </div>
                <div>
                    <p><strong>Service Address:</strong></p>
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
                            ${estimate.materials
                                .filter(mat => priceSheet.categories[job.category].materials[mat.name] !== undefined)
                                .map(mat => `<li>${mat.name}</li>`).join('')}
                            ${estimate.customMaterials.map(mat => `<li>${mat.name} (Custom)</li>`).join('')}
                        </ul>
                        <table>
                            <tr>
                                <th>Description</th>
                                <th>Task</th>
                                <th>Quantity</th>
                                <th>Total Cost</th>
                            </tr>
                            <tr>
                                <td>area labor</td>
                                <td>${job.days}-hour package</td>
                                <td>${Math.ceil(job.labor / 225)}</td>
                                <td>$${job.labor.toFixed(2)}</td>
                            </tr>
                            ${estimate.materials
                                .filter(mat => priceSheet.categories[job.category].materials[mat.name] !== undefined)
                                .map(mat => `
                                <tr>
                                    <td>material cost</td>
                                    <td>${mat.name}</td>
                                    <td>${mat.quantity}</td>
                                    <td>$${mat.total.toFixed(2)}</td>
                                </tr>
                                `).join('')}
                            ${estimate.fees && estimate.fees.length > 0 ? estimate.fees.map(fee => `
                                <tr>
                                    <td>${fee.name}</td>
                                    <td></td>
                                    <td>1</td>
                                    <td>$${fee.amount.toFixed(2)}</td>
                                </tr>
                            `).join('') : ''}
                            <tr class="total-row">
                                <td colspan="3" style="text-align: right;">Subtotal:</td>
                                <td>$${(job.labor + 
                                    estimate.materials
                                        .filter(mat => priceSheet.categories[job.category].materials[mat.name] !== undefined)
                                        .reduce((sum, mat) => sum + mat.total, 0) +
                                    (estimate.fees ? estimate.fees.reduce((sum, fee) => sum + fee.amount, 0) : 0)).toFixed(2)}</td>
                            </tr>
                        </table>
                    </div>
                `;
            }).join('')}
            
            <div class="section">
                <div class="section-title">Terms and Conditions</div>
                <ul>
                    <li><strong>Validity:</strong> this estimate is valid until ${new Date(date.setDate(date.getDate() + 30)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</li>
                    <li><strong>Payment Terms:</strong> invoiced for time and material daily</li>
                    <li><strong>Project Timeline:</strong> to be determined between owner and Ace Handyman Services</li>
                    <li><strong>Warranty:</strong> 12 Months: labor and materials provided by Ace Handyman Services</li>
                    <li><strong>Disclosure:</strong> Ace Handyman Services operates on a time and materials model. The above estimate is subject to change.</li>
                </ul>
            </div>
            
            <div class="section">
                <div class="section-title">Additional Notes</div>
                <p>We look forward to the opportunity to work with you.</p>
                <p>Please review this estimate and let us know if you have any questions or require any modifications.</p>
                <p>To accept this estimate, please sign and return a copy or contact us to confirm your acceptance.</p>
                <p>Thank you for your consideration.</p>
            </div>
            
            <div class="signature">
                <p>Sincerely,</p>
                <p><strong>Samuel Cundari</strong><br>
                Operations Manager<br>
                Ace Handyman Services Oak Park River Forest<br>
                scund@acehandymanservices.com<br>
                O: 708-773-0218</p>
            </div>
            
            <div class="terms">
                <p><strong>Client Acceptance</strong></p>
                <p>I, ____________________, accept the terms and scope of the estimate provided above.</p>
                <p>Signature: ____________________</p>
                <p>Date: ____________________</p>
            </div>
        </body>
        </html>
    `;
    
    // Create and download the Word document
    const blob = new Blob([html], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `AHS_Estimate_${estimate.customer.name.replace(/\s+/g, '_')}.doc`;
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
        .where("customer.name", ">=", searchTerm)
        .where("customer.name", "<=", searchTerm + '\uf8ff')
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
    
    if (!month || !year) return;
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    
    db.collection("estimates")
        .where("createdAt", ">=", startDate.toISOString())
        .where("createdAt", "<", endDate.toISOString())
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