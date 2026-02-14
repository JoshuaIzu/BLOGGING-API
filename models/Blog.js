const mongoose = require('mongoose');


const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxLength: [500, 'Description cannot exceed 500 characters'],
        validate: {
            validator: function(value) {
                return !/<script|javascript:|on\w+=/i.test(value);
            },
            message: 'Description contains invalid characters'
        }
    },
    body: {
        type: String,
        required: true,
        maxlength:[5000, 'Body cannot exceed 5000 characters']
    },
    tags: {
        type: [String],
        default: [],
        validate: {
            validator: function(tags) {
                if(tags.length > 10) return false;
                return tags.every(tag =>
                    tag.length <= 30 &&
                    /^[a-zA-Z0-9\s-_]+$/.test(tag)
                );
            },
            message: 'Invalid tags format or too many tags'
        }
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: function(authorId) {
                return mongoose.Types.ObjectId.isValid(authorId);
            },
            message: 'Invalid author Id'
        }
    }, 
    state: {
        type: String,
        enum: {
            values: ['draft', 'published'],
            message: 'State must be either draft or published'
        },
        default: 'draft'
    },
    read_count: {
        type: Number,
        default: 0,
        min: [0, 'Read count cannot be negative']
    },
    reading_time: {
        type: Number,
        default: 0,
        min: [0, 'Reading time cannot be negative']
    },
},{ timestamps: true });

blogSchema.index({ title: 'text', description: 'text', tags: 'text' });
module.exports = mongoose.model('Blog', blogSchema);