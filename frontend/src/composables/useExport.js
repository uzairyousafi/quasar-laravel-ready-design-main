import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { fmtDate, isDateColumn } from '@/utils/date'

function getColValue(col, row) {
  const raw = typeof col.field === 'function' ? col.field(row) ?? '' : row[col.field ?? col.name] ?? ''
  // Auto-format date columns so exports show "20 Jun 2026" not raw ISO strings
  if (isDateColumn(col.name) && raw) return fmtDate(raw)
  return raw
}

function prepareColumns(columns) {
  return columns.filter(c => c.name !== 'actions' && c.name !== 'created_at')
}

export function exportPdf(data, columns, filename = 'export') {
  const cols = prepareColumns(columns)
  const head = [cols.map(c => c.label || c.name)]
  const body = data.map(row => cols.map(col => String(getColValue(col, row))))

  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
  doc.setFontSize(12)
  doc.text(filename.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 40, 30)
  autoTable(doc, {
    head,
    body,
    startY: 45,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [0, 150, 200], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 250, 255] },
  })
  doc.save(`${filename}.pdf`)
}

export function exportExcel(data, columns, filename = 'export') {
  const cols = prepareColumns(columns)
  const header = cols.map(c => c.label || c.name)
  const rows = data.map(row => cols.map(col => getColValue(col, row)))

  const ws = XLSX.utils.aoa_to_sheet([header, ...rows])
  // Bold header row
  const range = XLSX.utils.decode_range(ws['!ref'])
  for (let C = range.s.c; C <= range.e.c; C++) {
    const cell = ws[XLSX.utils.encode_cell({ r: 0, c: C })]
    if (cell) cell.s = { font: { bold: true } }
  }
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

export function whatsappShare(data, columns, filename = 'data') {
  const cols = prepareColumns(columns).slice(0, 4)
  const lines = data.slice(0, 20).map(row =>
    cols.map(col => `${col.label || col.name}: ${getColValue(col, row)}`).join(' | ')
  )
  const header = `*${filename.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}*\n`
  const text = header + lines.join('\n') + (data.length > 20 ? `\n... and ${data.length - 20} more` : '')
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
}
