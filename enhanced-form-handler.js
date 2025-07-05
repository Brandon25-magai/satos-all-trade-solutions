class EnhancedFormHandler {
    constructor() {
        this.form = document.getElementById('quoteForm');
        this.setupForm();
        this.setupImagePreview();
        this.setupPricing();
    }

    setupForm() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = this.form.querySelector('button[type="submit"]');
            submitButton.innerHTML = 'Sending...';

            try {
                await this.submitForm(new FormData(this.form));
                this.showSuccess();
                this.form.reset();
            } catch (error) {
                this.showError(error.message);
            }

            submitButton.innerHTML = 'Submit Quote Request';
        });
    }

    showSuccess() {
        const message = document.createElement('div');
        message.className = 'form-success';
        message.textContent = 'Quote request submitted successfully! We\'ll contact you soon.';
        this.form.before(message);
        setTimeout(() => message.remove(), 5000);
    }

    showError(errorMessage) {
        const message = document.createElement('div');
        message.className = 'form-error';
        message.textContent = errorMessage || 'An error occurred. Please try again.';
        this.form.before(message);
        setTimeout(() => message.remove(), 5000);
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedFormHandler();
});
