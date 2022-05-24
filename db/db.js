let userName = "user_onePitaco"
let userPassword = "pitacobot2022"
const mongoose = require("mongoose")
module.exports = async function dbConnect(){
    const url = `mongodb+srv://${userName}:${userPassword}@cluster0.tpksj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    await mongoose.connect(url, (err)=>{
        if(err) throw err
    })
}