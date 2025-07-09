
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
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const students = [
  {
    name: "Alex Johnson",
    email: "alex.j@email.com",
    avatar: "https://placehold.co/100x100.png",
    initials: "AJ",
    lastActive: "2 days ago",
    progress: 75,
  },
  {
    name: "Maria Garcia",
    email: "maria.g@email.com",
    avatar: "https://placehold.co/100x100.png",
    initials: "MG",
    lastActive: "Today",
    progress: 90,
  },
  {
    name: "David Chen",
    email: "david.c@email.com",
    avatar: "https://placehold.co/100x100.png",
    initials: "DC",
    lastActive: "1 week ago",
    progress: 40,
  },
  {
    name: "Emily White",
    email: "emily.w@email.com",
    avatar: "https://placehold.co/100x100.png",
    initials: "EW",
    lastActive: "Yesterday",
    progress: 60,
  },
];

export default function StudentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Manage Students</h1>
        <Button className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Student
        </Button>
      </div>
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
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.email}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={student.avatar} alt={student.name} data-ai-hint="person portrait" />
                        <AvatarFallback>{student.initials}</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-0.5">
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {student.email}
                        </p>
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
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Progress</DropdownMenuItem>
                        <DropdownMenuItem>Assign Workout</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
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
  );
}
