const puppeteer = require('puppeteer');
// Include to be able to export files w/ node
const fs = require('fs');
// const iPhone = puppeteer.devices['iPhone 6'];

const sitePage = [
    { link:'https://avtodiski.net.ua',
        nameFile: 'home'},                                                               //Главная
    { link:'https://avtodiski.net.ua/product/bolty',
        nameFile: 'catalog-goods'},                                                      //Каталог товара
    { link:'https://avtodiski.net.ua/product/bolty/bolt-chrome-m12-125-l27.html',
        nameFile: 'detail-goods'},                                                       //Детальная товара
    { link:'https://avtodiski.net.ua/otzyvy',
        nameFile: 'reviews'},                                                            //Отзывы
    { link:'https://avtodiski.net.ua/stati',
        nameFile: 'articles'},                                                           //Статьи
    { link:'https://avtodiski.net.ua/stati/vazhno-znat',
        nameFile: 'detail-articles'},                                                    //Детальная статьи
    { link:'https://avtodiski.net.ua/calc',
        nameFile: 'calc'},                                                               //Шинный калькулятор
    { link:'https://avtodiski.net.ua/novosti',
        nameFile: 'news'},                                                               //Новости
    { link:'https://avtodiski.net.ua/novosti/diski-original-komplekt-shin',
        nameFile: 'detail-news'},                                                        //Детальная новости
    { link:'https://avtodiski.net.ua/shina',
        nameFile: 'catalog-shina'},                                                      //Каталог шина
    { link:'https://avtodiski.net.ua/disk/zw/355-21024',
        nameFile: 'detail-disk'},                                                        //Детальная диски
    { link:'https://avtodiski.net.ua/disk/avto',
        nameFile: 'select-avto'},                                                        //Подбор дисков по авто
    { link:'https://avtodiski.net.ua/disk/avto/geely',
        nameFile: 'filter-car'},                                                         //Подбор дисков по авто - выбор машины
    { link:'https://avtodiski.net.ua/disk/diametr-14/shirina-5_6/pcd-4x100?diametr=15&et=30_45&dia=56-6',
        nameFile: 'catalog-filter-car'},                                                 //Фильтр дисков по выбранной машине
    { link:'https://avtodiski.net.ua/page/garantii',
        nameFile: 'guaranty'},                                                          //Гарантии
    { link:'https://avtodiski.net.ua/page/dostavka-oplata',
        nameFile: 'delivery'},                                                          //Доставка и оплата
    { link:'https://avtodiski.net.ua/shina?ac=on&ex=on',
        nameFile: 'save-shina'},                                                        // Акции шины
    { link:'https://avtodiski.net.ua/page/kontakty',
        nameFile: 'contacts'},                                                          //Контакты
];
const sitePage1 = [
    { link:'https://avtodiski.net.ua/disk/zw/355-21024',
        nameFile: 'detail-disk'},
];

let counter = 1;

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
        await page.goto(pageLink.link);

        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        await wait(360000);

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



        fs.writeFile("./css/" + pageLink.nameFile + ".css", covered_css, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("file:" + pageLink.nameFile + ".css");
        });

        await browser.close();

        pup(sitePage[counter]);

        counter++;

    })(pageLink);
}

pup(sitePage[0]);