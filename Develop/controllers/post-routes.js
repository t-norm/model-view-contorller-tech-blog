const router = require('express').Router();
const auth = require('../utils/auth');
const { Post, User, Comment } = require('../models');

router.get('/', async (req, res) => {
    try {
        const response = await Post.findAll({
        attributes: ['id', 'title', 'user_id'],
        include: [
            { model: User, attributes: ['username'] },
            { model: Comment, attributes: ['content']}
        ]
        });
        res.json(response)
    }
    catch (err) {
        res.status(500).json(err);
    };
});

router.get('/create', auth, (req, res) => {
    res.render('create-post', { loggedIn: true }); 
});

router.get('/update/:id', auth, async (req, res) => {
    try {
        const response = await Post.findOne({
            where: { id: req.params.id },
            attributes: ['id', 'title', 'content', 'user_id', 'createdAt'],
            include: { model: User, attributes: ['username'] },
        });
        if (!response) {
            res.status(404).json({ message: 'No posts found with this ID!' });
            return;
        }
        const post = response.get({ plain: true });
        res.render('update-post', { post, loggedIn: true }); 
    }
    catch (err) {
        res.status(500).json(err);
    };
});

router.get('/:id', async (req, res) => {
    try {
        const response = await Post.findOne({
            where: { id: req.params.id },
            attributes: ['id', 'title', 'content', 'user_id', 'createdAt'],
            include: [
                { model: User, attributes: ['username'] },
                { model: Comment, include: { model: User }}
            ]
        });
        if (!response) {
            res.status(404).json({ message: 'No posts found with this ID!' });
            return;
        }
        const post = response.get({ plain: true });
        res.render('single-post', { post, loggedIn: req.session.loggedIn, home: true});
    }
    catch (err) {
        res.status(500).json(err);
    };
});

router.post('/', async (req, res) => {
    try {
        const response = await Post.create({
            title: req.body.title,
            content: req.body.content,
            user_id: req.session.user_id 
        })
        res.json(response);
    }
    catch (err) {
        res.status(500).json(err);
    };
});

router.put('/:id', async (req, res) => {
    try {
        const response = await Post.update(
            { title: req.body.title, content: req.body.content },
            { where: { id: req.params.id }}
        );
        if (!response) {
            res.status(404).json({ message: 'No posts found with this ID!' });
            return;
        }
        res.json(response)
    }
    catch (err) {
        res.status(500).json(err);
    };
});

router.delete('/', async (req, res) => {
    try {
        const response = await Post.destroy({
            where: { id: req.body.id },
        })
        if (!response) {
            res.status(404).json({ message: 'No posts found!' });
            return;
        }
        res.json(response);
    }
    catch (err) {
        res.status(500).json(err);
    };
});

module.exports = router;