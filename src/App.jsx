import { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

function Toast({ message, type = 'success', onClose }) {
  // Auto close setelah 3 detik
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast toast-top toast-center z-50">
      <div className={`alert alert-${type}`}>
        <span>{message}</span>
      </div>
    </div>
  );
}

function App() {
  const [inputData, setInputData] = useState('');
  const [result, setResult] = useState({ valid: [], invalid: [] });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

const showToast = (message, type = 'success') => {
  setToast({ message, type });
};

  const API_BASE = 'https://sheetdb.io/api/v1/fq5jcgo6t69ng';

  const processData = async () => {
    const rows = inputData.trim().split('\n');
    const valid = [];
    const invalid = [];

    for (let row of rows) {
      const columns = row.trim().split(/\s+/);
    
      if (columns.length < 10) {
        invalid.push({ row, reason: 'Kurang dari 10 kolom' });
        continue;
      }
    
      const onuSN = columns[1]; // ONU SN
      const date = columns[2];
      const valinsID = columns[4]; // ID VALINS
    
      if (!onuSN || !valinsID || date === '-') {
        invalid.push({ row, reason: 'Data kosong atau tanggal invalid' });
        continue;
      }
    
      console.log(`Input Tanggal: ${date}`);
    
      // Menambahkan beberapa format tanggal yang mungkin untuk parsing
      const parsedDate = dayjs(date, ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD'], true);
      console.log(`Parsed Date: ${parsedDate.format()}`);
    
      if (!parsedDate.isValid()) {
        invalid.push({ row, reason: 'Format tanggal tidak valid' });
        continue;
      }
    
      // Hitung selisih hari antara tanggal input dan tanggal hari ini
      const today = dayjs().startOf('day'); // Tanggal hari ini (start of day)
      const diffDays = parsedDate.startOf('day').diff(today, 'day');  // Selisih dalam hari (dari input ke hari ini)
    
      console.log(`Selisih Hari: ${diffDays} hari`);
    
      // Cek apakah tanggal kurang dari 2 hari (H-2, H-1, dst) -> invalid
      if (diffDays < -2) {
        invalid.push({ row, reason: 'Tanggal kurang dari 2 hari' });
        continue;
      }
    
      valid.push({ row, onuSN, valinsID }); // Jika lebih dari 2 hari, valid
    }
    
    
    setResult({ valid, invalid });
    setLoading(true);
    if (valid.length > 0) {
      showToast(`Berhasil memproses ${valid.length} data!`, 'success');
    } else {
      showToast('Tidak ada data yang valid untuk diproses.', 'error');
    }    

    for (let item of valid) {
      try {
        // SEARCH: cek apakah data sudah ada dan statusnya
        const res = await axios.get(`https://sheetdb.io/api/v1/fq5jcgo6t69ng/search?sheet=LMBR%20KRJ%20GM%20JATIM2&WITEL=SIDOARJO&WO%20HARI%20INI=WOHARIINI&`, {
          params: {
            'ONU SN': item.onuSN
          }
        });

        const data = res.data;

        if (data.length === 0) {
          console.warn(`ONU SN ${item.onuSN} tidak ditemukan`);
          continue;
        }

        const record = data[0];
        const status = record['STATUS VALINS']?.toUpperCase() || '';

        if (status.includes('SUDAH VALINS')) {
          console.log(`Data ${item.onuSN} sudah divalins, dilewati`);
          continue;
        }

        // PATCH: update status valins dan ID valins
        await axios.patch(`https://sheetdb.io/api/v1/fq5jcgo6t69ng/ONU%20SN/${item.onuSN}?sheet=LMBR%20KRJ%20GM%20JATIM2`, {
          data: {
            'STATUS VALINS': 'SUDAH VALINS',
            'VALINS TYPE' : 'Sudah Valins',
            '. id valins': item.valinsID
          }
        });


        console.log(`Updated: ${item.onuSN}`);
      } catch (error) {
        console.error(`Gagal update ${item.onuSN}:`, error);
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          📋 SheetDB Validator & Updater
        </h1>
  
        <textarea
          className="w-full h-40 p-4 border-2 text-black border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
          placeholder="📝 Tempelkan data disini..."
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
        ></textarea>
  
        <button
          className={`w-full mt-4 py-3 font-semibold rounded-lg text-white transition duration-300 ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          onClick={processData}
          disabled={loading}
        >
          {loading ? '⏳ Memproses...' : '🚀 Proses & Kirim ke SheetDB'}
        </button>
  
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-green-50 border border-green-300 rounded-lg p-4 shadow">
            <h2 className="text-xl font-semibold text-green-700 mb-2">
              ✅ Data Valid: {result.valid.length}
            </h2>
            {result.valid.length === 0 ? (
              <p className="text-sm text-gray-500">Belum ada data valid.</p>
            ) : (
              <ul className="list-disc list-inside text-sm text-green-800 space-y-1 max-h-60 overflow-y-auto">
                {result.valid.map((item, i) => (
                  <li key={i}>{item.row}</li>
                ))}
              </ul>
            )}
          </div>
  
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 shadow">
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              ❌ Data Invalid: {result.invalid.length}
            </h2>
            {result.invalid.length === 0 ? (
              <p className="text-sm text-gray-500">Tidak ada data invalid.</p>
            ) : (
              <ul className="list-disc list-inside text-sm text-red-800 space-y-1 max-h-60 overflow-y-auto">
                {result.invalid.map((item, i) => (
                  <li key={i}>
                    {item.row} — <span className="italic text-red-500">{item.reason}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      {toast.message && (
  <Toast
    message={toast.message}
    type={toast.type}
    onClose={() => setToast({ message: '', type: '' })}
  />
)}
    </div>
  );  
}

export default App;
