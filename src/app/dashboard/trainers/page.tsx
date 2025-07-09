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

const trainers = [
  {
    name: "John Carter",
    email: "john.carter@email.com",
    avatar: "https://placehold.co/100x100.png",
    initials: "JC",
    status: "Active",
    clients: 15,
  },
  {
    name: "Sophie Brown",
    email: "sophie.brown@email.com",
    avatar: "https://placehold.co/100x100.png",
    initials: "SB",
    status: "Active",
    clients: 12,
  },
  {
    name: "Michael Rodriguez",
    email: "michael.r@email.com",
    avatar: "https://placehold.co/100x100.png",
    initials: "MR",
    status: "On Leave",
    clients: 5,
  },
  {
    name: "Sarah Miller",
    email: "sarah.m@email.com",
    avatar: "https://placehold.co/100x100.png",
    initials: "SM",
    status: "Active",
    clients: 18,
  },
];


export default function TrainersPage() {
    return (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Manage Trainers</h1>
             <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Trainer
            </Button>
          </div>
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
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trainers.map((trainer) => (
                        <TableRow key={trainer.email}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src={trainer.avatar} alt={trainer.name} data-ai-hint="person portrait" />
                                <AvatarFallback>{trainer.initials}</AvatarFallback>
                              </Avatar>
                              <div className="grid gap-0.5">
                                <p className="font-medium">{trainer.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {trainer.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant={trainer.status === "Active" ? "default" : "secondary"}>
                              {trainer.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{trainer.clients}</TableCell>
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
                                <DropdownMenuItem>View Schedule</DropdownMenuItem>
                                <DropdownMenuItem>Assign Member</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  Remove Trainer
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
