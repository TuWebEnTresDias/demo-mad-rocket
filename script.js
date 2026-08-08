/* ============================================
   MAD ROCKET TATTOO - Landing Page Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // ---------- Header Scroll Effect ----------
    const header = document.getElementById('header');
    
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll();
    
    // ---------- Mobile Menu ----------
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.header__nav-link');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });
    
    // ---------- Services Tabs ----------
    const tabs = document.querySelectorAll('.services__tab');
    const categories = document.querySelectorAll('.services__category');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetId = this.getAttribute('data-tab');
            
            // Remove active from all tabs and categories
            tabs.forEach(t => t.classList.remove('active'));
            categories.forEach(c => c.classList.remove('active'));
            
            // Add active to clicked tab and target category
            this.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });
    
    // ---------- Contact Form to WhatsApp ----------
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;
            
            let whatsappMessage = `Hola Mad Rocket! Soy ${name}.\n`;
            whatsappMessage += `Mi número: ${phone}\n`;
            whatsappMessage += `Servicio: ${service}\n`;
            
            if (message) {
                whatsappMessage += `Mensaje: ${message}\n`;
            }
            
            whatsappMessage += `\nMe gustaría coordinar un turno.`;
            
            // Encode message for URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/5491131098445?text=${encodedMessage}`;
            
            window.open(whatsappUrl, '_blank');
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // ---------- Scroll Animations ----------
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // ---------- Smooth Scroll for Anchor Links ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ---------- Parallax Effect on Hero ----------
    const heroImg = document.querySelector('.hero__bg-img');
    
    function handleParallax() {
        if (heroImg && window.innerWidth > 768) {
            const scrollPosition = window.scrollY;
            const heroHeight = document.querySelector('.hero').offsetHeight;
            
            if (scrollPosition < heroHeight) {
                heroImg.style.transform = `scale(1) translateY(${scrollPosition * 0.3}px)`;
            }
        }
    }
    
    window.addEventListener('scroll', handleParallax);
    
    // ---------- Gallery Hover Effect ----------
    const galleryItems = document.querySelectorAll('.gallery__item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
    
    // ---------- Counter Animation for Testimonials ----------
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = start.toFixed(1);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toFixed(1);
            }
        }
        
        updateCounter();
    }
    
    const ratingAverage = document.querySelector('.testimonials__average');
    if (ratingAverage) {
        const ratingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(ratingAverage, 4.9);
                    ratingObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        ratingObserver.observe(ratingAverage);
    }
    
    // ---------- Current Year for Footer ----------
    const copyrightYear = document.querySelector('.footer__copyright');
    if (copyrightYear) {
        const currentYear = new Date().getFullYear();
        copyrightYear.textContent = `© ${currentYear} Mad Rocket Tattoo. Todos los derechos reservados.`;
    }
});