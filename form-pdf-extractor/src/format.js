// Pure formatting helpers for the work-permit status page.
// Runnable self-check at the bottom: `node src/format.js`

// ISO date (yyyy-mm-dd) -> `d.MM.yyyy` (day unpadded, month padded) e.g. 1.01.1992
export function formatDob(isoDate) {
  if (!isoDate) return ''
  const [y, m, d] = isoDate.split('-')
  return `${parseInt(d, 10)}.${m}.${y}`
}

// Date -> Turkish long date + time e.g. "15 Ocak 2026 22:39"
export function formatAppDate(date) {
  const day = new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${day} ${hh}:${mm}`
}

// Auto-generated application number: NNNNNN/2026
export function makeAppNo() {
  return `${Math.floor(100000 + Math.random() * 900000)}/2026`
}

// ponytail: one runnable check, no test framework — `node src/format.js`
if (typeof process !== 'undefined' && process.argv?.[1]?.endsWith('format.js')) {
  console.assert(formatDob('1992-01-01') === '1.01.1992', 'formatDob:', formatDob('1992-01-01'))
  console.assert(formatDob('') === '', 'formatDob empty')
  const d = new Date(2026, 0, 15, 22, 39)
  console.assert(formatAppDate(d) === '15 Ocak 2026 22:39', 'formatAppDate:', formatAppDate(d))
  console.assert(/^\d{6}\/2026$/.test(makeAppNo()), 'makeAppNo:', makeAppNo())
  console.log('format.js self-check OK')
}
