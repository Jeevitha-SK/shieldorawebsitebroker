/**
 * Shieldora Risk Solutions - Commercial Property Insurance Broker
 * Main JavaScript Engine (Theme, RTL, Navigation, Modals, Toasts, FAQ)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initAntiGravity();
  initHeader();
  initMobileMenu();
  initFAQ();
  initStatCounters();
  initQuoteModal();
  highlightActiveNav();
  initZoomGuard();
  initInputValidationAndMasks();

  // Guarantee instant refresh on local file:// links if clicking link to current page
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href]');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('javascript:')) return;
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const targetFile = href.split('?')[0].split('#')[0].split('/').pop();
    if (targetFile === currentFile) {
      e.preventDefault();
      window.location.reload();
    }
  });

});

/* ==========================================
   1. Theme Management (Light / Dark Mode)
   ========================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('shieldora_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.classList.add('dark');
    updateThemeIcons(true);
  } else {
    document.documentElement.classList.remove('dark');
    updateThemeIcons(false);
  }

  // Bind all theme toggle buttons
  // Bind all theme toggle buttons
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('shieldora_theme', isDark ? 'dark' : 'light');
      updateThemeIcons(isDark);
      // Trigger event for charts re-theming if needed
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDark } }));
    });
  });
}

function updateThemeIcons(isDark) {
  const icons = document.querySelectorAll('.theme-toggle-icon');
  icons.forEach(icon => {
    if (isDark) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun', 'text-amber-400');
    } else {
      icon.classList.remove('fa-sun', 'text-amber-400');
      icon.classList.add('fa-moon', 'text-slate-600');
    }
  });
}

/* ==========================================
   2. RTL Management (Arabic / Hebrew Layout)
   ========================================== */
function initRTL() {
  const savedDir = localStorage.getItem('shieldora-direction') || localStorage.getItem('shieldora_dir') || 'ltr';
  setDirection(savedDir, false);

  const rtlToggles = document.querySelectorAll('.rtl-toggle-btn');
  rtlToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      setDirection(newDir, false);
    });
  });

  window.addEventListener('storage', (e) => {
    if (e.key === 'shieldora-direction' || e.key === 'shieldora_dir') {
      setDirection(e.newValue || 'ltr', false);
    }
  });
}

window.setDirection = function(dir, notify = false) {
  const isRTL = dir === 'rtl';
  const targetDir = isRTL ? 'rtl' : 'ltr';
  const targetLang = isRTL ? 'ar' : 'en';

  // 1. Set root HTML element direction and language (Single source of truth)
  document.documentElement.dir = targetDir;
  document.documentElement.lang = targetLang;
  document.documentElement.setAttribute('dir', targetDir);
  document.documentElement.setAttribute('lang', targetLang);

  // 2. Set body element direction and layout class
  if (document.body) {
    document.body.dir = targetDir;
    document.body.setAttribute('dir', targetDir);
    if (isRTL) {
      document.body.classList.add('rtl-layout');
      document.documentElement.classList.add('rtl-layout');
    } else {
      document.body.classList.remove('rtl-layout');
      document.documentElement.classList.remove('rtl-layout');
    }
  }

  // 3. Persist to local storage under both standard and legacy keys
  localStorage.setItem('shieldora-direction', targetDir);
  localStorage.setItem('shieldora_dir', targetDir);
  
  // 4. Update all toggle button UI states
  updateRTLButtons(targetDir);

  // 5. Broadcast event across website components
  window.dispatchEvent(new CustomEvent('directionChanged', { detail: { dir: targetDir } }));
};

function updateRTLButtons(dir) {
  const isRTL = dir === 'rtl';
  const rtlLabels = document.querySelectorAll('.rtl-toggle-label');
  rtlLabels.forEach(label => {
    label.textContent = isRTL ? 'LTR' : 'RTL';
  });
  const rtlButtons = document.querySelectorAll('.rtl-toggle-btn');
  rtlButtons.forEach(btn => {
    btn.setAttribute('aria-pressed', isRTL ? 'true' : 'false');
    btn.setAttribute('title', isRTL ? 'Switch to English (LTR)' : 'Switch to Arabic / Hebrew (RTL)');
    if (isRTL) {
      btn.classList.add('border-amber-500', 'text-amber-500');
    } else {
      btn.classList.remove('border-amber-500', 'text-amber-500');
    }
  });
}

/* ==========================================
   2b. Anti-Gravity Zero-G Floating System
   ========================================== */
function initAntiGravity() {
  const savedAntiGravity = 
    localStorage.getItem('shieldora-antigravity') === 'true' || 
    localStorage.getItem('shieldora_antigravity') === 'true';
  setAntiGravity(savedAntiGravity, false);

  const agToggles = document.querySelectorAll('.antigravity-toggle-btn');
  agToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isCurrentlyActive = 
        document.documentElement.classList.contains('anti-gravity-enabled') ||
        document.documentElement.classList.contains('anti-gravity');
      setAntiGravity(!isCurrentlyActive, true);
    });
  });

  window.addEventListener('storage', (e) => {
    if (e.key === 'shieldora-antigravity' || e.key === 'shieldora_antigravity') {
      setAntiGravity(e.newValue === 'true', false);
    }
  });
}

window.setAntiGravity = function(enable, notify = false) {
  const isActive = Boolean(enable);
  
  if (isActive) {
    document.documentElement.classList.add('anti-gravity-enabled');
    document.documentElement.classList.add('anti-gravity');
    if (document.body) {
      document.body.classList.add('anti-gravity-enabled');
      document.body.classList.add('anti-gravity');
    }
  } else {
    document.documentElement.classList.remove('anti-gravity-enabled');
    document.documentElement.classList.remove('anti-gravity');
    if (document.body) {
      document.body.classList.remove('anti-gravity-enabled');
      document.body.classList.remove('anti-gravity');
    }
  }

  // Persist under both standard and legacy keys
  localStorage.setItem('shieldora-antigravity', isActive ? 'true' : 'false');
  localStorage.setItem('shieldora_antigravity', isActive ? 'true' : 'false');
  updateAntiGravityButtons(isActive);

  if (notify && window.showToast) {
    showToast(
      isActive 
        ? 'Zero-G Anti-Gravity Physics Activated across all cards & sections!' 
        : 'Standard Gravity Physics Restored', 
      'info'
    );
  }

  window.dispatchEvent(new CustomEvent('antiGravityChanged', { detail: { active: isActive } }));
};

function updateAntiGravityButtons(isActive) {
  const agButtons = document.querySelectorAll('.antigravity-toggle-btn');
  agButtons.forEach(btn => {
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    btn.setAttribute('title', isActive ? 'Disable Zero-G Floating Physics' : 'Activate Zero-G Floating Physics');
    if (isActive) {
      btn.classList.add('active', 'border-amber-500', 'text-amber-500');
    } else {
      btn.classList.remove('active', 'border-amber-500', 'text-amber-500');
    }
  });
}

/* ==========================================
   3. Header Sticky & Blur Effects
   ========================================== */
function initHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled', 'shadow-md');
    } else {
      header.classList.remove('scrolled', 'shadow-md');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================
   4. Mobile Hamburger Navigation
   ========================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('close-mobile-menu');

  if (!menuBtn || !mobileMenu) return;

  const toggleMenu = () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    if (isHidden) {
      mobileMenu.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    } else {
      mobileMenu.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  };

  menuBtn.addEventListener('click', toggleMenu);
  if (closeBtn) closeBtn.addEventListener('click', toggleMenu);

  // Close when clicking outside
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      toggleMenu();
    }
  });

  // Mobile submenu accordion
  const dropdownToggles = mobileMenu.querySelectorAll('.mobile-dropdown-btn');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const submenu = toggle.nextElementSibling;
      if (submenu) {
        submenu.classList.toggle('hidden');
        const icon = toggle.querySelector('.chevron-icon');
        if (icon) icon.classList.toggle('rotate-180');
      }
    });
  });
}

/* ==========================================
   5. Active Link Highlighter
   ========================================== */
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav a[href], #mobile-menu a[href]');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.split('/').pop();
    
    const isDirectMatch = linkPath === currentPath || (currentPath === '' && linkPath === 'index.html');
    const isParentMatch = 
      (currentPath === 'home-2.html' && linkPath === 'index.html' && link.classList.contains('nav-link')) ||
      (currentPath.startsWith('service-details') && linkPath === 'services.html' && link.classList.contains('nav-link')) ||
      (currentPath.startsWith('blog-details') && linkPath === 'blog.html' && link.classList.contains('nav-link'));

    if (isDirectMatch || isParentMatch) {
      link.classList.add('text-amber-500', 'font-semibold');
      link.classList.remove('text-slate-600', 'text-slate-700', 'text-slate-300');
    }
  });
}

/* ==========================================
   6. FAQ Accordion Component
   ========================================== */
function initFAQ() {
  const faqButtons = document.querySelectorAll('.faq-question-btn');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Close open siblings in the same accordion group
      const parentAccordion = btn.closest('.faq-accordion');
      if (parentAccordion) {
        parentAccordion.querySelectorAll('.faq-question-btn').forEach(otherBtn => {
          if (otherBtn !== btn) {
            otherBtn.setAttribute('aria-expanded', 'false');
            if (otherBtn.nextElementSibling) otherBtn.nextElementSibling.classList.remove('open');
            const otherIcon = otherBtn.querySelector('.faq-icon');
            if (otherIcon) otherIcon.classList.remove('rotate-180');
          }
        });
      }

      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        if (answer) answer.classList.remove('open');
        if (icon) icon.classList.remove('rotate-180');
      } else {
        btn.setAttribute('aria-expanded', 'true');
        if (answer) answer.classList.add('open');
        if (icon) icon.classList.add('rotate-180');
      }
    });
  });
}

/* ==========================================
   7. Stat Counters (Count-up on Scroll)
   ========================================== */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseFloat(counter.getAttribute('data-target'));
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
        const duration = 2000;
        const start = performance.now();

        const updateCounter = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const ease = 1 - Math.pow(1 - progress, 3);
          const current = (ease * target).toFixed(decimals);
          counter.textContent = `${prefix}${Number(current).toLocaleString()}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
          }
        };

        requestAnimationFrame(updateCounter);
        obs.unobserve(counter);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));
}

/* ==========================================
   8. Global Quote Modal System (Combined 2-Step Flow)
   ========================================== */
const PLAN_PRICING_TABLE = {
  'Essential Commercial Property Package': { monthly: 450, annual: 4860 },
  'Business Plus Commercial Package': { monthly: 890, annual: 9612 },
  'Comprehensive Enterprise Package': { monthly: 1650, annual: 17820 },
  'Commercial General Liability': { monthly: 380, annual: 4104 },
  'Commercial Real Estate Portfolio': { monthly: 2400, annual: 25920 },
  'Commercial Property Insurance': { monthly: 890, annual: 9612 }
};

function initQuoteModal() {
  // Bind quote trigger buttons
  document.querySelectorAll('[data-open-quote-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || 'Business Plus Commercial Package';
      const monthly = btn.getAttribute('data-price-monthly') || '';
      const annual = btn.getAttribute('data-price-annual') || '';
      openQuoteModal(service, monthly, annual);
    });
  });

  const quoteModal = document.getElementById('global-quote-modal');
  if (!quoteModal) return;

  const closeBtns = quoteModal.querySelectorAll('.close-quote-modal');
  closeBtns.forEach(btn => btn.addEventListener('click', closeQuoteModal));

  quoteModal.addEventListener('click', (e) => {
    if (e.target === quoteModal) closeQuoteModal();
  });

  const step1 = document.getElementById('quote-step-1');
  const step2 = document.getElementById('quote-step-2');

  if (step1 && step2) {
    initCombinedQuoteHandlers(quoteModal);
  } else {
    const quoteForm = document.getElementById('quick-quote-form');
    if (quoteForm) {
      quoteForm.addEventListener('submit', handleQuickQuoteSubmit);
    }
  }
}

function initCombinedQuoteHandlers(quoteModal) {
  const form = document.getElementById('quick-quote-form');
  const serviceSelect = document.getElementById('quote-service-select');
  const step1 = document.getElementById('quote-step-1');
  const step2 = document.getElementById('quote-step-2');
  const step3 = document.getElementById('quote-step-3');
  const stepIndicators = document.getElementById('quote-step-indicators');
  const gotoStep2Btn = document.getElementById('quote-goto-step-2-btn');
  const backToStep1Btn = document.getElementById('quote-back-to-step-1-btn');
  
  // Billing selection elements
  const annualCard = document.getElementById('schedule-annual-card');
  const monthlyCard = document.getElementById('schedule-monthly-card');
  const annualRadio = document.getElementById('schedule-annual-radio');
  const monthlyRadio = document.getElementById('schedule-monthly-radio');

  function updatePlanPriceDisplays(planName) {
    const pricing = PLAN_PRICING_TABLE[planName] || { monthly: 890, annual: 9612 };
    const planDisplay = document.getElementById('quote-selected-plan-display');
    const priceDisplay = document.getElementById('quote-selected-plan-price');
    const periodDisplay = document.getElementById('quote-selected-plan-period');
    const summaryPlan = document.getElementById('step2-summary-plan');
    const annualRateDisplay = document.getElementById('step2-annual-rate-display');
    const monthlyRateDisplay = document.getElementById('step2-monthly-rate-display');
    const calcPrice = document.getElementById('step2-calculated-price');
    const calcPeriod = document.getElementById('step2-calculated-period');

    if (planDisplay) planDisplay.textContent = planName;
    if (priceDisplay) priceDisplay.textContent = `$${pricing.monthly.toLocaleString()}`;
    if (periodDisplay) periodDisplay.textContent = '/ mo';
    if (summaryPlan) summaryPlan.textContent = planName;
    if (annualRateDisplay) annualRateDisplay.textContent = `$${pricing.annual.toLocaleString()} / year`;
    if (monthlyRateDisplay) monthlyRateDisplay.textContent = `$${pricing.monthly.toLocaleString()} / month`;

    const isAnnual = annualRadio && annualRadio.checked;
    if (calcPrice) {
      calcPrice.textContent = isAnnual ? `$${pricing.annual.toLocaleString()}` : `$${pricing.monthly.toLocaleString()}`;
    }
    if (calcPeriod) {
      calcPeriod.textContent = isAnnual ? '/ year (Save 10%)' : '/ month';
    }
  }

  // Update on service selection change
  if (serviceSelect) {
    serviceSelect.addEventListener('change', () => {
      updatePlanPriceDisplays(serviceSelect.value);
    });
  }

  // Step 1 to Step 2 Navigation
  if (gotoStep2Btn) {
    gotoStep2Btn.addEventListener('click', () => {
      const zipInp = document.getElementById('quote-zip');
      const compInp = document.getElementById('quote-company');
      const emailInp = document.getElementById('quote-email');
      let valid = true;

      [zipInp, compInp, emailInp].forEach(inp => {
        if (inp && !inp.value.trim()) {
          inp.classList.add('border-rose-500', 'ring-2', 'ring-rose-500/20');
          valid = false;
        } else if (inp) {
          inp.classList.remove('border-rose-500', 'ring-2', 'ring-rose-500/20');
        }
      });

      if (!valid) {
        showToast('Please complete required property & company details.', 'warning');
        return;
      }

      // Update Step 2 Summary
      const summaryEntity = document.getElementById('step2-summary-entity');
      const summaryZip = document.getElementById('step2-summary-zip');
      if (summaryEntity && compInp) summaryEntity.textContent = compInp.value;
      if (summaryZip && zipInp) summaryZip.textContent = `Zip: ${zipInp.value}`;

      updatePlanPriceDisplays(serviceSelect ? serviceSelect.value : 'Business Plus Commercial Package');

      // Update Tabs
      const tab1 = document.getElementById('step-tab-1');
      const tab2 = document.getElementById('step-tab-2');
      const num1 = document.getElementById('step-num-1');
      const num2 = document.getElementById('step-num-2');

      if (tab1) {
        tab1.className = 'flex items-center justify-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg sm:rounded-xl text-emerald-600 dark:text-emerald-400 font-bold transition-all min-w-0';
      }
      if (num1) {
        num1.innerHTML = '<i class="fa-solid fa-check"></i>';
        num1.className = 'w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] sm:text-[10px] mr-1.5 sm:mr-2 shrink-0';
      }
      if (tab2) {
        tab2.className = 'flex items-center justify-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg sm:rounded-xl bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 font-bold shadow-sm border border-slate-200 dark:border-slate-700 transition-all min-w-0';
      }
      if (num2) {
        num2.className = 'w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px] sm:text-[10px] mr-1.5 sm:mr-2 shrink-0';
      }

      step1.classList.add('hidden');
      step2.classList.remove('hidden');
    });
  }

  // Step 2 to Step 1 Back Navigation
  if (backToStep1Btn) {
    backToStep1Btn.addEventListener('click', () => {
      const tab1 = document.getElementById('step-tab-1');
      const tab2 = document.getElementById('step-tab-2');
      const num1 = document.getElementById('step-num-1');
      const num2 = document.getElementById('step-num-2');

      if (tab1) {
        tab1.className = 'flex items-center justify-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg sm:rounded-xl bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 font-bold shadow-sm border border-slate-200 dark:border-slate-700 transition-all min-w-0';
      }
      if (num1) {
        num1.textContent = '1';
        num1.className = 'w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px] sm:text-[10px] mr-1.5 sm:mr-2 shrink-0';
      }
      if (tab2) {
        tab2.className = 'flex items-center justify-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg sm:rounded-xl text-slate-400 dark:text-slate-500 font-bold transition-all min-w-0';
      }
      if (num2) {
        num2.className = 'w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[9px] sm:text-[10px] mr-1.5 sm:mr-2 shrink-0';
      }

      step2.classList.add('hidden');
      step1.classList.remove('hidden');
    });
  }

  // Billing Schedule Selection (Annual vs Monthly)
  function selectSchedule(mode) {
    const selectedPlan = serviceSelect ? serviceSelect.value : 'Business Plus Commercial Package';
    const pricing = PLAN_PRICING_TABLE[selectedPlan] || { monthly: 890, annual: 9612 };
    const calcPrice = document.getElementById('step2-calculated-price');
    const calcPeriod = document.getElementById('step2-calculated-period');

    if (mode === 'annual') {
      if (annualRadio) annualRadio.checked = true;
      if (annualCard) annualCard.className = 'cursor-pointer relative p-3 rounded-2xl border-2 transition-all flex flex-col justify-between border-amber-500 bg-amber-500/5 dark:bg-amber-500/10';
      if (monthlyCard) monthlyCard.className = 'cursor-pointer relative p-3 rounded-2xl border-2 transition-all flex flex-col justify-between border-slate-200 dark:border-slate-700 bg-transparent';
      if (calcPrice) calcPrice.textContent = `$${pricing.annual.toLocaleString()}`;
      if (calcPeriod) calcPeriod.textContent = '/ year (Save 10%)';
    } else {
      if (monthlyRadio) monthlyRadio.checked = true;
      if (monthlyCard) monthlyCard.className = 'cursor-pointer relative p-3 rounded-2xl border-2 transition-all flex flex-col justify-between border-amber-500 bg-amber-500/5 dark:bg-amber-500/10';
      if (annualCard) annualCard.className = 'cursor-pointer relative p-3 rounded-2xl border-2 transition-all flex flex-col justify-between border-slate-200 dark:border-slate-700 bg-transparent';
      if (calcPrice) calcPrice.textContent = `$${pricing.monthly.toLocaleString()}`;
      if (calcPeriod) calcPeriod.textContent = '/ month';
    }
  }

  if (annualCard) annualCard.addEventListener('click', () => selectSchedule('annual'));
  if (monthlyCard) monthlyCard.addEventListener('click', () => selectSchedule('monthly'));

  // Payment Method Tabs (ACH, Card, Net-30 Invoice)
  const methodTabs = quoteModal.querySelectorAll('.pay-method-tab');
  const achFields = document.getElementById('payment-fields-ach');
  const cardFields = document.getElementById('payment-fields-card');
  const invoiceFields = document.getElementById('payment-fields-invoice');

  methodTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      methodTabs.forEach(t => {
        t.className = 'pay-method-tab py-2 px-1 sm:px-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center transition-all text-slate-600 dark:text-slate-300 hover:border-amber-500 font-semibold text-[11px] sm:text-xs truncate min-w-0';
      });
      tab.className = 'pay-method-tab py-2 px-1 sm:px-2 rounded-xl border text-center transition-all bg-amber-500 text-white border-amber-500 font-bold text-[11px] sm:text-xs truncate min-w-0';

      const method = tab.getAttribute('data-method');
      if (achFields) achFields.classList.toggle('hidden', method !== 'ach');
      if (cardFields) cardFields.classList.toggle('hidden', method !== 'card');
      if (invoiceFields) invoiceFields.classList.toggle('hidden', method !== 'invoice');
    });
  });

  // Form Submit (Step 2 Submission)
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // If Step 1 is still visible, route to Step 2
      if (!step1.classList.contains('hidden')) {
        if (gotoStep2Btn) gotoStep2Btn.click();
        return;
      }

      const submitBtn = document.getElementById('quote-confirm-submit-btn');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Confirm Quote';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Scheduling Policy Binding...';
      }

      const selectedPlan = serviceSelect ? serviceSelect.value : 'Business Plus Commercial Package';
      const pricing = PLAN_PRICING_TABLE[selectedPlan] || { monthly: 890, annual: 9612 };
      const isAnnual = annualRadio && annualRadio.checked;
      const scheduledPrice = isAnnual ? `$${pricing.annual.toLocaleString()} / year` : `$${pricing.monthly.toLocaleString()} / month`;
      const billingCycleLabel = isAnnual ? `Annual Prepayment (${scheduledPrice})` : `Monthly EFT (${scheduledPrice})`;

      const company = document.getElementById('quote-company')?.value || 'Commercial Client LLC';
      const email = document.getElementById('quote-email')?.value || 'client@example.com';
      const zip = document.getElementById('quote-zip')?.value || '10001';
      const value = document.getElementById('quote-property-value')?.value || '$3M – $10M';

      // Detect active payment method
      const activeTab = quoteModal.querySelector('.pay-method-tab.bg-amber-500');
      const methodKey = activeTab ? activeTab.getAttribute('data-method') : 'ach';
      let methodLabel = 'Chase ACH Direct Debit (****4912)';
      if (methodKey === 'card') methodLabel = 'Corporate Purchasing Card (****4912)';
      if (methodKey === 'invoice') methodLabel = 'Net-30 Broker AP Invoicing';

      const quoteId = 'QUO-2026-' + Math.floor(1000 + Math.random() * 9000);

      setTimeout(() => {
        // Save to demo localStorage
        try {
          const existingQuotes = JSON.parse(localStorage.getItem('shieldora_demo_quotes') || '[]');
          existingQuotes.unshift({
            id: quoteId,
            propertyType: selectedPlan,
            propertyValue: value,
            companyName: company,
            businessEmail: email,
            zipCode: zip,
            billingSchedule: isAnnual ? 'Annual Prepayment' : 'Monthly EFT',
            estimatedPremium: scheduledPrice,
            paymentMethod: methodLabel,
            status: 'Pending Underwriting Binding',
            submittedAt: new Date().toISOString()
          });
          localStorage.setItem('shieldora_demo_quotes', JSON.stringify(existingQuotes));
        } catch (err) {
          console.warn('Storage quota', err);
        }

        // Populate confirmation state
        const confirmId = document.getElementById('confirm-quote-id');
        const confirmPlan = document.getElementById('confirm-plan-name');
        const confirmCompany = document.getElementById('confirm-company-name');
        const confirmBilling = document.getElementById('confirm-billing-term');
        const confirmMethod = document.getElementById('confirm-payment-method');

        if (confirmId) confirmId.textContent = quoteId;
        if (confirmPlan) confirmPlan.textContent = selectedPlan;
        if (confirmCompany) confirmCompany.textContent = company;
        if (confirmBilling) confirmBilling.textContent = billingCycleLabel;
        if (confirmMethod) confirmMethod.textContent = methodLabel;

        if (stepIndicators) stepIndicators.classList.add('hidden');
        if (step2) step2.classList.add('hidden');
        if (step3) step3.classList.remove('hidden');

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        showToast('Commercial Quote & Billing Preference Authorized! Policy binder scheduled.', 'success');
      }, 900);
    });
  }
}

window.openQuoteModal = function(serviceName = 'Business Plus Commercial Package', monthlyPrice = '', annualPrice = '') {
  const modal = document.getElementById('global-quote-modal');
  if (!modal) return;

  const step1 = document.getElementById('quote-step-1');
  const step2 = document.getElementById('quote-step-2');
  const step3 = document.getElementById('quote-step-3');
  const stepIndicators = document.getElementById('quote-step-indicators');

  if (step1 && step2) {
    // Reset to Step 1
    step1.classList.remove('hidden');
    step2.classList.add('hidden');
    if (step3) step3.classList.add('hidden');
    if (stepIndicators) stepIndicators.classList.remove('hidden');

    const tab1 = document.getElementById('step-tab-1');
    const tab2 = document.getElementById('step-tab-2');
    const num1 = document.getElementById('step-num-1');
    const num2 = document.getElementById('step-num-2');

    if (tab1) tab1.className = 'flex items-center justify-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg sm:rounded-xl bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 font-bold shadow-sm border border-slate-200 dark:border-slate-700 transition-all min-w-0';
    if (num1) {
      num1.textContent = '1';
      num1.className = 'w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px] sm:text-[10px] mr-1.5 sm:mr-2 shrink-0';
    }
    if (tab2) tab2.className = 'flex items-center justify-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg sm:rounded-xl text-slate-400 dark:text-slate-500 font-bold transition-all min-w-0';
    if (num2) {
      num2.textContent = '2';
      num2.className = 'w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[9px] sm:text-[10px] mr-1.5 sm:mr-2 shrink-0';
    }

    const serviceSelect = document.getElementById('quote-service-select');
    if (serviceSelect && serviceName) {
      let matched = false;
      for (let opt of serviceSelect.options) {
        if (opt.value === serviceName || opt.value.toLowerCase().includes(serviceName.toLowerCase())) {
          serviceSelect.value = opt.value;
          matched = true;
          break;
        }
      }
      if (!matched) {
        serviceSelect.value = 'Business Plus Commercial Package';
      }
    }

    // Trigger price display update
    const selectedPlan = serviceSelect ? serviceSelect.value : serviceName;
    const pricing = PLAN_PRICING_TABLE[selectedPlan] || { monthly: 890, annual: 9612 };
    const planDisplay = document.getElementById('quote-selected-plan-display');
    const priceDisplay = document.getElementById('quote-selected-plan-price');
    const periodDisplay = document.getElementById('quote-selected-plan-period');
    const summaryPlan = document.getElementById('step2-summary-plan');
    const annualRateDisplay = document.getElementById('step2-annual-rate-display');
    const monthlyRateDisplay = document.getElementById('step2-monthly-rate-display');
    const calcPrice = document.getElementById('step2-calculated-price');
    const calcPeriod = document.getElementById('step2-calculated-period');

    if (planDisplay) planDisplay.textContent = selectedPlan;
    if (priceDisplay) priceDisplay.textContent = `$${pricing.monthly.toLocaleString()}`;
    if (periodDisplay) periodDisplay.textContent = '/ mo';
    if (summaryPlan) summaryPlan.textContent = selectedPlan;
    if (annualRateDisplay) annualRateDisplay.textContent = `$${pricing.annual.toLocaleString()} / year`;
    if (monthlyRateDisplay) monthlyRateDisplay.textContent = `$${pricing.monthly.toLocaleString()} / month`;

    // Check page-level billing toggle preference
    const annualRadio = document.getElementById('schedule-annual-radio');
    const monthlyRadio = document.getElementById('schedule-monthly-radio');
    const annualCard = document.getElementById('schedule-annual-card');
    const monthlyCard = document.getElementById('schedule-monthly-card');

    if (window.currentPricingBilling === 'annual') {
      if (annualRadio) annualRadio.checked = true;
      if (annualCard) annualCard.className = 'cursor-pointer relative p-3 rounded-2xl border-2 transition-all flex flex-col justify-between border-amber-500 bg-amber-500/5 dark:bg-amber-500/10';
      if (monthlyCard) monthlyCard.className = 'cursor-pointer relative p-3 rounded-2xl border-2 transition-all flex flex-col justify-between border-slate-200 dark:border-slate-700 bg-transparent';
      if (calcPrice) calcPrice.textContent = `$${pricing.annual.toLocaleString()}`;
      if (calcPeriod) calcPeriod.textContent = '/ year (Save 10%)';
    } else {
      if (monthlyRadio) monthlyRadio.checked = true;
      if (monthlyCard) monthlyCard.className = 'cursor-pointer relative p-3 rounded-2xl border-2 transition-all flex flex-col justify-between border-amber-500 bg-amber-500/5 dark:bg-amber-500/10';
      if (annualCard) annualCard.className = 'cursor-pointer relative p-3 rounded-2xl border-2 transition-all flex flex-col justify-between border-slate-200 dark:border-slate-700 bg-transparent';
      if (calcPrice) calcPrice.textContent = `$${pricing.monthly.toLocaleString()}`;
      if (calcPeriod) calcPeriod.textContent = '/ month';
    }
  } else {
    // Single-step fallback
    const serviceInput = modal.querySelector('#quote-service-select');
    if (serviceInput && serviceName) {
      serviceInput.value = serviceName;
    }
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.classList.add('overflow-hidden');
};

window.closeQuoteModal = function() {
  const modal = document.getElementById('global-quote-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.classList.remove('overflow-hidden');
};

function handleQuickQuoteSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Analyzing Property Risk...';

  const formData = {
    propertyType: form.propertyType?.value || 'Commercial High-Rise',
    propertyValue: form.propertyValue?.value || '$5,000,000',
    companyName: form.companyName?.value || 'Enterprise Client',
    businessEmail: form.businessEmail?.value || 'client@example.com',
    zipCode: form.zipCode?.value || '10001',
    submittedAt: new Date().toISOString()
  };

  setTimeout(() => {
    try {
      const existingQuotes = JSON.parse(localStorage.getItem('shieldora_demo_quotes') || '[]');
      existingQuotes.unshift({
        id: 'QUO-' + Math.floor(1000 + Math.random() * 9000),
        ...formData,
        status: 'Pending Underwriting',
        estimatedPremium: '$' + Math.floor(6500 + Math.random() * 12000) + '/year'
      });
      localStorage.setItem('shieldora_demo_quotes', JSON.stringify(existingQuotes));
    } catch(err) {
      console.warn('Storage quota', err);
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    closeQuoteModal();
    form.reset();

    showToast('Quote Request Received! An insurance advisor is preparing your comparative risk analysis.', 'success');
  }, 1200);
}

/* ==========================================
   9. Toast Notification System
   ========================================== */
window.showToast = function(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-5 right-5 z-50 flex flex-col space-y-3 pointer-events-none max-w-sm w-full px-4';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto transform transition-all duration-300 ease-out translate-y-4 opacity-0 flex items-start p-4 rounded-xl shadow-xl border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100';

  let iconHtml = '<i class="fa-solid fa-circle-check text-emerald-500 text-xl mr-3 mt-0.5"></i>';
  let borderClass = 'border-emerald-200 dark:border-emerald-800';

  if (type === 'error') {
    iconHtml = '<i class="fa-solid fa-circle-exclamation text-rose-500 text-xl mr-3 mt-0.5"></i>';
    borderClass = 'border-rose-200 dark:border-rose-800';
  } else if (type === 'info') {
    iconHtml = '<i class="fa-solid fa-circle-info text-blue-500 text-xl mr-3 mt-0.5"></i>';
    borderClass = 'border-blue-200 dark:border-blue-800';
  } else if (type === 'warning') {
    iconHtml = '<i class="fa-solid fa-triangle-exclamation text-amber-500 text-xl mr-3 mt-0.5"></i>';
    borderClass = 'border-amber-200 dark:border-amber-800';
  }

  toast.classList.add(...borderClass.split(' '));
  toast.innerHTML = `
    ${iconHtml}
    <div class="flex-1 text-sm font-medium leading-relaxed">${message}</div>
    <button class="ml-3 text-slate-400 hover:text-slate-600 dark:hover:text-white" onclick="this.parentElement.remove()">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  // Auto remove after 4.5s
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 4500);
};

/* ==========================================
   10. Auto-Zoom Guard & Viewport Uniformity
   ========================================== */
function initZoomGuard() {
  function checkAndNormalizeZoom() {
    // Only apply on desktop viewports
    if (window.innerWidth < 1024 && (!window.outerWidth || window.outerWidth < 1024)) return;

    // Detect browser zoom ratio
    const outerW = window.outerWidth || 0;
    const innerW = window.innerWidth || 0;
    const winRatio = (outerW && innerW) ? (outerW / innerW) : 1;

    // Detect cross-page DPR discrepancy
    const currentDPR = window.devicePixelRatio || 1;
    const isServiceDetails = window.location.pathname.includes('service-details');
    
    // If on service-details or index, record the baseline DPR
    if (isServiceDetails || window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
      sessionStorage.setItem('shieldora_normal_dpr', currentDPR.toString());
    }

    const savedNormalDPR = parseFloat(sessionStorage.getItem('shieldora_normal_dpr') || '0');
    const dprRatio = savedNormalDPR > 0 ? (currentDPR / savedNormalDPR) : winRatio;

    // A page is shrunken if Chrome zoom is <= 88%
    const isShrunken = (winRatio <= 0.88 && winRatio >= 0.45) || (dprRatio <= 0.88 && dprRatio >= 0.45);

    let alertPill = document.getElementById('shieldora-zoom-guard-pill');

    if (isShrunken) {
      const effectiveRatio = (winRatio <= 0.88 && winRatio >= 0.45) ? winRatio : dprRatio;
      const factor = (1 / effectiveRatio).toFixed(3);
      const zoomPct = Math.round(effectiveRatio * 100);

      // Auto-compensate body zoom so navbar, fonts, and layout match service-details.html 1:1
      document.body.style.zoom = factor;

      if (!alertPill) {
        alertPill = document.createElement('div');
        alertPill.id = 'shieldora-zoom-guard-pill';
        alertPill.className = 'fixed bottom-5 right-5 z-[9999] max-w-sm p-3.5 bg-slate-900/95 dark:bg-slate-950/95 text-white rounded-2xl shadow-2xl border border-amber-500/60 backdrop-blur-md flex items-center gap-3 transition-all duration-300';
        alertPill.innerHTML = `
          <div class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <i class="fa-solid fa-expand text-sm"></i>
          </div>
          <div class="flex-1 text-xs">
            <div class="font-bold text-slate-100">Auto-Fit to 100% Size Active</div>
            <div class="text-slate-300 text-[11px]">Browser was at ${zoomPct}%. Press <kbd class="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-mono font-bold">Ctrl + 0</kbd> to reset browser zoom.</div>
          </div>
          <button type="button" class="text-slate-400 hover:text-white p-1 text-xs" onclick="this.closest('#shieldora-zoom-guard-pill').remove()">
            <i class="fa-solid fa-xmark"></i>
          </button>
        `;
        document.body.appendChild(alertPill);
      }
    } else {
      // Zoom is normal (100%)
      if (document.body.style.zoom && document.body.style.zoom !== '1') {
        document.body.style.zoom = '';
      }
      if (alertPill) {
        alertPill.remove();
      }
    }
  }

  // Monitor zoom state on load, resize, and key events
  checkAndNormalizeZoom();
  window.addEventListener('resize', checkAndNormalizeZoom);
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === '0' || e.code === 'Digit0' || e.code === 'Numpad0')) {
      setTimeout(checkAndNormalizeZoom, 150);
    }
  });
}

/* ==========================================================================
   10. Universal Form Input Validation & Character Enforcement Engine
   - Names: Alphabet letters, spaces, hyphens, and apostrophes ONLY
   - Phone Numbers: Numbers, +, -, (, ), and spaces ONLY (no letters)
   - Postal / Zip Codes: Digits 0-9 ONLY (max 5)
   - Financial & Payment: Digits 0-9 ONLY
   ========================================================================== */
function initInputValidationAndMasks() {
  function applyInputRules(root = document) {
    const inputs = root.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]), textarea');
    
    inputs.forEach(input => {
      if (input.dataset.validationEnforced === 'true') return;
      input.dataset.validationEnforced = 'true';

      const type = (input.getAttribute('type') || 'text').toLowerCase();
      const name = (input.getAttribute('name') || '').toLowerCase();
      const id = (input.getAttribute('id') || '').toLowerCase();
      const placeholder = (input.getAttribute('placeholder') || '').toLowerCase();
      const label = input.closest('div')?.querySelector('label')?.textContent.toLowerCase() || '';

      // -----------------------------------------------------------
      // RULE 1: NAME FIELDS (Alphabet Letters, Spaces, Hyphens, Apostrophes ONLY)
      // -----------------------------------------------------------
      const isCompany = name.includes('company') || id.includes('company') || 
                        name.includes('entity') || id.includes('entity') || 
                        name.includes('bank') || placeholder.includes('holdings') || placeholder.includes('llc');
      
      const isNameField = !isCompany && (
        name.includes('fullname') || name.includes('contactname') || name.includes('cardholder') ||
        name.includes('claimant') || name === 'name' || id.includes('fullname') || id.includes('contactname') ||
        id.includes('cardholder') || id.includes('claimant') || label.includes('full name') ||
        label.includes('contact name') || label.includes('cardholder') || label.includes('claimant') ||
        label.includes('authorized officer') || label.includes('first name') || label.includes('last name') ||
        placeholder.includes('robert sterling') || placeholder.includes('sarah connor') || placeholder.includes('jane doe')
      );

      if (isNameField) {
        input.setAttribute('pattern', "[A-Za-z\\s'\\-\\.]+");
        input.setAttribute('title', 'Please enter alphabet letters and spaces only');

        // Prevent typing digits or special characters
        input.addEventListener('keydown', (e) => {
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            if (!/^[a-zA-Z\s'.-]$/.test(e.key)) {
              e.preventDefault();
              showFieldFeedback(input, 'Alphabet letters only');
            }
          }
        });

        // Strip numbers or special characters if pasted
        input.addEventListener('input', () => {
          const original = input.value;
          const cleaned = original.replace(/[^a-zA-Z\s'.-]/g, '');
          if (original !== cleaned) {
            input.value = cleaned;
            showFieldFeedback(input, 'Numbers removed (Letters only)');
          }
        });
      }

      // -----------------------------------------------------------
      // RULE 2: PHONE NUMBER FIELDS (Numbers, +, -, (, ), spaces ONLY)
      // -----------------------------------------------------------
      const isPhoneField = type === 'tel' || name.includes('phone') || id.includes('phone') ||
                           label.includes('phone') || placeholder.includes('(555)');

      if (isPhoneField) {
        input.setAttribute('inputmode', 'tel');
        input.setAttribute('pattern', '[0-9+\\-()\\s]+');
        input.setAttribute('title', 'Please enter numbers and phone formatting only');

        // Prevent typing letters
        input.addEventListener('keydown', (e) => {
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            if (!/^[0-9+\-()\s]$/.test(e.key)) {
              e.preventDefault();
              showFieldFeedback(input, 'Numbers only');
            }
          }
        });

        // Strip letters if pasted
        input.addEventListener('input', () => {
          const original = input.value;
          const cleaned = original.replace(/[^0-9+\-()\s]/g, '');
          if (original !== cleaned) {
            input.value = cleaned;
            showFieldFeedback(input, 'Letters removed (Numbers only)');
          }
        });
      }

      // -----------------------------------------------------------
      // RULE 3: ZIP CODE FIELDS (5 Digits ONLY)
      // -----------------------------------------------------------
      const isZip = name.includes('zip') || id.includes('zip') || placeholder.includes('10001') || label.includes('zip');
      if (isZip) {
        input.setAttribute('inputmode', 'numeric');
        input.setAttribute('maxlength', '5');
        input.setAttribute('pattern', '[0-9]{5}');
        input.setAttribute('title', 'Please enter a 5-digit ZIP code');

        input.addEventListener('keydown', (e) => {
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            if (!/^[0-9]$/.test(e.key)) {
              e.preventDefault();
              showFieldFeedback(input, 'Digits only');
            }
          }
        });

        input.addEventListener('input', () => {
          const cleaned = input.value.replace(/\D/g, '').slice(0, 5);
          if (input.value !== cleaned) {
            input.value = cleaned;
          }
        });
      }

      // -----------------------------------------------------------
      // RULE 4: CREDIT CARD NUMBER (16 Digits with space groups)
      // -----------------------------------------------------------
      const isCardNum = name.includes('cardnumber') || id.includes('cardnumber') || placeholder.includes('4912');
      if (isCardNum) {
        input.setAttribute('inputmode', 'numeric');
        input.setAttribute('maxlength', '19');
        input.addEventListener('keydown', (e) => {
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            if (!/^[0-9\s]$/.test(e.key)) {
              e.preventDefault();
              showFieldFeedback(input, 'Numbers only');
            }
          }
        });
        input.addEventListener('input', () => {
          let val = input.value.replace(/\D/g, '').slice(0, 16);
          let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
          input.value = formatted;
        });
      }

      // -----------------------------------------------------------
      // RULE 5: CARD CVC (3-4 Digits ONLY)
      // -----------------------------------------------------------
      const isCvc = name.includes('cvc') || id.includes('cvc') || name.includes('cvv') || id.includes('cvv') || placeholder.includes('3 or 4');
      if (isCvc) {
        input.setAttribute('inputmode', 'numeric');
        input.setAttribute('maxlength', '4');
        input.addEventListener('keydown', (e) => {
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            if (!/^[0-9]$/.test(e.key)) {
              e.preventDefault();
              showFieldFeedback(input, 'Numbers only');
            }
          }
        });
        input.addEventListener('input', () => {
          input.value = input.value.replace(/\D/g, '').slice(0, 4);
        });
      }

      // -----------------------------------------------------------
      // RULE 6: CARD EXPIRY (MM/YY)
      // -----------------------------------------------------------
      const isExpiry = name.includes('expiry') || id.includes('expiry') || placeholder.includes('mm/yy');
      if (isExpiry) {
        input.setAttribute('inputmode', 'numeric');
        input.setAttribute('maxlength', '5');
        input.addEventListener('keydown', (e) => {
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            if (!/^[0-9/]$/.test(e.key)) {
              e.preventDefault();
              showFieldFeedback(input, 'MM/YY numbers only');
            }
          }
        });
        input.addEventListener('input', () => {
          let digits = input.value.replace(/\D/g, '').slice(0, 4);
          if (digits.length >= 2) {
            input.value = digits.slice(0, 2) + '/' + digits.slice(2);
          } else {
            input.value = digits;
          }
        });
      }

      // -----------------------------------------------------------
      // RULE 7: ROUTING NUMBER (9 digits only)
      // -----------------------------------------------------------
      const isRouting = name.includes('routing') || id.includes('routing');
      if (isRouting) {
        input.setAttribute('inputmode', 'numeric');
        input.setAttribute('maxlength', '9');
        input.addEventListener('keydown', (e) => {
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            if (!/^[0-9]$/.test(e.key)) {
              e.preventDefault();
              showFieldFeedback(input, 'Numbers only');
            }
          }
        });
        input.addEventListener('input', () => {
          input.value = input.value.replace(/\D/g, '').slice(0, 9);
        });
      }

      // -----------------------------------------------------------
      // RULE 8: ESTIMATED DAMAGE / MONETARY AMOUNT
      // -----------------------------------------------------------
      const isAmount = placeholder.includes('$75,000') || label.includes('damage') || label.includes('amount') || name.includes('amount');
      if (isAmount) {
        input.setAttribute('inputmode', 'numeric');
        input.addEventListener('keydown', (e) => {
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            if (!/^[0-9$,.\s]$/.test(e.key)) {
              e.preventDefault();
              showFieldFeedback(input, 'Numbers only');
            }
          }
        });
        input.addEventListener('input', () => {
          input.value = input.value.replace(/[^0-9$,.]/g, '');
        });
      }
    });
  }

  // Floating feedback hint badge
  function showFieldFeedback(input, message) {
    let tip = input.parentElement.querySelector('.input-field-hint');
    if (!tip) {
      tip = document.createElement('span');
      tip.className = 'input-field-hint text-[10px] text-amber-500 font-bold block mt-1 transition-opacity duration-300';
      input.parentElement.appendChild(tip);
    }
    tip.textContent = message;
    tip.style.opacity = '1';
    clearTimeout(input._hintTimeout);
    input._hintTimeout = setTimeout(() => {
      tip.style.opacity = '0';
      setTimeout(() => tip.remove(), 300);
    }, 1800);
  }

  // Initial application on DOM load
  applyInputRules(document);

  // Re-apply if dynamic modals or tabs open
  const observer = new MutationObserver(() => applyInputRules(document));
  observer.observe(document.body, { childList: true, subtree: true });
}

