// Handle scroll-to-top button visibility and functionality
document.querySelector('.scrollable-container').addEventListener('scroll', function() {
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    if (this.scrollTop > 100) {
        scrollToTopBtn.style.display = 'inline';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

// Smooth scroll to the top when button is clicked
document.querySelector('.scroll-to-top').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default anchor behavior
    document.querySelector('.scrollable-container').scrollTo({
        top: 0,
        behavior: 'smooth' // Smooth scrolling
    });
});