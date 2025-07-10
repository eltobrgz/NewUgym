
'use client';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { UserRole, User } from "@/contexts/user-role-context";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

const getInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length === 0) return "";
    const firstInitial = names[0][0];
    const lastInitial = names.length > 1 ? names[names.length - 1][0] : "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
};

const StudentProfileForm = ({ user }: { user: User }) => (
    <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" defaultValue={user.name} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user.email} />
            </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input id="height" type="number" defaultValue="175" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input id="weight" type="number" defaultValue="80" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="birthdate">Data de Nascimento</Label>
                <Input id="birthdate" type="date" defaultValue="1998-05-20" />
            </div>
        </div>
    </div>
);

const TrainerProfileForm = ({ user }: { user: User }) => (
    <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" defaultValue={user.name} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user.email} />
            </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="cref">CREF</Label>
                <Input id="cref" defaultValue="123456-G/SP" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="specializations">Especializações</Label>
                <Input id="specializations" defaultValue="Treinamento Funcional, Nutrição Esportiva" />
            </div>
        </div>
         <div className="space-y-2">
            <Label htmlFor="bio">Biografia</Label>
            <Textarea id="bio" placeholder="Fale um pouco sobre sua carreira e filosofia de treino..." defaultValue="Personal trainer com mais de 10 anos de experiência, focada em ajudar clientes a atingirem seus objetivos de saúde e performance." />
        </div>
    </div>
);

const GymProfileForm = ({ user }: { user: User }) => (
     <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="gym-name">Nome da Academia</Label>
            <Input id="gym-name" defaultValue={user.name} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="email">Email de Contato</Label>
                <Input id="email" type="email" defaultValue={user.email} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" type="tel" defaultValue="(11) 98765-4321" />
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" defaultValue="Rua dos Atletas, 123, Bairro Fitness, São Paulo - SP" />
        </div>
    </div>
);


const renderProfileForm = (role: UserRole, user: User) => {
    switch (role) {
        case "Student":
            return <StudentProfileForm user={user} />;
        case "Trainer":
            return <TrainerProfileForm user={user} />;
        case "Gym":
            return <GymProfileForm user={user} />;
        default:
            return null;
    }
}


export function UserProfileSettings({ user, role }: { user: User, role: UserRole }) {
    const { toast } = useToast();

    const handleSaveChanges = () => {
        toast({
          title: "Perfil Atualizado",
          description: "Suas informações foram salvas com sucesso.",
        });
    };

    return (
        <Card className="overflow-hidden">
             <div className="relative h-32 md:h-48 w-full">
                <Image
                    src="https://placehold.co/1200x400.png"
                    alt="Banner do perfil"
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="gym pattern"
                />
            </div>
            <CardHeader className="flex-col items-start gap-4 sm:flex-row p-6">
                <div className="relative -mt-20 sm:-mt-24">
                    <Avatar className="h-28 w-28 border-4 border-background">
                         <AvatarImage src={`https://placehold.co/100x100.png`} alt={user.name} data-ai-hint="person portrait"/>
                        <AvatarFallback className="text-4xl">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                     <Button size="icon" className="absolute bottom-1 right-1 h-8 w-8 rounded-full">
                        <Upload className="h-4 w-4" />
                        <span className="sr-only">Upload de foto</span>
                    </Button>
                </div>
                <div className="flex-1">
                    <CardTitle className="text-3xl">{user.name}</CardTitle>
                    <CardDescription>
                        {role} @ Ugym
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                {renderProfileForm(role, user)}
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button onClick={handleSaveChanges}>Salvar Alterações</Button>
            </CardFooter>
        </Card>
    );
}
