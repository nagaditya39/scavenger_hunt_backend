const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: 'https://nagaditya39.github.io'
}));
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define Team Schema
const teamSchema = new mongoose.Schema({
  name: String,
  group: String,
  progress: [{
    clue: String,
    found: Boolean,
    timestamp: Date
  }]
});

const Team = mongoose.model('Team', teamSchema);

// Clues data
const cluesdata = {
  
    group01: {
      'First Clue': 'A1B1C1 ',
      'Second Clue': 'A1B1C1',
      'Third Clue': 'A1B1C1',
      'Fourth Clue': 'A1B1C1',
      'Fifth Clue': 'A1B1C1',
      'Sixth Clue': 'A1B1C1',
    },
    group02: {
      'First Clue': 'A2B2C2',
      'Second Clue': 'A2B2C2',
      'Third Clue': 'A2B2C2',
      'Fourth Clue': 'A2B2C2',
      'Fifth Clue': 'A2B2C2',
      'Sixth Clue': 'A2B2C2',
    },
    group03: {
      'First Clue': 'A3B3C3',
      'Second Clue': 'A3B3C3',
      'Third Clue': 'A3B3C3',
      'Fourth Clue': 'A3B3C3',
      'Fifth Clue': 'A3B3C3',
      'Sixth Clue': 'A3B3C3',
    },
    group04: {
      'First Clue': 'A4B4C4',
      'Second Clue': 'A4B4C4',
      'Third Clue': 'A4B4C4',
      'Fourth Clue': 'A4B4C4',
      'Fifth Clue': 'A4B4C4',
      'Sixth Clue': 'A4B4C4',
    },
    group05: {
      'First Clue': 'A5B5C5',
      'Second Clue': 'A5B5C5',
      'Third Clue': 'A5B5C5',
      'Fourth Clue': 'A5B5C5',
      'Fifth Clue': 'A5B5C5',
      'Sixth Clue': 'A5B5C5',
    },
    group06: {
      'First Clue': 'A6B6C6',
      'Second Clue': 'A6B6C6',
      'Third Clue': 'A6B6C6',
      'Fourth Clue': 'A6B6C6',
      'Fifth Clue': 'A6B6C6',
      'Sixth Clue': 'A6B6C6',
    },
    group07: {
      'First Clue': 'A7B7C7',
      'Second Clue': 'A7B7C7',
      'Third Clue': 'A7B7C7',
      'Fourth Clue': 'A7B7C7',
      'Fifth Clue': 'A7B7C7',
      'Sixth Clue': 'A7B7C7',
    },
    group08: {
      'First Clue': 'A8B8C8',
      'Second Clue': 'A8B8C8',
      'Third Clue': 'A8B8C8',
      'Fourth Clue': 'A8B8C8',
      'Fifth Clue': 'A8B8C8',
      'Sixth Clue': 'A8B8C8',
    },
    group09: {
      'First Clue': 'A9B9C9',
      'Second Clue': 'A9B9C9',
      'Third Clue': 'A9B9C9',
      'Fourth Clue': 'A9B9C9',
      'Fifth Clue': 'A9B9C9',
      'Sixth Clue': 'A9B9C9',
    },
    group10: {
      'First Clue': '10',
      'Second Clue': '10',
      'Third Clue': '10',
      'Fourth Clue': '10',
      'Fifth Clue': '10',
      'Sixth Clue': '10',
    },
  };

function checkCode(group, code) {
  const clues = cluesdata[group];
  return Object.keys(clues).find(clue => clues[clue] === code) || null;
}

// Routes
app.post('/api/check-code', async (req, res) => {
  const { group, code, teamName } = req.body;
  
  const clue = checkCode(group, code);
  
  if (clue) {
    // Update team progress
    await Team.findOneAndUpdate(
      { name: teamName, group: group },
      { $push: { progress: { clue: clue, found: true, timestamp: new Date() } } },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, clue: clue });
  } else {
    res.json({ success: false, message: 'Invalid code' });
  }
});

app.get('/api/public-progress', async (req, res) => {
  const teams = await Team.find({}, 'name group progress');
  res.json(teams);
});

app.get('/api/team-progress/:teamName', async (req, res) => {
  const team = await Team.findOne({ name: req.params.teamName });
  if (team) {
    res.json(team);
  } else {
    res.status(404).json({ message: 'Team not found' });
  }
});

app.listen(port, () => {
  console.log(`Scavenger Hunt API listening on port ${port}`);
});