import Image from 'next/image';
import { LoginForm } from '@/components/auth/login-form';
import { Dumbbell } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Athletes working out"
          width="1920"
          height="1080"
          className="h-full w-full object-cover"
          data-ai-hint="fitness workout"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/20" />
        <div className="absolute top-8 left-8 text-foreground flex items-center gap-2">
          <Dumbbell className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Ugym</h1>
        </div>
        <div className="absolute bottom-8 left-8 text-foreground">
          <h2 className="text-2xl font-semibold">Your Fitness Partner</h2>
          <p className="text-muted-foreground max-w-md mt-2">Manage your workouts, track progress, and stay motivated with the ultimate fitness application.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <LoginForm />
      </div>
    </div>
  );
}
