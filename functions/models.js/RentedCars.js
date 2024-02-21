const mongoose = require('mongoose');
const { Schema } = mongoose;

const RentedCarsSchema = new Schema({
    userId: {
        type: String,
        ref: 'user'
    },
    carId: {
        type: String,
        required: true
    },
    sellerId: {
        type: String,
        required: true
    },
    product: {
        type: Object,
        required: true,
    },
    days: {
        type: Number,
        required:true,
    },
    starting_date: {
        type: Date,
        required:true,
    },
    amount: {
        type: Number,
        default: function () {
            return this.days * this.product[0].rent;
        },
    },
    order_status:{
        type: String,
        default: 'Pending',
    },

    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('rented-cars', RentedCarsSchema);