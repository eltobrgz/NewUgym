
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
import { MoreHorizontal, PlusCircle, List, LayoutGrid, Trash2, Edit } from "lucide-react";
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

type Trainer = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  initials: string;
  status: "Active" | "On Leave";
  clients: number;
};

const initialTrainers: Trainer[] = [
  { id: "trn-1", name: "John Carter", email: "john.carter@email.com", avatar: "https://placehold.co/100x100.png", initials: "JC", status: "Active", clients: 15 },
  { id: "trn-2", name: "Sophie Brown", email: "sophie.brown@email.com", avatar: "https://placehold.co/100x100.png", initials: "SB", status: "Active", clients: 12 },
  { id: "trn-3", name: "Michael Rodriguez", email: "michael.r@email.com", avatar: "https://placehold.co/100x100.png", initials: "MR", status: "On Leave", clients: 5 },
  { id: "trn-4", name: "Sarah Miller", email: "sarah.m@email.com", avatar: "https://placehold.co/100x100.png", initials: "SM", status: "Active", clients: 18 },
];

export default function TrainersPage() {
    const [trainers, setTrainers] = useState<Trainer[]>(initialTrainers);
    const [view, setView] = useState<'list' | 'grid'>('list');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
    const { toast } = useToast();

    const handleAddTrainer = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;

        const newTrainer: Trainer = {
            id: `trn-${Date.now()}`,
            name,
            email,
            avatar: "https://placehold.co/100x100.png",
            initials: name.split(' ').map(n => n[0]).join(''),
            status: "Active",
            clients: 0,
        };
        setTrainers(prev => [newTrainer, ...prev]);
        setIsAddDialogOpen(false);
        toast({ title: "Treinador Adicionado!", description: `${name} foi adicionado à equipe.` });
    };

    const handleEditTrainer = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingTrainer) return;

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        
        setTrainers(prev => prev.map(t => t.id === editingTrainer.id ? { ...t, name, email } : t));
        setEditingTrainer(null);
        toast({ title: "Treinador Atualizado", description: "As informações foram salvas." });
    };

    const handleDeleteTrainer = (trainerId: string) => {
        setTrainers(prev => prev.filter(t => t.id !== trainerId));
        toast({ title: "Treinador Removido", variant: 'destructive' });
    };

    return (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Manage Trainers</h1>
            <div className="flex items-center gap-2">
                <div className="flex items-center rounded-md bg-muted p-1">
                    <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('list')}><List className="h-5 w-5"/></Button>
                    <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('grid')}><LayoutGrid className="h-5 w-5"/></Button>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New Trainer
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Trainer</DialogTitle>
                      <DialogDescription>Fill in the details to add a new trainer to the system.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddTrainer} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required />
                      </div>
                      <DialogFooter>
                        <Button type="submit">Add Trainer</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
            </div>
          </div>
            
            {/* Edit Dialog */}
            <Dialog open={!!editingTrainer} onOpenChange={(isOpen) => !isOpen && setEditingTrainer(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Trainer</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditTrainer} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name-edit">Full Name</Label>
                            <Input id="name-edit" name="name" defaultValue={editingTrainer?.name} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email-edit">Email</Label>
                            <Input id="email-edit" name="email" type="email" defaultValue={editingTrainer?.email} required />
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {view === 'list' ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Trainer Staff</CardTitle>
                        <CardDescription>Oversee all personal trainers at your facility.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Trainer</TableHead>
                            <TableHead className="hidden sm:table-cell">Status</TableHead>
                            <TableHead>Clients</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
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
                                <Badge variant={trainer.status === "Active" ? "default" : "secondary"}>{trainer.status}</Badge>
                              </TableCell>
                              <TableCell>{trainer.clients}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onSelect={() => setEditingTrainer(trainer)}><Edit className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                                    <DropdownMenuItem>View Schedule</DropdownMenuItem>
                                    <DropdownMenuItem>Assign Member</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive"><Trash2 className="mr-2 h-4 w-4"/>Remove Trainer</DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>This will permanently remove {trainer.name} from the system. This action cannot be undone.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteTrainer(trainer.id)}>Confirm</AlertDialogAction>
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
                                <p className="text-sm text-muted-foreground">{trainer.clients} Clients</p>
                                <Badge variant={trainer.status === "Active" ? "default" : "secondary"} className="mt-2">{trainer.status}</Badge>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
