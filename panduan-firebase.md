# Panduan Firebase untuk Aplikasi Pustaka

Panduan ini membuat data perpustakaan tersimpan online dan bisa dipakai bersama beberapa petugas. Paket gratis Firebase (Spark) umumnya cukup untuk satu sekolah. Batas paket bisa berubah, jadi cek halaman harga Firebase.

Tanpa Firebase, aplikasi tetap jalan, tetapi data hanya tersimpan di peramban perangkat yang dipakai.

## 1. Buat proyek Firebase

1. Buka https://console.firebase.google.com lalu klik **Add project**.
2. Beri nama, misalnya `perpustakaan-sekolah-anda`. Google Analytics boleh dimatikan.

## 2. Daftarkan aplikasi web dan salin konfigurasi

1. Klik ikon roda gigi, lalu **Project settings**, tab **General**.
2. Gulir ke kotak **Your apps**, klik ikon web `</>`.
3. Isi App nickname `pustaka`. Jangan centang Firebase Hosting. Klik **Register app**.
4. Salin isi `firebaseConfig`: `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`.
5. Jika layar sudah tertutup: Project settings, Your apps, pilih aplikasi web, bagian **SDK setup and configuration**, pilih **Config**.

## 3. Isi konfigurasi di firebase-config.js

Buka `firebase-config.js` dengan Notepad, isi nilainya, simpan:

```js
window.PUSTAKA_FIREBASE = {
  apiKey: "...",
  authDomain: "...firebaseapp.com",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

Konfigurasi ada di file terpisah supaya **tidak hilang saat `index.html` diperbarui**. Saat memperbarui aplikasi, jangan timpa `firebase-config.js` yang sudah Anda isi.

Cara cepat: jika layar masuk menampilkan "Hubungkan Firebase", tempel isi `firebaseConfig` di sana. Cara ini hanya berlaku di peramban itu, jadi tetap isi `firebase-config.js` agar semua perangkat langsung memakai login email.

Kunci web Firebase memang tertanam di halaman web, jadi aman dibagikan. Keamanan dijaga oleh aturan Firestore dan login petugas.

## 4. Aktifkan login petugas

1. Menu **Authentication**, klik **Get started**, tab **Sign-in method**, aktifkan **Email/Password**.
2. Tab **Users**, klik **Add user**, buat akun petugas (email dan kata sandi minimal 6 karakter).
3. Menu **Settings**, **Authorized domains**, tambahkan `namaanda.github.io`. Tanpa ini login gagal dengan pesan `unauthorized-domain`.

## 5. Buat database Firestore

1. Menu **Firestore Database**, klik **Create database**, pilih mode produksi dan lokasi terdekat (misalnya `asia-southeast2` Jakarta).
2. Buka tab **Rules**, ganti isinya dengan kode berikut, lalu klik **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Aturan ini hanya mengizinkan petugas yang sudah login.

## 6. Pasang di GitHub Pages

1. Buat repositori di GitHub, unggah semua file paket: `index.html`, `firebase-config.js`, `manifest.json`, `sw.js`, dan keempat file ikon (`icon-192.png`, `icon-512.png`, `maskable-512.png`, `apple-touch-icon.png`). Semuanya di folder utama yang sama.
2. **Settings**, **Pages**, pilih **Deploy from a branch**, cabang `main`, folder `/ (root)`, **Save**.
3. Tunggu 1–2 menit. Alamatnya biasanya `https://namaanda.github.io/namarepo/`.

Repositori gratis harus publik agar Pages aktif. Data siswa tidak ikut terunggah karena tersimpan di Firebase. Jangan unggah file cadangan (JSON) ke repositori.

## 7. Mulai memakai

1. Buka alamat aplikasi, masuk dengan akun petugas tadi.
2. Menu **Admin**: ubah identitas sekolah, unggah logo, dan isi **Email akun login** pada petugas agar namanya tampil di Riwayat.
3. Menu **Impor Data**: unduh template, isi dengan Excel, lalu unggah. Urutan yang disarankan: Kelas, Kategori, Buku, Anggota, Peminjaman. Coba dulu dengan beberapa baris.

## Pasang di HP

- Android (Chrome): ketuk **Pasang di HP** di menu samping, atau menu titik tiga lalu **Pasang aplikasi**.
- iPhone (Safari): ketuk **Bagikan**, lalu **Tambah ke Layar Utama**.
- Jika tombol pasang tidak jalan, buka Admin lalu **Pemeriksaan pemasangan** untuk melihat file yang belum terunggah.

## Masalah umum

| Pesan | Penyebab |
|---|---|
| Akses ditolak | Aturan Firestore belum di-Publish, atau Email/Password belum aktif |
| unauthorized-domain | Domain GitHub Pages belum ada di Authorized domains |
| Email atau kata sandi salah | Akun petugas belum dibuat di Authentication, Users |

## Catatan versi dengan kunjungan, cacah ulang, dan kesiapan akreditasi

- Tidak perlu mengubah aturan Firestore. Koleksi baru (`kunjungan`, `cacah`) tercakup aturan yang sudah ada.
- Kunjungan disimpan satu dokumen per hari agar hemat kuota baca. Aplikasi memuat 400 hari terakhir.
- Saat memperbarui dari versi lama, unggah ulang semua file paket (terutama `index.html` dan `sw.js`), lalu tutup dan buka aplikasi dua kali.
- Buku lama belum punya jenis koleksi. Pakai tombol **Ubah Massal** di Data Buku (filter "Jenis belum diisi") atau impor ulang dengan opsi Perbarui.

## Catatan versi dengan guru, kenaikan kelas, WhatsApp, label, dan katalog

- Tidak ada pengaturan Firebase tambahan. Unggah ulang semua file paket.
- Katalog (OPAC) ada di dalam aplikasi, jadi perlu login. Untuk siswa, buka aplikasi di komputer perpustakaan yang sudah login lalu pakai tombol Layar penuh.
- Sebelum kenaikan kelas, unduh cadangan di menu Admin.

## Catatan versi dengan kegiatan literasi, survei, dan berkas akreditasi

- Tidak perlu mengubah aturan Firestore.
- Foto kegiatan dikecilkan otomatis (maksimal 3 per kegiatan). Berkas akreditasi hanya mencatat nama, lokasi simpan, dan tautan; file aslinya tetap di map atau Google Drive.
