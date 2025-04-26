import ConversionHistory from "@/components/ConversionHistory";

const History = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold font-inter mb-8">Your Conversion History</h1>
        <ConversionHistory showViewAll={false} />
      </div>
    </div>
  );
};

export default History;
