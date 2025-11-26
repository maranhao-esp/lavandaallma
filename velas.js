// Elementos da página
const homePage = document.getElementById('home-page');
const cartPage = document.getElementById('cart-page');
const cartBtn = document.getElementById('cart-btn');
const backBtn = document.getElementById('back-btn');
const backNav = document.getElementById('back-nav');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.querySelector('.cart-count');

// Carrinho de compras
let cart = [];

// Detectar dispositivo móvel
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Alternar entre páginas com feedback tátil
cartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cartPage.classList.add('active');
    homePage.classList.remove('active');
    backNav.style.display = 'flex';
    updateCartDisplay();
});

backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    homePage.classList.add('active');
    cartPage.classList.remove('active');
    backNav.style.display = 'none';
});

// Adicionar produtos ao carrinho com feedback tátil
document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const productId = e.target.getAttribute('data-id');
        const productName = e.target.getAttribute('data-name');
        const productPrice = parseFloat(e.target.getAttribute('data-price'));
        
        // Verificar se o produto já está no carrinho
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1,
                image: e.target.closest('.product-card').querySelector('.product-image').src
            });
        }
        
        updateCartCount();
        updateCartDisplay();
        
        // Feedback visual melhorado para mobile
        const originalText = e.target.textContent;
        const originalBg = e.target.style.backgroundColor;
        
        e.target.textContent = '✓ Adicionado!';
        e.target.style.backgroundColor = '#4CAF50';
        e.target.style.transform = 'scale(0.95)';
        
        // Efeito de vibração no mobile
        if (isMobile) {
            navigator.vibrate?.(50);
        }
        
        setTimeout(() => {
            e.target.textContent = originalText;
            e.target.style.backgroundColor = originalBg;
            e.target.style.transform = 'scale(1)';
        }, 1500);
    });
});

// Atualizar contador do carrinho
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}

// Atualizar a exibição do carrinho
function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Seu carrinho está vazio</div>';
        cartTotalElement.textContent = '0,00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div>
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                </div>
            </div>
            <div>
                <span>Quantidade: ${item.quantity}</span>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    cartTotalElement.textContent = total.toFixed(2);
}

// Finalizar compra
document.querySelector('.checkout-button').addEventListener('click', (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    if (isMobile) {
        navigator.vibrate?.(100);
    }
    
    alert('Compra finalizada com sucesso! Obrigado por escolher a Lavanda Alma.');
    cart = [];
    updateCartCount();
    updateCartDisplay();
    homePage.classList.add('active');
    cartPage.classList.remove('active');
    backNav.style.display = 'none';
});

// Prevenir zoom duplo em mobile
document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);