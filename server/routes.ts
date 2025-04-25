import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileConverter } from "./utils/fileConverter";
import {
  pdfMergeOptionsSchema,
  imageToPdfOptionsSchema,
  pdfToImageOptionsSchema,
  imageConvertOptionsSchema
} from "@shared/schema";
import { z } from "zod";
import { db } from "@db";
import { conversions } from "@shared/schema";
import { eq } from "drizzle-orm";

// Configure multer for file uploads
const uploadsDir = path.resolve(process.cwd(), "uploads");
const outputDir = path.resolve(process.cwd(), "uploads/output");

// Create directories if they don't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create a unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  } 
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up API prefix
  const apiPrefix = "/api";
  
  // PDF merging endpoint
  app.post(`${apiPrefix}/pdf/merge`, upload.array("files"), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length < 2) {
        return res.status(400).json({ error: "At least 2 PDF files are required" });
      }
      
      let options;
      try {
        options = JSON.parse(req.body.options);
        pdfMergeOptionsSchema.parse(options);
      } catch (error) {
        return res.status(400).json({ error: "Invalid options format" });
      }
      
      // Get file paths
      const filePaths = files.map(file => file.path);
      
      // Merge PDFs
      const result = await fileConverter.mergePdfs(filePaths, options);
      
      // Create database record
      const [conversion] = await db.insert(conversions).values({
        filename: result.filename,
        originalFilename: files.map(f => f.originalname).join(", "),
        filesize: result.filesize,
        conversionType: "PDF_MERGE",
        outputPath: result.outputPath,
        metadata: {
          fileCount: files.length,
          options
        }
      }).returning();
      
      // Send response
      res.json({
        filename: result.filename,
        filesize: `${(result.filesize / (1024 * 1024)).toFixed(1)} MB`,
        downloadUrl: `${apiPrefix}/download?path=${encodeURIComponent(result.outputPath)}&filename=${encodeURIComponent(result.filename)}`
      });
      
      // Clean up uploaded files
      setTimeout(() => {
        files.forEach(file => {
          fs.unlink(file.path, () => {});
        });
      }, 3600000); // Delete after 1 hour
      
    } catch (error) {
      console.error("Error merging PDFs:", error);
      res.status(500).json({ error: "Failed to merge PDFs" });
    }
  });
  
  // Image to PDF endpoint
  app.post(`${apiPrefix}/pdf/image-to-pdf`, upload.array("files"), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "At least one image file is required" });
      }
      
      let options;
      try {
        options = JSON.parse(req.body.options);
        imageToPdfOptionsSchema.parse(options);
      } catch (error) {
        return res.status(400).json({ error: "Invalid options format" });
      }
      
      // Get file paths
      const filePaths = files.map(file => file.path);
      
      // Convert images to PDF
      const result = await fileConverter.imagesToPdf(filePaths, options);
      
      // Create database record
      const [conversion] = await db.insert(conversions).values({
        filename: result.filename,
        originalFilename: files.map(f => f.originalname).join(", "),
        filesize: result.filesize,
        conversionType: "IMAGE_TO_PDF",
        outputPath: result.outputPath,
        metadata: {
          imageCount: files.length,
          options
        }
      }).returning();
      
      // Send response
      res.json({
        filename: result.filename,
        filesize: `${(result.filesize / (1024 * 1024)).toFixed(1)} MB`,
        downloadUrl: `${apiPrefix}/download?path=${encodeURIComponent(result.outputPath)}&filename=${encodeURIComponent(result.filename)}`
      });
      
      // Clean up uploaded files
      setTimeout(() => {
        files.forEach(file => {
          fs.unlink(file.path, () => {});
        });
      }, 3600000); // Delete after 1 hour
      
    } catch (error) {
      console.error("Error converting images to PDF:", error);
      res.status(500).json({ error: "Failed to convert images to PDF" });
    }
  });
  
  // PDF to image endpoint
  app.post(`${apiPrefix}/pdf/pdf-to-image`, upload.single("file"), async (req, res) => {
    try {
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ error: "A PDF file is required" });
      }
      
      let options;
      try {
        options = JSON.parse(req.body.options);
        pdfToImageOptionsSchema.parse(options);
      } catch (error) {
        return res.status(400).json({ error: "Invalid options format" });
      }
      
      // Convert PDF to images
      const result = await fileConverter.pdfToImages(file.path, options);
      
      // Create database record
      const [conversion] = await db.insert(conversions).values({
        filename: result.filename,
        originalFilename: file.originalname,
        filesize: result.filesize,
        conversionType: "PDF_TO_IMAGE",
        outputPath: result.outputPath,
        metadata: {
          pageCount: result.pageCount,
          format: options.outputFormat,
          options
        }
      }).returning();
      
      // Send response
      res.json({
        filename: result.filename,
        filesize: `${(result.filesize / (1024 * 1024)).toFixed(1)} MB`,
        downloadUrl: `${apiPrefix}/download?path=${encodeURIComponent(result.outputPath)}&filename=${encodeURIComponent(result.filename)}`
      });
      
      // Clean up uploaded file
      setTimeout(() => {
        fs.unlink(file.path, () => {});
      }, 3600000); // Delete after 1 hour
      
    } catch (error) {
      console.error("Error converting PDF to images:", error);
      res.status(500).json({ error: "Failed to convert PDF to images" });
    }
  });
  
  // Image conversion endpoint
  app.post(`${apiPrefix}/images/convert`, upload.array("files"), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "At least one image file is required" });
      }
      
      let options;
      try {
        options = JSON.parse(req.body.options);
        imageConvertOptionsSchema.parse(options);
      } catch (error) {
        return res.status(400).json({ error: "Invalid options format" });
      }
      
      // Get file paths
      const filePaths = files.map(file => file.path);
      
      // Convert images
      const result = await fileConverter.convertImages(filePaths, options);
      
      // Create database record
      const [conversion] = await db.insert(conversions).values({
        filename: result.filename,
        originalFilename: files.map(f => f.originalname).join(", "),
        filesize: result.filesize,
        conversionType: "IMAGE_CONVERT",
        outputPath: result.outputPath,
        metadata: {
          imageCount: files.length,
          format: options.outputFormat,
          options
        }
      }).returning();
      
      // Send response
      res.json({
        filename: result.filename,
        filesize: `${(result.filesize / (1024 * 1024)).toFixed(1)} MB`,
        downloadUrl: `${apiPrefix}/download?path=${encodeURIComponent(result.outputPath)}&filename=${encodeURIComponent(result.filename)}`
      });
      
      // Clean up uploaded files
      setTimeout(() => {
        files.forEach(file => {
          fs.unlink(file.path, () => {});
        });
      }, 3600000); // Delete after 1 hour
      
    } catch (error) {
      console.error("Error converting images:", error);
      res.status(500).json({ error: "Failed to convert images" });
    }
  });
  
  // Download endpoint
  app.get(`${apiPrefix}/download`, (req, res) => {
    const { path: filePath, filename } = req.query;
    
    if (!filePath || !filename || typeof filePath !== 'string' || typeof filename !== 'string') {
      return res.status(400).json({ error: "Invalid request parameters" });
    }
    
    // Validate path to prevent directory traversal
    const fullPath = path.resolve(process.cwd(), filePath);
    if (!fullPath.startsWith(process.cwd())) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: "File not found" });
    }
    
    // Set headers and send file
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    const fileStream = fs.createReadStream(fullPath);
    fileStream.pipe(res);
  });
  
  // Get conversion history
  app.get(`${apiPrefix}/conversions`, async (req, res) => {
    try {
      const conversionsData = await db.query.conversions.findMany({
        orderBy: (conversions, { desc }) => [desc(conversions.created_at)],
        limit: 50,
      });
      
      res.json(conversionsData);
    } catch (error) {
      console.error("Error fetching conversions:", error);
      res.status(500).json({ error: "Failed to fetch conversion history" });
    }
  });
  
  // Delete conversion
  app.delete(`${apiPrefix}/conversions/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid conversion ID" });
      }
      
      // Get the conversion to get the file path
      const [conversion] = await db.select().from(conversions).where(eq(conversions.id, id));
      
      if (!conversion) {
        return res.status(404).json({ error: "Conversion not found" });
      }
      
      // Delete the file if it exists
      if (conversion.outputPath && fs.existsSync(conversion.outputPath)) {
        fs.unlinkSync(conversion.outputPath);
      }
      
      // Delete the record
      await db.delete(conversions).where(eq(conversions.id, id));
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting conversion:", error);
      res.status(500).json({ error: "Failed to delete conversion" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
