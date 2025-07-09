
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

const members = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    avatar: "https://placehold.co/100x100.png",
    initials: "OM",
    status: "Active",
    plan: "Pro Annual",
    joinDate: "2023-07-15",
  },
  {
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    avatar: "https://placehold.co/100x100.png",
    initials: "JL",
    status: "Active",
    plan: "Pro Monthly",
    joinDate: "2023-08-20",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    avatar: "https://placehold.co/100x100.png",
    initials: "IN",
    status: "Inactive",
    plan: "Basic Monthly",
    joinDate: "2023-03-10",
  },
  {
    name: "William Kim",
    email: "will@email.com",
    avatar: "https://placehold.co/100x100.png",
    initials: "WK",
    status: "Active",
    plan: "Pro Annual",
    joinDate: "2024-01-05",
  },
  {
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    avatar: "https://placehold.co/100x100.png",
    initials: "SD",
    status: "Active",
    plan: "Pro Monthly",
    joinDate: "2024-02-18",
  },
];

export default function MembersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Manage Members</h1>
        <Button className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Member
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gym Members</CardTitle>
          <CardDescription>View and manage all gym members.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Plan</TableHead>
                <TableHead className="hidden md:table-cell">Join Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.email}>
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
                    <Badge variant={member.status === "Active" ? "default" : "secondary"}>
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Membership</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Deactivate
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
