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
  
  Air: [
    { number: 1, code: '1a', content: 'Actual content of first clue for group 1' },
    { number: 2, code: '1b', content: 'Actual content of second clue for group 1' },
    { number: 3, code: '1c', content: 'Actual content of third clue for group 1' },
    { number: 4, code: '1d', content: 'Actual content of fourth clue for group 1' },
    { number: 5, code: '1e', content: 'Actual content of fifth clue for group 1' },
    { number: 6, code: '1f', content: 'Actual content of sixth clue for group 1' },
  ],
  Fire: [
    { number: 1, code: '1a', content: 'Actual content of first clue for group 1' },
    { number: 2, code: '1b', content: 'Actual content of second clue for group 1' },
    { number: 3, code: '1c', content: 'Actual content of third clue for group 1' },
    { number: 4, code: '1d', content: 'Actual content of fourth clue for group 1' },
    { number: 5, code: '1e', content: 'Actual content of fifth clue for group 1' },
    { number: 6, code: '1f', content: 'Actual content of sixth clue for group 1' },
  ],
  Water: [
    { number: 1, code: '1a', content: 'Actual content of first clue for group 1' },
    { number: 2, code: '1b', content: 'Actual content of second clue for group 1' },
    { number: 3, code: '1c', content: 'Actual content of third clue for group 1' },
    { number: 4, code: '1d', content: 'Actual content of fourth clue for group 1' },
    { number: 5, code: '1e', content: 'Actual content of fifth clue for group 1' },
    { number: 6, code: '1f', content: 'Actual content of sixth clue for group 1' },
  ],
  Earth: [
    { number: 1, code: '1a', content: 'Actual content of first clue for group 1' },
    { number: 2, code: '1b', content: 'Actual content of second clue for group 1' },
    { number: 3, code: '1c', content: 'Actual content of third clue for group 1' },
    { number: 4, code: '1d', content: 'Actual content of fourth clue for group 1' },
    { number: 5, code: '1e', content: 'Actual content of fifth clue for group 1' },
    { number: 6, code: '1f', content: 'Actual content of sixth clue for group 1' },
  ],
  Ether: [
    { number: 1, code: '1a', content: 'Actual content of first clue for group 1' },
    { number: 2, code: '1b', content: 'Actual content of second clue for group 1' },
    { number: 3, code: '1c', content: 'Actual content of third clue for group 1' },
    { number: 4, code: '1d', content: 'Actual content of fourth clue for group 1' },
    { number: 5, code: '1e', content: 'Actual content of fifth clue for group 1' },
    { number: 6, code: '1f', content: 'Actual content of sixth clue for group 1' },
  ],
  };

  function checkCode(group, code, currentClueIndex) {
    const clues = cluesdata[group];
    if (currentClueIndex >= clues.length) {
      return null;
    }
    return clues[currentClueIndex].code === code ? clues[currentClueIndex] : null;
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
        team.progress.push({ clueNumber: clue.number, found: true, timestamp: new Date() });
        await team.save();
        
        const nextClueNumber = currentClueIndex + 2; // +2 because we're 0-indexed and want to show the human-readable number
        
        res.json({ 
          success: true, 
          clueContent: clue.content,
          cluesFound: team.progress.length,
          nextClueNumber: nextClueNumber <= cluesdata[group].length ? nextClueNumber : null
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
      const nextClueNumber = currentClueIndex + 1;
      const currentClueContent = currentClueIndex > 0 ? cluesdata[group][currentClueIndex - 1].content : null;
      res.json({ 
        cluesFound: team.progress.length,
        nextClueNumber: nextClueNumber <= cluesdata[group].length ? nextClueNumber : null,
        currentClueContent: currentClueContent
      });
    } else {
      res.json({ cluesFound: 0, nextClueNumber: 1, currentClueContent: null });
    }
  } catch (error) {
    console.error('Error fetching team progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

  
  app.listen(port, () => {
    console.log(`Scavenger Hunt API listening on port ${port}`);
  });