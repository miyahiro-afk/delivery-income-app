import test from 'node:test';
import assert from 'node:assert/strict';
import {metrics, validRecord, monthlyGoal, dailyGoal, debtTotals, validFinance} from '../src/model.js';
const record={id:'a',date:'2026-10-08',sales:[6000,3000,1000,0],expenses:[500,1000,200,300,0],hours:4,count:20};
test('all services and expenses contribute to profit and rates',()=>assert.deepEqual(metrics([record]),{sales:[6000,3000,1000,0],revenue:10000,expense:2000,profit:8000,hours:4,count:20,hourly:2000,perOrder:500}));
test('empty totals and zero denominators are safe',()=>{const m=metrics([]);assert.equal(m.profit,0);assert.equal(m.hourly,null);assert.equal(m.perOrder,null);});
test('aggregate rates use total hours and orders, retaining negative profit',()=>{const m=metrics([record,{...record,sales:[0,0,0,0],expenses:[10000,0,0,0,0],hours:1,count:5}]);assert.equal(m.profit,-2000);assert.equal(m.hourly,-400);assert.equal(m.perOrder,400);});
test('validate dates, integer yen and counts, and supported hours',()=>{assert.ok(validRecord(record));for(const changes of [{date:'2026-02-30'},{hours:25},{count:1.5},{sales:[-1,0,0,0]},{expenses:[0,0,0,0,NaN]},{sales:[0]}])assert.equal(validRecord({...record,...changes}),false);});

test('monthly goal uses revenue across services and excludes other months',()=>{
 const g=monthlyGoal([record,{...record,date:'2026-09-30',sales:[700000,0,0,0]}],'2026-10-08');
 assert.equal(g.revenue,10000);assert.equal(g.remaining,690000);assert.equal(g.daysLeft,24);assert.equal(g.dailyRequired,28750);
});
test('month end, leap year and rounding',()=>{
 assert.equal(monthlyGoal([],'2026-10-31').daysLeft,1);
 assert.equal(monthlyGoal([],'2026-10-31').dailyRequired,700000);
 assert.equal(monthlyGoal([],'2024-02-01').daysLeft,29);
 assert.equal(monthlyGoal([],'2026-02-01').daysLeft,28);
 assert.equal(monthlyGoal([],'2026-10-01').dailyRequired,22581);
});
test('reached and exceeded goals have zero remaining and required sales',()=>{
 for(const revenue of [700000,800000]){
 const g=monthlyGoal([{...record,sales:[revenue,0,0,0]}],'2026-10-08');
 assert.equal(g.remaining,0);assert.equal(g.dailyRequired,0);assert.equal(g.progress,100);
 }
});

test('daily target stays fixed as today sales grow; future records are excluded',()=>{
 const prior={...record,date:'2026-10-01',sales:[300000,0,0,0]};
 const current={...record,sales:[10000,0,0,0]};
 const future={...record,date:'2026-10-09',sales:[700000,0,0,0]};
 assert.deepEqual(dailyGoal([prior,current,future],'2026-10-08'),{target:16667,revenue:10000,remaining:6667});
 assert.equal(dailyGoal([prior,{...current,sales:[20000,0,0,0]}],'2026-10-08').remaining,0);
 assert.equal(dailyGoal([],'2026-10-31',310000).target,310000);
});
test('debt balances and repayments are independent of revenue',()=>{
 const f={targets:{'2026-10':500000},debt:100000,repayments:[{id:'a',date:'2026-09-01',amount:10000},{id:'b',date:'2026-10-08',amount:20000}]};
 assert.ok(validFinance(f));assert.deepEqual(debtTotals(f,'2026-10-08'),{paid:30000,monthPaid:20000,remaining:70000});
 assert.equal(validFinance({...f,debt:20000}),false);assert.equal(validFinance({...f,targets:{'2026-10':0}}),false);
 assert.equal(validFinance({...f,repayments:[{id:'a',date:'2026-02-30',amount:1}]}),false);
 assert.equal(validFinance({...f,repayments:[...f.repayments,f.repayments[0]]}),false);
});
