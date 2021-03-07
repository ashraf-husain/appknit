const User = require('../models/userModel')
const bcrypt = require('bcryptjs')

module.exports = {

    signUp: async (req, res) => {
        try {
            const { email, password } = req.body
            const user = new User({
                email,
                password
            })

            await user.save()
            const token = await user.generateAuthToken()
            res.status(200).json({success: true, user,token})

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'internal server error'
            })
            console.log('error:', error)
        }
    },

    login: async (req, res) => {
        try{
            const { email, password } = req.body
            const user = await User.findOne({email})

            if(!user) {
                res.status(403).json({
                    success: false,
                    message: 'Invalid credential'
                })
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if(!isMatch) {
                res.status(403).send('Invalid credential')
            }

            const token = await user.generateAuthToken()

            res.status(200).json({ success: true, user, token })
        } catch(error) {
            res.status(500).json({
                success: false,
                message: 'internal server error'
            })
            console.log('error:', error)
        }
    }
}