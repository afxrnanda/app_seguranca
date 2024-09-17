const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://admin:MGGoA8eXUBrcoVXG@cluster0.qelem.mongodb.net/denuncias_db';

let db;

async function connectToDatabase() {
  if (!db) {
    const client = new MongoClient(url);
    await client.connect();
    db = client.db('denuncias_db');
  }
  return db;
}

module.exports = connectToDatabase;
