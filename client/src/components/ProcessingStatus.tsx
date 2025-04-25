import { Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ProcessingStatusProps {
  progress: number;
  onCancel: () => void;
  processingType: string;
}

const ProcessingStatus = ({ progress, onCancel, processingType }: ProcessingStatusProps) => {
  const getEstimatedTime = (progress: number) => {
    if (progress > 90) return "a few seconds";
    if (progress > 70) return "~10 seconds";
    if (progress > 40) return "~15 seconds";
    return "~30 seconds";
  };

  return (
    <section className="py-10 bg-background">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <div className="inline-block rounded-full bg-primary/10 p-4 mb-4">
              <Cog className="h-8 w-8 text-primary animate-spin" />
            </div>
            <h3 className="text-xl font-bold font-inter">Processing Your Files</h3>
            <p className="text-gray-600 mt-2">
              Please wait while we {processingType}...
            </p>
          </div>

          <Progress
            value={progress}
            className="h-2.5 mb-4"
            indicatorClassName="bg-primary"
          />
          <p className="text-center text-sm text-gray-500">
            Estimated time remaining: {getEstimatedTime(progress)}
          </p>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <Button
              onClick={onCancel}
              variant="ghost"
              className="text-gray-500 hover:text-error"
            >
              Cancel Process
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessingStatus;
