
"use client";

import { useState } from 'react';
import Link from 'next/link';
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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

type Student = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  initials: string;
  lastActive: string;
  progress: number;
};

const initialStudents: Student[] = [
  { id: "alex-johnson", name: "Alex Johnson", email: "alex.j@email.com", avatar: "https://placehold.co/100x100.png", initials: "AJ", lastActive: "2 days ago", progress: 75 },
  { id: "maria-garcia", name: "Maria Garcia", email: "maria.g@email.com", avatar: "https://placehold.co/100x100.png", initials: "MG", lastActive: "Today", progress: 90 },
  { id: "david-chen", name: "David Chen", email: "david.c@email.com", avatar: "https://placehold.co/100x100.png", initials: "DC", lastActive: "1 week ago", progress: 40 },
  { id: "emily-white", name: "Emily White", email: "emily.w@email.com", avatar: "https://placehold.co/100x100.png", initials: "EW", lastActive: "Yesterday", progress: 60 },
];

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const { toast } = useToast();

  const handleAddStudent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    const newStudent: Student = {
      id: `student-${Date.now()}`,
      name,
      email,
      avatar: "https://placehold.co/100x100.png",
      initials: name.split(' ').map(n => n[0]).join(''),
      lastActive: "Just now",
      progress: 0,
    };
    setStudents(prev => [newStudent, ...prev]);
    setIsAddDialogOpen(false);
    toast({ title: "Student Added!", description: `${name} has been added to your roster.` });
  };

  const handleEditStudent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingStudent) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    
    setStudents(prev => prev.map(s => s.id === editingStudent.id ? { ...s, name, email } : s));
    setEditingStudent(null);
    toast({ title: "Student Updated", description: "The information has been saved." });
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    toast({ title: "Student Removed", variant: 'destructive' });
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Manage Students</h1>
        <div className="flex items-center gap-2">
            <div className="flex items-center rounded-md bg-muted p-1">
                <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('list')}><List className="h-5 w-5"/></Button>
                <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('grid')}><LayoutGrid className="h-5 w-5"/></Button>
            </div>
             <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Student</DialogTitle>
                      <DialogDescription>Fill in the details to add a new student.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddStudent} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required />
                      </div>
                      <DialogFooter>
                        <Button type="submit">Add Student</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
        </div>
      </div>

       <Dialog open={!!editingStudent} onOpenChange={(isOpen) => !isOpen && setEditingStudent(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Student</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEditStudent} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name-edit">Full Name</Label>
                        <Input id="name-edit" name="name" defaultValue={editingStudent?.name} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email-edit">Email</Label>
                        <Input id="email-edit" name="email" type="email" defaultValue={editingStudent?.email} required />
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
          <CardTitle>Student Roster</CardTitle>
          <CardDescription>View and manage your assigned students.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead className="hidden sm:table-cell">Last Active</TableHead>
                <TableHead>Workout Progress</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={student.avatar} alt={student.name} data-ai-hint="person portrait" />
                        <AvatarFallback>{student.initials}</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-0.5">
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{student.lastActive}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Progress value={student.progress} className="h-2 w-16 sm:w-[100px]" />
                      <span className="text-sm text-muted-foreground">{student.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild><Link href={`/dashboard/students/${student.id}/progress`}>View Progress</Link></DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setEditingStudent(student)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Assign Workout</DropdownMenuItem>
                         <DropdownMenuSeparator />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">Remove Student</DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>This will permanently remove {student.name}. This action cannot be undone.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteStudent(student.id)}>Confirm</AlertDialogAction>
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
            {students.map(student => (
                <Card key={student.id}>
                    <CardHeader className="items-center text-center">
                        <Avatar className="h-20 w-20 mb-2">
                            <AvatarImage src={student.avatar} alt={student.name} data-ai-hint="person portrait" />
                            <AvatarFallback>{student.initials}</AvatarFallback>
                        </Avatar>
                        <CardTitle>{student.name}</CardTitle>
                        <CardDescription>Last active: {student.lastActive}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <div className="w-full px-4">
                          <Progress value={student.progress} className="h-2" />
                          <p className="text-sm text-muted-foreground mt-2">{student.progress}% progress</p>
                        </div>
                        <Button variant="link" size="sm" asChild className="mt-2"><Link href={`/dashboard/students/${student.id}/progress`}>View Details</Link></Button>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}
    </div>
  );
}
