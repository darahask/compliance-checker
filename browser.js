const puppeteer =  require('puppeteer');

module.exports = instance = async (host) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://'+host);

  const cookies = await page.evaluate(() => {
    return {
      allCookies: document.cookie,
    };
  });

  console.log('Cookies:', cookies);

  await browser.close();
};