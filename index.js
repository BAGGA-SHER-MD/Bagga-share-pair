const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        status: true,
        creator: "Bagga Sher MD",
        message: "API is working smoothly"
    });
});

app.get('/download', async (req, res) => {
    try {
        const videoURL = req.query.url;
        if (!videoURL || !ytdl.validateURL(videoURL)) {
            return res.status(400).json({ status: false, error: "Invalid YouTube URL" });
        }

        const info = await ytdl.getInfo(videoURL, {
            requestOptions: {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                }
            }
        });

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
