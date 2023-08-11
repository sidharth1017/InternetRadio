const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    phone: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        required: false,
    },
    activated: {
        type: Boolean,
        required: false,
        default: false
    },

}, {
    timestamps: true,
    toJSON: {getters: true},
});

module.exports = mongoose.model('User', userSchema, 'users');