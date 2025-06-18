const pricingData = {
    bathroom: {
        projects: {
            "Small remodel": { labor: (12200 + 18000) / 2, days: "5-7", crew: 2 },
            "Full renovation": { labor: (24400 + 36600) / 2, days: "10-15", crew: 2 },
            "Minor updates": { labor: 2000, days: "1-2", crew: 1 }
        },
        materials: {
            "Vents (with light)": { price: 100, unit: "each" },
            "Vents (no light)": { price: 75, unit: "each" },
            "Herringbone tile": { price: 18, unit: "sqft" },
            "Glazed wall tile": { price: 6, unit: "sqft" },
            "Floor tile": { price: 4, unit: "sqft" },
            "Single vanity": { price: 300, unit: "each" },
            "Double vanity": { price: 2000, unit: "each" },
            "Faucet": { price: 100, unit: "each" },
            "Can lighting": { price: 100, unit: "4 pack" },
            "Heated floor": { price: 9.5, unit: "sqft" },
            "Supply lines": { price: 7, unit: "ft" },
            "GFCI outlets": { price: 75, unit: "each" },
            "Shower head": { price: 120, unit: "each" },
            "Bath spout": { price: 40, unit: "each" },
            "Bath": { price: 350, unit: "each" },
            "Toilet": { price: 400, unit: "each" }
        }
    },
    kitchen: {
        projects: {
            "Cabinet refacing": { labor: 4500, days: "3-5", crew: 2 },
            "Full remodel": { labor: 25000, days: "10-15", crew: 3 },
            "Countertop replacement": { labor: 1500, days: "1-2", crew: 2 }
        },
        materials: {
            "Base cabinets": { price: 200, unit: "each" },
            "Wall cabinets": { price: 150, unit: "each" },
            "Granite countertop": { price: 50, unit: "sqft" },
            "Quartz countertop": { price: 70, unit: "sqft" },
            "Backsplash tile": { price: 8, unit: "sqft" },
            "Kitchen sink": { price: 300, unit: "each" },
            "Faucet": { price: 150, unit: "each" },
            "Under-cabinet lighting": { price: 120, unit: "each" }
        }
    },
    bedroom: {
        projects: {
            "Closet build-out": { labor: 1200, days: "2-3", crew: 1 },
            "Full remodel": { labor: 8000, days: "5-7", crew: 2 },
            "Wall repair/paint": { labor: 500, days: "1", crew: 1 }
        },
        materials: {
            "Closet system": { price: 300, unit: "each" },
            "Drywall": { price: 1.5, unit: "sqft" },
            "Paint": { price: 35, unit: "gallon" },
            "Crown molding": { price: 5, unit: "ft" },
            "Baseboard": { price: 3, unit: "ft" }
        }
    },
    flooring: {
        projects: {
            "Hardwood install": { labor: 4, days: "Varies by size", crew: 2 },
            "Tile install": { labor: 5, days: "Varies by size", crew: 2 },
            "Laminate install": { labor: 2, unit: "sqft", days: "Varies by size", crew: 2 }
        },
        materials: {
            "Hardwood": { price: 8, unit: "sqft" },
            "Tile": { price: 4, unit: "sqft" },
            "Laminate": { price: 3, unit: "sqft" },
            "Underlayment": { price: 0.5, unit: "sqft" },
            "Transition strips": { price: 15, unit: "each" }
        }
    },
    garage: {
        projects: {
            "Epoxy flooring": { labor: 3, unit: "sqft", days: "2-3", crew: 2 },
            "Storage system": { labor: 1500, days: "2-3", crew: 2 },
            "Door replacement": { labor: 500, days: "1", crew: 2 }
        },
        materials: {
            "Epoxy coating": { price: 2.5, unit: "sqft" },
            "Shelving": { price: 50, unit: "each" },
            "Garage door": { price: 800, unit: "each" },
            "Opener": { price: 250, unit: "each" }
        }
    },
    aircon: {
        projects: {
            "AC unit install": { labor: 1500, days: "1", crew: 2 },
            "Ductwork": { labor: 15, unit: "ft", days: "Varies", crew: 2 },
            "Vent cleaning": { labor: 300, days: "1", crew: 1 }
        },
        materials: {
            "AC unit": { price: 2500, unit: "each" },
            "Duct": { price: 8, unit: "ft" },
            "Vent covers": { price: 25, unit: "each" },
            "Thermostat": { price: 150, unit: "each" }
        }
    },
    roofing: {
        projects: {
            "Shingle replacement": { labor: 2.5, unit: "sqft", days: "Varies by size", crew: 3 },
            "Full roof replacement": { labor: 350, unit: "square", days: "3-5", crew: 4 },
            "Leak repair": { labor: 300, days: "1", crew: 2 }
        },
        materials: {
            "Asphalt shingles": { price: 1.5, unit: "sqft" },
            "Underlayment": { price: 0.5, unit: "sqft" },
            "Flashing": { price: 10, unit: "ft" },
            "Drip edge": { price: 3, unit: "ft" }
        }
    },
    concrete: {
        projects: {
            "Patio": { labor: 6, unit: "sqft", days: "Varies by size", crew: 3 },
            "Sidewalk": { labor: 8, unit: "sqft", days: "Varies by size", crew: 3 },
            "Driveway": { labor: 5, unit: "sqft", days: "Varies by size", crew: 4 }
        },
        materials: {
            "Concrete": { price: 5, unit: "sqft" },
            "Reinforcement": { price: 1, unit: "sqft" },
            "Forming": { price: 2, unit: "ft" }
        }
    },
    basement: {
        projects: {
            "Finishing": { labor: 25, unit: "sqft", days: "Varies by size", crew: 3 },
            "Waterproofing": { labor: 5000, days: "3-5", crew: 3 },
            "Egress window": { labor: 2500, days: "2", crew: 3 }
        },
        materials: {
            "Drywall": { price: 1.5, unit: "sqft" },
            "Insulation": { price: 0.75, unit: "sqft" },
            "Flooring": { price: 3, unit: "sqft" },
            "Egress window": { price: 800, unit: "each" }
        }
    },
    glass: {
        projects: {
            "Window replacement": { labor: 300, days: "1", crew: 2 },
            "Mirror install": { labor: 200, days: "1", crew: 2 },
            "Shower door": { labor: 400, days: "1", crew: 2 }
        },
        materials: {
            "Double pane window": { price: 350, unit: "each" },
            "Mirror": { price: 20, unit: "sqft" },
            "Shower glass": { price: 40, unit: "sqft" },
            "Hardware": { price: 100, unit: "set" }
        }
    },
    decking: {
        projects: {
            "New deck": { labor: 15, unit: "sqft", days: "Varies by size", crew: 3 },
            "Deck repair": { labor: 500, days: "1-2", crew: 2 },
            "Staining/sealing": { labor: 2, unit: "sqft", days: "Varies by size", crew: 2 }
        },
        materials: {
            "Pressure-treated wood": { price: 5, unit: "sqft" },
            "Composite decking": { price: 10, unit: "sqft" },
            "Railings": { price: 30, unit: "ft" },
            "Fasteners": { price: 50, unit: "set" }
        }
    },
    misc: {
        projects: {
            "Drywall repair": { labor: 200, days: "1", crew: 1 },
            "Painting": { labor: 2, unit: "sqft", days: "Varies by size", crew: 1 },
            "Handyman services": { labor: 65, unit: "hour", days: "Varies", crew: 1 }
        },
        materials: {
            "Drywall": { price: 1.5, unit: "sqft" },
            "Paint": { price: 35, unit: "gallon" },
            "Trim": { price: 3, unit: "ft" },
            "Hardware": { price: 5, unit: "each" }
        }
    }
};

// DOM elements
const newEstimateBtn = document.getElementById('new-estimate-btn');
const estimateModal = document.getElementById('estimate-modal');
const closeModalBtn = document.querySelector('.close-modal');
const steps = document.querySelectorAll('.step');
const nextStepBtns = document.querySelectorAll('.next-step');
const prevStepBtns = document.querySelectorAll('.prev-step');
const categoryBtns = document.querySelectorAll('.category-btn');
const projectSelection = document.getElementById('project-selection');
const materialSelection = document.getElementById('material-selection');
const addCustomMaterialBtn = document.getElementById('add-custom-material');
const saveEstimateBtn = document.getElementById('save-estimate');
const quoteList = document.getElementById('quote-list');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resetButton = document.getElementById('reset-button');
const sortSelect = document.getElementById('sort-select');
const totalEstimatesEl = document.getElementById('total-estimates');
const totalValueEl = document.getElementById('total-value');

// Current selection
let currentCategory = null;
let currentProject = null;
let selectedMaterials = {};
let estimates = JSON.parse(localStorage.getItem('estimates')) || [];
let filteredEstimates = [];

// Initialize the app
function init() {
    loadEstimates();
    setupEventListeners();
    updateStats();
}

// Load estimates from localStorage
function loadEstimates(searchTerm = '', sortBy = 'date-newest') {
    filteredEstimates = [...estimates];
    
    // Apply search filter if term exists
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredEstimates = filteredEstimates.filter(estimate => 
            (estimate.clientName && estimate.clientName.toLowerCase().includes(term)) ||
            (estimate.projectName && estimate.projectName.toLowerCase().includes(term)) ||
            (estimate.clientLocation && estimate.clientLocation.toLowerCase().includes(term))
        );
    }
    
    // Apply sorting
    switch(sortBy) {
        case 'date-oldest':
            filteredEstimates.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            break;
        case 'price-high':
            filteredEstimates.sort((a, b) => (b.total || 0) - (a.total || 0));
            break;
        case 'price-low':
            filteredEstimates.sort((a, b) => (a.total || 0) - (b.total || 0));
            break;
        case 'name-asc':
            filteredEstimates.sort((a, b) => (a.clientName || '').localeCompare(b.clientName || ''));
            break;
        case 'name-desc':
            filteredEstimates.sort((a, b) => (b.clientName || '').localeCompare(a.clientName || ''));
            break;
        default: // date-newest
            filteredEstimates.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    
    quoteList.innerHTML = '';
    
    if (filteredEstimates.length === 0) {
        quoteList.innerHTML = '<div class="no-results"><i class="fas fa-info-circle"></i> No estimates found</div>';
        return;
    }
    
    filteredEstimates.forEach((estimate, index) => {
        const materialsTotal = calculateMaterialsTotal(estimate.materials);
        const labor = estimate.laborCost || 0;
        const discountAmount = (estimate.discount || 0) * (materialsTotal + labor) / 100;
        const fees = estimate.fees || 0;
        const finalTotal = (materialsTotal + labor + fees) - discountAmount;
        
        const card = document.createElement("div");
        card.className = "quote-card";
        card.dataset.id = index;
        card.innerHTML = `
            <div class="quote-content">
                <div class="quote-header">
                    <h3>${estimate.clientName || "Unnamed Client"}</h3>
                    <span class="project-badge">${estimate.projectName || "No Project"}</span>
                </div>
                
                <div class="quote-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${estimate.clientLocation || "No Location"}</span>
                    <span><i class="fas fa-calendar"></i> ${new Date(estimate.timestamp).toLocaleDateString()}</span>
                </div>
                
                <div class="contact-info">
                    ${estimate.clientEmail ? `<p><i class="fas fa-envelope"></i> ${estimate.clientEmail}</p>` : ''}
                    ${estimate.clientPhone ? `<p><i class="fas fa-phone"></i> ${formatPhoneNumber(estimate.clientPhone)}</p>` : ''}
                </div>
                
                <div class="materials-section">
                    <h4><i class="fas fa-box-open"></i> Materials</h4>
                    <div class="materials-list">
                        ${estimate.materials ? Object.entries(estimate.materials).map(([name, item]) => `
                            <div class="material-item">
                                <span>${name}</span>
                                <span class="material-qty">${item.quantity} × ${formatMoney(item.price)}</span>
                                <span class="material-total">${formatMoney(item.quantity * item.price)}</span>
                            </div>
                        `).join('') : '<p>No materials listed</p>'}
                    </div>
                </div>
                
                <div class="price-summary">
                    <div class="price-row">
                        <span>Materials</span>
                        <span>${formatMoney(materialsTotal)}</span>
                    </div>
                    <div class="price-row">
                        <span>Labor</span>
                        <span>${formatMoney(labor)}</span>
                    </div>
                    ${estimate.discount ? `
                    <div class="price-row discount">
                        <span>Discount (${estimate.discount}%)</span>
                        <span>-${formatMoney(discountAmount)}</span>
                    </div>` : ''}
                    ${estimate.fees ? `
                    <div class="price-row fees">
                        <span>Fees</span>
                        <span>+${formatMoney(estimate.fees)}</span>
                    </div>` : ''}
                    <div class="price-row total">
                        <span>Total</span>
                        <span>${formatMoney(finalTotal)}</span>
                    </div>
                </div>
                
                <div class="job-details">
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${estimate.days || 1} day${estimate.days !== 1 ? 's' : ''}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-users"></i>
                        <span>${estimate.workers || 1} worker${estimate.workers !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            </div>
            
            <div class="quote-actions">
                <button class="action-btn edit-btn" onclick="editEstimate(${index})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn pdf-btn" onclick="generatePDF(${index})">
                    <i class="fas fa-file-pdf"></i> PDF
                </button>
                <button class="action-btn delete-btn" onclick="deleteEstimate(${index})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        quoteList.appendChild(card);
    });
}

// Update statistics
function updateStats() {
    totalEstimatesEl.textContent = estimates.length;
    
    const totalValue = estimates.reduce((sum, estimate) => {
        const materialsTotal = calculateMaterialsTotal(estimate.materials);
        const labor = estimate.laborCost || 0;
        const discountAmount = (estimate.discount || 0) * (materialsTotal + labor) / 100;
        const fees = estimate.fees || 0;
        return sum + (materialsTotal + labor + fees) - discountAmount;
    }, 0);
    
    totalValueEl.textContent = formatMoney(totalValue);
}

// Setup event listeners
function setupEventListeners() {
    // Modal controls
    newEstimateBtn.addEventListener('click', () => {
        estimateModal.classList.remove('hidden');
        showStep('step-1');
    });
    
    closeModalBtn.addEventListener('click', () => {
        estimateModal.classList.add('hidden');
        resetForm();
    });
    
    // Step navigation
    nextStepBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const nextStep = e.target.dataset.next;
            if (validateStep(nextStep)) {
                showStep(nextStep);
            }
        });
    });
    
    prevStepBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const prevStep = e.target.dataset.prev;
            showStep(prevStep);
        });
    });
    
    // Category selection
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentCategory = e.target.dataset.category;
            showProjects();
            document.querySelector('#step-2 .next-step').disabled = false;
        });
    });
    
    // Custom material addition
    addCustomMaterialBtn.addEventListener('click', addCustomMaterial);
    
    // Save estimate
    saveEstimateBtn.addEventListener('click', saveEstimate);
    
    // Search functionality
    searchButton.addEventListener('click', () => {
        loadEstimates(searchInput.value.trim(), sortSelect.value);
    });
    
    resetButton.addEventListener('click', () => {
        searchInput.value = '';
        loadEstimates('', sortSelect.value);
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loadEstimates(searchInput.value.trim(), sortSelect.value);
        }
    });
    
    // Sort functionality
    sortSelect.addEventListener('change', () => {
        loadEstimates(searchInput.value.trim(), sortSelect.value);
    });
}

// Show a specific step
function showStep(stepId) {
    steps.forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById(stepId).classList.add('active');
}

// Validate step before proceeding
function validateStep(nextStep) {
    if (nextStep === 'step-2') {
        const requiredFields = ['client-name', 'client-location', 'project-name'];
        for (const fieldId of requiredFields) {
            if (!document.getElementById(fieldId).value.trim()) {
                alert('Please fill in all required fields');
                return false;
            }
        }
    }
    return true;
}

// Show projects for selected category
function showProjects() {
    projectSelection.innerHTML = '<h3>Select Project Type</h3>';
    materialSelection.innerHTML = '';
    selectedMaterials = {};
    currentProject = null;

    const projects = pricingData[currentCategory].projects;
    for (const [projectName, projectData] of Object.entries(projects)) {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project-option';
        projectDiv.innerHTML = `
            <h4>${projectName}</h4>
            <p>Labor: ${formatMoney(projectData.labor)}</p>
            <p>Duration: ${projectData.days} days | Crew: ${projectData.crew}</p>
            <button class="button button-primary select-project" data-project="${projectName}">
                Select
            </button>
        `;
        projectSelection.appendChild(projectDiv);
    }

    // Set up project selection buttons
    document.querySelectorAll('.select-project').forEach(button => {
        button.addEventListener('click', (e) => {
            currentProject = e.target.dataset.project;
            showMaterials();
        });
    });
}

// Show materials for selected project
function showMaterials() {
    materialSelection.innerHTML = '<h3>Select Materials</h3>';
    selectedMaterials = {};

    const materials = pricingData[currentCategory].materials;
    for (const [materialName, materialData] of Object.entries(materials)) {
        const materialDiv = document.createElement('div');
        materialDiv.className = 'material-option';
        
        materialDiv.innerHTML = `
            <div class="material-label">
                <input type="checkbox" data-material="${materialName}" data-price="${materialData.price}">
                ${materialName} - ${formatMoney(materialData.price)}/${materialData.unit}
            </div>
            <input type="number" min="1" value="1" class="material-quantity" style="display: none;">
        `;
        materialSelection.appendChild(materialDiv);

        // Show quantity input when checkbox is checked
        const checkbox = materialDiv.querySelector('input[type="checkbox"]');
        const quantityInput = materialDiv.querySelector('.material-quantity');
        
        checkbox.addEventListener('change', () => {
            quantityInput.style.display = checkbox.checked ? 'inline-block' : 'none';
        });
    }
}

// Add custom material
function addCustomMaterial() {
    const name = document.getElementById('custom-material-name').value.trim();
    const quantity = parseFloat(document.getElementById('custom-material-qty').value) || 1;
    const price = parseFloat(document.getElementById('custom-material-price').value) || 0;
    
    if (!name) {
        alert('Please enter a material name');
        return;
    }
    
    selectedMaterials[name] = {
        price: price,
        quantity: quantity,
        unit: 'each'
    };
    
    // Add to display
    const materialDiv = document.createElement('div');
    materialDiv.className = 'material-option';
    materialDiv.innerHTML = `
        <div class="material-label">
            <i class="fas fa-check-circle"></i> ${name} - ${formatMoney(price)}/each (${quantity})
        </div>
    `;
    materialSelection.appendChild(materialDiv);
    
    // Clear inputs
    document.getElementById('custom-material-name').value = '';
    document.getElementById('custom-material-qty').value = '1';
    document.getElementById('custom-material-price').value = '';
}

// Save the estimate
function saveEstimate() {
    // Get selected materials
    document.querySelectorAll('#material-selection input[type="checkbox"]:checked').forEach(checkbox => {
        const materialName = checkbox.dataset.material;
        const materialPrice = parseFloat(checkbox.dataset.price);
        const quantityInput = checkbox.closest('.material-option').querySelector('.material-quantity');
        
        let quantity = parseFloat(quantityInput.value) || 1;
        
        selectedMaterials[materialName] = {
            price: materialPrice,
            quantity: quantity,
            unit: pricingData[currentCategory].materials[materialName].unit
        };
    });

    // Get project data
    const projectData = pricingData[currentCategory].projects[currentProject];
    
    // Create new estimate
    const newEstimate = {
        clientName: document.getElementById('client-name').value.trim(),
        clientEmail: document.getElementById('client-email').value.trim(),
        clientPhone: document.getElementById('client-phone').value.trim(),
        clientLocation: document.getElementById('client-location').value.trim(),
        projectName: document.getElementById('project-name').value.trim(),
        category: currentCategory,
        projectType: currentProject,
        laborCost: projectData.labor,
        materials: selectedMaterials,
        days: parseInt(document.getElementById('project-days').value) || 1,
        workers: parseInt(document.getElementById('project-workers').value) || 1,
        discount: parseFloat(document.getElementById('project-discount').value) || 0,
        fees: parseFloat(document.getElementById('project-fees').value) || 0,
        timestamp: new Date().toISOString()
    };
    
    // Calculate total
    const materialsTotal = calculateMaterialsTotal(newEstimate.materials);
    const discountAmount = (newEstimate.discount || 0) * (materialsTotal + newEstimate.laborCost) / 100;
    newEstimate.total = (materialsTotal + newEstimate.laborCost + newEstimate.fees) - discountAmount;
    
    // Add to estimates array
    estimates.unshift(newEstimate);
    localStorage.setItem('estimates', JSON.stringify(estimates));
    
    // Close modal and refresh
    estimateModal.classList.add('hidden');
    resetForm();
    loadEstimates();
    updateStats();
}

// Calculate materials total
function calculateMaterialsTotal(materials) {
    if (!materials) return 0;
    return Object.values(materials).reduce((total, item) => 
        total + (item.price * item.quantity), 0);
}

// Reset form
function resetForm() {
    document.getElementById('client-name').value = '';
    document.getElementById('client-email').value = '';
    document.getElementById('client-phone').value = '';
    document.getElementById('client-location').value = '';
    document.getElementById('project-name').value = '';
    currentCategory = null;
    currentProject = null;
    selectedMaterials = {};
    projectSelection.innerHTML = '';
    materialSelection.innerHTML = '';
    document.querySelector('#step-2 .next-step').disabled = true;
}

// Format phone number
function formatPhoneNumber(phone) {
    if (!phone) return '';
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? match[1] + '-' + match[2] + '-' + match[3] : phone;
}

// Format currency
function formatMoney(num) {
    return parseFloat(num || 0).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });
}

// Edit estimate
window.editEstimate = function(index) {
    const estimate = estimates[index];
    
    // Populate modal with estimate data
    document.getElementById('client-name').value = estimate.clientName;
    document.getElementById('client-email').value = estimate.clientEmail || '';
    document.getElementById('client-phone').value = estimate.clientPhone || '';
    document.getElementById('client-location').value = estimate.clientLocation;
    document.getElementById('project-name').value = estimate.projectName;
    document.getElementById('project-days').value = estimate.days || 1;
    document.getElementById('project-workers').value = estimate.workers || 1;
    document.getElementById('project-discount').value = estimate.discount || 0;
    document.getElementById('project-fees').value = estimate.fees || 0;
    
    // Set category and project
    currentCategory = estimate.category;
    currentProject = estimate.projectType;
    
    // Show projects and materials
    showProjects();
    showMaterials();
    
    // Check materials that were selected
    if (estimate.materials) {
        Object.keys(estimate.materials).forEach(materialName => {
            const checkbox = document.querySelector(`input[data-material="${materialName}"]`);
            if (checkbox) {
                checkbox.checked = true;
                const quantityInput = checkbox.closest('.material-option').querySelector('.material-quantity');
                quantityInput.style.display = 'inline-block';
                quantityInput.value = estimate.materials[materialName].quantity;
            }
        });
    }
    
    // Open modal at materials step
    estimateModal.classList.remove('hidden');
    showStep('step-3');
};

// Delete estimate
window.deleteEstimate = function(index) {
    if (confirm('Are you sure you want to delete this estimate?')) {
        estimates.splice(index, 1);
        localStorage.setItem('estimates', JSON.stringify(estimates));
        loadEstimates();
        updateStats();
    }
};

// Generate PDF
window.generatePDF = function(index) {
    const estimate = filteredEstimates[index];
    const materialsTotal = calculateMaterialsTotal(estimate.materials);
    const labor = estimate.laborCost || 0;
    const discountAmount = (estimate.discount || 0) * (materialsTotal + labor) / 100;
    const fees = estimate.fees || 0;
    const finalTotal = (materialsTotal + labor + fees) - discountAmount;
    
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Estimate #${index}</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap');
                body { font-family: 'Roboto', sans-serif; padding: 25px; color: #333; line-height: 1.6; }
                .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
                .company { color: #B7410E; font-size: 24px; font-weight: 500; }
                .address { font-size: 14px; color: #666; margin-top: 5px; }
                .title { font-size: 28px; color: #B7410E; margin: 25px 0; border-bottom: 2px solid #FF7F50; padding-bottom: 10px; }
                .client-info { margin-bottom: 30px; }
                .client-info p { margin: 8px 0; }
                .section-title { background: #FF7F50; color: white; padding: 10px 15px; margin: 25px 0 15px; border-radius: 4px; }
                table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                th { background: #f5f5f5; text-align: left; padding: 12px; font-weight: 500; }
                td { padding: 12px; border-bottom: 1px solid #eee; }
                .total-row { font-weight: bold; font-size: 1.1em; }
                .job-details { display: flex; gap: 20px; margin-top: 30px; }
                .detail-box { border: 1px solid #ddd; padding: 15px; border-radius: 6px; flex: 1; text-align: center; }
                .footer { margin-top: 50px; font-size: 14px; text-align: center; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
                .text-center { text-align: center; }
                .material-name { width: 40%; }
                .material-numbers { width: 20%; text-align: right; }
            </style>
        </head>
        <body>
            <div class="header">
                <div>
                    <div class="company">ACE Handyman Services</div>
                    <div class="address">207 N. Harlem Ave., Oak Park IL., 60302</div>
                </div>
                <div>Estimate #${index}</div>
            </div>
            
            <h1 class="title">Project Estimate</h1>
            
            <div class="client-info">
                <p><strong>Client:</strong> ${estimate.clientName || "Not specified"}</p>
                <p><strong>Project:</strong> ${estimate.projectName || "General work"}</p>
                <p><strong>Location:</strong> ${estimate.clientLocation || "Not specified"}</p>
                ${estimate.clientEmail ? `<p><strong>Email:</strong> ${estimate.clientEmail}</p>` : ''}
                ${estimate.clientPhone ? `<p><strong>Phone:</strong> ${formatPhoneNumber(estimate.clientPhone)}</p>` : ''}
                <p><strong>Date:</strong> ${new Date(estimate.timestamp).toLocaleDateString()}</p>
            </div>
            
            <div class="section-title">Materials</div>
            <table>
                <thead>
                    <tr>
                        <th class="material-name">Item</th>
                        <th class="material-numbers">Qty</th>
                        <th class="material-numbers">Unit Price</th>
                        <th class="material-numbers">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${estimate.materials ? Object.entries(estimate.materials).map(([name, item]) => `
                        <tr>
                            <td>${name}</td>
                            <td class="material-numbers">${item.quantity}</td>
                            <td class="material-numbers">${formatMoney(item.price)}</td>
                            <td class="material-numbers">${formatMoney(item.price * item.quantity)}</td>
                        </tr>
                    `).join('') : '<tr><td colspan="4" class="text-center">No materials specified</td></tr>'}
                </tbody>
            </table>
            
            <div class="section-title">Summary</div>
            <table>
                <tr>
                    <td>Materials Subtotal</td>
                    <td class="material-numbers">${formatMoney(materialsTotal)}</td>
                </tr>
                <tr>
                    <td>Labor</td>
                    <td class="material-numbers">${formatMoney(labor)}</td>
                </tr>
                ${estimate.discount ? `
                <tr>
                    <td>Discount (${estimate.discount}%)</td>
                    <td class="material-numbers">-${formatMoney(discountAmount)}</td>
                </tr>` : ''}
                ${estimate.fees ? `
                <tr>
                    <td>Fees</td>
                    <td class="material-numbers">+${formatMoney(estimate.fees)}</td>
                </tr>` : ''}
                <tr class="total-row">
                    <td>TOTAL ESTIMATE</td>
                    <td class="material-numbers">${formatMoney(finalTotal)}</td>
                </tr>
            </table>
            
            <div class="job-details">
                <div class="detail-box">
                    <strong>Estimated Duration</strong><br>
                    ${estimate.days || 1} day${estimate.days !== 1 ? 's' : ''}
                </div>
                <div class="detail-box">
                    <strong>Workers Required</strong><br>
                    ${estimate.workers || 1}
                </div>
            </div>
            
            <div class="footer">
                <p>Thank you for choosing ACE Handyman Services!</p>
                <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            </div>
        </body>
        </html>
    `;

    // Create a Blob with the HTML content
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Create a download link and trigger it
  const a = document.createElement('a');
  a.href = url;
  a.download = `ACE_Estimate_${index}.html`;
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};

// Initialize the app
init();