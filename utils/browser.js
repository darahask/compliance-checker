const puppeteer = require('puppeteer'); // for simulating browser in node

module.exports = instance = async (host) => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  const response = await page.goto('http://' + host); // getting the instance of the website
  await page.addScriptTag({ // Librabry for dom manipulation and colour contrast
    path: "node_modules/accessibility-developer-tools/dist/js/axs_testing.js"
  })
  await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' }) // adding jquery

  // Gettign all cookie details 
  let cookieInfo = await page._client.send('Network.getAllCookies');
  const securityDetails = await response.securityDetails()
  //console.log(securityDetails)
 
// Tab Index violation check
// Best practice: 
// All interactive elements should have tabindex 0, means its focusable
// All tab index should be either 0 or -1
  const tabIndex_violaitons = await page.evaluate(() => {
    let interactive_content = ["a", "button", "details", "embed", "iframe", "keygen", "label", "select", "textarea"]
    var elements = []
    var violations = { "intViolations": [], "tabIndexViolations": [] }
    var all = document.getElementsByTagName("*");

    for (var i = 0, max = all.length; i < max; i++) {
      elements.push(all[i])
    }

    for (var i in elements) {
      if (interactive_content.includes(elements[i].tagName.toLowerCase()) && Number(elements[i].tabIndex) === -1) { // checking whether interactive element is focusable or not 
        violations["intViolations"].push(elements[i].outerHTML)
      }
      if (elements[i].tabIndex !== 0 && elements[i].tabIndex !== -1) { // checking for tab index 0 and -1
        violations["tabIndexViolations"].push(elements[i].outerHTML)
      }
    }
    return violations
  })



  // Alternate text score calculation.
  // Best practice: All image should have alternative text
  const alts = await page.evaluate(() => {
    var score = 0;
    var ViolatedTags = []
    data = document.getElementsByTagName('img') //getting all image elements
    for (const [key, val] of Object.entries(data)) {
      if (val.alt.trim() !== '') { // Checking if alternative text is there or not
        score += 1;
      }else{
        ViolatedTags.push(val.outerHTML) // no alternative text found 
      }
    }
    return {
      "totalimg": data.length, // total images present
      "score": score,         // Number of images with alternative text
      "ViolatedTags": ViolatedTags // Images with no alternative text
    }
  })

  // Heading Violation Check
  // Best Practice:
  // Heading should be descriptive means every heading starting word should be different from each other.
  // Heading should start with H1
  // Two consecutive heading tags difference should not be more than 1

  const headers = await page.evaluate(() => {
    var headings = $("h1, h2, h3, h4, h5, h6")
    var items = [] 
    var prevLevel
    var dict = {}
    var previousL = {}
    var prvHeading
    headings.each((i, el) => {
      var $el = $(el)
      var level = +$el.prop('tagName').slice(1)
      var content = $el.prop('innerText').split(" ")[0]
      if(content!=='') // checking for descriptive heading
      {
      if (dict[content] != null && level!== dict[content]) {
        items.push({ "Error":"Repeating header names", "level":[dict[content], level] ,"html":el.outerHTML, "type":"2", "htmlprv":previousL[content]})
      }
      dict[content] = level
      
      var k = el.outerHTML
      previousL[content] = "" + k 
      }
      if (i === 0 && level !== 1) { // checking for h1 and non consecutive header
        items.push({ "Error":"H1 not present", "level":[level], "html":el.outerHTML,"type":"1"});
      } else if (prevLevel && level - prevLevel > 1) {
        items.push({ "Error": "Non consecutive headers present", "level": [prevLevel, level], "html": el.outerHTML, "type": "3", "htmlprv": prvHeading });
      }
      prevLevel = level;
      prvHeading = el.outerHTML;

    })

    return items;
  })
  console.log(headers)

  // Evaluating the text contrast in a website
  // Ref: https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Perceivable/Color_contrast
  let contrast = await page.evaluate(() => {
    let results = [];

    $("*").each((i, element) => {
      // Only check elements with a direct text descendant
      if (!axs.properties.hasDirectTextDescendant(element)) {
        return;
      }
      // Ignore invisible elements
      if (axs.utils.elementIsTransparent(element) ||
        axs.utils.elementHasZeroArea(element)) {
        return;
      }

      let style = getComputedStyle(element);
      let bgColor = axs.utils.getBgColor(style, element);
      let fgColor = axs.utils.getFgColor(style, element, bgColor);
      let requiredAARatio = axs.utils.isLargeFont(style) ?
        3.0 : 4.5;
      let requiredAAARatio = axs.utils.isLargeFont(style) ?
        4.5 : 7;
      let contrastRatio = axs.color.calculateContrastRatio(
        fgColor, bgColor).toFixed(2);

      let aacompliance = (contrastRatio >= requiredAARatio) ? true : false;
      let aaacompliance = (contrastRatio >= requiredAAARatio) ? true : false;

      let suggestionsAA = aacompliance ? "No AA contrast issues" : axs.color.suggestColors(
        bgColor,
        fgColor,
        { AA: requiredAARatio }).AA;

      let suggestionsAAA = aaacompliance ? "No AAA contrast issues" : axs.color.suggestColors(
        bgColor,
        fgColor,
        { AAA: requiredAAARatio }).AAA;

      if (!aaacompliance || !aaacompliance) {
        results.push({
          "innerHTML": element.innerHTML,
          "outerHTML": element.outerHTML,
          "Background Color": bgColor,
          "Text Color": fgColor,
          "Contrast Ratio": contrastRatio,
          "AA Compliance": aacompliance,
          "AAA Compliance": aaacompliance,
          "AA Suggestions": suggestionsAA,
          "AAA Suggestions": suggestionsAAA
        })
      }
    })

    return results;
  })


  // Labeling Violation check
  // Best practices: All input should have respective label
  const labels = await page.evaluate(() => {
    var allInput = document.getElementsByTagName("input");
    var allLabel = document.getElementsByTagName("label, aria-label");
    var control_violation = []
    var dict = {}
    for (var i = 0, max = allLabel.length; i < max; i++) {
      dict[allLabel[i].getAttribute("for")] = "exists";
    }
    for (var j = 0, max2 = allInput.length; j < max2; j++) {
      if (!(allInput[j].id in dict) && allInput[j].id !== '') {
        control_violation.push({ "ID": allInput[j].id, "html": allInput[j].outerHTML })
      }
    }
    return control_violation
  })

  // Cookie Consent and Manage Check
  // getting classes which has cookie as a name or id 
  // checking inside that class if we have buttons for consent and manage cookie or not
  const cookie_consent = await page.evaluate(() => {
    var div_id = []
    var buttons
    $("[id*='consent' i], [class*='consent' i], [class*='cookie' i], [id*='cookie' i]").each((i, el) => {
      buttons = $(el).find('button') // getting all child buttons of cookie class
      for (const [key, val] of Object.entries(buttons)) {
        div_id.push(val.innerText) // gettin text written on the buttons
      }
      atags = $(a).find('a') // getting all child buttons of cookie class
      for (const [key, val] of Object.entries(buttons)) {
        if(val.role === 'button')
        div_id.push(val.innerText) // gettin text written on the buttons
      }
    })
    return div_id
  })


  // Getting cookie information link from the website footer
  const cookie_settings = await page.evaluate(() => {
    var cookie_href = []
    var flag = false
    var alls
    $("footer").each((i, el) => {
      alls = $(el).find('*')
      for (const [key, val] of Object.entries(alls)) {
        if (val.innerText != "null" && val.innerText !== '' && RegExp('Cookie', 'i').test(val.innerText)) { // checking if the footer has element cookie
          if (String(val.tagName) === "A") {
            cookie_href.push(val['href'])
            flag = true
          }
          
        }
      }
    })
    return cookie_href
  })

// if footer doesn't have cookie info the checking for the class with id or name as cookie in the website
  const cookie_settingsall = await page.evaluate(() => {
    var cookie_href = []
    var flag = false
    var alls
    $("[class*='cookie' i], [id*='cookie' i]").each((i, el) => {
      alls = $(el).find("*")
      for (const [key, val] of Object.entries(alls)) {
          if (String(val.tagName) === "A") {
            cookie_href.push(val['href'])
            flag = true
          }
          
      }
    })
    return cookie_href // all links inside cookie class and text also cookie
  })

  var buttons = cookie_consent, consent_flag = -1, manage_flag = -1, hrefs = new Set(cookie_settings)
  hrefs = Array.from(hrefs)
  var consent_word = [/^ok/i, /^okay/i, /^accept/i, /^got/i, /^allow/i] // cookie consent checking keywords 
  var manage_word = [/manage/i, /custom/i, /setting/i] // cookie manage keywords
  var f = -1
  for (var i = 0; i < buttons.length; i++) {
    if (consent_word.some(r => r.test(buttons[i]))) {
      consent_flag = i
    }

    if (manage_word.some(r => r.test(buttons[i]))) {
      manage_flag = i
    }

  }
  var cookieDetailPage = ""
  // cookie conscent and manage
  if (consent_flag !== -1) {
    console.log("Consent!!")
  } else {
    console.log("No Consent Found")
  }

  if (manage_flag !== -1 && manage_flag !== consent_flag) {
    console.log("Manage Cookie!!")
  } else {
    console.log("No Cookie Manage")
  }

  // cookie information check from Footer
  for (var j = 0; j < hrefs.length; j++) {
    if (hrefs.length == 1) {
      f = 0
      cookieDetailPage = hrefs[j]
      console.log("Check for more Cookie info", hrefs[j]);
    } else
      if (RegExp('Cookie', 'i').test(hrefs[j])) {
        f = 0
        cookieDetailPage = hrefs[j]
        console.log("Check for more Cookie info", hrefs[j]);
        break;
      }
  }
  // cookie information check in cookie class
  if (f === -1) {
    var list2 = new Set(cookie_settingsall)
    list2 = Array.from(list2)
    if (list2.length === 0)
      console.log("No Cookie info")
    else {
      for (var j = 0; j < list2.length; j++) {
        if (list2.length == 1) {
          f = 0
          cookieDetailPage = list2[j]
          console.log("Check for more Cookie info", list2[j]);
        } else
          if (RegExp('Cookie', 'i').test(list2[j])) {
            f = 0
            cookieDetailPage = list2[j]
            console.log("Check for more Cookie info", list2[j]);
            break;
          }
      }
      
    }
  }
  // if cookie information link is not found in footer neither in cookie class
  if (f === -1){
      console.log("No Cookie info")
  }
  // all cookie details  
  var cookieDetails = {
    cookieInfo,
    cookieConsent: (consent_flag === -1) ? (false) : (true),
    cookieManagement: (manage_flag === -1) ? (false) : (true),
    cookieDetailPage
  };
  await browser.close();

  return {
    securityDetails,
    cookieDetails,
    adaCompliance: {
      labels: labels,
      tab_Violations: tabIndex_violaitons,
      altImageText: alts,
      headers: headers,
      contrast: contrast
    }
  }
};