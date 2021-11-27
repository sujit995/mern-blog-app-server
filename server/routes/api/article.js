const express = require('express');
let router = express.Router();
const { checkLoggedIn } = require('../../middleware/auth');
const { grantAccess } = require('../../middleware/roles');

const { Article } = require('../../models/article_model');


router.route('/admin/add_articles')
    .post(checkLoggedIn, grantAccess('createAny', 'article'), async (req, res) => {
        try {
            const article = new Article({
                ...req.body,
                score: parseInt(req.body.score)
            });
            const result = await article.save();
            res.status(200).json(result)
        } catch (error) {
            res.status(400).json({ message: 'Error adding article', error: error })
        }
    })