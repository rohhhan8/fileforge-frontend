import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import FileUploader from "@/components/FileUploader";
import UploadedFiles, { UploadedFile } from "@/components/UploadedFiles";
import ConvertOptions from "@/components/ConvertOptions";
import ProcessingStatus from "@/components/ProcessingStatus";
import ConversionSuccess from "@/components/ConversionSuccess";
import { PdfToImageOptions } from "@shared/schema";
import API_BASE_URL from "@/config/api";


const PdfToImage = () => {
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
    // Only accept one PDF file
    if (files.length > 0) {
      toast({
        title: "Only one file allowed",
        description: "Please remove the existing file before adding a new one",
        variant: "destructive",
      });
      return;
    }

    // Validate file types
    const validFiles = newFiles.filter(
      (file) => file.type === "application/pdf"
    );
    
    if (validFiles.length !== newFiles.length) {
      toast({
        title: "Invalid file type",
        description: "Only PDF files are accepted",
        variant: "destructive",
      });
    }

    // Only take the first file
    if (validFiles.length > 0) {
      const fileObj = {
        id: uuidv4(),
        file: validFiles[0],
        progress: 0,
      };

      setFiles([fileObj]);

      // Simulate upload progress
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
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  const handleConvert = async (options: PdfToImageOptions) => {
    if (files.length === 0) {
      toast({
        title: "No file selected",
        description: "Please add a PDF file to convert",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProcessProgress(0);

    // Simulate processing progress
    progressInterval.current = window.setInterval(() => {
      setProcessProgress((prev) => {
        const newProgress = prev + Math.random() * 3;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 300);

    try {
      // Create form data with file and options
      const formData = new FormData();
      formData.append("file", files[0].file);
      formData.append("options", JSON.stringify(options));

      // Send file to server
      const response = await fetch(`${API_BASE_URL}/api/pdf/pdf-to-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to convert PDF to images");
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
        description: error instanceof Error ? error.message : "Failed to convert PDF to images",
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
            <h2 className="text-3xl font-bold font-inter mb-4">PDF to Images</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Extract images from PDF files or convert PDF pages to JPG, PNG, or WebP formats.
            </p>
          </div>

          {!isProcessing && !conversionComplete && (
            <>
              <FileUploader
                onFilesAdded={handleFilesAdded}
                accept={{ "application/pdf": [".pdf"] }}
                instruction="Drop a PDF file here"
                maxFiles={1}
                subText="Maximum 1 file. Up to 50MB per file."
              />

              <UploadedFiles files={files} onRemove={handleRemoveFile} />

              {files.length > 0 && (
                <ConvertOptions
                  type="pdf-to-image"
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
          processingType="extract images from your PDF"
        />
      )}

      {conversionComplete && result && (
        <ConversionSuccess
          filename={result.filename}
          filesize={result.filesize}
          downloadUrl={result.downloadUrl}
          onStartNew={handleStartNew}
          conversionType="pdf-to-image"
        />
      )}
    </div>
  );
};

export default PdfToImage;
