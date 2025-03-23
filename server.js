require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    tls: true, // Enable TLS
    tlsAllowInvalidCertificates: false, 
    retryWrites: true,
    w: 'majority',
});

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
connectToMongoDB();

// Endpoint to fetch updates
app.get('/api/updates', async (req, res) => {
    try {
        const database = client.db('afretec-unilag'); 
        const updatesCollection = database.collection('updates'); 

        const updates = await updatesCollection
            .find()
            .sort({ date: -1 })
            .limit(3) 
            .toArray();

        res.json(updates); 
    } catch (error) {
        console.error("Error fetching updates:", error);
        res.status(500).json({ error: "Failed to fetch updates" });
    }
});

// Endpoint to fetch teams
app.get('/api/teams', async (req, res) => {
    try {
        const database = client.db('afretec-unilag'); 
        const teamsCollection = database.collection('teams'); 

        // Fetch all teams
        const teams = await teamsCollection.find().toArray();

        res.json(teams); 
    } catch (error) {
        console.error("Error fetching teams:", error);
        res.status(500).json({ error: "Failed to fetch teams" });
    }
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});