import TelegramBot from "node-telegram-bot-api";
import mongoose from "mongoose";
import {config } from "dotenv";
config();

const TOKEN = process.env.BOT_TOKEN;
const ADMINS = ['8510225332','1850157221']; 
const bot = new TelegramBot(TOKEN, { polling: true });

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
         console.log("db is connected...");
    })
    .catch(() => {
        console.log(`Error: db is not connected...!`);
    });


ADMINS.forEach(id => {
    bot.sendMessage(id, '🚀 Bot ishga tushdi va bu test xabari.')
        .catch(error => {
            console.error('⚠️ ADMINGA TEST XABAR YUBORISHDA XATO:', error.message);
        });
});


const userStates = {};

const STEPS = {
    NONE: 0, 
    WAITING_FOR_FULL_NAME: 1, 


    WAITING_FOR_PHONE: 2, 
    WAITING_FOR_DAY: 3,        
    WAITING_FOR_TIME: 4,      
};


bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const firstName = msg.chat.first_name;

    const userState = userStates[chatId] || { step: STEPS.NONE };

    if (text === "❌ Bekor qilish") {
        delete userStates[chatId];
        bot.sendMessage(chatId, `Ro'yxatdan o'tish bekor qilindi. Bosh menyuga qaytish uchun /start ni bosing.`, {
            reply_markup: { remove_keyboard: true }
        });
        return;
    }

   
    if (userState.step === STEPS.WAITING_FOR_FULL_NAME) {
        userState.fullName = text;
        userState.step = STEPS.WAITING_FOR_PHONE;

        bot.sendMessage(
            chatId,
            `Rahmat, **${userState.fullName}**!

Endi, iltimos, siz bilan bog'lanishimiz mumkin bo‘lgan **telefon raqamingizni kiriting**.
*Misol: +998901234567*
            `,
            {
                parse_mode: "Markdown",
                reply_markup: {
                    keyboard: [
                       
                        [{ text: "❌ Bekor qilish" }]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                }
            }
        );
        userStates[chatId] = userState;
        return;
    } 
    
    else if (userState.step === STEPS.WAITING_FOR_PHONE) {
        let phoneNumber = text;

        if (!/^\+?\d{9,15}$/.test(text.replace(/\s/g, ''))) {
            bot.sendMessage(chatId, `⚠️ Noto'g'ri format. Iltimos, telefon raqamingizni to'g'ri kiriting (Masalan: +998901234567).`);
            return;
        }

        userState.phoneNumber = phoneNumber;
        userState.step = STEPS.WAITING_FOR_DAY;
        bot.sendMessage(
            chatId,
            `A'lo! **${userState.phoneNumber}** raqami qabul qilindi.

Iltimos, sizga kursga kelish uchun **qaysi kunlar qulay ekanligini** tanlang:`,
            {
                parse_mode: "Markdown",
                reply_markup: { 
                    inline_keyboard: [
                        [{ text: "1️⃣ Toq kunlar (D/Ch/J)", callback_data: "day_odd" }],
                        [{ text: "2️⃣ Juft kunlar (S/P/Sh)", callback_data: "day_even" }],
                        [{ text: "❌ Bekor qilish", callback_data: "cancel_reg" }]
                    ],
                   
                    remove_keyboard: true 
                }
            }
        );
        userStates[chatId] = userState;
        return;
    } 
    
    if (text == "/start" && userState.step === STEPS.NONE) {
        bot.sendMessage(
            chatId,
            `👋 Assalomu alaykum, ${firstName}!

📚 A+ Academy o‘quv markazining rasmiy botiga xush kelibsiz!

Quyidagi menyudan kerakli bo‘limni tanlang 👇
            `,
            {
                reply_markup: {
                    keyboard: [
                        [{ text: "📚 Kurslar" }, { text: "✍️ Ro‘yxatdan o‘tish" }],
                        [{ text: "ℹ️ Markaz haqida" }],
                    ],
                    resize_keyboard: true,
                    remove_keyboard: false,
                },
            }
        );
    } else if (text == "📚 Kurslar" || text == "✍️ Ro‘yxatdan o‘tish") {
        bot.sendMessage(
            chatId,
            `🎓 Bizning o‘quv markazimizda quyidagi kurslar mavjud:
 
👇 Quyidagi kurslardan birini tanlang va batafsil ma’lumot oling:
            `,
            {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "🇬🇧 Ingliz tili", callback_data: "english" }],
                    ],
                },
            }
        );
    } else {
        if (userState.step === STEPS.NONE) {
             bot.sendMessage(
                chatId,
                `⚠️ Kechirasiz, men sizning xabaringizni tushunmadim. Asosiy menyu uchun /start ni bosing.`
            );
        }
    }
});



bot.on("callback_query", (query) => {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const data = query.data;

    const userState = userStates[chatId] || {};


    if (data === "english") {
        bot.editMessageText( 
            `🇬🇧 *Ingliz tili kursi haqida ma’lumot:*

📘 Boshlang‘ich, o‘rta va yuqori darajalar mavjud.  
🕒 Davomiyligi: 9 oy  
👩‍🏫 O‘qituvchi: Tajribali ustozlar  
📍 Joylashuv: Xorazm, Xiva shahri 
💰 Narxi: Oyiga 550 000 so‘m  

📅 Darslar haftasiga 3 marta, 2.00 soatdan.  
            `,
            {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "✍️ Kursga yozilish", callback_data: "register_english" }],
                        [{ text: "⬅️ Kurslar ro'yxati", callback_data: "back_to_courses" }]
                    ]
                }
            }
        );
    }
    
    else if (data === "register_english") {
        userStates[chatId] = { step: STEPS.WAITING_FOR_FULL_NAME, course: "Ingliz tili" };

        bot.sendMessage(
            chatId,
            `✍️ Ro‘yxatdan o‘tishni boshlaymiz.

Iltimos, **Ism va Familiyangizni** to‘liq kiriting (Masalan: *Islomova Shohida*):
            `,
            {
                parse_mode: "Markdown",
                reply_markup: { remove_keyboard: true }
            }
        );
        bot.answerCallbackQuery(query.id);
    }

    else if (data === "day_odd" || data === "day_even") {
        
        if (data === "day_odd") {
            userState.contactDay = "Toq kunlar (D/Ch/J)";
        } else {
            userState.contactDay = "Juft kunlar (S/P/Sh)";
        }
        
        userStates[chatId] = userState; 
        userState.step = STEPS.WAITING_FOR_TIME; 

        bot.editMessageText(
            `Siz **${userState.contactDay}**ni tanladingiz. Rahmat!

Endi o'zingizga qulay bo'lgan dars **vaqt oralig'ini** tanlang:`,
            {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: { 
                    inline_keyboard: [
                        [{ text: "⏰ 09:00 dan 11:00 gacha", callback_data: "time_9_11" }],
                        [{ text: "🕑 14:00 dan 16:00 gacha", callback_data: "time_2_4" }],
                        [{ text: "🕓 16:00 dan 18:00 gacha", callback_data: "time_4_6" }],
                        [{ text: "❌ Bekor qilish", callback_data: "cancel_reg" }]
                    ]
                }
            }
        );
    }

    else if (data.startsWith("time_")) {
        
        let timeRange = "";
        
        if (data === "time_9_11") {
            timeRange = "09:00 dan 11:00 gacha";
        } else if (data === "time_2_4") {
            timeRange = "14:00 dan 16:00 gacha";
        } else if (data === "time_4_6") {
            timeRange = "16:00 dan 18:00 gacha";
        }
        
        userState.contactTime = timeRange; 

        const registrationSummary = 
`✅ *Yangi Ro'yxatdan O'tish (BOT orqali)*
Kurs: ${userState.course || 'Aniqlanmagan'}
Foydalanuvchi (TG): @${query.from.username || 'mavjud emas'}
Chat ID: ${chatId}
Ism-Familiya: *${userState.fullName || 'Noma\'lum'}*
Telefon raqam: *${userState.phoneNumber || 'Noma\'lum'}*
Qulay kun: *${userState.contactDay || 'Tanlanmagan'}*
Qulay vaqt: *${userState.contactTime}*
Ro'yxatdan o'tish vaqti: ${new Date().toLocaleString('uz-UZ')}
        `;
ADMINS.forEach(id => {
    bot.sendMessage(id, registrationSummary, { parse_mode: "Markdown" })
        .catch(err => console.error("ADMINGA YUBORISHDA XATO:", err.message));
});



        bot.editMessageText(
            `🎉 Tabriklaymiz, **${userState.fullName || 'Ro\'yxatdan o\'tuvchi'}**!
            
Sizning *${userState.course || 'kurs'}* kursiga ro'yxatdan o'tish so'rovingiz qabul qilindi.
Tanlagan vaqtingiz (${userState.contactDay || 'kun'}, ${userState.contactTime}) bo'yicha markazimiz xodimi tez orada siz bilan bog'lanadi.

Asosiy menyuga qaytish uchun /start ni bosing.`,
            { 
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown" 
            }
        );

        delete userStates[chatId];
        bot.answerCallbackQuery(query.id, "Ro'yxatdan o'tish yakunlandi!");
    }



    
    else if (data === "back_to_courses") {
        bot.editMessageText(
            `🎓 Bizning o‘quv markazimizda quyidagi kurslar mavjud:
// ... kurslar ro'yxati
            `,
            {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "🇬🇧 Ingliz tili", callback_data: "english" }],
                    ],
                },
            }
        );
    }
    
    else if (data === "cancel_reg") {
        delete userStates[chatId];
        bot.sendMessage(chatId, `Ro'yxatdan o'tish bekor qilindi. Bosh menyuga qaytish uchun /start ni bosing.`);
        bot.deleteMessage(chatId, messageId).catch(()=>{});
    }

    else {
        bot.answerCallbackQuery(query.id, "Batafsil ma'lumot tez orada qo'shiladi!");
    }
});

console.log("Bot ishga tushdi...");