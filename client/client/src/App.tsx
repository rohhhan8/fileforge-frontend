import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import Home from "@/pages/Home";
import PdfMerger from "@/pages/PdfMerger";
import ImageToPdf from "@/pages/ImageToPdf";
import PdfToImage from "@/pages/PdfToImage";
import ImageConverter from "@/pages/ImageConverter";
import History from "@/pages/History";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/pdf-merger" component={PdfMerger} />
          <Route path="/image-to-pdf" component={ImageToPdf} />
          <Route path="/pdf-to-image" component={PdfToImage} />
          <Route path="/image-converter" component={ImageConverter} />
          <Route path="/history" component={History} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
