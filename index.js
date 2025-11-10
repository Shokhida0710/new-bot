import TelegramBot from "node-telegram-bot-api";
const TOKEN = "8238239595:AAED9NKuyLn97sNvaNpjzAqDxxJWSFy4sSw"
const bot = new TelegramBot(TOKEN, { polling: true });
bot.on("message", (msg) => {