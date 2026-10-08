import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try {
 const p=await b.newPage({viewport:{width:390,height:844}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.clock.setFixedTime(new Date('2026-10-08T12:00:00'));
 await p.goto(process.env.APP_URL||'http://127.0.0.1:5173');
 await p.getByText('月の目標を変更',{exact:true}).click();await p.getByLabel('月の目標売上').fill('240000');await p.getByRole('button',{name:'目標を保存',exact:true}).click();
 assert.match(await p.locator('.today-goal').innerText(),/¥10,000/);
 await p.getByText('借金の登録額を設定',{exact:true}).click();await p.getByLabel('借金の登録額').fill('100000');await p.getByRole('button',{name:'借金の登録額を保存'}).click();
 await p.getByText('返済を記録・確認',{exact:true}).click();await p.getByLabel('返済額',{exact:true}).fill('20000');await p.getByRole('button',{name:'返済を保存',exact:true}).click();
 assert.match(await p.locator('.debt-card').innerText(),/残り ¥80,000/);assert.match(await p.locator('.debt-card').innerText(),/今月の返済 ¥20,000/);
 await p.reload();assert.match(await p.locator('.debt-card').innerText(),/残り ¥80,000/);assert.match(await p.locator('.monthly-goal').innerText(),/¥240,000/);
 await p.getByRole('button',{name:'＋ 今日の記録をつける'}).click();await p.getByLabel('売上 Uber Eats',{exact:true}).fill('4000');await p.getByRole('button',{name:'記録を保存する',exact:true}).click();
 assert.match(await p.locator('.today-goal').innerText(),/あと ¥6,000/);assert.match(await p.locator('.today-goal').innerText(),/今日の目標 ¥10,000/);assert.equal(await p.locator('.hero-value').innerText(),'¥4,000');
 await p.getByText('返済を記録・確認',{exact:true}).click();p.once('dialog',d=>d.accept());await p.getByRole('button',{name:'2026-10-08 20000円の返済を削除'}).click();assert.match(await p.locator('.debt-card').innerText(),/残り ¥100,000/);
 await p.reload();assert.match(await p.locator('.debt-card').innerText(),/返済済み ¥0/);
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await p.screenshot({path:'/tmp/delivery-finance-home.png',fullPage:true});
 await p.evaluate(()=>localStorage.setItem('delivery-finance-v1','broken'));await p.reload();assert.match(await p.locator('.notice').innerText(),/上書きを停止/);
 await p.getByText('月の目標を変更',{exact:true}).click();p.once('dialog',d=>d.accept());await p.getByRole('button',{name:'目標を保存',exact:true}).click();assert.equal(await p.evaluate(()=>localStorage.getItem('delivery-finance-v1')),'broken');assert.deepEqual(errors,[]);
 console.log('PASS: monthly target, daily remaining, debt registration/repayment/deletion, persistence, revenue independence and corrupt data protection');
} finally {await b.close();}
