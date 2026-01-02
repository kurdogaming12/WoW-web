// WoW Bot Website Configuration - Clean & Structured
module.exports = {
    // Bot Links & Settings
    bot: {
        inviteUrl: 'https://discord.com/oauth2/authorize?client_id=1435231049033584722&permissions=8&integration_type=0&scope=bot+applications.commands',
        supportServer: 'https://discord.gg/4n68NyE4mJ',
        webhookUrl: 'https://discord.com/api/webhooks/1456605202885902433/wtzxzPKe5RGsOR6DGGQdHwDULhEneH1njCDr8sDHK9RmOMmQEuZnfP3H7lIRcenUyvL2'
    },

    // Security Settings
    security: {
        sessionSecret: 'wow-bot-website-secret-key-2025'
    },

    // Server Configuration
    server: {
        port: 5000,
        host: '0.0.0.0'
    },

    // Database Connection
    database: {
        url: 'postgresql://neondb_owner:npg_1nS0fCgEwYmU@ep-billowing-fire-a2isxndx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require'
    },

    // UI Configuration
    ui: {
        supportName: 'KURDO 09',
        supportLogo: 'attached_assets/E14F0BE8-3D29-4C18-85F2-A75AF12F95E0_1766922280005.jpeg'
    }
};