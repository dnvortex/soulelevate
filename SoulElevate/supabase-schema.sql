-- Create schema for Supabase based on our application schema

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Quotes Table
CREATE TABLE IF NOT EXISTS quotes (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  added_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tips Table
CREATE TABLE IF NOT EXISTS tips (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL, -- ["Productivity", "Mindset", "Health", "Success"]
  added_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media (Videos & Audio) Table
CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL, -- ["video", "audio"]
  url TEXT NOT NULL,
  duration TEXT NOT NULL, -- Stored as "MM:SS" format for display
  duration_seconds INTEGER NOT NULL, -- Actual duration in seconds
  thumbnail TEXT NOT NULL DEFAULT '',
  featured BOOLEAN DEFAULT false,
  category TEXT NOT NULL,
  added_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Message Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  added_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscription_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sample data for Quotes
INSERT INTO quotes (text, author, featured) VALUES
('The journey of a thousand miles begins with a single step.', 'Lao Tzu', true),
('You are never too old to set another goal or to dream a new dream.', 'C.S. Lewis', false),
('Success is not final, failure is not fatal: It is the courage to continue that counts.', 'Winston Churchill', false),
('The only way to do great work is to love what you do.', 'Steve Jobs', false),
('Believe you can and you''re halfway there.', 'Theodore Roosevelt', false);

-- Sample data for Tips
INSERT INTO tips (title, content, category) VALUES
('Pomodoro Technique', 'Work in focused 25-minute intervals with 5-minute breaks. After 4 intervals, take a longer break of 15-30 minutes.', 'Productivity'),
('Eisenhower Matrix', 'Prioritize tasks by organizing them into four categories: urgent/important, important/not urgent, urgent/not important, and neither.', 'Productivity'),
('Two-Minute Rule', 'If a task takes less than two minutes to complete, do it immediately instead of putting it off for later.', 'Productivity'),
('Growth Mindset', 'Embrace challenges, persist in the face of setbacks, and view effort as the path to mastery.', 'Mindset'),
('Gratitude Practice', 'Write down three things you''re grateful for each day to increase positivity and resilience.', 'Mindset'),
('Morning Exercise', 'Start your day with 20 minutes of physical activity to boost mood and energy levels.', 'Health'),
('Hydration Habit', 'Drink a glass of water first thing in the morning and keep a water bottle with you throughout the day.', 'Health'),
('Goal Setting Framework', 'Create SMART goals: Specific, Measurable, Achievable, Relevant, and Time-bound.', 'Success'),
('Feedback Loop', 'Regularly seek feedback from trusted sources to identify blind spots and areas for improvement.', 'Success');

-- Sample data for Media
INSERT INTO media (title, description, type, url, duration, duration_seconds, thumbnail, featured, category) VALUES
('Mindfulness Meditation Basics', 'Learn the fundamentals of mindfulness meditation with this guided session.', 'audio', 'https://example.com/audio/mindfulness.mp3', '10:30', 630, 'https://example.com/thumbnails/mindfulness.jpg', true, 'Mindset'),
('Morning Motivation', 'Start your day with positive affirmations and motivation.', 'audio', 'https://example.com/audio/morning-motivation.mp3', '5:45', 345, 'https://example.com/thumbnails/morning.jpg', false, 'Mindset'),
('Productivity Hacks', 'Simple techniques to boost your productivity immediately.', 'video', 'https://example.com/videos/productivity-hacks.mp4', '7:15', 435, 'https://example.com/thumbnails/productivity.jpg', true, 'Productivity'),
('Effective Goal Setting', 'Learn how to set and achieve meaningful goals.', 'video', 'https://example.com/videos/goal-setting.mp4', '12:20', 740, 'https://example.com/thumbnails/goals.jpg', false, 'Success');