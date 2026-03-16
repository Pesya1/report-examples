
const fs = require('fs/promises');
const ejs = require('ejs');
const path = require('path');
const htmlpdf = require('html-pdf');
const jsonOptions = require('../caersarea/input files/default options.json');

// const data = require('../dor alon/input/stage data.json');
//  const ejsPath = '../dor alon/input/chnge_ship_cond_dor_new.ejs';
//  const outputPath = '/../dor alon/output';
const outputPath = '/../dor alon B/output';
const ejsPath = '../dor alon B/input/.ejs';
const data = require('../dor alon B/input/stageData.json');
const headerPath = '../dor alon B/input/header.ejs';

const fileName = `report_${new Date().toISOString().split('T')[0].replace(/-/g, '_')}`;

const writeEjs = async (reportTemplate, reportData) => {
    try {
        let ejsResponse = await ejs.render(reportTemplate, reportData);
        return ejsResponse;
    }
    catch (error) {
        console.log(`error render ejs. look like the report template is not valid. message: ${error.message}`);
        throw error;
    }
}

const writePdf = async (html, footer) => {
    try {

        // ! not use this options, use jsonOptions from file
        const options = {
            "border": {
                //  "top": '10px',
                "bottom": '30px'
            },
        }
        // options.border=null;
        options.header = {
            "height": "15mm",
            "contents":
                // getTemplateHeader()
                
                `<div style="text-align: left; margin-bottom: 30px;"><span style="color: #444;">
                עמוד
                {{page}}
                </span>מתוך<span>
                
                {{pages}}</span></div>
                `
        }
        // "format": "A4",

        // options.header=null;
        // options.footer = {
        //     // "height": "100px",
        //     "contents": {
        //         //                 default:`<h4 style="background-color: #00255C; color: white; padding: 10px; width: 100%; height: '100px'; font-family:Tahoma">
        //         // ת.ד. 4888, העיר העתיקה, קיסריה 30889 | www.caesarea.com | *6550 <small>שלוחה</small> 1
        //         //                 </h4>`
        //         default: footer
        //         //   first: 'Cover page',
        //         //   2: 'Second page', // Any page number is working. 1-based index
        //         //   default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        //         //   last: 'Last Page'
        //     }
        // }

        let str = JSON.stringify(options);
        console.log(str);

        let outputPdfPath = __dirname + `${outputPath}/${fileName}.pdf`;

        let jsonOptions2 = {}
        htmlpdf.create(html, options).toFile(outputPdfPath, function (err, res) {
            if (err) return console.log(err);
            console.log(res); // { filename: '/app/businesscard.pdf' }
        });
    }
    catch (err) {
        console.log(`fail to write pdf: ${err.message}`)
    }
}

const getTemplateFile = async () => {
    let templatePath = path.join(__dirname, ejsPath); // './input files/carserea ejs no footer.ejs'
    if (! await fs.stat(templatePath))
        throw { message: `error in reading template ${exportObject.template}. the template was not found`, status: 401 };
    let ejsResponse = await fs.readFile(templatePath, 'utf8');
    return ejsResponse
}

const getTemplateFooter = async () => {
    let templatePath = path.join(__dirname, './input files/footer.html');
    if (! await fs.stat(templatePath))
        throw { message: `error in reading template ${exportObject.template}. the template was not found`, status: 401 };
    let ejsResponse = await fs.readFile(templatePath, 'utf8');
    return ejsResponse
}

const getTemplateHeader = async () => {
    let templatePath = path.join(__dirname, headerPath);
    if (! await fs.stat(templatePath))
        throw { message: `error in reading template ${exportObject.template}. the template was not found`, status: 401 };
    let ejsResponse = await fs.readFile(templatePath, 'utf8');
    return ejsResponse
}


const generateReport = async () => {
    try {
        const template = await getTemplateFile();
        // let footer=await getTemplateFooter();
        const html = await writeEjs(template, data);
        // let footerHtml= await writeEjs(footer, {});
        let footer = '';
        await fs.writeFile(__dirname + `${outputPath}/report_2025_11_20.html`, html);
        await writePdf(html, footer);

    }
    catch (error) {
        console.log(error);

    }


}

generateReport();