require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    tls: true,
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

// Use CORS middleware
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

// Endpoint to fetch updates
app.get('/api/updates', async (req, res) => {
    try {
        const database = client.db('afretec-unilag');
        const updatesCollection = database.collection('updates');
        const updates = await updatesCollection.find().sort({ date: -1 }).limit(3).toArray();
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
