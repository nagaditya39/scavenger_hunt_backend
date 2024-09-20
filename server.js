const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: 'https://nagaditya39.github.io',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
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

teamSchema.index({ name: 1, group: 1 }, { unique: true });
const Team = mongoose.model('Team', teamSchema);

// Clues data
const cluesdata = {
  
    group1: {
      'First Clue': '1 ',
      'Second Clue': '1',
      'Third Clue': '1',
      'Fourth Clue': '1',
      'Fifth Clue': '1',
      'Sixth Clue': '1',
    },
    group2: {
      'First Clue': '2',
      'Second Clue': '2',
      'Third Clue': '2',
      'Fourth Clue': '2',
      'Fifth Clue': '2',
      'Sixth Clue': '2',
    },
    group3: {
      'First Clue': '3',
      'Second Clue': '3',
      'Third Clue': '3',
      'Fourth Clue': '3',
      'Fifth Clue': '3',
      'Sixth Clue': '3',
    },
    group4: {
      'First Clue': '4',
      'Second Clue': '4',
      'Third Clue': '4',
      'Fourth Clue': '4',
      'Fifth Clue': '4',
      'Sixth Clue': '4',
    },
    group5: {
      'First Clue': '5',
      'Second Clue': '5',
      'Third Clue': '5',
      'Fourth Clue': '5',
      'Fifth Clue': '5',
      'Sixth Clue': '5',
    },
    group6: {
      'First Clue': '6',
      'Second Clue': '6',
      'Third Clue': '6',
      'Fourth Clue': '6',
      'Fifth Clue': '6',
      'Sixth Clue': '6',
    }
  };

  function checkCode(group, code) {
    const clues = cluesdata[group];
    return Object.keys(clues).find(clue => clues[clue] === code) || null;
  }
  
  // Routes
  app.post('/api/check-code', async (req, res) => {
    const { group, code, teamName } = req.body;
    
    if (!group || !code || !teamName) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    if (!cluesdata[group]) {
      return res.status(400).json({ success: false, message: 'Invalid group' });
    }
  
    try {
      let team = await Team.findOne({ name: teamName, group: group });
      
      if (!team) {
        // If the team doesn't exist, create it
        team = await Team.create({
          name: teamName,
          group: group,
          progress: []
        });
      }
  
      // Check if the code is valid for this team's group
      const clue = checkCode(group, code);
      
      if (clue) {
        const clueAlreadyFound = team.progress.some(p => p.clue === clue);
        
        if (!clueAlreadyFound) {
          team.progress.push({ clue: clue, found: true, timestamp: new Date() });
          await team.save();
        }
        
        res.json({ success: true, clue: clue, cluesFound: team.progress.length });
      } else {
        res.json({ success: false, message: 'Invalid code for this team' });
      }
    } catch (error) {
      console.error('Error updating team progress:', error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  });
  
  app.get('/api/public-progress', async (req, res) => {
    try {
      const teams = await Team.find({}, 'name group progress');
      const publicProgress = teams.map(team => ({
        name: team.name,
        group: team.group,
        cluesFound: team.progress.length
      }));
      res.json(publicProgress);
    } catch (error) {
      console.error('Error fetching public progress:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.listen(port, () => {
    console.log(`Scavenger Hunt API listening on port ${port}`);
  });