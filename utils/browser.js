const puppeteer = require('puppeteer'); // for simulating browser in node

module.exports = instance = async (host) => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });
  const page = await browser.newPage();
  //await page.setDefaultNavigationTimeout(0);
  const response = await page.goto('http://' + host.searchUrl); // getting the instance of the website
  await page.addScriptTag({ // Librabry for dom manipulation and colour contrast
    path: "node_modules/accessibility-developer-tools/dist/js/axs_testing.js"
  })
  await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' }) // adding jquery

  // Gettign all cookie details 
  // let cookieInfo
  const securityDetails = await (host.ssl) ? (response.securityDetails()) : null
  //console.log(securityDetails)

  // Tab Index violation check
  // Best practice: 
  // All interactive elements should have tabindex 0, means its focusable
  // All tab index should be either 0 or -1
  const tabIndex_violaitons = await page.evaluate(() => {
    let interactive_content = ["a", "button", "details", "embed", "iframe", "keygen", "label", "select", "textarea"]
    var elements = []
    var violations = { "intViolations": [], "tabIndexViolations": [], "debug": [] }
    var all = document.getElementsByTagName("*");

    for (var i = 0, max = all.length; i < max; i++) {
      elements.push(all[i])
    }

    for (var i in elements) {
      if (interactive_content.includes(elements[i].tagName.toLowerCase()) && Number(elements[i].tabIndex) == -1) { // checking whether interactive element is focusable or not 
        violations["intViolations"].push(elements[i].outerHTML)
        violations["debug"].push(elements[i].tabIndex)
        //violations["intViolations"].push(elements[i].tabIndex)
      }
      if (elements[i].tabIndex !== 0 && elements[i].tabIndex !== -1) { // checking for tab index 0 and -1
        violations["tabIndexViolations"].push(elements[i].outerHTML)
      }
    }
    return violations
  })
  console.log(tabIndex_violaitons);


  // Alternate text score calculation.
  // Best practice: All image should have alternative text
  const alts = await page.evaluate(() => {
    var score = 0;
    var ViolatedTags = []
    data = document.getElementsByTagName('img') //getting all image elements
    for (const [key, val] of Object.entries(data)) {
      if (val.alt.trim() !== '') { // Checking if alternative text is there or not
        score += 1;
      } else {
        ViolatedTags.push(val.outerHTML) // no alternative text found 
      }
    }
    return {
      "totalimg": (ViolatedTags.length + score), // total images present
      "score": ViolatedTags.length,         // Number of images with alternative text
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
      if (content !== '') // checking for descriptive heading
      {
        if (dict[content] != null && level !== dict[content]) {
          items.push({ "Error": "Repeating header names", "level": [dict[content], level], "html": el.outerHTML, "type": "2", "htmlprv": previousL[content] })
        }
        dict[content] = level

        var k = el.outerHTML
        previousL[content] = "" + k
      }
      if (i === 0 && level !== 1) { // checking for h1 and non consecutive header
        items.push({ "Error": "H1 not present", "level": [level], "html": el.outerHTML, "type": "1" });
      } else if (prevLevel && level - prevLevel > 1) {
        items.push({ "Error": "Non consecutive headers present", "level": [prevLevel, level], "html": el.outerHTML, "type": "3", "htmlprv": prvHeading });
      }
      prevLevel = level;
      prvHeading = el.outerHTML;

    })

    return items;
  })
  // console.log(headers)

  // Evaluating the text contrast in a website
  // Ref: https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Perceivable/Color_contrast
  let contrast = await page.evaluate(() => {
    if (typeof (axs) === "undefined") {
      return null
    }
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
    var allLabel = document.querySelectorAll("label, aria-label");
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
    $("*").each((i, el) => {
      for (var i = 0, atts = el.attributes, n = atts.length, arr = []; i < n; i++) {
        if (atts[i]) {
          if (RegExp('Cookie', 'i').test(atts[i].nodeValue) || RegExp('Consent', 'i').test(atts[i].nodeValue)) {
            // div_id.push(atts[i].nodeValue)
            buttons = $(el).find('*') // getting all child buttons of cookie class

            for (const [key, val] of Object.entries(buttons)) {
              if (val && ((val.tagName === 'BUTTON') || ($(val).attr("role")==="button")))
                div_id.push(val.innerText) // getting text written on the buttons
            }

            break
          }
        }
      }
    })

    return div_id
  })


  // Getting cookie information link from the website footer
  const cookie_settings = await page.evaluate(() => {
    var cookie_href = []
    var alls
    $("footer").each((i, el) => {
      alls = $(el).find('*')
      for (const [key, val] of Object.entries(alls)) {
        if (val && val.innerText !== '' && (RegExp('Cookie', 'i').test(val.innerText))) { // checking if the footer has element cookie
          if (String(val.tagName) === "A") {
            var suggUrl
            if (val['href'][val['href'].length - 1] === '#') {
              suggUrl = val['href'].slice(0, val['href'].length - 1)
            }
            if (suggUrl !== document.URL)
              cookie_href.push(val['href'])
          }

        }
      }
    })
    return cookie_href
  })

  // if footer doesn't have cookie info the checking for the class with id or name as cookie in the website
  const cookie_settingsall = await page.evaluate(() => {
    var cookie_href = []
    var atags
    $("*").each((i, el) => {
      for (var i = 0, atts = el.attributes, n = atts.length; i < n; i++) {
        if (RegExp('Cookie', 'i').test(atts[i].nodeValue) || RegExp('Consent', 'i').test(atts[i].nodeValue)) {
          atags = $(el).find('a') // getting all child buttons of cookie class
          for (const [key, val] of Object.entries(atags)) {
            if (RegExp('Cookie', 'i').test(String(val['href'])) || RegExp('Cookie', 'i').test(val.innerText) || RegExp('Privacy', 'i').test(String(val['href']) + val.innerText)) {
              var suggUrl
              if (val['href'][val['href'].length - 1] === '#') {
                suggUrl = val['href'].slice(0, val['href'].length - 1)
              }
              if (suggUrl !== document.URL)
                cookie_href.push(val['href'])
            }
          }
          break
        }
      }
    })
    return cookie_href // all links inside cookie class and text also cookie
  })

  function cookieFlags() {
    var consent_word = [/^ok/i, /^okay/i, /^accept/i, /^got/i, /^allow/i]           // cookie consent checking keywords 
    var manage_word = [/manage/i, /custom/i, /setting/i]                            // cookie manage keywords
    var cookieButtons = cookie_consent
    var consent_flag = false, manage_flag = false

    for (var i = 0; i < cookieButtons.length; i++) {
      if (consent_word.some(r => r.test(cookieButtons[i]))) {
        consent_flag = true
      }
      if (manage_word.some(r => r.test(cookieButtons[i]))) {
        manage_flag = true
      }
    }
    return { consent_flag, manage_flag }
  }

  function cookieDetailsLink() {
    var footerHrefs = cookie_settings
    var allHrefs = cookie_settingsall
    var flag = false
    var cookieDetailPage = ""
    // cookie information check from Footer
    console.log(footerHrefs)
    console.log(cookie_settingsall)
    if (footerHrefs.length > 0) {
      flag = true
      cookieDetailPage = footerHrefs[0]
      console.log("Check for more Cookie info", footerHrefs[0]);
    }


    // cookie information check in cookie class
    if (!flag) {
      for (var j = 0; j < allHrefs.length; j++) {
        if (RegExp('Cookie', 'i').test(allHrefs[j])) {
          flag = true
          cookieDetailPage = allHrefs[j]
          console.log("Check for more Cookie info", allHrefs[j]);
          break;
        }
      }
      if (!flag && allHrefs.length > 0) {
        flag = true
        cookieDetailPage = allHrefs[0]
        console.log("Check for more Cookie info", allHrefs[0]);
      }
    }

    return cookieDetailPage
  }
  // cookie conscent and manage
  // if (consent_flag) {
  //   console.log("Consent!!")
  // } else {
  //   console.log("No Consent Found")
  // }

  // if (manage_flag && manage_flag !== consent_flag) {
  //   console.log("Manage Cookie!!")
  // } else {
  //   console.log("No Cookie Manage")
  // }

  // if cookie information link is neither found in footer nor in cookie class
  // if (flag === -1){
  //     console.log("No Cookie info")
  // }
  // all cookie details  
  var cookieDetails = (host.cookie) ? ({
    cookieInfo: await page._client.send('Network.getAllCookies'),
    cookieConsent: cookieFlags().consent_flag,
    cookieManagement: cookieFlags().manage_flag,
    cookieDetailPage: cookieDetailsLink()
  }) : null

  var adaCompliance = (host.ada) ? ({
    labels: labels,
    tab_Violations: tabIndex_violaitons,
    altImageText: alts,
    headers: headers,
    contrast: contrast
  }) : null
  await browser.close();

  return {
    securityDetails,
    cookieDetails,
    adaCompliance
  }
};