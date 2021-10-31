const express = require('express');
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

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
        // console.log(travelsCollection);

        // get API
        app.get('/travels', async (req, res) => {
            const cursor = travelsCollection.find({});
            const travels = await cursor.toArray();
            res.send(travels);
        });

        // get single travel
        app.get('/travels/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific travel', id);
            const query = { _id: objectId(id) };
            const travel = await travelsCollection.findOne(query);
            res.json(travel);
        })

        // post API
        app.post('/travels', async (req, res) => {
            const travel = req.body;
            console.log('hit the post api', travel);

            const result = await travelsCollection.insertOne(travel);
            console.log(result);
            res.json(result)
        });

        // delete API
        app.delete('/travels/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) };
            const result = await travelsCollection.deleteOne(query);
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