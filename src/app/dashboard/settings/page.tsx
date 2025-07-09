'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export default function SettingsPage() {
    const { toast } = useToast();
    const [primaryColor, setPrimaryColor] = useState('#008080');
    const [backgroundColor, setBackgroundColor] = useState('#f0f0f0');
    const [accentColor, setAccentColor] = useState('#ff8033');
    
    // In a real app, these values would be fetched from user preferences.
    // The `applyColors` function would dynamically update CSS variables.

    const handleSaveChanges = () => {
        // Here you would save the new colors to the user's profile.
        toast({
          title: "Settings Saved",
          description: "Your new theme colors have been saved.",
        });
    };

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Theme Customization</CardTitle>
                    <CardDescription>
                        Personalize the look and feel of your workspace.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                        <Label htmlFor="primary-color" className="w-32">Primary Color</Label>
                        <div className="flex items-center gap-2">
                           <Input 
                                id="primary-color" 
                                type="color" 
                                value={primaryColor} 
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="w-12 h-12 p-1"
                            />
                            <Input 
                                value={primaryColor} 
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="w-32 font-mono"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                        <Label htmlFor="background-color" className="w-32">Background Color</Label>
                        <div className="flex items-center gap-2">
                            <Input 
                                id="background-color" 
                                type="color" 
                                value={backgroundColor} 
                                onChange={(e) => setBackgroundColor(e.target.value)}
                                className="w-12 h-12 p-1"
                            />
                            <Input 
                                value={backgroundColor} 
                                onChange={(e) => setBackgroundColor(e.target.value)}
                                className="w-32 font-mono"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                        <Label htmlFor="accent-color" className="w-32">Accent Color</Label>
                         <div className="flex items-center gap-2">
                            <Input 
                                id="accent-color" 
                                type="color" 
                                value={accentColor} 
                                onChange={(e) => setAccentColor(e.target.value)}
                                className="w-12 h-12 p-1"
                            />
                            <Input 
                                value={accentColor} 
                                onChange={(e) => setAccentColor(e.target.value)}
                                className="w-32 font-mono"
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
