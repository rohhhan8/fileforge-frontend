import { db } from "./index";
import * as schema from "@shared/schema";

async function seed() {
  try {
    // Create a sample user
    const [user] = await db.insert(schema.users).values({
      username: "demo_user",
      password: "hashed_password_would_go_here", // In production, always hash passwords
    }).returning();
    
    // Insert sample conversion history
    await db.insert(schema.conversions).values([
      {
        filename: "Merged_Document.pdf",
        originalFilename: "multiple_files_merged.pdf",
        filesize: 8400000, // 8.2 MB in bytes
        conversionType: "PDF_MERGE",
        outputPath: "/uploads/conversions/Merged_Document.pdf",
        userId: user.id,
        metadata: {
          fileCount: 3,
          pageCount: 15
        }
      },
      {
        filename: "presentation_images.zip",
        originalFilename: "presentation.pdf",
        filesize: 12800000, // 12.5 MB in bytes
        conversionType: "PDF_TO_IMAGE",
        outputPath: "/uploads/conversions/presentation_images.zip",
        userId: user.id,
        metadata: {
          imageCount: 24,
          format: "png"
        }
      },
      {
        filename: "website_screenshots.pdf",
        originalFilename: "website_screenshots.pdf",
        filesize: 3900000, // 3.8 MB in bytes
        conversionType: "IMAGE_TO_PDF",
        outputPath: "/uploads/conversions/website_screenshots.pdf",
        userId: user.id,
        metadata: {
          imageCount: 8
        }
      }
    ]);
    
    console.log("Seed data inserted successfully");
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
}

seed(); 