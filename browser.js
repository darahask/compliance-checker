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
  let interactive_content = ["a", "button", "details", "embed", "iframe", "keygen", "label", "select", "textarea"]
  // console.log(page);
  const cookies = await page.evaluate(() => {
    return {
      allCookies: document.cookie,
    };
  });
  console.log(cookies);

  const extractedText = await page.$eval('*', (el) => el.innerText);
  var consent = RegExp('Cookie', 'i').test(extractedText.trim());
  console.log("The browser has cookie consent? ", consent)

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
  const urls = await page.evaluate(() => {
    var urlList = [];
    data = document.getElementsByTagName('a')
    for (const [key, val] of Object.entries(data)) {
      urlList.push(val.href)
    }
    return urlList
  })
  console.log(urls)

  const headers = await page.evaluate(() => {
    // var headings = document.getElementsByTagName("h")
    var headings = $("h1, h2, h3, h4, h5, h6")
    var items = []
    var prevLevel
    headings.each((i, el) => {
      var $el = $(el)
      var level = +$el.prop('tagName').slice(1)
      if (i === 0 && level !== 1) {
        items.push({ "FIRST_NOT_H1": level });
      } else if (prevLevel && level - prevLevel > 1) {
        items.push({ "NONCONSECUTIVE_HEADER ": prevLevel, level });
      }

      prevLevel = level;
    })

    return items
  })
  console.log(headers)

  // Evaluating the text contrast in a website
  // Ref: https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Perceivable/Color_contrast
  let contrast = await page.evaluate(() => {
    let results = [];
    let elements = document.getElementsByTagName("*");
    elements.forEach((element, i) => {

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

    })
    return results;
  })
  console.log(contrast);

  await browser.close();

};