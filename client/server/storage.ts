import { db } from "@db";
import { conversions } from "@shared/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

// Define storage service for conversion operations
export const storage = {
  // Save conversion record to database
  async saveConversion(data: {
    filename: string;
    originalFilename: string;
    filesize: number;
    conversionType: string;
    outputPath: string;
    userId?: number;
    metadata?: any;
  }) {
    const [conversion] = await db.insert(conversions).values(data).returning();
    return conversion;
  },

  // Get all conversions, optionally filtered by user
  async getConversions(userId?: number) {
    if (userId) {
      return db.query.conversions.findMany({
        where: eq(conversions.userId, userId),
        orderBy: (conversions, { desc }) => [desc(conversions.created_at)],
      });
    }
    
    return db.query.conversions.findMany({
      orderBy: (conversions, { desc }) => [desc(conversions.created_at)],
    });
  },

  // Get a specific conversion by ID
  async getConversionById(id: number) {
    return db.query.conversions.findFirst({
      where: eq(conversions.id, id),
    });
  },

  // Delete a conversion from the database and also delete the file
  async deleteConversion(id: number) {
    const [conversion] = await db.select().from(conversions).where(eq(conversions.id, id));
    
    if (!conversion) {
      throw new Error("Conversion not found");
    }
    
    // Delete file if it exists
    if (conversion.outputPath && fs.existsSync(conversion.outputPath)) {
      fs.unlinkSync(conversion.outputPath);
    }
    
    await db.delete(conversions).where(eq(conversions.id, id));
    
    return true;
  },

  // Helper to create output directory if it doesn't exist
  ensureOutputDirectory() {
    const outputDir = path.resolve(process.cwd(), "uploads/output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    return outputDir;
  }
};
