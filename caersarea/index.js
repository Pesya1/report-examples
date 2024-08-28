
const fs =require('fs/promises') ;
const ejs =require('ejs') ;
const path = require('path');
const htmlpdf=require('html-pdf');
const jsonOptions=require('./input files/options 2024.03.27.json');

const data = require('../yadSara/inputFiles/YadSara stages data.json')
const dataPath='/../yadSara/inputFiles/YadSara stages data.json';
const ejsPath='/../yadSara/inputFiles/yadSara.ejs';
const outputPath='/../yadSara/output';


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

const writePdf=async(html,footer)=>{
    try{

        // ! not use this options, use jsonOptions from file
        const options= {
            "border":{"top":'30px',"bottom":'0px',"left":'10px'},
             "format": "A4",
            }
        options.footer=   {
            // "height": "100px",
            "contents": {
//                 default:`<h4 style="background-color: #00255C; color: white; padding: 10px; width: 100%; height: '100px'; font-family:Tahoma">
// ת.ד. 4888, העיר העתיקה, קיסריה 30889 | www.caesarea.com | *6550 <small>שלוחה</small> 1
//                 </h4>`
                default:footer
            //   first: 'Cover page',
            //   2: 'Second page', // Any page number is working. 1-based index
            //   default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            //   last: 'Last Page'
            }
          }

          let str=JSON.stringify(options);
          console.log(str);

          let outputPdfPath= __dirname + `${outputPath}/A report_2024_07_17.pdf`;


        htmlpdf.create(html, jsonOptions).toFile(outputPdfPath, function(err, res) {
            if (err) return console.log(err);
            console.log(res); // { filename: '/app/businesscard.pdf' }
          });
    }
    catch(err){
        console.log(`fail to write pdf: ${err.message}`)
    }
}

const getTemplateFile = async () => { 
    let templatePath = path.join(__dirname, ejsPath ); // './input files/carserea ejs no footer.ejs'
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


const generateReport = async () => {
    try {
        const template=await getTemplateFile();
        // let footer=await getTemplateFooter();
        const html = await writeEjs(template, data);
        // let footerHtml= await writeEjs(footer, {});
        let footer='';
        await fs.writeFile(__dirname + `${outputPath}/report_2024_07_26.html`, html);
      await writePdf(html,footer);

    }
    catch(error){
        console.log(error);

    }


}

generateReport();