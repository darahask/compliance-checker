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
  
  const urls = await page.evaluate(()=>{
    var urlList = [];
    data = document.getElementsByTagName('a')
    for(const [key,val] of Object.entries(data)){
      urlList.push(val.href)
    }
    return urlList
  })

  console.log(urls)
  
  await browser.close();
};

function getLinksFromHtml(htmlString) {
  // Regular expression that matches syntax for a link (https://stackoverflow.com/a/3809435/117030):
  LINK_REGEX = "/https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi";

  // Use the regular expression from above to find all the links:
  matches = htmlString.match(LINK_REGEX);

  // Output to console:
  console.log(matches);

  // Alternatively, return the array of links for further processing:
  return matches;
}