import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try {
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.APP_URL || 'http://127.0.0.1:5173');
 await page.getByRole('button',{name:'＋ 今日の記録をつける'}).click();
 for(const [name,value] of [['売上 Uber Eats','6000'],['売上 出前館','3000'],['売上 Rocket Now','1000'],['売上 その他','500'],['経費 ガソリン代','500'],['経費 レンタル代','1000'],['経費 駐車料金','200'],['経費 食費','300'],['経費 その他','100'],['稼働時間','4'],['配達件数','21']])await page.getByRole('spinbutton',{name,exact:true}).fill(value);
 assert.match(await page.locator('#live-summary').innerText(),/¥8,400/);
 assert.match(await page.locator('#live-summary').innerText(),/¥2,100/);
 assert.match(await page.locator('#live-summary').innerText(),/¥500/);
 const date=await page.getByLabel('記録する日付').inputValue();
 await page.getByRole('button',{name:'記録を保存する',exact:true}).click();
 assert.equal(await page.locator('.hero-value').innerText(),'¥8,400');
 await page.reload();assert.equal(await page.locator('.hero-value').innerText(),'¥8,400');
 await page.getByRole('button',{name:'今日',exact:true}).click();assert.equal(await page.locator('.hero-value').innerText(),'¥8,400');
 await page.locator('.record').first().click();await page.getByRole('spinbutton',{name:'売上 Uber Eats',exact:true}).fill('7000');await page.getByRole('button',{name:'変更を保存する'}).click();assert.equal(await page.locator('.hero-value').innerText(),'¥9,400');
 // Create a previous-month record and verify period filtering.
 await page.getByRole('button',{name:'＋ 今日の記録をつける'}).click();await page.getByLabel('記録する日付').fill('2020-01-02');await page.getByRole('button',{name:'変更を保存する'}).click();
 assert.equal(await page.locator('.hero-value').innerText(),'¥0');
 await page.getByRole('button',{name:'＋ 今日の記録をつける'}).click();await page.getByLabel('記録する日付').fill('2020-01-02');await page.getByRole('button',{name:'記録を保存する',exact:true}).click();assert.match(await page.locator('#form-error').innerText(),/すでにあります/);
 await page.getByRole('button',{name:'キャンセル'}).click();await page.getByRole('button',{name:'履歴',exact:true}).click();await page.locator('#history-month').fill('2020-01');assert.equal(await page.locator('.record').count(),1);
 await page.locator('.record').click();page.once('dialog',d=>d.dismiss());await page.getByRole('button',{name:'この記録を削除する'}).click();assert.equal(await page.locator('#entry').count(),1);
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'この記録を削除する'}).click();await page.reload();assert.equal(await page.locator('.record').count(),0);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile has no horizontal overflow');
 assert.deepEqual(errors,[]);
 // Corrupt data must not be silently overwritten.
 await page.evaluate(()=>localStorage.setItem('delivery-income-v1','broken'));await page.reload();assert.match(await page.locator('.notice').innerText(),/保存を停止/);
 await page.getByRole('button',{name:'＋ 今日の記録をつける'}).click();page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'記録を保存する',exact:true}).click();assert.equal(await page.evaluate(()=>localStorage.getItem('delivery-income-v1')),'broken');
 console.log('PASS: mobile entry, all categories, calculations, save/reload, editing, date filtering, duplicate protection, delete confirmation, corruption protection; no browser errors.');
} finally {await browser.close();}
