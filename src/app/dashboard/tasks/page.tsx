"use client";

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
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const tasks = [
  { id: "TASK-8782", title: "Plan next month's workout cycle", status: "In Progress", assignee: "You", dueDate: "2024-08-10" },
  { id: "TASK-7878", title: "Follow up with new student", status: "To Do", assignee: "You", dueDate: "2024-08-05" },
  { id: "TASK-4582", title: "Renew gym membership", status: "Done", assignee: "Alex", dueDate: "2024-07-30" },
  { id: "TASK-1245", title: "Update client progress charts", status: "Canceled", assignee: "You", dueDate: "2024-08-02" },
  { id: "TASK-9874", title: "Prepare for yoga seminar", status: "To Do", assignee: "Jane", dueDate: "2024-08-14" },
  { id: "TASK-3456", title: "Clean and check squat rack", status: "Done", assignee: "Gym Staff", dueDate: "2024-08-01" },
];

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  "In Progress": "secondary",
  "To Do": "outline",
  "Done": "default",
  "Canceled": "destructive",
};

export default function TasksPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <Button>
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
                <TableHead className="w-[50px] hidden sm:table-cell">
                  <Checkbox aria-label="Select all tasks" />
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
                <TableRow key={task.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Checkbox aria-label={`Select task ${task.id}`} />
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
                        <DropdownMenuItem>Edit Task</DropdownMenuItem>
                        <DropdownMenuItem>Change Status</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete Task
                        </DropdownMenuItem>
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
