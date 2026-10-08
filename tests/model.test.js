import test from 'node:test';
import assert from 'node:assert/strict';
import {metrics, validRecord, monthlyGoal} from '../src/model.js';
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
