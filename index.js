const express = require('express')
const app = express();
var cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 1001;

// Need for enviromental file.
require('dotenv').config()

// This are middleware.
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Assignmet -11 server Default page ');
})

const uri = `mongodb+srv://${process.env.Db_User}:${process.env.Db_Password}@cluster0.swhr3qz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const database = client.db("Photography").collection("Sevices");
        const reviews = client.db("Photography").collection("Reviews");


        app.get('/3services', async (req, res) => {
            const query = {};
            const cursor = database.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = database.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });


        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await database.findOne(query);
            res.send(service);
        });

        app.post('/reviews', async (req, res) => {
            const order = req.body;
            const result = await reviews.insertOne(order);
            res.send(result);
        });

        app.post('/addservice', async (req, res) => {
            const service = req.body;
            const result = await database.insertOne(service);
            res.send(result);
        });

        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const updateDoc = {
                $set: {
                    plot: `A harvest of random numbers, such as: ${Math.random()}`
                },
            };
            res.send(result);
        });


        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await reviews.deleteOne(query);
            res.send(result);
        });

        app.get('/review', async (req, res) => {
            let query = {}
            if (req.query.User_email) {
                query = { User_email: req.query.User_email }
            }
            const cursor = reviews.find(query);
            const rev = await cursor.toArray();
            res.send(rev);
        });

        app.get('/servicereview', async (req, res) => {
            let query = {}
            if (req.query.ServiceName) {
                query = { ServiceName: req.query.ServiceName }
            }
            const cursor = reviews.find(query);
            const rev = await cursor.toArray();
            res.send(rev);
        });

        app.get('/servicereview/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const corsor = reviews.find(query);
            const result = await corsor.toArray();
            res.send(result);


        })

        app.put('/servicereview/:id', async (req, res) => {

            const id = req.params.id;
            const updatedData = req.body;

            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };

            const reviewUpdate = {
                $set: {

                    Review: updatedData.Review

                }
            }

            const result = await reviews.updateOne(filter, reviewUpdate, options);
            console.log(result)
            res.send(result);



        })

    } finally {

    }
}
run().catch(console.dir);

// This is the address of "4000/news_categories".
// app.get('/news_categories', (req, res) => {
//     res.send(categories)
// })

// Advance
// Client site will give command of "id" to this address.
// we get the id from request object and then find the id in our data. Then send it to the server page.
// app.get('/news/:id', (req, res) => {
//     const id = req.params.id
//     const selectedNews = news.find(n => n._id === id);
//     res.send(selectedNews);
// })

// app.get('/category/:id', (req, res) => {
//     const id = req.params.id
//     const category = news.filter(n => n.category_id === id);
//     res.send(category);
// })

// app.get('/news', (req, res) => {
//     res.send(news)
// })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})