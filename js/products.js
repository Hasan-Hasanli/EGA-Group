// Products Data
let allProducts = [];
let productsContainer, searchInput, filterButtons;

document.addEventListener('DOMContentLoaded', function() {
    productsContainer = document.querySelector('.products-container');
    searchInput = document.getElementById('searchInput');
    filterButtons = document.querySelectorAll('.filter-btn');
    
    if (!productsContainer) {
        console.error('Products container not found!');
        return;
    }

    loadProducts();
    initializeEventListeners();
});

async function loadProducts() {
    try {
        const response = await fetch('data/products_fixed.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allProducts = await response.json();
        updateProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        productsContainer.innerHTML = '<p class="no-products">Məhsulları yükləmək mümkün olmadı.</p>';
    }
}

function initializeEventListeners() {
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            updateProducts();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', updateProducts);
    }
    
    // Modal closing logic
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('productModal');
        if (!modal) return;
        if (e.target.classList.contains('modal-close') || e.target.classList.contains('close-modal') || e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function updateProducts() {
    const activeCategory = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
    const searchTerm = searchInput.value.toLowerCase().trim();

    let filteredProducts = allProducts;

    // Filter by category
    if (activeCategory !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
    }

    displayProducts(filteredProducts);
}

function displayProducts(productsToShow) {
    productsContainer.innerHTML = '';

    if (productsToShow.length === 0) {
        productsContainer.innerHTML = '<p class="no-products">Bu kriteriyalara uyğun məhsul tapılmadı.</p>';
        return;
    }

    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.id = product.id;

        productCard.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.onerror=null; this.src='images/logo.png';">
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category).toLowerCase()}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-actions">
                    <button class="view-details" data-id="${product.id}">Ətraflı</button>
                </div>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });
    
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', () => openModal(button.dataset.id));
    });
}

function openModal(productId) {
    const product = allProducts.find(p => p.id == productId);
    if (!product) return;

    document.getElementById('modalImage').src = product.image || 'images/logo.png';
    document.getElementById('modalName').textContent = product.name || 'N/A';
    document.getElementById('modalCategory').textContent = getCategoryName(product.category) || 'N/A';
    document.getElementById('modalDescription').textContent = product.description || 'Təsvir yoxdur.';
    document.getElementById('modalIngredients').textContent = product.ingredients || 'Tərkib yoxdur.';
    document.getElementById('modalIndications').textContent = product.indications || product.warnings || 'Göstərişlər yoxdur.';
    document.getElementById('modalUsage').textContent = product.usage || product.instructions || 'İstifadə qaydası yoxdur.';
    document.getElementById('modalForm').textContent = product.form || product.releaseForm || product.packaging || 'Buraxılış forması yoxdur.';

    document.getElementById('productModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function getCategoryName(categoryId) {
    const categories = {
        'omega': 'Omega-3',
        'antihistamin': 'Antihistaminlər',
        'vitamin': 'Vitaminlər',
        'solunum': 'Tənəffüs Yolları',
        'metabolik': 'Metabolik',
        'agri': 'Ağrı Kəsicilər',
        'sindirim': 'Həzm Sistemi',
        'cilt': 'Dəriyə Qulluq'
    };
    return categories[categoryId] || 'Digər';
}
