const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// get all posts
router.get('/', async (req, res) => {
	console.log('======================');
	try {
		const dbPostData = await Post.findAll({
			attributes: [
				'id',
				'contents',
				'title',
				'created_at'
			],
			include: [
				{
					model: Comment,
					attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
					include: {
						model: User,
						attributes: ['username']
					}
				},
				{
					model: User,
					attributes: ['username']
				}
			]
		});
		res.json(dbPostData);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});

router.get('/:id', async (req, res) => {
	try {
		const dbPostData = await Post.findOne({
			where: {
				id: req.params.id
			},
			attributes: [
				'id',
				'contents',
				'title',
				'created_at'
			],
			include: [
				{
					model: Comment,
					attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
					include: {
						model: User,
						attributes: ['username']
					}
				},
				{
					model: User,
					attributes: ['username']
				}
			]
		});
		if (!dbPostData) {
			res.status(404).json({ message: 'No post found with this id' });
			return;
		}
		res.json(dbPostData);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});

router.post('/', withAuth, async (req, res) => {
	// expects {title: 'Taskmaster goes public!', contents: 'https://taskmaster.com/press', user_id: 1}
	try {
		const dbPostData = await Post.create({
			title: req.body.title,
			contents: req.body.contents,
			user_id: req.session.user_id
		});
		res.json(dbPostData)
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});

router.put('/:id', withAuth, async (req, res) => {
	try {
		const dbPostData = await Post.update(
			{
				title: req.body.title
			},
			{
				where: {
					id: req.params.id
				}
			}
		);
		if (!dbPostData) {
			res.status(404).json({ message: 'No post found with this id' });
			return;
		}
		res.json(dbPostData);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});

router.delete('/:id', withAuth, async (req, res) => {
	console.log('id', req.params.id);
	try {
		const dbPostData = await Post.destroy({
			where: {
				id: req.params.id
			}
		})
		if (!dbPostData) {
			res.status(404).json({ message: 'No post found with this id' });
			return;
		}
		res.json(dbPostData);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});

module.exports = router;
