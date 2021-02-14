const mongoose = require("mongoose")
const meme = mongoose.Schema({ //model schema with given fields
    name: String,
    caption: String,
    url: String,
    date: Date,
})
module.exports = mongoose.model("memes",meme)