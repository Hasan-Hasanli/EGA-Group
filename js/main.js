// Məhsul kateqoriyaları
const categories = {
    'omega': 'Omega-3',
    'vitamin': 'Vitaminlər',
    'solunum': 'Tənəffüs yolları', // 'nefes' -> 'solunum' olaraq standartlaşdırıldı
    'sindirim': 'Həzm sistemi', // 'hezm' -> 'sindirim' olaraq standartlaşdırıldı
    'metabolik': 'Metabolik',
    'antihistamin': 'Antihistamin',
    'antibiotik': 'Antibiotik',
    'kardiyoloji': 'Kardioloji',
    'derma': 'Dermatoloji',
    'endokrin': 'Endokrinoloji',
    'qida': 'Qida əlavələri',
    'diger': 'Digər', // Virgül əlavə edildi
    'antimikrob': 'Antimikrob',
    'iltihab': 'İltihabəleyhinə',
    'urology': 'Uroloji' // Əskik kateqoriya əlavə edildi
};

// Bütün məhsulların saxlanacağı boş bir array
let allProducts = [];

// DOM Elementləri
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');
const productModal = document.getElementById('productModal');
const productsContainer = document.querySelector('.products-container');
const searchInput = document.getElementById('searchInput');

// --- Köməkçi Funksiyalar ---

// Mobil menyunu bağlamaq üçün funksiya
function closeMobileMenu() {
    if (mobileMenu && navMenu) {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    }
}
// Kateqoriya adını almaq üçün köməkçi funksiya
function getCategoryName(categoryKey) {
    return categories[categoryKey] || categoryKey;
}

// Məhsulları göstər
function displayProducts(productsToShow) {
    if (!productsContainer) return; // Element yoxdursa, funksiyadan çıx
    
    productsContainer.innerHTML = '';
    
    if (productsToShow.length === 0) {
        productsContainer.innerHTML = '<p class="no-products">Üzgünüz, heç bir məhsul tapılmadı.</p>';
        return;
    }
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.onerror=null; this.src='images/logo.png';">
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category).toLowerCase()}</div>
                <h3>${product.name}</h3>
                <div class="product-actions">
                    <button class="view-details" data-id="${product.id}">Ətraflı</button>
                </div>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });
    
    // "Ətraflı" düymələri üçün hadisə dinləyiciləri burada əlavə edilmir,
    // çünki bu, qlobal bir dinləyici tərəfindən idarə olunacaq.
}

function openProductModal(product) {
    if (!product || !productModal) return;

    const modalContent = productModal.querySelector('.modal-content');
    if (!modalContent) {
        console.error("Modal pəncərəsinin .modal-content hissəsi tapılmadı!");
        return;
    }

    // --- YENİ ƏLAVƏ EDİLƏN HİSSƏ: KÖHNƏ DÜYMƏNİ SİLİB YENİSİNİ YARADIR ---
    // Mümkün olan köhnə düyməni tap və sil
    const existingCloseBtn = modalContent.querySelector('.close-modal');
    if (existingCloseBtn) {
        existingCloseBtn.remove();
    }

    // Sıfırdan yeni bir bağlama düyməsi yarat
    const newCloseBtn = document.createElement('span');
    newCloseBtn.className = 'close-modal';
    newCloseBtn.innerHTML = '&times;'; // HTML 'X' simvolu
    // --- YENİ ƏLAVƏ: Düymənin həmişə kliklənə bilən olması üçün stil əlavəsi ---
    newCloseBtn.style.position = 'absolute'; // Mövqeləndirmə üçün
    newCloseBtn.style.zIndex = '10';         // Həmişə ən üstdə olması üçün
    // --------------------------------------------------------------------

    // Yeni düyməni modalın məzmun hissəsinin başına əlavə et
    modalContent.prepend(newCloseBtn);
    // --------------------------------------------------------------------

    const modalNameEl = productModal.querySelector('#modalName');
    const modalTitleEl = productModal.querySelector('#modalTitle');
    const modalDescriptionEl = productModal.querySelector('#modalDescription');
    const modalImageEl = productModal.querySelector('#modalImage');
    const modalDetailsEl = productModal.querySelector('#modalDetails'); // Detallar üçün yeni element

    if (modalNameEl) modalNameEl.textContent = product.name;
    if (modalTitleEl) modalTitleEl.textContent = getCategoryName(product.category);
    if (modalImageEl) {
        modalImageEl.src = product.image;
        modalImageEl.alt = product.name;
        modalImageEl.onerror = () => { modalImageEl.src = 'images/logo.png'; };
    }

    productModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // JSON-dan gələn detallı məlumatları göstər
    if (modalDescriptionEl) {
        modalDescriptionEl.innerHTML = `
            <h4>Təsvir</h4>
            <p>${product.description || 'Məlumat yoxdur.'}</p>
            <h4>Tərkibi</h4>
            <p>${product.ingredients || 'Məlumat yoxdur.'}</p>
            <h4>İstifadəsinə göstərişlər</h4>
            <p>${product.indications || 'Məlumat yoxdur.'}</p>
            <h4>İstifadə qaydası</h4>
            <p>${product.usage || 'Məlumat yoxdur.'}</p>
        `;
    }
}

function closeProductModal() {
    if (productModal) {
        productModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// --- Hadisə Dinləyiciləri (Event Listeners) ---

// Məhsulları JSON faylından yükləyən funksiya
async function loadProducts() {
    try {
        const response = await fetch('data/products_fixed.json');
        if (!response.ok) throw new Error('Network response was not ok.');
        allProducts = await response.json();

        // Əgər products.html səhifəsindəyiksə (productsContainer var, amma ana səhifə deyil), bütün məhsulları göstər
        // Bu yoxlamanı səhifənin URL-inə görə daha dəqiq etmək olar.
        if (window.location.pathname.includes('products.html')) {
            displayProducts(allProducts);
        } 
        // Əks halda (ana səhifədə), yalnız ilk 4 məhsulu göstər.
        else if (productsContainer) {
            displayProducts(allProducts.slice(0, 4));
        }
    } catch (error) {
        console.error('Məhsullar yüklənərkən xəta baş verdi:', error);
        if(productsContainer) productsContainer.innerHTML = '<p class="no-products">Məhsulları yükləmək mümkün olmadı.</p>';
    }
}

// Səhifə yüklənəndə ilkin əməliyyatlar
document.addEventListener('DOMContentLoaded', () => {
    loadProducts(); // Məhsulları JSON-dan yüklə
    animateOnScroll(); // İlkin yoxlama

    // Axtarış funksionallığı (əgər axtarış sahəsi mövcuddursa)
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            // Axtarış sözünə uyğun məhsulları filtrasiya et
            const filteredProducts = allProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm)
            );
            displayProducts(filteredProducts);
        });
    }
});

// Mobil menyu açma/bağlama
if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Bütün klik hadisələrini idarə edən vahid dinləyici
document.addEventListener('click', (e) => {
    const target = e.target;

    // Modal açma düyməsi (.view-details)
    const viewDetailsButton = target.closest('.view-details');
    if (viewDetailsButton) {
        const productId = parseInt(viewDetailsButton.getAttribute('data-id'));
        const product = allProducts.find(p => p.id === productId);
        if (product) {
            openProductModal(product);
        }
        return; // Başqa bir şey yoxlamağa ehtiyac yoxdur
    }

    // Modal bağlama (X düyməsi və ya arxa fon)
    if (target.closest('.close-modal') || target === productModal) {
        closeProductModal();
    } else if (target.closest('.nav-menu a')) { // Mobil menyu linkləri
        closeMobileMenu();
    }
});

// ESC düyməsi ilə modalı bağlamaq
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && productModal && productModal.style.display === 'flex') {
        closeProductModal();
    }
});

// Bütün səhifə içi linklər üçün yumşaq kaydırma (Smooth Scroll)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 100;
            window.scrollTo({
                top: targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset,
                behavior: 'smooth'
            });
        }
    });
});

// Sürüşdürmə zamanı animasiya əlavə et
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Sürüşdürmə hadisəsini dinlə
window.addEventListener('scroll', animateOnScroll);
