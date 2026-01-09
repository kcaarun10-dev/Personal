// Mobile menu variables
let mobileMenu, mobileNav, closeMenu, mobileNavLinks;

// Initialize mobile menu elements
function initMobileMenu() {
    mobileMenu = document.getElementById('mobile-menu');
    mobileNav = document.getElementById('mobile-nav');
    closeMenu = document.getElementById('close-menu');
    mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    
    if (mobileMenu && mobileNav && closeMenu) {
        mobileMenu.addEventListener('click', () => {
            mobileNav.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeMenu.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

const typingText = document.querySelector('.typing-text');
const words = ["Web Developer", "UI/UX Designer", "Freelancer"];
let wordIndex = 0;
let letterIndex = 0;
let currentWord = "";
let isDeleting = false;

function type() {
    if (wordIndex === words.length) {
        wordIndex = 0;
    }

    currentWord = words[wordIndex];

    if (isDeleting) {
        typingText.textContent = `I'm a ${currentWord.substring(0, letterIndex - 1)}`;
        letterIndex--;
        if (letterIndex === 0) {
            isDeleting = false;
            wordIndex++;
        }
    } else {
        typingText.textContent = `I'm a ${currentWord.substring(0, letterIndex + 1)}`;
        letterIndex++;
        if (letterIndex === currentWord.length) {
            isDeleting = true;
        }
    }

    setTimeout(type, isDeleting ? 100 : 200);
}

// Start typing animation
type();

// Enhanced Navigation with scroll effects
const navLinks = document.querySelectorAll('nav a, .mobile-nav-links a');
const sections = document.querySelectorAll('section');
const header = document.querySelector('header');

// Header scroll effect
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    
    // Add scrolled class to header
    if (scrolled > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Parallax effect for home section
    const homeContent = document.querySelector('.home-content');
    const homeImg = document.querySelector('.home-img');
    
    if (homeContent && homeImg) {
        homeContent.style.transform = `translateY(${scrolled * 0.2}px)`;
        homeImg.style.transform = `translateY(${scrolled * 0.3}px) scale(${1 - scrolled * 0.0003})`;
    }
    
    updateActiveNav();
});

// Active navigation link on scroll
function updateActiveNav() {
    const scrollY = window.scrollY;
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`nav a[href="#${section.id}"], .mobile-nav-links a[href="#${section.id}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });
}

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            
            // Animate skill bars when visible
            if (entry.target.classList.contains('skills-container')) {
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach(bar => {
                    const progress = bar.getAttribute('data-progress');
                    setTimeout(() => {
                        bar.style.width = progress + '%';
                    }, 200);
                });
            }
        }
    });
}, observerOptions);

// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .timeline-item, .experience-card, .project-card, .skills-container');
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
    
    // Initialize mobile menu
    initMobileMenu();
});

// Parallax effect for home section
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const homeContent = document.querySelector('.home-content');
    const homeImg = document.querySelector('.home-img');
    
    if (homeContent && homeImg) {
        homeContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        homeImg.style.transform = `translateY(${scrolled * 0.5}px) scale(${1 - scrolled * 0.0005})`;
    }
    
    updateActiveNav();
});

// Add hover effect to cards
const cards = document.querySelectorAll('.service-card, .experience-card, .project-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Add ripple effect to buttons
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

function cToF(){
    cOut.innerText = (cel.value * 9/5 + 32) + " °F";
}

function genPass(){
    let chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
    let p="";
    for(let i=0;i<passLen.value;i++){
        p+=chars[Math.floor(Math.random()*chars.length)];
    }
    passOut.innerText=p;
}

function toUpper(){ text1.value=text1.value.toUpperCase(); }
function toLower(){ text2.value=text2.value.toLowerCase(); }

function wordCount(){
    wordOut.innerText = text3.value.trim().split(/\s+/).length + " words";
}

function reverseText(){
    revOut.innerText = text4.value.split("").reverse().join("");
}

function square(){
    sqOut.innerText = numSq.value ** 2;
}

function randomNum(){
    randOut.innerText = Math.floor(Math.random()*1000);
}
