// public/app.js
let products = [];
let cart = [];
let currentEditId = null;

// Form submission for adding products
document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const product = {
        name: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value),
        description: document.getElementById('product-description').value,
        image: document.getElementById('product-image').value
    };

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        if (response.ok) {
            loadProducts();
            e.target.reset();
        }
    } catch (error) {
        console.error('Error adding product:', error);
    }
});

// Load products
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        products = await response.json();
        displayProducts();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Display products
function displayProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 150px; object-fit: cover;">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
            <div class="product-actions">
                <button class="edit-btn" onclick="openEditModal(${product.id})">Edit</button>
                <button class="delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Add to cart
async function addToCart(productId) {
    try {
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, quantity: 1 })
        });

        if (response.ok) {
            loadCart();
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

// Load cart
async function loadCart() {
    try {
        const response = await fetch('/api/cart');
        cart = await response.json();
        updateCartDisplay();
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    cartCount.textContent = cart.length;

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <h4>${item.name}</h4>
            <p>$${item.price} x ${item.quantity}</p>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Delete product
async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadProducts();
            loadCart(); // Refresh cart in case the deleted product was in it
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

// Open edit modal
function openEditModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentEditId = productId;

    // Fill the edit form with product data
    document.getElementById('edit-product-id').value = product.id;
    document.getElementById('edit-product-name').value = product.name;
    document.getElementById('edit-product-price').value = product.price;
    document.getElementById('edit-product-description').value = product.description;
    document.getElementById('edit-product-image').value = product.image;

    // Show the modal
    document.getElementById('edit-modal').style.display = 'block';
}

// Close modal
document.querySelector('.close').onclick = function () {
    document.getElementById('edit-modal').style.display = 'none';
}

// Close modal if clicking outside
window.onclick = function (event) {
    const modal = document.getElementById('edit-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Handle edit form submission
document.getElementById('edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const updatedProduct = {
        name: document.getElementById('edit-product-name').value,
        price: parseFloat(document.getElementById('edit-product-price').value),
        description: document.getElementById('edit-product-description').value,
        image: document.getElementById('edit-product-image').value
    };

    try {
        const response = await fetch(`/api/products/${currentEditId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
        });

        if (response.ok) {
            document.getElementById('edit-modal').style.display = 'none';
            loadProducts();
            loadCart(); // Refresh cart to update product details if it's in the cart
        }
    } catch (error) {
        console.error('Error updating product:', error);
    }
});

// Toggle cart sidebar
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('active');
}

// Initial load
loadProducts();
loadCart();
