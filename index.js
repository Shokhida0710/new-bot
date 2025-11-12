import TelegramBot from "node-telegram-bot-api";
const TOKEN = "8238239595:AAED9NKuyLn97sNvaNpjzAqDxxJWSFy4sSw"
const bot = new TelegramBot(TOKEN, { polling: true });

bot.on("message", (msg) => {
    console.log(msg);
    const chatId = msg.chat.id;
    const text = msg.text;
    const firstName = msg.from.first_name;


    if (text === "/start") {
    bot.sendMessage(
        chatId,
        `👋 Assalomu alaykum, ${firstName}!

📚 100x Academy o‘quv markazining rasmiy botiga xush kelibsiz!

Bu bot orqali siz:
• Kurslarimiz haqida batafsil ma’lumot olasiz  
• Kurslarga onlayn ro‘yxatdan o‘tishingiz mumkin  
• Jadval va to‘lovlar haqida ma’lumot olasiz  

Quyidagi menyudan kerakli bo‘limni tanlang 👇

        `,
         {
        reply_markup: {
            keyboard: [
            [{ text: "📚 Kurslar" }, { text: "✍️ Ro‘yxatdan o‘tish" }],
            [{ text: "ℹ️ Markaz haqida" }, { text: "💬 Fikr bildirish" }],
            [{ text: "❓ Yordam" }],
          ],
            
             resize_keyboard: true,
 
    },
     }
    );
    } else if (text === "==pho") {
     
    }
} );

 
console.log("Bot started...");
