// This handles what happens when someone submits your form
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('quoteForm');

    // Replace this with your actual Formspree code from Step 1
    form.action = "https://formspree.io/f/REPLACE_WITH_YOUR_CODE";

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Show "Sending..." while form is submitting
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.innerHTML = 'Sending...';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Clear form and show success message
                form.reset();
                alert('Thank you! We will contact you soon.');
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            alert('There was a problem. Please try again or call us.');
        }

        // Reset button text
        submitButton.innerHTML = 'Submit Quote Request';
    });
});
