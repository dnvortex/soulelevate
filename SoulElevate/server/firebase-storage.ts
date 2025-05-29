import { 
  User, InsertUser,
  Quote, InsertQuote,
  Tip, InsertTip,
  Media, InsertMedia,
  ContactMessage, InsertContactMessage,
  Subscriber, InsertSubscriber,
  Challenge, InsertChallenge,
  ChallengeInput
} from "@shared/schema";
import { IStorage } from "./storage";
import { db } from "./firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  where, 
  query, 
  orderBy, 
  limit,
  Timestamp,
  Firestore
} from "firebase/firestore";

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  QUOTES: 'quotes',
  TIPS: 'tips',
  MEDIA: 'media',
  CONTACT_MESSAGES: 'contact_messages',
  SUBSCRIBERS: 'subscribers',
  CHALLENGES: 'challenges'
};

// Firebase Storage implementation
export class FirebaseStorage implements IStorage {
  // Helper methods
  private async getDocumentById<T>(collectionName: string, id: number): Promise<T | undefined> {
    try {
      const q = query(collection(db, collectionName), where("id", "==", id));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return undefined;
      }
      
      return querySnapshot.docs[0].data() as T;
    } catch (error) {
      console.error(`Error getting document from ${collectionName}:`, error);
      return undefined;
    }
  }

  private async getAllDocuments<T>(collectionName: string): Promise<T[]> {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => doc.data() as T);
    } catch (error) {
      console.error(`Error getting all documents from ${collectionName}:`, error);
      return [];
    }
  }

  private async getNextId(collectionName: string): Promise<number> {
    try {
      const docs = await this.getAllDocuments<any>(collectionName);
      if (docs.length === 0) {
        return 1;
      }
      
      const ids = docs.map(doc => doc.id || 0);
      return Math.max(...ids) + 1;
    } catch (error) {
      console.error(`Error getting next ID for ${collectionName}:`, error);
      return Date.now();
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.getDocumentById<User>(COLLECTIONS.USERS, id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const q = query(collection(db, COLLECTIONS.USERS), where("username", "==", username));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return undefined;
      }
      
      return querySnapshot.docs[0].data() as User;
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const id = await this.getNextId(COLLECTIONS.USERS);
      const newUser: User = { ...user, id };
      
      await addDoc(collection(db, COLLECTIONS.USERS), newUser);
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Quote methods
  async getAllQuotes(): Promise<Quote[]> {
    return this.getAllDocuments<Quote>(COLLECTIONS.QUOTES);
  }

  async getQuoteById(id: number): Promise<Quote | undefined> {
    return this.getDocumentById<Quote>(COLLECTIONS.QUOTES, id);
  }

  async getFeaturedQuote(): Promise<Quote | undefined> {
    try {
      const q = query(
        collection(db, COLLECTIONS.QUOTES),
        where("featured", "==", true),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // If no featured quote, return any quote
        const fallbackQuery = query(collection(db, COLLECTIONS.QUOTES), limit(1));
        const fallbackSnapshot = await getDocs(fallbackQuery);
        
        if (fallbackSnapshot.empty) {
          return undefined;
        }
        
        return fallbackSnapshot.docs[0].data() as Quote;
      }
      
      return querySnapshot.docs[0].data() as Quote;
    } catch (error) {
      console.error("Error getting featured quote:", error);
      return undefined;
    }
  }

  async createQuote(quote: InsertQuote): Promise<Quote> {
    try {
      const id = await this.getNextId(COLLECTIONS.QUOTES);
      const addedDate = new Date();
      
      const newQuote: Quote = { 
        ...quote, 
        id, 
        addedDate,
        featured: quote.featured || false
      };
      
      await addDoc(collection(db, COLLECTIONS.QUOTES), this.convertDatesToFirestore(newQuote));
      return newQuote;
    } catch (error) {
      console.error("Error creating quote:", error);
      throw error;
    }
  }

  async updateQuote(id: number, quoteData: Partial<InsertQuote>): Promise<Quote | undefined> {
    try {
      const q = query(collection(db, COLLECTIONS.QUOTES), where("id", "==", id));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return undefined;
      }
      
      const docRef = querySnapshot.docs[0].ref;
      const existingQuote = querySnapshot.docs[0].data() as Quote;
      
      const updatedQuote = {
        ...existingQuote,
        ...quoteData,
      };
      
      await updateDoc(docRef, this.convertDatesToFirestore(updatedQuote));
      return updatedQuote;
    } catch (error) {
      console.error("Error updating quote:", error);
      throw error;
    }
  }

  async deleteQuote(id: number): Promise<boolean> {
    try {
      const q = query(collection(db, COLLECTIONS.QUOTES), where("id", "==", id));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return false;
      }
      
      await deleteDoc(querySnapshot.docs[0].ref);
      return true;
    } catch (error) {
      console.error("Error deleting quote:", error);
      return false;
    }
  }

  // Tip methods
  async getAllTips(): Promise<Tip[]> {
    return this.getAllDocuments<Tip>(COLLECTIONS.TIPS);
  }

  async getTipsByCategory(category: string): Promise<Tip[]> {
    try {
      const q = query(collection(db, COLLECTIONS.TIPS), where("category", "==", category));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => doc.data() as Tip);
    } catch (error) {
      console.error("Error getting tips by category:", error);
      return [];
    }
  }

  async createTip(tip: InsertTip): Promise<Tip> {
    try {
      const id = await this.getNextId(COLLECTIONS.TIPS);
      const addedDate = new Date();
      
      const newTip: Tip = { 
        ...tip, 
        id, 
        addedDate
      };
      
      await addDoc(collection(db, COLLECTIONS.TIPS), this.convertDatesToFirestore(newTip));
      return newTip;
    } catch (error) {
      console.error("Error creating tip:", error);
      throw error;
    }
  }

  async updateTip(id: number, tipData: Partial<InsertTip>): Promise<Tip | undefined> {
    try {
      const q = query(collection(db, COLLECTIONS.TIPS), where("id", "==", id));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return undefined;
      }
      
      const docRef = querySnapshot.docs[0].ref;
      const existingTip = querySnapshot.docs[0].data() as Tip;
      
      const updatedTip = {
        ...existingTip,
        ...tipData,
      };
      
      await updateDoc(docRef, this.convertDatesToFirestore(updatedTip));
      return updatedTip;
    } catch (error) {
      console.error("Error updating tip:", error);
      throw error;
    }
  }

  async deleteTip(id: number): Promise<boolean> {
    try {
      const q = query(collection(db, COLLECTIONS.TIPS), where("id", "==", id));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return false;
      }
      
      await deleteDoc(querySnapshot.docs[0].ref);
      return true;
    } catch (error) {
      console.error("Error deleting tip:", error);
      return false;
    }
  }

  // Media methods
  async getAllMedia(): Promise<Media[]> {
    return this.getAllDocuments<Media>(COLLECTIONS.MEDIA);
  }

  async getMediaByType(type: string): Promise<Media[]> {
    try {
      const q = query(collection(db, COLLECTIONS.MEDIA), where("type", "==", type));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => doc.data() as Media);
    } catch (error) {
      console.error("Error getting media by type:", error);
      return [];
    }
  }

  async getMediaById(id: number): Promise<Media | undefined> {
    return this.getDocumentById<Media>(COLLECTIONS.MEDIA, id);
  }

  async getFeaturedMedia(type: string): Promise<Media | undefined> {
    try {
      const q = query(
        collection(db, COLLECTIONS.MEDIA),
        where("type", "==", type),
        where("featured", "==", true),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // If no featured media, return any media of that type
        const fallbackQuery = query(
          collection(db, COLLECTIONS.MEDIA),
          where("type", "==", type),
          limit(1)
        );
        
        const fallbackSnapshot = await getDocs(fallbackQuery);
        
        if (fallbackSnapshot.empty) {
          return undefined;
        }
        
        return fallbackSnapshot.docs[0].data() as Media;
      }
      
      return querySnapshot.docs[0].data() as Media;
    } catch (error) {
      console.error(`Error getting featured media of type ${type}:`, error);
      return undefined;
    }
  }

  async createMedia(media: InsertMedia): Promise<Media> {
    try {
      const id = await this.getNextId(COLLECTIONS.MEDIA);
      const addedDate = new Date();
      
      // Ensure thumbnail is not undefined
      const thumbnail = media.thumbnail || '';
      
      const newMedia: Media = { 
        ...media, 
        id, 
        addedDate,
        featured: media.featured || false,
        thumbnail
      };
      
      await addDoc(collection(db, COLLECTIONS.MEDIA), this.convertDatesToFirestore(newMedia));
      return newMedia;
    } catch (error) {
      console.error("Error creating media:", error);
      throw error;
    }
  }

  async updateMedia(id: number, mediaData: Partial<InsertMedia>): Promise<Media | undefined> {
    try {
      const q = query(collection(db, COLLECTIONS.MEDIA), where("id", "==", id));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return undefined;
      }
      
      const docRef = querySnapshot.docs[0].ref;
      const existingMedia = querySnapshot.docs[0].data() as Media;
      
      const updatedMedia = {
        ...existingMedia,
        ...mediaData,
      };
      
      await updateDoc(docRef, this.convertDatesToFirestore(updatedMedia));
      return updatedMedia;
    } catch (error) {
      console.error("Error updating media:", error);
      throw error;
    }
  }

  async deleteMedia(id: number): Promise<boolean> {
    try {
      const q = query(collection(db, COLLECTIONS.MEDIA), where("id", "==", id));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return false;
      }
      
      await deleteDoc(querySnapshot.docs[0].ref);
      return true;
    } catch (error) {
      console.error("Error deleting media:", error);
      return false;
    }
  }

  // Contact Message methods
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    try {
      const id = await this.getNextId(COLLECTIONS.CONTACT_MESSAGES);
      const addedDate = new Date();
      
      const newMessage: ContactMessage = { 
        ...message, 
        id, 
        addedDate
      };
      
      await addDoc(collection(db, COLLECTIONS.CONTACT_MESSAGES), this.convertDatesToFirestore(newMessage));
      return newMessage;
    } catch (error) {
      console.error("Error creating contact message:", error);
      throw error;
    }
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.CONTACT_MESSAGES),
        orderBy("addedDate", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as ContactMessage);
    } catch (error) {
      console.error("Error getting all contact messages:", error);
      return [];
    }
  }

  // Subscriber methods
  async addSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    try {
      const id = await this.getNextId(COLLECTIONS.SUBSCRIBERS);
      const subscriptionDate = new Date();
      
      const newSubscriber: Subscriber = { 
        ...subscriber, 
        id, 
        subscriptionDate
      };
      
      await addDoc(collection(db, COLLECTIONS.SUBSCRIBERS), this.convertDatesToFirestore(newSubscriber));
      return newSubscriber;
    } catch (error) {
      console.error("Error adding subscriber:", error);
      throw error;
    }
  }

  async getAllSubscribers(): Promise<Subscriber[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.SUBSCRIBERS),
        orderBy("subscriptionDate", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as Subscriber);
    } catch (error) {
      console.error("Error getting all subscribers:", error);
      return [];
    }
  }

  // Challenge methods
  async getAllChallenges(): Promise<Challenge[]> {
    return this.getAllDocuments<Challenge>(COLLECTIONS.CHALLENGES);
  }

  async getChallengeById(id: number): Promise<Challenge | undefined> {
    return this.getDocumentById<Challenge>(COLLECTIONS.CHALLENGES, id);
  }

  async getChallengesByCategory(category: string): Promise<Challenge[]> {
    try {
      const q = query(collection(db, COLLECTIONS.CHALLENGES), where("category", "==", category));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => doc.data() as Challenge);
    } catch (error) {
      console.error("Error getting challenges by category:", error);
      return [];
    }
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    try {
      const id = await this.getNextId(COLLECTIONS.CHALLENGES);
      const addedDate = new Date();
      
      // Ensure steps is a proper string array
      const steps: string[] = this.ensureStringArray(challenge.steps);
      
      const newChallenge: Challenge = { 
        ...challenge, 
        steps,
        id, 
        addedDate
      };
      
      await addDoc(collection(db, COLLECTIONS.CHALLENGES), this.convertDatesToFirestore(newChallenge));
      return newChallenge;
    } catch (error) {
      console.error("Error creating challenge:", error);
      throw error;
    }
  }

  async updateChallenge(id: number, challengeData: Partial<InsertChallenge>): Promise<Challenge | undefined> {
    try {
      const q = query(collection(db, COLLECTIONS.CHALLENGES), where("id", "==", id));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return undefined;
      }
      
      const docRef = querySnapshot.docs[0].ref;
      const existingChallenge = querySnapshot.docs[0].data() as Challenge;
      
      // If steps are provided, ensure they're a proper string array
      if (challengeData.steps) {
        challengeData.steps = this.ensureStringArray(challengeData.steps);
      }
      
      // Create properly typed updated challenge
      const updatedChallenge: Challenge = {
        ...existingChallenge,
        ...challengeData,
        // Ensure steps is a string array
        steps: challengeData.steps ? this.ensureStringArray(challengeData.steps) : existingChallenge.steps
      };
      
      await updateDoc(docRef, this.convertDatesToFirestore(updatedChallenge));
      return updatedChallenge;
    } catch (error) {
      console.error("Error updating challenge:", error);
      throw error;
    }
  }

  async deleteChallenge(id: number): Promise<boolean> {
    try {
      const q = query(collection(db, COLLECTIONS.CHALLENGES), where("id", "==", id));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return false;
      }
      
      await deleteDoc(querySnapshot.docs[0].ref);
      return true;
    } catch (error) {
      console.error("Error deleting challenge:", error);
      return false;
    }
  }

  async generatePersonalizedChallenge(input: ChallengeInput): Promise<Challenge> {
    try {
      const id = await this.getNextId(COLLECTIONS.CHALLENGES);
      const addedDate = new Date();
      
      // Convert inputs to challenge steps
      const steps: string[] = [
        `Step 1: Set aside ${input.duration <= 7 ? '15' : input.duration <= 14 ? '30' : '60'} minutes each day for this challenge.`,
        `Step 2: Practice mindfulness related to ${input.category.toLowerCase()}.`,
        `Step 3: Focus on your goals: ${input.goals.join(', ')}.`,
        `Step 4: Explore your interests: ${input.interests.join(', ')}.`,
        `Step 5: Reflect on your progress and adjust as needed.`
      ];
      
      const personalizedChallenge: Challenge = {
        id,
        addedDate,
        title: `${input.category} Challenge`,
        description: `This challenge is designed to help you improve in ${input.category.toLowerCase()}.`,
        category: input.category,
        difficulty: input.difficulty,
        duration: input.duration,
        steps
      };
      
      await addDoc(collection(db, COLLECTIONS.CHALLENGES), this.convertDatesToFirestore(personalizedChallenge));
      return personalizedChallenge;
    } catch (error) {
      console.error("Error generating personalized challenge:", error);
      throw error;
    }
  }

  // Helper method to ensure an object is a proper string array
  private ensureStringArray(data: any): string[] {
    if (!data) return [];
    if (Array.isArray(data)) {
      return data.map(item => String(item));
    }
    // If it's an object with numeric keys, convert to array
    if (typeof data === 'object') {
      try {
        return Object.values(data).map(item => String(item));
      } catch (e) {
        console.error("Failed to convert object to array:", e);
        return [];
      }
    }
    return [];
  }

  // Helper method to convert Date objects to Firestore format for storage
  private convertDatesToFirestore(obj: any): any {
    const result: any = { ...obj };
    
    for (const key in result) {
      if (result[key] instanceof Date) {
        result[key] = Timestamp.fromDate(result[key]);
      } else if (key === 'steps' && result[key]) {
        // Ensure steps is always a proper array
        result[key] = this.ensureStringArray(result[key]);
      } else if (typeof result[key] === 'object' && result[key] !== null) {
        result[key] = this.convertDatesToFirestore(result[key]);
      }
    }
    
    return result;
  }
}