// Initialize Stripe with your publishable key
const stripe = Stripe('pk_live_51RClaSFvxOXI945EvLC5jgsDILLcw0kCE7urs3D4AAptU3xTZQIxrMvoEOAgWGqKnXAe0awoTOF2i1kOijgUgpYz00hvvYNAhB'); // Replace with your actual publishable key

// Create payment form handler
document.addEventListener('DOMContentLoaded', function() {
    const paymentForm = document.getElementById('payment-form');
    const submitButton = document.querySelector('.submit-payment');
    const errorElement = document.getElementById('payment-error');
    const successElement = document.getElementById('payment-success');

    if (paymentForm) {
        paymentForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            // Disable the submit button to prevent double submission
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';
            
            // Hide any previous error messages
            errorElement.style.display = 'none';
            successElement.style.display = 'none';

            // Get form data
            const formData = new FormData(paymentForm);
            const paymentData = {
                name: formData.get('name'),
                email: formData.get('email'),
                address: {
                    line1: formData.get('address'),
                    city: formData.get('city'),
                    state: formData.get('state'),
                    postal_code: formData.get('zip'),
                    country: 'US'
                }
            };

            try {
                // Create payment method
                const { paymentMethod, error } = await stripe.createPaymentMethod({
                    type: 'card',
                    card: elements.getElement('card'),
                    billing_details: {
                        name: paymentData.name,
                        email: paymentData.email,
                        address: paymentData.address
                    }
                });

                if (error) {
                    throw new Error(error.message);
                }

                // Send payment method ID to your server
                const response = await fetch('/create-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        paymentMethodId: paymentMethod.id,
                        amount: 5000, // $50.00 in cents
                        currency: 'usd',
                        description: 'AirPods Pro Purchase'
                    })
                });

                const result = await response.json();

                if (result.error) {
                    throw new Error(result.error);
                }

                // Show success message
                successElement.style.display = 'block';
                paymentForm.reset();
                
                // Redirect to success page after 3 seconds
                setTimeout(() => {
                    window.location.href = '/success.html';
                }, 3000);

            } catch (error) {
                // Show error message
                errorElement.textContent = error.message;
                errorElement.style.display = 'block';
            } finally {
                // Re-enable the submit button
                submitButton.disabled = false;
                submitButton.textContent = 'Pay Now';
            }
        });
    }
});

// Format card number as user types
function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    let formattedValue = '';
    
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    
    input.value = formattedValue;
}

// Format expiry date as user types
function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    
    input.value = value;
}

// Format CVC as user types
function formatCVC(input) {
    input.value = input.value.replace(/\D/g, '').slice(0, 3);
} 