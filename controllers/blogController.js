const Blog = require('../models/Blog');
const User = require('../models/User');
const { calculateReadingTime } = require('../utils/readingTime');
const validator = require('validator');

const createBlog = async (req, res) => {
    try {
        const { title, description, body, tags, author } = req.body;

        const sanitizedData = {
            title: validator.escape(validator.trim(title || '')),
            description: validator.escape(validator.trim(description || '')),
            body: validator.trim(body || ''),
            tags: Array.isArray(tags) ? tags.map(tag => validator.escape(validator.trim(tag || ''))) : [],
            author: req.user.id,
            state: 'draft',
            read_count: 0,
            reading_time: calculateReadingTime(body || ''),
        };

        if(validator.isEmpty(sanitizedData.title)) return res.status(400).json({ error: 'Title required' });
        if (validator.isEmpty(sanitizedData.description)) return res.status(400).json({ error: 'Description required' });
        if (validator.isEmpty(sanitizedData.body)) return res.status(400).json({ error: 'Body required' });

        const blog = await Blog.create(sanitizedData);
        res.status(201).json({ status: 'success', data: blog });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({
            error: 'Title must be unique'});
        res.status(500).json({ error: error.message });
    }

}

const getPublishedBlogs = async(req, res) => {
    try {
        const { page = 1, limit = 20, search, sort } = req.query;
        let query = { state: 'published' };

        if (search && !validator.isEmpty(search)) {
            const searchTerm = validator.escape(validator.trim(search));
            
            const authors = await User.find({
                $or: [
                    { first_name: { $regex: searchTerm, $options: 'i' } },
                    { last_name: { $regex: searchTerm, $options: 'i' } }
                ]
            }).select('_id');

            const authorIds = authors.map(a => a._id);

            query.$or = [
                { title: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { tags: { $in: [new RegExp(searchTerm, 'i')] } },
                { author: { $in: authorIds } }
            ];
        }

        const sortMap = {
            'read_count': { read_count: -1 },
            'reading_time': { reading_time: -1 },
            'timestamp': { createdAt: -1 }
        };
        const sortObj = sortMap[sort] || { createdAt: -1 };

        const blogs = await Blog.find(query)
            .sort(sortObj)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate('author', 'first_name last_name email');
            
        const total = await Blog.countDocuments(query);

        res.json({
            status: 'success',
            data: blogs,
            page: Number(page),
            pages: Math.ceil(total / limit),
            total
        })
        } catch (error) {
            res.status(500).json({ error: error.message });            
        };
};


const getSingleBlog = async(req, res) => {
    try {
        const { id } = req.params;
        
        if (!validator.isMongoId(id)) {
            return res.status(400).json({ error: 'Invalid blog ID' });
        }

        const blog = await Blog.findOneAndUpdate(
        { _id: id, state: 'published' },
        { $inc: { read_count: 1 }},
        { new: true }
        ).populate('author', 'first_name last_name email');

        if(!blog) {
            return res.status(404).json({ error: 'Blog not found or not published' })
        }

        res.json({ status: 'success', data: blog });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getMyBlogs = async(req, res) => {
    try {
        const { page = 1, limit = 20, state } = req.query;
        const query = { author: req.user.id };

        if (state && ['draft', 'published'].includes(state)){
            query.state = state;
        }

        const blogs = await Blog.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Blog.countDocuments(query);

        res.json({
            status: 'success',
            data: blogs,
            page: Number(page),
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateBlog = async(req, res) => {
    try {
        const { id } = req.params;
        const { title, description, body, tags, state } = req.body;

        if (!validator.isMongoId(id)) 
            return res.status(400).json({ error: 'Invalid blog ID' });

        const blog = await Blog.findOne({ _id: id, author: req.user.id });

        if(!blog) {
            return res.status(404).json({ error: 'Blog not found' })
        }

        if(title) blog.title = validator.escape(validator.trim(title));
        if(description) blog.description = validator.escape(validator.trim(description));


        if(tags && Array.isArray(tags)) {
            blog.tags = tags.map(tag => validator.escape(validator.trim(tag || '')));
        }

        if(body) {
            blog.body = validator.trim(body);
            blog.reading_time = calculateReadingTime(blog.body);
        }

        await blog.save();
        res.json({ status: 'success', data: blog });

} catch (error) {
    res.status(500).json({ error: error.message });
    }
};

const deleteBlog = async(req, res) => {
    try {
        const { id } = req.params;
        if(!validator.isMongoId(id)) return res.status(400).json({ error: 'Invalid blog Id' });

        const blog = await Blog.findOneAndDelete({ _id:id, author: req.user.id });

        if(!blog) {
            return res.status(404).json({ error: 'Blog not found' })
        }
        res.json({ status: 'success', message: 'Blog deleted successfully' })
    }  catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 

const publishBlog = async(req, res) => {
    try {
        const { id } = req.params;

        if(!validator.isMongoId(id)) return res.status(400).json({ error: 'Invalid blog id'})
            const blog = await Blog.findOneAndUpdate(
                { _id: id, author: req.user.id },
                { state: 'published' },
                { new: true }
            );
        if(!blog) {
            return res.status(404).json({ error: 'Blog not found' })
        }

        res.json({ status: 'success', data: blog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createBlog,
    getPublishedBlogs,
    getSingleBlog,
    getMyBlogs,
    updateBlog,
    deleteBlog,
    publishBlog
}