const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
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
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }]
}); //prof has },{usePushEach: ture}); don't think i need with my version of mongoose, prof is using 4.x me 5.x

module.exports = mongoose.model('posts', PostSchema);

