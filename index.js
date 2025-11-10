import TelegramBot from "node-telegram-bot-api";
const TOKEN = "8238239595:AAED9NKuyLn97sNvaNpjzAqDxxJWSFy4sSw"
const bot = new TelegramBot(TOKEN, { polling: true });
bot.on("message", function (msg) {
    const chatId = msg.chat.id;
    const text = msg.text;
    const firstName = msg.from.first_name;
    if (text === "/start") {
    bot.sendMessage(chatId, "Welcome  , ${ firstName}" , {
        reply_markup: {
            keyboard: [
                [{ text: "Send me a photo" }],
                [{ text: "Send me a sticker" }]
            ],
             resize_keyboard: true,

    }
    });

} );
