import mongoose from "mongoose"


const connectDB = async() => {
try{
    const databaseInstance = await mongoose.connect(`${process.env.MONGO_URL}`)
    console.log("MongooseDB connected successfully")
}catch(error){
console.log('database connection failed',error)

}

}

export default connectDB;
