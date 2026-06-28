# Kasir CafeShop POS

Template web app kasir untuk cafe shop. Aplikasi ini berjalan sebagai website statis dengan data demo dan penyimpanan lokal di browser.

## Fitur

- Menu kasir dengan kategori, pencarian menu, gambar produk, stok, dan keranjang pesanan.
- Pembayaran dengan tunai, QRIS, kartu debit, atau transfer.
- Perhitungan subtotal, diskon, service charge, PPN, total, dan kembalian.
- Struk transaksi yang bisa ditampilkan dan dicetak.
- Rekapan transaksi dengan filter tanggal, metode pembayaran, pencarian, dan export CSV.
- Laporan shift harian untuk buka shift, tutup kasir, total penjualan, tunai, non-tunai, pengeluaran, dan kas akhir sistem.
- Menu admin untuk melihat pendapatan bulanan, menu terlaris, serta CRUD menu.
- Gambar menu bawaan menggunakan aset statis di folder `images/`, sehingga ikut tampil saat deploy ke Vercel.

## Teknologi

- HTML
- CSS
- JavaScript
- LocalStorage
- SVG static assets

## Struktur Project

```text
.
|-- index.html
|-- styles.css
|-- app.js
|-- images/
|   |-- logo.svg
|   |-- espresso.svg
|   |-- latte.svg
|   `-- ...
`-- README.md
```

## Cara Menjalankan Lokal

Cukup buka file `index.html` di browser.

Atau jalankan server statis sederhana:

```bash
npx serve .
```

## Deploy ke Vercel

Project ini bisa langsung di-deploy sebagai static site.

Pengaturan umum:

- Framework preset: `Other`
- Build command: kosongkan
- Output directory: kosongkan atau root project

Karena gambar menu berada di folder `images/`, semua aset tersebut akan ikut ter-deploy dan dapat dilihat semua user.

## Catatan Penyimpanan Data

Versi ini memakai `localStorage`, jadi data transaksi, shift, menu yang ditambahkan, dan upload gambar dari admin hanya tersimpan di browser/perangkat yang sama.

Untuk penggunaan produksi multi-device, data sebaiknya dipindahkan ke database dan object storage seperti Supabase, Firebase, Vercel Postgres, Vercel Blob, atau layanan sejenis.

## Lisensi

Project ini bebas digunakan dan dikembangkan sesuai kebutuhan.
