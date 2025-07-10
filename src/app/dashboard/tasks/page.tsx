
"use client";

import { useState, useContext } from "react";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, PlusCircle, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/contexts/user-role-context";
import { TasksContext, Task, TaskStatus } from "@/contexts/tasks-context";


const statusVariant: { [key in TaskStatus]: { variant: "default" | "secondary" | "destructive" | "outline", text: string }} = {
  "In Progress": { variant: "secondary", text: "Em Progresso" },
  "To Do": { variant: "outline", text: "A Fazer" },
  "Done": { variant: "default", text: "Feito" },
  "Canceled": { variant: "destructive", text: "Cancelado" },
};

export default function TasksPage() {
  const { user, userRole } = useUserRole();
  const { tasks, addTask, updateTask, deleteTask, toggleTaskStatus } = useContext(TasksContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const assignee = formData.get('assignee') as string;
    const dueDate = formData.get('dueDate') as string;

    if (editingTask) {
      // Edit task
      updateTask(editingTask.id, { title, assignee, dueDate });
      toast({ title: "Tarefa Atualizada" });
      setEditingTask(null);
    } else {
      // Add new task
      addTask({ title, assignee, dueDate, status: "To Do" });
      toast({ title: "Tarefa Adicionada" });
    }
    setIsDialogOpen(false);
  };

  const handleOpenDialog = (task: Task | null = null) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleDelete = (taskId: string) => {
    deleteTask(taskId);
    toast({ title: "Tarefa Excluída", variant: "destructive" });
  };

  const filteredTasks = tasks.filter(task => {
    if (userRole === 'Student') {
        // Students see tasks assigned to them (by name or "Você")
        return task.assignee === user.name || task.assignee === 'Você';
    }
    // Trainers and Gyms see all tasks
    return true;
  });

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Editar Tarefa' : 'Adicionar Nova Tarefa'}</DialogTitle>
            <DialogDescription>Preencha os detalhes abaixo para criar uma nova tarefa.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" defaultValue={editingTask?.title} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignee">Responsável</Label>
              <Input id="assignee" name="assignee" defaultValue={editingTask?.assignee} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Data de Vencimento</Label>
              <Input id="dueDate" name="dueDate" type="date" defaultValue={editingTask?.dueDate} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit">{editingTask ? 'Salvar Alterações' : 'Adicionar Tarefa'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
          <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Nova Tarefa
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Tarefas</CardTitle>
            <CardDescription>Gerencie e acompanhe todas as tarefas atribuídas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <span className="sr-only">Concluir</span>
                  </TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Responsável</TableHead>
                  <TableHead className="hidden sm:table-cell">Vencimento</TableHead>
                  <TableHead className="w-[50px]">
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map(task => (
                  <TableRow key={task.id} className={task.status === 'Done' ? 'text-muted-foreground line-through' : ''}>
                    <TableCell>
                      <Checkbox 
                        aria-label={`Selecionar tarefa ${task.id}`} 
                        checked={task.status === 'Done'}
                        onCheckedChange={(checked) => toggleTaskStatus(task.id, Boolean(checked))}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={statusVariant[task.status]?.variant || "default"} className="capitalize">
                        {statusVariant[task.status].text}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{task.assignee}</TableCell>
                    <TableCell className="hidden sm:table-cell">{task.dueDate}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => handleOpenDialog(task)}>
                            <Edit className="mr-2 h-4 w-4"/>Editar Tarefa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={e => e.preventDefault()} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4"/>Excluir Tarefa
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                    <AlertDialogDescription>Esta ação excluirá permanentemente esta tarefa.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(task.id)}>Confirmar</AlertDialogAction>
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
