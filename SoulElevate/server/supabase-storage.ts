import { supabase } from './supabase';
import {
  User, InsertUser,
  Quote, InsertQuote,
  Tip, InsertTip,
  Media, InsertMedia,
  ContactMessage, InsertContactMessage,
  Subscriber, InsertSubscriber,
  Challenge, InsertChallenge,
  ChallengeInput
} from '../shared/schema';
import { IStorage } from './storage';

// Helper function to check if Supabase is available
const isSupabaseAvailable = () => {
  if (!supabase) {
    console.error('Supabase client is not available');
    return false;
  }
  return true;
};

export class SupabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    if (!isSupabaseAvailable()) return undefined;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error || !data) return undefined;
    return data as User;
  }

  async createUser(user: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create user: ${error.message}`);
    return data as User;
  }

  // Quotes
  async getAllQuotes(): Promise<Quote[]> {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .order('added_date', { ascending: false });
    
    if (error) throw new Error(`Failed to fetch quotes: ${error.message}`);
    return data as Quote[];
  }

  async getQuoteById(id: number): Promise<Quote | undefined> {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data as Quote;
  }

  async getFeaturedQuote(): Promise<Quote | undefined> {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('featured', true)
      .limit(1)
      .single();
    
    if (error) {
      // If no featured quote, get a random one
      const { data: allQuotes, error: allError } = await supabase
        .from('quotes')
        .select('*');
      
      if (allError || !allQuotes || allQuotes.length === 0) return undefined;
      
      const randomIndex = Math.floor(Math.random() * allQuotes.length);
      return allQuotes[randomIndex] as Quote;
    }
    
    return data as Quote;
  }

  async createQuote(quote: InsertQuote): Promise<Quote> {
    // If this is a featured quote, unfeature all others
    if (quote.featured) {
      await supabase
        .from('quotes')
        .update({ featured: false })
        .eq('featured', true);
    }
    
    const { data, error } = await supabase
      .from('quotes')
      .insert([quote])
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create quote: ${error.message}`);
    return data as Quote;
  }

  async updateQuote(id: number, quote: Partial<InsertQuote>): Promise<Quote | undefined> {
    // If updating to featured, unfeature all others
    if (quote.featured) {
      await supabase
        .from('quotes')
        .update({ featured: false })
        .eq('featured', true);
    }
    
    const { data, error } = await supabase
      .from('quotes')
      .update(quote)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to update quote: ${error.message}`);
    return data as Quote;
  }

  async deleteQuote(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', id);
    
    return !error;
  }

  // Tips
  async getAllTips(): Promise<Tip[]> {
    const { data, error } = await supabase
      .from('tips')
      .select('*')
      .order('added_date', { ascending: false });
    
    if (error) throw new Error(`Failed to fetch tips: ${error.message}`);
    return data as Tip[];
  }

  async getTipsByCategory(category: string): Promise<Tip[]> {
    const { data, error } = await supabase
      .from('tips')
      .select('*')
      .eq('category', category)
      .order('added_date', { ascending: false });
    
    if (error) throw new Error(`Failed to fetch tips by category: ${error.message}`);
    return data as Tip[];
  }

  async createTip(tip: InsertTip): Promise<Tip> {
    const { data, error } = await supabase
      .from('tips')
      .insert([tip])
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create tip: ${error.message}`);
    return data as Tip;
  }

  async updateTip(id: number, tip: Partial<InsertTip>): Promise<Tip | undefined> {
    const { data, error } = await supabase
      .from('tips')
      .update(tip)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to update tip: ${error.message}`);
    return data as Tip;
  }

  async deleteTip(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('tips')
      .delete()
      .eq('id', id);
    
    return !error;
  }

  // Media
  async getAllMedia(): Promise<Media[]> {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('added_date', { ascending: false });
    
    if (error) throw new Error(`Failed to fetch media: ${error.message}`);
    return data as Media[];
  }

  async getMediaByType(type: string): Promise<Media[]> {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('type', type)
      .order('added_date', { ascending: false });
    
    if (error) throw new Error(`Failed to fetch media by type: ${error.message}`);
    return data as Media[];
  }

  async getMediaById(id: number): Promise<Media | undefined> {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data as Media;
  }

  async getFeaturedMedia(type: string): Promise<Media | undefined> {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('type', type)
      .eq('featured', true)
      .limit(1)
      .single();
    
    if (error) {
      // If no featured media, get a random one of the given type
      const { data: allMedia, error: allError } = await supabase
        .from('media')
        .select('*')
        .eq('type', type);
      
      if (allError || !allMedia || allMedia.length === 0) return undefined;
      
      const randomIndex = Math.floor(Math.random() * allMedia.length);
      return allMedia[randomIndex] as Media;
    }
    
    return data as Media;
  }

  async createMedia(media: InsertMedia): Promise<Media> {
    // If this is a featured media, unfeature all others of the same type
    if (media.featured) {
      await supabase
        .from('media')
        .update({ featured: false })
        .eq('type', media.type)
        .eq('featured', true);
    }
    
    const { data, error } = await supabase
      .from('media')
      .insert([media])
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create media: ${error.message}`);
    return data as Media;
  }

  async updateMedia(id: number, media: Partial<InsertMedia>): Promise<Media | undefined> {
    // If updating to featured, unfeature all others of the same type
    if (media.featured && media.type) {
      await supabase
        .from('media')
        .update({ featured: false })
        .eq('type', media.type)
        .eq('featured', true);
    } else if (media.featured) {
      // Get the current media to get its type
      const currentMedia = await this.getMediaById(id);
      if (currentMedia) {
        await supabase
          .from('media')
          .update({ featured: false })
          .eq('type', currentMedia.type)
          .eq('featured', true);
      }
    }
    
    const { data, error } = await supabase
      .from('media')
      .update(media)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to update media: ${error.message}`);
    return data as Media;
  }

  async deleteMedia(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('media')
      .delete()
      .eq('id', id);
    
    return !error;
  }

  // Contact Messages
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([message])
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create contact message: ${error.message}`);
    return data as ContactMessage;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('added_date', { ascending: false });
    
    if (error) throw new Error(`Failed to fetch contact messages: ${error.message}`);
    return data as ContactMessage[];
  }

  // Newsletter Subscribers
  async addSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    const { data, error } = await supabase
      .from('subscribers')
      .insert([subscriber])
      .select()
      .single();
    
    if (error) throw new Error(`Failed to add subscriber: ${error.message}`);
    return data as Subscriber;
  }

  async getAllSubscribers(): Promise<Subscriber[]> {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('subscription_date', { ascending: false });
    
    if (error) throw new Error(`Failed to fetch subscribers: ${error.message}`);
    return data as Subscriber[];
  }

  // Challenges
  async getAllChallenges(): Promise<Challenge[]> {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('added_date', { ascending: false });
    
    if (error) throw new Error(`Failed to fetch challenges: ${error.message}`);
    return data as Challenge[];
  }

  async getChallengeById(id: number): Promise<Challenge | undefined> {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data as Challenge;
  }

  async getChallengesByCategory(category: string): Promise<Challenge[]> {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('category', category)
      .order('added_date', { ascending: false });
    
    if (error) throw new Error(`Failed to fetch challenges by category: ${error.message}`);
    return data as Challenge[];
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const { data, error } = await supabase
      .from('challenges')
      .insert([challenge])
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create challenge: ${error.message}`);
    return data as Challenge;
  }

  async updateChallenge(id: number, challenge: Partial<InsertChallenge>): Promise<Challenge | undefined> {
    const { data, error } = await supabase
      .from('challenges')
      .update(challenge)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to update challenge: ${error.message}`);
    return data as Challenge;
  }

  async deleteChallenge(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('challenges')
      .delete()
      .eq('id', id);
    
    return !error;
  }

  async generatePersonalizedChallenge(input: ChallengeInput): Promise<Challenge> {
    // For the Supabase implementation, we'll fetch existing challenges matching the category
    // and interests, then adapt one of them to create a personalized challenge
    
    // First, find challenges in the specified category
    const { data: categoryChallenges, error: categoryError } = await supabase
      .from('challenges')
      .select('*')
      .eq('category', input.category);
    
    if (categoryError) throw new Error(`Failed to fetch challenges for personalization: ${categoryError.message}`);
    
    // If we have category matches, select one as a base
    let baseChallenge: Challenge | null = null;
    if (categoryChallenges && categoryChallenges.length > 0) {
      // Try to find one matching the difficulty, or just pick a random one
      const matchingDifficulty = categoryChallenges.filter(c => c.difficulty === input.difficulty);
      if (matchingDifficulty.length > 0) {
        baseChallenge = matchingDifficulty[Math.floor(Math.random() * matchingDifficulty.length)];
      } else {
        baseChallenge = categoryChallenges[Math.floor(Math.random() * categoryChallenges.length)];
      }
    }
    
    // If no base challenge, create a generic one
    if (!baseChallenge) {
      // Create a personalized challenge from scratch based on input
      const newChallenge: InsertChallenge = {
        title: `${input.difficulty} ${input.category} Challenge`,
        description: `A personalized ${input.duration}-day challenge to help you achieve your goals in ${input.category.toLowerCase()}.`,
        category: input.category,
        difficulty: input.difficulty,
        duration: input.duration,
        steps: [
          `Set a specific goal related to ${input.category.toLowerCase()}.`,
          `Track your progress daily.`,
          `Reflect on your achievements at the end of each week.`
        ]
      };
      
      return this.createChallenge(newChallenge);
    }
    
    // Create a personalized version based on the existing challenge
    const personalizedChallenge: InsertChallenge = {
      title: `Personalized ${baseChallenge.title}`,
      description: `A ${input.duration}-day challenge tailored to your interests in ${input.interests.join(', ')} and goals for ${input.goals.join(', ')}.`,
      category: input.category,
      difficulty: input.difficulty,
      duration: input.duration,
      steps: baseChallenge.steps,
      addedDate: new Date()
    };
    
    return this.createChallenge(personalizedChallenge);
  }
}