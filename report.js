// Отчёты: итоги за месяц
function inMonth(expense, year, month) {
  const [y, m] = expense.date.split('-').map(Number);
  return y === year && m === month;
}

function getMonthTotal(expenses, year, month) {
  return expenses
    .filter(e => inMonth(e, year, month))
    .reduce((sum, e) => sum + e.amount, 0);
}

function getTotalsByCategory(expenses, year, month) {
  const totals = {};
  for (const e of expenses.filter(x => inMonth(x, year, month))) {
    const key = e.category.toLowerCase();
    totals[key] = (totals[key] || 0) + e.amount;
  }
  return totals;
}

function getExceededCategories(expenses, limits, year, month) {
  const totals = getTotalsByCategory(expenses, year, month);
  return Object.keys(totals).filter(c => limits[c] !== undefined && totals[c] > limits[c]);
}