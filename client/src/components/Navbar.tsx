import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Tools", path: "/#tools" },
    { label: "History", path: "/history" },
    { label: "Help", path: "/#features" },
  ];

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-primary text-2xl font-bold font-inter flex items-center">
                <Download className="mr-2" />
                FileForge
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link 
                key={item.label} 
                href={item.path}
                className={`text-textDark hover:text-primary font-medium transition-colors ${
                  isActive(item.path) ? "text-primary" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden md:flex border-secondary text-secondary hover:bg-secondary hover:text-white"
            >
              Log in
            </Button>
            <Button className="bg-primary text-white hover:bg-blue-700">
              Sign up Free
            </Button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-6 mt-8">
                  {menuItems.map((item) => (
                    <Link 
                      key={item.label} 
                      href={item.path}
                      className={`text-textDark hover:text-primary font-medium transition-colors ${
                        isActive(item.path) ? "text-primary" : ""
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Button className="mt-4 bg-primary text-white hover:bg-blue-700">
                    Sign up Free
                  </Button>
                  <Button
                    variant="outline"
                    className="border-secondary text-secondary hover:bg-secondary hover:text-white"
                  >
                    Log in
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
