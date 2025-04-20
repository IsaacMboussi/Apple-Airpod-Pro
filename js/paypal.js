// PayPal Integration
paypal.Buttons({
    // Sets up the transaction when a payment button is clicked
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: '50.00',
                    currency_code: 'USD'
                },
                description: 'AirPods Pro Purchase'
            }]
        });
    },

    // Finalize the transaction after payer approval
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            // Get shipping information from the form
            const shippingForm = document.getElementById('shipping-form');
            const formData = new FormData(shippingForm);
            const shippingInfo = Object.fromEntries(formData.entries());

            // Combine order details with shipping information
            const orderDetails = {
                orderId: details.id,
                payerId: details.payer.payer_id,
                shippingInfo: shippingInfo,
                paymentDetails: details
            };

            // Send order details to your server
            return fetch('/api/process-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderDetails)
            })
            .then(response => response.json())
            .then(result => {
                // Redirect to success page
                window.location.href = `/success.html?order_id=${details.id}`;
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error processing your order. Please try again.');
            });
        });
    },

    // Handle errors
    onError: function(err) {
        console.error('PayPal Error:', err);
        alert('There was an error with PayPal. Please try again.');
    }
}).render('#paypal-button-container'); 