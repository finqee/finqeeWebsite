const Post = require('../models/Post');
const Topic = require('../models/Topic');

exports.forum = function(req, res) {
    Topic.findTopics().then((documents) => {
        res.render('forum', {documents: documents})
    })
}

exports.viewCreateTopic = function(req, res) {
    res.render('createTopicPost')
}

exports.createTopicPost = function(req, res) {
    let post = new Post(req.body, req.session.user._id)
    post.createPostAndTopic().then(() => {
        res.redirect('forum')
    }).catch((errors) => {
        errors.forEach((error) => req.flash("errors", error))
        req.session.save(() => res.redirect('createTopicPost'))
    })
}

exports.postCreate = function(req, res) {
    let post = new Post(req.body, req.session.user._id, req.params.id)
    post.createPost().then((topicId) => {
        res.redirect(req.get('referer'))
    }).catch((errors) => {
        console.log(errors)
        errors.forEach((error) => req.flash("errors", error))
        console.log(errors)
        req.session.save(() => res.redirect(req.get('referer')))
    })
}

exports.viewTopic = async function(req, res) {
    try {
        let posts = await Post.findPostsByTopic(req.params.id)
        res.render("viewTopic", {posts: posts})
    } catch {
        res.send("Wrong topic id")
    }
}