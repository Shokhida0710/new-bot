import {bot} from "../index.js";
import User from "../models/User.js";

async function onUsers() {
 console.log(`onUsers...`);
  const userCount = await User.countDocuments();

  bot.sendMessage(chatId, `Foydalanuvchilar soni: ${userCount}`);
}

export default onUsers;



    
