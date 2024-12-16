// server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory storage (replace with database in production)
let products = [];
let cart = [];

// API endpoints
app.post('/api/products', (req, res) => {
    const product = {
        id: Date.now(),
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: req.body.image
    };
    products.push(product);
    res.json(product);
});

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.post('/api/cart', (req, res) => {
    const { productId, quantity } = req.body;
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push({ ...product, quantity });
        res.json(cart);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

app.get('/api/cart', (req, res) => {
    res.json(cart);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Add these new endpoints to server.js

// Delete product
app.delete('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
        products.splice(productIndex, 1);
        // Also remove the product from any carts
        cart = cart.filter(item => item.id !== productId);
        res.json({ message: 'Product deleted successfully' });
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

// Update product
app.put('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
        products[productIndex] = {
            ...products[productIndex],
            ...req.body,
            id: productId // Ensure ID doesn't change
        };
        res.json(products[productIndex]);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

