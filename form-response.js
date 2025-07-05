// Create a new file in your repository
// Name: form-response.js

class FormResponseHandler {
    constructor() {
        this.setupNotifications();
        this.initializeForm();
    }

    setupNotifications() {
        const notifications = document.createElement('div');
        notifications.className = 'notification-container';
        document.body.appendChild(notifications);
    }

    initializeForm() {
        const form = document.getElementById('quoteForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(new FormData(form));
            });
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.querySelector('.notification-container').appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    async handleFormSubmission(formData) {
        try {
            const submitButton = document.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            const response = await fetch('https://formspree.io/f/mrbkvbzb', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Form submission failed');
            }

            this.showNotification('Quote request submitted successfully! We\'ll contact you soon.');
            document.getElementById('quoteForm').reset();

        } catch (error) {
            this.showNotification(
                'There was an error submitting your request. Please try again or contact us directly.',
                'error'
            );
        } finally {
            const submitButton = document.querySelector('button[type="submit"]');
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Quote Request';
        }
    }
}

// Initialize the handler when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    new FormResponseHandler();
});
