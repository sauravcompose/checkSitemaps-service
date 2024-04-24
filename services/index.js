const nodemailer = require('nodemailer');
const xml2js = require('xml2js');
const axios = require('axios');
require('dotenv').config();

function getSitemapUrls() {
    const BASE_URL = process.env.BASE_URL || 'https://www.kitchenwarehouse.com.au';
    return [
        `${BASE_URL}/sitemap.xml`,
        `${BASE_URL}/categories_sitemap.xml`,
        `${BASE_URL}/recipes_sitemap.xml`,
        `${BASE_URL}/static_sitemap.xml`
    ];
}

function getConfig(url) {
    return {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
            'cache-control': 'max-age=0',
            'cookie': '_gcl_au=1.1.1658070734.1706586036; _ga=GA1.1.1493713973.1706586036; z_idsyncs=; _fbp=fb.2.1706586036026.1362660895; _pin_unauth=dWlkPU1qSTVNVEZpWXpndFpqUTFOUzAwTmpNMUxXRmpaall0TkdRM00ySmpaV1EzTTJFeA; FPID=FPID2.3.ShhlK8fBbgRfg3bKe1ramVTwqUpHpMBHfHsbta5XA6c%3D.1706586036; wisepops-h6BBWsATky-visitor=adc37b9a-3904-4697-bb02-5924f19163d6; hblid=V8pq8BZB4ZbG1VwY7h2VN0JoB0AADC6r; olfsk=olfsk4339176445181743; zaius_js_version=2.4.1; _gcl_aw=GCL.1709028557.CjwKCAiArfauBhApEiwAeoB7qPn4g4OSsnRLsMgj8IlkG-JRT2nLOHd2C1Vv7tJTc4GKF7RYuZ10oBoCb7YQAvD_BwE; vtsrc=source%3Dgoogle%7Cmedium%3Dorganic; _ga_515YXBJTTJ=GS1.1.1710058823.83.0.1710058823.60.0.0; lantern=70eaa2aa-500e-4972-82d5-3ade77d4e4b2; _clck=1wxlft9%7C2%7Cfkr%7C0%7C1490; __prz_uid=69377ad1-6d71-4a13-98a9-9d8467241464; FPLC=2eFAX4TX7T3%2BJstYxQzXFODLBjuUwm4G%2BlS%2BhX7DQWZ2033XLZJ%2FoIls6sxfcYqNbu75Qi4MSpLg6UqMxq4VkiwHTQQFP9HJ2ElqJ0lzaXT4%2BBYxJfxD0hiXS%2Fp4bQ%3D%3D; _okdetect=%7B%22token%22%3A%2217139301497460%22%2C%22proto%22%3A%22about%3A%22%2C%22host%22%3A%22%22%7D; _ok=1013-853-10-2437; cf_clearance=D5c73HnBEHwZUxKLHT0VspjzTchfxDc9IakxTmIWPu4-1713935406-1.0.1.1-QZwYvrla6o3G87hgGERvDK3Yyya021SRUSxDCBlvE88Evi5hMhs9L4QgQouu2r6hz_Zukrak0sEhFcbPXEgdGQ; wcsid=B30fEcFP0SbF0TVx7h2VN0Jr6DoaABeC; _okbk=cd5%3Davailable%2Ccd4%3Dtrue%2Cvi5%3D0%2Cvi4%3D1713935410496%2Cvi3%3Dactive%2Cvi2%3Dfalse%2Cvi1%3Dfalse%2Ccd8%3Dchat%2Ccd6%3D0%2Ccd3%3Dfalse%2Ccd2%3D0%2Ccd1%3D0%2C; TTSVID=48575b40-3965-4b08-8a3a-3556fe1cfb04; user-geo-data=%7B%22ip%22%3A%22172.69.179.94%22%2C%22geo%22%3A%7B%22country%22%3A%22IN%22%2C%22region%22%3A%22BR%22%2C%22city%22%3A%22Patna%22%2C%22latitude%22%3A%2225.5908%22%2C%22longitude%22%3A%2285.1348%22%2C%22timezone%22%3A%22Asia%2FKolkata%22%7D%7D; dicbo_id=%7B%22dicbo_fetch%22%3A1713936647550%7D; FPGSID=1.1713935407.1713936649.G-Q78YJQBMVM.nA3tYwFrtWMTCB1HxeY-7g; wisepops=%7B%22popups%22%3A%7B%22478020%22%3A%7B%22dc%22%3A1%2C%22d%22%3A1709029176071%2C%22cl%22%3A1%7D%7D%2C%22sub%22%3A1%2C%22ucrn%22%3A68%2C%22cid%22%3A%2262677%22%2C%22v%22%3A4%2C%22bandit%22%3A%7B%22recos%22%3A%7B%7D%7D%2C%22csd%22%3A1%7D; vuid=27e1e735-74ca-463e-98cc-c29f8ea89616%7C1713936655077; z_customer_id=GA1.1.1493713973.1706586036%7C1713936655077; _uetsid=ae949720006811efa16a1f379f6549b1|1c1eomm|2|fl7|0|1573; wisepops_visitor=%7B%22h6BBWsATky%22%3A%22adc37b9a-3904-4697-bb02-5924f19163d6%22%2C%22KThGyS6uyn%22%3A%22e3a90aab-fd31-42c8-b721-d92c4ff4b54c%22%7D; wisepops_visits=%5B%222024-04-24T05%3A30%3A54.981Z%22%2C%222024-04-24T05%3A30%3A46.359Z%22%2C%222024-04-24T05%3A21%3A06.896Z%22%2C%222024-04-24T05%3A10%3A06.094Z%22%2C%222024-04-24T04%3A30%3A22.297Z%22%2C%222024-04-24T04%3A30%3A12.460Z%22%2C%222024-04-24T04%3A30%3A00.381Z%22%2C%222024-04-24T03%3A42%3A25.095Z%22%2C%222024-04-23T10%3A43%3A39.385Z%22%2C%222024-04-23T10%3A43%3A17.190Z%22%5D; wisepops_session=%7B%22arrivalOnSite%22%3A%222024-04-24T05%3A30%3A54.981Z%22%2C%22mtime%22%3A1713936655492%2C%22pageviews%22%3A1%2C%22popups%22%3A%7B%7D%2C%22bars%22%3A%7B%7D%2C%22sticky%22%3A%7B%7D%2C%22countdowns%22%3A%7B%7D%2C%22src%22%3A%22https%3A%2F%2Fapp.asana.com%2F%22%2C%22utm%22%3A%7B%7D%2C%22testIp%22%3Anull%7D; frontastic-session=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjoiVk1iNmplR1VteEpUcUtqY3djSEtIOFpYIiwibm9uY2UiOiIreHB4L2pNTDlxSlBxZTdwIn0.RsVcZVc4QNApF6D9RewG1knJRy8-xgMKxFpoScEHNso; _uetvid=53f35250bf2111eebcc28117e73fd3d9|uyfyaw|1713936655844|9|1|bat.bing.com/p/insights/c/n; _ga_Q78YJQBMVM=GS1.1.1713935406.140.1.1713936657.0.0.963508184; _oklv=1713936659067%2CB30fEcFP0SbF0TVx7h2VN0Jr6DoaABeC; user-geo-data=%7B%22ip%22%3A%22172.70.237.149%22%2C%22geo%22%3A%7B%22country%22%3A%22IN%22%2C%22region%22%3A%22JH%22%2C%22city%22%3A%22Ranchi%22%2C%22latitude%22%3A%2223.3426%22%2C%22longitude%22%3A%2285.3099%22%2C%22timezone%22%3A%22Asia%2FKolkata%22%7D%7D',
            'priority': 'u=0, i',
            'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'x-sitemap-health': 'true'
        }
    };
}
async function fetchSitemap(url) {
    try {
        let config = getConfig(url);
        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        console.error("Error in fetching sitemap", error);
        throw new Error("Error in fetching sitemap", error);
    }
}

async function parseSitemap(xml) {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, (error, result) => {
            if (error) {
                reject(new Error(`Failed to parse sitemap.xml: ${error.message}`));
            } else {
                const urls = result.urlset.url.map(url => url.loc[0]);
                resolve(urls);
            }
        });
    });
}

async function checkUrls(urls) {
    const successUrls = [];
    const errorUrls = [];
    for (const url of urls) {
        try {
            const response = await fetchUrl(url);
            const obj = {};
            obj[url] = response.status;
            console.log(obj);
            if (response.status === 200) {
                successUrls.push(url);
            } else {
                errorUrls.push(url);
            }
        } catch (error) {
            console.error(`Failed to fetch ${url}: ${error.message}`);
            errorUrls.push(url);
        }

        // Delay for 500 milliseconds before fetching the next URL
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    return { successUrls, errorUrls };
}

async function fetchUrl(url) {
    let config = getConfig(url);
    return await axios.request(config);
}

async function sendEmail({ successUrls, errorUrls }) {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.APP_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: process.env.RECEIVER_EMAIL,
            subject: 'List of URLs ',
            text: 'Urls with other than 200 status :\n\n' + errorUrls.join('\n') + '\n\nUrls with 200 status :\n\n' + successUrls.join('\n')
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error while sending email", error);
        throw new Error("Error while sending email.");
    }
}

module.exports = { getSitemapUrls, getConfig, fetchSitemap, parseSitemap, checkUrls, fetchUrl, sendEmail };