const puppeteer = require('puppeteer');
instance = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto('https://blablabla');
    
    // console.log(page);
  
    // Cookie in details printed
    console.log(await page._client.send('Network.getAllCookies'));
}

instance()