const Expense = require('../models/expensesModel')
const { ObjectId } = require('mongoose').Types

module.exports = {
    saveExpense: async (req, res) => {
        try {
            const { itemName, amount } = req.body
            if (!itemName || !amount) {
                throw Error("Invalid arguments")
            }
            if (isNaN(amount)) {
                throw Error('Invalid amount')
            }
            const userId = req.userId

            const expense = new Expense({
                itemName,
                amount,
                userId
            })
            await expense.save()
            res.status(200).json({
                success: true,
                data: expense
            })

        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            })
            console.log('error:', err)
        }
    },

    getExpenses: async (req, res) => {
        try {
            const userId = ObjectId(req.userId)
            let lastMonthID = new Date().getMonth() || 12
            const expenses = await Expense.aggregate([
                {
                    $match: {
                        userId
                    }
                },
                {
                    $sort: { updatedAt: -1 }
                },
                {
                    $addFields: {
                        'month': { $month: '$createdAt' }
                    }
                },
                {
                    $group: {
                        '_id': '$userId',
                        'expenseList': {
                            $push: '$$ROOT'
                        },
                        'totalExpense': {
                            $sum: '$amount'
                        },
                        'lastMonthExpense': {
                            $sum: {
                                $cond: [
                                    { $eq: ['$month', lastMonthID] },
                                    '$amount',
                                    0
                                ]
                            }
                        }
                    }
                }
            ])
            res.status(200).json({
                success: true,
                data: expenses[0]
            })
        } catch (err) {
            console.log('error:', err)
            res.status(500).json({
                success: false,
                message: 'internal server error'
            })
        }
    }
}