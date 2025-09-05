const express = require('express');
const app = express();
require('dotenv').config(); 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); // Added ObjectId here
const cors = require('cors');

const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wvpoi0c.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect(); // Connect to MongoDB
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const db = client.db("recipeBookDB");
    const recipesCollection = db.collection("recipes");

     // CREATE → Add a new recipe
    app.post('/recipes', async (req, res) => {
      try {
        const newRecipe = req.body;
        const result = await recipesCollection.insertOne(newRecipe);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to add recipe" });
      }
    });


  } catch (err) {
    console.error(err);
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Recipe book server is running');
});

app.listen(port, () => {
  console.log(`Recipe book server is running on port: ${port}`);
});