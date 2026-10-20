/**
 * Shieldora Risk Solutions - Unified Dashboard Engine
 * Powers both Client Portal (dashboard-client.html) and Admin Portal (dashboard-admin.html)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Auto-detect dashboard page
  if (document.getElementById('client-coverage-chart') || document.querySelector('.dashboard-nav-item')) {
    if (typeof initClientDashboard === 'function') {
      initClientDashboard();
    }
  }

  if (document.getElementById('admin-volume-chart') || document.querySelector('.admin-nav-item')) {
    if (typeof initAdminDashboard === 'function') {
      initAdminDashboard();
    }
  }
});
