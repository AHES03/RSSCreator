const cheerio = require("cheerio");
const axios = require("axios");
const url = "https://www.telegraph.co.uk/authors/j/ja-je/james-ducker/";

async function getArticles(url) {
    let items = []; // Initialize items array to store article data
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        $("article").each(function () {
            let title = $(this).find("h2 a").text().trim();
            let link = "https://www.telegraph.co.uk" + $(this).find('a.list-headline__link.u-clickable-area__link').attr('href');
            let description = $(this).find("p").text().trim();
            let pub_date = $(this).find('time.card__date').attr('datetime');
            items.push({title, link, description, pub_date}); // Use correct variable names
        });
    } catch (error) {
        console.error(error);
    }
    return items; // Return the collected items
}

async function generateRssFeed() {
    let items = await getArticles(url); // Await the asynchronous function

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>James Ducker - The Telegraph</title>
  <icon>https://pbs.twimg.com/profile_images/1605188195574026240/XDJv944l_400x400.png'</icon>
  <link>https://example.com</link>
  <description>James Ducker Articles</description>
  ${items.map(item => `
    <item>
      <title>${item.title}</title>
      <link>${item.link}</link>
      <description>${item.description}</description>
      <pubDate>${new Date(item.pub_date).toUTCString()}</pubDate>
    </item>`).join('')}
</channel>
</rss>`;

    return feed;
}

module.exports = generateRssFeed;

