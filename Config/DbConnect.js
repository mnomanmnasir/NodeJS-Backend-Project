const mongoose = require('mongoose')

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {

            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Mongo DB connected Succesfully")
    }
    catch(error) {
    console.error("Error Connecting Database", error.message)
process.exit(1)    
}
}

module.exports = connectDb