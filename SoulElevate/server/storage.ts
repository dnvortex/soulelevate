import { 
  users, type User, type InsertUser,
  quotes, type Quote, type InsertQuote,
  tips, type Tip, type InsertTip,
  media, type Media, type InsertMedia,
  contactMessages, type ContactMessage, type InsertContactMessage,
  subscribers, type Subscriber, type InsertSubscriber,
  challenges, type Challenge, type InsertChallenge,
  type ChallengeInput
} from "@shared/schema";

// Interface with CRUD methods for all entities
export interface IStorage {
  // Users (existing)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Quotes
  getAllQuotes(): Promise<Quote[]>;
  getQuoteById(id: number): Promise<Quote | undefined>;
  getFeaturedQuote(): Promise<Quote | undefined>;
  createQuote(quote: InsertQuote): Promise<Quote>;
  updateQuote(id: number, quote: Partial<InsertQuote>): Promise<Quote | undefined>;
  deleteQuote(id: number): Promise<boolean>;
  
  // Tips
  getAllTips(): Promise<Tip[]>;
  getTipsByCategory(category: string): Promise<Tip[]>;
  createTip(tip: InsertTip): Promise<Tip>;
  updateTip(id: number, tip: Partial<InsertTip>): Promise<Tip | undefined>;
  deleteTip(id: number): Promise<boolean>;
  
  // Media
  getAllMedia(): Promise<Media[]>;
  getMediaByType(type: string): Promise<Media[]>;
  getMediaById(id: number): Promise<Media | undefined>;
  getFeaturedMedia(type: string): Promise<Media | undefined>;
  createMedia(media: InsertMedia): Promise<Media>;
  updateMedia(id: number, media: Partial<InsertMedia>): Promise<Media | undefined>;
  deleteMedia(id: number): Promise<boolean>;
  
  // Contact Messages
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
  
  // Newsletter Subscribers
  addSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  getAllSubscribers(): Promise<Subscriber[]>;
  
  // Personalized Challenges
  getAllChallenges(): Promise<Challenge[]>;
  getChallengeById(id: number): Promise<Challenge | undefined>;
  getChallengesByCategory(category: string): Promise<Challenge[]>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  updateChallenge(id: number, challenge: Partial<InsertChallenge>): Promise<Challenge | undefined>;
  deleteChallenge(id: number): Promise<boolean>;
  generatePersonalizedChallenge(input: ChallengeInput): Promise<Challenge>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private quotes: Map<number, Quote>;
  private tips: Map<number, Tip>;
  private mediaItems: Map<number, Media>;
  private contactMessages: Map<number, ContactMessage>;
  private subscribers: Map<number, Subscriber>;
  private challenges: Map<number, Challenge>;
  
  private userCounter: number;
  private quoteCounter: number;
  private tipCounter: number;
  private mediaCounter: number;
  private messageCounter: number;
  private subscriberCounter: number;
  private challengeCounter: number;

  constructor() {
    this.users = new Map();
    this.quotes = new Map();
    this.tips = new Map();
    this.mediaItems = new Map();
    this.contactMessages = new Map();
    this.subscribers = new Map();
    this.challenges = new Map();
    
    this.userCounter = 1;
    this.quoteCounter = 1;
    this.tipCounter = 1;
    this.mediaCounter = 1;
    this.messageCounter = 1;
    this.subscriberCounter = 1;
    this.challengeCounter = 1;
    
    // Initialize with seed data
    this.initializeData();
  }

  // Initialize with seed data
  private initializeData() {
    // Add quotes
    const sampleQuotes: InsertQuote[] = [
      { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu", featured: true },
      { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis", featured: false },
      { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill", featured: false },
      { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", featured: false },
      { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", featured: false }
    ];
    
    sampleQuotes.forEach(quote => this.createQuote(quote));
    
    // Add tips
    const sampleTips: InsertTip[] = [
      { title: "Pomodoro Technique", content: "Work in focused 25-minute intervals with 5-minute breaks. After 4 intervals, take a longer break of 15-30 minutes.", category: "Productivity" },
      { title: "Eisenhower Matrix", content: "Prioritize tasks by organizing them into four categories: urgent/important, important/not urgent, urgent/not important, and neither.", category: "Productivity" },
      { title: "Two-Minute Rule", content: "If a task takes less than two minutes to complete, do it immediately instead of putting it off for later.", category: "Productivity" },
      { title: "Growth Mindset", content: "Embrace challenges, persist in the face of setbacks, and view effort as the path to mastery.", category: "Mindset" },
      { title: "Gratitude Practice", content: "Write down three things you're grateful for each day to increase positivity and resilience.", category: "Mindset" },
      { title: "Morning Exercise", content: "Start your day with 20 minutes of physical activity to boost mood and energy levels.", category: "Health" },
      { title: "Hydration Habit", content: "Drink a glass of water first thing in the morning and keep a water bottle with you throughout the day.", category: "Health" },
      { title: "Goal Setting Framework", content: "Create SMART goals: Specific, Measurable, Achievable, Relevant, and Time-bound.", category: "Success" },
      { title: "Feedback Loop", content: "Regularly seek feedback from trusted sources to identify blind spots and areas for improvement.", category: "Success" }
    ];
    
    sampleTips.forEach(tip => this.createTip(tip));
    
    // Add media
    const sampleMedia: InsertMedia[] = [
      {
        title: "5 Mindfulness Practices for Daily Life",
        description: "Learn simple techniques to stay present and reduce stress throughout your day.",
        type: "video",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "5:20",
        durationSeconds: 320,
        thumbnail: "https://images.unsplash.com/photo-1501139083538-0139583c060f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        featured: true,
        category: "Mindfulness"
      },
      {
        title: "Productivity Hacks for Working From Home",
        description: "Tips to maintain focus and efficiency in a home office environment.",
        type: "video",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "10:25",
        durationSeconds: 625,
        thumbnail: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        featured: false,
        category: "Productivity"
      },
      {
        title: "Journaling for Mental Clarity",
        description: "How to use journaling to process emotions and gain perspective.",
        type: "video",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "7:18",
        durationSeconds: 438,
        thumbnail: "https://images.unsplash.com/photo-1464132692293-0c0c7a51d532?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        featured: false,
        category: "Mental Health"
      },
      {
        title: "Morning Routine for Success",
        description: "Start your day with purpose using this effective morning routine.",
        type: "video",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "15:40",
        durationSeconds: 940,
        thumbnail: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        featured: false,
        category: "Productivity"
      },
      {
        title: "Guided Meditation for Focus",
        description: "10 minute practice",
        type: "audio",
        url: "https://example.com/audio/meditation.mp3",
        duration: "10:00",
        durationSeconds: 600,
        thumbnail: "",
        featured: true,
        category: "Meditation"
      },
      {
        title: "Positive Affirmations for Confidence",
        description: "Daily Practice",
        type: "audio",
        url: "https://example.com/audio/affirmations.mp3",
        duration: "5:20",
        durationSeconds: 320,
        thumbnail: "",
        featured: false,
        category: "Confidence"
      },
      {
        title: "Evening Relaxation Technique",
        description: "Sleep Better",
        type: "audio",
        url: "https://example.com/audio/relaxation.mp3",
        duration: "7:45",
        durationSeconds: 465,
        thumbnail: "",
        featured: false,
        category: "Sleep"
      },
      {
        title: "Overcoming Self-Doubt",
        description: "Motivation",
        type: "audio",
        url: "https://example.com/audio/self-doubt.mp3",
        duration: "12:30",
        durationSeconds: 750,
        thumbnail: "",
        featured: false,
        category: "Confidence"
      },
      {
        title: "Focus Enhancement Exercise",
        description: "Productivity",
        type: "audio",
        url: "https://example.com/audio/focus.mp3",
        duration: "8:15",
        durationSeconds: 495,
        thumbnail: "",
        featured: false,
        category: "Productivity"
      }
    ];
    
    sampleMedia.forEach(item => this.createMedia(item));
    
    // Add sample challenges
    const sampleChallenges: InsertChallenge[] = [
      {
        title: "30-Day Productivity Boost",
        description: "Transform your productivity with daily actionable tasks designed to help you work smarter and accomplish more.",
        category: "Productivity",
        difficulty: "Medium",
        duration: 30,
        steps: [
          "Create a priority-based to-do list system",
          "Implement time blocking in your calendar",
          "Practice the Pomodoro Technique",
          "Declutter your workspace",
          "Establish a morning routine",
          "Set up digital boundaries (notifications, email times)",
          "Learn keyboard shortcuts for your most-used programs"
        ]
      },
      {
        title: "Mindfulness Starter Pack",
        description: "Begin your mindfulness journey with this gentle introduction to present-moment awareness practices.",
        category: "Mindset",
        difficulty: "Easy",
        duration: 14,
        steps: [
          "Practice 5 minutes of focused breathing",
          "Perform a body scan meditation",
          "Try mindful eating for one meal",
          "Take a mindful walking break",
          "Practice gratitude journaling",
          "Do a digital detox for one hour",
          "Observe thoughts without judgment"
        ]
      },
      {
        title: "Fitness Foundation Builder",
        description: "Create a sustainable fitness routine with graduated challenges suitable for beginners.",
        category: "Health",
        difficulty: "Medium",
        duration: 21,
        steps: [
          "Walk 10,000 steps daily",
          "Complete a beginner's stretching routine",
          "Try a 7-minute high-intensity workout",
          "Take the stairs instead of elevators",
          "Do a beginner's yoga session",
          "Incorporate 3 strength training sessions per week",
          "Schedule active recovery days"
        ]
      },
      {
        title: "Goal-Setting Mastery",
        description: "Learn the art and science of effective goal setting to achieve your dreams with greater clarity and purpose.",
        category: "Success",
        difficulty: "Hard",
        duration: 28,
        steps: [
          "Define your core values and long-term vision",
          "Create SMART goals for 3 life areas",
          "Break down goals into actionable tasks",
          "Establish tracking metrics for each goal",
          "Implement weekly review sessions",
          "Create accountability mechanisms",
          "Learn to pivot when strategies aren't working"
        ]
      }
    ];
    
    sampleChallenges.forEach(challenge => this.createChallenge(challenge));
  }

  // User methods (existing)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Quote methods
  async getAllQuotes(): Promise<Quote[]> {
    return Array.from(this.quotes.values()).sort((a, b) => {
      // Sort by date (newest first)
      const dateA = a.addedDate ? new Date(a.addedDate).getTime() : 0;
      const dateB = b.addedDate ? new Date(b.addedDate).getTime() : 0;
      return dateB - dateA;
    });
  }
  
  async getQuoteById(id: number): Promise<Quote | undefined> {
    return this.quotes.get(id);
  }
  
  async getFeaturedQuote(): Promise<Quote | undefined> {
    return Array.from(this.quotes.values()).find(quote => quote.featured);
  }
  
  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const id = this.quoteCounter++;
    const now = new Date();
    
    // If this quote is set as featured, un-feature all others
    if (insertQuote.featured) {
      for (const quote of this.quotes.values()) {
        if (quote.featured) {
          quote.featured = false;
          this.quotes.set(quote.id, quote);
        }
      }
    }
    
    const quote: Quote = { 
      ...insertQuote, 
      id,
      addedDate: now 
    };
    
    this.quotes.set(id, quote);
    return quote;
  }
  
  async updateQuote(id: number, quoteData: Partial<InsertQuote>): Promise<Quote | undefined> {
    const quote = this.quotes.get(id);
    if (!quote) return undefined;
    
    // If this quote is being set as featured, un-feature all others
    if (quoteData.featured) {
      for (const q of this.quotes.values()) {
        if (q.featured && q.id !== id) {
          q.featured = false;
          this.quotes.set(q.id, q);
        }
      }
    }
    
    const updatedQuote = { ...quote, ...quoteData };
    this.quotes.set(id, updatedQuote);
    return updatedQuote;
  }
  
  async deleteQuote(id: number): Promise<boolean> {
    return this.quotes.delete(id);
  }
  
  // Tip methods
  async getAllTips(): Promise<Tip[]> {
    return Array.from(this.tips.values()).sort((a, b) => {
      // Sort by date (newest first)
      const dateA = a.addedDate ? new Date(a.addedDate).getTime() : 0;
      const dateB = b.addedDate ? new Date(b.addedDate).getTime() : 0;
      return dateB - dateA;
    });
  }
  
  async getTipsByCategory(category: string): Promise<Tip[]> {
    return Array.from(this.tips.values())
      .filter(tip => tip.category === category)
      .sort((a, b) => {
        // Sort by date (newest first)
        const dateA = a.addedDate ? new Date(a.addedDate).getTime() : 0;
        const dateB = b.addedDate ? new Date(b.addedDate).getTime() : 0;
        return dateB - dateA;
      });
  }
  
  async createTip(insertTip: InsertTip): Promise<Tip> {
    const id = this.tipCounter++;
    const now = new Date();
    
    const tip: Tip = { 
      ...insertTip, 
      id,
      addedDate: now 
    };
    
    this.tips.set(id, tip);
    return tip;
  }
  
  async updateTip(id: number, tipData: Partial<InsertTip>): Promise<Tip | undefined> {
    const tip = this.tips.get(id);
    if (!tip) return undefined;
    
    const updatedTip = { ...tip, ...tipData };
    this.tips.set(id, updatedTip);
    return updatedTip;
  }
  
  async deleteTip(id: number): Promise<boolean> {
    return this.tips.delete(id);
  }
  
  // Media methods
  async getAllMedia(): Promise<Media[]> {
    return Array.from(this.mediaItems.values()).sort((a, b) => {
      // Sort by date (newest first)
      const dateA = a.addedDate ? new Date(a.addedDate).getTime() : 0;
      const dateB = b.addedDate ? new Date(b.addedDate).getTime() : 0;
      return dateB - dateA;
    });
  }
  
  async getMediaByType(type: string): Promise<Media[]> {
    return Array.from(this.mediaItems.values())
      .filter(item => item.type === type)
      .sort((a, b) => {
        // Sort by date (newest first)
        const dateA = a.addedDate ? new Date(a.addedDate).getTime() : 0;
        const dateB = b.addedDate ? new Date(b.addedDate).getTime() : 0;
        return dateB - dateA;
      });
  }
  
  async getMediaById(id: number): Promise<Media | undefined> {
    return this.mediaItems.get(id);
  }
  
  async getFeaturedMedia(type: string): Promise<Media | undefined> {
    return Array.from(this.mediaItems.values())
      .filter(item => item.type === type)
      .find(item => item.featured);
  }
  
  async createMedia(insertMedia: InsertMedia): Promise<Media> {
    const id = this.mediaCounter++;
    const now = new Date();
    
    // If this media is set as featured, un-feature all others of the same type
    if (insertMedia.featured) {
      for (const media of this.mediaItems.values()) {
        if (media.featured && media.type === insertMedia.type) {
          media.featured = false;
          this.mediaItems.set(media.id, media);
        }
      }
    }
    
    const media: Media = { 
      ...insertMedia, 
      id,
      addedDate: now 
    };
    
    this.mediaItems.set(id, media);
    return media;
  }
  
  async updateMedia(id: number, mediaData: Partial<InsertMedia>): Promise<Media | undefined> {
    const media = this.mediaItems.get(id);
    if (!media) return undefined;
    
    // If this media is being set as featured, un-feature all others of the same type
    if (mediaData.featured && mediaData.type) {
      for (const m of this.mediaItems.values()) {
        if (m.featured && m.type === mediaData.type && m.id !== id) {
          m.featured = false;
          this.mediaItems.set(m.id, m);
        }
      }
    } else if (mediaData.featured) {
      for (const m of this.mediaItems.values()) {
        if (m.featured && m.type === media.type && m.id !== id) {
          m.featured = false;
          this.mediaItems.set(m.id, m);
        }
      }
    }
    
    const updatedMedia = { ...media, ...mediaData };
    this.mediaItems.set(id, updatedMedia);
    return updatedMedia;
  }
  
  async deleteMedia(id: number): Promise<boolean> {
    return this.mediaItems.delete(id);
  }
  
  // Contact message methods
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.messageCounter++;
    const now = new Date();
    
    const message: ContactMessage = { 
      ...insertMessage, 
      id,
      addedDate: now 
    };
    
    this.contactMessages.set(id, message);
    return message;
  }
  
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values()).sort((a, b) => {
      // Sort by date (newest first)
      const dateA = a.addedDate ? new Date(a.addedDate).getTime() : 0;
      const dateB = b.addedDate ? new Date(b.addedDate).getTime() : 0;
      return dateB - dateA;
    });
  }
  
  // Newsletter subscriber methods
  async addSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    // Check if email already exists
    const existingSubscriber = Array.from(this.subscribers.values()).find(
      sub => sub.email === insertSubscriber.email
    );
    
    if (existingSubscriber) {
      return existingSubscriber;
    }
    
    const id = this.subscriberCounter++;
    const now = new Date();
    
    const subscriber: Subscriber = { 
      ...insertSubscriber, 
      id,
      subscriptionDate: now 
    };
    
    this.subscribers.set(id, subscriber);
    return subscriber;
  }
  
  async getAllSubscribers(): Promise<Subscriber[]> {
    return Array.from(this.subscribers.values()).sort((a, b) => {
      // Sort by date (newest first)
      const dateA = a.subscriptionDate ? new Date(a.subscriptionDate).getTime() : 0;
      const dateB = b.subscriptionDate ? new Date(b.subscriptionDate).getTime() : 0;
      return dateB - dateA;
    });
  }
  
  // Challenge methods
  async getAllChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values()).sort((a, b) => {
      // Sort by date (newest first)
      const dateA = a.addedDate ? new Date(a.addedDate).getTime() : 0;
      const dateB = b.addedDate ? new Date(b.addedDate).getTime() : 0;
      return dateB - dateA;
    });
  }
  
  async getChallengeById(id: number): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }
  
  async getChallengesByCategory(category: string): Promise<Challenge[]> {
    return Array.from(this.challenges.values())
      .filter(challenge => challenge.category === category)
      .sort((a, b) => {
        // Sort by date (newest first)
        const dateA = a.addedDate ? new Date(a.addedDate).getTime() : 0;
        const dateB = b.addedDate ? new Date(b.addedDate).getTime() : 0;
        return dateB - dateA;
      });
  }
  
  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const id = this.challengeCounter++;
    const now = new Date();
    
    const challenge: Challenge = { 
      ...insertChallenge, 
      id,
      addedDate: now 
    };
    
    this.challenges.set(id, challenge);
    return challenge;
  }
  
  async updateChallenge(id: number, challengeData: Partial<InsertChallenge>): Promise<Challenge | undefined> {
    const challenge = this.challenges.get(id);
    if (!challenge) return undefined;
    
    const updatedChallenge = { ...challenge, ...challengeData };
    this.challenges.set(id, updatedChallenge);
    return updatedChallenge;
  }
  
  async deleteChallenge(id: number): Promise<boolean> {
    return this.challenges.delete(id);
  }
  
  async generatePersonalizedChallenge(input: ChallengeInput): Promise<Challenge> {
    // This method will create a personalized challenge based on user input
    
    // Extract inputs
    const { interests, goals, difficulty, duration, category } = input;
    
    // Create a title based on user goals and category
    const goalPhrase = goals[0]; // Take the first goal as primary
    let title = "";
    
    if (category === "Productivity") {
      title = `${duration}-Day ${goalPhrase} Productivity Challenge`;
    } else if (category === "Mindset") {
      title = `Transform Your Mindset: ${goalPhrase} in ${duration} Days`;
    } else if (category === "Health") {
      title = `${goalPhrase} Health Challenge`;
    } else if (category === "Success") {
      title = `${duration}-Day Journey to ${goalPhrase}`;
    }
    
    // Create a description that incorporates user's interests and goals
    const interestList = interests.slice(0, 2).join(" and "); // Get first two interests
    const description = `A personalized ${duration}-day challenge designed specifically for someone interested in ${interestList}. This ${difficulty.toLowerCase()} difficulty challenge will help you ${goals.join(" and ")}.`;
    
    // Generate appropriate steps based on category, difficulty, and duration
    let steps: string[] = [];
    
    // Generate a mix of steps based on category
    if (category === "Productivity") {
      steps = [
        "Create a priority system for your tasks",
        `Implement time blocking for ${interests[0]} activities`,
        "Use the Pomodoro technique for focused work",
        "Eliminate distractions in your workspace",
        "Plan your day the night before",
        "Batch similar tasks together",
        "Take regular breaks to maintain energy",
        "Track your productivity patterns",
        "Say no to low-priority requests",
        "Reflect on your daily accomplishments"
      ];
    } else if (category === "Mindset") {
      steps = [
        "Practice 10 minutes of mindfulness meditation",
        "Write down three things you're grateful for",
        "Challenge a limiting belief",
        "Visualize achieving your goals",
        "Read content that inspires personal growth",
        "Practice positive self-talk",
        "Keep a thought journal",
        "Take a digital detox for one hour",
        "Practice mindful breathing when stressed",
        "Reflect on your personal values"
      ];
    } else if (category === "Health") {
      steps = [
        "Drink 8 glasses of water daily",
        "Take a 30-minute walk",
        "Try a new healthy recipe",
        "Stretch for 10 minutes after waking up",
        "Get 7-8 hours of sleep",
        "Take the stairs instead of the elevator",
        "Have a meat-free day",
        "Do a 7-minute high-intensity workout",
        "Practice deep breathing for 5 minutes",
        "Schedule regular screen breaks"
      ];
    } else if (category === "Success") {
      steps = [
        "Define what success means to you personally",
        "Set a SMART goal related to your interests",
        "Identify potential obstacles and plan around them",
        "Find a mentor or role model in your field",
        "Learn something new related to your goals",
        "Network with people in your area of interest",
        "Track your progress with measurable metrics",
        "Celebrate small wins on your journey",
        "Read about successful people in your field",
        "Reflect on lessons learned from setbacks"
      ];
    }
    
    // Adjust number of steps based on duration and difficulty
    let finalStepCount = Math.min(duration, steps.length);
    
    // For harder difficulties, add more steps
    if (difficulty === "Medium") {
      finalStepCount = Math.min(finalStepCount + 2, steps.length);
    } else if (difficulty === "Hard") {
      finalStepCount = Math.min(finalStepCount + 4, steps.length);
    }
    
    // Get final steps
    const finalSteps = steps.slice(0, finalStepCount);
    
    // Create and return the challenge
    return this.createChallenge({
      title,
      description,
      category,
      difficulty,
      duration,
      steps: finalSteps
    });
  }
}

// Import SupabaseStorage for use based on environment variable
import { SupabaseStorage } from './supabase-storage';

// Import Firebase storage implementation
import { FirebaseStorage } from './firebase-storage';

// Choose which storage backend to use
const useFirebase = true; // Setting to true to use Firebase

// Create and export the appropriate storage implementation
export const storage = useFirebase ? new FirebaseStorage() : new MemStorage();

// Log which storage is being used
console.log(`Using ${useFirebase ? 'Firebase' : 'in-memory'} storage for data persistence`);
