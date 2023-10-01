const express = require('express')
const router = express.Router();

const {getPostById,getPosts,createPost,updatePost,deletePost, likePost} = require('../controllers/postController')
const auth = require('../middleware/auth')

router.get('/',getPosts)
router.get('/:id',getPostById)

router.post('/',auth,createPost)
router.patch('/:id',auth,updatePost)
router.delete('/:id',auth,deletePost)
router.post('/like/:id',likePost)

module.exports = router