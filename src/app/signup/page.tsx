
import { SignupForm } from '@/components/auth/signup-form';

export default function SignupPage() {
  return (
     <div
      className="w-full min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }}
      data-ai-hint="gym training"
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
       <div className="relative z-10 w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
}
