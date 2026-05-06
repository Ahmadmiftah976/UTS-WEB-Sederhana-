/* ============================================================
   pengaduan.js – Logika halaman pengaduan LaporKi'
   ============================================================ */

// ── Dummy data riwayat laporan ──
const dummyLaporan = [
  { id: 'LK-2024-001', tanggal: '2024-01-05', kategori: 'Infrastruktur',     lokasi: 'Jl. Merdeka No.12',        deskripsi: 'Jalan berlubang besar di depan gang, sudah 3 bulan tidak diperbaiki. Membahayakan pengendara motor.',            status: 'Selesai'   },
  { id: 'LK-2024-002', tanggal: '2024-01-18', kategori: 'Penerangan',        lokasi: 'RT 05 RW 02',               deskripsi: 'Lampu jalan di ujung gang mati sejak sebulan lalu. Lingkungan jadi gelap dan rawan kejahatan di malam hari.', status: 'Diproses'  },
  { id: 'LK-2024-003', tanggal: '2024-02-01', kategori: 'Lingkungan',        lokasi: 'Pasar Lama Blok B',         deskripsi: 'Tumpukan sampah di belakang pasar tidak diangkut lebih dari seminggu. Bau tidak sedap dan mengundang lalat.',  status: 'Menunggu'  },
  { id: 'LK-2024-004', tanggal: '2024-02-14', kategori: 'Pelayanan Publik',  lokasi: 'Kantor Kelurahan Sentosa',  deskripsi: 'Petugas loket KTP tidak hadir padahal jam kerja masih berlangsung. Warga sudah antri sejak pagi.',             status: 'Selesai'   },
  { id: 'LK-2024-005', tanggal: '2024-03-03', kategori: 'Keamanan',          lokasi: 'Perumahan Griya Asri',      deskripsi: 'Beberapa kali terjadi tindak pencurian kendaraan di area perumahan. Perlu penambahan CCTV dan ronda malam.',    status: 'Diproses'  },
  { id: 'LK-2024-006', tanggal: '2024-03-20', kategori: 'Infrastruktur',     lokasi: 'Jembatan Ciawi',            deskripsi: 'Pagar pengaman jembatan rusak dan miring. Berbahaya bagi pejalan kaki, terutama anak-anak sekolah.',           status: 'Menunggu'  },
  { id: 'LK-2024-007', tanggal: '2024-04-08', kategori: 'Kesehatan',         lokasi: 'Posyandu RW 07',            deskripsi: 'Posyandu kekurangan stok vaksin untuk balita. Jadwal imunisasi sudah tertunda 2 minggu.',                       status: 'Ditolak'   },
  { id: 'LK-2024-008', tanggal: '2024-04-22', kategori: 'Lingkungan',        lokasi: 'Sungai Ciliwung Rt.08',     deskripsi: 'Saluran drainase tersumbat menyebabkan banjir kecil saat hujan deras.',                                        status: 'Menunggu'  },
];

const itemsPerPage = 5;
let currentPage   = 1;
let filteredData  = [...dummyLaporan];

// ── Render table riwayat ──
function renderRiwayat() {
  const keyword = $('#searchLaporan').val().toLowerCase().trim();
  const status  = $('#filterStatus').val();

  filteredData = dummyLaporan.filter(item => {
    const matchStatus  = status === 'semua' || item.status === status;
    const matchKeyword = !keyword ||
      item.id.toLowerCase().includes(keyword) ||
      item.kategori.toLowerCase().includes(keyword) ||
      item.lokasi.toLowerCase().includes(keyword);
    return matchStatus && matchKeyword;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * itemsPerPage;
  const paged = filteredData.slice(start, start + itemsPerPage);

  const $body = $('#bodyRiwayat');
  $body.empty();

  if (paged.length === 0) {
    $('#emptyState').show();
    $body.closest('div').find('table').hide();
    $('#infoJumlah').text('');
    $('#paginasiContainer').empty();
    return;
  }

  $('#emptyState').hide();
  $body.closest('div').find('table').show();

  paged.forEach(item => {
    $body.append(`
      <tr>
        <td><span style="font-family:monospace;font-weight:600;color:var(--primary);font-size:.82rem;">${item.id}</span></td>
        <td style="white-space:nowrap;">${formatTanggal(item.tanggal)}</td>
        <td>${item.kategori}</td>
        <td style="max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${item.lokasi}">${item.lokasi}</td>
        <td>${badgeStatus(item.status)}</td>
        <td>
          <button class="btn-outline-custom" style="padding:.3rem .75rem;font-size:.78rem;"
                  onclick="lihatDetail('${item.id}')">
            <i class="bi bi-eye"></i> Detail
          </button>
        </td>
      </tr>`);
  });

  $('#infoJumlah').text(`Menampilkan ${start + 1}–${Math.min(start + itemsPerPage, filteredData.length)} dari ${filteredData.length} laporan`);
  renderPaginasi(totalPages);
}

function renderPaginasi(totalPages) {
  const $container = $('#paginasiContainer');
  $container.empty();
  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const active = i === currentPage
      ? 'background:var(--primary);color:white;border-color:var(--primary);'
      : '';
    $container.append(`
      <button onclick="goPage(${i})"
              style="width:32px;height:32px;border:1.5px solid var(--border);border-radius:6px;background:white;
                     font-size:.82rem;font-weight:600;cursor:pointer;${active}">
        ${i}
      </button>`);
  }
}

function goPage(n) { currentPage = n; renderRiwayat(); }

// ── Detail modal ──
function lihatDetail(id) {
  const item = dummyLaporan.find(l => l.id === id);
  if (!item) return;
  $('#modalDetailLabel').text('Detail Laporan – ' + item.id);
  const fotoHTML = item.foto
    ? `<div>
        <div style="font-size:.75rem;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.5rem;">Foto Bukti</div>
        <img src="${item.foto}" alt="Foto bukti" style="width:100%;border-radius:10px;max-height:220px;object-fit:cover;border:1.5px solid var(--border);" />
      </div>`
    : '';
  $('#modalDetailBody').html(`
    <div style="display:flex;flex-direction:column;gap:1rem;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;">
        <div>
          <div style="font-size:.75rem;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.25rem;">No. Laporan</div>
          <div style="font-weight:700;color:var(--primary);font-family:monospace;">${item.id}</div>
        </div>
        <div>
          <div style="font-size:.75rem;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.25rem;">Tanggal</div>
          <div style="font-weight:600;">${formatTanggal(item.tanggal)}</div>
        </div>
        <div>
          <div style="font-size:.75rem;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.25rem;">Kategori</div>
          <div style="font-weight:600;">${item.kategori}</div>
        </div>
        <div>
          <div style="font-size:.75rem;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.25rem;">Status</div>
          ${badgeStatus(item.status)}
        </div>
      </div>
      <div>
        <div style="font-size:.75rem;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.25rem;">Lokasi</div>
        <div style="font-weight:500;">${item.lokasi}</div>
      </div>
      <div>
        <div style="font-size:.75rem;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.25rem;">Deskripsi</div>
        <p style="color:var(--text);line-height:1.7;margin:0;">${item.deskripsi}</p>
      </div>
      ${fotoHTML}
    </div>`);
  new bootstrap.Modal($('#modalDetail')[0]).show();
}

// ── Form pengaduan ──
function clearFoto() {
  $('#inputFoto').val('');
  $('#previewFoto').hide();
  $('#imgPreview').attr('src', '');
}

$(function () {
  // File upload preview
  $('#inputFoto').on('change', function () {
    const file = this.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran foto maksimal 5 MB.', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      $('#imgPreview').attr('src', e.target.result);
      $('#previewFoto').show();
    };
    reader.readAsDataURL(file);
  });

  // Drag & drop
  $('#uploadArea').on('dragover', function (e) {
    e.preventDefault(); $(this).addClass('dragover');
  }).on('dragleave', function () {
    $(this).removeClass('dragover');
  }).on('drop', function (e) {
    e.preventDefault(); $(this).removeClass('dragover');
    const file = e.originalEvent.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      $('#inputFoto')[0].files = e.originalEvent.dataTransfer.files;
      $('#inputFoto').trigger('change');
    }
  });

  // Char counter
  $('#inputDeskripsi').on('input', function () {
    const len = $(this).val().length;
    $('#charCount').text(len);
    if (len > 500) $(this).val($(this).val().substring(0, 500));
  });

  // Filter & search
  $('#filterStatus, #searchLaporan').on('change input', function () {
    currentPage = 1; renderRiwayat();
  });

  // Form submit
  $('#formPengaduan').on('submit', function (e) {
    e.preventDefault();
    let valid = true;

    const nama      = $('#inputNama').val().trim();
    const kategori  = $('#selectKategori').val();
    const lokasi    = $('#inputLokasi').val().trim();
    const deskripsi = $('#inputDeskripsi').val().trim();

    if (!nama)               { $('#inputNama').addClass('is-invalid');      $('#errNama').show();      valid = false; }
    else                     { $('#inputNama').removeClass('is-invalid');    $('#errNama').hide(); }
    if (!kategori)           { $('#selectKategori').addClass('is-invalid');  $('#errKategori').show();  valid = false; }
    else                     { $('#selectKategori').removeClass('is-invalid');$('#errKategori').hide(); }
    if (!lokasi)             { $('#inputLokasi').addClass('is-invalid');     $('#errLokasi').show();    valid = false; }
    else                     { $('#inputLokasi').removeClass('is-invalid');  $('#errLokasi').hide(); }
    if (deskripsi.length < 20){ $('#inputDeskripsi').addClass('is-invalid'); $('#errDeskripsi').show(); valid = false; }
    else                     { $('#inputDeskripsi').removeClass('is-invalid');$('#errDeskripsi').hide();}

    if (!valid) return;

    // Simulate sending
    $('#btnKirim').prop('disabled', true);
    $('#btnKirimText').text('Mengirim...');

    // Baca foto sebagai base64 (jika ada)
    const fotoFile = $('#inputFoto')[0].files[0];
    const readFoto = fotoFile
      ? new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = e => resolve(e.target.result);
          reader.readAsDataURL(fotoFile);
        })
      : Promise.resolve(null);

    readFoto.then(fotoBase64 => {
      setTimeout(() => {
        // Add to dummy data
        const newId = 'LK-2024-' + String(dummyLaporan.length + 1).padStart(3, '0');
        dummyLaporan.unshift({
          id: newId,
          tanggal: new Date().toISOString().split('T')[0],
          kategori: kategori,
          lokasi: lokasi,
          deskripsi: deskripsi,
          status: 'Menunggu',
          foto: fotoBase64 || null
        });
        renderRiwayat();
        const pesanFoto = fotoBase64 ? ' Foto bukti berhasil dilampirkan.' : '';
        showToast(`Laporan ${newId} berhasil dikirim!${pesanFoto}`, 'success');
        $('#formPengaduan')[0].reset();
        clearFoto();
        $('#charCount').text('0');
        $('#btnKirim').prop('disabled', false);
        $('#btnKirimText').text('Kirim Laporan');
        // Scroll to table
        $('html, body').animate({ scrollTop: $('#tabelRiwayat').offset().top - 100 }, 600);
      }, 1200);
    });
  });

  // Clear errors on input
  $('#inputNama, #inputLokasi, #inputDeskripsi').on('input', function () {
    $(this).removeClass('is-invalid');
    $('#err' + this.id.replace('input', '')).hide();
  });
  $('#selectKategori').on('change', function () {
    $(this).removeClass('is-invalid'); $('#errKategori').hide();
  });

  // Initial render
  renderRiwayat();
});
