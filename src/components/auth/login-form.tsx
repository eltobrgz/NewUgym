
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dumbbell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
       <div className="text-center">
         <div className="flex items-center justify-center gap-2 mb-4">
          <Dumbbell className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Ugym</h1>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Bem-vindo de volta!</h2>
        <p className="text-muted-foreground mt-1">
          Faça login para continuar sua jornada fitness.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            className="bg-background/70"
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Senha</Label>
            <Link
              href="#"
              className="ml-auto inline-block text-sm text-primary/90 hover:text-primary"
            >
              Esqueceu sua senha?
            </Link>
          </div>
          <Input id="password" type="password" required className="bg-background/70" />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button variant="outline" className="w-full bg-background/70">
          Login com Google
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Não tem uma conta?{" "}
        <Link href="/signup" className="font-semibold text-primary/90 hover:text-primary">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
