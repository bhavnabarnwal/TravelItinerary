import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, Utensils, Camera, Star, Calendar, Users, DollarSign, Printer } from "lucide-react";
import { useState, useEffect } from "react";

interface ItineraryResultsProps {
  data: {
    itinerary: string; 
    city?: string;
    country?: string;
    duration?: string;
    budget?: string;
    groupSize?: string;
    interests?: string[];
  };
  onStartOver: () => void;
}

const ItineraryResults = ({ data, onStartOver }: ItineraryResultsProps) => {
  const [isPrinting, setIsPrinting] = useState(false);

  // Function to handle printing
  const handlePrint = () => {
    setIsPrinting(true);
    const printContent = `
      <html>
        <head>
          <title>Your Travel Itinerary</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
            h1 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
            .itinerary { white-space: pre-wrap; margin-top: 20px; }
            .header-info { margin-bottom: 20px; }
            .footer { margin-top: 30px; font-size: 0.9em; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <h1>Your Travel Itinerary</h1>
          <div class="header-info">
            ${data.city && `<p><strong>Destination:</strong> ${data.city}${data.country ? `, ${data.country}` : ''}</p>`}
            ${data.duration && `<p><strong>Duration:</strong> ${data.duration}</p>`}
            ${data.budget && `<p><strong>Budget:</strong> ${data.budget}</p>`}
            ${data.groupSize && `<p><strong>Group Size:</strong> ${data.groupSize}</p>`}
          </div>
          <div class="itinerary">${data.itinerary}</div>
          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        setIsPrinting(false);
      };
    } else {
      setIsPrinting(false);
    }
  };

  // Keep your existing UI rendering logic
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header - Keep your existing header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 font-playfair">
            Your Personalized Itinerary ✨
          </h1>
          <p className="text-muted-foreground text-lg">
            Crafted specifically for your travel style and preferences
          </p>
        </div>

        {/* Trip Overview - Keep your existing card */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur">
          {/* ... your existing card content ... */}
        </Card>

        {/* Itinerary Display */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-playfair">
              <Clock className="h-5 w-5 text-primary" />
              Daily Itinerary
            </CardTitle>
            <CardDescription>
              Your perfect day, hour by hour
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <pre className="whitespace-pre-wrap font-sans text-sm text-muted-foreground">
              {data.itinerary || "No itinerary could be generated."}
            </pre>
          </CardContent>
        </Card>

        {/* Action Buttons - Add Print button */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent text-white shadow-elegant hover:scale-105 transition-transform"
              onClick={handlePrint}
              disabled={isPrinting}
            >
              <Printer className="h-4 w-4 mr-2" />
              {isPrinting ? "Preparing..." : "Print Itinerary"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              Share with Friends
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={onStartOver}
            >
              Create Another
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Love your itinerary? Save it and start planning your perfect trip!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ItineraryResults;