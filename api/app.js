'use strict';
require('dotenv').config();
const { getSitemapUrls, fetchSitemap, parseSitemap, checkUrls, fetchUrl, sendEmail } = require('../services');
module.exports.handler = async (event) => {
  try {
    const SITEMAP_URLS = getSitemapUrls();
    let urls = [];
    for (let sitemap of SITEMAP_URLS) {
      const sitemapXml = await fetchSitemap(sitemap);
      const list = await parseSitemap(sitemapXml);
      urls.push(...list);
    }
    console.log({ urls: urls.length });
    const { successUrls, errorUrls } = await checkUrls(urls.slice(0, 5));

    if (errorUrls.length > 0) {
      console.log("Error Urls: ", errorUrls.length);
    }
    // await sendEmail({ successUrls, errorUrls });
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 200,
        message: 'Sitmap urls checked.',
        data: { successUrls, errorUrls },
      }),
    };
  } catch (error) {
    console.error("Error in catch : ", { error });
    return {
      statusCode: 400,
      body: JSON.stringify({
        status: 400,
        message: 'Something went wrong.',
        data: null,
      }),
    };
  }
};
