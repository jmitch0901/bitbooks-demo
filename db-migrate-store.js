// TODO - I don't like how it keeps every migration/ up and down. I only want current migration history

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const Bluebird = require('bluebird')
Bluebird.promisifyAll(MongoClient)

const { DB } = require('./config');

class dbStore {
   constructor () {
    this.url = DB;
    this.db = null
    this.mClient = null
   }
   connect() {
     return MongoClient.connect(this.url)
      .then(client => {
        this.mClient = client
        return client.db()
      })
   }
    load(fn) {
      return this.connect()
      .then(db => db.collection('__migrations').find().toArray())
      .then(data => {
        if (!data.length) return fn(null, {})
        const store = data[0]
        // Check if does not have required properties
          if (!Object
               .prototype
               .hasOwnProperty
               .call(store, 'lastRun')
                ||
              !Object
              .prototype
              .hasOwnProperty
             .call(store, 'migrations'))
            {
            return fn(new Error('Invalid store file'))
            }
        return fn(null, store)
      }).catch(fn)
    }


   save(set, fn) {
     return this.connect()
      .then(db => db.collection('migrations')
      .update({},
       {
         $set: {
           lastRun: set.lastRun,
         },
         $push: {
            migrations: { $each: set.migrations },
         },
      },
      {
         upsert: true,
         multi: true,
       }
      ))
       .then(result => fn(null, result))
       .catch(fn)
   }
}
module.exports = dbStore
