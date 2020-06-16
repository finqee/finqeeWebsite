const postsCollection = require('../db').db('Finqee').collection("posts")
const topicsCollection = require('../db').db('Finqee').collection("topics")
const usersPersonalCollection = require('../db').db('Finqee').collection("usersPersonal")
const ObjectID = require('mongodb').ObjectID
const Topic = require('./Topic');

let Post = function(data, userId, topicId = "") {
    this.data = data
    this.errors = []
    this.data.userId = userId
    this.data.topicId = topicId
}

Post.prototype.cleanUp = function() {
    if(typeof(this.data.title) != "string") { this.data.title = ""}
    if(typeof(this.data.body) != "string") { this.data.title = ""}
    if(typeof(this.data.topicId) != "string") { this.data.topicId = ""}

    //get rid of any bogus properties

    this.data = {
        topicId: this.data.topicId.trim(),
        title: this.data.title.trim(),
        body: this.data.body.trim(),
        createdDate: new Date(),
        userId: this.data.userId
    }
}

Post.prototype.validate = function() {
    if(this.data.title == "") {this.errors.push("You must provide a title.")}
    if(this.data.body == "") {this.errors.push("You must provide new topic content.")}
    
}

Post.prototype.validatePost = function() {
    if(this.data.topicId == "") {this.errors.push("Invalid topic id.")}
    if(this.data.body == "") {this.errors.push("You must provide post content.")}
}

Post.prototype.createPostAndTopic = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp()
        this.validate()
        if(!this.errors.length) {
            usersPersonalCollection.findOne({userId: this.data.userId}).then(async (document) => {
                let topic = new Topic({
                    title: this.data.title,
                    postCount: 1,
                    lastName: document.name,
                    lastSurname: document.surname,
                    lastDate: this.data.createdDate,
                    lastUserId: this.data.userId
                })
               let topicId = await topicsCollection.insertOne(topic.data)
               this.data.topicId = topicId.insertedId.toString()
               console.log(this.data)
               await postsCollection.insertOne(this.data)
            })
            resolve("success")
        } else {
            reject(this.errors)
        }
    })
}

Post.prototype.createPost = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp()
        this.validatePost()
        if(!this.errors.length) {
            topicsCollection.findOne({_id: new ObjectID(this.data.topicId)}).then(async(document) => {
                if(document != null) {
                    this.data.title = document.title
                    await postsCollection.insertOne(this.data)
                    let userPersonal = await usersPersonalCollection.findOne({userId: this.data.userId})
                    if(userPersonal)
                        await topicsCollection.updateOne({_id: new ObjectID(this.data.topicId)}, { $set: {postCount: document.postCount + 1, lastDate: this.data.createdDate, lastName: userPersonal.name, lastSurname: userPersonal.surname} })
                    console.log("Updated")
                }
            })
            resolve(this.data.topicId)
        } else {
            reject(this.errors)
        }
    })
}

Post.findPostsByTopic = function(topicId) {
    return new Promise(async (resolve, reject) => {
        if(typeof(topicId) != "string") {
            // reject("TopicId is not string")
            reject()
            return
        }
        // let posts = await postsCollection.find({topicId: topicId}).toArray()
        // let postsAll = posts.map(async (post) => {
        //     userPersonal = await usersPersonalCollection.findOne({ userId: post.userId });
        //     if (userPersonal) {
        //         post.name = userPersonal.name;
        //         post.surname = userPersonal.surname;
        //     }
        // })
        let posts2 = await postsCollection.aggregate([
            {$match: {topicId: topicId}},
            {$lookup: {from: "usersPersonal", localField: "userId", foreignField: "userId", as: "Document"}},
            {$project: {
                title: 1,
                topicId: 1,
                body: 1,
                createdDate: 1,
                userId: 1,
                user: {$arrayElemAt: ["$Document", 0]}
            }}
        ]).toArray()

        posts2.map(function(item) {
            item.user = {
                name: item.user.name,
                surname: item.user.surname
            }
        })
        
        if(posts2.length) {
            resolve(posts2)
        } else {
            // reject("TopicId doesn't not exist")
            reject()
        }
    })
}


module.exports = Post