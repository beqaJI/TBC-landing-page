/**
 * NexusAI — Modern SaaS Landing Page Script
 * Crafted with Vanilla JavaScript (ES6+)
 * 
 * Features:
 * - Dynamic Sticky Navigation & Header Transitions
 * - Mobile Hamburger Menu with Drawer State Management
 * - Smooth Anchor Link Scrolling with Active Section Highlighting
 * - Interactive Numerical Counter Animation (IntersectionObserver)
 * - Robust Client-Side Form Validation (Email regex, input sanitation, feedback)
 * - Asynchronous Submission Simulation (Loading states, Success Banners, Toasts)
 * - Live Simulated Terminal Console Feed
 * - Floating Back to Top Control
 * - Dynamic Lucide Icons Initialization
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Set Current Year in Footer
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     1. HEADER SCROLL & ACTIVE LINK HIGHLIGHTING
     -------------------------------------------------------------------------- */
  const header = document.getElementById('site-header');
  const sections = document.querySelectorAll('section[id], header[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const handleScrollEffects = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header background blur & shadow on scroll
    if (scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top button visibility
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Active Section Detection on Scroll
    let currentSectionId = '';
    const scrollPosition = scrollY + 140;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      updateActiveNavLinks(currentSectionId);
    }
  };

  const updateActiveNavLinks = (activeId) => {
    desktopNavLinks.forEach((link) => {
      const targetNav = link.getAttribute('data-nav');
      if (targetNav === activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    mobileNavLinks.forEach((link) => {
      const targetNav = link.getAttribute('data-nav');
      if (targetNav === activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', handleScrollEffects, { passive: true });
  handleScrollEffects(); // Trigger once on load

  /* --------------------------------------------------------------------------
     2. MOBILE MENU & DRAWER TOGGLE
     -------------------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

  const toggleMobileMenu = (forceClose = false) => {
    const isCurrentlyOpen = mobileMenuBtn.classList.contains('active');
    const shouldOpen = forceClose ? false : !isCurrentlyOpen;

    if (shouldOpen) {
      mobileMenuBtn.classList.add('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      mobileNavDrawer.classList.add('open');
      mobileNavDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      mobileMenuBtn.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileNavDrawer.classList.remove('open');
      mobileNavDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => toggleMobileMenu());

    // Close mobile drawer when clicking any link inside it
    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => toggleMobileMenu(true));
    });

    const mobileCtaBtn = document.getElementById('mobile-cta-btn');
    if (mobileCtaBtn) {
      mobileCtaBtn.addEventListener('click', () => toggleMobileMenu(true));
    }

    // Close on click outside drawer
    document.addEventListener('click', (event) => {
      if (
        mobileNavDrawer.classList.contains('open') &&
        !mobileNavDrawer.contains(event.target) &&
        !mobileMenuBtn.contains(event.target)
      ) {
        toggleMobileMenu(true);
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. SMOOTH SCROLLING FOR ALL INTERNAL LINKS
     -------------------------------------------------------------------------- */
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

  smoothScrollLinks.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 75;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Back to Top Click
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. ANIMATED METRICS COUNTER (INTERSECTION OBSERVER)
     -------------------------------------------------------------------------- */
  const counterElements = document.querySelectorAll('.stat-counter');
  let hasCountersAnimated = false;

  const animateCounters = () => {
    counterElements.forEach((counter) => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;
      const duration = 2000; // 2 seconds
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing function (easeOutQuad)
        const easedProgress = 1 - (1 - progress) * (1 - progress);
        const currentValue = easedProgress * target;

        if (isDecimal) {
          counter.textContent = currentValue.toFixed(2);
        } else {
          counter.textContent = Math.floor(currentValue);
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = isDecimal ? target.toFixed(2) : target;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const statsSection = document.querySelector('.about-stats-col');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasCountersAnimated) {
          hasCountersAnimated = true;
          animateCounters();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  } else {
    // Fallback if IntersectionObserver is not supported
    animateCounters();
  }

  /* --------------------------------------------------------------------------
     5. CONTACT FORM VALIDATION & ASYNC SUBMISSION
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const charCounter = document.getElementById('char-counter');
  const submitButton = document.getElementById('submit-button');
  const btnText = document.getElementById('btn-text');
  const successBanner = document.getElementById('form-success-banner');
  const errorBanner = document.getElementById('form-general-error');

  // Character counter for textarea
  if (messageInput && charCounter) {
    const maxChars = 500;
    messageInput.addEventListener('input', () => {
      const length = messageInput.value.length;
      charCounter.textContent = `${length} / ${maxChars}`;
      if (length > maxChars) {
        charCounter.style.color = 'var(--rose)';
      } else {
        charCounter.style.color = 'var(--text-muted)';
      }
    });
  }

  // Validation Rules
  const validators = {
    name: (value) => {
      const trimmed = value.trim();
      if (!trimmed) {
        return { isValid: false, message: 'Full name is required.' };
      }
      if (trimmed.length < 2) {
        return { isValid: false, message: 'Name must contain at least 2 characters.' };
      }
      if (!/^[a-zA-Z\s\u00C0-\u024F\u10A0-\u10FF.'-]+$/.test(trimmed)) {
        return { isValid: false, message: 'Please enter a valid full name.' };
      }
      return { isValid: true };
    },

    email: (value) => {
      const trimmed = value.trim();
      if (!trimmed) {
        return { isValid: false, message: 'Work email is required.' };
      }
      // Standard robust email regex
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      if (!emailRegex.test(trimmed)) {
        return { isValid: false, message: 'Please provide a valid email address (e.g. name@company.com).' };
      }
      return { isValid: true };
    },

    message: (value) => {
      const trimmed = value.trim();
      if (!trimmed) {
        return { isValid: false, message: 'Project message is required.' };
      }
      if (trimmed.length < 10) {
        return { isValid: false, message: 'Message should be at least 10 characters describing your request.' };
      }
      return { isValid: true };
    }
  };

  // Set field state (error vs success)
  const setFieldState = (fieldInput, errorElementId, validationResult) => {
    const formGroup = fieldInput.closest('.form-group');
    const errorMsgElement = document.getElementById(errorElementId);

    if (!validationResult.isValid) {
      formGroup.classList.add('has-error');
      formGroup.classList.remove('has-success');
      if (errorMsgElement) {
        errorMsgElement.textContent = validationResult.message;
      }
    } else {
      formGroup.classList.remove('has-error');
      formGroup.classList.add('has-success');
      if (errorMsgElement) {
        errorMsgElement.textContent = '';
      }
    }

    return validationResult.isValid;
  };

  // Real-time Validation Listeners
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameInput.closest('.form-group').classList.contains('has-error')) {
        setFieldState(nameInput, 'error-name', validators.name(nameInput.value));
      }
    });
    nameInput.addEventListener('blur', () => {
      setFieldState(nameInput, 'error-name', validators.name(nameInput.value));
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (emailInput.closest('.form-group').classList.contains('has-error')) {
        setFieldState(emailInput, 'error-email', validators.email(emailInput.value));
      }
    });
    emailInput.addEventListener('blur', () => {
      setFieldState(emailInput, 'error-email', validators.email(emailInput.value));
    });
  }

  if (messageInput) {
    messageInput.addEventListener('input', () => {
      if (messageInput.closest('.form-group').classList.contains('has-error')) {
        setFieldState(messageInput, 'error-message', validators.message(messageInput.value));
      }
    });
    messageInput.addEventListener('blur', () => {
      setFieldState(messageInput, 'error-message', validators.message(messageInput.value));
    });
  }

  // Toast Notification System
  const showToast = (title, message, type = 'success') => {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i data-lucide="${type === 'success' ? 'check-circle-2' : 'alert-circle'}" class="toast-icon"></i>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close notification">&times;</button>
    `;

    toastContainer.appendChild(toast);
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    const closeBtn = toast.querySelector('.toast-close');
    const removeToast = () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    };

    closeBtn.addEventListener('click', removeToast);
    setTimeout(removeToast, 5000);
  };

  // Form Submit Handler
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevents page reload!

      // Hide previous banners
      successBanner.classList.remove('show');
      errorBanner.classList.remove('show');

      // Validate all fields
      const isNameValid = setFieldState(nameInput, 'error-name', validators.name(nameInput.value));
      const isEmailValid = setFieldState(emailInput, 'error-email', validators.email(emailInput.value));
      const isMessageValid = setFieldState(messageInput, 'error-message', validators.message(messageInput.value));

      const isFormValid = isNameValid && isEmailValid && isMessageValid;

      if (!isFormValid) {
        errorBanner.classList.add('show');
        showToast('Validation Error', 'Please check the highlighted fields and correct the issues.', 'error');
        
        // Focus first invalid input
        if (!isNameValid) nameInput.focus();
        else if (!isEmailValid) emailInput.focus();
        else if (!isMessageValid) messageInput.focus();
        return;
      }

      // If valid, show loading state
      submitButton.classList.add('loading');
      submitButton.disabled = true;
      btnText.textContent = 'Transmitting Inquiry...';

      // Simulate realistic API request
      setTimeout(() => {
        // Reset loading state
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        btnText.textContent = 'Send Message';

        // Show Success Banner
        successBanner.classList.add('show');
        
        // Show Toast
        showToast(
          'Message Dispatched Successfully',
          `Thank you ${nameInput.value.trim()}! An infrastructure lead will contact you at ${emailInput.value.trim()}.`,
          'success'
        );

        // Reset form inputs and status classes
        contactForm.reset();
        if (charCounter) charCounter.textContent = '0 / 500';
        document.querySelectorAll('.form-group').forEach((grp) => {
          grp.classList.remove('has-success', 'has-error');
        });

        // Scroll smoothly to success banner if needed
        successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 1200);
    });
  }

  /* --------------------------------------------------------------------------
     6. LIVE REAL-TIME FEED GENERATOR (HERO DASHBOARD SIMULATION)
     -------------------------------------------------------------------------- */
  const consoleStream = document.getElementById('console-stream');
  if (consoleStream) {
    const simulatedEvents = [
      { tag: 'SYS', class: 'tag-info', msg: 'Rebalancing tensor cache across 142 edge regions' },
      { tag: 'OK', class: 'tag-success', msg: 'P99 Latency stabilized at 8.1ms under 2.1M ops/sec' },
      { tag: 'AUTO', class: 'tag-accent', msg: 'Automated fallback node initialized: zero dropped tokens' },
      { tag: 'SEC', class: 'tag-info', msg: 'Zero-trust homomorphic cryptographic handshake verified' },
      { tag: 'SYNC', class: 'tag-success', msg: 'Dynamic model checkpoint synchronized with Frankfurt cluster' }
    ];

    let eventIndex = 0;
    setInterval(() => {
      const now = new Date();
      const timeStr = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;
      const currentEvt = simulatedEvents[eventIndex % simulatedEvents.length];
      eventIndex++;

      const logRow = document.createElement('div');
      logRow.className = 'console-line';
      logRow.style.opacity = '0';
      logRow.style.transition = 'opacity 0.4s ease';
      logRow.innerHTML = `<span class="log-time">${timeStr}</span> <span class="log-tag ${currentEvt.class}">${currentEvt.tag}</span> ${currentEvt.msg}`;

      consoleStream.appendChild(logRow);
      setTimeout(() => { logRow.style.opacity = '1'; }, 50);

      // Keep only last 3 rows
      while (consoleStream.children.length > 3) {
        consoleStream.removeChild(consoleStream.firstChild);
      }
    }, 4500);
  }
});
