export const SERVICES = ['Uber Eats', '出前館', 'Rocket Now', 'その他'];
export const EXPENSES = ['ガソリン代', 'レンタル代', '駐車料金', '食費', 'その他'];
export function today() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
export function metrics(records) {
  const sales = SERVICES.map((_,i) => records.reduce((s,r)=>s+r.sales[i],0));
  const revenue = sales.reduce((s,v)=>s+v,0);
  const expense = records.reduce((s,r)=>s+r.expenses.reduce((a,v)=>a+v,0),0);
  const hours = records.reduce((s,r)=>s+r.hours,0);
  const count = records.reduce((s,r)=>s+r.count,0);
  return {sales,revenue,expense,profit:revenue-expense,hours,count,hourly:hours ? (revenue-expense)/hours : null,perOrder:count ? revenue/count : null};
}
export function validRecord(r) {
  if (!r || typeof r.id !== 'string' || !/^[A-Za-z0-9_-]{1,80}$/.test(r.id) || !/^\d{4}-\d{2}-\d{2}$/.test(r.date)) return false;
  const d = new Date(`${r.date}T00:00:00Z`);
  return !isNaN(d) && d.toISOString().slice(0,10)===r.date && Array.isArray(r.sales) && r.sales.length===4 && Array.isArray(r.expenses) && r.expenses.length===5 && [...r.sales,...r.expenses].every(v=>Number.isSafeInteger(v)&&v>=0&&v<=999999999) && Number.isFinite(r.hours)&&r.hours>=0&&r.hours<=24 && Number.isSafeInteger(r.count)&&r.count>=0&&r.count<=9999;
}

export function monthlyGoal(records, date = today()) {
  const [year, month, day] = date.split('-').map(Number);
  const target = 700000;
  const revenue = metrics(records.filter(r => r.date.slice(0,7) === date.slice(0,7))).revenue;
  const remaining = Math.max(0, target - revenue);
  const daysLeft = new Date(year, month, 0).getDate() - day + 1;
  return {target, revenue, remaining, daysLeft, dailyRequired: Math.ceil(remaining / daysLeft), progress: Math.min(100, revenue / target * 100)};
}
