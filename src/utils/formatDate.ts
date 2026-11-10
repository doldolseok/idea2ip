/**
 * ISO 날짜 → 'YYYY.MM.DD'
 * formatDate(iso)       → 2026.10.20 (대시보드)
 * formatDate(iso, '. ') → 2026. 10. 20 (내 프로젝트)
 */
export function formatDate(iso: string, separator = '.') {
  const date = new Date(iso);
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((n) => String(n).padStart(2, '0'))
    .join(separator);
}

/**
 * 'YYYY.MM.DD' 입력 → Date (형식이 다르거나 없는 날짜면 null)
 * 예: '2026.10.20' → 2026-10-20, '2026.13.01' / '2026-10-20' → null
 */
export function parseDotDate(value: string): Date | null {
  const match = /^(\d{4})\.(\d{2})\.(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day);
  const isRealDate =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

  return isRealDate ? date : null;
}
