require('dotenv').config();
const express = require('express');
const path = require('path');
const paypal = require('@paypal/checkout-server-sdk');

// Initialize PayPal SDK
let environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
);
if (process.env.NODE_ENV === 'production') {
    environment = new paypal.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
    );
}
const paypalClient = new paypal.core.PayPalHttpClient(environment);

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

// Process PayPal order
app.post('/api/process-order', async (req, res) => {
    try {
        const { orderId, payerId, shippingInfo, paymentDetails } = req.body;
        
        // Verify the payment with PayPal
        const request = new paypal.core.OrdersGetRequest(orderId);
        const order = await paypalClient.execute(request);
        
        if (order.result.status === 'COMPLETED') {
            // Payment is verified, process the order
            console.log('Order processed:', {
                orderId,
                payerId,
                shippingInfo,
                paymentDetails
            });

            // Here you would typically:
            // 1. Save the order to your database
            // 2. Send confirmation email
            // 3. Update inventory
            
            res.json({ success: true, orderId });
        } else {
            throw new Error('Payment not completed');
        }
    } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).json({ error: 'Failed to process order' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
}); 