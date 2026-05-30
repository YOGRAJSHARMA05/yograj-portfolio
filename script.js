/* ==========================================================================
   YOGRAJ SHARMA - PREMIUM PORTFOLIO INTERACTIVE ENGINE (script.js)
   Features: Loader, Typing Tagline, Counters, Skill Bars, Scroll Indicators
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. PREMIUM LOADING SCREEN
  // ==========================================================================
  const loaderScreen = document.getElementById('loader-screen');
  const loaderBar = document.getElementById('loader-bar');
  
  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      
      // Animate loader fade out
      setTimeout(() => {
        loaderScreen.style.opacity = '0';
        loaderScreen.style.visibility = 'hidden';
        
        // Start typing animation after loader finishes
        setTimeout(startTypewriter, 400);
      }, 300);
    }
    loaderBar.style.width = `${progress}%`;
  }, 50);


  // ==========================================================================
  // 2. TYPING TAGLINE ANIMATION
  // ==========================================================================
  const typingElement = document.getElementById('typing-tagline');
  const taglines = [
    "Computer Science & Engineering Student",
    "Developer & Innovator",
    "Leader & Team Builder",
    "Artist & Performer"
  ];
  
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function startTypewriter() {
    type();
  }

  function type() {
    const currentTagline = taglines[textIndex];
    
    if (isDeleting) {
      // Deleting text
      typingElement.textContent = currentTagline.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40; // delete speed is faster
    } else {
      // Writing text
      typingElement.textContent = currentTagline.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 85;
    }

    // Caret blinking handled in CSS via border-right animation

    // If writing is complete
    if (!isDeleting && charIndex === currentTagline.length) {
      // Pause at full word
      typingSpeed = 1800; 
      isDeleting = true;
    } 
    // If deleting is complete
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      // Move to next phrase
      textIndex = (textIndex + 1) % taglines.length;
      typingSpeed = 500; // brief pause before next word
    }

    setTimeout(type, typingSpeed);
  }


  // ==========================================================================
  // 3. NAVIGATION ACTIVE HIGHLIGHT & STICKY HEADER
  // ==========================================================================
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links .nav-link, .nav-links .nav-cta');
  
  window.addEventListener('scroll', () => {
    // Add sticky header shadow/blur
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Highlight nav link based on viewport scroll
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 250)) {
        currentSectionId = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });


  // ==========================================================================
  // 4. MOBILE HAMBURGER MENU
  // ==========================================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-links-menu');
  
  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close menu when clicking link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });


  // ==========================================================================
  // 5. SCROLL REVEAL (INTERSECTION OBSERVER)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });


  // ==========================================================================
  // 6. ANIMATED SKILLS BAR
  // ==========================================================================
  const skillBars = document.querySelectorAll('.skill-bar');
  const skillsSection = document.getElementById('skills');
  
  const skillsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillBars.forEach(bar => {
          const targetPercent = bar.getAttribute('data-percent');
          bar.style.width = targetPercent;
        });
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });
  
  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }


  // ==========================================================================
  // 7. ANIMATED STATISTICS COUNTERS
  // ==========================================================================
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsSection = document.querySelector('.stats-grid');
  
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNumbers.forEach(num => {
          const target = parseInt(num.getAttribute('data-count'), 10);
          animateCounter(num, 0, target, 2000); // 2 seconds duration
        });
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });
  
  if (statsSection) {
    counterObserver.observe(statsSection);
  }

  function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = Math.floor(progress * (end - start) + start);
      element.textContent = currentValue + (end > 10 ? "+" : "");
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = end + "+";
      }
    };
    window.requestAnimationFrame(step);
  }


  // ==========================================================================
  // 8. CONTACT FORM WITH MOCK SPINNER & TOAST SUBMISSION
  // ==========================================================================
  const contactForm = document.getElementById('portfolio-contact-form');
  const submitBtn = document.getElementById('btn-submit');
  const toastMsg = document.getElementById('form-toast');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Put submit button in loading state
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...`;
      
      // Simulate API submit latency
      setTimeout(() => {
        // Reset form
        contactForm.reset();
        
        // Restore button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Display premium toast notification
        toastMsg.classList.add('show');
        
        // Auto hide toast after 4 seconds
        setTimeout(() => {
          toastMsg.classList.remove('show');
        }, 4000);
        
      }, 1500);
    });
  }

});
