const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({

    title: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: 'public'
    },

    allowComments: {
        type: Boolean,
        required: true
    },

    body: {
        type: String,
        required: true
    },
    file: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    },
    category: {
        // accepts type of _id from categories
        type: Schema.Types.ObjectId,
        ref: 'categories'
    }
});

module.exports = mongoose.model('posts', PostSchema);

