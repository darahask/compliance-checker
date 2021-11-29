const puppeteer =  require('puppeteer');

module.exports = instance = async (host) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://'+host);
  await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})
  // console.log(page);
  const cookies = await page.evaluate(() => {
    return {
      allCookies: document.cookie,
    };
  });
  console.log(cookies);

  // const result = await page.evaluate(()=>{
  //   var  data = []
  //   try {
  //     return $('a')
  //   } catch (error) {
  //     console.error(error);
  //   }
  // })
  // // console.log('Cookies:', cookies);
  // // console.log('DOM', dom);
  // console.log('anchor tags', result);

  const extractedText = await page.$eval('*', (el) => el.innerText);
  var consent = RegExp('Cookie','i').test(extractedText.trim());
  console.log("The browser has cookie consent",consent)
  
  
  await browser.close();
};