const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000

// middlewar
app.use(cors())
app.use(express.json())


console.log(process.env.DB_USER)

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rxkguw5.mongodb.net/?retryWrites=true&w=majority`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const usersCollection = client.db("bistroDB").collection("users")
        const bistroCollection = client.db("bistroDB").collection("menu")
        const reviewsCollection = client.db("bistroDB").collection("reviews")
        const cartCollection = client.db("bistroDB").collection("carts")



        //user collection api

        app.get('/users', async (req, res)=>{
            const result = await usersCollection.find().toArray()
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = {email: user.email}
            const existingUser = usersCollection.findOne(query)
            if(existingUser){
                res.send({message: 'user already exists'})
            }
            const result = await usersCollection.insertOne(user)
            res.send(result)
        })

        //menu related apis
        app.get('/menu', async (req, res) => {
            const result = await bistroCollection.find().toArray()
            res.send(result)
        })


        //reviews api
        app.get('/reviews', async (req, res) => {
            const result = await reviewsCollection.find().toArray()
            res.send(result)
        })

        

        //cart related apis
        app.get('/carts', async (req, res) => {
            const email = req.query.email;
            console.log(email)
            if(!email){
                res.send([])
            }
            const query = {email: email}
            const result = await cartCollection.find(query).toArray()
            res.send(result)
        })

        app.post('/carts', async (req, res) => {
            const item = req.body;
            const result = await cartCollection.insertOne(item)
            res.send(result)
        })

        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id 
            const query = {_id: new ObjectId(id)}
            const result = await cartCollection.deleteOne(query)
            res.send(result)
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Boss is sitting')
})

app.listen(port, () => {
    console.log(`Boss is sitting on PORT ${port}`)
})

