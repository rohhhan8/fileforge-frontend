import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

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

// File conversion records
export const conversions = pgTable("conversions", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalFilename: text("original_filename").notNull(),
  filesize: integer("filesize").notNull(),
  conversionType: text("conversion_type").notNull(), // PDF_MERGE, IMAGE_TO_PDF, PDF_TO_IMAGE, IMAGE_CONVERT
  outputPath: text("output_path").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  userId: integer("user_id").references(() => users.id),
  metadata: jsonb("metadata"), // Store additional conversion-specific metadata
});

export const conversionsRelations = relations(conversions, ({ one }) => ({
  user: one(users, {
    fields: [conversions.userId],
    references: [users.id],
  }),
}));

export const conversionInsertSchema = createInsertSchema(conversions, {
  filename: (schema) => schema.min(1, "Filename is required"),
  originalFilename: (schema) => schema.min(1, "Original filename is required"),
  filesize: (schema) => schema.min(0, "Filesize must be a positive number"),
  conversionType: (schema) => schema.min(1, "Conversion type is required"),
  outputPath: (schema) => schema.min(1, "Output path is required"),
});

export type ConversionInsert = z.infer<typeof conversionInsertSchema>;
export type Conversion = typeof conversions.$inferSelect;

// Strongly typed schemas for API requests
export const pdfMergeOptionsSchema = z.object({
  outputFilename: z.string().min(1, "Output filename is required"),
  addBookmarks: z.boolean().optional(),
  pageSize: z.string().optional(),
});

export const imageToPdfOptionsSchema = z.object({
  outputFilename: z.string().min(1, "Output filename is required"),
  pageSize: z.string().optional(),
  pageOrientation: z.enum(["portrait", "landscape"]).optional(),
  imageQuality: z.number().min(1).max(100).optional(),
});

export const pdfToImageOptionsSchema = z.object({
  outputFormat: z.enum(["jpg", "png", "webp"]),
  imageQuality: z.number().min(1).max(100).optional(),
  dpi: z.number().min(72).max(600).optional(),
});

export const imageConvertOptionsSchema = z.object({
  outputFormat: z.enum(["jpg", "png", "webp", "gif"]),
  quality: z.number().min(1).max(100).optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  maintainAspectRatio: z.boolean().optional(),
});

export type PdfMergeOptions = z.infer<typeof pdfMergeOptionsSchema>;
export type ImageToPdfOptions = z.infer<typeof imageToPdfOptionsSchema>;
export type PdfToImageOptions = z.infer<typeof pdfToImageOptionsSchema>;
export type ImageConvertOptions = z.infer<typeof imageConvertOptionsSchema>;
