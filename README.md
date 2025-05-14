# SheetDB Validator & Updater

Aplikasi ini memungkinkan Anda untuk memvalidasi dan memperbarui data pada SheetDB secara otomatis. Data yang diinput akan diperiksa, diproses, dan kemudian diperbarui di SheetDB jika valid. Aplikasi ini juga mendukung validasi tanggal, memastikan bahwa data yang diproses sesuai dengan persyaratan yang ditetapkan.

## Fitur

- Validasi data input berdasarkan jumlah kolom dan format tanggal.
- Menyaring data yang tidak valid.
- Pembaruan status dan ID Valins di SheetDB secara otomatis.
- Menampilkan toast untuk memberi tahu pengguna tentang hasil proses.
- Menyediakan UI yang bersih dan responsif dengan Tailwind CSS.

## Tipe Teks yang Harus Dimasukkan

Agar aplikasi dapat memproses data dengan benar, pastikan data yang dimasukkan dalam format berikut:

1. **Data Input Format:**
   - Setiap baris data harus dipisahkan dengan baris baru (line break).
   - Setiap kolom dalam satu baris harus dipisahkan dengan spasi atau tab.
   - Pastikan ada minimal 10 kolom per baris. Kolom-kolom ini seharusnya berisi data sebagai berikut:
     - **Kolom 1:** Data lainnya (kolom ini tidak divalidasi)
     - **Kolom 2:** **ONU SN** (Serial Number ONU)
     - **Kolom 3:** **Tanggal** (Format: YYYY-MM-DD atau YYYY-MM-DD HH:mm:ss)
     - **Kolom 4:** Data lainnya (kolom ini tidak divalidasi)
     - **Kolom 5:** **Valins ID** (ID yang digunakan untuk identifikasi Valins)

2. **Contoh Format Data:**
- Pada contoh di atas, setiap baris berisi data yang dipisahkan oleh spasi. Kolom 2 adalah **ONU SN** dan kolom 5 adalah **Valins ID**. Kolom 3 berisi **Tanggal** yang akan divalidasi formatnya.

3. **Catatan:**
- Tanggal harus dalam format `YYYY-MM-DD` atau `YYYY-MM-DD HH:mm:ss`. Jika kolom tanggal kosong atau berisi tanda hubung ("-"), data tersebut akan dianggap invalid.
- Data yang kurang dari 10 kolom per baris akan dianggap invalid.

## Prasyarat

- Node.js (versi terbaru) dan npm
- Akun SheetDB dan API endpoint yang telah disiapkan untuk menyimpan dan memproses data.

## Instalasi

1. **Clone repositori ini:**

```bash
git clone https://github.com/username/repository-name.git
cd repository-name
