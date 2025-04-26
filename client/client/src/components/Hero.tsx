import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="bg-gradient-to-br from-primary to-accent text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-inter mb-4">
            Convert and transform your files with ease
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            All your essential file conversion tools in one place - simple, fast, and free to use
          </p>
          <Link href="#tools">
            <Button
              size="lg"
              className="px-8 py-3 bg-white text-primary hover:bg-gray-100 font-medium"
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
