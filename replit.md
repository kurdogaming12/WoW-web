# WoW Discord Bot Website

## Overview

This is a landing page website for a Discord bot called "WoW". The site serves as a promotional page where users can invite the bot to their Discord server and submit bug reports or feedback. The website features a modern dark theme with green accent colors and glow effects, designed to match gaming/Discord aesthetics.

Key functionality includes:
- Landing page with bot invitation links
- Report submission system that sends feedback to Discord via webhooks
- Responsive design with modern CSS effects (blur, gradients, glow)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology**: Vanilla HTML, CSS, and JavaScript (no framework)
- **Design Approach**: Static single-page website with modal interactions
- **Styling**: Custom CSS with CSS variables for theming, Google Fonts (Inter), glassmorphism effects
- **Rationale**: Simple promotional landing page doesn't require a complex framework; vanilla approach keeps it lightweight and fast-loading

### Backend Architecture
- **Technology**: Node.js with Express.js (v5.x)
- **Pattern**: Simple REST API with a single endpoint
- **Endpoints**:
  - `POST /api/report` - Accepts bug reports/feedback and forwards to Discord webhook
- **Port**: Runs on port 5001
- **Rationale**: Minimal backend needed only for secure webhook handling; Express provides simple, reliable HTTP server

### Security Considerations
- Discord webhook URL stored in environment variables (not exposed to client)
- CORS enabled for cross-origin requests
- Backend acts as proxy to protect webhook credentials

## External Dependencies

### Third-Party Services
- **Discord Webhooks**: Used to send report submissions to a Discord channel
  - Requires `DISCORD_WEBHOOK_URL` environment variable
  - Sends embedded messages with report type and content

### NPM Packages
- `express` (v5.2.1) - Web server framework
- `cors` (v2.8.5) - Cross-origin resource sharing middleware
- `dotenv` (v17.2.3) - Environment variable management
- `node-fetch` (v3.3.2) - HTTP client for Discord webhook requests

### External Resources
- Google Fonts (Inter font family) - Loaded via CDN
- Discord OAuth2 - Bot invitation flow (external Discord URL)

### Environment Variables Required
- `DISCORD_WEBHOOK_URL` - Full Discord webhook URL for receiving reports