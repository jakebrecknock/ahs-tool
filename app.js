const pricingData = {
    bathroom: {
        projects: {
            "Small Remodel": {
                labor: 2000,
                days: "1-2",
                crew: 1
            },
            "Full Renovation": {
                labor: 24400,
                days: "10-15",
                crew: 2
            },
            "Minor Updates": {
                labor: 2000,
                days: "1-2",
                crew: 1
            }
        },
        materials: {
            "Vents (8x8 with light)": { price: 100, unit: "each" },
            "Vents (8x8 no light)": { price: 75, unit: "each" },
            "Herringbone Tile": { price: 18, unit: "sq ft" },
            "Glazed Wall Tile": { price: 6, unit: "sq ft" },
            "Floor Tile": { price: 4, unit: "sq ft" },
            "Single Vanity": { price: 300, unit: "each" },
            "Double Vanity": { price: 2000, unit: "each" },
            "Faucet": { price: 100, unit: "each" },
            "Can Lighting": { price: 100, unit: "each" },
            "Heated Floor": { price: 9.50, unit: "sq ft" },
            "Supply Lines": { price: 7, unit: "ft" },
            "GFCI Outlets": { price: 75, unit: "each" },
            "Shower Head": { price: 120, unit: "each" },
            "Bath Spout": { price: 40, unit: "each" },
            "Bath": { price: 350, unit: "each" },
            "Toilet": { price: 400, unit: "each" }
        }
    },
    kitchen: {
        projects: {
            "Full Remodel": {
                labor: 36600,
                days: "15-25",
                crew: 2
            },
            "Cabinet Replacement": {
                labor: 12200,
                days: "3-5",
                crew: 2
            },
            "Countertops + Backsplash": {
                labor: 9760,
                days: "2-4",
                crew: 2
            },
            "Appliance Updates": {
                labor: 2000,
                days: "1-2",
                crew: 1
            }
        },
        materials: {
            "Stock Cabinets": { price: 300, unit: "ft" },
            "Custom Cabinets": { price: 900, unit: "ft" },
            "Laminate Countertops": { price: 45, unit: "sq ft" },
            "Quartz Countertops": { price: 120, unit: "sq ft" },
            "Granite Countertops": { price: 110, unit: "sq ft" },
            "Butcher Block Countertops": { price: 80, unit: "sq ft" },
            "Subway Tile Backsplash": { price: 15, unit: "sq ft" },
            "Glass Tile Backsplash": { price: 22, unit: "sq ft" },
            "Mosaic Backsplash": { price: 28, unit: "sq ft" },
            "Electric Range": { price: 1000, unit: "each" },
            "Gas Range": { price: 1000, unit: "each" },
            "Standard Refrigerator": { price: 1500, unit: "each" },
            "Dishwasher": { price: 800, unit: "each" },
            "Over-range Microwave": { price: 450, unit: "each" },
            "Range Hood": { price: 300, unit: "each" },
            "Undermount Sink": { price: 350, unit: "each" },
            "Farmhouse Sink": { price: 600, unit: "each" },
            "Kitchen Faucet": { price: 180, unit: "each" },
            "Pendant Lights": { price: 120, unit: "each" },
            "Recessed Lights": { price: 100, unit: "each" },
            "Under Cabinet Lighting": { price: 35, unit: "ft" },
            "GFCI Outlets": { price: 75, unit: "each" },
            "Switches/Dimmers": { price: 60, unit: "each" }
        }
    },
    bedroom: {
        projects: {
            "Basic Refresh": {
                labor: 1220,
                days: "1-3",
                crew: 1
            },
            "Closet Upgrade": {
                labor: 1220,
                days: "1-2",
                crew: 1
            },
            "Flooring Install": {
                labor: 2440,
                days: "1-2",
                crew: 2
            }
        },
        materials: {
            "Standard Reach-In Closet": { price: 600, unit: "each" },
            "Walk-In Closet Shelving": { price: 1500, unit: "each" },
            "Ceiling Fan w/ Light": { price: 200, unit: "each" },
            "Flush Mount Light": { price: 100, unit: "each" },
            "Recessed Lighting": { price: 100, unit: "each" },
            "Interior Door": { price: 200, unit: "each" },
            "Closet Bifold Door": { price: 180, unit: "each" },
            "Wall & Ceiling Paint": { price: 2.50, unit: "sq ft" },
            "Standard Molding": { price: 5, unit: "linear foot" }
        }
    },
    flooring: {
        projects: {
            "Hardwood/LVP Install": {
                labor: 4880,
                days: "2-4",
                crew: 2
            },
            "Tile Flooring": {
                labor: 12200,
                days: "3-5",
                crew: 2
            },
            "Carpet Replacement": {
                labor: 2440,
                days: "1",
                crew: 2
            }
        },
        materials: {
            "Solid Hardwood": { price: 10, unit: "sq ft" },
            "Engineered Hardwood": { price: 8, unit: "sq ft" },
            "Laminate Flooring": { price: 4.50, unit: "sq ft" },
            "Luxury Vinyl Plank (LVP)": { price: 6, unit: "sq ft" },
            "Porcelain Tile": { price: 6.50, unit: "sq ft" },
            "Stone Tile": { price: 9, unit: "sq ft" },
            "Carpet": { price: 5.50, unit: "sq ft" }
        }
    },
    garage: {
        projects: {
            "Door + Opener Replacement": {
                labor: 2440,
                days: "1",
                crew: 2
            },
            "Epoxy Floor Coating": {
                labor: 4880,
                days: "2-3",
                crew: 2
            },
            "Storage & Lighting": {
                labor: 2000,
                days: "1-2",
                crew: 1
            }
        },
        materials: {
            "Single Manual Door": { price: 900, unit: "each" },
            "Single Automatic Door": { price: 1300, unit: "each" },
            "Double Automatic Door": { price: 1900, unit: "each" },
            "Chain Drive Opener": { price: 300, unit: "each" },
            "Belt Drive Opener": { price: 450, unit: "each" },
            "Wall-mounted Shelving": { price: 400, unit: "each" },
            "Ceiling Storage Rack": { price: 300, unit: "each" },
            "LED Strip Light": { price: 120, unit: "each" },
            "Epoxy Floor Coating": { price: 6, unit: "sq ft" }
        }
    },
    basement: {
        projects: {
            "Full Finish": {
                labor: 36600,
                days: "21-35",
                crew: 2
            },
            "Bathroom Addition": {
                labor: 12200,
                days: "7-14",
                crew: 2
            },
            "Minor Upgrades": {
                labor: 2440,
                days: "2-5",
                crew: 1
            }
        },
        materials: {
            "Framing & Insulation": { price: 28, unit: "sq ft" },
            "Drywall": { price: 4.50, unit: "sq ft" },
            "Can Lights": { price: 100, unit: "each" },
            "Sump Pump System": { price: 1600, unit: "each" },
            "Dehumidifier Unit": { price: 850, unit: "each" },
            "Full Bath Fixtures": { price: 9000, unit: "each" }
        }
    },
    glass: {
        projects: {
            "Window Replacement": {
                labor: 2440,
                days: "1-2",
                crew: 2
            },
            "Shower Glass Install": {
                labor: 1220,
                days: "0.5-1",
                crew: 1
            },
            "Mirror Install": {
                labor: 400,
                days: "0.25-0.5",
                crew: 1
            }
        },
        materials: {
            "Standard Double-Hung Window": { price: 500, unit: "each" },
            "Picture Window": { price: 700, unit: "each" },
            "Bay Window": { price: 1600, unit: "each" },
            "Frameless Shower Enclosure": { price: 1200, unit: "each" },
            "Sliding Glass Shower Doors": { price: 850, unit: "each" },
            "Standard Vanity Mirror": { price: 200, unit: "each" },
            "Custom Cut Mirror": { price: 400, unit: "each" }
        }
    },
    decking: {
        projects: {
            "New Deck Construction": {
                labor: 12200,
                days: "5-10",
                crew: 2
            },
            "Stairs/Railing Replacement": {
                labor: 2440,
                days: "1-2",
                crew: 2
            },
            "Resurfacing/Staining": {
                labor: 1220,
                days: "1-3",
                crew: 1
            }
        },
        materials: {
            "Pressure-Treated Framing": { price: 12, unit: "sq ft" },
            "Steel Framing": { price: 18, unit: "sq ft" },
            "Pressure-Treated Deck Boards": { price: 16, unit: "sq ft" },
            "Cedar Deck Boards": { price: 20, unit: "sq ft" },
            "Composite Deck Boards": { price: 28, unit: "sq ft" },
            "PVC Deck Boards": { price: 32, unit: "sq ft" },
            "Wood Railing": { price: 40, unit: "linear foot" },
            "Composite Railing": { price: 60, unit: "linear foot" },
            "Cable Railing": { price: 90, unit: "linear foot" },
            "Basic Wood Steps": { price: 350, unit: "flight" },
            "Composite Steps": { price: 500, unit: "flight" },
            "Additional Steps": { price: 90, unit: "each" },
            "Lattice Wood Skirt": { price: 18, unit: "sq ft" },
            "Composite Skirt": { price: 25, unit: "sq ft" },
            "Concrete Footings": { price: 250, unit: "each" },
            "Support Posts": { price: 90, unit: "each" },
            "Post Cap Lights": { price: 80, unit: "each" },
            "Stair Lights": { price: 60, unit: "each" },
            "Initial Seal/Stain": { price: 3.50, unit: "sq ft" },
            "Maintenance Recoat": { price: 2, unit: "sq ft" }
        }
    },
    concrete: {
        projects: {
            "Driveway": {
                labor: 12200,
                days: "3-5",
                crew: 2
            },
            "Walkway or Steps": {
                labor: 2440,
                days: "1-3",
                crew: 2
            },
            "Stamped Patio": {
                labor: 9760,
                days: "3-4",
                crew: 2
            }
        },
        materials: {
            "Standard Driveway Pour": { price: 10, unit: "sq ft" },
            "Stamped Driveway": { price: 16, unit: "sq ft" },
            "Standard Walkway": { price: 8, unit: "sq ft" },
            "Decorative Walkway": { price: 14, unit: "sq ft" },
            "Plain Patio": { price: 9, unit: "sq ft" },
            "Decorative/Stained Patio": { price: 15, unit: "sq ft" },
            "Concrete Steps": { price: 350, unit: "step" }
        }
    },
    roofing: {
        projects: {
            "Shingle Roof Replacement": {
                labor: 24400,
                days: "3-5",
                crew: 3
            },
            "Tile Roof Replacement": {
                labor: 36600,
                days: "5-7",
                crew: 3
            },
            "Roof Repair": {
                labor: 2440,
                days: "1-2",
                crew: 2
            },
            "Gutter Installation": {
                labor: 1220,
                days: "1",
                crew: 2
            }
        },
        materials: {
            "Asphalt Shingles": { price: 3.50, unit: "sq ft" },
            "Architectural Shingles": { price: 5, unit: "sq ft" },
            "Clay Tile": { price: 15, unit: "sq ft" },
            "Concrete Tile": { price: 10, unit: "sq ft" },
            "Metal Roofing": { price: 12, unit: "sq ft" },
            "Underlayment": { price: 1.50, unit: "sq ft" },
            "Flashing": { price: 8, unit: "linear foot" },
            "Gutters": { price: 10, unit: "linear foot" },
            "Downspouts": { price: 8, unit: "linear foot" }
        }
    },
    misc: {
        projects: {
            "Door Replacement": {
                labor: 400,
                days: "0.5-1",
                crew: 1
            },
            "Trim/Baseboard Install": {
                labor: 2440,
                days: "1-2",
                crew: 2
            },
            "Drywall Patch/Paint": {
                labor: 1220,
                days: "0.25-1",
                crew: 1
            }
        },
        materials: {
            "Steel Exterior Door": { price: 750, unit: "each" },
            "Wood Exterior Door": { price: 900, unit: "each" },
            "French Doors": { price: 1200, unit: "each" },
            "Sliding Glass Door": { price: 1400, unit: "each" },
            "Small Drywall Patch": { price: 150, unit: "each" },
            "Large Drywall Patch": { price: 300, unit: "each" },
            "Caulking/Sealant Work": { price: 5, unit: "ft" },
            "Baseboard Heater": { price: 250, unit: "each" },
            "Smoke/CO Detector": { price: 90, unit: "each" }
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
const monthSelect = document.getElementById('month-select');

// Current selection
let currentCategories = [];
let currentProjects = {};
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
        const subtotal = materialsTotal + labor;
        const totalWithFees = subtotal + (estimate.fees || 0);
        const discountAmount = (estimate.discount || 0) * totalWithFees / 100;
        const finalTotal = totalWithFees - discountAmount;
        
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
    const monthFilter = monthSelect.value;
    const now = new Date();
    
    let filtered = estimates;
    if (monthFilter !== 'all') {
        filtered = estimates.filter(estimate => {
            const date = new Date(estimate.timestamp);
            return date.getMonth() === parseInt(monthFilter) && date.getFullYear() === now.getFullYear();
        });
    }
    
    totalEstimatesEl.textContent = filtered.length;
    
    const totalValue = filtered.reduce((sum, estimate) => {
        const materialsTotal = calculateMaterialsTotal(estimate.materials);
        const subtotal = materialsTotal + (estimate.laborCost || 0) + (estimate.fees || 0);
        const discountAmount = (estimate.discount || 0) * subtotal / 100;
        return sum + (subtotal - discountAmount);
    }, 0);
    
    totalValueEl.textContent = formatMoney(totalValue);
    
    // Calculate monthly total (current month)
    const currentMonthEstimates = estimates.filter(estimate => {
        const date = new Date(estimate.timestamp);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
    
    const monthlyValue = currentMonthEstimates.reduce((sum, estimate) => {
        const materialsTotal = calculateMaterialsTotal(estimate.materials);
        const subtotal = materialsTotal + (estimate.laborCost || 0) + (estimate.fees || 0);
        const discountAmount = (estimate.discount || 0) * subtotal / 100;
        return sum + (subtotal - discountAmount);
    }, 0);
    
    document.getElementById('monthly-value').textContent = formatMoney(monthlyValue);
}

// Setup event listeners
function setupEventListeners() {
    // Modal controls
    newEstimateBtn.addEventListener('click', () => {
        resetForm();
        estimateModal.classList.add('active');
        estimateModal.classList.remove('hidden');
        showStep('step-1');
    });
    
    closeModalBtn.addEventListener('click', () => {
        estimateModal.classList.remove('active');
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
            const category = e.target.dataset.category;
            const index = currentCategories.indexOf(category);
            
            if (index === -1) {
                currentCategories.push(category);
                e.target.classList.add('selected-category');
            } else {
                currentCategories.splice(index, 1);
                e.target.classList.remove('selected-category');
                delete currentProjects[category];
            }
            
            showProjects();
            document.querySelector('#step-2 .next-step').disabled = currentCategories.length === 0;
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
    
    // Month filter
    monthSelect.addEventListener('change', updateStats);
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
        const requiredFields = ['client-name', 'client-location'];
        for (const fieldId of requiredFields) {
            if (!document.getElementById(fieldId).value.trim()) {
                alert('Please fill in all required fields');
                return false;
            }
        }
    } else if (nextStep === 'step-3') {
        if (Object.keys(currentProjects).length === 0) {
            alert('Please select at least one project');
            return false;
        }
    }
    return true;
}

// Show projects for selected categories
// Replace the entire showProjects function with this:
function showProjects() {
    projectSelection.innerHTML = '<h3>Select Project Types</h3>';
    
    currentCategories.forEach(category => {
        const categoryHeader = document.createElement('h4');
        categoryHeader.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryHeader.style.marginTop = '20px';
        categoryHeader.style.color = 'var(--primary)';
        projectSelection.appendChild(categoryHeader);

        const projects = pricingData[category]?.projects || {};
        for (const [projectName, projectData] of Object.entries(projects)) {
            const projectDiv = document.createElement('div');
            projectDiv.className = 'project-option';
            if (currentProjects[category] === projectName) {
                projectDiv.classList.add('selected-project');
            }
            
            projectDiv.innerHTML = `
                <h4>${projectName}</h4>
                <p>Labor: ${formatMoney(projectData.labor)}</p>
                <p>Duration: ${projectData.days} days | Crew: ${projectData.crew}</p>
                <button class="button button-primary select-project ${currentProjects[category] === projectName ? 'selected' : ''}" 
                    data-category="${category}" data-project="${projectName}">
                    ${currentProjects[category] === projectName ? 'Selected' : 'Select'}
                </button>
            `;
            projectSelection.appendChild(projectDiv);

            // Add click handler for the button
            const button = projectDiv.querySelector('.select-project');
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const category = e.target.dataset.category;
                const project = e.target.dataset.project;
                
                if (currentProjects[category] === project) {
                    delete currentProjects[category];
                    e.target.textContent = 'Select';
                    e.target.classList.remove('selected');
                    projectDiv.classList.remove('selected-project');
                } else {
                    currentProjects[category] = project;
                    e.target.textContent = 'Selected';
                    e.target.classList.add('selected');
                    projectDiv.classList.add('selected-project');
                }
                
                // Show materials when project is selected
                if (Object.keys(currentProjects).length > 0) {
                    showMaterials();
                }
            });
        }
    });
}

   // Show materials for selected projects
function showMaterials() {
    materialSelection.innerHTML = '<h3>Select Materials</h3>';
    // Don't reset selectedMaterials here - we want to preserve any existing selections

    currentCategories.forEach(category => {
        if (currentProjects[category]) {
            const categoryHeader = document.createElement('h4');
            categoryHeader.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} Materials`;
            categoryHeader.style.marginTop = '20px';
            categoryHeader.style.color = 'var(--primary)';
            materialSelection.appendChild(categoryHeader);

            const materials = pricingData[category]?.materials || {};
            for (const [materialName, materialData] of Object.entries(materials)) {
                const materialDiv = document.createElement('div');
                materialDiv.className = 'material-option';
                
                // Check if this material is already selected
                const isSelected = selectedMaterials[materialName] !== undefined;
                const quantity = isSelected ? selectedMaterials[materialName].quantity : 1;
                
                materialDiv.innerHTML = `
                    <div class="material-label">
                        <input type="checkbox" data-material="${materialName}" data-price="${materialData.price}" data-unit="${materialData.unit}"
                            ${isSelected ? 'checked' : ''}>
                        ${materialName} - ${formatMoney(materialData.price)}/${materialData.unit}
                    </div>
                    <input type="number" min="1" value="${quantity}" class="material-quantity" 
                        style="display: ${isSelected ? 'inline-block' : 'none'};">
                `;
                materialSelection.appendChild(materialDiv);

                const checkbox = materialDiv.querySelector('input[type="checkbox"]');
                const quantityInput = materialDiv.querySelector('.material-quantity');
                
                checkbox.addEventListener('change', () => {
                    quantityInput.style.display = checkbox.checked ? 'inline-block' : 'none';
                    
                    if (checkbox.checked) {
                        selectedMaterials[materialName] = {
                            price: parseFloat(checkbox.dataset.price),
                            quantity: parseFloat(quantityInput.value) || 1,
                            unit: checkbox.dataset.unit
                        };
                    } else {
                        delete selectedMaterials[materialName];
                    }
                });
                
                quantityInput.addEventListener('change', () => {
                    if (checkbox.checked) {
                        selectedMaterials[materialName] = {
                            price: parseFloat(checkbox.dataset.price),
                            quantity: parseFloat(quantityInput.value) || 1,
                            unit: checkbox.dataset.unit
                        };
                    }
                });
            }
        }
    });
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
    // Get selected materials from checkboxes
    document.querySelectorAll('#material-selection input[type="checkbox"]').forEach(checkbox => {
        const materialName = checkbox.dataset.material;
        if (checkbox.checked) {
            const materialPrice = parseFloat(checkbox.dataset.price);
            const quantityInput = checkbox.closest('.material-option').querySelector('.material-quantity');
            
            let quantity = parseFloat(quantityInput.value) || 1;
            
            selectedMaterials[materialName] = {
                price: materialPrice,
                quantity: quantity,
                unit: checkbox.dataset.unit || 'each'
            };
        } else {
            delete selectedMaterials[materialName];
        }
    });

    // Get project data
    let totalLabor = 0;
    let totalDays = 0;
    let totalWorkers = 0;
    
    Object.entries(currentProjects).forEach(([category, projectName]) => {
        const projectData = pricingData[category].projects[projectName];
        totalLabor += projectData.labor;
        totalDays += parseInt(projectData.days.split('-')[1]) || parseInt(projectData.days) || 1;
        totalWorkers += projectData.crew || 1;
    });

    // Check if we have an edited labor cost
    const editLaborInput = document.getElementById('edit-labor-cost');
    if (editLaborInput) {
        totalLabor = parseFloat(editLaborInput.value) || totalLabor;
    }

    // Create new estimate
    const newEstimate = {
        clientName: document.getElementById('client-name').value.trim(),
        clientEmail: document.getElementById('client-email').value.trim(),
        clientPhone: document.getElementById('client-phone').value.trim(),
        clientLocation: document.getElementById('client-location').value.trim(),
        projectName: `${Object.values(currentProjects).join(', ')}`,
        categories: [...currentCategories],
        projects: {...currentProjects},
        laborCost: totalLabor,
        materials: selectedMaterials,
        days: parseInt(document.getElementById('project-days').value) || totalDays,
        workers: parseInt(document.getElementById('project-workers').value) || totalWorkers,
        discount: parseFloat(document.getElementById('project-discount').value) || 0,
        fees: parseFloat(document.getElementById('project-fees').value) || 0,
        timestamp: new Date().toISOString()
    };
    
    // Calculate total
    const materialsTotal = calculateMaterialsTotal(newEstimate.materials);
    const labor = newEstimate.laborCost || 0;
    const subtotal = materialsTotal + labor;
    const totalWithFees = subtotal + (newEstimate.fees || 0);
    const discountAmount = (newEstimate.discount || 0) * totalWithFees / 100;
    newEstimate.total = totalWithFees - discountAmount;
    
    // Add to estimates array
    const editIndex = saveEstimateBtn.dataset.editIndex;
    if (editIndex !== undefined) {
        estimates[editIndex] = newEstimate;
        delete saveEstimateBtn.dataset.editIndex;
    } else {
        estimates.unshift(newEstimate);
    }
    
    localStorage.setItem('estimates', JSON.stringify(estimates));
    
    // Close modal and refresh
    estimateModal.classList.remove('active');
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
    document.getElementById('project-days').value = '1';
    document.getElementById('project-workers').value = '1';
    document.getElementById('project-discount').value = '0';
    document.getElementById('project-fees').value = '0';
    document.getElementById('custom-material-name').value = '';
    document.getElementById('custom-material-qty').value = '1';
    document.getElementById('custom-material-price').value = '';
    
    currentCategories = [];
    currentProjects = {};
    selectedMaterials = {}; // Reset materials here instead of in showMaterials()
    projectSelection.innerHTML = '';
    materialSelection.innerHTML = '';
    document.querySelector('#step-2 .next-step').disabled = true;
    
    // Reset category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('selected-category');
    });
    
    // Reset to first step
    showStep('step-1');
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
// Replace the entire editEstimate function with this:
// Replace the entire editEstimate function with this:
window.editEstimate = function(index) {
    const estimate = estimates[index];
    
    // Populate modal with estimate data
    document.getElementById('client-name').value = estimate.clientName;
    document.getElementById('client-email').value = estimate.clientEmail || '';
    document.getElementById('client-phone').value = estimate.clientPhone || '';
    document.getElementById('client-location').value = estimate.clientLocation;
    document.getElementById('project-days').value = estimate.days || 1;
    document.getElementById('project-workers').value = estimate.workers || 1;
    document.getElementById('project-discount').value = estimate.discount || 0;
    document.getElementById('project-fees').value = estimate.fees || 0;
    
    // Set categories and projects
    currentCategories = estimate.categories || [];
    currentProjects = estimate.projects || {};
    
    // Highlight selected category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        if (currentCategories.includes(btn.dataset.category)) {
            btn.classList.add('selected-category');
        } else {
            btn.classList.remove('selected-category');
        }
    });
    
    // Show projects and materials
    showProjects();
    showMaterials();
    
    // Check materials that were selected
    if (estimate.materials) {
        selectedMaterials = {...estimate.materials};
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
    
    // Add labor cost editing field
    const laborField = document.createElement('div');
    laborField.className = 'form-group';
    laborField.innerHTML = `
        <label><i class="fas fa-dollar-sign"></i> Labor Cost</label>
        <input type="number" id="edit-labor-cost" min="0" step="0.01" value="${estimate.laborCost || 0}">
    `;
    document.getElementById('step-4').insertBefore(laborField, document.getElementById('step-4').firstChild);
    
    // Open modal and show materials step
    estimateModal.classList.add('active');
    estimateModal.classList.remove('hidden');
    showStep('step-3');
    
    // Store the index of the estimate being edited
    saveEstimateBtn.dataset.editIndex = index;
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
    const estimate = filteredEstimates[index] || estimates[index];
    if (!estimate) return;

    const materialsTotal = calculateMaterialsTotal(estimate.materials);
    const labor = estimate.laborCost || 0;
    const subtotal = materialsTotal + labor;
    const totalWithFees = subtotal + (estimate.fees || 0);
    const discountAmount = (estimate.discount || 0) * totalWithFees / 100;
    const finalTotal = totalWithFees - discountAmount;

    // Create a temporary div for PDF generation
    const pdfContainer = document.createElement('div');
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '-9999px';
    pdfContainer.style.width = '800px';
    pdfContainer.style.padding = '20px';
    pdfContainer.style.fontFamily = 'Arial, sans-serif';
    
    pdfContainer.innerHTML = `
        <div style="margin-bottom: 20px;">
            <div style="font-size: 24px; font-weight: bold; color: #B7410E;">ACE Handyman Services</div>
            <div style="font-size: 14px; color: #666; margin-top: 5px;">207 N. Harlem Ave., Oak Park IL., 60302</div>
            <div style="margin-top: 15px; font-size: 14px;">Estimate #${index + 1}</div>
        </div>
        
        <h1 style="font-size: 28px; color: #B7410E; margin: 25px 0; border-bottom: 2px solid #FF7F50; padding-bottom: 10px;">Project Estimate</h1>
        
        <div style="margin-bottom: 30px;">
            <p><strong>Client:</strong> ${estimate.clientName || "Not specified"}</p>
            <p><strong>Project:</strong> ${estimate.projectName || "General work"}</p>
            <p><strong>Location:</strong> ${estimate.clientLocation || "Not specified"}</p>
            ${estimate.clientEmail ? `<p><strong>Email:</strong> ${estimate.clientEmail}</p>` : ''}
            ${estimate.clientPhone ? `<p><strong>Phone:</strong> ${formatPhoneNumber(estimate.clientPhone)}</p>` : ''}
            <p><strong>Date:</strong> ${new Date(estimate.timestamp).toLocaleDateString()}</p>
        </div>
        
        <h3 style="background: #FF7F50; color: white; padding: 10px 15px; margin: 25px 0 15px; border-radius: 4px;">Materials</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <thead>
                <tr style="background: #f5f5f5;">
                    <th style="text-align: left; padding: 12px; font-weight: 500; width: 40%;">Item</th>
                    <th style="text-align: right; padding: 12px; font-weight: 500; width: 15%;">Qty</th>
                    <th style="text-align: right; padding: 12px; font-weight: 500; width: 20%;">Unit Price</th>
                    <th style="text-align: right; padding: 12px; font-weight: 500; width: 25%;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${estimate.materials ? Object.entries(estimate.materials).map(([name, item]) => `
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #eee;">${name}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${item.quantity}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatMoney(item.price)}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatMoney(item.price * item.quantity)}</td>
                    </tr>
                `).join('') : '<tr><td colspan="4" style="text-align: center; padding: 12px;">No materials specified</td></tr>'}
            </tbody>
        </table>
        
        <h3 style="background: #FF7F50; color: white; padding: 10px 15px; margin: 25px 0 15px; border-radius: 4px;">Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">Materials Subtotal</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatMoney(materialsTotal)}</td>
            </tr>
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">Labor</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatMoney(labor)}</td>
            </tr>
            ${estimate.discount ? `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">Discount (${estimate.discount}%)</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; color: #c0392b;">-${formatMoney(discountAmount)}</td>
            </tr>` : ''}
            ${estimate.fees ? `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">Fees</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; color: #27ae60;">+${formatMoney(estimate.fees)}</td>
            </tr>` : ''}
            <tr style="font-weight: bold; font-size: 1.1em;">
                <td style="padding: 12px; border-top: 1px solid #eee;">TOTAL ESTIMATE</td>
                <td style="padding: 12px; border-top: 1px solid #eee; text-align: right;">${formatMoney(finalTotal)}</td>
            </tr>
        </table>
        
        <div style="display: flex; gap: 20px; margin-top: 30px;">
            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 6px; flex: 1; text-align: center;">
                <strong>Estimated Duration</strong><br>
                ${estimate.days || 1} day${estimate.days !== 1 ? 's' : ''}
            </div>
            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 6px; flex: 1; text-align: center;">
                <strong>Workers Required</strong><br>
                ${estimate.workers || 1}
            </div>
        </div>
        
        <div style="margin-top: 50px; font-size: 14px; text-align: center; color: #777; border-top: 1px solid #eee; padding-top: 20px;">
            <p>Thank you for choosing ACE Handyman Services!</p>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
    `;

    document.body.appendChild(pdfContainer);

    // Generate PDF
    html2canvas(pdfContainer).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm'
        });
        
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        pdf.save(`ACE_Estimate_${index + 1}.pdf`);
        document.body.removeChild(pdfContainer);
    });
};

// Initialize the app
init();