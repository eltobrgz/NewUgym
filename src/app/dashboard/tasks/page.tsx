
"use client";

import { useState } from "react";
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

type TaskStatus = "To Do" | "In Progress" | "Done" | "Canceled";
type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  assignee: string;
  dueDate: string;
};

const initialTasks: Task[] = [
  { id: "TASK-8782", title: "Plan next month's workout cycle", status: "In Progress", assignee: "You", dueDate: "2024-08-10" },
  { id: "TASK-7878", title: "Follow up with new student", status: "To Do", assignee: "You", dueDate: "2024-08-05" },
  { id: "TASK-4582", title: "Renew gym membership", status: "Done", assignee: "Alex", dueDate: "2024-07-30" },
  { id: "TASK-1245", title: "Update client progress charts", status: "Canceled", assignee: "You", dueDate: "2024-08-02" },
  { id: "TASK-9874", title: "Prepare for yoga seminar", status: "To Do", assignee: "Jane", dueDate: "2024-08-14" },
  { id: "TASK-3456", title: "Clean and check squat rack", status: "Done", assignee: "Gym Staff", dueDate: "2024-08-01" },
];

const statusVariant: { [key in TaskStatus]: "default" | "secondary" | "destructive" | "outline" } = {
  "In Progress": "secondary",
  "To Do": "outline",
  "Done": "default",
  "Canceled": "destructive",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
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
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, title, assignee, dueDate } : t));
      toast({ title: "Task Updated" });
      setEditingTask(null);
    } else {
      // Add new task
      const newTask: Task = {
        id: `TASK-${Date.now()}`,
        title,
        assignee,
        dueDate,
        status: "To Do",
      };
      setTasks([newTask, ...tasks]);
      toast({ title: "Task Added" });
    }
    setIsDialogOpen(false);
  };

  const handleOpenDialog = (task: Task | null = null) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };
  
  const handleToggleStatus = (taskId: string, isChecked: boolean) => {
      setTasks(tasks.map(t => t.id === taskId ? {...t, status: isChecked ? 'Done' : 'To Do'} : t))
  }

  const handleDelete = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    toast({ title: "Task Deleted", variant: "destructive" });
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
            <DialogDescription>Fill in the details below to create a new task.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={editingTask?.title} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Input id="assignee" name="assignee" defaultValue={editingTask?.assignee} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" name="dueDate" type="date" defaultValue={editingTask?.dueDate} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{editingTask ? 'Save Changes' : 'Add Task'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Task
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Task List</CardTitle>
            <CardDescription>Manage and track all assigned tasks.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <span className="sr-only">Complete</span>
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Assignee</TableHead>
                  <TableHead className="hidden sm:table-cell">Due Date</TableHead>
                  <TableHead className="w-[50px]">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map(task => (
                  <TableRow key={task.id} className={task.status === 'Done' ? 'text-muted-foreground line-through' : ''}>
                    <TableCell>
                      <Checkbox 
                        aria-label={`Select task ${task.id}`} 
                        checked={task.status === 'Done'}
                        onCheckedChange={(checked) => handleToggleStatus(task.id, Boolean(checked))}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={statusVariant[task.status] || "default"} className="capitalize">
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{task.assignee}</TableCell>
                    <TableCell className="hidden sm:table-cell">{task.dueDate}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => handleOpenDialog(task)}>
                            <Edit className="mr-2 h-4 w-4"/>Edit Task
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={e => e.preventDefault()} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4"/>Delete Task
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>This action will permanently delete this task.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(task.id)}>Confirm</AlertDialogAction>
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
