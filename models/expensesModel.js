const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ExpenseSchema = new Schema({
    itemName: {
        type: String,
        require: true,
        trim: true
    },
    amount: {
       type: Number,
       required: true 
    },
    userId: {
        type: Schema.Types.ObjectId
    }
}, { timestamps: true })

module.exports = mongoose.model('Expenses', ExpenseSchema)