// Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', function() {
    // Observer options
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    // Create observer
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections with animation class
    const animatedElements = document.querySelectorAll('.observe-animation');
    animatedElements.forEach(function(element) {
        observer.observe(element);
    });

    // Smooth scroll for anchor links (if any are added later)
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
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

    // Log page load for educational purposes
    console.log('Site sobre Péricles Faria carregado com sucesso!');
    console.log('Projeto educacional focado em acessibilidade e cultura brasileira.');
});
