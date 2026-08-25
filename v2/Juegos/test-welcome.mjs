export default async function run(page, ui) {
  await page.evaluate(() => {
    localStorage.setItem('rakin_session', JSON.stringify({user:'test',ts:Date.now()}));
    localStorage.setItem('rakin_stats_test', JSON.stringify({dailyStreak:{current:3,lastDate:'2026-08-13'}}));
    localStorage.setItem('rakin_medals_test', JSON.stringify([]));
    localStorage.setItem('rakin_progress_test', JSON.stringify({}));
  });
  await page.goto('file:///C:/Users/monix/RakinMath/v2/Juegos/menu.html');
  await page.waitForTimeout(2000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const consoleErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  const snapshot = await ui.snapshot();
  await page.screenshot({ path: 'C:\\Users\\monix\\RakinMath\\v2\\Juegos\\debug-screenshot.png', fullPage: false });
  return { snapshot, errors, consoleErrors };
}
