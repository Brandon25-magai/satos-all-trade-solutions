document.addEventListener('DOMContentLoaded', function() {
    // Get all filter buttons and gallery items
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.project-card');

    // Add click event to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // Show/hide gallery items based on filter
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Optional: Add lightbox functionality for images
    const projectImages = document.querySelectorAll('.project-image img');
    projectImages.forEach(image => {
        image.addEventListener('click', () => {
            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src="${image.src}" alt="${image.alt}">
                    <span class="close-lightbox">&times;</span>
                </div>
            `;

            // Add lightbox to page
            document.body.appendChild(lightbox);

            // Close lightbox when clicking outside or on close button
            lightbox.addEventListener('click', (e) => {
                if (e.target.className === 'lightbox' || e.target.className === 'close-lightbox') {
                    lightbox.remove();
                }
            });
        });
    });
});
