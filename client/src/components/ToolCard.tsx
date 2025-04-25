import { Link } from "wouter";
import { 
  File, 
  Image, 
  Download, 
  ArrowRightIcon,
  Ticket,
  CropIcon,
  FileSignatureIcon
} from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: "pdf" | "image" | "export" | "exchange" | "crop" | "signature";
  color: "primary" | "secondary" | "accent";
  path: string;
  action: string;
}

const ToolCard = ({ title, description, icon, color, path, action }: ToolCardProps) => {
  const getIcon = () => {
    switch (icon) {
      case "pdf":
        return <File className={`text-2xl text-${color}`} />;
      case "image":
        return <Image className={`text-2xl text-${color}`} />;
      case "export":
        return <Download className={`text-2xl text-${color}`} />;
      case "exchange":
        return <Ticket className={`text-2xl text-${color}`} />;
      case "crop":
        return <CropIcon className={`text-2xl text-${color}`} />;
      case "signature":
        return <FileSignatureIcon className={`text-2xl text-${color}`} />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col">
      <div className={`bg-${color}/10 w-14 h-14 rounded-full flex items-center justify-center mb-4`}>
        {getIcon()}
      </div>
      <h3 className="text-xl font-bold font-inter mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 flex-grow">{description}</p>
      <Link href={path}>
        <a className={`text-${color} font-medium hover:underline inline-flex items-center`}>
          {action} <ArrowRightIcon className="ml-2 text-sm" />
        </a>
      </Link>
    </div>
  );
};

export default ToolCard;
