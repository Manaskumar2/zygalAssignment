const mongoose = require("mongoose")

const inputSchema = new mongoose.Schema({

    text: {
    type:String
    },
    userId: {
       type: mongoose.Schema.Types.ObjectId,
        ref :"Users",  
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

module.exports = mongoose.model("inputData", inputSchema)