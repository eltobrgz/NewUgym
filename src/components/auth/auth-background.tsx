
"use client"

import { Dumbbell, HeartPulse, Activity, Weight, Award } from "lucide-react";

const icons = [Dumbbell, HeartPulse, Activity, Weight, Award];

// A helper function to create a unique array of icons for each row
const getIconRow = (rowIndex: number) => {
    const rowIcons = [];
    for (let i = 0; i < 20; i++) {
        const iconIndex = (rowIndex + i) % icons.length;
        rowIcons.push(icons[iconIndex]);
    }
    return rowIcons;
}


export function AuthBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-background">
        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-8 opacity-20 dark:opacity-10 blur-sm">
            {[...Array(8)].map((_, rowIndex) => (
                <div key={rowIndex} className="flex-shrink-0 flex items-center justify-around w-full animate-marquee">
                    <div className="flex items-center justify-around w-full">
                        {getIconRow(rowIndex).map((Icon, iconIndex) => (
                            <Icon key={iconIndex} className="w-16 h-16 text-primary odd:text-foreground/80" strokeWidth={1} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div className="absolute inset-0 bg-background/80" />
    </div>
  );
}
