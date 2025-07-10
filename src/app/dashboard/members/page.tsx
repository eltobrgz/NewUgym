
"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MoreHorizontal, PlusCircle, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type Member = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  initials: string;
  status: "Ativo" | "Inativo";
  plan: string;
  joinDate: string;
};

const initialMembers: Member[] = [
  { id: "mem-1", name: "Olivia Martin", email: "olivia.martin@email.com", avatar: "https://placehold.co/100x100.png", initials: "OM", status: "Ativo", plan: "Pro Anual", joinDate: "2023-07-15" },
  { id: "mem-2", name: "Jackson Lee", email: "jackson.lee@email.com", avatar: "https://placehold.co/100x100.png", initials: "JL", status: "Ativo", plan: "Pro Mensal", joinDate: "2023-08-20" },
  { id: "mem-3", name: "Isabella Nguyen", email: "isabella.nguyen@email.com", avatar: "https://placehold.co/100x100.png", initials: "IN", status: "Inativo", plan: "Básico Mensal", joinDate: "2023-03-10" },
  { id: "mem-4", name: "William Kim", email: "will@email.com", avatar: "https://placehold.co/100x100.png", initials: "WK", status: "Ativo", plan: "Pro Anual", joinDate: "2024-01-05" },
  { id: "mem-5", name: "Sofia Davis", email: "sofia.davis@email.com", avatar: "https://placehold.co/100x100.png", initials: "SD", status: "Ativo", plan: "Pro Mensal", joinDate: "2024-02-18" },
];

const AddMemberDialog = ({ open, onOpenChange, onSubmit }: { open: boolean, onOpenChange: (open: boolean) => void, onSubmit: (e: React.FormEvent<HTMLFormElement>) => void}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Novo Membro
                </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Membro</DialogTitle>
                <DialogDescription>
                  Insira o email do membro para convidá-lo para a academia.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={onSubmit} className="space-y-4">
                 <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" name="name" placeholder="Ex: João da Silva" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="joao.silva@example.com" required />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                  <Button type="submit">Adicionar Membro</Button>
                </DialogFooter>
              </form>
            </DialogContent>
        </Dialog>
    )
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [newlyAddedMember, setNewlyAddedMember] = useState<Member | null>(null);
  const { toast } = useToast();
  const router = useRouter();


  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>, memberId?: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const plan = formData.get("plan") as string; // This might be removed if plan assignment happens elsewhere

    if (memberId) {
      // Editing
      setMembers(members.map(m => m.id === memberId ? { ...m, name, email } : m));
      toast({ title: "Membro Atualizado", description: "As informações do membro foram salvas." });
      setEditingMember(null);
    } else {
      // Adding
      const newMember: Member = {
        id: `mem-${Date.now()}`,
        name,
        email,
        plan: "Nenhum", // Default plan, to be assigned
        avatar: "https://placehold.co/100x100.png",
        initials: name.split(" ").map(n => n[0]).join("").toUpperCase(),
        status: "Ativo",
        joinDate: new Date().toISOString().split("T")[0],
      };
      setMembers([newMember, ...members]);
      toast({ title: "Membro Adicionado!", description: `${name} foi adicionado. Agora você pode registrar o primeiro pagamento.` });
      setIsAddDialogOpen(false);
      setNewlyAddedMember(newMember); // Trigger the payment dialog
    }
  };

  const handleDeactivate = (memberId: string) => {
    setMembers(members.map(m => m.id === memberId ? { ...m, status: 'Inativo' } : m));
    toast({ title: "Membro Desativado", variant: "destructive" });
  };
  
  const handleConfirmPaymentRedirect = () => {
    if (newlyAddedMember) {
      router.push(`/dashboard/finance?new_member_id=${encodeURIComponent(newlyAddedMember.id)}`);
    }
    setNewlyAddedMember(null);
  };

  return (
    <>
      <Dialog open={!!editingMember} onOpenChange={(isOpen) => !isOpen && setEditingMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Membro</DialogTitle>
            <DialogDescription>Preencha os detalhes do membro abaixo.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => handleFormSubmit(e, editingMember?.id)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" name="name" defaultValue={editingMember?.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={editingMember?.email} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingMember(null)}>Cancelar</Button>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!newlyAddedMember} onOpenChange={(isOpen) => !isOpen && setNewlyAddedMember(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Membro Adicionado com Sucesso!</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja registrar o primeiro pagamento para {newlyAddedMember?.name} agora?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setNewlyAddedMember(null)}>Não, depois</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmPaymentRedirect}>Sim, registrar pagamento</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Membros</h1>
          <AddMemberDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSubmit={handleFormSubmit} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Membros da Academia</CardTitle>
            <CardDescription>Visualize e gerencie todos os membros da academia.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Membro</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Plano</TableHead>
                  <TableHead className="hidden md:table-cell">Data de Inscrição</TableHead>
                  <TableHead>
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member.avatar} alt={member.name} data-ai-hint="person portrait" />
                          <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-0.5">
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={member.status === "Ativo" ? "default" : "secondary"}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{member.plan}</TableCell>
                    <TableCell className="hidden md:table-cell">{member.joinDate}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => setEditingMember(member)}>
                            <Edit className="mr-2 h-4 w-4"/>Editar Perfil
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4"/>Desativar
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Isso marcará {member.name} como inativo. Eles perderão o acesso às instalações da academia.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeactivate(member.id)}>Confirmar Desativação</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

    