import mongoose from 'mongoose'
import {} from 'dotenv/config'


export async function connect () {
    // Database Connection 
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        family: 4
    })
    .then(() => {
        console.log("DB Connected !!")
    })
    .catch((err) => {
        console.log("There is an issue trying to connect to your database")
    })
}