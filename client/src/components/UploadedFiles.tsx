import { X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  error?: string;
}

interface UploadedFilesProps {
  files: UploadedFile[];
  onRemove: (id: string) => void;
}

const UploadedFiles = ({ files, onRemove }: UploadedFilesProps) => {
  if (files.length === 0) {
    return null;
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold font-inter mb-4">Uploaded Files</h3>
      <div className="space-y-3">
        {files.map((file) => (
          <div
            key={file.id}
            className={`bg-white rounded-lg border ${
              file.error ? "border-error" : "border-gray-200"
            } p-4 flex items-center`}
          >
            <div className="mr-3">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between">
                <p className="font-medium truncate pr-4">{file.file.name}</p>
                <span className="text-sm text-gray-500">
                  {formatFileSize(file.file.size)}
                </span>
              </div>
              {file.error ? (
                <p className="text-sm text-error mt-1">{file.error}</p>
              ) : (
                <Progress
                  value={file.progress}
                  className="h-1.5 mt-2"
                  indicatorClassName={
                    file.progress === 100 ? "bg-success" : "bg-secondary"
                  }
                />
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-4 text-gray-400 hover:text-error"
              onClick={() => onRemove(file.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadedFiles;
