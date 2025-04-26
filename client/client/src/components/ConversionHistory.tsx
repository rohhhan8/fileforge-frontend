import { useQuery } from "@tanstack/react-query";
import { Conversion } from "@shared/schema";
import { Link } from "wouter";
import { 
  Download, 
  Trash2, 
  ChevronRight, 
  File, 
  FileImage, 
  FileText 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ConversionHistoryProps {
  limit?: number;
  showViewAll?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Today, ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  } else if (diffDays === 1) {
    return `Yesterday, ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }
}

function getFileIcon(conversionType: string) {
  switch (conversionType) {
    case 'PDF_MERGE':
    case 'IMAGE_TO_PDF':
      return <File className="text-gray-400" />;
    case 'PDF_TO_IMAGE':
    case 'IMAGE_CONVERT':
      return <FileImage className="text-gray-400" />;
    default:
      return <FileText className="text-gray-400" />;
  }
}

function getConversionTypeLabel(conversionType: string) {
  switch (conversionType) {
    case 'PDF_MERGE':
      return 'PDF Merger';
    case 'IMAGE_TO_PDF':
      return 'Images to PDF';
    case 'PDF_TO_IMAGE':
      return 'PDF to Images';
    case 'IMAGE_CONVERT':
      return 'Image Converter';
    default:
      return 'File Conversion';
  }
}

const ConversionHistory = ({ limit, showViewAll = true }: ConversionHistoryProps) => {
  const { toast } = useToast();
  
  const { data: conversions, isLoading, isError } = useQuery<Conversion[]>({
    queryKey: ['/api/conversions'],
  });

  const handleDownload = (outputPath: string, filename: string) => {
    window.open(`/api/download?path=${encodeURIComponent(outputPath)}&filename=${encodeURIComponent(filename)}`, '_blank');
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/conversions/${id}`, {
        method: 'DELETE',
      });
      // Invalidate cache
      toast({
        title: "Conversion deleted",
        description: "The conversion has been removed from your history."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete conversion."
      });
    }
  };

  const viewAllLink = showViewAll && (
    <Link 
      href="/history"
      className="text-primary hover:text-primary/80 font-medium flex items-center"
    >
      View All <ChevronRight className="ml-1 h-4 w-4" />
    </Link>
  );

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold font-inter">Recent Conversions</h2>
            {viewAllLink}
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden p-8 text-center">
            <p>Loading conversion history...</p>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold font-inter">Recent Conversions</h2>
            {viewAllLink}
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden p-8 text-center">
            <p className="text-error">Error loading conversion history. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  const displayConversions = limit ? conversions.slice(0, limit) : conversions;

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold font-inter">Recent Conversions</h2>
          {showViewAll && displayConversions.length > 0 && viewAllLink}
        </div>

        {displayConversions.length === 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden p-8 text-center">
            <p>No conversion history found. Convert some files to see them here!</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayConversions.map((conversion) => (
                    <tr key={conversion.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getFileIcon(conversion.conversionType)}
                          <span className="text-sm font-medium text-gray-900 ml-3">
                            {conversion.filename}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getConversionTypeLabel(conversion.conversionType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatFileSize(conversion.filesize)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(conversion.created_at.toString())}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-primary hover:text-primary/80 mr-3"
                          onClick={() => handleDownload(conversion.outputPath, conversion.filename)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => handleDelete(conversion.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ConversionHistory;