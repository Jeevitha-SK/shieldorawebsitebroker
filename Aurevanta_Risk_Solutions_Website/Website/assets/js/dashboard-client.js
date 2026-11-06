/**
 * Shieldora Risk Solutions - Commercial Property Insurance Broker
 * Client Dashboard Engine (Tabs, Charts, Policies, Quote Compare, Claims, Documents)
 */

document.addEventListener('DOMContentLoaded', () => {
  initClientDashboard();
});

function initClientDashboard() {
  initTabNavigation();
  initSidebarToggle();
  initClientCharts();
  initQuoteComparison();
  initClaimsManagement();
  initDocumentViewer();
  loadClientAuth();
}

/* ==========================================
   1. Tab Navigation
   ========================================== */
function initTabNavigation() {
  const navLinks = document.querySelectorAll('.dashboard-nav-item');
  const sections = document.querySelectorAll('.dashboard-section');

  function switchTab(tabId) {
    sections.forEach(sec => {
      if (sec.id === `section-${tabId}`) {
        sec.classList.remove('hidden');
      } else {
        sec.classList.add('hidden');
      }
    });

    navLinks.forEach(link => {
      const linkTab = link.getAttribute('data-tab');
      if (linkTab === tabId) {
        link.classList.add('bg-amber-500/15', 'text-amber-500', 'font-semibold');
        link.classList.remove('text-slate-400', 'hover:bg-slate-800');
      } else {
        link.classList.remove('bg-amber-500/15', 'text-amber-500', 'font-semibold');
        link.classList.add('text-slate-400', 'hover:bg-slate-800');
      }
    });

    // Update URL hash without scroll
    history.replaceState(null, null, `#${tabId}`);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.getAttribute('data-tab');
      if (tabId) switchTab(tabId);
      // Close mobile sidebar if open
      const sidebar = document.getElementById('dashboard-sidebar');
      if (sidebar && window.innerWidth < 1024) {
        sidebar.classList.add('-translate-x-full');
      }
    });
  });

  // Check initial hash
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && document.getElementById(`section-${initialHash}`)) {
    switchTab(initialHash);
  } else {
    switchTab('overview');
  }

  // Bind direct tab jump buttons (e.g. from Overview cards)
  document.querySelectorAll('[data-jump-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-jump-tab');
      if (target) switchTab(target);
    });
  });
}

/* ==========================================
   2. Responsive Sidebar Toggle
   ========================================== */
function initSidebarToggle() {
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const sidebar = document.getElementById('dashboard-sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (!toggleBtn || !sidebar) return;

  const toggle = () => {
    const isOpen = sidebar.classList.contains('sidebar-open');
    if (!isOpen) {
      sidebar.classList.add('sidebar-open');
      sidebar.classList.remove('-translate-x-full');
      if (overlay) overlay.classList.remove('hidden');
    } else {
      sidebar.classList.remove('sidebar-open');
      sidebar.classList.add('-translate-x-full');
      if (overlay) overlay.classList.add('hidden');
    }
  };

  const closeSidebar = () => {
    sidebar.classList.remove('sidebar-open');
    sidebar.classList.add('-translate-x-full');
    if (overlay) overlay.classList.add('hidden');
  };

  toggleBtn.addEventListener('click', toggle);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  // Close sidebar on tab item click on mobile
  document.querySelectorAll('.dashboard-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth < 1024) closeSidebar();
    });
  });
}

/* ==========================================
   3. Charts Initialization (Chart.js)
   ========================================== */
let clientCoverageChart = null;
let clientClaimsChart = null;

function initClientCharts() {
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? '#334155' : '#E2E8F0';

  // Coverage Distribution Doughnut
  const coverageCtx = document.getElementById('client-coverage-chart')?.getContext('2d');
  if (coverageCtx) {
    if (clientCoverageChart) clientCoverageChart.destroy();
    clientCoverageChart = new Chart(coverageCtx, {
      type: 'doughnut',
      data: {
        labels: ['Commercial Building ($45M)', 'General Liability ($5M)', 'Business Income ($12M)', 'Equipment & Machinery ($4M)'],
        datasets: [{
          data: [45, 5, 12, 4],
          backgroundColor: ['#0A192F', '#D97706', '#2563EB', '#10B981'],
          borderWidth: 2,
          borderColor: isDark ? '#1E293B' : '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: textColor, boxWidth: 12, padding: 15, font: { family: 'Plus Jakarta Sans', size: 11 } }
          }
        },
        cutout: '70%'
      }
    });
  }

  // Monthly Premium & Claims Bar Chart
  const claimsCtx = document.getElementById('client-claims-chart')?.getContext('2d');
  if (claimsCtx) {
    if (clientClaimsChart) clientClaimsChart.destroy();
    clientClaimsChart = new Chart(claimsCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [
          {
            label: 'Premium Paid ($k)',
            data: [12.4, 12.4, 12.4, 12.4, 12.4, 12.4, 12.4, 12.4, 12.4, 12.4],
            backgroundColor: '#0A192F',
            borderRadius: 4
          },
          {
            label: 'Claim Payouts ($k)',
            data: [0, 0, 45, 0, 0, 18, 0, 0, 0, 0],
            backgroundColor: '#D97706',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false }, ticks: { color: textColor } },
          y: { grid: { color: gridColor }, ticks: { color: textColor } }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 12 } }
          }
        }
      }
    });
  }

  // Update on theme change
  window.addEventListener('themeChanged', () => {
    setTimeout(initClientCharts, 200);
  });
}

/* ==========================================
   4. Quote Comparison Engine
   ========================================== */
function initQuoteComparison() {
  const bindButtons = document.querySelectorAll('.bind-quote-btn');
  bindButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const carrier = btn.getAttribute('data-carrier') || 'Chubb';
      const quoteId = btn.getAttribute('data-quote-id') || 'Q-9812';
      
      const confirmModal = confirm(`Bind Policy with ${carrier} (${quoteId})?\n\nThis will initiate binding documents and notify your dedicated Shieldora underwriter.`);
      if (confirmModal) {
        showToast(`Binding request submitted for ${carrier} (${quoteId})! Your broker is finalizing carrier contracts.`, 'success');
      }
    });
  });

  const advisorReviewBtn = document.getElementById('request-advisor-review-btn');
  if (advisorReviewBtn) {
    advisorReviewBtn.addEventListener('click', () => {
      showToast('Advisor review scheduled. Senior Broker Marcus Sterling will call you within 1 business hour.', 'info');
    });
  }

  // Highlight Differences Toggle
  const diffToggle = document.getElementById('highlight-quote-diffs-toggle');
  if (diffToggle) {
    diffToggle.addEventListener('change', (e) => {
      const diffRows = document.querySelectorAll('.quote-diff-highlight');
      diffRows.forEach(row => {
        if (e.target.checked) {
          row.classList.add('bg-amber-500/10', 'font-semibold');
        } else {
          row.classList.remove('bg-amber-500/10', 'font-semibold');
        }
      });
    });
  }
}

/* ==========================================
   5. Claims Management & Interactive Tracking
   ========================================== */
function initClaimsManagement() {
  // Claim filter tabs
  const claimFilterBtns = document.querySelectorAll('.claim-filter-btn');
  const claimCards = document.querySelectorAll('.claim-record-item');

  claimFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      claimFilterBtns.forEach(b => {
        b.classList.remove('bg-amber-500', 'text-white');
        b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
      });
      btn.classList.add('bg-amber-500', 'text-white');
      btn.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');

      const filter = btn.getAttribute('data-filter') || 'all';
      claimCards.forEach(card => {
        const status = card.getAttribute('data-status') || '';
        if (filter === 'all' || status.toLowerCase().includes(filter.toLowerCase())) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Interactive File Claim Modal
  const fileClaimBtn = document.getElementById('open-file-claim-modal');
  const modal = document.getElementById('file-claim-modal');
  const closeBtn = document.getElementById('close-file-claim-modal');
  const claimForm = document.getElementById('file-claim-form');

  if (fileClaimBtn && modal) {
    fileClaimBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    });
  }

  if (claimForm) {
    claimForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const claimBtn = claimForm.querySelector('button[type="submit"]');
      const original = claimBtn.innerHTML;
      claimBtn.disabled = true;
      claimBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Submitting Claim to Carrier...';

      setTimeout(() => {
        claimBtn.disabled = false;
        claimBtn.innerHTML = original;
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        claimForm.reset();
        showToast('Claim Successfully Lodged! Claim Ref: CLM-2026-9042 assigned. Dedicated adjuster notified.', 'success');
      }, 1500);
    });
  }
}

/* ==========================================
   6. Document Sample Viewer Modal
   ========================================== */
function initDocumentViewer() {
  const viewerModal = document.getElementById('doc-viewer-modal');
  const closeBtn = document.getElementById('close-doc-viewer-modal');
  const docTitle = document.getElementById('doc-viewer-title');
  const docPolicy = document.getElementById('doc-viewer-policy');
  const docContent = document.getElementById('doc-viewer-preview-content');

  let currentModalDocName = 'Policy Declaration Binder';
  let currentModalPolicy = 'SHLD-2024-NY-891';

  document.querySelectorAll('[data-preview-doc]').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-doc-name') || 'Policy Declaration';
      const policy = btn.getAttribute('data-doc-policy') || 'SHLD-2024-NY-891';
      currentModalDocName = name;
      currentModalPolicy = policy;
      
      if (docTitle) docTitle.textContent = name;
      if (docPolicy) docPolicy.textContent = `Policy Ref: ${policy}`;
      if (docContent) {
        docContent.innerHTML = `
          <div class="p-8 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200">
            <div class="border-b-2 border-slate-900 dark:border-slate-100 pb-4 mb-6 flex justify-between items-start">
              <div>
                <h1 class="text-lg font-bold uppercase tracking-wider text-slate-900 dark:text-white">SHIELDORA RISK SOLUTIONS</h1>
                <p class="text-slate-500">Commercial Property Insurance Brokerage Declaration</p>
                <p class="text-slate-500">Authorized Brokerage ID: BRK-889102-NY</p>
              </div>
              <div class="text-right">
                <span class="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded">OFFICIAL VERIFIED POLICY</span>
                <p class="mt-2 text-slate-500">Date Issued: Oct 12, 2026</p>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-6 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-lg">
              <div>
                <p class="font-bold text-slate-500 uppercase">NAMED INSURED:</p>
                <p class="font-bold text-slate-900 dark:text-white">Skyline Commercial Holdings LLC</p>
                <p>Attn: Sarah Connor, COO</p>
                <p>350 5th Avenue, Suite 4400, New York, NY</p>
              </div>
              <div>
                <p class="font-bold text-slate-500 uppercase">POLICY TERM:</p>
                <p>Effective: Jan 01, 2026</p>
                <p>Expiration: Jan 01, 2027 (12:01 AM Standard Time)</p>
                <p class="font-bold text-slate-900 dark:text-white">Policy Number: ${policy}</p>
              </div>
            </div>

            <h3 class="font-bold text-slate-900 dark:text-white uppercase mb-2">COVERAGE SUMMARY & SCHEDULE OF LIMITS</h3>
            <table class="w-full text-left border-collapse mb-6">
              <thead>
                <tr class="border-b border-slate-300 dark:border-slate-700 text-slate-500">
                  <th class="py-2">COVERED LOCATION</th>
                  <th class="py-2">PERIL TYPE</th>
                  <th class="py-2">LIMIT OF INSURANCE</th>
                  <th class="py-2">DEDUCTIBLE</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
                <tr>
                  <td class="py-2">Midtown Executive Tower (42 Stories)</td>
                  <td class="py-2">Special Form - All Risk</td>
                  <td class="py-2 font-bold text-slate-900 dark:text-white">$25,000,000</td>
                  <td class="py-2">$25,000</td>
                </tr>
                <tr>
                  <td class="py-2">Business Income & Extra Expense</td>
                  <td class="py-2">Actual Loss Sustained (18 Mo)</td>
                  <td class="py-2 font-bold text-slate-900 dark:text-white">$6,000,000</td>
                  <td class="py-2">72-Hour Waiting Period</td>
                </tr>
                <tr>
                  <td class="py-2">Flood & Earthquake Endorsement</td>
                  <td class="py-2">Sub-limit</td>
                  <td class="py-2 font-bold text-slate-900 dark:text-white">$5,000,000</td>
                  <td class="py-2">2% / $50,000 min</td>
                </tr>
              </tbody>
            </table>

            <div class="border-t border-slate-200 dark:border-slate-800 pt-4 flex justify-between items-center text-slate-500 text-[11px]">
              <p>Underwritten by Chubb Underwriting Syndicate A+ Superior</p>
              <p>Countersigned by: Marcus Sterling, CPCU</p>
            </div>
          </div>
        `;
      }

      if (viewerModal) {
        viewerModal.classList.remove('hidden');
        viewerModal.classList.add('flex');
      }
    });
  });

  if (closeBtn && viewerModal) {
    closeBtn.addEventListener('click', () => {
      viewerModal.classList.add('hidden');
      viewerModal.classList.remove('flex');
    });
  }

  // Modal download button action
  const modalDownloadBtn = document.getElementById('doc-modal-download-btn');
  if (modalDownloadBtn) {
    modalDownloadBtn.addEventListener('click', () => {
      triggerDownloadDocument(currentModalDocName, currentModalPolicy);
      if (viewerModal) {
        viewerModal.classList.add('hidden');
        viewerModal.classList.remove('flex');
      }
    });
  }

  // Functional download action for all document cards
  document.querySelectorAll('[data-download-doc]').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-doc-name') || 'Policy Document';
      const policy = btn.getAttribute('data-doc-policy') || 'SHLD-2024-NY-891';
      triggerDownloadDocument(name, policy);
    });
  });
}

/**
 * Generates a valid %PDF-1.4 binary file Blob representing the certified policy/COI sample
 */
function generateSamplePDFBlob(docTitle, policyRef) {
  const title = (docTitle || 'SHIELDORA RISK SOLUTIONS - CERTIFICATE OF INSURANCE').toUpperCase();
  const policy = policyRef || 'SHLD-2024-NY-891';
  const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const escapePdf = (s) => (s || '').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

  const lines = [
    '================================================================================',
    'SHIELDORA RISK SOLUTIONS - COMMERCIAL PROPERTY INSURANCE BROKERAGE',
    `POLICY REFERENCE: ${policy} | DATE ISSUED: ${now}`,
    '================================================================================',
    '',
    '1. NAMED INSURED & LOCATION SCHEDULE',
    'Named Insured:      Skyline Commercial Holdings LLC (Sarah Connor, COO)',
    'Corporate Address:  350 Fifth Avenue, Suite 4400, New York, NY 10118',
    'Premises Covered:   Midtown Executive Tower (42 Stories, Class A Commercial)',
    'Property Location:  452 Lexington Avenue, New York, NY 10017',
    'Construction Type:  Modified Fire Resistive (ISO Class 6) | 100% Sprinklered',
    '',
    '2. SCHEDULE OF COVERAGES & LIMITS',
    'Building Structure / Real Property:   $25,000,000   (Deductible: $25,000)',
    'Business Personal Property (BPP):     $3,500,000    (Deductible: $10,000)',
    'Business Income & Extra Expense:      $6,000,000    (18-Mo ALS, 72-Hr Waiting)',
    'Ordinance or Law (A, B & C):          $5,000,000    (Included in Base Form)',
    'Windstorm & Named Hurricane:          $25,000,000   (2% / $50,000 Minimum)',
    'Flood & Earth Movement Endorsement:   $5,000,000    (Sub-limit, $50k Deductible)',
    'Commercial General Liability:         $2,000,000    ($4,000,000 Aggregate)',
    'Commercial Excess / Umbrella:         $15,000,000   ($10,000 SIR)',
    '',
    '3. SPECIAL CONDITIONS & POLICY ENDORSEMENTS',
    '- Coinsurance Clause: Suspended (100% Agreed Value Endorsement in Effect)',
    '- Valuation Clause: Guaranteed Replacement Cost without depreciation deduction',
    '- Certificate Holder / Loss Payee: JP Morgan Chase Real Estate Finance (ATIMA)',
    '- Cancellation Notice: 60-Day Prior Written Notice to Certificate Holder',
    '',
    '4. BROKER CERTIFICATION & DISCLAIMER',
    'This certified sample document confirms insurance coverage bound through Shieldora.',
    'Senior Vice President: Marcus Sterling, CPCU, ARM (Direct: +1 800-555-0199)',
    'Email: client-services@shieldora.com | 350 Fifth Ave, New York, NY 10118',
    '================================================================================'
  ];

  let stream = `BT /F2 12 Tf 40 750 Td (${escapePdf(title)}) Tj ET\n`;
  let y = 730;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) {
      y -= 8;
      continue;
    }
    const isBold = line.startsWith('===') || line.startsWith('---') || /^[0-9]\./.test(line);
    const font = isBold ? '/F2' : '/F1';
    stream += `BT ${font} 8 Tf 40 ${y} Td (${escapePdf(line)}) Tj ET\n`;
    y -= 11;
    if (y < 30) break;
  }

  const enc = new TextEncoder();
  const streamBytes = enc.encode(stream);
  const streamLen = streamBytes.length;

  const header = '%PDF-1.4\n';
  const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  const obj3 = '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n';
  const obj4 = '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>\nendobj\n';
  const obj5 = '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold >>\nendobj\n';
  const obj6Header = `6 0 obj\n<< /Length ${streamLen} >>\nstream\n`;
  const obj6Footer = '\nendstream\nendobj\n';

  const bHeader = enc.encode(header);
  const bObj1 = enc.encode(obj1);
  const bObj2 = enc.encode(obj2);
  const bObj3 = enc.encode(obj3);
  const bObj4 = enc.encode(obj4);
  const bObj5 = enc.encode(obj5);
  const bObj6H = enc.encode(obj6Header);
  const bObj6F = enc.encode(obj6Footer);

  let offset = bHeader.length;
  const offsets = [0];
  offsets.push(offset); offset += bObj1.length;
  offsets.push(offset); offset += bObj2.length;
  offsets.push(offset); offset += bObj3.length;
  offsets.push(offset); offset += bObj4.length;
  offsets.push(offset); offset += bObj5.length;
  offsets.push(offset); offset += bObj6H.length + streamBytes.length + bObj6F.length;

  const startxref = offset;
  let xref = 'xref\n0 7\n0000000000 65535 f \n';
  for (let i = 1; i <= 6; i++) {
    xref += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  }
  const trailer = `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`;
  const bXref = enc.encode(xref);
  const bTrailer = enc.encode(trailer);

  const totalLength = offset + bXref.length + bTrailer.length;
  const fullBytes = new Uint8Array(totalLength);

  let pos = 0;
  const append = (chunk) => {
    fullBytes.set(chunk, pos);
    pos += chunk.length;
  };

  append(bHeader);
  append(bObj1);
  append(bObj2);
  append(bObj3);
  append(bObj4);
  append(bObj5);
  append(bObj6H);
  append(streamBytes);
  append(bObj6F);
  append(bXref);
  append(bTrailer);

  return new Blob([fullBytes], { type: 'application/pdf' });
}

/**
 * Triggers authentic browser file download for sample certificates & binders
 */
function triggerDownloadDocument(docName, policyRef) {
  const name = (docName || 'Shieldora-Policy-Document').trim();
  const cleanFilename = name.replace(/[^a-zA-Z0-9_-]/g, '_');
  const policy = policyRef || 'SHLD-2024-NY-891';

  try {
    const pdfBlob = generateSamplePDFBlob(name, policy);
    const url = window.URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cleanFilename}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    if (typeof showToast === 'function') {
      showToast(`Sample document "${cleanFilename}.pdf" downloaded successfully.`, 'success');
    }
  } catch (err) {
    console.error('PDF generation error, fallback to text:', err);
    const fallbackContent = `SHIELDORA RISK SOLUTIONS - CERTIFIED SAMPLE DOCUMENT\nTitle: ${name}\nPolicy: ${policy}\nInsured: Skyline Commercial Holdings LLC\nLimits: $25,000,000 Property / $15,000,000 Excess\nBroker: Marcus Sterling, CPCU`;
    const textBlob = new Blob([fallbackContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(textBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cleanFilename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    if (typeof showToast === 'function') {
      showToast(`Sample document "${cleanFilename}.txt" downloaded.`, 'success');
    }
  }
}

// Expose globally for inline buttons and modals
window.triggerDownloadDocument = triggerDownloadDocument;

/* ==========================================
   7. Load Authenticated Client Info
   ========================================== */
function loadClientAuth() {
  const authUserStr = localStorage.getItem('shieldora_auth_user');
  if (!authUserStr) return;

  try {
    const user = JSON.parse(authUserStr);
    const nameEl = document.getElementById('client-name-display');
    const compEl = document.getElementById('client-company-display');
    if (nameEl && user.name) nameEl.textContent = user.name;
    if (compEl && user.company) compEl.textContent = user.company;
  } catch (e) {
    console.error(e);
  }
}
