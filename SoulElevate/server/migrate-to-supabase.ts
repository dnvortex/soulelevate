import { supabase } from './supabase';
import { storage } from './storage';

// Note: In Supabase, tables are automatically created in the dashboard or via SQL in their SQL editor
// We'll insert data from our in-memory store and add sample data if needed

async function runMigration() {
  console.log('Starting migration to Supabase...');

  try {
    // First check if tables exist by trying to count records
    const { count: quotesCount, error: quotesCheckError } = await supabase
      .from('quotes')
      .select('*', { count: 'exact', head: true });
    
    // If tables don't exist yet (indicated by error), we'll add sample data later
    const needSampleData = !!quotesCheckError;
    
    // Fetch data from in-memory storage
    const quotes = await storage.getAllQuotes();
    const tips = await storage.getAllTips();
    const media = await storage.getAllMedia();
    const contactMessages = await storage.getAllContactMessages();
    const subscribers = await storage.getAllSubscribers();

    // Insert data into Supabase (only if we have data in memory)
    console.log('Migrating quotes...');
    if (quotes.length > 0) {
      const { error: quotesError } = await supabase.from('quotes').insert(
        quotes.map(quote => ({
          text: quote.text,
          author: quote.author,
          featured: quote.featured || false
        }))
      );
      if (quotesError) console.error('Error inserting quotes:', quotesError);
      else console.log(`${quotes.length} quotes migrated successfully`);
    }

    console.log('Migrating tips...');
    if (tips.length > 0) {
      const { error: tipsError } = await supabase.from('tips').insert(
        tips.map(tip => ({
          title: tip.title,
          content: tip.content,
          category: tip.category
        }))
      );
      if (tipsError) console.error('Error inserting tips:', tipsError);
      else console.log(`${tips.length} tips migrated successfully`);
    }

    console.log('Migrating media...');
    if (media.length > 0) {
      const { error: mediaError } = await supabase.from('media').insert(
        media.map(item => ({
          title: item.title,
          description: item.description,
          type: item.type,
          url: item.url,
          duration: item.duration,
          duration_seconds: item.durationSeconds,
          thumbnail: item.thumbnail,
          featured: item.featured || false,
          category: item.category
        }))
      );
      if (mediaError) console.error('Error inserting media:', mediaError);
      else console.log(`${media.length} media items migrated successfully`);
    }

    console.log('Migrating contact messages...');
    if (contactMessages.length > 0) {
      const { error: contactError } = await supabase.from('contact_messages').insert(
        contactMessages.map(message => ({
          name: message.name,
          email: message.email,
          message: message.message
        }))
      );
      if (contactError) console.error('Error inserting contact messages:', contactError);
      else console.log(`${contactMessages.length} contact messages migrated successfully`);
    }

    console.log('Migrating subscribers...');
    if (subscribers.length > 0) {
      const { error: subscribersError } = await supabase.from('subscribers').insert(
        subscribers.map(subscriber => ({
          email: subscriber.email
        }))
      );
      if (subscribersError) console.error('Error inserting subscribers:', subscribersError);
      else console.log(`${subscribers.length} subscribers migrated successfully`);
    }

    // Add sample data only if tables were just created or are empty
    if (needSampleData) {
      console.log('Tables might not exist yet. Adding sample data...');
      
      // Insert some sample quotes
      const sampleQuotes = [
        { text: 'The journey of a thousand miles begins with a single step.', author: 'Lao Tzu', featured: true },
        { text: 'You are never too old to set another goal or to dream a new dream.', author: 'C.S. Lewis', featured: false },
        { text: 'Success is not final, failure is not fatal: It is the courage to continue that counts.', author: 'Winston Churchill', featured: false },
        { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', featured: false },
        { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt', featured: false }
      ];
      
      const { error: quotesInsertError } = await supabase.from('quotes').insert(sampleQuotes);
      if (quotesInsertError) console.error('Error inserting sample quotes:', quotesInsertError);
      else console.log(`${sampleQuotes.length} sample quotes added successfully`);
      
      // Insert some sample tips
      const sampleTips = [
        { title: 'Pomodoro Technique', content: 'Work in focused 25-minute intervals with 5-minute breaks. After 4 intervals, take a longer break of 15-30 minutes.', category: 'Productivity' },
        { title: 'Eisenhower Matrix', content: 'Prioritize tasks by organizing them into four categories: urgent/important, important/not urgent, urgent/not important, and neither.', category: 'Productivity' },
        { title: 'Growth Mindset', content: 'Embrace challenges, persist in the face of setbacks, and view effort as the path to mastery.', category: 'Mindset' },
        { title: 'Morning Exercise', content: 'Start your day with 20 minutes of physical activity to boost mood and energy levels.', category: 'Health' },
        { title: 'Goal Setting Framework', content: 'Create SMART goals: Specific, Measurable, Achievable, Relevant, and Time-bound.', category: 'Success' }
      ];
      
      const { error: tipsInsertError } = await supabase.from('tips').insert(sampleTips);
      if (tipsInsertError) console.error('Error inserting sample tips:', tipsInsertError);
      else console.log(`${sampleTips.length} sample tips added successfully`);
      
      // Insert sample media
      const sampleMedia = [
        { 
          title: 'Mindfulness Meditation Basics', 
          description: 'Learn the fundamentals of mindfulness meditation with this guided session.', 
          type: 'audio', 
          url: 'https://example.com/audio/mindfulness.mp3', 
          duration: '10:30', 
          duration_seconds: 630, 
          thumbnail: 'https://example.com/thumbnails/mindfulness.jpg', 
          featured: true, 
          category: 'Mindset' 
        },
        { 
          title: 'Productivity Hacks', 
          description: 'Simple techniques to boost your productivity immediately.', 
          type: 'video', 
          url: 'https://example.com/videos/productivity-hacks.mp4', 
          duration: '7:15', 
          duration_seconds: 435, 
          thumbnail: 'https://example.com/thumbnails/productivity.jpg', 
          featured: true, 
          category: 'Productivity' 
        }
      ];
      
      const { error: mediaInsertError } = await supabase.from('media').insert(sampleMedia);
      if (mediaInsertError) console.error('Error inserting sample media:', mediaInsertError);
      else console.log(`${sampleMedia.length} sample media items added successfully`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
runMigration();