import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { CalendarDays, MapPin, Utensils, Clock, DollarSign, Users, Heart, Camera, Gamepad2, Compass } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  destination: z.string().min(1, "Please enter your destination"),
  travelDates: z.string().min(1, "Please select your travel dates"),
  duration: z.string().min(1, "Please select trip duration"),
  budget: z.string().min(1, "Please select your budget range"),
  groupSize: z.string().min(1, "Please select group size"),
  favHobbies: z.string().min(1, "Please enter your favorite hobbies"),
  favSites: z.string().min(1, "Please enter your favorite sites/places"),
  favActivities: z.string().min(1, "Please enter your favorite activities"),
  foodPreferences: z.string().optional(),
  accessibility: z.string().optional(),
  specialRequests: z.string().optional(),
});

interface TravelFormProps {
  onComplete: (data: any) => void;
}

const foodPreferences = [
  "Vegetarian", "Vegan", "Halal", "Gluten-Free", "Local Cuisine"
];

const TravelForm = ({ onComplete }: TravelFormProps) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      travelDates: "",
      duration: "",
      budget: "",
      groupSize: "",
      favHobbies: "",
      favSites: "",
      favActivities: "",
      foodPreferences: "",
      accessibility: "",
      specialRequests: "",
    },
  });


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
    const personalityAnswers = JSON.parse(localStorage.getItem('personalityQuizAnswers') || '{}');
    
    // Preparing data for backend
    const requestData = {
      destination: values.destination,
      travelDates: values.travelDates,
      duration: values.duration,
      budget: values.budget,
      groupSize: values.groupSize,
      hobby: values.favHobbies,
      interests: [
        values.favSites,
        values.favActivities
      ].filter(Boolean).join(', '),
      foodPreferences: values.foodPreferences || "None",
      accessibility: values.accessibility || "None",
      specialRequests: values.specialRequests || "None",
      personality: personalityAnswers
    };

    // Show loading toast
    toast({
      title: "Creating your itinerary...",
      description: "This may take a moment",
    });

    // Call backend
    const response = await fetch("http://localhost:5000/get-itinerary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answers: requestData }),
    });

    if (!response.ok) throw new Error("Failed to generate itinerary");

    const result = await response.json();
    onComplete(result); // Pass the full response to parent component

  } catch (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to generate itinerary",
    });
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-rose-50 to-orange-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-5xl font-bold bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent mb-4">
            Travel Preferences
          </h1>
          <p className="text-lg text-slate-600 font-medium">Tell us about your dream destination and preferences</p>
          <div className="w-24 h-1 bg-gradient-to-r from-violet-500 to-rose-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Destination Section */}
            <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-indigo-600" />
                  Destination
                </CardTitle>
                <CardDescription>Where would you like to explore?</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Destination</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. USA, France or Japan" 
                          className="bg-white/80 border-indigo-200 focus:border-indigo-400"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Travel Details Section */}
            <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-6 w-6 text-teal-600" />
                  Travel Details
                </CardTitle>
                <CardDescription>When and how long would you like to travel?</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="travelDates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Dates</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeframe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="next-month">Next Month</SelectItem>
                          <SelectItem value="2-3-months">2-3 Months</SelectItem>
                          <SelectItem value="6-months">6 Months</SelectItem>
                          <SelectItem value="next-year">Next Year</SelectItem>
                          <SelectItem value="flexible">I'm Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trip Duration</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1-2-days">1-2 Days</SelectItem>
                          <SelectItem value="3-5-days">3-5 Days</SelectItem>
                          <SelectItem value="1-week">1 Week</SelectItem>
                          <SelectItem value="2-weeks">2 Weeks</SelectItem>
                          <SelectItem value="1-month">1 Month+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Budget & Group Section */}
            <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-amber-600" />
                  Budget & Group
                </CardTitle>
                <CardDescription>Tell us about your budget and group size</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Range (per person)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="budget">Budget (₹3,000-7,000/day)</SelectItem>
                          <SelectItem value="mid-range">Mid-range (₹7,000-15,000/day)</SelectItem>
                          <SelectItem value="luxury">Luxury (₹15,000-40,000/day)</SelectItem>
                          <SelectItem value="ultra-luxury">Ultra Luxury (₹40,000+/day)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="groupSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Size</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select group size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="solo">Solo Traveler</SelectItem>
                          <SelectItem value="couple">Couple (2 people)</SelectItem>
                          <SelectItem value="small-group">Small Group (3-5 people)</SelectItem>
                          <SelectItem value="large-group">Large Group (6+ people)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Favorite Hobbies Section */}
            <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-rose-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-600" />
                  Favorite Hobby
                </CardTitle>
                <CardDescription>Name your favorite movie, tv series or book?</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="favHobbies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your favorite hobbies</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g. Inception, Vampire Diaries or Rich Dad Poor Dad"
                          className="resize-none min-h-[100px] bg-white/80"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Tell us about your favorite entertainment type
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Favorite Sites Section */}
            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="h-5 w-5 text-blue-600" />
                  Favorite Sites & Places
                </CardTitle>
                <CardDescription>What type of places fascinate you the most?</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="favSites"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your favorite types of places</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g. museums, historical monuments, art galleries, beaches, mountains"
                          className="resize-none min-h-[100px] bg-white/80"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Museums, monuments, natural wonders, architectural sites
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            
           

            {/* Favorite Activities Section */}
            <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-purple-600" />
                  Favorite Activities
                </CardTitle>
                <CardDescription>What activities would you love to try while traveling?</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="favActivities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your favorite travel activities</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g. local food tours, shopping, nightlife, cultural shows, workshops"
                          className="resize-none min-h-[100px] bg-white/80"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Activities you'd like to experience during your trip
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Food Preferences Section */}
            <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-6 w-6 text-orange-600" />
                  Food Preferences
                </CardTitle>
                <CardDescription>Any dietary restrictions or preferences?</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="foodPreferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dietary preferences (optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select dietary preference" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No restrictions</SelectItem>
                          {foodPreferences.map((pref) => (
                            <SelectItem key={pref} value={pref}>{pref}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Special Requirements Section */}
            <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-slate-600" />
                  Special Requirements
                </CardTitle>
                <CardDescription>Any accessibility needs or special requests?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="accessibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accessibility Needs</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select if applicable" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No special needs</SelectItem>
                          <SelectItem value="wheelchair">Wheelchair accessible</SelectItem>
                          <SelectItem value="mobility">Mobility assistance</SelectItem>
                          <SelectItem value="visual">Visual impairment assistance</SelectItem>
                          <SelectItem value="hearing">Hearing impairment assistance</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="specialRequests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Requests</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any other special requests or information we should know?"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Feel free to share any other preferences or requirements
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-center pt-8">
              <Button 
                type="submit" 
                size="lg" 
                className="px-12 py-4 text-xl font-playfair font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-violet-500/25 hover:scale-105 transition-all duration-300 border-0 rounded-full"
              >
                ✨ Create My Dream Itinerary ✨
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default TravelForm;