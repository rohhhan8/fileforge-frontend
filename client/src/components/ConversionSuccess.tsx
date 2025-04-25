import { CheckCircle, Download, RefreshCw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileText } from "lucide-react";

interface ConversionSuccessProps {
  filename: string;
  filesize: string;
  downloadUrl: string;
  onStartNew: () => void;
  conversionType: string;
}

const ConversionSuccess = ({
  filename,
  filesize,
  downloadUrl,
  onStartNew,
  conversionType,
}: ConversionSuccessProps) => {
  const { toast } = useToast();
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'FileForge - Converted File',
        text: `Check out my converted file: ${filename}`,
        url: window.location.href,
      })
      .catch((error) => {
        toast({
          title: "Could not share",
          description: "There was a problem sharing this file.",
          variant: "destructive",
        });
      });
    } else {
      // Copy to clipboard instead
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "You can now paste and share it.",
      });
    }
  };

  return (
    <section className="py-10 bg-background">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <div className="inline-block rounded-full bg-success/10 p-4 mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-xl font-bold font-inter">Conversion Complete!</h3>
            <p className="text-gray-600 mt-2">
              {conversionType === "pdf-merge"
                ? "Your files have been successfully merged into a single PDF document."
                : conversionType === "image-to-pdf"
                ? "Your images have been successfully converted to a PDF document."
                : conversionType === "pdf-to-image"
                ? "Your PDF has been successfully converted to images."
                : "Your images have been successfully converted to the requested format."}
            </p>
          </div>

          <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="font-medium">{filename}</p>
                <p className="text-sm text-gray-500">{filesize} • Created just now</p>
              </div>
            </div>
            <a 
              href={downloadUrl}
              download={filename}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="px-4 py-2 bg-primary hover:bg-blue-700 text-white">
                <Download className="h-4 w-4 mr-1" /> Download
              </Button>
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center space-x-4">
            <Button
              onClick={onStartNew}
              variant="ghost"
              className="text-primary hover:text-primary/80"
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Convert Another File
            </Button>
            <Button
              onClick={handleShare}
              variant="ghost"
              className="text-gray-500 hover:text-gray-700"
            >
              <Share2 className="h-4 w-4 mr-1" /> Share Result
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConversionSuccess;
