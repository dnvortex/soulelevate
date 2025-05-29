import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table (existing)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Quotes Table
export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  author: text("author").notNull(),
  featured: boolean("featured").default(false),
  addedDate: timestamp("added_date").defaultNow(),
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  addedDate: true,
});

export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;

// Tips Table
export const tips = pgTable("tips", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // ["Productivity", "Mindset", "Health", "Success"]
  addedDate: timestamp("added_date").defaultNow(),
});

export const insertTipSchema = createInsertSchema(tips).omit({
  id: true,
  addedDate: true,
});

export type InsertTip = z.infer<typeof insertTipSchema>;
export type Tip = typeof tips.$inferSelect;

// Media (Videos & Audio) Table
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // ["video", "audio"]
  url: text("url").notNull(),
  duration: text("duration").notNull(), // Stored as "MM:SS" format for display
  durationSeconds: integer("duration_seconds").notNull(), // Actual duration in seconds
  thumbnail: text("thumbnail").notNull().default(""),
  featured: boolean("featured").default(false),
  category: text("category").notNull(),
  addedDate: timestamp("added_date").defaultNow(),
});

export const insertMediaSchema = createInsertSchema(media).omit({
  id: true,
  addedDate: true,
});

export type InsertMedia = z.infer<typeof insertMediaSchema>;
export type Media = typeof media.$inferSelect;

// Contact Message Table
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  addedDate: timestamp("added_date").defaultNow(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  addedDate: true,
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

// Newsletter Subscribers Table
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  subscriptionDate: timestamp("subscription_date").defaultNow(),
});

export const insertSubscriberSchema = createInsertSchema(subscribers).omit({
  id: true,
  subscriptionDate: true,
});

export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Subscriber = typeof subscribers.$inferSelect;

// Personal Challenge Table
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // ["Productivity", "Mindset", "Health", "Success"]
  difficulty: text("difficulty").notNull(), // ["Easy", "Medium", "Hard"]
  duration: integer("duration").notNull(), // Number of days
  steps: json("steps").notNull().$type<string[]>(), // Array of step descriptions
  addedDate: timestamp("added_date").defaultNow(),
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
  addedDate: true,
});

export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;

// User challenge input for generating personalized challenges
export const challengeInputSchema = z.object({
  interests: z.array(z.string()).min(1, "At least one interest is required"),
  goals: z.array(z.string()).min(1, "At least one goal is required"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  duration: z.number().min(1).max(30),
  category: z.enum(["Productivity", "Mindset", "Health", "Success"]),
});

export type ChallengeInput = z.infer<typeof challengeInputSchema>;
