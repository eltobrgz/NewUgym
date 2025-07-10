
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div
      className="w-full min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }}
      data-ai-hint="fitness workout"
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
