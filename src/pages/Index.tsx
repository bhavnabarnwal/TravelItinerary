import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, MapPin, Calendar, Users, Utensils, Clock, ExternalLink } from "lucide-react";
import TravelForm from "@/components/TravelForm";
import ItineraryResults from "@/components/ItineraryResults";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'landing' | 'form' | 'results'>('landing');
  const [itineraryData, setItineraryData] = useState<any>(null);

  const handleGetStarted = () => {
    setCurrentStep('form'); // Go straight to form
  };

  const handleFormComplete = (data: any) => {
    console.log('Travel preferences:', data);
    setItineraryData(data);
    setCurrentStep('results');
  };

  const handleBookDemo = () => {
    toast({
      title: "Demo Request Submitted!",
      description: "We'll contact you within 24 hours to schedule your personalized demo.",
    });
  };

  const handleStartOver = () => {
    setCurrentStep('landing');
    setItineraryData(null);
  };

  if (currentStep === 'form') {
    return <TravelForm onComplete={handleFormComplete} />;
  }

  if (currentStep === 'results' && itineraryData) {
    return <ItineraryResults data={itineraryData} onStartOver={handleStartOver} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-elegant">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Globe className="h-8 w-8" />
            <h1 className="text-2xl font-bold font-playfair">TravelGuide</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#features" className="hover:text-white/80 transition-colors font-medium">Features</a>
            <a href="#how-it-works" className="hover:text-white/80 transition-colors font-medium">How It Works</a>
            <a href="#about" className="hover:text-white/80 transition-colors font-medium">About</a>
            <a href="#contact" className="hover:text-white/80 transition-colors font-medium">Contact</a>
          </nav>
          <Button 
            variant="secondary" 
            className="hidden md:flex items-center gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30"
            onClick={handleBookDemo}
          >
            Book a Demo
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 font-playfair bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Plan Your Perfect Day in Any City ✨
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover personalized travel experiences tailored to your preferences and style. 
            Let us create the perfect itinerary just for you.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-10 py-6 bg-gradient-to-r from-primary to-accent text-white shadow-elegant hover:scale-105 transition-all duration-300 font-semibold"
            onClick={handleGetStarted}
          >
            Create My Itinerary
          </Button>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-playfair">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Share your travel preferences and get a personalized itinerary in just two simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="text-center hover:shadow-warm transition-all duration-300 hover:-translate-y-2 border-0 bg-white/60 backdrop-blur">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="font-playfair text-xl">Travel Preferences</CardTitle>
              <CardDescription className="text-base">
                Share your destination goals, food preferences, and travel dates
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center hover:shadow-warm transition-all duration-300 hover:-translate-y-2 border-0 bg-white/60 backdrop-blur">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="font-playfair text-xl">Personalized Itinerary</CardTitle>
              <CardDescription className="text-base">
                Receive a custom travel plan tailored to your unique style and availability
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-playfair">What We Consider</h3>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Every detail matters in creating your perfect travel experience
          </p>
          <div className="flex flex-wrap gap-4 justify-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="text-base py-3 px-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:scale-105 transition-transform">
              <Utensils className="h-5 w-5 mr-2" />
              Food Preferences
            </Badge>
            <Badge variant="secondary" className="text-base py-3 px-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:scale-105 transition-transform">
              <MapPin className="h-5 w-5 mr-2" />
              Destination Goals
            </Badge>
            <Badge variant="secondary" className="text-base py-3 px-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:scale-105 transition-transform">
              <Clock className="h-5 w-5 mr-2" />
              Time Availability
            </Badge>
            <Badge variant="secondary" className="text-base py-3 px-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:scale-105 transition-transform">
              <Calendar className="h-5 w-5 mr-2" />
              Travel Dates
            </Badge>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
