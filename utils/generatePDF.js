var pdfMakePrinter = require('pdfmake')

function createPdf(pdfDoc, callback) {

	var printer = new pdfMakePrinter();

	var doc = printer.createPdfKitDocument(pdfDoc);

	var chunks = [];
	var result;

	doc.on('data', function (chunk) {
		chunks.push(chunk);
	});
	doc.on('end', function () {
		result = Buffer.concat(chunks);
		callback('data:application/pdf;base64,' + result.toString('base64'));
	});
	doc.end();

}

module.exports = createPdf;