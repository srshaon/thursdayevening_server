const express = require('express');

const app = express();

const cors = require('cors');

require('dotenv').config();

const { MongoClient } = require('mongodb');

const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zpk1a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        console.log('connected to database')


        //basic server checking 

        app.get('/', async (req, res) => {
            res.send('Hello From Server')
        })


    }
    finally {

    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log('listening to port: ', port);
})