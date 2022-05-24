const { Double } = require("mongodb")
const mongoose = require("mongoose")

const Reds = new mongoose.model("Reds", {
    reds:Number,
    date:String,
    balance:Number,
    group:String
})

module.exports = Reds