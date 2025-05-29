import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { supabase } from "./supabase";
import { registerUploadRoutes } from "./uploads";
import { 
  insertQuoteSchema, 
  insertTipSchema, 
  insertMediaSchema, 
  insertContactMessageSchema, 
  insertSubscriberSchema,
  insertChallengeSchema,
  challengeInputSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import multer from "multer";

// Configure multer for file uploads (in-memory storage)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // Register file upload routes for Cloudinary
  registerUploadRoutes(app);

  // API Routes - prefix all with /api
  
  // Quotes API
  app.get("/api/quotes", async (req: Request, res: Response) => {
    try {
      const quotes = await storage.getAllQuotes();
      res.json(quotes);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      res.status(500).json({ message: "Failed to fetch quotes" });
    }
  });
  
  app.get("/api/quotes/featured", async (req: Request, res: Response) => {
    try {
      const quote = await storage.getFeaturedQuote();
      if (!quote) {
        return res.status(404).json({ message: "No featured quote found" });
      }
      res.json(quote);
    } catch (error) {
      console.error("Error fetching featured quote:", error);
      res.status(500).json({ message: "Failed to fetch featured quote" });
    }
  });
  
  app.get("/api/quotes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid quote ID" });
      }
      
      const quote = await storage.getQuoteById(id);
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      res.json(quote);
    } catch (error) {
      console.error("Error fetching quote:", error);
      res.status(500).json({ message: "Failed to fetch quote" });
    }
  });
  
  app.post("/api/quotes", async (req: Request, res: Response) => {
    try {
      const quoteData = insertQuoteSchema.parse(req.body);
      const quote = await storage.createQuote(quoteData);
      res.status(201).json(quote);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating quote:", error);
      res.status(500).json({ message: "Failed to create quote" });
    }
  });
  
  app.put("/api/quotes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid quote ID" });
      }
      
      const quoteData = insertQuoteSchema.partial().parse(req.body);
      const updatedQuote = await storage.updateQuote(id, quoteData);
      
      if (!updatedQuote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      res.json(updatedQuote);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error updating quote:", error);
      res.status(500).json({ message: "Failed to update quote" });
    }
  });
  
  app.delete("/api/quotes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid quote ID" });
      }
      
      const success = await storage.deleteQuote(id);
      if (!success) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting quote:", error);
      res.status(500).json({ message: "Failed to delete quote" });
    }
  });
  
  // Tips API
  app.get("/api/tips", async (req: Request, res: Response) => {
    try {
      const { category } = req.query;
      
      if (category && typeof category === 'string') {
        const tips = await storage.getTipsByCategory(category);
        return res.json(tips);
      }
      
      const tips = await storage.getAllTips();
      res.json(tips);
    } catch (error) {
      console.error("Error fetching tips:", error);
      res.status(500).json({ message: "Failed to fetch tips" });
    }
  });
  
  app.post("/api/tips", async (req: Request, res: Response) => {
    try {
      const tipData = insertTipSchema.parse(req.body);
      const tip = await storage.createTip(tipData);
      res.status(201).json(tip);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating tip:", error);
      res.status(500).json({ message: "Failed to create tip" });
    }
  });
  
  app.put("/api/tips/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tip ID" });
      }
      
      const tipData = insertTipSchema.partial().parse(req.body);
      const updatedTip = await storage.updateTip(id, tipData);
      
      if (!updatedTip) {
        return res.status(404).json({ message: "Tip not found" });
      }
      
      res.json(updatedTip);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error updating tip:", error);
      res.status(500).json({ message: "Failed to update tip" });
    }
  });
  
  app.delete("/api/tips/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tip ID" });
      }
      
      const success = await storage.deleteTip(id);
      if (!success) {
        return res.status(404).json({ message: "Tip not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting tip:", error);
      res.status(500).json({ message: "Failed to delete tip" });
    }
  });
  
  // Media API
  app.get("/api/media", async (req: Request, res: Response) => {
    try {
      const { type } = req.query;
      
      if (type && typeof type === 'string') {
        const mediaItems = await storage.getMediaByType(type);
        return res.json(mediaItems);
      }
      
      const mediaItems = await storage.getAllMedia();
      res.json(mediaItems);
    } catch (error) {
      console.error("Error fetching media:", error);
      res.status(500).json({ message: "Failed to fetch media" });
    }
  });
  
  app.get("/api/media/featured/:type", async (req: Request, res: Response) => {
    try {
      const { type } = req.params;
      const media = await storage.getFeaturedMedia(type);
      
      if (!media) {
        return res.status(404).json({ message: `No featured ${type} found` });
      }
      
      res.json(media);
    } catch (error) {
      console.error("Error fetching featured media:", error);
      res.status(500).json({ message: "Failed to fetch featured media" });
    }
  });
  
  app.get("/api/media/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid media ID" });
      }
      
      const media = await storage.getMediaById(id);
      if (!media) {
        return res.status(404).json({ message: "Media not found" });
      }
      
      res.json(media);
    } catch (error) {
      console.error("Error fetching media:", error);
      res.status(500).json({ message: "Failed to fetch media" });
    }
  });
  
  app.post("/api/media", async (req: Request, res: Response) => {
    try {
      const mediaData = insertMediaSchema.parse(req.body);
      const media = await storage.createMedia(mediaData);
      res.status(201).json(media);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating media:", error);
      res.status(500).json({ message: "Failed to create media" });
    }
  });
  
  app.put("/api/media/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid media ID" });
      }
      
      const mediaData = insertMediaSchema.partial().parse(req.body);
      const updatedMedia = await storage.updateMedia(id, mediaData);
      
      if (!updatedMedia) {
        return res.status(404).json({ message: "Media not found" });
      }
      
      res.json(updatedMedia);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error updating media:", error);
      res.status(500).json({ message: "Failed to update media" });
    }
  });
  
  app.delete("/api/media/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid media ID" });
      }
      
      const success = await storage.deleteMedia(id);
      if (!success) {
        return res.status(404).json({ message: "Media not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting media:", error);
      res.status(500).json({ message: "Failed to delete media" });
    }
  });
  
  // Contact API
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(messageData);
      res.status(201).json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error sending contact message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });
  
  // Newsletter API
  app.post("/api/subscribe", async (req: Request, res: Response) => {
    try {
      const subscriberData = insertSubscriberSchema.parse(req.body);
      const subscriber = await storage.addSubscriber(subscriberData);
      res.status(201).json({ success: true, message: "Subscribed successfully" });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ message: "Failed to subscribe" });
    }
  });

  // Challenges API
  app.get("/api/challenges", async (req: Request, res: Response) => {
    try {
      const { category } = req.query;
      
      if (category && typeof category === 'string') {
        const challenges = await storage.getChallengesByCategory(category);
        return res.json(challenges);
      }
      
      const challenges = await storage.getAllChallenges();
      res.json(challenges);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });
  
  app.get("/api/challenges/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid challenge ID" });
      }
      
      const challenge = await storage.getChallengeById(id);
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      res.json(challenge);
    } catch (error) {
      console.error("Error fetching challenge:", error);
      res.status(500).json({ message: "Failed to fetch challenge" });
    }
  });
  
  app.post("/api/challenges", async (req: Request, res: Response) => {
    try {
      const challengeData = insertChallengeSchema.parse(req.body);
      const challenge = await storage.createChallenge(challengeData);
      res.status(201).json(challenge);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating challenge:", error);
      res.status(500).json({ message: "Failed to create challenge" });
    }
  });
  
  app.put("/api/challenges/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid challenge ID" });
      }
      
      const challengeData = insertChallengeSchema.partial().parse(req.body);
      const updatedChallenge = await storage.updateChallenge(id, challengeData);
      
      if (!updatedChallenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      res.json(updatedChallenge);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error updating challenge:", error);
      res.status(500).json({ message: "Failed to update challenge" });
    }
  });
  
  app.delete("/api/challenges/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid challenge ID" });
      }
      
      const success = await storage.deleteChallenge(id);
      if (!success) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting challenge:", error);
      res.status(500).json({ message: "Failed to delete challenge" });
    }
  });
  
  // Personal Challenge Generator API
  app.post("/api/challenges/generate", async (req: Request, res: Response) => {
    try {
      const generatorInput = challengeInputSchema.parse(req.body);
      const generatedChallenge = await storage.generatePersonalizedChallenge(generatorInput);
      res.status(201).json(generatedChallenge);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error generating challenge:", error);
      res.status(500).json({ message: "Failed to generate challenge" });
    }
  });

  // Supabase test endpoint
  app.get("/api/supabase-test", async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabase.from('quotes').select('*').limit(5);
      
      if (error) {
        console.error("Supabase error:", error);
        return res.status(500).json({ message: "Supabase error", error: error.message });
      }
      
      res.json({ success: true, message: "Supabase connection successful", data });
    } catch (error) {
      console.error("Error connecting to Supabase:", error);
      res.status(500).json({ message: "Failed to connect to Supabase" });
    }
  });

  return httpServer;
}
