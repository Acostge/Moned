import { Transaction } from '../types/finance';

/**
 * Parses numeric strings from Latin American / Spanish spreadsheets
 * e.g. "3.379,25" -> 3379.25, "10,4" -> 10.4, "281.7" -> 281.7
 */
export function parseSpanishNumber(raw: string | undefined | null): number {
  if (!raw) return 0;
  let str = raw.toString().trim().replace(/^"|"$/g, '');
  if (!str) return 0;

  // If contains dot as thousands and comma as decimal (e.g. 3.379,25)
  if (str.includes('.') && str.includes(',')) {
    str = str.replace(/\./g, '').replace(',', '.');
  } else if (str.includes(',')) {
    // Only comma as decimal (e.g. 10,4)
    str = str.replace(',', '.');
  }

  const val = parseFloat(str);
  return isNaN(val) ? 0 : val;
}

/**
 * Parses dates formatted as DD/MM/YYYY or YYYY-MM-DD into standard YYYY-MM-DD
 */
export function parseSpreadsheetDate(rawDate: string | undefined | null): { dateStr: string; year: number } {
  const fallbackYear = 2026;
  const fallbackDate = new Date().toISOString().split('T')[0];

  if (!rawDate) return { dateStr: fallbackDate, year: fallbackYear };
  const trimmed = rawDate.trim().replace(/^"|"$/g, '');

  // Handle DD/MM/YYYY format
  if (trimmed.includes('/')) {
    const parts = trimmed.split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parseInt(parts[2]) || fallbackYear;
      return {
        dateStr: `${year}-${month}-${day}`,
        year,
      };
    }
  }

  // Handle ISO or YYYY-MM-DD
  if (trimmed.includes('-')) {
    const parts = trimmed.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0]) || fallbackYear;
      return {
        dateStr: trimmed,
        year,
      };
    }
  }

  return { dateStr: fallbackDate, year: fallbackYear };
}

/**
 * Parses CSV text taking quotes and commas into account correctly
 */
export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Parses complete Google Sheets CSV from the user's GASTOS / INGRESOS structure
 */
export function parseGoogleSheetsCSV(csvText: string): Transaction[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase());
  
  // Find column indexes
  const fechaIdx = headers.findIndex((h) => h.includes('fecha'));
  const tipoIdx = headers.findIndex((h) => h.includes('tipo'));
  const conceptoIdx = headers.findIndex((h) => h.includes('concepto'));
  const ingresoIdx = headers.findIndex((h) => h.includes('ingreso'));
  const egresoIdx = headers.findIndex((h) => h.includes('egreso'));
  const tasaIdx = headers.findIndex((h) => h.includes('tasa'));
  const totalBsIdx = headers.findIndex((h) => h.includes('total') && h.includes('bs'));

  const parsedTransactions: Transaction[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 3) continue;

    const rawFecha = fechaIdx >= 0 ? cols[fechaIdx] : cols[0];
    const rawTipo = tipoIdx >= 0 ? cols[tipoIdx] : cols[1];
    const rawConcepto = conceptoIdx >= 0 ? cols[conceptoIdx] : cols[2];
    const rawIngreso = ingresoIdx >= 0 ? cols[ingresoIdx] : cols[3];
    const rawEgreso = egresoIdx >= 0 ? cols[egresoIdx] : cols[4];
    const rawTasa = tasaIdx >= 0 ? cols[tasaIdx] : cols[5];
    const rawTotalBs = totalBsIdx >= 0 ? cols[totalBsIdx] : cols[6];

    const ingresoUSD = parseSpanishNumber(rawIngreso);
    const egresoUSD = parseSpanishNumber(rawEgreso);
    const tasaBs = parseSpanishNumber(rawTasa) || 886.23;
    const totalBs = parseSpanishNumber(rawTotalBs);

    if (ingresoUSD === 0 && egresoUSD === 0 && !rawConcepto) {
      continue; // Skip empty rows
    }

    const isIngreso = ingresoUSD > 0 || (rawTipo && rawTipo.toLowerCase().includes('reembolso'));
    const montoUSD = isIngreso ? (ingresoUSD > 0 ? ingresoUSD : egresoUSD) : egresoUSD;
    const { dateStr, year } = parseSpreadsheetDate(rawFecha);

    const calculatedBs = totalBs > 0 ? totalBs : +(montoUSD * tasaBs).toFixed(2);

    parsedTransactions.push({
      id: `sheet-tx-${i}-${Date.now()}`,
      ano: year,
      fecha: dateStr,
      tipo: isIngreso ? 'Ingreso' : 'Egreso',
      categoria: rawTipo || (isIngreso ? 'Retorno de Inversión' : 'Consumo / Hogar'),
      concepto: rawConcepto || (isIngreso ? 'Ingreso registrado' : 'Gasto registrado'),
      montoUSD: montoUSD > 0 ? montoUSD : 1,
      tasaBs,
      montoBs: calculatedBs,
    });
  }

  return parsedTransactions;
}
