const puppeteer = require('puppeteer');

module.exports = instance = async (host) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto('https://' + host);
  await page.addScriptTag({
    path: "node_modules/accessibility-developer-tools/dist/js/axs_testing.js"
  })
  await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' })

  // console.log(page);

  // Cookie in details printed
  let cookieInfo = await page._client.send('Network.getAllCookies');

  // const extractedText = await page.$eval('*', (el) => el.innerText);
  // var consent = RegExp('Cookie', 'i').test(extractedText.trim());
  // console.log("The browser has cookie consent? ", consent)

  // Tab Index violation check

  const tabIndex_violaitons = await page.evaluate(() => {
    let interactive_content = ["a", "button", "details", "embed", "iframe", "keygen", "label", "select", "textarea"]
    var elements = []
    var violations = { "intViolations": [], "tabIndexViolations": [] }
    var all = document.getElementsByTagName("*");

    for (var i = 0, max = all.length; i < max; i++) {
      elements.push(all[i])
    }

    for (var i in elements) {
      if (interactive_content.includes(elements[i].tagName.toLowerCase()) && Number(elements[i].tabIndex) === -1) {
        violations["intViolations"].push(elements[i].outerHTML)
      }
      if (elements[i].tabIndex !== 0 && elements[i].tabIndex !== -1) {
        violations["tabIndexViolations"].push(elements[i].outerHTML)
      }
    }
    return violations
  })

  console.log("Number of Tab Violations: ", tabIndex_violaitons)
  // for(var i in x)
  // {
  //   console.log(x[i]);
  // }

  // Alternate text score calculation.
  const alts = await page.evaluate(() => {
    var score = 0;
    var ViolatedTags = []
    data = document.getElementsByTagName('img')
    for (const [key, val] of Object.entries(data)) {
      if (val.alt.trim() !== '') {
        score += 1;
      } else {
        ViolatedTags.push(val.outerHTML)
      }
    }
    return {
      "totalimg": data.length,
      "score": score,
      "ViolatedTags": ViolatedTags
    }
  })

  console.log("Alternate Image Violations: ", alts)

  // Getting list of hyperlinks.
  // const urls = await page.evaluate(() => {
  //   var urlList = [];
  //   data = document.getElementsByTagName('a')
  //   for (const [key, val] of Object.entries(data)) {
  //     urlList.push(val.href)
  //   }
  //   return urlList
  // })
  // console.log(urls)
  // heading control

  const headers = await page.evaluate(() => {
    // var headings = document.getElementsByTagName("h")
    var headings = $("h1, h2, h3, h4, h5, h6")
    var items = []
    var prevLevel
    var dict = {}
    var previousL = {}
    var prvHeading
    // key : innerText, val : H tag level
    // Error: "blabla", Level: "blabla", html: "blabla"
    headings.each((i, el) => {
      var $el = $(el)
      var level = +$el.prop('tagName').slice(1)
      var content = $el.prop('innerText').split(" ")[0]
      if (content !== '') {
        if (dict[content] != null && level !== dict[content]) {
          items.push({ "Error": "Repeating header names", "level": [dict[content], level], "html": el.outerHTML, "type": "2", "htmlprv": previousL[content] })
        }
        dict[content] = level

        var k = el.outerHTML
        previousL[content] = "" + k
      }
      if (i === 0 && level !== 1) {
        items.push({ "Error": "H1 not present", "level": [level], "html": el.outerHTML, "type": "1" });
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
  // console.log(contrast);

  // Labeling Control
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
  console.log("Violated Lables", labels)
  // Cookie Consent and Manage
  const cookie_consent = await page.evaluate(() => {
    var div_id = []
    var buttons
    $("[id*='consent' i], [class*='consent' i], [class*='cookie' i], [id*='cookie' i]").each((i, el) => {
      // div_id.push(el.id)
      // if(RegExp('Cookie','i').test(el.innerText.trim()))
      // {
      buttons = $(el).find('button')
      for (const [key, val] of Object.entries(buttons)) {
        div_id.push(val.innerText)
      }
    })
    return div_id
  })


  // //Cookie Settings

  // console.log(cookie_settings)
  const cookie_settings = await page.evaluate(() => {
    var cookie_href = []
    var flag = false
    var alls
    $("footer").each((i, el) => {
      alls = $(el).find('*')
      for (const [key, val] of Object.entries(alls)) {
        if (val.innerText != "null" && val.innerText !== '' && RegExp('Cookie', 'i').test(val.innerText)) {
          if (String(val.tagName) === "A") {
            cookie_href.push(val['href'])
            flag = true
          }
          // div_id.push(val.tagName)
        }
      }
      // }
    })
    return cookie_href
    // return div_id
  })

  const cookie_settingsall = await page.evaluate(() => {
    var cookie_href = []
    var flag = false
    var alls
    $("[class*='cookie' i], [id*='cookie' i]").each((i, el) => {
      alls = $(el).find("*")
      for (const [key, val] of Object.entries(alls)) {
        if (val.innerText != "null" && val.innerText !== '' && RegExp('Cookie', 'i').test(val.innerText)) {
          if (String(val.tagName) === "A") {
            cookie_href.push(val['href'])
            flag = true
          }
          // div_id.push(val.tagName)
        }
      }
      // }
    })
    return cookie_href
    // return div_id
  })
  // console.log(cookie_settings)
  //const footerText = await page.$eval('footer', (el) => el.innerText);
  //var cookie_settings = RegExp('Cookie','i').test(footerText.trim());

  //var links = cookie_settings
  var buttons = cookie_consent, consent_flag = -1, manage_flag = -1, hrefs = new Set(cookie_settings)
  hrefs = Array.from(hrefs)
  var consent_word = [/^ok/i, /^okay/i, /^accept/i, /^got/i, /^allow/i]
  var manage_word = [/manage/i, /custom/i, /setting/i]
  var f = -1
  for (var i = 0; i < buttons.length; i++) {
    if (consent_word.some(r => r.test(buttons[i]))) {
      consent_flag = i
      //console.log("Consent", buttons[i])
    }

    if (manage_word.some(r => r.test(buttons[i]))) {
      manage_flag = i
      // console.log("Manage",buttons[i])
    }

  }
  var cookieDetailPage = ""

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

  // for Footer
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
      //console.log("Check for more Cookie info", list2[list2.length-1]);
    }
  }
  if (f === -1) {
    console.log("No Cookie info")
  }
  var cookieDetails = {
    cookieInfo,
    cookieConsent: (consent_flag === -1) ? (false) : (true),
    cookieManagement: (manage_flag === -1) ? (false) : (true),
    cookieDetailPage
  };
  await browser.close();

  return {
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