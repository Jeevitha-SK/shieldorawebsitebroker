/**
 * Shieldora Risk Solutions - Commercial Property Insurance Broker
 * Forms Handling & Demo Authentication Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initLoginForm();
  initRegisterForm();
  initNewsletterForms();
  initPasswordToggles();
});

/* ==========================================
   1. Contact Form Handling
   ========================================== */
function initContactForm() {
  const contactForm = document.getElementById('main-contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalBtn = btn.innerHTML;

    // Basic validation
    const fullName = contactForm.fullName?.value.trim();
    const email = contactForm.email?.value.trim();
    const phone = contactForm.phone?.value.trim();
    const company = contactForm.company?.value.trim();
    const insuranceType = contactForm.insuranceType?.value;
    const message = contactForm.message?.value.trim();

    if (!fullName || !email || !message) {
      showToast('Please fill in all required fields (Name, Email, Message).', 'error');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Submitting Inquiry...';

    setTimeout(() => {
      // Save inquiry to localStorage demo store for admin dashboard viewing
      try {
        const inquiries = JSON.parse(localStorage.getItem('shieldora_inquiries') || '[]');
        inquiries.unshift({
          id: 'INQ-' + Date.now().toString().slice(-4),
          fullName,
          email,
          phone: phone || 'N/A',
          company: company || 'N/A',
          insuranceType: insuranceType || 'General Property Risk',
          message,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: 'Unread'
        });
        localStorage.setItem('shieldora_inquiries', JSON.stringify(inquiries));
      } catch (err) {
        console.warn(err);
      }

      btn.disabled = false;
      btn.innerHTML = originalBtn;
      contactForm.reset();

      // Show confirmation modal or toast
      showToast('Your message has been sent to our underwriting advisors. A broker will contact you within 2 business hours.', 'success');

      const successBox = document.getElementById('contact-success-alert');
      if (successBox) {
        successBox.classList.remove('hidden');
        setTimeout(() => successBox.classList.add('hidden'), 8000);
      }
    }, 1200);
  });
}

/* ==========================================
   2. Client & Admin Login Handling
   ========================================== */
function initLoginForm() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  const alertsContainer = document.getElementById('login-alerts-container');

  // Render "Login completed" status card and keep user on login page
  window.renderLoginCompleted = function(user) {
    if (!alertsContainer) return;
    const isClient = user.role !== 'admin';
    const dashUrl = isClient ? 'dashboard-client.html' : 'dashboard-admin.html';
    const dashLabel = isClient ? 'Open Client Dashboard' : 'Open Admin Dashboard';

    alertsContainer.innerHTML = `
      <div id="login-completed-banner" class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-200 transition-all shadow-sm">
        <div class="flex items-start space-x-3">
          <div class="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 text-lg">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2">
              <h3 class="font-bold text-sm text-emerald-900 dark:text-emerald-200">Login completed</h3>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200/60 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">Active</span>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">Welcome back, <strong class="text-slate-900 dark:text-white">${user.name || 'User'}</strong> (<span class="text-slate-500 dark:text-slate-400">${user.company || 'Corporate Client'}</span>). Your session is authenticated.</p>
            
            <div class="mt-3.5 flex flex-wrap items-center gap-2.5">
              <a href="${dashUrl}" class="inline-flex items-center px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-colors">
                <i class="fa-solid fa-gauge-high mr-1.5"></i> ${dashLabel}
              </a>
              <button type="button" onclick="logoutCurrentSession()" class="inline-flex items-center px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors">
                <i class="fa-solid fa-arrow-right-from-bracket mr-1.5"></i> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  // Helper to logout session
  window.logoutCurrentSession = function() {
    localStorage.removeItem('shieldora_auth_user');
    if (alertsContainer) alertsContainer.innerHTML = '';
    loginForm.reset();
    showToast('Signed out of current session.', 'info');
  };

  // Check URL parameters for registration redirect
  const urlParams = new URLSearchParams(window.location.search);
  const isRegisteredParam = urlParams.get('registered');
  const emailParam = urlParams.get('email');

  if (isRegisteredParam && alertsContainer) {
    if (emailParam && loginForm.email) {
      loginForm.email.value = decodeURIComponent(emailParam);
    }
    alertsContainer.innerHTML = `
      <div id="registration-completed-alert" class="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-200 text-xs flex items-center space-x-3 shadow-sm">
        <i class="fa-solid fa-circle-check text-lg text-emerald-600 dark:text-emerald-400 shrink-0"></i>
        <div>
          <div class="font-bold text-emerald-900 dark:text-emerald-200 text-sm">Registration completed!</div>
          <div class="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">Please enter your password below to sign in.</div>
        </div>
      </div>
    `;
    showToast('Registration completed! Please enter your password to sign in.', 'success');
    if (loginForm.password) {
      loginForm.password.focus();
    }
  } else {
    // Check if user already has an active session
    const existingAuth = localStorage.getItem('shieldora_auth_user');
    if (existingAuth) {
      try {
        const parsed = JSON.parse(existingAuth);
        if (parsed && parsed.name) {
          window.renderLoginCompleted(parsed);
          if (loginForm.email && parsed.email) loginForm.email.value = parsed.email;
        }
      } catch (e) {}
    }
  }

  // Demo auto-fill buttons
  const demoClientBtn = document.getElementById('demo-client-login-btn');
  const demoAdminBtn = document.getElementById('demo-admin-login-btn');

  if (demoClientBtn) {
    demoClientBtn.addEventListener('click', () => {
      if (loginForm.email) loginForm.email.value = 'sarah.connor@skylineholdings.com';
      if (loginForm.password) loginForm.password.value = 'Shieldora2026!';
      showToast('Populated Demo Client credentials.', 'info');
    });
  }

  if (demoAdminBtn) {
    demoAdminBtn.addEventListener('click', () => {
      if (loginForm.email) loginForm.email.value = 'admin@shieldora.com';
      if (loginForm.password) loginForm.password.value = 'AdminSecureShield99!';
      showToast('Populated Broker Administrator credentials.', 'info');
    });
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.email?.value.trim().toLowerCase();
    const password = loginForm.password?.value;
    const btn = loginForm.querySelector('button[type="submit"]');

    if (!email || !password) {
      showToast('Please provide your corporate email and password.', 'error');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Authenticating Session...';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket mr-2"></i> Sign In to Portal';

      let userObj;
      if (email.includes('admin')) {
        userObj = { role: 'admin', name: 'Marcus Sterling (Broker)', company: 'Shieldora Brokerage Operations', email };
      } else {
        // Look up custom user if registered
        let customName = 'Sarah Connor';
        let customCompany = 'Skyline Commercial Holdings';
        try {
          const registeredUsers = JSON.parse(localStorage.getItem('shieldora_users') || '[]');
          const found = registeredUsers.find(u => u.email && u.email.toLowerCase() === email);
          if (found) {
            customName = found.fullName || customName;
            customCompany = found.company || customCompany;
          }
        } catch (err) {}

        userObj = { role: 'client', name: customName, company: customCompany, email };
      }

      // Save authenticated session in localStorage
      localStorage.setItem('shieldora_auth_user', JSON.stringify(userObj));

      // Stay on login page only, and show "Login completed" message
      showToast(`Login completed! Welcome back, ${userObj.name}.`, 'success');
      window.renderLoginCompleted(userObj);

    }, 800);
  });
}

/* ==========================================
   3. Client Registration Handling
   ========================================== */
function initRegisterForm() {
  const regForm = document.getElementById('register-form');
  if (!regForm) return;

  // Password match & strength feedback
  const pwd = regForm.password;
  const confirmPwd = regForm.confirmPassword;
  const strengthBar = document.getElementById('password-strength-bar');

  if (pwd && strengthBar) {
    pwd.addEventListener('input', () => {
      const val = pwd.value;
      let strength = 0;
      if (val.length > 7) strength += 30;
      if (/[A-Z]/.test(val)) strength += 25;
      if (/[0-9]/.test(val)) strength += 25;
      if (/[^A-Za-z0-9]/.test(val)) strength += 20;

      strengthBar.style.width = `${strength}%`;
      if (strength < 40) {
        strengthBar.className = 'h-1.5 rounded transition-all bg-rose-500';
      } else if (strength < 75) {
        strengthBar.className = 'h-1.5 rounded transition-all bg-amber-500';
      } else {
        strengthBar.className = 'h-1.5 rounded transition-all bg-emerald-500';
      }
    });
  }

  regForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fullName = regForm.fullName?.value.trim();
    const email = regForm.email?.value.trim();
    const phone = regForm.phone?.value.trim();
    const company = regForm.company?.value.trim();
    const password = regForm.password?.value;
    const confirmPassword = regForm.confirmPassword?.value;
    const agreeTerms = regForm.agreeTerms?.checked;
    const btn = regForm.querySelector('button[type="submit"]');

    if (!fullName || !email || !company || !password) {
      showToast('Please fill out all required company and user fields.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match. Please re-enter.', 'error');
      return;
    }

    if (!agreeTerms) {
      showToast('Please accept the Commercial Brokerage Terms & Privacy Policy.', 'warning');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Creating Corporate Portal Account...';

    setTimeout(() => {
      // Store registered user demo record
      try {
        const users = JSON.parse(localStorage.getItem('shieldora_users') || '[]');
        const existingIdx = users.findIndex(u => u.email && u.email.toLowerCase() === email.toLowerCase());
        const userObj = { fullName, email, phone, company, registeredDate: new Date().toISOString() };
        if (existingIdx >= 0) {
          users[existingIdx] = userObj;
        } else {
          users.push(userObj);
        }
        localStorage.setItem('shieldora_users', JSON.stringify(users));
        localStorage.setItem('shieldora_last_registered', JSON.stringify(userObj));
      } catch (err) {
        console.warn(err);
      }

      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-user-plus mr-2"></i> Register Corporate Account';

      showToast('Registration completed successfully! Redirecting to login page...', 'success');

      // Do NOT go to dashboard. Redirect to login page as requested:
      setTimeout(() => {
        window.location.href = `login.html?registered=true&email=${encodeURIComponent(email)}`;
      }, 900);
    }, 1100);
  });
}

/* ==========================================
   4. Newsletter Subscriptions
   ========================================== */
function initNewsletterForms() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (!input || !input.value.trim()) return;

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-check"></i>';

      showToast(`Thank you! ${input.value.trim()} has been subscribed to Commercial Risk Intelligence.`, 'success');
      input.value = '';

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalText;
      }, 2000);
    });
  });
}

/* ==========================================
   5. Password Show / Hide Toggle
   ========================================== */
function initPasswordToggles() {
  document.querySelectorAll('.password-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      const icon = btn.querySelector('i');
      if (input.type === 'password') {
        input.type = 'text';
        if (icon) {
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        }
      } else {
        input.type = 'password';
        if (icon) {
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      }
    });
  });
}
