const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        status: true,
        creator: "Bagga Sher MD",
        message: "API is working"
    });
});

app.get('/download', async (req, res) => {
    try {
        const videoURL = req.query.url;
        if (!videoURL || !ytdl.validateURL(videoURL)) {
            return res.status(400).json({ error: "Invalid YouTube URL" });
        }

        const info = await ytdl.getInfo(videoURL);
        const formats = ytdl.filterFormats(info.formats, 'audioandvideo');
        const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');

        res.json({
            status: true,
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
            download: {
                video: formats.length > 0 ? formats[0].url : null,
                audio: audioFormats.length > 0 ? audioFormats[0].url : null
            }
        });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
