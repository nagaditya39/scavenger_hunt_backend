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
  
  group1: [
    { name: 'First Clue', code: '1a' },
    { name: 'Second Clue', code: '1b' },
    { name: 'Third Clue', code: '1c' },
    { name: 'Fourth Clue', code: '1d' },
    { name: 'Fifth Clue', code: '1e' },
    { name: 'Sixth Clue', code: '1f' },
  ],
  group2: [
    { name: 'First Clue', code: '2a' },
    { name: 'Second Clue', code: '2b' },
    { name: 'Third Clue', code: '2c' },
    { name: 'Fourth Clue', code: '2d' },
    { name: 'Fifth Clue', code: '2e' },
    { name: 'Sixth Clue', code: '2f' },
  ],
  group3: [
    { name: 'First Clue', code: '1a' },
    { name: 'Second Clue', code: '1b' },
    { name: 'Third Clue', code: '1c' },
    { name: 'Fourth Clue', code: '1d' },
    { name: 'Fifth Clue', code: '1e' },
    { name: 'Sixth Clue', code: '1f' },
  ],
  group4: [
    { name: 'First Clue', code: '2a' },
    { name: 'Second Clue', code: '2b' },
    { name: 'Third Clue', code: '2c' },
    { name: 'Fourth Clue', code: '2d' },
    { name: 'Fifth Clue', code: '2e' },
    { name: 'Sixth Clue', code: '2f' },
  ],
  group5: [
    { name: 'First Clue', code: '1a' },
    { name: 'Second Clue', code: '1b' },
    { name: 'Third Clue', code: '1c' },
    { name: 'Fourth Clue', code: '1d' },
    { name: 'Fifth Clue', code: '1e' },
    { name: 'Sixth Clue', code: '1f' },
  ],
  group6: [
    { name: 'First Clue', code: '2a' },
    { name: 'Second Clue', code: '2b' },
    { name: 'Third Clue', code: '2c' },
    { name: 'Fourth Clue', code: '2d' },
    { name: 'Fifth Clue', code: '2e' },
    { name: 'Sixth Clue', code: '2f' },
  ],
  };

  function checkCode(group, code, currentClueIndex) {
    const clues = cluesdata[group];
    if (currentClueIndex >= clues.length) {
      return null;
    }
    return clues[currentClueIndex].code === code ? clues[currentClueIndex].name : null;
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
  
      const currentClueIndex = team.progress.length;
      const clue = checkCode(group, code, currentClueIndex);
      
      if (clue) {
        team.progress.push({ clue: clue, found: true, timestamp: new Date() });
        await team.save();
        
        const nextClueIndex = currentClueIndex + 1;
        const nextClue = nextClueIndex < cluesdata[group].length ? cluesdata[group][nextClueIndex].name : null;
        
        res.json({ 
          success: true, 
          clue: clue, 
          cluesFound: team.progress.length,
          nextClue: nextClue
        });
      } else {
        res.json({ success: false, message: 'Invalid code or not the current clue' });
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

app.get('/api/team-progress/:teamName/:group', async (req, res) => {
  const { teamName, group } = req.params;
  try {
    const team = await Team.findOne({ name: teamName, group: group });
    if (team) {
      const currentClueIndex = team.progress.length;
      const nextClue = currentClueIndex < cluesdata[group].length ? cluesdata[group][currentClueIndex].name : null;
      res.json({ 
        cluesFound: team.progress.length,
        nextClue: nextClue
      });
    } else {
      res.json({ cluesFound: 0, nextClue: cluesdata[group][0].name });
    }
  } catch (error) {
    console.error('Error fetching team progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

  
  app.listen(port, () => {
    console.log(`Scavenger Hunt API listening on port ${port}`);
  });