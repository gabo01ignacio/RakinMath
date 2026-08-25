export default async function run(page, ui) {
  await page.goto('file:///C:/Users/monix/RakinMath/v2/login.html', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('rakin_session', JSON.stringify({user:'Test',ts:Date.now()}));
    localStorage.setItem('rakin_stats_Test', JSON.stringify({dailyStreak:{current:3,lastDate:'2026-08-13'}}));
    localStorage.setItem('rakin_medals_Test', JSON.stringify([]));
    localStorage.setItem('rakin_progress_Test', JSON.stringify({}));
  });
  
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('file:///C:/Users/monix/RakinMath/v2/Juegos/menu.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'C:/Users/monix/RakinMath/v2/Juegos/debug-desktop.png', fullPage: false });
  
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/monix/RakinMath/v2/Juegos/debug-mobile.png', fullPage: false });

  return 'done';
}
