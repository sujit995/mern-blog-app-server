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

router.route("/admin/:id")
    .get(checkLoggedIn, grantAccess('readAny', 'article'), async (req, res) => {
        try {
            const _id = req.params.id;
            const article = await Article.findById(_id);
            if (!article || article.length === 0) {
                return res.status(400).json({ message: 'Article not found' });
            }
            res.status(200).json(article);
        } catch (error) {
            res.status(400).json({ message: 'Error fetching article', error });
        }
    })
    .patch(checkLoggedIn, grantAccess('updateAny', 'article'), async (req, res) => {
        try {
            const _id = req.params.id;
            const article = await Article.findOneAndUpdate(
                { _id },
                {
                    "$set": req.body
                },
                {
                    new: true
                }
            );
            if (!article) return res.status(400).json({ message: 'Article not found' });
            res.status(200).json(article);
        } catch (error) {
            res.status(400).json({ message: 'Error updating article', error });
        }
    })
    .delete(checkLoggedIn, grantAccess('deleteAny', 'article'), async (req, res) => {
        try {
            const _id = req.params.id;
            const article = await Article.findByIdAndRemove(_id);
            if (!article) return res.status(400).json({ message: 'Article not found' });
            res.status(200).json({ _id: article._id });
        } catch (error) {
            res.status(400).json({ message: 'Error deleting', error });
        }
    });






module.exports = router;