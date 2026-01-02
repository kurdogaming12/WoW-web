const config = require('../../config.js');
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const router = express.Router();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({ origin: '*', credentials: true }));

router.post('/report', async (req, res) => {
    try {
        const { content, discordUser } = req.body;
        const webhookUrl = config.bot.webhookUrl;

        if (!webhookUrl) return res.status(500).json({ error: 'Webhook not configured' });

        const embed = {
            title: 'New Report',
            color: 3066993,
            fields: [
                { name: 'User', value: discordUser || 'Anonymous', inline: true },
                { name: 'Description', value: content || 'No description' }
            ],
            timestamp: new Date().toISOString()
        };
        
        const response = await fetch(webhookUrl, {
            method: 'POST',
            body: JSON.stringify({ embeds: [embed] }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            res.json({ success: true });
        } else {
            const errorText = await response.text();
            console.error('Discord Webhook Error:', response.status, errorText);
            throw new Error('Discord error');
        }
    } catch (error) {
        console.error('Report processing error:', error);
        res.status(500).json({ error: 'Failed to send report' });
    }
});

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);