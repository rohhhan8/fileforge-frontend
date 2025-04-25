import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { CloudUpload } from "lucide-react";

interface FileUploaderProps {
  onFilesAdded: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  instruction?: string;
  subText?: string;
}

const FileUploader = ({
  onFilesAdded,
  accept,
  maxFiles = 20,
  maxSize = 52428800, // 50MB default
  instruction = "Drop files here",
  subText = "Maximum 20 files. Up to 50MB per file.",
}: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesAdded(acceptedFiles);
    },
    [onFilesAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 bg-gray-50 text-center transition-colors ${
        isDragActive ? "border-primary" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      <CloudUpload className="h-12 w-12 text-primary mx-auto mb-4" />
      <h3 className="text-xl font-medium font-inter mb-2">{instruction}</h3>
      <p className="text-gray-500 mb-6">or</p>
      <Button className="px-6 py-3 bg-primary hover:bg-blue-700">Browse Files</Button>
      <p className="text-sm text-gray-500 mt-4">{subText}</p>
    </div>
  );
};

export default FileUploader;
