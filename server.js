const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cors = require('cors');
const { Pool } = require('pg');
const FormData = require('form-data');
const fileUpload = require('express-fileupload');
const config = require('./config');
const session = require('express-session');

const app = express();

app.use(session({
    secret: config.security.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

const pool = new Pool({ connectionString: config.database.url });

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(fileUpload({ limits: { fileSize: 8 * 1024 * 1024 } }));
app.use(cors({ origin: '*', credentials: true }));

app.use(express.static('.'));

app.get('/api/support-info', (req, res) => {
    res.json({
        discordName: config.ui.supportName,
        discordLogo: config.ui.supportLogo,
        inviteUrl: config.bot.inviteUrl,
        serverUrl: config.bot.supportServer
    });
});

app.get('/api/stats', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM bot_stats WHERE id = 1');
        res.json(result.rows[0] || { id: 1, servers: 50000, users: 500000 });
    } catch (err) {
        res.json({ id: 1, servers: 50000, users: 500000 });
    }
});

app.post('/api/report', async (req, res) => {
    const { content, discordUser } = req.body;
    const webhookUrl = config.bot.webhookUrl;

    if (!webhookUrl) return res.status(500).json({ error: 'Webhook not configured' });

    try {
        const embed = {
            title: 'New Report',
            color: 3066993,
            fields: [
                { name: 'User', value: discordUser || 'Anonymous', inline: true },
                { name: 'Description', value: content || 'No description provided' }
            ],
            timestamp: new Date().toISOString()
        };

        const payload = { 
            embeds: [embed]
        };

        // If there are files, we MUST use FormData
        if (req.files && (req.files.photo || req.files.video)) {
            const form = new FormData();
            form.append('payload_json', JSON.stringify(payload));
            
            if (req.files.photo) {
                form.append('file', req.files.photo.data, {
                    filename: req.files.photo.name,
                    contentType: req.files.photo.mimetype
                });
            }
            if (req.files.video) {
                form.append('file2', req.files.video.data, {
                    filename: req.files.video.name,
                    contentType: req.files.video.mimetype
                });
            }

            const response = await fetch(webhookUrl, {
                method: 'POST',
                body: form,
                headers: form.getHeaders()
            });

            const responseText = await response.text();
            console.log('Discord Webhook (Multipart) Response:', response.status, responseText);

            if (response.ok) return res.json({ success: true });
            else throw new Error(`Discord error: ${response.status} ${responseText}`);
        } else {
            // No files, simple JSON post
            const response = await fetch(webhookUrl, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' }
            });

            const responseText = await response.text();
            console.log('Discord Webhook (JSON) Response:', response.status, responseText);

            if (response.ok) return res.json({ success: true });
            else throw new Error(`Discord error: ${response.status} ${responseText}`);
        }
    } catch (error) {
        console.error('Report Error:', error);
        res.status(500).json({ error: 'Failed to send report' });
    }
});

const PORT = config.server.port;
app.listen(PORT, config.server.host, () => {
    console.log(`Server running on port ${PORT}`);
});