let loadADA = (data, url) => {
    let HTML = `<div class="m-2"><h1>🌈 ADA Compliance details for <a href="http://${url}">${url}</a></h1></div>`
    if (data) {
        HTML += `<center><div class="btn-group m-4" role="group" aria-label="Basic checkbox toggle button group">
                <input type="checkbox" class="btn-check" id="btncheck1" autocomplete="off">
                <label class="btn btn-outline-primary" for="btncheck1">Alt Image Text</label>
            
                <input type="checkbox" class="btn-check" id="btncheck2" autocomplete="off">
                <label class="btn btn-outline-secondary" for="btncheck2">Label violation</label>
            
                <input type="checkbox" class="btn-check" id="btncheck3" autocomplete="off">
                <label class="btn btn-outline-warning" for="btncheck3">Headers Violation</label>`

        if (data.contrast) {
            HTML += `<input type="checkbox" class="btn-check" id="btncheck4" autocomplete="off">
                <label class="btn btn-outline-info" for="btncheck4">Contrast Violation</label>`
        }

        HTML += `<input type="checkbox" class="btn-check" id="btncheck5" autocomplete="off">
                <label class="btn btn-outline-danger" for="btncheck5">Tab Violations</label>
            </div></center>`

        HTML += `<div id="image-compliance" hidden>`
        let imageInfo = '';
        data.altImageText.ViolatedTags.forEach((el, i) => {
            imageInfo += `<div class="m-2">
            <p style="color:${errorColor}"><b>Image alt text violation</b></p>
            <textarea readonly class="form-control" placeholder="Leave a comment here" id="labelhtml${i}">${el.trim()}</textarea>
        </div>`
        })
        if(data.altImageText.score===0)
        {
            imageInfo +=  `<p style="color:${positiveColor}"><b>No image without alternative text found.</b></p>`
        }
        imageInfo += `
        <ul>
            <li style="color:${suggestionColor}"><b>Suggestion: Provide alt text to the images</b></li>
        </ul>
    `
        HTML +=
            `   <div class="accordion accordion-flush border border-dark m-2" id="accordionImage">
            <div class="accordion-item">
                <h2 class="accordion-header" id="flush-headingOneImage">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOneImage" aria-expanded="false" aria-controls="flush-collapseOneImage">
                <p>Total number of images present in the website are ${data.altImageText.totalimg} <br>
                `
        if(data.altImageText.score){
            HTML += `<span>Number of images which do not have alt-text are <strong style="color:${errorColor}">${data.altImageText.score}</strong></span></p>`
        }else{
            HTML += `<span>Number of images which do not have alt-text are <strong style="color:${positiveColor}">${data.altImageText.score}</strong></span></p>`
        }
        HTML+=`
                
                </button>
                </h2>
                <div id="flush-collapseOneImage" class="accordion-collapse collapse" aria-labelledby="flush-headingOneImage" data-bs-parent="#accordionImage">
                <div class="accordion-body">
                    ${imageInfo}
                </div>
            </div>
            </div>
            </div>
        `

        HTML += `</div>`

        let violations = ''
        data.tab_Violations.intViolations.forEach((el, i) => {
            violations += `<div class="m-2">
            <p style="color:${errorColor}"><b>Interactive element violation</b></p>
            <label for="labeltab${i}"></label>
            <textarea readonly class="form-control" placeholder="Leave a comment here" id="labeltab${i}">${el.trim()}</textarea>
        </div>`
        })
        if(data.tab_Violations.tabIndexViolations.length===0)
        {
            violations +=  `<p style="color:${positiveColor}"><b>No tabIndex with value > 0 </b></p>`
        }
        if(data.tab_Violations.intViolations.length===0)
        {
            violations +=  `<p style="color:${positiveColor}"><b>All interactive elements are tab focusable</b></p>`
        }

        violations += `
                    <p style="color:${suggestionColor}"><b>Suggestion: All interactive elements should be tab focusable</b></p>
                   `
        data.tab_Violations.tabIndexViolations.forEach((el, i) => {
            violations += `<div class="m-2">
            <p style="color:${errorColor}"><b>Tab Index violation</b></p>
            <label for="labeltab${i}"></label>
            <textarea readonly class="form-control" placeholder="Leave a comment here" id="labeltab${i}">${el.trim()}</textarea>
        </div>`
        })
        violations += `<p style="color:${suggestionColor}"><b>Suggestion: The tab index must be either 0 or -1</b></p>`
        HTML += `<div class="accordion accordion-flush border border-dark m-2" id="accordionTab" hidden>
                <div class="accordion-item">
                <h2 class="accordion-header" id="flush-headingOneTab">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseOneTab" aria-expanded="false" aria-controls="flush-collapseOneTab">
                   <p> Tab-Index Violations: `
        if(data.tab_Violations.tabIndexViolations.length){
            HTML += `<strong style="color:${errorColor}">${data.tab_Violations.tabIndexViolations.length}</strong>`
        }else{
            HTML += `<strong style="color:${positiveColor}">${data.tab_Violations.tabIndexViolations.length}</strong>`
        }
        HTML += `</br><span>InterativeElements Violations: `
        if(data.tab_Violations.intViolations.length){
            HTML += `<strong style="color:${errorColor}">${data.tab_Violations.intViolations.length}</strong></span></p>`
        }else{
            HTML += `<strong style="color:${positiveColor}">${data.tab_Violations.intViolations.length}</strong></span></p>`
        }
        HTML +=  `</button>
                </h2>
                <div id="flush-collapseOneTab" class="accordion-collapse collapse" aria-labelledby="flush-headingOneTab"
                    data-bs-parent="#accordionTab">
                    <div class="accordion-body">
                    ${violations}
                    </div>
                </div>
                </div>
            </div>`


        let labelInfo = '';
        data.labels.forEach((el, i) => {
            labelInfo += `<div class="m-2">
            <p style="color:${errorColor}"><b>ID of the input tag: ${el.ID}</b></p>
            <label for="labelhtml${i}"></label>
            <textarea readonly class="form-control" placeholder="Leave a comment here" id="labelhtml${i}">${el.html.trim()}</textarea>
        </div>`
        })
        if(data.labels.length===0)
        {
            labelInfo +=  `<p style="color:${positiveColor}"><b>No input found without label.</b></p>`
        }
        HTML +=
            `   <div class="accordion accordion-flush border border-dark m-2" id="accordionLabel" hidden>
            <div class="accordion-item">
                <h2 class="accordion-header" id="flush-headingOneLabel">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOneLabel" aria-expanded="false" aria-controls="flush-collapseOneLabel">

                Inputs which do not have labels are: `
                if(data.labels.length){
                    HTML += `<strong style="color:${errorColor}">${data.labels.length}</strong>`
                }else{
                    HTML += `<strong style="color:${positiveColor}">${data.labels.length}</strong>`
                }
        HTML+= `
                </button>
                </h2>
                <div id="flush-collapseOneLabel" class="accordion-collapse collapse" aria-labelledby="flush-headingOneLabel" data-bs-parent="#accordionLabel">
                <div class="accordion-body">
                    ${labelInfo}
                    <strong style="color:${suggestionColor}">Suggestion: Every Input should have respective labels </strong>
                </div>
            </div>
            </div>
            </div>
            `
        HTML += "<div id='headers-compliance' hidden class='border border-dark m-2'>"
        let repeatHeader = '';
        let nonConsecutiveHeader = '';
        data.headers.forEach((el, i) => {
            if (el.type === "1") {

                HTML +=
                    `   <div class="accordion accordion-flush" id="accordionFlushExample">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="flush-headingOne">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                    ${el.Error}
                    </button>
                    </h2>
                    <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                    <div class="accordion-body">
                    <ul>
                    <li style="color:${errorColor}">${el.Error + " instead it started with H" + el.level[0]}</li>
                    </ul> 
                    Detail:
                    <div class="form-floating">
                    <textarea readonly class="form-control" placeholder="Leave a comment here" id="floatingTextarea">${el.html}</textarea>
                    <strong style="color:${suggestionColor}">Suggestion: Heading should start with H1 </strong>
                    <label for="floatingTextarea"></label>
                    </div>
                   </div>
                </div>
                </div>
                </div>
            `
            } else if (el.type === "2") {
                repeatHeader += `<ul>
                            <li style="color:${errorColor}"><strong>${el.Error + " at H" + el.level[0] + " at H" + el.level[1]}</strong></li>
                            </ul> 
                            <div class="form-floating">
                            ${"H" + el.level[0] + ": Details"}
                            <textarea readonly class="form-control" placeholder="Leave a comment here" id="floatingTextarea${i}">${el.html}</textarea>
            
                            <label for="floatingTextarea${i}"></label>
                            </div>

                            <div class="form-floating">
                            ${"H" + el.level[1] + ": Details"}
                            <textarea readonly class="form-control" placeholder="Leave a comment here" id="floatingText${i}">${el.htmlprv}</textarea>
                            <label for="floatingText${i}"></label>
                            </div>
                            `

            } else if (el.type === "3") {
                nonConsecutiveHeader += `<ul>
            <li style="color:${errorColor}"><strong>${el.Error + " at H" + el.level[0] + " at H" + el.level[1]}</strong></li>
            </ul> 
            <div class="form-floating">
            ${"H" + el.level[0] + ": Details"}
            <textarea readonly class="form-control" placeholder="Leave a comment here" id="floatingTextarea${i}">${el.htmlprv}</textarea>

            <label for="floatingTextarea${i}"></label>
            </div>

            <div class="form-floating">
            ${"H" + el.level[1] + ": Details"}
            <textarea readonly class="form-control" placeholder="Leave a comment here" id="floatingText${i}">${el.html}</textarea>
            <label for="floatingText${i}"></label>
            </div>
            `
            }

        })
        HTML +=
            `
            <div class="accordion accordion-flush" id="accordionFlushRepeat">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="flush-headingRepeat}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseRepeat" aria-expanded="false" aria-controls="flush-collapseRepeat">
                    Repetitive Heading Violations
                    </button>
                    </h2>
                    <div id="flush-collapseRepeat" class="accordion-collapse collapse" aria-labelledby="flush-headingRepeat" data-bs-parent="#accordionFlushExample">
                    <div class="accordion-body">
                    ${(repeatHeader === '') ? `<p style="color:${positiveColor}"><b>No repetitive header violation</b></p>` : repeatHeader
            }
                    <strong style="color:${suggestionColor}">Suggestion: To make heading more descriptive, starting of the each heading should be different. </strong>
                    </div>
                </div>
                </div>
                </div>
            `
        HTML +=
            `
    <div class="accordion accordion-flush" id="accordionFlushCon">
        <div class="accordion-item">
            <h2 class="accordion-header" id="flush-headingCon}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseCon" aria-expanded="false" aria-controls="flush-collapseCon">
            Non-Consecutive Heading tag Violations
            </button>
            </h2>
            <div id="flush-collapseCon" class="accordion-collapse collapse" aria-labelledby="flush-headingCon" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body">
            ${(nonConsecutiveHeader === '') ? `<p style="color:${positiveColor}"><b>No consecutive header tag violation</b></p>` : nonConsecutiveHeader
            }
            <strong style="color:${suggestionColor}">Suggestion: In order for HTML page to be organized, at any two consecutive levels, heading tag should be consecutive.</strong>
            </div>
        </div>
        </div>
        </div>
    `
        HTML += "</div>"

        if (data.contrast) {
            HTML += "<div id='contrast-compliance' hidden class='border border-dark m-2'>"
            data.contrast.forEach(element => {
                HTML += `<div class="m-2 border border-dark rounded-3">
                    <div class="row m-2">
                    <div class="col">
                        <div class="row">
                        <div class="col">
                            <div class="row border border-2"
                            style="background-color: rgb(${element['Background Color']['red']}, ${element['Background Color']['green']}, ${element['Background Color']['blue']}, ${element['Background Color']['alpha']}); height:100px; width:100px;">
                            </div>
                            <div class="row">Background Color</div>
                        </div>
                        <div class="col">
                            <div class="row border border-2"
                            style="background-color: rgb(${element['Text Color']['red']}, ${element['Text Color']['green']}, ${element['Text Color']['blue']}, ${element['Text Color']['alpha']}); height:100px; width:100px;">
                            </div>
                            <div class="row">Text Color</div>
                        </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="row">Contrast Ratio: ${element["Contrast Ratio"]}</div>
                        <div class="row">AA Compliance: ${element["AA Compliance"]}</div>
                        <div class="row">AAA Compliance: ${element["AAA Compliance"]}</div>
                    </div>
                    <div class="col">
                        <div class="row">Text: <textarea readonly>"${element["innerHTML"]}"</textarea></div>
                        <div class="row">Parent: <textarea readonly>"${element["outerHTML"]}"</textarea></pre>
                        </div>
                    </div>
                    </div>
                    <div class="row m-2 border-2 border-top">
                    <p class="ms-2" style="color:${suggestionColor}"><b>Suggestions:</b></p>
                    ${(element['AA Suggestions']['bg']) ? `<div class="col">
                        <div class="row">
                        <div class="col">
                            <div class="row border border-2" style="background-color: ${element['AA Suggestions']['bg']};height:100px; width:100px;">
                            </div>
                            <div class="row">AA Background Color: ${element['AA Suggestions']['bg']}</div>
                        </div>
                        <div class="col">
                            <div class="row border border-2" style="background-color: ${element['AA Suggestions']['fg']};height:100px; width:100px;">
                            </div>
                            <div class="row">AA Text Color: ${element['AA Suggestions']['fg']}</div>
                        </div>
                        </div>
                    </div>` : ""
                    }
                    ${(element['AAA Suggestions']['bg']) ? `<div class="col">
                        <div class="row">
                        <div class="col">
                            <div class="row border border-2" style="background-color: ${element['AAA Suggestions']['bg']}; height:100px; width:100px;">
                            </div>
                            <div class="row">AAA Background Color: ${element['AAA Suggestions']['bg']} </div>
                        </div>
                        <div class="col">
                            <div class="row border border-2" style="background-color: ${element['AAA Suggestions']['fg']}; height:100px; width:100px;">
                            </div>
                            <div class="row">AAA Text Color: ${element['AAA Suggestions']['fg']}</div>
                        </div>
                        </div>
                    </div>` : ""
                    }
                    </div>
                </div>`
            });
            HTML += "</div>"
        }

    }else{
        HTML += `<h2 style="color:${errorColor}"><b>Could not get the ADA compliance for this site, please refer back later.</b></h2>`
    }

    document.getElementById('compliance-data').innerHTML = HTML;

    if(data){
        document.getElementById("btncheck1").addEventListener('change', (event) => {
            if (event.target.checked) {
                // $("#image-compliance").show();
                document.getElementById("image-compliance").hidden = false
            } else {
                document.getElementById("image-compliance").hidden = true
                // $("#image-compliance").hide();
            }
        })
        document.getElementById("btncheck2").addEventListener('change', (event) => {
            if (event.target.checked) {
                document.getElementById("accordionLabel").hidden = false
                // $("#accordionLabel").show()
            } else {
                document.getElementById("accordionLabel").hidden = true
                // $("#accordionLabel").hide()
            }
        })
        document.getElementById("btncheck3").addEventListener('change', (event) => {
            if (event.target.checked) {
                document.getElementById("headers-compliance").hidden = false
                // $("#headers-compliance").show()
            } else {
                document.getElementById("headers-compliance").hidden = true
                // $("#headers-compliance").hide()
            }
        })

        if (data.contrast) {
            document.getElementById("btncheck4").addEventListener('change', (event) => {
                if (event.target.checked) {
                document.getElementById("contrast-compliance").hidden = false
                // $("#contrast-compliance").show()
                } else {
                document.getElementById("contrast-compliance").hidden = true
                // $("#contrast-compliance").hide()
                }
            })
        }
        document.getElementById("btncheck5").addEventListener('change', (event) => {
            if (event.target.checked) {
                document.getElementById("accordionTab").hidden = false
                // $("#accordionTab").show()
            } else {
                document.getElementById("accordionTab").hidden = true
                // $("#accordionTab").hide()
            }
        })
    }
}