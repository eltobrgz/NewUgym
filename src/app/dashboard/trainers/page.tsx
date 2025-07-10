
"use client";

import { useState } from 'react';
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
import { MoreHorizontal, PlusCircle, List, LayoutGrid, Trash2, Edit, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { allUsers, type DirectoryUser } from "@/lib/user-directory";

type Trainer = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  initials: string;
  status: "Ativo" | "De Licença";
  clients: number;
};

const initialTrainers: Trainer[] = [
  { id: "trn-1", name: "John Carter", email: "john.carter@email.com", avatar: "https://placehold.co/100x100.png", initials: "JC", status: "Ativo", clients: 15 },
  { id: "trn-2", name: "Sophie Brown", email: "sophie.brown@email.com", avatar: "https://placehold.co/100x100.png", initials: "SB", status: "Ativo", clients: 12 },
];


const AddTrainerDialog = ({ open, onOpenChange, onAddTrainer }: { open: boolean, onOpenChange: (open: boolean) => void, onAddTrainer: (trainer: Trainer) => void}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<DirectoryUser[]>([]);
    
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        if (term.length > 2) {
            const results = allUsers.filter(user => 
                user.email.toLowerCase().includes(term) && user.role === 'Trainer'
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }

    const handleAddClick = (user: DirectoryUser) => {
        const newTrainer: Trainer = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: "https://placehold.co/100x100.png",
            initials: user.name.split(" ").map(n => n[0]).join("").toUpperCase(),
            status: "Ativo",
            clients: 0,
        };
        onAddTrainer(newTrainer);
        setSearchTerm('');
        setSearchResults([]);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Personal
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Vincular Novo Personal</DialogTitle>
                    <DialogDescription>
                    Procure por um personal existente pelo email para adicioná-lo à sua academia.
                    </DialogDescription>
                </DialogHeader>
                 <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Digite o email do personal..."
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
                            <p className="text-center text-sm text-muted-foreground">Nenhum personal encontrado com este email.</p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function TrainersPage() {
    const [trainers, setTrainers] = useState<Trainer[]>(initialTrainers);
    const [view, setView] = useState<'list' | 'grid'>('list');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
    const { toast } = useToast();

    const handleAddTrainer = (newTrainer: Trainer) => {
        if (trainers.some(t => t.id === newTrainer.id)) {
            toast({ title: "Personal já existe", description: `${newTrainer.name} já faz parte da sua equipe.`, variant: "destructive" });
            return;
        }
        setTrainers(prev => [newTrainer, ...prev]);
        setIsAddDialogOpen(false);
        toast({ title: "Personal Adicionado!", description: `${newTrainer.name} foi adicionado à sua academia.` });
    };

    const handleDeleteTrainer = (trainerId: string) => {
        setTrainers(prev => prev.filter(t => t.id !== trainerId));
        toast({ title: "Personal Removido", variant: 'destructive' });
    };

    return (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Gerenciar Personais</h1>
            <div className="flex items-center gap-2">
                <div className="flex items-center rounded-md bg-muted p-1">
                    <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('list')}><List className="h-5 w-5"/></Button>
                    <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('grid')}><LayoutGrid className="h-5 w-5"/></Button>
                </div>
                <AddTrainerDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAddTrainer={handleAddTrainer} />
            </div>
          </div>
            
            <Dialog open={!!editingTrainer} onOpenChange={(isOpen) => !isOpen && setEditingTrainer(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Personal</DialogTitle>
                        <DialogDescription>A edição de perfis está desativada na visualização da academia.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 text-sm text-muted-foreground">
                        <p>Para editar informações de um personal, o próprio usuário deve fazê-lo em suas configurações de perfil.</p>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setEditingTrainer(null)}>Fechar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {view === 'list' ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Equipe de Personais</CardTitle>
                        <CardDescription>Gerencie todos os personais da sua academia.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Personal</TableHead>
                            <TableHead className="hidden sm:table-cell">Status</TableHead>
                            <TableHead>Clientes</TableHead>
                            <TableHead><span className="sr-only">Ações</span></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {trainers.map((trainer) => (
                            <TableRow key={trainer.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-9 w-9">
                                    <AvatarImage src={trainer.avatar} alt={trainer.name} data-ai-hint="person portrait" />
                                    <AvatarFallback>{trainer.initials}</AvatarFallback>
                                  </Avatar>
                                  <div className="grid gap-0.5">
                                    <p className="font-medium">{trainer.name}</p>
                                    <p className="text-xs text-muted-foreground">{trainer.email}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <Badge variant={trainer.status === "Ativo" ? "default" : "secondary"}>{trainer.status}</Badge>
                              </TableCell>
                              <TableCell>{trainer.clients}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                    <DropdownMenuItem onSelect={() => setEditingTrainer(trainer)}><Edit className="mr-2 h-4 w-4"/>Ver Perfil</DropdownMenuItem>
                                    <DropdownMenuItem>Ver Agenda</DropdownMenuItem>
                                    <DropdownMenuItem>Atribuir Membro</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive"><Trash2 className="mr-2 h-4 w-4"/>Remover Personal</DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                <AlertDialogDescription>Isso removerá permanentemente {trainer.name} do sistema. Esta ação não pode ser desfeita.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteTrainer(trainer.id)}>Confirmar</AlertDialogAction>
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
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {trainers.map(trainer => (
                        <Card key={trainer.id}>
                            <CardHeader className="items-center text-center">
                                <Avatar className="h-20 w-20 mb-2">
                                    <AvatarImage src={trainer.avatar} alt={trainer.name} data-ai-hint="person portrait" />
                                    <AvatarFallback>{trainer.initials}</AvatarFallback>
                                </Avatar>
                                <CardTitle>{trainer.name}</CardTitle>
                                <CardDescription>{trainer.email}</CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-sm text-muted-foreground">{trainer.clients} Clientes</p>
                                <Badge variant={trainer.status === "Ativo" ? "default" : "secondary"} className="mt-2">{trainer.status}</Badge>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
