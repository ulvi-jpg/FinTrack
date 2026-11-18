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