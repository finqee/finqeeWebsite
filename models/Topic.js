const topicsCollection = require('../db').db('Finqee').collection("topics")

let Topic = function(data) {
    this.data = data
}

Topic.prototype.cleanUp = function() {
    //get rid of any bogus properties

    this.data = {
        title: this.data.title,
        postCount: this.data.postCount,
        lastName: this.data.lastName,
        lastSurname: this.data.lastSurname,
        lastDate: Date(),
        lastUserId: this.data.lastUserId
    }
}

Topic.findTopics = function() {
    return new Promise(async (resolve, reject) => {
        let topics = await topicsCollection.find({}).toArray()
        resolve(topics)
    })
}

module.exports = Topic