require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const uri = process.env.MONGODB_URI;

// Fallback data if MongoDB is not available
const fallbackUpdates = [
    {
        id: 1,
        title: "Challenge Registration Open",
        details: "Registration for the AFRETEC-UNILAG Innovation in Health Challenge is now open. Submit your innovative healthcare solutions.",
        date: "2025-01-15"
    },
    {
        id: 2,
        title: "Workshop Series Announced",
        details: "Join our series of workshops covering healthcare innovation, technology, and entrepreneurship.",
        date: "2025-01-20"
    },
    {
        id: 3,
        title: "Finalists Selected",
        details: "Congratulations to the 10 finalist teams selected for the Grand Finale on June 25, 2025.",
        date: "2025-06-01"
    }
];

let client = null;

// Connect to MongoDB only if URI is provided
async function connectToMongoDB() {
    if (!uri) {
        console.log("MongoDB URI not provided. Using fallback data.");
        return;
    }
    
    try {
        client = new MongoClient(uri, {
            tls: true,
            tlsAllowInvalidCertificates: false,
            retryWrites: true,
            w: 'majority',
        });
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        console.log("Using fallback data instead.");
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
        if (client) {
            const database = client.db('afretec-unilag');
            const updatesCollection = database.collection('updates');
            const updates = await updatesCollection.find().sort({ date: -1 }).limit(3).toArray();
            res.json(updates);
        } else {
            res.json(fallbackUpdates);
        }
    } catch (error) {
        console.error("Error fetching updates:", error);
        res.json(fallbackUpdates);
    }
});

// Endpoint to fetch teams
app.get('/api/teams', async (req, res) => {
    try {
        if (client) {
            const database = client.db('afretec-unilag');
            const teamsCollection = database.collection('teams');
            const teams = await teamsCollection.find().toArray();
            res.json(teams);
        } else {
            res.json(fallbackTeams);
        }
    } catch (error) {
        console.error("Error fetching teams:", error);
        res.json(fallbackTeams);
    }
});

app.get('/ping', (req, res) => {
  res.status(200).send('OK');
});

// Endpoint to get Grand Finale images
app.get('/api/gf-images', (req, res) => {
    try {
        const imagesDir = path.join(__dirname, 'public', 'images', 'gf-images');
        
        // Check if directory exists
        if (!fs.existsSync(imagesDir)) {
            return res.json({ images: [] });
            console.log('gf-images directory exists');
        }
        
        // Read all files from the directory
        const files = fs.readdirSync(imagesDir);
        
        // Filter for image files only
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return imageExtensions.includes(ext);
        });
        
        // Create full URLs for the images
        const images = imageFiles.map(file => ({
            filename: file,
            url: `/images/gf-images/${file}`,
            alt: `Grand Finale Image - ${file.replace(/\.[^/.]+$/, '')}`
        }));
        
        res.json({ images });
        console.log('images fetched successfully');
    } catch (error) {
        console.error('Error reading gf-images directory:', error);
        res.status(500).json({ error: 'Failed to read images', images: [] });
    }
});

// Endpoint to get mentors data
app.get('/api/mentors', (req, res) => {
    try {
        const mentorsPath = path.join(__dirname, 'mentors.json');
        const mentorsDir = path.join(__dirname, 'public', 'images', 'mentors');
        
        // Check if mentors.json exists
        if (!fs.existsSync(mentorsPath)) {
            console.log('mentors.json not found');
            return res.json({ mentors: [] });
        }
        
        // Read mentors data from JSON file
        const mentorsData = JSON.parse(fs.readFileSync(mentorsPath, 'utf8'));
        
        // Check if mentors directory exists
        if (!fs.existsSync(mentorsDir)) {
            console.log('mentors directory not found');
            return res.json({ mentors: [] });
        }
        
        // Read all files from mentors directory
        const files = fs.readdirSync(mentorsDir);
        
        // Filter for image files only
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return imageExtensions.includes(ext);
        });
        
        // Create a map of available images
        const availableImages = new Set(imageFiles);
        
        // Combine JSON data with image URLs
        const mentors = mentorsData.map(mentor => {
            const imageUrl = availableImages.has(mentor.image) 
                ? `/images/mentors/${mentor.image}` 
                : null;
            
            return {
                name: mentor.name,
                university: mentor.university,
                team: mentor.team,
                imageUrl: imageUrl
            };
        });
        
        res.json({ mentors });
        console.log('mentors fetched successfully');
    } catch (error) {
        console.error('Error reading mentors data:', error);
        res.status(500).json({ error: 'Failed to load mentors', mentors: [] });
    }
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

