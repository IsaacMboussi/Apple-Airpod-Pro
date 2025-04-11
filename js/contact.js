document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const contactForm = document.querySelector('.contact-form');
    const formSuccess = document.querySelector('.form-success');
    const formError = document.querySelector('.form-error');
    
    // Form validation and submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset previous messages
            formSuccess.style.display = 'none';
            formError.style.display = 'none';
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Validate form
            if (validateForm(formObject)) {
                // Simulate form submission (replace with actual API call)
                submitForm(formObject);
            }
        });
    }
    
    // Form validation function
    function validateForm(formData) {
        let isValid = true;
        
        // Validate name
        if (!formData.name || formData.name.trim().length < 2) {
            showError('Please enter a valid name (minimum 2 characters)');
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            showError('Please enter a valid email address');
            isValid = false;
        }
        
        // Validate subject
        if (!formData.subject || formData.subject.trim().length < 5) {
            showError('Please enter a subject (minimum 5 characters)');
            isValid = false;
        }
        
        // Validate message
        if (!formData.message || formData.message.trim().length < 10) {
            showError('Please enter a message (minimum 10 characters)');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Show error message
    function showError(message) {
        formError.textContent = message;
        formError.style.display = 'block';
        
        // Hide error message after 5 seconds
        setTimeout(() => {
            formError.style.display = 'none';
        }, 5000);
    }
    
    // Show success message
    function showSuccess() {
        formSuccess.style.display = 'block';
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            formSuccess.style.display = 'none';
        }, 5000);
    }
    
    // Simulate form submission (replace with actual API call)
    function submitForm(formData) {
        // Show loading state
        const submitButton = contactForm.querySelector('.submit-button');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate API call with timeout
        setTimeout(() => {
            // Reset button state
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            
            // Show success message
            showSuccess();
        }, 1500);
    }
    
    // Live chat button functionality
    const chatButton = document.querySelector('.chat-button');
    if (chatButton) {
        chatButton.addEventListener('click', function() {
            // Replace with actual chat widget implementation
            alert('Live chat feature coming soon!');
        });
    }
    
    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('p');
        
        // Initially hide answers
        if (answer) {
            answer.style.display = 'none';
        }
        
        // Add click event to questions
        if (question) {
            question.style.cursor = 'pointer';
            question.addEventListener('click', function() {
                const isOpen = answer.style.display === 'block';
                
                // Close all other answers
                faqItems.forEach(otherItem => {
                    const otherAnswer = otherItem.querySelector('p');
                    if (otherAnswer) {
                        otherAnswer.style.display = 'none';
                    }
                });
                
                // Toggle current answer
                if (answer) {
                    answer.style.display = isOpen ? 'none' : 'block';
                }
            });
        }
    });
}); 