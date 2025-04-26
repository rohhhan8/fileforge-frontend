import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import FileUploader from "@/components/FileUploader";
import UploadedFiles, { UploadedFile } from "@/components/UploadedFiles";
import ConvertOptions from "@/components/ConvertOptions";
import ProcessingStatus from "@/components/ProcessingStatus";
import ConversionSuccess from "@/components/ConversionSuccess";
import { PdfMergeOptions } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import API_BASE_URL from "@/config/api";

const PdfMerger = () => {
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

  const handleConvert = async (options: PdfMergeOptions) => {
    if (files.length < 2) {
      toast({
        title: "Not enough files",
        description: "Please add at least 2 PDF files to merge",
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
      files.forEach((fileObj, index) => {
        formData.append("files", fileObj.file);
      });
      formData.append("options", JSON.stringify(options));

      // Send files to server
      const response = await fetch(`${API_BASE_URL}/api/pdf/merge`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to merge PDFs");
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
        description: error instanceof Error ? error.message : "Failed to merge PDFs",
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
            <h2 className="text-3xl font-bold font-inter mb-4">PDF Merger</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Combine multiple PDF files into a single document. Select files in the order you want them to appear.
            </p>
          </div>

          {!isProcessing && !conversionComplete && (
            <>
              <FileUploader
                onFilesAdded={handleFilesAdded}
                accept={{ "application/pdf": [".pdf"] }}
                instruction="Drop PDF files here"
              />

              <UploadedFiles files={files} onRemove={handleRemoveFile} />

              {files.length > 0 && (
                <ConvertOptions
                  type="pdf-merge"
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
          processingType="merge your PDF documents"
        />
      )}

      {conversionComplete && result && (
        <ConversionSuccess
          filename={result.filename}
          filesize={result.filesize}
          downloadUrl={result.downloadUrl}
          onStartNew={handleStartNew}
          conversionType="pdf-merge"
        />
      )}
    </div>
  );
};

export default PdfMerger;
