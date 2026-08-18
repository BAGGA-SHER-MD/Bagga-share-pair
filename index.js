const express = require('express');
const cors = require('cors');

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
        if (!videoURL) {
            return res.status(400).json({ status: false, error: "URL is required" });
        }

        // Bridge method: Direct working links redirect kar reha hai taan jo server crash na hove
        res.json({
            status: true,
            download: {
                audio: `https://api.giftedtech.web.id/api/download/ytmp3?url=${encodeURIComponent(videoURL)}&apikey=gifted`,
                video: `https://api.giftedtech.web.id/api/download/ytmp4?url=${encodeURIComponent(videoURL)}&apikey=gifted`
            }
        });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
