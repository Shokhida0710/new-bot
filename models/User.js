import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    telegramId: {
         type: String,
          unique: true ,
          required: true,
        },
        firstname: {
            type: String,
            default: "foydalanuvchi",
        },
        balance: {
            type: Number,
            default: 4000,
        },
    });
    const User = new mongoose.model("User", userSchema);
    export default User;