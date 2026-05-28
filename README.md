# 🎧 NocturneAudio - 24/7 Discord Music Bot

A lightweight, robust, high-performance music bot utilizing **Discord.js v14** and **@discordjs/voice** designed specifically for free-tier 24/7 hosting on **Railway**.

---

## ⚡ Railway 24/7 Deployment Guide

Hosting this bot on Railway takes less than 3 minutes:

### Step 1: Discord Developer setup
1. Open [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **New Application**, name it `NocturneAudio`.
3. In the left margin, choose **Bot** -> click **Add Bot**.
4. Scroll down to enable **Privileged Gateway Intents**:
   - Check **Guild Members Intent** (On)
   - Check **Message Content Intent** (On)
5. Generate Bot Token by clicking **Reset Token**. Copy this token securely!

### Step 2: Railway Deployment
1. Go to your [Railway Dashboard](https://railway.app/).
2. Push this repo/directory to your GitHub, and choose **New Project** -> **Deploy from GitHub repo**.
3. Once imported, click on the **Variables** tab on Railway.
4. Add the following Variables to make the bot run 24/7:
   - `DISCORD_TOKEN` = `<Your Discord Bot Token from Step 1>`
   - `CLIENT_ID` = `<Your Bot client ID from General Information tab>`
   - `PREFIX` = `!`
   - `EMBED_COLOR` = `#4f46e5`

### Step 3: Server Invalidation Check
Railway will automatically read the **Procfile** and compile `npm run start` under a worker container. It runs **24/7 continuously without sleep**!

---

## 🛠️ Bot Commands
| Command | Action | Usage |
|---------|---------|-------|
| `!play` | Searches & streams audio | `!play Lofi Chill` |
| `!skip` | Advances command queue | `!skip` |
| `!stop` | Stopsbot & leaves channel | `!stop` |
| `!queue`| Lists queued songs | `!queue` |
| `!help` | Lists commands embed | `!help` |
