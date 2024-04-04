// Importing required modules
const express = require("express");
const cors = require("cors");
require("dotenv").config();
// Creating an Express application
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fudiykq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const allInventoryCollection = client
      .db("xGrid")
      .collection("allInventory");

    //   allInventory data get
    app.get("/allInventory", async (req, res) => {
      const result = await allInventoryCollection.find().toArray();
      res.send(result);
    });
    //   allInventory single data get
    app.get("/allInventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allInventoryCollection.findOne(query);
      res.send(result);
    });

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

// Define a route
app.get("/", (req, res) => {
  res.send("xGrid is running....");
});

// Starting the server
const port = process.env.PORT || 5000; // Using port 3000 by default
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
