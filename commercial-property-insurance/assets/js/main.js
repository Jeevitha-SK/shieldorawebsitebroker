/**
 * Aurevanta Risk Solutions - Commercial Property Insurance Broker
 * Main JavaScript File: assets/js/main.js
 * 
 * Features included:
 * 1. Sticky Navigation Scroll Effect
 * 2. Back-to-Top Button Toggle and Scroll
 * 3. Interactive Quick Premium Estimator
 * 4. Quick Quote Form Submission Modal/Feedback
 * 5. Dynamic Copyright Year
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Sticky Header Effect on Scroll
  // -------------------------------------------------------------------------
  const siteHeader = document.querySelector('.site-header');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', function () {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;

    // Add shadow to header when scrolling down
    if (siteHeader) {
      if (scrollPosition > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Show/hide Back-to-Top button
    if (backToTopBtn) {
      if (scrollPosition > 350) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  });

  // Smooth scroll back to top
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // -------------------------------------------------------------------------
  // 2. Interactive Quick Premium Estimator
  // -------------------------------------------------------------------------
  const propertyTypeSelect = document.getElementById('propertyType');
  const propertyValueSelect = document.getElementById('propertyValue');
  const coverageTierSelect = document.getElementById('coverageTier');
  const calculatedEstimateEl = document.getElementById('calculatedEstimate');
  const deductibleEstimateEl = document.getElementById('deductibleEstimate');

  // Rate multipliers based on commercial property risk profile
  const propertyRates = {
    office: 0.0035,        // Standard commercial office
    retail: 0.0042,        // Retail / Shopping strip
    warehouse: 0.0048,     // Logistics & Warehousing
    industrial: 0.0065,    // Manufacturing / Heavy Industrial
    multifamily: 0.0038    // Multi-tenant Commercial Residential
  };

  const tierMultipliers = {
    standard: 1.0,         // Basic Named Perils
    comprehensive: 1.25,   // Special Form + Business Interruption
    allrisk: 1.45          // All-Risk + Flood & Quake Rider
  };

  function updateEstimate() {
    if (!propertyTypeSelect || !propertyValueSelect || !coverageTierSelect || !calculatedEstimateEl) {
      return;
    }

    const propType = propertyTypeSelect.value;
    const propVal = parseFloat(propertyValueSelect.value);
    const tier = coverageTierSelect.value;

    const baseRate = propertyRates[propType] || 0.004;
    const tierMultiplier = tierMultipliers[tier] || 1.0;

    // Estimated annual premium calculation
    const baseAnnual = propVal * baseRate * tierMultiplier;
    const minRange = Math.round(baseAnnual * 0.9);
    const maxRange = Math.round(baseAnnual * 1.15);

    // Format as currency strings
    calculatedEstimateEl.textContent = `$${minRange.toLocaleString()} - $${maxRange.toLocaleString()}`;

    if (deductibleEstimateEl) {
      // Indicative standard deductible: ~0.5% - 1% of property value or min $5,000
      const deductible = Math.max(5000, Math.round(propVal * 0.005 / 1000) * 1000);
      deductibleEstimateEl.textContent = `Recommended Deductible: $${deductible.toLocaleString()}`;
    }
  }

  // Attach event listeners for real-time recalculation
  if (propertyTypeSelect && propertyValueSelect && coverageTierSelect) {
    propertyTypeSelect.addEventListener('change', updateEstimate);
    propertyValueSelect.addEventListener('change', updateEstimate);
    coverageTierSelect.addEventListener('change', updateEstimate);
    // Initial run on page load
    updateEstimate();
  }

  // -------------------------------------------------------------------------
  // 3. Quick Quote Form Submission Feedback (Front-End Prototype)
  // -------------------------------------------------------------------------
  const quickQuoteForm = document.getElementById('quickQuoteForm');
  const quoteSuccessAlert = document.getElementById('quoteSuccessAlert');

  if (quickQuoteForm) {
    quickQuoteForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Check form validity with Bootstrap validation
      if (!quickQuoteForm.checkValidity()) {
        e.stopPropagation();
        quickQuoteForm.classList.add('was-validated');
        return;
      }

      // Simulate submission loading
      const submitBtn = quickQuoteForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Generating Proposal...';
      }

      setTimeout(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        if (quoteSuccessAlert) {
          quoteSuccessAlert.classList.remove('d-none');
          // Scroll alert into view smoothly
          quoteSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Reset form
        quickQuoteForm.reset();
        quickQuoteForm.classList.remove('was-validated');
        updateEstimate();
      }, 900);
    });
  }

  // -------------------------------------------------------------------------
  // 4. Newsletter Subscription Form Handler
  // -------------------------------------------------------------------------
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailInput = document.getElementById('newsletterEmail');
      if (emailInput && emailInput.value) {
        alert('Thank you for subscribing to our Commercial Risk Bulletin!');
        emailInput.value = '';
      }
    });
  }

  // -------------------------------------------------------------------------
  // 5. Dynamic Current Year in Footer
  // -------------------------------------------------------------------------
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------------------------
  // 6. Bootstrap Tooltips Initialization (if any)
  // -------------------------------------------------------------------------
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    if (window.bootstrap && window.bootstrap.Tooltip) {
      new bootstrap.Tooltip(tooltipTriggerEl);
    }
  });
});
