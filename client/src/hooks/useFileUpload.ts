import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

export interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  error?: string;
}

export function useFileUpload(options?: {
  acceptedTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
}) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const { acceptedTypes, maxFileSize = 52428800, maxFiles } = options || {};

  const addFiles = useCallback(
    (newFiles: File[]) => {
      // Check if adding these files would exceed maxFiles
      if (maxFiles && files.length + newFiles.length > maxFiles) {
        toast({
          title: "Too many files",
          description: `You can only upload a maximum of ${maxFiles} files`,
          variant: "destructive",
        });
        return;
      }

      // Validate file types if acceptedTypes is provided
      const validFiles = acceptedTypes
        ? newFiles.filter((file) => acceptedTypes.includes(file.type))
        : newFiles;

      if (validFiles.length !== newFiles.length) {
        toast({
          title: "Invalid file type",
          description: `Some files were not added because they are not supported`,
          variant: "destructive",
        });
      }

      // Validate file sizes
      const validSizeFiles = validFiles.filter(
        (file) => file.size <= maxFileSize
      );

      if (validSizeFiles.length !== validFiles.length) {
        toast({
          title: "File too large",
          description: `Some files were not added because they exceed the maximum size of ${Math.round(
            maxFileSize / (1024 * 1024)
          )}MB`,
          variant: "destructive",
        });
      }

      // Add files with progress information
      const filesToAdd = validSizeFiles.map((file) => ({
        id: uuidv4(),
        file,
        progress: 0,
      }));

      setFiles((prev) => [...prev, ...filesToAdd]);

      // Simulate upload progress for each file
      setIsUploading(true);
      const uploadPromises = filesToAdd.map((fileObj) => {
        return new Promise<void>((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);
              resolve();
            }

            setFiles((prevFiles) =>
              prevFiles.map((f) =>
                f.id === fileObj.id ? { ...f, progress } : f
              )
            );
          }, 300);
        });
      });

      Promise.all(uploadPromises).then(() => {
        setIsUploading(false);
      });

      return filesToAdd.length > 0;
    },
    [files.length, maxFiles, acceptedTypes, maxFileSize, toast]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  return {
    files,
    isUploading,
    addFiles,
    removeFile,
    clearFiles,
  };
}
