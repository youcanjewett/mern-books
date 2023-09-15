const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        //strictyQuery, false = makes sure values passed that weren't in the schema are not saved in db
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database connected ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;