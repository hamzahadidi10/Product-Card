document.addEventListener('DOMContentLoaded', function() {
   
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');
    const productContainer = document.querySelector('.S-container');
    const cartItems = []; 

    
    const products = [
        {
            id: 1,
            name: "Air Jordan 4 Retro OG Fire Red",
            description: "The Fire Red 4 Retro OG brings back the exact 1989 specifications, from the shape to the branding, making it a must-have for purists. Its versatile colorway pairs effortlessly with streetwear or athleisure, while the timeless design ensures it remains relevant decades after its debut",
            price: 99.99,
            image: "jordan4.jpg"
        },
        {
            id: 2,
            name: "Air Jordan 1 Retro Hight OG Hyper Royal",
            description: "blends vintage charm with modern hype, featuring a faded denim-inspired blue-gray upper and pre-yellowed midsole for instant character. This 2021 release stays true to the OG 1985 silhouette, with premium leather construction and subtle Gym Red accents on the Wings logo",
            price: 139.99,
            image: "jordan1.jpg"
        },
        {
            id: 3,
            name: "Nike Air Force 1 Black/White",
            description: "Worn by hip-hop royalty, skaters, and sneakerheads worldwide, the AF1 redefined casual cool. This black/white iteration masters the art of contrast – pair it with anything from tailored sweats to ripped jeans for instant credibility.",
            price: 75.99,
            image: "air1.jpg"
        },
        {
            id: 4,
            name: "Nike Men Dunk Hight Retro SE",
            description: "elevates the classic basketball silhouette with premium materials and bold color-blocking. Featuring a high-top design with padded collars and retro branding, it delivers both style and comfort",
            price: 75.99,
            image: "dunk.jpg"
        }
    ];

    function initCart() {
        const savedCart = localStorage.getItem('shoozyCart');
        if (savedCart) {
            cartItems.push(...JSON.parse(savedCart));
            updateCartCounter();
        }
    }

    
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        searchResults.innerHTML = '';
        
        if (searchTerm.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        const results = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm)
        );

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">No products found</div>';
        } else {
            results.forEach(product => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div>
                        <h4>${product.name}</h4>
                        <p>$${product.price.toFixed(2)}</p>
                    </div>
                `;
                resultItem.addEventListener('click', () => {
                    scrollToProduct(product.id);
                    searchResults.style.display = 'none';
                });
                searchResults.appendChild(resultItem);
            });
        }
        
        searchResults.style.display = 'block';
    }

    function scrollToProduct(productId) {
        const productCard = document.querySelector(`.P-card[data-id="${productId}"]`);
        if (productCard) {
            productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            productCard.classList.add('highlight');
            setTimeout(() => productCard.classList.remove('highlight'), 2000);
        }
    }

    function setupAddToCartButtons() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.P-card');
                const productId = parseInt(productCard.dataset.id);
                const product = products.find(p => p.id === productId);
                
                if (product) {
                    addToCart(product);
                    showAddedToCartMessage(product.name);
                }
            });
        });
    }

    function addToCart(product) {
        const existingItem = cartItems.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCartCounter();
        saveCartToLocalStorage();
    }

    function showAddedToCartMessage(productName) {
        const message = document.createElement('div');
        message.className = 'cart-message';
        message.textContent = `${productName} added to cart!`;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('fade-out');
            setTimeout(() => message.remove(), 500);
        }, 2000);
    }

    function updateCartCounter() {
        const cartCounter = document.querySelector('.cart-counter');
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartCounter) {
            cartCounter.textContent = totalItems;
        } else {
            const cartLink = document.querySelector('a[href=""]');
            if (cartLink) {
                const counter = document.createElement('span');
                counter.className = 'cart-counter';
                counter.textContent = totalItems;
                cartLink.appendChild(counter);
            }
        }
    }

    function saveCartToLocalStorage() {
        localStorage.setItem('shoozyCart', JSON.stringify(cartItems));
    }

    function tagProductCards() {
        document.querySelectorAll('.P-card').forEach((card, index) => {
            card.dataset.id = products[index].id;
        });
    }

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('input', performSearch);
    searchInput.addEventListener('focus', performSearch);
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.searchBar')) {
            searchResults.style.display = 'none';
        }
    });

    tagProductCards();
    initCart();
    setupAddToCartButtons();
});

















document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cartCounter = document.querySelector('.cart-counter');
    
    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('shoozyCart')) || [];
    
    // Render cart items
    function renderCart() {
        // Clear previous items
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <img src="empty-cart.jpg" alt="Empty cart" class="empty-cart-img">
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added anything to your cart yet</p>
                    <a href="shoes.html" class="continue-shopping-btn">Continue Shopping</a>
                </div>
            `;
            updateCartCounter();
            updateTotals();
            return;
        }
        
        // Render each cart item
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.dataset.id = item.id;
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <button class="remove-item">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L13 13M13 1L1 13" stroke="#ff6b6b" stroke-width="2"/>
                        </svg>
                        Remove
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        // Add event listeners to quantity controls
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', decreaseQuantity);
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', increaseQuantity);
        });
        
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', updateQuantity);
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', removeItem);
        });
        
        checkoutBtn.disabled = false;
        updateCartCounter();
        updateTotals();
    }
    
    // Update quantity functions
    function decreaseQuantity(e) {
        const itemElement = e.target.closest('.cart-item');
        const itemId = parseInt(itemElement.dataset.id);
        const input = itemElement.querySelector('.quantity-input');
        let newQuantity = parseInt(input.value) - 1;
        
        if (newQuantity < 1) newQuantity = 1;
        
        updateCartItem(itemId, newQuantity);
    }
    
    function increaseQuantity(e) {
        const itemElement = e.target.closest('.cart-item');
        const itemId = parseInt(itemElement.dataset.id);
        const input = itemElement.querySelector('.quantity-input');
        const newQuantity = parseInt(input.value) + 1;
        
        updateCartItem(itemId, newQuantity);
    }
    
    function updateQuantity(e) {
        const itemElement = e.target.closest('.cart-item');
        const itemId = parseInt(itemElement.dataset.id);
        let newQuantity = parseInt(e.target.value);
        
        if (isNaN(newQuantity) || newQuantity < 1) {
            newQuantity = 1;
            e.target.value = 1;
        }
        
        updateCartItem(itemId, newQuantity);
    }
    
    function updateCartItem(itemId, newQuantity) {
        const itemIndex = cart.findIndex(item => item.id === itemId);
        
        if (itemIndex !== -1) {
            cart[itemIndex].quantity = newQuantity;
            saveCart();
            renderCart();
        }
    }
    
    // Remove item from cart
    function removeItem(e) {
        const itemElement = e.target.closest('.cart-item');
        const itemId = parseInt(itemElement.dataset.id);
        
        cart = cart.filter(item => item.id !== itemId);
        saveCart();
        renderCart();
    }
    
    // Update totals
    function updateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        totalElement.textContent = `$${subtotal.toFixed(2)}`;
    }
    
    // Update cart counter in navbar
    function updateCartCounter() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCounter.textContent = totalItems;
    }
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('shoozyCart', JSON.stringify(cart));
    }
    
  
    
    // Initial render
    renderCart();
});