
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/contexts/user-role-context";
import { Textarea } from "@/components/ui/textarea";

const StudentProfile = () => (
    <>
        <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" defaultValue="Alex Robinson" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="alex.rob@example.com" />
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
    </>
);

const TrainerProfile = () => (
    <>
        <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" defaultValue="Sarah Coach" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="sarah.c@example.com" />
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
    </>
);

const GymProfile = () => (
     <>
        <div className="space-y-2">
            <Label htmlFor="gym-name">Nome da Academia</Label>
            <Input id="gym-name" defaultValue="FitZone Admin" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="email">Email de Contato</Label>
                <Input id="email" type="email" defaultValue="admin@fitzone.com" />
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
    </>
);


export default function SettingsPage() {
    const { toast } = useToast();
    const { userRole } = useUserRole();

    const handleSaveChanges = () => {
        toast({
          title: "Perfil Atualizado",
          description: "Suas informações foram salvas com sucesso.",
        });
    };

    const renderProfileForm = () => {
        switch (userRole) {
            case "Student":
                return <StudentProfile />;
            case "Trainer":
                return <TrainerProfile />;
            case "Gym":
                return <GymProfile />;
            default:
                return null;
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight">Configurações de Perfil</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Minhas Informações</CardTitle>
                    <CardDescription>
                        Mantenha seus dados sempre atualizados.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {renderProfileForm()}
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button onClick={handleSaveChanges}>Salvar Alterações</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
