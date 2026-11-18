// Учёт расходов: хранение и добавление
const STORAGE_KEY = 'fintrack_expenses';

function loadExpenses() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveExpenses(expenses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function addExpense(expenses, amount, category, date, comment) {
  if (!(amount > 0)) throw new Error('Сумма должна быть больше нуля.');
  if (!category || !category.trim()) throw new Error('Категория не может быть пустой.');
  const id = expenses.length ? Math.max(...expenses.map(e => e.id)) + 1 : 1;
  const expense = { id, amount: Number(amount), category: category.trim(), date, comment: comment || '' };
  expenses.push(expense);
  return expense;
}
function deleteExpense(expenses, id) {
  const index = expenses.findIndex(e => e.id === id);
  if (index === -1) return false;
  expenses.splice(index, 1);
  return true;
}

function filterByCategory(expenses, category) {
  const c = category.trim().toLowerCase();
  return expenses.filter(e => e.category.toLowerCase() === c);
}