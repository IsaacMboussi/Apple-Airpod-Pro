// Initialize Stripe
const stripe = Stripe('pk_live_51RClaSFvxOXI945EvLC5jgsDILLcw0kCE7urs3D4AAptU3xTZQIxrMvoEOAgWGqKnXAe0awoTOF2i1kOijgUgpYz00hvvYNAhB'); // Replace with your Stripe publishable key

// Cart functionality
class Cart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.init();
    }

    init() {
        // Load cart from localStorage if exists
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const { items, total } = JSON.parse(savedCart);
            this.items = items;
            this.total = total;
            this.updateCartCount();
        }

        // Add event listeners
        this.addEventListeners();
    }

    addEventListeners() {
        // Add to cart button
        const addToCartBtn = document.querySelector('.cta-button');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => this.addToCart());
        }

        // Cart button
        const cartBtn = document.querySelector('.cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.toggleCart());
        }
    }

    addToCart() {
        const product = {
            id: 'airpods-pro',
            name: 'AirPods Pro',
            price: 249.00,
            quantity: 1
        };

        this.items.push(product);
        this.total += product.price;
        this.updateCartCount();
        this.saveCart();
        this.showNotification('Added to cart!');
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.items.length;
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify({
            items: this.items,
            total: this.total
        }));
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    toggleCart() {
        // Implement cart modal toggle
        console.log('Toggle cart');
    }
}

// Initialize cart
const cart = new Cart();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .spec-item, .gallery-item, .review-card, .faq-item').forEach(el => {
    observer.observe(el);
});

// Lazy loading images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => lazyLoadObserver.observe(img));
    }
});

// FAQ Toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('p');
        
        // Initially hide answers
        answer.style.display = 'none';
        
        // Add toggle icon
        const toggleIcon = document.createElement('span');
        toggleIcon.className = 'faq-toggle';
        toggleIcon.innerHTML = '<i class="fas fa-chevron-down"></i>';
        question.appendChild(toggleIcon);
        
        // Add click event
        question.addEventListener('click', () => {
            // Toggle current answer
            if (answer.style.display === 'none') {
                answer.style.display = 'block';
                toggleIcon.innerHTML = '<i class="fas fa-chevron-up"></i>';
            } else {
                answer.style.display = 'none';
                toggleIcon.innerHTML = '<i class="fas fa-chevron-down"></i>';
            }
        });
    });
});

// Gallery zoom functionality
document.addEventListener('DOMContentLoaded', () => {
    const galleryImages = document.querySelectorAll('.gallery-item img');
    
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'gallery-modal';
            
            // Create modal content
            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';
            
            // Create close button
            const closeBtn = document.createElement('span');
            closeBtn.className = 'modal-close';
            closeBtn.innerHTML = '&times;';
            
            // Create zoomed image
            const zoomedImg = document.createElement('img');
            zoomedImg.src = img.src;
            zoomedImg.alt = img.alt;
            
            // Assemble modal
            modalContent.appendChild(closeBtn);
            modalContent.appendChild(zoomedImg);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            
            // Add event listeners
            closeBtn.addEventListener('click', () => {
                modal.remove();
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        });
    });
});

// Add CSS for notifications and modals
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--success-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 30px;
        animation: slideIn 0.3s ease-out;
        z-index: 1000;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .faq-toggle {
        float: right;
        cursor: pointer;
        color: var(--accent-color);
    }
    
    .gallery-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    }
    
    .modal-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }
    
    .modal-content img {
        max-width: 100%;
        max-height: 90vh;
        border-radius: 10px;
    }
    
    .modal-close {
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 2rem;
        cursor: pointer;
    }
`;
document.head.appendChild(style); 