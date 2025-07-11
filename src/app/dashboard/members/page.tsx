
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
import { MoreHorizontal, PlusCircle, Edit, Trash2, Search } from "lucide-react";
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
import { allUsers, type DirectoryUser } from "@/lib/user-directory";

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

// Use the central user directory as the source of truth for members
const getInitialMembers = (): Member[] => {
    const studentUsers = allUsers.filter(u => u.role === 'Student');
    return studentUsers.map((user, index) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: `https://placehold.co/100x100.png`,
        initials: user.name.split(" ").map(n => n[0]).join("").toUpperCase(),
        status: index % 5 === 0 ? "Inativo" : "Ativo", // Make some inactive
        plan: index % 3 === 0 ? "Pro Anual" : index % 2 === 0 ? "Pro Mensal" : "Básico Mensal",
        joinDate: new Date(new Date().setMonth(new Date().getMonth() - (index % 6))).toISOString().split('T')[0], // Vary join dates
    }));
};


const AddMemberDialog = ({ open, onOpenChange, onAddMember }: { open: boolean, onOpenChange: (open: boolean) => void, onAddMember: (member: Member) => void}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<DirectoryUser[]>([]);
    
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        if (term.length > 2) {
            const results = allUsers.filter(user => 
                user.email.toLowerCase().includes(term) && user.role === 'Student'
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }

    const handleAddClick = (user: DirectoryUser) => {
        const newMember: Member = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: "https://placehold.co/100x100.png",
            initials: user.name.split(" ").map(n => n[0]).join("").toUpperCase(),
            status: "Ativo",
            plan: "Nenhum",
            joinDate: new Date().toISOString().split("T")[0],
        };
        onAddMember(newMember);
        setSearchTerm('');
        setSearchResults([]);
    }

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
                <DialogTitle>Vincular Novo Membro</DialogTitle>
                <DialogDescription>
                  Procure por um usuário existente pelo email para adicioná-lo como membro da academia.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                 <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Digite o email do membro..."
                    className="pl-9"
                  />
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {searchResults.map(user => (
                        <div key={user.id} className="flex items-center justify-between p-2 border rounded-md">
                            <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                            <Button size="sm" onClick={() => handleAddClick(user)}>Adicionar</Button>
                        </div>
                    ))}
                    {searchTerm.length > 2 && searchResults.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground">Nenhum usuário encontrado com este email.</p>
                    )}
                </div>
              </div>
            </DialogContent>
        </Dialog>
    )
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>(getInitialMembers());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [newlyAddedMember, setNewlyAddedMember] = useState<Member | null>(null);
  const { toast } = useToast();
  const router = useRouter();


  const handleAddMember = (newMember: Member) => {
      if (members.some(m => m.id === newMember.id)) {
          toast({ title: "Membro já existe", description: `${newMember.name} já faz parte da sua academia.`, variant: "destructive" });
          return;
      }
      setMembers([newMember, ...members]);
      toast({ title: "Membro Adicionado!", description: `${newMember.name} foi adicionado. Agora você pode registrar o primeiro pagamento.` });
      setIsAddDialogOpen(false);
      setNewlyAddedMember(newMember);
  }

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
            <DialogDescription>A edição de perfis está desativada na visualização da academia.</DialogDescription>
          </DialogHeader>
           <div className="space-y-4 text-sm text-muted-foreground">
               <p>Para editar informações de um membro, o próprio usuário deve fazê-lo em suas configurações de perfil.</p>
           </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingMember(null)}>Fechar</Button>
            </DialogFooter>
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
          <AddMemberDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAddMember={handleAddMember} />
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
                            <Edit className="mr-2 h-4 w-4"/>Ver Perfil
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

    
