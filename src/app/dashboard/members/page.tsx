
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MoreHorizontal, PlusCircle, Edit, Trash2 } from "lucide-react";
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

type Member = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  initials: string;
  status: "Active" | "Inactive";
  plan: string;
  joinDate: string;
};

const initialMembers: Member[] = [
  { id: "mem-1", name: "Olivia Martin", email: "olivia.martin@email.com", avatar: "https://placehold.co/100x100.png", initials: "OM", status: "Active", plan: "Pro Annual", joinDate: "2023-07-15" },
  { id: "mem-2", name: "Jackson Lee", email: "jackson.lee@email.com", avatar: "https://placehold.co/100x100.png", initials: "JL", status: "Active", plan: "Pro Monthly", joinDate: "2023-08-20" },
  { id: "mem-3", name: "Isabella Nguyen", email: "isabella.nguyen@email.com", avatar: "https://placehold.co/100x100.png", initials: "IN", status: "Inactive", plan: "Basic Monthly", joinDate: "2023-03-10" },
  { id: "mem-4", name: "William Kim", email: "will@email.com", avatar: "https://placehold.co/100x100.png", initials: "WK", status: "Active", plan: "Pro Annual", joinDate: "2024-01-05" },
  { id: "mem-5", name: "Sofia Davis", email: "sofia.davis@email.com", avatar: "https://placehold.co/100x100.png", initials: "SD", status: "Active", plan: "Pro Monthly", joinDate: "2024-02-18" },
];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>, memberId?: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const plan = formData.get("plan") as string;

    if (memberId) {
      // Editing
      setMembers(members.map(m => m.id === memberId ? { ...m, name, email, plan } : m));
      toast({ title: "Member Updated", description: "The member's information has been saved." });
      setEditingMember(null);
    } else {
      // Adding
      const newMember: Member = {
        id: `mem-${Date.now()}`,
        name,
        email,
        plan,
        avatar: "https://placehold.co/100x100.png",
        initials: name.split(" ").map(n => n[0]).join("").toUpperCase(),
        status: "Active",
        joinDate: new Date().toISOString().split("T")[0],
      };
      setMembers([newMember, ...members]);
      toast({ title: "Member Added!", description: `${name} has been added.` });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeactivate = (memberId: string) => {
    setMembers(members.map(m => m.id === memberId ? { ...m, status: 'Inactive' } : m));
    toast({ title: "Member Deactivated", variant: "destructive" });
  };

  return (
    <>
      <Dialog open={isAddDialogOpen || !!editingMember} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setIsAddDialogOpen(false);
          setEditingMember(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMember ? "Edit Member" : "Add New Member"}</DialogTitle>
            <DialogDescription>Fill in the member's details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => handleFormSubmit(e, editingMember?.id)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" defaultValue={editingMember?.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={editingMember?.email} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Membership Plan</Label>
              <Input id="plan" name="plan" defaultValue={editingMember?.plan} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setIsAddDialogOpen(false); setEditingMember(null); }}>Cancel</Button>
              <Button type="submit">{editingMember ? "Save Changes" : "Add Member"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Manage Members</h1>
          <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
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
                          <DropdownMenuItem onSelect={() => setEditingMember(member)}>
                            <Edit className="mr-2 h-4 w-4"/>Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4"/>Deactivate
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will mark {member.name} as inactive. They will lose access to the gym facilities.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeactivate(member.id)}>Confirm Deactivation</AlertDialogAction>
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
