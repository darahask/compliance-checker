const e = require('express');
const puppeteer =  require('puppeteer');

module.exports = instance = async (host) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto('https://'+host);
  await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})
  let interactive_content = ["a", "button", "details", "embed", "iframe", "keygen", "label", "select", "textarea"]
  // console.log(page);

  // Cookie in details printed
  console.log(await page._client.send('Network.getAllCookies'));

  const extractedText = await page.$eval('*', (el) => el.innerText);
  var consent = RegExp('Cookie','i').test(extractedText.trim());
  console.log("The browser has cookie consent? ",consent)

  // Tab Index violation check
  
  const tabIndex_v = await page.evaluate(()=>{
    var tabIndex = []
    var tag = []
    var all = document.getElementsByTagName("*");

    for (var i=0, max=all.length; i < max; i++) {
      tabIndex.push(all[i].tabIndex);
      tag.push(all[i].tagName)
      // console.log(all[i].tabIndex);
    }
    return {"tabIndex":tabIndex,
            "tag":tag}
  })
  var x = tabIndex_v
  var int_violation =0
  var tabIndex_violation = 0
  for(var i in x['tabIndex'])
  {
    if(interactive_content.includes(x['tag'][i].toLowerCase()))
    {
      if(Number(x['tabIndex'][i]) === -1)
      {
        int_violation+=1;
       // console.log("Violations: ", x['tag'][i]);
      }
      
    }
    if(x['tabIndex'][i]!==0 && x['tabIndex'][i]!==-1)
    {
      tabIndex_violation+=1
    }
    //console.log(x['tabIndex'][i],"  ", x['tag'][i]);
  }
  
  console.log("Number of Interactive Elements Violations: ",int_violation)
  console.log("Number of tabIndex violations: ",tabIndex_violation)
  // for(var i in x)
  // {
  //   console.log(x[i]);
  // }
  
  // Alternate text score calculation.
  const alts = await page.evaluate(()=>{
    var score=0;
    data = document.getElementsByTagName('img')
    for(const [key,val] of Object.entries(data)){
      if(val.alt.trim()!=='')
      {
        score+=1;
      }
    }
   return {"totalimg":data.length,
            "score":score}
  })

  console.log("Alternate Image Violations: ",alts)

  // Getting list of hyperlinks.
  const urls = await page.evaluate(()=>{
    var urlList = [];
    data = document.getElementsByTagName('a')
    for(const [key,val] of Object.entries(data)){
      urlList.push(val.href)
    }
    return urlList
  })
 // console.log(urls)
// heading control
  const headers = await page.evaluate(()=>{
    // var headings = document.getElementsByTagName("h")
    var headings = $("h1, h2, h3, h4, h5, h6")
    var items = []
    var prevLevel
    var dict = {}
    // key : innerText, val : H tag level
    headings.each((i,el)=>{
      var $el = $(el)
      var level = +$el.prop('tagName').slice(1)
      var content = $el.prop('innerText')
      if(dict[content]!=null && level!=dict[content]){
        items.push({"repeating header name at":dict[content], level})
      }
      dict[content] = level
      if (i === 0 && level !== 1) {
        items.push({"H1 not present, instead starts from ":level});
      } else if (prevLevel && level - prevLevel > 1) {
        items.push({"Non consecutive headers present at ":prevLevel, level});
      }
      

      prevLevel = level;
      
    })

    return items;
  })
  console.log(headers)
  // Labeling Control
  const labels = await page.evaluate(()=>{
    var allInput = document.getElementsByTagName("input");
    var allLabel = document.getElementsByTagName("label");
    var control_violation = []
    var flag
    var dict = {}
    for (var i=0, max=allLabel.length; i < max; i++) {
      dict[allLabel[i].getAttribute("for")] = "exists";
    }
    for(var j=0, max2=allInput.length; j < max2; j++){
      if(!(allInput[j].id in dict)){
        control_violation.push(allInput[j].id)
      }
    }
    return control_violation
  })
  console.log("Violated Lables", labels)
// Cookie Consent and Manage
  const cookie_consent = await page.evaluate(()=>{
    var div_id = []
    var buttons
    $("div[id*='consent' i], div[class*='consent' i], div[class*='cookie' i], div[class*='cookie' i]").each((i, el)=>{
      // div_id.push(el.id)
      // if(RegExp('Cookie','i').test(el.innerText.trim()))
      // {
       buttons = $(el).find('button')
        for(const [key,val] of Object.entries(buttons))
        {
            div_id.push(val.innerText)
        }
      // }
    })
    return div_id
  })


  //Cookie Settings

  const cookie_settings = await page.evaluate(()=>{
    var div_id = []
    var flag = false
    $("footer").each((i, el)=>{
      // div_id.push(el.id)
      // if(RegExp('Cookie','i').test(el.innerText.trim()))
      // {
       buttons = $(el).find('*')
        for(const [key,val] of Object.entries(buttons))
        {
          if(val.innerText != "null" && val.innerText!=='' && RegExp('Cookie','i').test(val.innerText))
          {
            if(String(val.tagName)==="A" || String(val.tagName)==="BUTTON"){
              flag = true
            }
            // div_id.push(val.tagName)
          }
        }
      // }
    })
    return flag
    // return div_id
  })
  //console.log(cookie_settings)
  // const footerText = await page.$eval('footer', (el) => el.innerText);
  // var cookie_settings = RegExp('Cookie','i').test(footerText.trim());
  

  var buttons = cookie_consent,consent_flag = -1,manage_flag = -1
  var consent_word = [/^ok/i, /^okay/i, /^accept/i, /^got/i, /^allow/i]
  var manage_word = [/manage/i, /custom/i, /setting/i]
  for(var i=0;i<buttons.length;i++)
  {
    if(consent_word.some(r => r.test(buttons[i]))){
      consent_flag = i
      //console.log("Consent", buttons[i])
    }

    if(manage_word.some(r => r.test(buttons[i]))){
      manage_flag = i
     // console.log("Manage",buttons[i])
    }

  }
  if(consent_flag !== -1)
  {
    console.log("Consent!!")
  }else
  {
    console.log("No Consent Found")
  }
  if(manage_flag !== -1 && manage_flag!== consent_flag)
  {
    console.log("Manage Cookie!!")
  }
  else{
    (cookie_settings===false)? console.log("Cookie Information") : console.log("Cookie Information")
  }
 // console.log(cookie_consent)

  await browser.close();

};