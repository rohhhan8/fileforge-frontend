import { Lock, Zap, Monitor, FileText, Sliders, History } from "lucide-react";

const FeatureSection = () => {
  const features = [
    {
      icon: <Lock className="w-6 h-6 text-primary" />,
      title: "Secure Processing",
      description:
        "Your files are processed in your browser when possible and automatically deleted after conversion.",
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: <Zap className="w-6 h-6 text-secondary" />,
      title: "Fast Conversion",
      description:
        "Advanced algorithms ensure your files are processed quickly without sacrificing quality.",
      bgColor: "bg-secondary/10",
      iconColor: "text-secondary",
    },
    {
      icon: <Monitor className="w-6 h-6 text-accent" />,
      title: "Works Everywhere",
      description:
        "Use our tools on any device with a browser - no software installation required.",
      bgColor: "bg-accent/10",
      iconColor: "text-accent",
    },
    {
      icon: <FileText className="w-6 h-6 text-primary" />,
      title: "Multiple Formats",
      description:
        "Support for a wide range of file formats including PDF, JPG, PNG, WEBP, and more.",
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: <Sliders className="w-6 h-6 text-secondary" />,
      title: "Advanced Options",
      description:
        "Fine-tune your conversions with customization options for professional results.",
      bgColor: "bg-secondary/10",
      iconColor: "text-secondary",
    },
    {
      icon: <History className="w-6 h-6 text-accent" />,
      title: "Conversion History",
      description:
        "Access your recent conversions and download results again when needed.",
      bgColor: "bg-accent/10",
      iconColor: "text-accent",
    },
  ];

  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-inter mb-4">
            Why Choose FileForge?
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Our platform offers a comprehensive suite of file conversion tools
            designed with simplicity and efficiency in mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6">
              <div
                className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold font-inter mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
