const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 50
    }
}, {timestamps: true})

UserSchema.methods.generateAuthToken = async function () {
    const user = this
    return jwt.sign({ _id: user._id.toString() }, process.env.ENC_KEY)

}

UserSchema.pre('save', async function(next) {

    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }

    next()
})

module.exports = mongoose.model('User', UserSchema)