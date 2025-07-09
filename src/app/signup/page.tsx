import Image from 'next/image';
import { SignupForm } from '@/components/auth/signup-form';
import { ThemeProvider } from '@/components/theme-provider';

export default function SignupPage() {
  return (
     <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
          <SignupForm />
        </div>
        <div className="hidden bg-muted lg:block">
          <Image
            src="https://placehold.co/1920x1080.png"
            alt="Person stretching in a gym"
            width="1920"
            height="1080"
            className="h-full w-full object-cover"
            data-ai-hint="gym training"
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
