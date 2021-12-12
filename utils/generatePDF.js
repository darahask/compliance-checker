var pdfMakePrinter = require('pdfmake')
var path = require('path')

function createPdf(pdfDoc) {

	var fontDescriptors = {
		Roboto: {
			normal: path.join(__dirname, '..', '/fonts/Roboto-Regular.ttf'),
			bold: path.join(__dirname, '..', '/fonts/Roboto-Medium.ttf'),
			italics: path.join(__dirname, '..', '/fonts/Roboto-Italic.ttf'),
			bolditalics: path.join(__dirname, '..', '/fonts/Roboto-MediumItalic.ttf')
		}
	};

	var printer = new pdfMakePrinter(fontDescriptors);

	var doc = printer.createPdfKitDocument(pdfDoc);

	return new Promise((resolve, reject) => {
		try {
			var chunks = [];
			doc.on('data', chunk => chunks.push(chunk));
			doc.on('end', () => resolve(Buffer.concat(chunks)));
			doc.end();
		} catch (err) {
			reject(err);
		}
	});
}

module.exports = createPdf;