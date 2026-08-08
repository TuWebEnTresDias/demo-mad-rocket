/* ========================================
   MAD ROCKET TATTOO STUDIO
   JavaScript — Interactions & Animations
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- HEADER SCROLL EFFECT ---
    const header = document.getElementById('main-header');
    const scrollThreshold = 80;

    const handleHeaderScroll = () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    // --- MOBILE MENU TOGGLE ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a nav link
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (mainNav.classList.contains('active') && 
                !mainNav.contains(e.target) && 
                !mobileMenuBtn.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // --- SMOOTH SCROLL FOR ANCHOR LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- REVEAL ON SCROLL (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animation for elements in the same section
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('active');
                    }, delay);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.1
        });

        // Add stagger delay for grouped elements
        const staggerGroups = [
            '.diff-grid .reveal',
            '.services-grid .reveal',
            '.process-steps .reveal',
            '.gallery-grid .reveal',
            '.testimonials-grid .reveal',
            '.moments-grid .reveal'
        ];

        staggerGroups.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((el, i) => {
                el.dataset.delay = i * 100;
            });
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    } else {
        // Fallback: show everything
        revealElements.forEach(el => el.classList.add('active'));
    }

    // --- FORM TO WHATSAPP ---
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const servicio = document.getElementById('servicio').value;
            const descripcion = document.getElementById('descripcion').value.trim();
            const telefono = document.getElementById('telefono').value.trim();

            // Build the message
            let message = `Hola Mad Rocket! Soy ${nombre}.`;
            
            if (servicio) {
                message += `\n\nMe interesa: ${servicio}`;
            }
            
            if (descripcion) {
                message += `\n\nMi idea: ${descripcion}`;
            }
            
            if (telefono) {
                message += `\n\nMi teléfono: ${telefono}`;
            }
            
            message += `\n\nQuiero consultar por disponibilidad y precios.`;

            // Encode and open WhatsApp
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/5491131098445?text=${encodedMessage}`;
            
            window.open(whatsappUrl, '_blank');

            // Reset form
            contactForm.reset();

            // Visual feedback
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
                ¡Enviado!
            `;
            submitBtn.style.background = '#25D366';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        });
    }

    // --- PARALLAX EFFECT ON HERO ---
    const heroBg = document.querySelector('.hero-bg img');
    
    if (heroBg) {
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.scrollY;
            const heroHeight = document.querySelector('.hero').offsetHeight;
            
            if (scrolled < heroHeight) {
                const parallaxValue = scrolled * 0.3;
                heroBg.style.transform = `scale(1.05) translateY(${parallaxValue}px)`;
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    // --- COUNTER ANIMATION FOR STATS ---
    const animateCounter = (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);
        
        const updateCounter = () => {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        updateCounter();
    };

    // --- GALLERY LIGHTBOX EFFECT (simple zoom) ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (!img) return;

            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.95);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                animation: fadeIn 0.3s ease;
                padding: 40px;
            `;

            const fullImg = document.createElement('img');
            fullImg.src = img.src;
            fullImg.alt = img.alt;
            fullImg.style.cssText = `
                max-width: 90%;
                max-height: 90vh;
                object-fit: contain;
                border-radius: 8px;
                animation: zoomIn 0.3s ease;
            `;

            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = `
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            `;
            closeBtn.style.cssText = `
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                cursor: pointer;
                padding: 12px;
                border-radius: 50%;
                transition: all 0.3s ease;
            `;
            closeBtn.onmouseover = () => closeBtn.style.background = 'rgba(224, 69, 155, 0.8)';
            closeBtn.onmouseout = () => closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';

            overlay.appendChild(fullImg);
            overlay.appendChild(closeBtn);
            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';

            const closeOverlay = () => {
                overlay.style.opacity = '0';
                overlay.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    overlay.remove();
                    document.body.style.overflow = '';
                }, 300);
            };

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay || e.target === fullImg || e.target === closeBtn || closeBtn.contains(e.target)) {
                    closeOverlay();
                }
            });

            document.addEventListener('keydown', function escHandler(e) {
                if (e.key === 'Escape') {
                    closeOverlay();
                    document.removeEventListener('keydown', escHandler);
                }
            });
        });
    });

    // Add dynamic keyframes for lightbox
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes zoomIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(styleSheet);

    // --- ACTIVE NAV LINK ON SCROLL ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav a');

    if (sections.length && navLinks.length) {
        const updateActiveNav = () => {
            const scrollPos = window.scrollY + 200;

            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.getAttribute('id');

                if (scrollPos >= top && scrollPos < top + height) {
                    navLinks.forEach(link => {
                        link.style.color = '';
                        link.style.opacity = '';
                        if (link.getAttribute('href') === `#${id}`) {
                            link.style.color = 'var(--pink)';
                            link.style.opacity = '1';
                        }
                    });
                }
            });
        };

        window.addEventListener('scroll', updateActiveNav, { passive: true });
    }

    // --- TYPING EFFECT FOR HERO TAGLINE ---
    const heroTag = document.querySelector('.hero-tag');
    if (heroTag) {
        const text = heroTag.textContent;
        heroTag.textContent = '';
        heroTag.style.opacity = '1';
        
        let charIndex = 0;
        const typeWriter = () => {
            if (charIndex < text.length) {
                heroTag.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Start after hero animations complete
        setTimeout(typeWriter, 1200);
    }

    // --- SCROLL PROGRESS INDICATOR ---
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--pink), #ff69b4);
        z-index: 10001;
        transition: width 0.1s ease;
        width: 0%;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    }, { passive: true });

    console.log('🚀 Mad Rocket Tattoo Studio — Landing loaded successfully');
});