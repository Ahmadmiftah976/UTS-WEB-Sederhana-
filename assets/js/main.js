/* ============================================================
   main.js – Shared utilities untuk semua halaman LaporKi'
   ============================================================ */

$(function () {
  // ── Navbar scroll effect ──
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 40) {
      $('#mainNav').addClass('scrolled');
    } else {
      $('#mainNav').removeClass('scrolled');
    }
  });

  // ── Scroll-reveal (fade-up) ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $(entry.target).addClass('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // ── Animate stat counters (landing page only) ──
  animateCounter('countTotal',   347);
  animateCounter('countSelesai', 219);
  animateCounter('countProses',  84);
  animateCounter('countPelapor', 1203);
});

// ── Counter animation ──
function animateCounter(id, target) {
  const $el = $('#' + id);
  if (!$el.length) return;
  let current = 0;
  const duration = 1800;
  const step = Math.ceil(target / (duration / 20));
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    $el.text(current.toLocaleString('id-ID'));
    if (current >= target) clearInterval(timer);
  }, 20);
}

// ── Toast notification ──
function showToast(message, type = 'info') {
  const icons = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', warning: 'bi-exclamation-triangle-fill', info: 'bi-info-circle-fill' };
  const colors = { success: '#16a34a', error: '#dc2626', warning: '#d97706', info: '#1a56db' };
  const id = 'toast_' + Date.now();
  const html = `
    <div class="toast-custom ${type}" id="${id}">
      <i class="bi ${icons[type] || icons.info}" style="color:${colors[type]};font-size:1.1rem;flex-shrink:0;"></i>
      <span>${message}</span>
      <button onclick="$('#${id}').remove()" style="background:none;border:none;margin-left:auto;cursor:pointer;color:var(--text-light);font-size:.9rem;padding:0;">
        <i class="bi bi-x"></i>
      </button>
    </div>`;
  $('#toastContainer').append(html);
  setTimeout(() => {
    $('#' + id).css({ animation: 'slideOut .3s ease forwards' });
    setTimeout(() => $('#' + id).remove(), 320);
  }, 3800);
}

// ── Format tanggal ──
function formatTanggal(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Badge status HTML ──
function badgeStatus(status) {
  const map = {
    'Menunggu': 'badge-menunggu',
    'Diproses': 'badge-diproses',
    'Selesai' : 'badge-selesai',
    'Ditolak' : 'badge-ditolak'
  };
  const icons = { 'Menunggu': 'bi-hourglass-split', 'Diproses': 'bi-arrow-repeat', 'Selesai': 'bi-check2-all', 'Ditolak': 'bi-x-circle' };
  const cls = map[status] || 'badge-menunggu';
  const icon = icons[status] || 'bi-hourglass-split';
  return `<span class="badge-status ${cls}"><i class="bi ${icon}"></i>${status}</span>`;
}
