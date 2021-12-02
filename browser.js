const puppeteer = require('puppeteer');
const j = require('jquery')

module.exports = instance = async (host) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto('https://' + host);
  await page.addScriptTag({
    path: "node_modules/accessibility-developer-tools/dist/js/axs_testing.js"
  })
  await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' })
  let interactive_content = ["a", "button", "details", "embed", "iframe", "keygen", "label", "select", "textarea"]
  // console.log(page);

  // Cookie in details printed
  let cookieInfo = await page._client.send('Network.getAllCookies');

  // const extractedText = await page.$eval('*', (el) => el.innerText);
  // var consent = RegExp('Cookie', 'i').test(extractedText.trim());
  // console.log("The browser has cookie consent? ", consent)

  // Tab Index violation check

  const tabIndex_v = await page.evaluate(() => {
    var tabIndex = []
    var tag = []
    var all = document.getElementsByTagName("*");

    for (var i = 0, max = all.length; i < max; i++) {
      tabIndex.push(all[i].tabIndex);
      tag.push(all[i].tagName)
      // console.log(all[i].tabIndex);
    }
    return {
      "tabIndex": tabIndex,
      "tag": tag
    }
  })
  var x = tabIndex_v
  var int_violation = 0
  var tabIndex_violation = 0
  for (var i in x['tabIndex']) {
    if (interactive_content.includes(x['tag'][i].toLowerCase())) {
      if (Number(x['tabIndex'][i]) === -1) {
        int_violation += 1;
        // console.log("Violations: ", x['tag'][i]);
      }

    }
    if (x['tabIndex'][i] !== 0 && x['tabIndex'][i] !== -1) {
      tabIndex_violation += 1
    }
    //console.log(x['tabIndex'][i],"  ", x['tag'][i]);
  }

  console.log("Number of Interactive Elements Violations: ", int_violation)
  console.log("Number of tabIndex violations: ", tabIndex_violation)
  // for(var i in x)
  // {
  //   console.log(x[i]);
  // }

  // Alternate text score calculation.
  const alts = await page.evaluate(() => {
    var score = 0;
    data = document.getElementsByTagName('img')
    for (const [key, val] of Object.entries(data)) {
      if (val.alt.trim() !== '') {
        score += 1;
      }
    }
    return {
      "totalimg": data.length,
      "score": score
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
    // key : innerText, val : H tag level
    headings.each((i, el) => {
      var $el = $(el)
      var level = +$el.prop('tagName').slice(1)
      var content = $el.prop('innerText').split(" ")[0]
      if (dict[content] != null) {
        items.push({ "repeating header name at": dict[content], level })
      }
      dict[content] = level
      if (i === 0 && level !== 1) {
        items.push({ "H1 not present, instead starts from ": level });
      } else if (prevLevel && level - prevLevel > 1) {
        items.push({ "Non consecutive headers present at ": prevLevel, level });
      }
      prevLevel = level;

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

      // Ignore elements that are part of the tota11y UI
      if ($(element).parents(".tota11y").length > 0) {
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
  console.log(contrast);

  // Labeling Control
  const labels = await page.evaluate(() => {
    var allInput = document.getElementsByTagName("input");
    var allLabel = document.getElementsByTagName("label");
    var control_violation = []
    var flag
    var dict = {}
    for (var i = 0, max = allLabel.length; i < max; i++) {
      dict[allLabel[i].getAttribute("for")] = "exists";
    }
    for (var j = 0, max2 = allInput.length; j < max2; j++) {
      if (!(allInput[j].id in dict) && allInput[j].id!=='') {
        control_violation.push(allInput[j].id)
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
  if (f === -1){
      console.log("No Cookie info")
  }
  var cookieDetails = {
    cookieInfo,
    cookieConsent : (consent_flag===-1) ? (false) : (true),
    cookieManagement: (manage_flag===-1) ? (false) : (true),
    cookieDetailPage
  };
  await browser.close();

  return {
    cookieDetails,
    adaCompliance: {
      labels: labels,
      tabIndex: {
        violation: tabIndex_violation,
        violationCount: int_violation
      },
      altImageText: alts,
      headers: headers,
      contrast: contrast
    }
  }
};