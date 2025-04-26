import Hero from "@/components/Hero";
import ToolCard from "@/components/ToolCard";
import FeatureSection from "@/components/FeatureSection";
import ConversionHistory from "@/components/ConversionHistory";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Home = () => {
  const tools = [
    {
      title: "PDF Merger",
      description: "Combine multiple PDF files into a single document quickly and easily.",
      icon: "pdf" as const,
      color: "primary" as const,
      path: "/pdf-merger",
      action: "Start merging",
    },
    {
      title: "Image to PDF",
      description: "Convert single or multiple images into a professional PDF document.",
      icon: "image" as const,
      color: "secondary" as const,
      path: "/image-to-pdf",
      action: "Start converting",
    },
    {
      title: "PDF to Images",
      description: "Extract images from PDF files or convert PDF pages to image formats.",
      icon: "export" as const,
      color: "accent" as const,
      path: "/pdf-to-image",
      action: "Start extracting",
    },
    {
      title: "Image Converter",
      description: "Convert images between formats like JPG, PNG, WebP, GIF and more.",
      icon: "exchange" as const,
      color: "primary" as const,
      path: "/image-converter",
      action: "Start converting",
    },
    {
      title: "PDF Compressor",
      description: "Reduce PDF file size while maintaining quality for easier sharing.",
      icon: "crop" as const,
      color: "secondary" as const,
      path: "#", // Not implemented yet
      action: "Start compressing",
    },
    {
      title: "PDF Editor",
      description: "Edit PDF content, add text, images, or annotations to existing documents.",
      icon: "signature" as const,
      color: "accent" as const,
      path: "#", // Not implemented yet
      action: "Start editing",
    },
  ];

  return (
    <>
      <Hero />
      
      <section id="tools" className="py-16 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold font-inter mb-8 text-center">Our Conversion Tools</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <ToolCard
              key={index}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              color={tool.color}
              path={tool.path}
              action={tool.action}
            />
          ))}
        </div>
      </section>
      
      <FeatureSection />
      
      <ConversionHistory limit={3} />
      
      <section className="py-16 bg-gradient-to-br from-primary to-accent text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold font-inter mb-4">
            Ready to Try More Powerful Features?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
            Upgrade to our premium plan for unlimited file sizes, batch processing, and priority conversion.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100"
            >
              See All Features
            </Button>
            <Button
              size="lg"
              className="bg-accent border border-white text-white hover:bg-accent/90"
            >
              Upgrade Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
