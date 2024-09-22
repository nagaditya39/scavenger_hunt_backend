const mongoose = require('mongoose');

// Ensure this matches your schema definition
const teamSchema = new mongoose.Schema({
  name: String,
  group: String,
  progress: [{
    clueNumber: Number,
    code: String,
    content: String,
    found: Boolean,
    timestamp: { type: Date, default: Date.now }
  }]
});

const Team = mongoose.model('Team', teamSchema, 'teams');

const cluesdata = {
  
    Air: [
      { number: 1, code: 'H2A3D9', content: "Where fun and laughter fill the air, look towards where children play with care. The board says 'kids', a hint to find, where swings and slides are easy to spot, and joy is intertwined." },
      { number: 2, code: 'ZY4G5N', content: "To find the board that speaks from the heart, love and head to where the club makes a splashy start." },
      { number: 3, code: 'W8L7Q2', content: "I provide passage to those who wants to avoid the water, My beams are wood but my body is concrete, find the treasure at my feet"},
      { number: 4, code: 'T6V9X1', content: "By the figure-eight, where waters flow, between the lazy river moves steady and slow, Two Metallic friends await by the pool, your path leads through the trees - to where shadows rule."},
      { number: 5, code: 'M3P5B7', content: "In the land of still waters, the path south leads where the gentle current flows, but only those who rise above the mark of four are granted passage. The young and short must turn away, for the journey ahead isn't for the faint-hearted."},
      { number: 6, code: 'J9F8C4', content: "I am the space where stars reside, Beyond the reach of wind and tide, Invisible, boundless, the cosmic glue, What am I, the fifth element true?" },
      { number: 7, code: 'ETHER', content: "CONGRATS!" },
    ],
    Fire: [
      { number: 1, code: 'L4X8D3', content: "Your treasure will be found where, your journey started without care"},
      { number: 2, code: 'V7K2P9', content: "With walls of mesh, I stand so tall, Inside, the bat strikes, and bowlers call. Though open to air, no ball flies free, A training ground for what's to be. I lie behind the sign" },
      { number: 3, code: 'Q9M6H4', content: "I’m a space for changes, both quick and neat, With shelves and doors, I keep things discreet. After a game or before a show"},
      { number: 4, code: 'A2T5N8', content: "In the realm where colours fly, I find my thrill, With strategy and teamwork, I chase the chill. Dodging and running, secret waits to be untied" },
      { number: 5, code: 'G3Y7V1', content: "Semicircular rows rise to the sky, A stage below where stories come alive. Ancient echoes in modern design, Your treasure awaits where audiences thrive. Look behind the seat where sound rings clear, In this outdoor haven, your prize is near."},
      { number: 6, code: 'S6C9B2', content: "Solid and strong, I shape the land, With mountains and valleys by nature’s hand. In every grain beneath your feet, What am I, sturdy and discreet?" },
      { number: 7, code: 'EARTH', content: "CONGRATS!" },
    ],
    Water: [
      { number: 1, code: 'R1Z5N4', content: "Yellow and curved, a fruit you know well, Look for its picture where safety rules dwell. A board with a slippery symbol, beware of the fall! Find this warning sign standing tall"},
      { number: 2, code: 'F7P2H8', content: "I'm long and flat, with a net in the middle, Players hit me back and forth, it's quite a riddle. With a lightweight ball and paddles in hand. Your treasure lies where player stands." },
      { number: 3, code: 'D6G9L3', content: "Your treasure will be available at the tail of twin blue Dragons, behind the Splash you will find your wish."},
      { number: 4, code: 'U3V8K1', content: "I’m a bed that springs but not for sleep, I send you high where the air feels deep. With a joyful bounce, I make you soar"},
      { number: 5, code: 'X9Y2T7', content: "By the orange slide where water falls, A blue tower stands tall within these walls. Find your next step beneath the spray of 5 water ropes, Where water pours in a curtain display" },
      { number: 6, code: 'C5M4W6', content: "I illuminate the dark with warmth and glow, In my fiery dance, I fast can grow. I can warm your heart or bring despair, What am I that flickers in the air?" },
      { number: 7, code: 'FIRE', content: "CONGRATS!" },
    ],
    Earth: [
      { number: 1, code: 'E2N9F3', content: "I’m a place where wheels find their rest, In lines or lots, I serve the best. Drivers seek me when they come to stay."},
      { number: 2, code: 'P4V6K1', content: "To find your next hint, follow the path of precision, where your goal awaits behind the target. There, you'll find the treasure you seek!"},
      { number: 3, code: 'Z3Y7L2', content: "I have six pockets but don't wear jeans, You use a cue and aim your scenes. With colors and numbers, I'm a game of skill. Your treasure lies behind the legs"},
      { number: 4, code: 'T8M5D6', content: "Where privacy meets preparation's need, A guarded space where athletes proceed. Rows of metal, clothes concealed, Your next clue waits, soon revealed"},
      { number: 5, code: 'A7X1H9', content: "I'm where food and friendly conversation blend, A place you visit, whether morning or end. With scents and flavors that dance in the air, It's a haven, if you dare. The prize is on the table that's out of place, with plates." },
      { number: 6, code: 'S9Q4B8', content: "Invisible, I can fill the skies, Yet without me, life would not arise.In gentle whispers or storms that grow, What am I that dances, swirls, and flows?" },
      { number: 7, code: 'AIR', content: "CONGRATS!" },
    ],
    Ether: [
      { number: 1, code: 'J8K3P5', content: "I'm long, I'm straight, I'm yellow and bright, I don't twist, I won't turn, a watery flight. Find your treasure at the end of my sight."},
      { number: 2, code: 'N4X6D1', content: "Ride the beast, with strength and might, Find the spot where cowboys take flight"},
      { number: 3, code: 'G7L9Y2', content: "I have ten friends that stand in a line, You roll a heavy ball, hoping to shine. With strikes and spares, the excitement is real"},
      { number: 4, code: 'V5H2T8', content: "Though the skies may be clear, we bring the drops down, With music and movement, we twirl all around. In a space made for joy, we mimic the sky"},
      { number: 5, code: 'M1Q7B6', content: "A rise, a fall all by crafted chains, a mimic of oceans in controlled domains. seek the place where human ingenuity shines, imitaing the force of nature divine" },
      { number: 6, code: 'F9R4C3', content: "I can quench your thirst but also create tides, Flowing through rivers, where life abides. From droplets to storms, my forms are vast, What am I, present in future and past?" },
      { number: 7, code: 'WATER', content: "CONGRATS!" },
    ],
    };

    async function migrateData() {
        try {
          // Connect to your MongoDB database
          await mongoose.connect('removeed-uri, need to add when running', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
      
          console.log('Connected to MongoDB');
      
          const teams = await Team.find({});
          console.log(`Found ${teams.length} teams to migrate`);
      
          for (let team of teams) {
            console.log(`Migrating team: ${team.name} (${team.group})`);
            
            const updatedProgress = team.progress.map((entry, index) => {
              const clue = cluesdata[team.group][index];
              if (!clue) {
                console.warn(`Warning: No clue found for ${team.group} at index ${index}`);
                return entry;
              }
              return {
                ...entry.toObject(),
                clueNumber: clue.number,
                code: clue.code,
                content: clue.content
              };
            });
      
            team.progress = updatedProgress;
            await team.save();
            console.log(`Migrated ${updatedProgress.length} progress entries for ${team.name}`);
          }
      
          console.log('Migration complete');
        } catch (error) {
          console.error('Migration failed:', error);
        } finally {
          await mongoose.disconnect();
          console.log('Disconnected from MongoDB');
        }
      }
      
      // Run the migration
      migrateData().catch(console.error);