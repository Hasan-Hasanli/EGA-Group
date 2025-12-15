// Products Data - JSON dosyasından yüklenecek
let products = [];
let productsContainer, searchInput, searchButton, filterButtons;

// Initialize products page
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    productsContainer = document.querySelector('.products-container');
    searchInput = document.getElementById('searchInput');
    searchButton = document.getElementById('searchButton');
    filterButtons = document.querySelectorAll('.filter-btn');
    
    console.log('DOM Elements Yüklendi:');
    console.log('productsContainer:', productsContainer);
    
    loadProducts();
    initializeCategoryFilter();
});

// Ürünleri JSON dosyasından yükle
async function loadProducts() {
    try {
        // Sadece JSON dosyasından yükle
        const response = await fetch('data/products.json');
        const data = await response.json();
        products = data;
        displayProducts(products);
    } catch (error) {
        console.error('Ürünler yüklenirken hata:', error);
        products = [];
        displayProducts(products);
    }
}

// Initialize category filter
function initializeCategoryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter products
            const category = this.dataset.category;
            filterProducts(category);
        });
    });
}

// Filter products by category
function filterProducts(category) {
    let filteredProducts;
    
    if (category === 'all') {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    displayProducts(filteredProducts);
}

// Display Products
function displayProducts(productsToShow) {
    if (!productsContainer) {
        console.error('productsContainer bulunamadı!');
        return;
    }
    
    productsContainer.innerHTML = '';
    
    if (productsToShow.length === 0) {
        productsContainer.innerHTML = '<p class="no-products">Üzgünüz, aradığınız kriterlere uygun ürün bulunamadı.</p>';
        return;
    }
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='images/logo.png'">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-category">${getCategoryName(product.category)}</p>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    <span class="stars">${generateStars(product.rating)}</span>
                    <span class="rating-text">${product.rating} (${product.reviews} değerlendirme)</span>
                </div>
                <button class="view-details-btn" onclick="viewProductDetails(${product.id})">Detayları Gör</button>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });
}
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" 
                     onerror="this.onerror=null; this.src='images/logo.png';">
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h3>${product.name}</h3>
                <div class="product-actions">
                    <button class="view-details" data-id="${product.id}">Ətraflı</button>
                </div>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    // Add event listeners to detail buttons
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', () => showProductDetails(button.dataset.id));
    });
}

// Get star rating HTML
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

// Show product details in modal
function showProductDetails(productId) {
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) return;
    
    // Create modal HTML
    const modalHTML = `
        <div id="productModal" class="product-modal" style="display: none;">
            <div class="modal-overlay" onclick="closeProductModal()"></div>
            <div class="modal-content">
                <div class="modal-left">
                    <div class="product-image-container">
                        <img src="${product.image}" alt="${product.name}" class="modal-product-image" 
                            onerror="this.onerror=null; this.src='images/logo.png';">
                    </div>
                </div>
                <div class="modal-right">
                    <div class="modal-header">
                        <h2 class="modal-title">${product.name}</h2>
                        <span class="modal-category">${getCategoryName(product.category)}</span>
                        <button class="modal-close" onclick="closeProductModal()">&times;</button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="product-detail-section">
                            <h4>Təsvir</h4>
                            <p>${product.description}</p>
                        </div>
                        
                        <div class="product-detail-section">
                            <h4>Tərkibi</h4>
                            <p>${product.ingredients}</p>
                        </div>
                        
                        <div class="product-detail-section">
                            <h4>İstifadə qaydası</h4>
                            <p>${product.usage}</p>
                        </div>
                        
                        <div class="product-detail-section">
                            <h4>Xəbərdarlıq</h4>
                            <p>${product.warnings}</p>
                        </div>
                        
                        <div class="product-detail-section">
                            <h4>Göstərişlər</h4>
                            <p>${product.warnings}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('productModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = document.getElementById('productModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close product modal
function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        setTimeout(() => modal.remove(), 300);
    }
}

// Get category name from category id
function getCategoryName(categoryId) {
    const categories = {
        'omega': 'Omega-3',
        'antihistamin': 'Antihistaminlər',
        'vitamin': 'Vitaminlər',
        'solunum': 'Tənəffüs Yolları',
        'metabolik': 'Metabolik',
        'agri': 'Ağrı Kəsicilər',
        'sindirim': 'Həzm Sistemi',
        'cilt': 'Dəriyə Quluq'
    };
    return categories[categoryId] || 'Digər';
}

// Filter products by category
function filterProducts(category) {
    if (category === 'all') {
        displayProducts(products);
        return;
    }
    
    const filteredProducts = products.filter(product => product.category === category);
    displayProducts(filteredProducts);
}

// Search products
function searchProducts(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) {
        displayProducts(products);
        return;
    }
    
    const searchResults = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm) ||
        product.ingredients.toLowerCase().includes(searchTerm)
    );
    
    displayProducts(searchResults);
}

// Event Listeners
if (filterButtons) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Filter products
            filterProducts(button.dataset.category);
        });
    });
}

if (searchButton && searchInput) {
    searchButton.addEventListener('click', () => searchProducts(searchInput.value));
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchProducts(searchInput.value);
        }
    });
}

// Close modal when clicking the X button
document.querySelector('.close-modal')?.addEventListener('click', () => {
    document.getElementById('productModal').style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside the modal content
window.addEventListener('click', (e) => {
    const modal = document.getElementById('productModal');
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Initialize the page
// Sayfa yüklendiğinde zaten loadProducts() çağrılıyor
