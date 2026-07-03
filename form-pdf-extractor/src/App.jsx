import { useRef, useState } from 'react'
import { formatDob, formatAppDate, makeAppNo } from './format'
import './App.css'

const FIELDS = [
  { name: 'name', label: 'Ad Soyad', type: 'text', placeholder: 'HAZRAT ALI' },
  { name: 'passport', label: 'Pasaport No', type: 'text', placeholder: 'VR1843471' },
  { name: 'address', label: 'Adres / Doğum Yeri', type: 'text', placeholder: 'PESHAWAR' },
  { name: 'dob', label: 'Doğum Tarihi', type: 'date' },
  { name: 'hour', label: 'Saat', type: 'time', step: 1 },
  { name: 'phone', label: 'Telefon No', type: 'tel', placeholder: '00905488334561' },
  { name: 'country', label: 'Ülke', type: 'text', placeholder: 'PAKİSTAN' },
]

const INFO_BUTTONS = [
  { label: '📲 SMS', color: 'green' },
  { label: '🖨️ Yazdırma', color: 'green' },
  { label: '🧾 Harç', color: 'green' },
  { label: '🖼️ Süreç Görseli', color: 'green' },
  { label: '🔄 Çevirme Bilgileri', color: 'green' },
  { label: '➕ Sağlık İşlemleri', color: 'orange' },
  { label: "🔁 Akit'e Çevir", color: 'orange' },
  { label: '💳 Ödeme Yap', color: 'orange' },
]

const PRINT_BUTTONS = [
  { label: '📈 Ön izin Tarihleri', color: 'green' },
  { label: '📄 Ön İzin Belgesi Basımı', color: 'blue' },
  { label: '📄 Çalışma İzni Belgesi', color: 'blue' },
  { label: '📄 Takip Dokümanı', color: 'blue' },
]

const EMPTY = { name: '', passport: '', address: '', dob: '', hour: '', phone: '', country: '' }

function App() {
  const [form, setForm] = useState(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const [meta, setMeta] = useState({ appNo: '', appDate: '' })
  const resultRef = useRef(null)

  // Capture the result exactly as rendered on screen into a single-page PDF.
  // Direct html2canvas + jsPDF: page is sized to the canvas, so no pagination.
  const downloadPdf = async () => {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ])
    const el = resultRef.current
    const canvas = await html2canvas(el, {
      scale: 2,
      width: el.scrollWidth,
      windowWidth: el.scrollWidth + 60,
      backgroundColor: '#ffffff',
    })
    const w = canvas.width / 2
    const h = canvas.height / 2
    const pdf = new jsPDF({
      orientation: w > h ? 'landscape' : 'portrait',
      unit: 'px',
      format: [w, h],
      hotfixes: ['px_scaling'],
    })
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, w, h)
    pdf.save('On Izin Basvurusu.pdf')
  }

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    setMeta({ appNo: makeAppNo(), appDate: formatAppDate(new Date()) })
    setSubmitted(true)
  }

  if (!submitted) {
    return (
      <div className="page">
        <form className="form-card" onSubmit={submit}>
          <h1>Ön İzin Başvurusu</h1>
          <p className="sub">İşçi bilgilerini girin ve başvuru belgesini oluşturun.</p>
          {FIELDS.map((f) => (
            <label key={f.name} className="field">
              <span>{f.label}</span>
              <input
                name={f.name}
                type={f.type}
                step={f.step}
                placeholder={f.placeholder}
                value={form[f.name]}
                onChange={change}
                required
              />
            </label>
          ))}
          <button type="submit" className="submit-btn">Başvuru Oluştur</button>
        </form>
      </div>
    )
  }

  const workerLines = [
    form.name,
    form.passport,
    `${form.address}/${formatDob(form.dob)}`,
    form.hour,
    form.phone,
    form.country,
  ]

  return (
    <div className="page">
      <div className="toolbar no-print">
        <button className="tool-btn primary" onClick={downloadPdf}>PDF olarak indir</button>
        <button className="tool-btn" onClick={() => setSubmitted(false)}>Yeni Başvuru</button>
      </div>

      <div className="result" ref={resultRef}>
        <table>
          <thead>
            <tr>
              <th>İşlem</th>
              <th>Bilgi/Aksiyon Düğmeleri</th>
              <th>Yardım</th>
              <th>Başvuru Bilgileri</th>
              <th>Bağlı İşyeri</th>
              <th>Basım İşlemleri</th>
              <th>Vekalet Bilgileri</th>
              <th>İşveren Bilgileri</th>
              <th>İşçi Bilgileri</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {/* İşlem */}
              <td>
                <div className="app-link">{meta.appNo}</div>
                <div className="city">{form.address || 'GAZİMAĞUSA'}</div>
                <div className="row-icons">⊕ &nbsp; ⋯ &nbsp; ✎</div>
                <button type="button" className="pill indigo">🧭 Başvuru Takibi</button>
              </td>

              {/* Bilgi/Aksiyon Düğmeleri */}
              <td>
                <div className="btn-stack">
                  {INFO_BUTTONS.map((b) => (
                    <button type="button" key={b.label} className={`pill ${b.color}`}>{b.label}</button>
                  ))}
                </div>
              </td>

              {/* Yardım */}
              <td className="help">
                Başvurunuz Kurum tarafından kontrol ediliyor. Ret durumunda lütfen
                belirtilen hataları düzeltip Kurum'a tekrar gönderme işlemi yapınız.
              </td>

              {/* Başvuru Bilgileri */}
              <td className="app-info">
                <div className="app-title">Ön İzin<br />Başvurusu</div>
                <div className="app-no">{meta.appNo}</div>
                <div className="app-date">{meta.appDate}</div>
                <div className="status">Kontrol: <b>BEKLEMEDE</b></div>
                <div className="status">Amir Kontrol:<br /><b>BEKLEMEDE</b></div>
                <div className="status">Mühür İzni:<br /><b>BEKLEMEDE</b></div>
              </td>

              {/* Bağlı İşyeri */}
              <td className="workplace">
                <b>OSMAN OGULLARI INSAAT LTD.</b>
                <br />
                <b>GM-18232</b>
              </td>

              {/* Basım İşlemleri */}
              <td>
                <div className="btn-stack">
                  {PRINT_BUTTONS.map((b) => (
                    <button type="button" key={b.label} className={`pill ${b.color}`}>{b.label}</button>
                  ))}
                </div>
              </td>

              {/* Vekalet Bilgileri */}
              <td className="muted">
                Ad Soyad:<br />
                Kimlik No:<br />
                V.Başlangıç:<br />
                V.Bitiş:
              </td>

              {/* İşveren Bilgileri */}
              <td className="muted">
                Ünvan<br />İsim:<br />
                Kimlik<br />No:
              </td>

              {/* İşçi Bilgileri */}
              <td className="worker">
                {workerLines.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
