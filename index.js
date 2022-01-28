const express = require('express');

const app = express();

const cors = require('cors');

require('dotenv').config();

const { MongoClient } = require('mongodb');

const objectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zpk1a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("traveler");
        const tourSpots = database.collection("tourSpots");
        const blogCollection = database.collection("blogs");
        const adminBlogCollection = database.collection("adminBlogCollection");
        const usersCollection = database.collection("users");
        // Tour Spot Get API
        app.get('/tourSpots', async (req, res) => {
            const cursor = tourSpots.find({});
            const spots = await cursor.toArray();
            res.send(spots)
        })

        //Blogs Get API-

        app.get('/blogs', async (req, res) => {
            const cursor = blogCollection.find({});
            const blog = await cursor.toArray();
            res.send(blog)
        })

        // Blogs Get API Single Id

        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) };
            const blog = await blogCollection.findOne(query);
            // console.log('load user with id: ', id);
            res.send(blog);
        })
        // // Blogs Post API
        app.post('/blogs', async (req, res) => {
            const blog = req.body;
            blog.status = 'pending';
            console.log(blog)
            const result = await blogCollection.insertOne(blog);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.send(result)

        })
        //  blog Approved status 
        app.put("/updateStatus/:id", (req, res) => {
            const id = req.params.id;
            // const updatedStatus = req.body;
            const filter = { _id: objectId(id) };
            //console.log(updatedStatus);
            blogCollection
                .updateOne(filter, {
                    $set: { status: "Approved" },
                })
                .then((result) => {
                    res.json(result);
                });
        });
        //  Blog info update
        app.put("/updateInfo/:id", async (req, res) => {
            const id = req.params.id;
            const updatedInfo = req.body.description;
            const filter = { _id: objectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {

                    description: updatedInfo
                },
            };
            const result = await blogCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
        });


        //DELETE API BLOG


        app.delete('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: objectId(id) };
            const result = await blogCollection.deleteOne(query);

            console.log('deleting purchases with id ', result);

            res.json(result);
        })

        //GET API ADMIN BLOGS

        app.get('/adminBlogCollection', async (req, res) => {
            const cursor = adminBlogCollection.find({});
            const blog = await cursor.toArray();
            res.send(blog)
        })

        //GET SINGLE API ADMIN Blogs

        app.get('/adminBlogCollection/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) };
            const blog = await adminBlogCollection.findOne(query);
            // console.log('load user with id: ', id);
            res.send(blog);
        })
        // // POST API ADMIN BLOGS
        app.post('/adminBlogCollection', async (req, res) => {
            const blog = req.body;

            console.log(blog)
            const result = await adminBlogCollection.insertOne(blog);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.send(result)

        })

        //  Admin Blog info update
        app.put("/updateInfo/:id", async (req, res) => {
            const id = req.params.id;
            const updatedInfo = req.body.description;
            const filter = { _id: objectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {

                    description: updatedInfo
                },
            };
            const result = await adminBlogCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
        });


        //DELETE Admin API BLOG


        app.delete('/adminBlogCollections/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: objectId(id) };
            const result = await adminBlogCollection.deleteOne(query);

            console.log('deleting purchases with id ', result);

            res.json(result);
        })

        app.post("/addUserInfo", async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        //google sign in user update/put function
        app.put('/addUserInfo', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });
        //  make admin

        app.put("/makeAdmin", async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);

        });

        // check admin or not
        app.get("/checkAdmin/:email", async (req, res) => {
            const result = await usersCollection
                .find({ email: req.params.email })
                .toArray();
            console.log(result);
            res.send(result);
        });

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