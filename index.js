const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000


// middle were
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())




const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.jukjd3u.mongodb.net/?retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {


        const productCollection = client.db('computer_shop').collection('products')

        // Get all products
        app.get('/products', async (req, res) => {
            const result = await productCollection.find().toArray()
            res.send(result)
        })

        // Save a product in database
        app.post('/products', async (req, res) => {
            const product = req.body
            const result = await productCollection.insertOne(product)
            res.send(result)
        })


        // Get user posted products
        app.get('/products/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const result = await productCollection.find(query).toArray()
            res.send(result)
        })



        // update class
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id
            const productsName = req.body
            const price = req.body
            const availableProduct = req.body
            
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: productsName,
                $set: price,
                $set: availableProduct
            }
            const result = await productCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })


        // delete product
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.deleteOne(query)
            console.log(result)
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Computer Shop server is running..')
})

app.listen(port, () => {
    console.log(`Computer Shop server is running on port ${port}`)
})