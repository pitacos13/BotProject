const botToken = "5364174942:AAHPLDmFdHypkQ2krA1vGYrg8vP5iC_BCkA"
const {Telegraf} = require("telegraf")
const {Markdow} = require('telegraf');
const bot = new Telegraf(botToken)
const db = require("./db/db")
const Reds = require("./db/model/Reds")
const Greens = require("./db/model/Greens")
const mongoose = require("mongoose")
const express = require("express")
const app = express()
const axios = require("axios")
process.env.TZ = 'America/Sao_Paulo';
console.log(new Date(Date.now()).toLocaleDateString("pt-BR"))
app.listen(process.env.PORT, ()=>{
    console.log("CONNECTED")
})
app.get("/", (req,res)=>{
    res.json({status:"RUNNING"})
})

setInterval(()=>{
    try{
        axios({
            url:"https://pitacosbot13.herokuapp.com/",
            method:"GET"
        }).then((r)=>{
            ""
        })
    }catch(e){
        bot.telegram.sendMessage(534824454, e.message)
    }  
}, 50000)
db()

setInterval(()=>{
    try{
        if(new Date(Date.now()).toLocaleTimeString("pt-BR") == "09:00:00" || new Date(Date.now()).toLocaleTimeString("pt-BR") == "15:00:00" || new Date(Date.now()).toLocaleTimeString("pt-BR") == "23:00:00"){
            verifyExist()
        } 
    }catch(e){
        bot.telegram.sendMessage(534824454, e.message)
    }  
},1000)
bot.on("new_chat_members", async(ctx)=>{
    try{
    if(await Reds.findOne({group:"Vip", date:new Date(Date.now()).toLocaleDateString("pt-BR")}) == null){
        await Reds.create({group:"Vip",reds:0, date:new Date(Date.now()).toLocaleDateString("pt-BR"), balance:new Double(0.0)})
    }
    if(await Greens.findOne({group:"Vip", date:new Date(Date.now()).toLocaleDateString("pt-BR")}) == null){
        await Greens.create({group:"Vip", greens:0, date:new Date(Date.now()).toLocaleDateString("pt-BR"), balance:new Double(0.0)})
    }
    if(await Reds.findOne({group:"Free", date:new Date(Date.now()).toLocaleDateString("pt-BR")}) == null){
        await Reds.create({group:"Free",reds:0, date:new Date(Date.now()).toLocaleDateString("pt-BR"), balance:new Double(0.0)})
    }
    if(await Greens.findOne({group:"Free", date:new Date(Date.now()).toLocaleDateString("pt-BR")}) == null){
        await Greens.create({group:"Free", greens:0, date:new Date(Date.now()).toLocaleDateString("pt-BR"), balance:new Double(0.0)})
    }
    let green = 0.5
    let red = 3.5
    let totallyOfRedsOfDayVip = await Reds.findOne({group:"Vip", date:new Date(Date.now()).toLocaleDateString("pt-BR")})
    let totallyOfRedsOfDayFree = await Reds.findOne({group:"Free", date:new Date(Date.now()).toLocaleDateString("pt-BR")})
    let totallyOfRedsVip = await Reds.find({group:"Vip"})
    let totallyOfRedsFree = await Reds.find({group:"Free"})
    let tRedVip = 0;
    let tRedFree = 0;
    let totOfRedBlanceFree = 0;
    let totOfRedBlanceVip = 0;
    for(let red of totallyOfRedsVip){
        tRedVip = tRedVip+red.reds
        totOfRedBlanceVip = totOfRedBlanceVip+red.balance
    }
    for(let red of totallyOfRedsFree){
        tRedFree = tRedFree+red.reds
        totOfRedBlanceFree = totOfRedBlanceFree+red.balance
    }
    let totallyOfGreensOfDayVip = await Greens.findOne({group:"Vip", date:new Date(Date.now()).toLocaleDateString("pt-BR")})
    let totallyOfGreensOfDayFree = await Greens.findOne({group:"Free", date:new Date(Date.now()).toLocaleDateString("pt-BR")})
    let totallyOfGreensVip = await Greens.find({group:"Vip"})
    let totallyOfGreensFree = await Greens.find({group:"Free"})
    let tGreenBalanceVip = 0;
    let tGreenBalanceFree = 0;
    let totGreensVip = 0;
    let totGreensFree = 0;
    for(let green of totallyOfGreensVip){
        tGreenBalanceVip = tGreenBalanceVip+green.balance 
        totGreensVip += green.greens
    }
    for(let green of totallyOfGreensFree){
        tGreenBalanceFree = tGreenBalanceFree+green.balance 
        totGreensFree += green.greens
    }
    let wordVip = tRedVip + totGreensVip == 1?"ENTRADA":"ENTRADAS"
    let wordTwoVip = totallyOfRedsOfDayVip.reds + totallyOfRedsOfDayVip.reds == 1?"ENTRADA":"ENTRADAS"
    let wordFree = tRedFree + totGreensFree == 1?"ENTRADA":"ENTRADAS"
    let wordTwoFree = totallyOfRedsOfDayFree.reds + totallyOfRedsOfDayFree.reds == 1?"ENTRADA":"ENTRADAS"
    if(ctx.chat.id == -1001584014524){
        await bot.telegram.sendMessage(-1001584014524, `📌 RESUMO MENSAL\r\n✅ ${totGreensVip}\r\n⛔ ${tRedVip}\r\n${totGreensVip+tRedVip} ${wordVip} NO TOTAL\r\n${isNaN((((totGreensVip)/(tRedVip+totGreensVip))*100).toFixed(2))?"0.00":(((totGreensVip)/(tRedVip+totGreensVip))*100).toFixed(2)}% TAXA DE ACERTO\r\n\r\n📌 RESUMO DIA ${new Date(Date.now()).toLocaleDateString("pt-BR")}\r\n✅ ${totallyOfGreensOfDayVip.greens}\r\n\⛔️ ${totallyOfRedsOfDayVip.reds}\r\n${totallyOfGreensOfDayVip.greens+totallyOfRedsOfDayVip.reds} ${wordTwoVip} NO TOTAL\r\n${isNaN((totallyOfGreensOfDayVip.greens/(totallyOfRedsOfDayVip.reds+totallyOfGreensOfDayVip.greens)*100).toFixed(2))?"0.00":(totallyOfGreensOfDayVip.greens/(totallyOfRedsOfDayVip.reds+totallyOfGreensOfDayVip.greens)*100).toFixed(2)}% TAXA DE ACERTO\r\n\r\n💰 Lucro acumulado:💰${(tGreenBalanceVip-totOfRedBlanceVip)}%\r\n\r\nAtualizado em tempo real.`)
    }else if(ctx.chat.id == -1001589546462){
        await bot.telegram.sendMessage(-1001589546462, `📌 RESUMO MENSAL\r\n✅ ${totGreensFree}\r\n⛔ ${tRedFree}\r\n${totGreensFree+tRedFree} ${wordFree} NO TOTAL\r\n${isNaN((((totGreensFree)/(tRedFree+totGreensFree))*100).toFixed(2))?"0.00":(((totGreensFree)/(tRedFree+totGreensFree))*100).toFixed(2)}% TAXA DE ACERTO\r\n\r\n📌 RESUMO DIA ${new Date(Date.now()).toLocaleDateString("pt-BR")}\r\n✅ ${totallyOfGreensOfDayFree.greens}\r\n\⛔️ ${totallyOfRedsOfDayFree.reds}\r\n${totallyOfGreensOfDayFree.greens+totallyOfRedsOfDayFree.reds} ${wordTwoFree} NO TOTAL\r\n${isNaN((totallyOfGreensOfDayFree.greens/(totallyOfRedsOfDayFree.reds+totallyOfGreensOfDayFree.greens)*100).toFixed(2))?"0.00":(totallyOfGreensOfDayFree.greens/(totallyOfRedsOfDayFree.reds+totallyOfGreensOfDayFree.greens)*100).toFixed(2)}% TAXA DE ACERTO\r\n\r\n💰 Lucro acumulado:💰${(tGreenBalanceFree-totOfRedBlanceFree)}%\r\n\r\nAtualizado em tempo real.`)  
    }
}catch(e){
    bot.telegram.sendMessage(534824454, e.message)
}  
})
let decrement = "⛔"
let accrement = "✅";
var Double = require("mongodb").Double;

async function verifyExist(){
    try{
    if(await Reds.findOne({group:"Vip", date:new Date(Date.now()).toLocaleDateString("pt-BR")}) == null){
        await Reds.create({group:"Vip",reds:0, date:new Date(Date.now()).toLocaleDateString("pt-BR"), balance:new Double(0.0)})
    }
    if(await Reds.findOne({group:"Free", date:new Date(Date.now()).toLocaleDateString("pt-BR")}) == null){
        await Reds.create({group:"Free",reds:0, date:new Date(Date.now()).toLocaleDateString("pt-BR"), balance:new Double(0.0)})
    }
    if(await Greens.findOne({group:"Vip", date:new Date(Date.now()).toLocaleDateString("pt-BR")}) == null){
        await Greens.create({group:"Vip", greens:0, date:new Date(Date.now()).toLocaleDateString("pt-BR"), balance:new Double(0.0)})
    }
    if(await Greens.findOne({group:"Free", date:new Date(Date.now()).toLocaleDateString("pt-BR")}) == null){
        await Greens.create({group:"Free", greens:0, date:new Date(Date.now()).toLocaleDateString("pt-BR"), balance:new Double(0.0)})
    }
    await sendAlert()
}catch(e){
    bot.telegram.sendMessage(534824454, e.message)
}  
}

bot.on("message", (ctx)=>{
    if(ctx.message.text == "/pronto"){
        return verifyExist()
    }
})

async function sendAlert(){
    try{
    let green = 0.5
    let red = 3.5

    // FREE AND VIP
    let totallyOfRedsOfDayVip = await Reds.findOne({group:"Vip", date:new Date(Date.now()).toLocaleDateString("pt-BR")})
    let totallyOfRedsOfDayFree = await Reds.findOne({group:"Free", date:new Date(Date.now()).toLocaleDateString("pt-BR")})
    let totallyOfRedsVip = await Reds.find({group:"Vip"})
    let totallyOfRedsFree = await Reds.find({group:"Free"})
    let tRedVip = 0;
    let tRedFree = 0;
    let totOfRedBlanceFree = 0;
    let totOfRedBlanceVip = 0;
    for(let red of totallyOfRedsVip){
        tRedVip = tRedVip+red.reds
        totOfRedBlanceVip = totOfRedBlanceVip+red.balance
    }
    for(let red of totallyOfRedsFree){
        tRedFree = tRedFree+red.reds
        totOfRedBlanceFree = totOfRedBlanceFree+red.balance
    }


    //----------
    let totallyOfGreensOfDayVip = await Greens.findOne({group:"Vip", date:new Date(Date.now()).toLocaleDateString("pt-BR")})
    let totallyOfGreensOfDayFree = await Greens.findOne({group:"Free", date:new Date(Date.now()).toLocaleDateString("pt-BR")})
    let totallyOfGreensVip = await Greens.find({group:"Vip"})
    let totallyOfGreensFree = await Greens.find({group:"Free"})
    let tGreenBalanceVip = 0;
    let tGreenBalanceFree = 0;
    let totGreensVip = 0;
    let totGreensFree = 0;
    for(let green of totallyOfGreensVip){
        tGreenBalanceVip = tGreenBalanceVip+green.balance 
        totGreensVip += green.greens
    }
    for(let green of totallyOfGreensFree){
        tGreenBalanceFree = tGreenBalanceFree+green.balance 
        totGreensFree += green.greens
    }

    //-----------
    let wordVip = tRedVip + totGreensVip == 1?"ENTRADA":"ENTRADAS"
    let wordTwoVip = totallyOfRedsOfDayVip.reds + totallyOfRedsOfDayVip.reds == 1?"ENTRADA":"ENTRADAS"
    let wordFree = tRedFree + totGreensFree == 1?"ENTRADA":"ENTRADAS"
    let wordTwoFree = totallyOfRedsOfDayFree.reds + totallyOfRedsOfDayFree.reds == 1?"ENTRADA":"ENTRADAS"




    //vip
    await bot.telegram.sendMessage(-1001584014524, `📌 RESUMO MENSAL\r\n✅ ${totGreensVip}\r\n⛔ ${tRedVip}\r\n${totGreensVip+tRedVip} ${wordVip} NO TOTAL\r\n${isNaN((((totGreensVip)/(tRedVip+totGreensVip))*100).toFixed(2))?"0.00":(((totGreensVip)/(tRedVip+totGreensVip))*100).toFixed(2)}% TAXA DE ACERTO\r\n\r\n📌 RESUMO DIA ${new Date(Date.now()).toLocaleDateString("pt-BR")}\r\n✅ ${totallyOfGreensOfDayVip.greens}\r\n\⛔️ ${totallyOfRedsOfDayVip.reds}\r\n${totallyOfGreensOfDayVip.greens+totallyOfRedsOfDayVip.reds} ${wordTwoVip} NO TOTAL\r\n${isNaN((totallyOfGreensOfDayVip.greens/(totallyOfRedsOfDayVip.reds+totallyOfGreensOfDayVip.greens)*100).toFixed(2))?"0.00":(totallyOfGreensOfDayVip.greens/(totallyOfRedsOfDayVip.reds+totallyOfGreensOfDayVip.greens)*100).toFixed(2)}% TAXA DE ACERTO\r\n\r\n💰 Lucro acumulado:💰${(tGreenBalanceVip-totOfRedBlanceVip)}%\r\n\r\nAtualizado em tempo real.`)
    //free
    await bot.telegram.sendMessage(-1001589546462, `📌 RESUMO MENSAL\r\n✅ ${totGreensFree}\r\n⛔ ${tRedFree}\r\n${totGreensFree+tRedFree} ${wordFree} NO TOTAL\r\n${isNaN((((totGreensFree)/(tRedFree+totGreensFree))*100).toFixed(2))?"0.00":(((totGreensFree)/(tRedFree+totGreensFree))*100).toFixed(2)}% TAXA DE ACERTO\r\n\r\n📌 RESUMO DIA ${new Date(Date.now()).toLocaleDateString("pt-BR")}\r\n✅ ${totallyOfGreensOfDayFree.greens}\r\n\⛔️ ${totallyOfRedsOfDayFree.reds}\r\n${totallyOfGreensOfDayFree.greens+totallyOfRedsOfDayFree.reds} ${wordTwoFree} NO TOTAL\r\n${isNaN((totallyOfGreensOfDayFree.greens/(totallyOfRedsOfDayFree.reds+totallyOfGreensOfDayFree.greens)*100).toFixed(2))?"0.00":(totallyOfGreensOfDayFree.greens/(totallyOfRedsOfDayFree.reds+totallyOfGreensOfDayFree.greens)*100).toFixed(2)}% TAXA DE ACERTO\r\n\r\n💰 Lucro acumulado:💰${(tGreenBalanceFree-totOfRedBlanceFree)}%\r\n\r\nAtualizado em tempo real.`)
}catch(e){
    bot.telegram.sendMessage(534824454, e.message)
}  
}

bot.on("edited_message", async(ctx)=>{
    try{
    let groupVip = -1001584014524
    let groupName;
    if(ctx.chat.id == groupVip){
        groupName = "Vip"
    }else{
        return
    }
    if(ctx.editedMessage.text.includes(decrement)){
    let valuesAlloweds = {1:0.5, 2:1.5, 3:3.5}
    let finded = ctx.editedMessage.text.match(new RegExp("⛔", "g")).length
    let valueRetrived = finded
    let valueLocated = 0;
    for(let i = 0; i < valueRetrived; i++){
        valueLocated += valueLocated + 0.5
    }
        if(await Reds.findOne({group:groupName, date:new Date(Date.now()).toLocaleDateString("pt-BR")}) == null){
            await Reds.create({reds:1, date:new Date(Date.now()).toLocaleDateString("pt-BR"), balance:new Double(valueLocated), group:groupName})
        }else{
            let findActuallyResult = await Reds.findOne({group:groupName, date:new Date(Date.now()).toLocaleDateString("pt-BR")})
            await Reds.findOneAndUpdate({group:groupName, date:new Date(Date.now()).toLocaleDateString("pt-BR"), group:groupName}, {reds:findActuallyResult.reds + 1, balance:new Double(findActuallyResult.balance)+new Double(valueLocated)})
        }
    }else if(ctx.editedMessage.text.includes(accrement)){
        let valuesAlloweds = 0.5
        let valueLocated = valuesAlloweds
        if(await Greens.findOne({group:groupName, date:new Date(Date.now()).toLocaleDateString("pt-BR")}) == null){
            await Greens.create({greens:1, date:new Date(Date.now()).toLocaleDateString("pt-BR"), balance:new Double(valuesAlloweds), group:groupName})
        }else{
            let findActuallyResult = await Greens.findOne({group:groupName, date:new Date(Date.now()).toLocaleDateString("pt-BR")})
            await Greens.findOneAndUpdate({date:new Date(Date.now()).toLocaleDateString("pt-BR"), group:groupName}, {greens:findActuallyResult.greens + 1, balance:findActuallyResult.balance+new Double(valueLocated)})
        }
    }
}catch(e){
    bot.telegram.sendMessage(534824454, e.message)
}  
})
bot.on("edited_channel_post", async(ctx)=>{
    try{
    let groupVip = -1001589546462
    let groupName;
    
    if(ctx.chat.id == groupVip){
        groupName = "Free"
    }else{
        return
    }
    if(ctx.editedChannelPost.text.includes(decrement)){
    let valuesAlloweds = {1:0.5, 2:1.5, 3:3.5}
    let finded = ctx.editedChannelPost.text.match(new RegExp("⛔", "g")).length
    let valueRetrived = finded
    let valueLocated = 0;
    for(let i = 0; i < valueRetrived; i++){
        valueLocated += valueLocated + 0.5
    }
        if(await Reds.findOne({group:groupName, date:new Date(Date.now()).toLocaleDateString("pt-BR")}) == null){
            await Reds.create({reds:1, date:new Date(Date.now()).toLocaleDateString("pt-BR"), balance:new Double(valueLocated), group:groupName})
        }else{
            let findActuallyResult = await Reds.findOne({group:groupName, date:new Date(Date.now()).toLocaleDateString("pt-BR")})
            await Reds.findOneAndUpdate({group:groupName, date:new Date(Date.now()).toLocaleDateString("pt-BR"), group:groupName}, {reds:findActuallyResult.reds + 1, balance:new Double(findActuallyResult.balance)+new Double(valueLocated)})
        }
    }else if(ctx.editedChannelPost.text.includes(accrement)){
        let valuesAlloweds = 0.5
        let valueLocated = valuesAlloweds
        if(await Greens.findOne({group:groupName, date:new Date(Date.now()).toLocaleDateString("pt-BR")}) == null){
            await Greens.create({greens:1, date:new Date(Date.now()).toLocaleDateString("pt-BR"), balance:new Double(valuesAlloweds), group:groupName})
        }else{
            let findActuallyResult = await Greens.findOne({group:groupName, date:new Date(Date.now()).toLocaleDateString("pt-BR")})
            await Greens.findOneAndUpdate({date:new Date(Date.now()).toLocaleDateString("pt-BR"), group:groupName}, {greens:findActuallyResult.greens + 1, balance:findActuallyResult.balance+new Double(valueLocated)})
        }
    }
}catch(e){
    bot.telegram.sendMessage(534824454, e.message)
}  
})
bot.launch()
