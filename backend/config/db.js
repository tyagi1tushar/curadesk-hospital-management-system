import mongoose from 'mongoose';

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://anjutushartyagi2810_db_user:SmIb5T1vkBkdq4cb@cluster0.mcr6mi2.mongodb.net/CuraDesk")
        .then(() => {
            console.log("DB connected")
        }

        )
}