import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import FileUploader from "@/components/FileUploader";
import UploadedFiles, { UploadedFile } from "@/components/UploadedFiles";
import ConvertOptions from "@/components/ConvertOptions";
import ProcessingStatus from "@/components/ProcessingStatus";
import ConversionSuccess from "@/components/ConversionSuccess";
import { ImageToPdfOptions } from "@shared/schema";

const ImageToPdf = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processProgress, setProcessProgress] = useState<number>(0);
  const [conversionComplete, setConversionComplete] = useState<boolean>(false);
  const [result, setResult] = useState<{
    filename: string;
    filesize: string;
    downloadUrl: string;
  } | null>(null);
  const progressInterval = useRef<number | null>(null);
  const { toast } = useToast();

  const handleFilesAdded = (newFiles: File[]) => {
    // Validate file types
    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const validFiles = newFiles.filter((file) =>
      validImageTypes.includes(file.type)
    );
    
    if (validFiles.length !== newFiles.length) {
      toast({
        title: "Invalid file type",
        description: "Only image files (JPG, PNG, GIF, WebP) are accepted",
        variant: "destructive",
      });
    }

    // Add files with progress information
    const filesToAdd = validFiles.map((file) => ({
      id: uuidv4(),
      file,
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...filesToAdd]);

    // Simulate upload progress
    filesToAdd.forEach((fileObj) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }

        setFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.id === fileObj.id ? { ...f, progress } : f
          )
        );
      }, 300);
    });
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  const handleConvert = async (options: ImageToPdfOptions) => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please add at least one image to convert",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProcessProgress(0);

    // Simulate processing progress
    progressInterval.current = window.setInterval(() => {
      setProcessProgress((prev) => {
        const newProgress = prev + Math.random() * 5;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 300);

    try {
      // Create form data with files and options
      const formData = new FormData();
      files.forEach((fileObj) => {
        formData.append("files", fileObj.file);
      });
      formData.append("options", JSON.stringify(options));

      // Send files to server
      const response = await fetch("/api/pdf/image-to-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to convert images to PDF");
      }

      const data = await response.json();

      // Wait for the progress to reach 100% for visual effect
      setTimeout(() => {
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
        setProcessProgress(100);
        
        setTimeout(() => {
          setIsProcessing(false);
          setConversionComplete(true);
          setResult({
            filename: data.filename,
            filesize: data.filesize,
            downloadUrl: data.downloadUrl,
          });
        }, 500);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to convert images to PDF",
        variant: "destructive",
      });
      
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    setIsProcessing(false);
  };

  const handleStartNew = () => {
    setFiles([]);
    setConversionComplete(false);
    setResult(null);
  };

  return (
    <div>
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-inter mb-4">Image to PDF</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Convert single or multiple images into a professional PDF document. Supports JPG, PNG, GIF, and WebP formats.
            </p>
          </div>

          {!isProcessing && !conversionComplete && (
            <>
              <FileUploader
                onFilesAdded={handleFilesAdded}
                accept={{
                  "image/jpeg": [".jpg", ".jpeg"],
                  "image/png": [".png"],
                  "image/gif": [".gif"],
                  "image/webp": [".webp"],
                }}
                instruction="Drop image files here"
              />

              <UploadedFiles files={files} onRemove={handleRemoveFile} />

              {files.length > 0 && (
                <ConvertOptions
                  type="image-to-pdf"
                  onSubmit={handleConvert}
                  isProcessing={false}
                  isDisabled={files.length === 0}
                />
              )}
            </>
          )}
        </div>
      </section>

      {isProcessing && (
        <ProcessingStatus
          progress={processProgress}
          onCancel={handleCancel}
          processingType="convert your images to PDF"
        />
      )}

      {conversionComplete && result && (
        <ConversionSuccess
          filename={result.filename}
          filesize={result.filesize}
          downloadUrl={result.downloadUrl}
          onStartNew={handleStartNew}
          conversionType="image-to-pdf"
        />
      )}
    </div>
  );
};

export default ImageToPdf;
