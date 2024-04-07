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
    // await client.connect();

    const allInventoryCollection = client
      .db("xGrid")
      .collection("allInventory");
    const xNewsCollection = client.db("xGrid").collection("xNews");
    const xExperienceCollection = client.db("xGrid").collection("xExperience");
    const xBrands = client.db("xGrid").collection("brands");

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

    // xNews data load
    app.get("/news", async (req, res) => {
      const result = await xNewsCollection.find().toArray();
      res.send(result);
    });

    // xExperience data load
    app.get("/experience", async (req, res) => {
      const result = await xExperienceCollection.find().toArray();
      res.send(result);
    });

    // xExperience data load
    app.get("/brands", async (req, res) => {
      const result = await xBrands.find().toArray();
      res.send(result);
    });

    // xExperience data load
    app.get("/brandInventory", async (req, res) => {
      const brand = req.query.brand;
      const query = { manufacturers: brand };
      const result = await allInventoryCollection.find(query).toArray();
      res.send(result);
    });

    // search inventory
    app.get("/searchInventory", async (req, res) => {
      const limit = parseInt(req.query.limit) || 5;
      const startIndex = parseInt(req.query.startIndex) || 0;

      let Family = req.query.Family;
      // if (Family === undefined || Family === "false") {
      //   Family = { $in: [false, true] };
      // }

      let Adventure = req.query.Adventure;
      if (Adventure === undefined || Adventure === "true") {
        Adventure = { $in: [true, false] };
      }

      let type = req.query.type;
      if (type === undefined || type === "all") {
        type = { $in: ["Basic", "Luxury", "Adventure", "Family"] };
      }

      // console.log(type, Adventure);

      const searchTerm = req.query.searchTerm || "";
      const sort = req.query.sort || "createdAt";
      const order = req.query.order || "desc";

      const query = { type };

      // console.log(req.query);

      const inventory = await await allInventoryCollection
        .find(query)
        .toArray();

      res.send(inventory);
    });

    // app.get("/searchInventory", async (req, res) => {
    //   console.log('search');
    //   try {
    //     const limit = parseInt(req.query.limit) || 5;
    //     const startIndex = parseInt(req.query.startIndex) || 0;

    //     let Basic = req.query.Basic === "true";
    //     let Luxury = req.query.Luxury === "true";
    //     let Family = req.query.Family === "true";
    //     let Adventure = req.query.Adventure === "true";
    //     let type = req.query.type;

    //     const validTypes = ["Basic", "Luxury", "Family", "Adventure"];
    //     if (type && !validTypes.includes(type)) {
    //       throw new Error("Invalid type parameter");
    //     }

    //     const searchTerm = req.query.searchTerm || "";

    //     const sort = req.query.sort || "createdAt";
    //     const order = req.query.order || "desc";

    //     const query = {
    //       title: { $regex: searchTerm, $options: "i" },
    //     };

    //     if (type && type !== "all") {
    //       query[type] = true;
    //     }

    //     const inventory = await allInventoryCollection
    //       .find(query)
    //       .sort({ [sort]: order })
    //       .limit(limit)
    //       .skip(startIndex);

    //     res.status(200).json().send(inventory);
    //   } catch (error) {
    //     console.log(error);
    //     res.status(500).send("Internal Server Error");
    //   }
    // });

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
