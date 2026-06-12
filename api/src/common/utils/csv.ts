const CSV_ESCAPE_RE = /["\n\r,]/;

export function toCsvValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (CSV_ESCAPE_RE.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function toCsvRow(values: unknown[]): string {
  return values.map(toCsvValue).join(',') + '\r\n';
}
