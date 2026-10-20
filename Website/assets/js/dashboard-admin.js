/**
 * Shieldora Risk Solutions - Commercial Property Insurance Broker
 * Administrative Dashboard Engine (Analytics, Policies, Claims, Inquiries, CMS)
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminDashboard();
});

function initAdminDashboard() {
  initAdminTabs();
  initAdminCharts();
  initQuoteManager();
  initClaimsManager();
  initInquiriesManager();
  initBlogCms();
  initAdminSidebar();
}

/* ==========================================
   1. Admin Tab Navigation
   ========================================== */
function initAdminTabs() {
  const tabs = document.querySelectorAll('.admin-nav-item');
  const sections = document.querySelectorAll('.admin-section');

  function switchTab(tabId) {
    sections.forEach(sec => {
      if (sec.id === `admin-section-${tabId}`) {
        sec.classList.remove('hidden');
      } else {
        sec.classList.add('hidden');
      }
    });

    tabs.forEach(link => {
      const linkTab = link.getAttribute('data-tab');
      if (linkTab === tabId) {
        link.classList.add('bg-amber-500/15', 'text-amber-500', 'font-semibold');
        link.classList.remove('text-slate-400', 'hover:bg-slate-800');
      } else {
        link.classList.remove('bg-amber-500/15', 'text-amber-500', 'font-semibold');
        link.classList.add('text-slate-400', 'hover:bg-slate-800');
      }
    });

    history.replaceState(null, null, `#${tabId}`);
  }

  tabs.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.getAttribute('data-tab');
      if (tabId) switchTab(tabId);
      const sidebar = document.getElementById('admin-sidebar');
      if (sidebar && window.innerWidth < 1024) {
        sidebar.classList.add('-translate-x-full');
      }
    });
  });

  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(`admin-section-${hash}`)) {
    switchTab(hash);
  } else {
    switchTab('overview');
  }

  document.querySelectorAll('[data-admin-jump]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-admin-jump');
      if (target) switchTab(target);
    });
  });
}

function initAdminSidebar() {
  const toggleBtn = document.getElementById('admin-sidebar-toggle');
  const sidebar = document.getElementById('admin-sidebar');
  const overlay = document.getElementById('admin-sidebar-overlay');

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

  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth < 1024) closeSidebar();
    });
  });
}

/* ==========================================
   2. Admin Analytics Charts (Chart.js)
   ========================================== */
let adminVolumeChart = null;
let adminClaimsByPerilChart = null;

function initAdminCharts() {
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? '#334155' : '#E2E8F0';

  // Monthly Quote Requests & Bound Policies
  const volumeCtx = document.getElementById('admin-volume-chart')?.getContext('2d');
  if (volumeCtx) {
    if (adminVolumeChart) adminVolumeChart.destroy();
    adminVolumeChart = new Chart(volumeCtx, {
      type: 'line',
      data: {
        labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [
          {
            label: 'Quote Inquiries',
            data: [120, 145, 178, 192, 210, 248],
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.35,
            borderWidth: 2
          },
          {
            label: 'Policies Bound',
            data: [82, 98, 124, 140, 155, 189],
            borderColor: '#D97706',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.35
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
          legend: { position: 'top', labels: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 12 } } }
        }
      }
    });
  }

  // Claims by Peril Doughnut
  const perilsCtx = document.getElementById('admin-perils-chart')?.getContext('2d');
  if (perilsCtx) {
    if (adminClaimsByPerilChart) adminClaimsByPerilChart.destroy();
    adminClaimsByPerilChart = new Chart(perilsCtx, {
      type: 'doughnut',
      data: {
        labels: ['Water Intrusion / Pipe Burst', 'Fire & Smoke', 'Windstorm & Hail', 'Machinery Breakdown', 'Slip & Fall Liability'],
        datasets: [{
          data: [38, 22, 20, 12, 8],
          backgroundColor: ['#0A192F', '#EF4444', '#3B82F6', '#D97706', '#10B981'],
          borderWidth: 2,
          borderColor: isDark ? '#1E293B' : '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { color: textColor, boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 11 } } }
        },
        cutout: '65%'
      }
    });
  }

  window.addEventListener('themeChanged', () => {
    setTimeout(initAdminCharts, 200);
  });
}

/* ==========================================
   3. Quote Inquiries Management
   ========================================== */
function initQuoteManager() {
  const searchInput = document.getElementById('admin-quote-search');
  const tableRows = document.querySelectorAll('.admin-quote-row');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value.toLowerCase();
      tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(val) ? '' : 'none';
      });
    });
  }

  // Status changer dropdowns
  document.querySelectorAll('.admin-quote-status-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const newStatus = e.target.value;
      showToast(`Quote status updated to "${newStatus}". Notification sent to client.`, 'info');
    });
  });
}

/* ==========================================
   4. Claims Adjudication Manager
   ========================================== */
function initClaimsManager() {
  document.querySelectorAll('.admin-claim-action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      const claimId = btn.getAttribute('data-claim-id');
      if (action === 'approve') {
        showToast(`Claim ${claimId} settlement authorized for payment release.`, 'success');
      } else if (action === 'assign') {
        showToast(`Independent Adjuster assigned to claim ${claimId}.`, 'info');
      }
    });
  });
}

/* ==========================================
   5. Inquiries & Contact Messages
   ========================================== */
function initInquiriesManager() {
  const container = document.getElementById('admin-inquiries-tbody');
  if (!container) return;

  const defaultInquiries = [
    {
      id: 'INQ-1049',
      fullName: 'Jonathan Reed',
      email: 'jreed@beaconlogistics.com',
      company: 'Beacon Logistics Portfolios',
      insuranceType: 'Warehouse & Industrial Property',
      message: 'Looking for a comprehensive property & flood comparison for our 650,000 sq ft distribution hub in Savannah, GA. Current carrier renewal jumped 35%.',
      date: 'Oct 11, 2026',
      status: 'New'
    },
    {
      id: 'INQ-1048',
      fullName: 'Samantha Hayes',
      email: 'shayes@apexrealty.org',
      company: 'Apex Commercial Capital',
      insuranceType: 'Office Tower Portfolio',
      message: 'Need a risk audit for three 20-story corporate towers in downtown Charlotte. We are evaluating deductible buy-back options.',
      date: 'Oct 10, 2026',
      status: 'In Progress'
    },
    {
      id: 'INQ-1045',
      fullName: 'Robert Sterling',
      email: 'rsterling@sterlingmfg.com',
      company: 'Sterling Advanced Technologies',
      insuranceType: 'Machinery & Equipment Breakdown',
      message: 'Requesting specialized boiler and high-voltage transformer breakdown coverage quote with $10M sub-limits.',
      date: 'Oct 08, 2026',
      status: 'Replied'
    }
  ];

  // Merge with any user submitted inquiries from localStorage
  const localInquiries = JSON.parse(localStorage.getItem('shieldora_inquiries') || '[]');
  const allInquiries = [...localInquiries, ...defaultInquiries];

  container.innerHTML = allInquiries.map(item => `
    <tr class="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
      <td class="p-4 font-mono text-xs font-bold text-amber-600 dark:text-amber-400">${item.id}</td>
      <td class="p-4 font-medium text-slate-900 dark:text-white">
        ${item.fullName}
        <div class="text-xs text-slate-400 font-normal">${item.email}</div>
      </td>
      <td class="p-4 text-sm text-slate-600 dark:text-slate-300">${item.company}</td>
      <td class="p-4 text-xs">
        <span class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 font-medium text-slate-700 dark:text-slate-300">
          ${item.insuranceType}
        </span>
      </td>
      <td class="p-4 text-xs text-slate-400">${item.date}</td>
      <td class="p-4">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          item.status === 'New' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
        }">
          ${item.status}
        </span>
      </td>
      <td class="p-4 text-right">
        <button class="text-amber-600 dark:text-amber-400 hover:text-amber-700 font-semibold text-xs py-1 px-3 rounded border border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40" onclick="viewInquiryMessage('${item.fullName}', '${item.company}', '${item.message.replace(/'/g, "\\'")}')">
          View & Reply
        </button>
      </td>
    </tr>
  `).join('');
}

window.viewInquiryMessage = function(name, company, message) {
  const reply = prompt(`Inquiry from: ${name} (${company})\n\nMessage:\n"${message}"\n\nEnter response message to client:`);
  if (reply) {
    showToast(`Reply sent to ${name} via secure brokerage dispatch.`, 'success');
  }
};

/* ==========================================
   6. Blog CMS Simulator
   ========================================== */
function initBlogCms() {
  const createBlogBtn = document.getElementById('admin-new-blog-btn');
  if (createBlogBtn) {
    createBlogBtn.addEventListener('click', () => {
      const title = prompt('Enter New Blog Article Title:');
      if (title) {
        showToast(`Draft article "${title}" published to live blog feed!`, 'success');
      }
    });
  }
}
