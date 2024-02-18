const express = require('express');
const generateRssFeed = require('./generateRssFeed');

const app = express();
const port = 3000;
const ip = '192.168.1.206';// Feel free to use any port suitable for your setup

app.get('/rss', async (req, res) => {
    try {
        const rss = await generateRssFeed(); // Await the asynchronous feed generation
        res.type('application/rss+xml'); // Set the correct Content-Type for RSS
        res.send(rss); // Send the generated RSS feed as the response
    } catch (error) {
        console.error('Failed to generate RSS feed:', error);
        res.status(500).send('Internal Server Error'); // Handle errors gracefully
    }
});

app.listen(port, ip,() => {
    console.log(`RSS feed server running at http://${ip}:${port}/rss`);
});
