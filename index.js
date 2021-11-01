const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// setting the middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.we5az.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//run the async function
async function run() {
    try {
        await client.connect();
        const database = client.db('mkGlobalTravel');
        // console.log(database);
        const travelsCollection = database.collection('travels');
        const bookingCollection = database.collection('booking');
        // console.log(travelsCollection);

        // get API
        app.get('/travels', async (req, res) => {
            const cursor = travelsCollection.find({});
            const travels = await cursor.toArray();
            res.send(travels);
        });

        app.get('/booking', async (req, res) => {
            const cursor = bookingCollection.find({});
            const booking = await cursor.toArray();
            res.send(booking);
        });

        app.get("/mybooking/:email", async (req, res) => {
            const result = await bookingCollection.find({
              email: req.params.email,
            }).toArray();
            console.log(result)
            res.send(result);
          });

        // get single travel
        app.get('/travels/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific travel', id);
            const query = { _id: ObjectId(id) };
            const travel = await travelsCollection.findOne(query);
            res.json(travel);
        });

        app.get('/booking/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific booking', id);
            const query = { _id: objectId(id) };
            const booking = await bookingCollection.findOne(query);
            res.json(booking);
        });

        // post API
        app.post('/travels', async (req, res) => {
            const travel = req.body;
            console.log('hit the post api', travel);

            const result = await travelsCollection.insertOne(travel);
            console.log(result);
            res.json(result)
        });

        app.post('/booking', async (req, res) => {
            const booking = req.body;
            console.log('hit the post api', booking);

            const result = await bookingCollection.insertOne(booking);
            console.log(result);
            res.json(result)
        })

        // delete API
        app.delete('/travels/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await travelsCollection.deleteOne(query);
            res.json(result);
        });

        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Mk Global Travel Server');
});

app.listen(port, () => {
    console.log('Running Mk Global Travel Server on port', port);
})