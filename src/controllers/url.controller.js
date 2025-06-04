const Url = require('../models/Url');
const shortId = require('shortid');

// Acortar URL
exports.shortenUrl = async (req, res) => {
    const { originalUrl } = req.body;

    try {
        let url = await Url.findOne({ originalUrl });
        if (url) return res.json(url);

        const shortCode = shortId.generate();
        url = new Url({ originalUrl, shortCode });
        await url.save();

        res.status(201).json({ shortUrl: `http://localhost:3000/${shortCode}` });
    } catch (err) {
        res.status(500).json({ message: 'Error al acortar la URL' });
    }
};

// Redirigir por código
exports.redirectUrl = async (req, res) => {
    const { code } = req.params;
    const url = await Url.findOne({ shortCode: code });

    if (url) {
        res.redirect(url.originalUrl);
    } else {
        res.status(404).json({ message: 'URL no encontrada' });
    }
};

// Listar todas las URLs (opcional)
exports.getAllUrls = async (req, res) => {
    const urls = await Url.find();
    res.json(urls);
};