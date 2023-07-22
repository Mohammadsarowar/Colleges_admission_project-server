const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
//middewore
app.use(cors());
app.use(express.json());

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ac-o6iroya-shard-00-00.wymoxsw.mongodb.net:27017,ac-o6iroya-shard-00-01.wymoxsw.mongodb.net:27017,ac-o6iroya-shard-00-02.wymoxsw.mongodb.net:27017/?ssl=true&replicaSet=atlas-puyajh-shard-0&authSource=admin&retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const collegesCollection = client.db("CollegeAdmission").collection("Colleges");
    const AdmissionCollection = client.db("CollegeAdmission").collection("Admission");
    const SaveUserCollection = client.db("CollegeAdmission").collection("users");
      
      //Save user email role in db
      app.put('/users/:email',async(req,res)=>{
        const email = req.params.email 
        const user = req.body
        const query = {email:email }
        const options = {upsert: true}
        const updateDoc = {
          $set: user 
        }
        const result = await SaveUserCollection.updateOne(query,updateDoc,options)
        console.log(result);
        res.send(result)
      })
    app.get('/colleges',async(req,res)=>{
        const cursor = collegesCollection.find();
        const result =  await cursor.toArray()
        res.send(result)
     })
     app.get('/college/:id', async (req, res) => {
        const id = req.params.id; // Retrieve id from req.params
        const query = { _id: new ObjectId(id) };
        const result = await collegesCollection.findOne(query);
        res.send(result);
      });
      app.post('/admission',async(req,res)=>{
        const room = req.body
        const result = await AdmissionCollection.insertOne(room)
        console.log(result);
        res.send(result)
      })
      app.get('/getAdmission',async(req,res)=>{
        const cursor = AdmissionCollection.find();
        const result =  await cursor.toArray()
        res.send(result)
     })
     app.get('/user/:email',async(req,res)=>{
        const email = req.params.email
        const query = {email:email }
        const result = await usersCollection.findOne(query)
        res.send(result)
      })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("college Admission server is running");
});

app.listen(port, () => {
  console.log(`college Admission server is running on port: ${port} `);
});
