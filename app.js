const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let expenses = loadExpenses();
const limits = JSON.parse(localStorage.getItem('fintrack_limits') || '{}');
$('date').value = new Date().toISOString().slice(0, 10);

function renderTable(list) {
  $('rows').innerHTML = list.map(e => `<tr>
    <td>${e.id}</td>
    <td>${e.date.split('-').reverse().join('.')}</td>
    <td>${esc(e.category)}</td>
    <td>${e.amount} ₽</td>
    <td>${esc(e.comment)}</td>
    <td><button class="del" data-id="${e.id}">✕</button></td>
  </tr>`).join('') || '<tr><td colspan="6">Записей нет</td></tr>';
}

function renderReport() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  let html = `<p>Всего потрачено за месяц: <b>${getMonthTotal(expenses, y, m)} ₽</b></p><ul>`;
  const totals = getTotalsByCategory(expenses, y, m);
  for (const name in totals) html += `<li>${esc(name)}: ${totals[name]} ₽</li>`;
  html += '</ul>';
  for (const name of getExceededCategories(expenses, limits, y, m))
    html += `<p class="warn">Превышен лимит по категории «${esc(name)}»!</p>`;
  $('report').innerHTML = html;
}

function refresh() {
  renderTable(expenses);
  renderReport();
}

$('addBtn').onclick = () => {
  $('error').textContent = '';
  try {
    addExpense(expenses, parseFloat($('amount').value), $('category').value, $('date').value, $('comment').value);
    saveExpenses(expenses);
    $('amount').value = '';
    $('comment').value = '';
    refresh();
  } catch (e) {
    $('error').textContent = e.message;
  }
};

$('rows').onclick = ev => {
  const id = Number(ev.target.dataset.id);
  if (id && deleteExpense(expenses, id)) {
    saveExpenses(expenses);
    refresh();
  }
};

$('filterBtn').onclick = () => renderTable(filterByCategory(expenses, $('filter').value));
$('resetBtn').onclick = () => { $('filter').value = ''; refresh(); };

$('limitBtn').onclick = () => {
  const cat = $('limitCat').value.trim().toLowerCase();
  const val = parseFloat($('limitVal').value);
  if (!cat || !(val > 0)) return alert('Некорректный лимит');
  limits[cat] = val;
  localStorage.setItem('fintrack_limits', JSON.stringify(limits));
  renderReport();
};

refresh();