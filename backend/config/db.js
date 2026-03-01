import mongoose from 'mongoose';

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://anjutushartyagi2810_db_user:M5F85qhe2JYCwDU7@cluster0.mcr6mi2.mongodb.net/CuraDesk")
        .then(() => {
            console.log("DB connected")
        }

        )
}