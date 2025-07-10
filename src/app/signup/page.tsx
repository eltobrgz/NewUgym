
import { SignupForm } from '@/components/auth/signup-form';
import { AuthBackground } from '@/components/auth/auth-background';

export default function SignupPage() {
  return (
     <div
      className="w-full min-h-screen flex items-center justify-center p-4 relative"
    >
      <AuthBackground />
       <div className="relative z-10 w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
}
