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
        const emails = process.env.RECEIVER_EMAIL.split(',');
        console.log({ emails });
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
            to: emails,
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