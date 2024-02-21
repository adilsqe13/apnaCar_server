const mongoose = require('mongoose');
const { Schema } = mongoose;

const AgencyProfileSchema = new Schema({
    fullName:{
        type: String,
        required: true
    },
    companyName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    mobile:{
        type: String,
        required: true
    },
    companyAddress:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('agencies', AgencyProfileSchema);