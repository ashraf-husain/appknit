const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const userController = require('./controllers/userController')
const expenseController = require('./controllers/expenseController')
const auth = require('./middlewares/auth')

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost:27017/appknit', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, () => {
    console.log('Connected to database')
})

app.post('/user/signUp', userController.signUp)
app.post('/user/signin', userController.login)
app.get('/test', auth.checkLogin, (req, res) => {
    try {
        return res.status(200).json({ success: true, message: "Success" })
    } catch (err) {
        // console.log("test error", err)
        return res.status(403).json({ success: false, message: err.message })
    }
})
app.post('/expenses/save-expenses', auth.checkLogin, expenseController.saveExpense)
app.get('/expenses/get-expenses', auth.checkLogin, expenseController.getExpenses)



app.listen(3000, () => {
    console.log('Listening on port 3000')
})
