const pricingData = {
     bathroom: {
        projects: {
            "Small Remodel": {
                labor: 1200,
                days: "1-2",
                crew: 2
            },
            "Large Remodel": {
                labor: 3500,
                days: "3-5",
                crew: 3
            },
            "Fixture Replacement": {
                labor: 450,
                days: "1",
                crew: 1
            }
        },
        materials: {
            "Tile (sq ft)": { price: 3.50, unit: "sq ft" },
            "Vanity": { price: 250, unit: "each" },
            "Toilet": { price: 180, unit: "each" },
            "Shower Door": { price: 400, unit: "each" }
        }
    },
    kitchen: {
        projects: {
            "Cabinet Refacing": {
                labor: 2500,
                days: "2-3",
                crew: 2
            },
            "Full Remodel": {
                labor: 6500,
                days: "5-7",
                crew: 3
            },
            "Countertop Installation": {
                labor: 1200,
                days: "1-2",
                crew: 2
            }
        },
        materials: {
            "Granite Countertop (sq ft)": { price: 45, unit: "sq ft" },
            "Cabinet Set": { price: 1200, unit: "set" },
            "Backsplash Tile (sq ft)": { price: 4.25, unit: "sq ft" },
            "Sink": { price: 220, unit: "each" }
        }
    },
    bedroom: {
        projects: {
            "Closet Organization": {
                labor: 600,
                days: "1",
                crew: 1
            },
            "Wall Repair/Paint": {
                labor: 850,
                days: "1-2",
                crew: 1
            },
            "Flooring Installation": {
                labor: 1200,
                days: "2-3",
                crew: 2
            }
        },
        materials: {
            "Closet System": { price: 350, unit: "each" },
            "Paint (gallon)": { price: 35, unit: "gallon" },
            "Hardwood Flooring (sq ft)": { price: 5.75, unit: "sq ft" },
            "Baseboard (linear ft)": { price: 2.50, unit: "ft" }
        }
    },
    flooring: {
        projects: {
            "Hardwood Installation": {
                labor: 1800,
                days: "2-3",
                crew: 2
            },
            "Tile Installation": {
                labor: 1500,
                days: "2-3",
                crew: 2
            },
            "Laminate Installation": {
                labor: 1200,
                days: "1-2",
                crew: 2
            }
        },
        materials: {
            "Hardwood (sq ft)": { price: 6.50, unit: "sq ft" },
            "Tile (sq ft)": { price: 3.75, unit: "sq ft" },
            "Laminate (sq ft)": { price: 2.25, unit: "sq ft" },
            "Underlayment (sq ft)": { price: 0.75, unit: "sq ft" }
        }
    },
    garage: {
        projects: {
            "Door Installation": {
                labor: 450,
                days: "1",
                crew: 1
            },
            "Storage System": {
                labor: 800,
                days: "1-2",
                crew: 1
            },
            "Floor Coating": {
                labor: 1200,
                days: "2",
                crew: 2
            }
        },
        materials: {
            "Garage Door": { price: 850, unit: "each" },
            "Storage Rack": { price: 120, unit: "each" },
            "Floor Epoxy (sq ft)": { price: 2.25, unit: "sq ft" },
            "Shelving (linear ft)": { price: 15, unit: "ft" }
        }
    },
    aircon: {
        projects: {
            "Unit Installation": {
                labor: 1200,
                days: "1",
                crew: 2
            },
            "Duct Work": {
                labor: 1800,
                days: "2-3",
                crew: 2
            },
            "Maintenance Service": {
                labor: 150,
                days: "1",
                crew: 1
            }
        },
        materials: {
            "AC Unit": { price: 2500, unit: "each" },
            "Ducting (linear ft)": { price: 8, unit: "ft" },
            "Thermostat": { price: 120, unit: "each" },
            "Vent Cover": { price: 25, unit: "each" }
        }
    },
    roofing: {
        projects: {
            "Shingle Replacement": {
                labor: 2500,
                days: "2-3",
                crew: 3
            },
            "Roof Repair": {
                labor: 800,
                days: "1",
                crew: 2
            },
            "Gutter Installation": {
                labor: 1200,
                days: "1-2",
                crew: 2
            }
        },
        materials: {
            "Shingles (sq ft)": { price: 1.25, unit: "sq ft" },
            "Flashing (linear ft)": { price: 3.50, unit: "ft" },
            "Gutter (linear ft)": { price: 6, unit: "ft" },
            "Downspout": { price: 25, unit: "each" }
        }
    },
    concrete: {
        projects: {
            "Patio Installation": {
                labor: 1800,
                days: "2-3",
                crew: 3
            },
            "Sidewalk Repair": {
                labor: 1200,
                days: "1-2",
                crew: 2
            },
            "Driveway Resurfacing": {
                labor: 2500,
                days: "3-4",
                crew: 3
            }
        },
        materials: {
            "Concrete (sq yd)": { price: 120, unit: "sq yd" },
            "Reinforcement Mesh": { price: 1.25, unit: "sq ft" },
            "Sealer (gallon)": { price: 35, unit: "gallon" },
            "Form Boards": { price: 8, unit: "each" }
        }
    },
    basement: {
        projects: {
            "Waterproofing": {
                labor: 3500,
                days: "3-5",
                crew: 3
            },
            "Finishing": {
                labor: 5000,
                days: "5-7",
                crew: 3
            },
            "Egress Window": {
                labor: 1800,
                days: "2",
                crew: 2
            }
        },
        materials: {
            "Drywall (sheet)": { price: 12, unit: "sheet" },
            "Insulation (sq ft)": { price: 0.75, unit: "sq ft" },
            "Flooring (sq ft)": { price: 3.50, unit: "sq ft" },
            "Egress Window": { price: 850, unit: "each" }
        }
    },
    glass: {
        projects: {
            "Window Replacement": {
                labor: 250,
                days: "1",
                crew: 1
            },
            "Mirror Installation": {
                labor: 150,
                days: "1",
                crew: 1
            },
            "Shower Door Installation": {
                labor: 300,
                days: "1",
                crew: 1
            }
        },
        materials: {
            "Window Pane": { price: 120, unit: "each" },
            "Mirror": { price: 85, unit: "each" },
            "Shower Glass": { price: 350, unit: "each" },
            "Glass Shelf": { price: 65, unit: "each" }
        }
    },
    decking: {
        projects: {
            "New Deck Construction": {
                labor: 3500,
                days: "4-5",
                crew: 3
            },
            "Deck Repair": {
                labor: 1200,
                days: "2-3",
                crew: 2
            },
            "Stair Installation": {
                labor: 800,
                days: "1-2",
                crew: 2
            }
        },
        materials: {
            "Deck Board (linear ft)": { price: 3.25, unit: "ft" },
            "Post": { price: 45, unit: "each" },
            "Railings (linear ft)": { price: 12, unit: "ft" },
            "Hardware Kit": { price: 85, unit: "kit" }
        }
    },
    misc: {
        projects: {
            "Drywall Repair": {
                labor: 400,
                days: "1",
                crew: 1
            },
            "Painting Service": {
                labor: 800,
                days: "1-2",
                crew: 2
            },
            "General Handyman": {
                labor: 65,
                days: "1",
                crew: 1
            }
        },
        materials: {
            "Drywall (sheet)": { price: 12, unit: "sheet" },
            "Paint (gallon)": { price: 35, unit: "gallon" },
            "Trim (linear ft)": { price: 2.25, unit: "ft" },
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
    }
    return true;
}

// Show projects for selected categories
function showProjects() {
    projectSelection.innerHTML = '<h3>Select Project Types</h3>';
    materialSelection.innerHTML = '';
    selectedMaterials = {};
    
    currentCategories.forEach(category => {
        const categoryHeader = document.createElement('h4');
        categoryHeader.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryHeader.style.marginTop = '20px';
        categoryHeader.style.color = 'var(--primary)';
        projectSelection.appendChild(categoryHeader);

        const projects = pricingData[category].projects;
        for (const [projectName, projectData] of Object.entries(projects)) {
            const projectDiv = document.createElement('div');
            projectDiv.className = 'project-option';
            projectDiv.innerHTML = `
                <h4>${projectName}</h4>
                <p>Labor: ${formatMoney(projectData.labor)}</p>
                <p>Duration: ${projectData.days} days | Crew: ${projectData.crew}</p>
                <button class="button button-primary select-project" data-category="${category}" data-project="${projectName}">
                    ${currentProjects[category] === projectName ? 'Selected' : 'Select'}
                </button>
            `;
            projectSelection.appendChild(projectDiv);
        }
    });

    document.querySelectorAll('.select-project').forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.target.dataset.category;
            const project = e.target.dataset.project;
            
            if (currentProjects[category] === project) {
                delete currentProjects[category];
                e.target.textContent = 'Select';
            } else {
                currentProjects[category] = project;
                e.target.textContent = 'Selected';
            }
        });
    });
}

// Show materials for selected projects
function showMaterials() {
    materialSelection.innerHTML = '<h3>Select Materials</h3>';
    selectedMaterials = {};

    currentCategories.forEach(category => {
        if (currentProjects[category]) {
            const categoryHeader = document.createElement('h4');
            categoryHeader.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} Materials`;
            categoryHeader.style.marginTop = '20px';
            categoryHeader.style.color = 'var(--primary)';
            materialSelection.appendChild(categoryHeader);

            const materials = pricingData[category].materials;
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
    // Get selected materials
    document.querySelectorAll('#material-selection input[type="checkbox"]:checked').forEach(checkbox => {
        const materialName = checkbox.dataset.material;
        const materialPrice = parseFloat(checkbox.dataset.price);
        const quantityInput = checkbox.closest('.material-option').querySelector('.material-quantity');
        
        let quantity = parseFloat(quantityInput.value) || 1;
        
        selectedMaterials[materialName] = {
            price: materialPrice,
            quantity: quantity,
            unit: 'each' // Default unit for selected materials
        };
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

    // Create new estimate
    const newEstimate = {
        clientName: document.getElementById('client-name').value.trim(),
        clientEmail: document.getElementById('client-email').value.trim(),
        clientPhone: document.getElementById('client-phone').value.trim(),
        clientLocation: document.getElementById('client-location').value.trim(),
        projectName: `${document.getElementById('client-name').value.trim()} - ${Object.values(currentProjects).join(', ')}`,
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
    
    // Calculate total with discount applied after fees
    const materialsTotal = calculateMaterialsTotal(newEstimate.materials);
    const subtotal = materialsTotal + newEstimate.laborCost + newEstimate.fees;
    const discountAmount = (newEstimate.discount || 0) * subtotal / 100;
    newEstimate.total = subtotal - discountAmount;
    
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
    selectedMaterials = {};
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
    currentCategories = estimate.categories || [estimate.category];
    currentProjects = estimate.projects || { [estimate.category]: estimate.projectType };
    
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
    
    // Open modal at materials step
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