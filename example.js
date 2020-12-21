const puppeteer = require('puppeteer');
// Include to be able to export files w/ node
const fs = require('fs');
// const iPhone = puppeteer.devices['iPhone 6'];

const sitePage = [
    'https://avtodiski.net.ua',                                                                    //Главная
    'https://avtodiski.net.ua/product/bolty',                                                      //Каталог товара
    'https://avtodiski.net.ua/product/bolty/bolt-chrome-m12-125-l27.html',                         //Детальная товара
    'https://avtodiski.net.ua/otzyvy',                                                             //Отзывы
    'https://avtodiski.net.ua/stati',                                                              //Статьи
    'https://avtodiski.net.ua/stati/vazhno-znat',                                                  //Детальная статьи
    'https://avtodiski.net.ua/calc',                                                               //Шинный калькулятор
    'https://avtodiski.net.ua/novosti',                                                            //Новости
    'https://avtodiski.net.ua/novosti/diski-original-komplekt-shin',                               //Детальная новости
    'https://avtodiski.net.ua/shina',                                                              //Каталог шина
    'https://avtodiski.net.ua/disk/zw/355-21024',                                                  //Детальная диски
    'https://avtodiski.net.ua/disk/avto',                                                          //Подбор дисков по авто
    'https://avtodiski.net.ua/disk/avto/geely',                                                    //Подбор дисков по авто - выбор машины
    'https://avtodiski.net.ua/disk/diametr-14/shirina-5_6/pcd-4x100?diametr=15&et=30_45&dia=56-6', //Фильтр дисков по выбранной машине
    'https://avtodiski.net.ua/page/garantii',                                                      //Гарантии
    'https://avtodiski.net.ua/page/dostavka-oplata',                                               //Доставка и оплата
    'https://avtodiski.net.ua/shina?ac=on&ex=on',                                                  // Акции шины
    'https://avtodiski.net.ua/page/kontakty',                                                      //Контакты
];

let counter = 0;

function pup(pageLink) {
    if (counter > sitePage.length) return;

    (async (pageLink) => {
        const browser = await puppeteer.launch({
            headless: false
        });
        const page = await browser.newPage();
        // await page.emulate(iPhone);
        await page.setViewport({ width: 1920, height: 900 });

        // Begin collecting CSS coverage data
        await Promise.all([
            page.coverage.startCSSCoverage()
        ]);

        // Visit desired page
        await page.goto(pageLink);

        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        await wait(120000);

        //Stop collection and retrieve the coverage iterator
        const cssCoverage = await Promise.all([
            page.coverage.stopCSSCoverage(),
        ]);

        //Investigate CSS Coverage and Extract Used CSS
        const css_coverage = [...cssCoverage];
        let covered_css = "";



        let url = 'https://avtodiski.net.ua/css/min/bundle1.min.css?1588072218';
        // let url_2 = 'https://avtodiski.net.ua/css/min/bundle_mob.css?1583399486';

        css_coverage[0].forEach(function (el) {
            if(el.url === url) {
                for (const range of el.ranges){
                    covered_css += el.text.slice(range.start, range.end) + "\n";
                }
            }
        })

        css_coverage[0].forEach(function (el) {
            var res = el.url.match(/custom/g) || [];

            if(res.length) {
                for (const range of el.ranges){
                    covered_css += el.text.slice(range.start, range.end) + "\n";
                }
            }
        })



        fs.writeFile("./exported_css" + counter + ".css", covered_css, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });

        await browser.close();

        counter++;

        pup(sitePage[counter]);

    })(pageLink);
}

pup(sitePage[0]);