const mongoose = require("mongoose")
const { Double } = require("mongodb")
const Greens = new mongoose.model("Greens", {
    greens:Number,
    date:String,
    balance:Number,
    group:String
})

module.exports = Greens