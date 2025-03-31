document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.gallery-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
    const progressBar = document.querySelector('.progress-bar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSlide = 0;
    let isTransitioning = false;
    let slideInterval;
    const intervalTime = 5000;

    // Initialize slides
    function initializeSlides() {
        slides.forEach((slide, index) => {
            slide.dataset.index = index;
            slide.style.transform = `translateX(${100 * index}%)`;
        });
        slides[0].classList.add('active');
        updateProgress();
    }

    // Update progress bar
    function updateProgress() {
        const progress = ((currentSlide + 1) / slides.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Move to slide function
    function moveToSlide(targetIndex) {
        if (isTransitioning) return;
        isTransitioning = true;

        // Handle circular navigation
        if (targetIndex < 0) targetIndex = slides.length - 1;
        if (targetIndex >= slides.length) targetIndex = 0;

        // Update active class
        slides.forEach(slide => slide.classList.remove('active'));
        slides[targetIndex].classList.add('active');

        // Move all slides
        slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${100 * (index - targetIndex)}%)`;
        });

        currentSlide = targetIndex;
        updateProgress();

        // Reset transition lock after animation
        setTimeout(() => {
            isTransitioning = false;
        }, 500); // Match this with your CSS transition time
    }

    // Auto advance slides
    function startSlideShow() {
        slideInterval = setInterval(() => {
            moveToSlide(currentSlide + 1);
        }, intervalTime);
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startSlideShow();
    }

    // Event Listeners
    nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        moveToSlide(currentSlide + 1);
        resetInterval();
    });

    prevButton.addEventListener('click', (e) => {
        e.preventDefault();
        moveToSlide(currentSlide - 1);
        resetInterval();
    });

    // Touch events for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(slideInterval);
    });

    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeDistance = touchStartX - touchEndX;
        
        if (Math.abs(swipeDistance) > 50) {
            if (swipeDistance > 0) {
                moveToSlide(currentSlide + 1);
            } else {
                moveToSlide(currentSlide - 1);
            }
        }
        startSlideShow();
    });

    // Pause on hover
    track.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    track.addEventListener('mouseleave', () => {
        startSlideShow();
    });

    // Toggle menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Initialize slider
    initializeSlides();
    startSlideShow();

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(slideInterval);
        } else {
            startSlideShow();
        }
    });
}); 