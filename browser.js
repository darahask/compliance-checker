const puppeteer =  require('puppeteer');

module.exports = instance = async (host) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto('https://'+host);
  await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})
  // console.log(page);
  const cookies = await page.evaluate(() => {
    return {
      allCookies: document.cookie,
    };
  });
  console.log(cookies);

  const extractedText = await page.$eval('*', (el) => el.innerText);
  var consent = RegExp('Cookie','i').test(extractedText.trim());
  console.log("The browser has cookie consent",consent)
// Getting list of hyperlinks.
  // const urls = await page.evaluate(()=>{
  //   var urlList = [];
  //   data = document.getElementsByTagName('a')
  //   for(const [key,val] of Object.entries(data)){
  //     urlList.push(val.href)
  //   }
  //   return urlList
  // })
  // console.log(urls)
  
// Alternate text score calculation.
  // const alts = await page.evaluate(()=>{
  //   var score=0;
  //   data = document.getElementsByTagName('img')
  //   for(const [key,val] of Object.entries(data)){
  //     if(val.alt.trim()!=='')
  //     {
  //       score+=1;
  //     }
  //   }
  //  return {"totalimg":data.length,
  //           "score":score}
  // })

  // console.log(alts)

// Tab Index score calculation
const extractedText = await page.$eval('*', (el) => el.innerText);


  await browser.close();
};