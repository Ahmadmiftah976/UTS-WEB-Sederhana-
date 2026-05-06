/* ============================================================
   login.js – Logika halaman login LaporKi' (Masyarakat)
   ============================================================ */

// ── Toggle password visibility ──
function togglePassword() {
  const $input = $('#inputPassword');
  const $icon  = $('#iconEye');
  if ($input.attr('type') === 'password') {
    $input.attr('type', 'text');
    $icon.removeClass('bi-eye').addClass('bi-eye-slash');
  } else {
    $input.attr('type', 'password');
    $icon.removeClass('bi-eye-slash').addClass('bi-eye');
  }
}

// ── Show daftar info ──
function showDaftarInfo(e) {
  e.preventDefault();
  showToast('Fitur pendaftaran online segera hadir. Silakan hubungi kantor kelurahan setempat.', 'info');
}

// ── Dummy credentials masyarakat ──
const dummyAccounts = [
  { email: 'warga@email.com',  password: 'warga123' },
  { email: 'budi@gmail.com',   password: 'budi2024' },
  { email: 'siti@yahoo.com',   password: 'siti2024' }
];

// ── Form validation & submit ──
$(function () {
  $('#loginForm').on('submit', function (e) {
    e.preventDefault();

    const email    = $('#inputEmail').val().trim();
    const password = $('#inputPassword').val().trim();
    let valid = true;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      $('#inputEmail').addClass('is-invalid');
      $('#errEmail').show();
      valid = false;
    } else {
      $('#inputEmail').removeClass('is-invalid');
      $('#errEmail').hide();
    }

    // Validate password
    if (!password) {
      $('#inputPassword').addClass('is-invalid');
      $('#errPassword').show();
      valid = false;
    } else {
      $('#inputPassword').removeClass('is-invalid');
      $('#errPassword').hide();
    }

    if (!valid) return;

    // Loading state
    $('#btnLogin').prop('disabled', true);
    $('#loginIcon').removeClass('bi-box-arrow-in-right').addClass('bi-arrow-repeat');
    $('#loginText').text('Memverifikasi...');

    setTimeout(() => {
      const found = dummyAccounts.find(a => a.email === email && a.password === password);

      if (found) {
        showToast('Login berhasil! Mengalihkan...', 'success');
        setTimeout(() => {
          window.location.href = 'pengaduan.html';
        }, 1200);
      } else {
        showToast('Email atau kata sandi salah. Coba lagi.', 'error');
        $('#btnLogin').prop('disabled', false);
        $('#loginIcon').removeClass('bi-arrow-repeat').addClass('bi-box-arrow-in-right');
        $('#loginText').text('Masuk');
        $('#inputPassword').val('').focus();
      }
    }, 1000);
  });

  // Clear error on input
  $('#inputEmail').on('input', function () {
    $(this).removeClass('is-invalid');
    $('#errEmail').hide();
  });
  $('#inputPassword').on('input', function () {
    $(this).removeClass('is-invalid');
    $('#errPassword').hide();
  });


});
