export function getPastMonths(count = 12) {
  const months: string[] = [];
  const today = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push(d.toLocaleString('default', { month: 'short', year: '2-digit' }));
  }
  return months;
} 