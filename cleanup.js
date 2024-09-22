const mongoose = require('mongoose');

// Define the Team schema
const teamSchema = new mongoose.Schema({
  name: String,
  group: String,
  progress: [{
    clueNumber: Number,
    code: String,
    content: String,
    found: Boolean,
    timestamp: Date
  }],
  version: { type: Number, default: 0 }
}, { versionKey: false });

// Create the Team model
const Team = mongoose.model('Team', teamSchema, 'teams');  // 'teams' is the collection name

async function cleanupDatabase() {
  try {
    await mongoose.connect('removed-uri, need to add when running', { });
    console.log('Connected to MongoDB');

    const teams = await Team.find({});
    console.log(`Found ${teams.length} teams`);

    for (const team of teams) {
      const uniqueProgress = [];
      const seenClueNumbers = new Set();

      for (const progress of team.progress) {
        if (!seenClueNumbers.has(progress.clueNumber)) {
          uniqueProgress.push(progress);
          seenClueNumbers.add(progress.clueNumber);
        }
      }

      if (uniqueProgress.length !== team.progress.length) {
        console.log(`Cleaning up team: ${team.name} (${team.group})`);
        team.progress = uniqueProgress;
        team.version = 0;
        await team.save();
        console.log(`Team ${team.name} updated. New progress length: ${uniqueProgress.length}`);
      }
    }

    console.log('Database cleanup completed');
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

cleanupDatabase().catch(console.error);