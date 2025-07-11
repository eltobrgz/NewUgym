
"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
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
  CardFooter,
} from "@/components/ui/card";
import { MoreHorizontal, Download, FileText, CheckCircle, AlertTriangle, XCircle, Eye, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allUsers } from "@/lib/user-directory";


type TransactionStatus = "Pago" | "Pendente" | "Atrasado";
type TransactionType = "Primeiro Pagamento" | "Renovação";

type Transaction = {
  id: string;
  member: string; // Member name for simplicity, in a real app this would be an ID
  memberId: string;
  amount: number;
  status: TransactionStatus;
  type: TransactionType;
  date: string;
  plan: string; // Plan name
};

type MembershipPlan = {
  id: string;
  name: string;
  price: number;
  recurrence: "Mensal" | "Anual";
};

const initialMembers = allUsers.filter(u => u.role === 'Student').slice(0, 8).map(u => ({id: u.id, name: u.name}));

const initialPlans: MembershipPlan[] = [
    { id: 'plan-1', name: 'Pro Anual', price: 999.90, recurrence: 'Anual' },
    { id: 'plan-2', name: 'Pro Mensal', price: 99.90, recurrence: 'Mensal' },
    { id: 'plan-3', name: 'Básico Mensal', price: 59.90, recurrence: 'Mensal' },
];


const initialTransactions: Transaction[] = [
  { id: "TRN-001", memberId: "olivia.martin", member: "Olivia Martin", amount: 999.90, status: "Pago", type: "Renovação", date: "2024-07-28", plan: "Pro Anual" },
  { id: "TRN-002", memberId: "jackson.lee", member: "Jackson Lee", amount: 99.90, status: "Pendente", type: "Renovação", date: "2024-08-01", plan: "Pro Mensal" },
  { id: "TRN-003", memberId: "isabella.nguyen", member: "Isabella Nguyen", amount: 59.90, status: "Atrasado", type: "Primeiro Pagamento", date: "2024-07-10", plan: "Básico Mensal" },
  { id: "TRN-004", memberId: "alex-johnson", member: "Alex Johnson", amount: 999.90, status: "Pago", type: "Primeiro Pagamento", date: "2024-07-25", plan: "Pro Anual" },
  { id: "TRN-005", memberId: "sofia-davis", member: "Sofia Davis", amount: 99.90, status: "Pago", type: "Renovação", date: "2024-07-18", plan: "Pro Mensal" },
  { id: "TRN-006", memberId: "david-chen", member: "David Chen", amount: 99.90, status: "Pendente", type: "Renovação", date: "2024-08-02", plan: "Pro Mensal" },
  { id: "TRN-007", memberId: "maria-garcia", member: "Maria Garcia", amount: 59.90, status: "Pago", type: "Renovação", date: "2024-07-15", plan: "Básico Mensal" },
  { id: "TRN-008", memberId: "emily-white", member: "Emily White", amount: 99.90, status: "Atrasado", type: "Renovação", date: "2024-07-05", plan: "Pro Mensal" },
];

const statusStyles: { [key in TransactionStatus]: { variant: "default" | "secondary" | "destructive" | "outline", className?: string, text: string }} = {
  "Pago": { variant: "secondary", className: "bg-green-500/10 text-green-400 border-green-500/20", text: "Pago" },
  "Pendente": { variant: "secondary", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", text: "Pendente" },
  "Atrasado": { variant: "destructive", text: "Atrasado" },
};

const AddTransactionDialog = ({ open, onOpenChange, prefilledMemberId, onAdd, plans, members }: { open: boolean, onOpenChange: (open: boolean) => void, prefilledMemberId: string, onAdd: (t: Transaction) => void, plans: MembershipPlan[], members: {id: string, name: string}[] }) => {
    const [selectedPlanId, setSelectedPlanId] = useState<string>('');
    const [amount, setAmount] = useState<string>('');

    useEffect(() => {
        if (open && prefilledMemberId) {
            // Reset state when dialog opens
            setSelectedPlanId('');
            setAmount('');
        }
    }, [open, prefilledMemberId]);
    
    const handlePlanChange = (planId: string) => {
        const plan = plans.find(p => p.id === planId);
        if(plan) {
            setSelectedPlanId(planId);
            setAmount(plan.price.toString());
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const memberId = formData.get("memberId") as string;
        const selectedMember = members.find(m => m.id === memberId);
        const selectedPlan = plans.find(p => p.id === selectedPlanId);

        if(!selectedMember || !selectedPlan) return;
    
        const newTransaction: Transaction = {
            id: `TRN-${Date.now()}`,
            member: selectedMember.name,
            memberId: selectedMember.id,
            amount: parseFloat(amount),
            status: formData.get("status") as TransactionStatus,
            type: formData.get("type") as TransactionType,
            date: formData.get("date") as string,
            plan: selectedPlan.name,
        }

        onAdd(newTransaction);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Transação
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar Nova Transação</DialogTitle>
                    <DialogDescription>Preencha os detalhes para criar um novo registro de transação.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="memberId">Membro</Label>
                        <Select name="memberId" required defaultValue={prefilledMemberId}>
                            <SelectTrigger id="memberId">
                                <SelectValue placeholder="Selecione um membro" />
                            </SelectTrigger>
                            <SelectContent>
                                {members.map(member => (
                                    <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="planId">Plano</Label>
                        <Select name="planId" required onValueChange={handlePlanChange}>
                            <SelectTrigger id="planId">
                                <SelectValue placeholder="Selecione um plano" />
                            </SelectTrigger>
                            <SelectContent>
                                {plans.map(plan => (
                                    <SelectItem key={plan.id} value={plan.id}>{plan.name} - {formatCurrency(plan.price)}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                            <Label htmlFor="amount">Valor (R$)</Label>
                            <Input id="amount" name="amount" type="number" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Data</Label>
                            <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} required />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select name="status" required defaultValue="Pago">
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pago">Pago</SelectItem>
                                    <SelectItem value="Pendente">Pendente</SelectItem>
                                    <SelectItem value="Atrasado">Atrasado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Tipo</Label>
                            <Select name="type" required defaultValue={prefilledMemberId ? "Primeiro Pagamento" : "Renovação"}>
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Primeiro Pagamento">Primeiro Pagamento</SelectItem>
                                    <SelectItem value="Renovação">Renovação</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                     </div>
                    <DialogFooter>
                        <Button type="submit">Adicionar Transação</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

const AddPlanDialog = ({ onAdd }: { onAdd: (plan: MembershipPlan) => void }) => {
    const [open, setOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newPlan: MembershipPlan = {
            id: `plan-${Date.now()}`,
            name: formData.get('name') as string,
            price: parseFloat(formData.get('price') as string),
            recurrence: formData.get('recurrence') as "Mensal" | "Anual",
        };
        onAdd(newPlan);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Novo Plano
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar Novo Plano</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Plano</Label>
                        <Input id="name" name="name" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="price">Preço (R$)</Label>
                        <Input id="price" name="price" type="number" step="0.01" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="recurrence">Recorrência</Label>
                        <Select name="recurrence" required defaultValue="Mensal">
                            <SelectTrigger id="recurrence"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Mensal">Mensal</SelectItem>
                                <SelectItem value="Anual">Anual</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter><Button type="submit">Salvar Plano</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};


const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
}

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [plans, setPlans] = useState<MembershipPlan[]>(initialPlans);
  const [members, setMembers] = useState(initialMembers);
  const [filter, setFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [prefilledMemberId, setPrefilledMemberId] = useState('');
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();


  useEffect(() => {
    const newMemberId = searchParams.get('new_member_id');
    if (newMemberId) {
      setPrefilledMemberId(decodeURIComponent(newMemberId));
      setIsAddDialogOpen(true);
      router.replace('/dashboard/finance', {scroll: false});
    }
  }, [searchParams, router]);

  const summary = useMemo(() => {
    return transactions.reduce((acc, t) => {
        if (t.status === 'Pago') acc.paid += t.amount;
        if (t.status === 'Pendente') acc.pending += t.amount;
        if (t.status === 'Atrasado') acc.overdue += t.amount;
        return acc;
    }, { paid: 0, pending: 0, overdue: 0 });
  }, [transactions]);
  

  const handleStatusChange = (id: string, newStatus: TransactionStatus) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    toast({ title: "Status Atualizado", description: `A transação ${id} foi marcada como ${newStatus}.` });
  };

  const handleCancelTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({ title: "Transação Cancelada", description: `A transação ${id} foi removida.`, variant: "destructive" });
  };
  
  const handleExport = (type: 'CSV') => {
      toast({
          title: "Exportação Iniciada",
          description: `Seu arquivo ${type} está sendo gerado e será baixado em breve.`
      })
  }

  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions(prev => [newTransaction, ...prev]);
    toast({ title: "Transação Adicionada", description: `Nova transação para ${newTransaction.member} foi criada.` });
    setIsAddDialogOpen(false);
    setPrefilledMemberId('');
  };
  
  const handleAddPlan = (newPlan: MembershipPlan) => {
      setPlans(prev => [...prev, newPlan]);
      toast({ title: "Plano Adicionado", description: `O plano ${newPlan.name} foi criado.` });
  }

  const filteredTransactions = transactions.filter(t => {
    if (filter === "all") return true;
    const statusMap = {
        paid: "Pago",
        pending: "Pendente",
        overdue: "Atrasado"
    };
    return t.status === (statusMap[filter as keyof typeof statusMap] || "");
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
        <div className="flex w-full sm:w-auto gap-2">
            <Button variant="outline" className="w-full" onClick={() => handleExport('CSV')}>
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
            <AddTransactionDialog 
                open={isAddDialogOpen}
                onOpenChange={(isOpen) => {
                    setIsAddDialogOpen(isOpen);
                    if (!isOpen) setPrefilledMemberId('');
                }}
                prefilledMemberId={prefilledMemberId}
                onAdd={handleAddTransaction}
                plans={plans}
                members={members}
            />
        </div>
      </div>
      
      <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Faturamento Total</CardTitle>
                <CardDescription>Soma de todas as transações pagas.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{formatCurrency(summary.paid)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pagamentos Pendentes</CardTitle>
                <CardDescription>Valor total aguardando pagamento.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{formatCurrency(summary.pending)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Inadimplência</CardTitle>
                <CardDescription>Valor total de mensalidades atrasadas.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-destructive">{formatCurrency(summary.overdue)}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <CardTitle>Histórico de Transações</CardTitle>
                  <CardDescription>Visualize e gerencie todos os pagamentos.</CardDescription>
                </div>
                <div className="w-full sm:w-auto">
                  <Tabs defaultValue="all" onValueChange={setFilter} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="all">Todos</TabsTrigger>
                      <TabsTrigger value="paid">Pago</TabsTrigger>
                      <TabsTrigger value="pending">Pendente</TabsTrigger>
                      <TabsTrigger value="overdue">Atrasado</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Membro</TableHead>
                    <TableHead className="hidden sm:table-cell">Plano</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>
                      <span className="sr-only">Ações</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.member}</TableCell>
                      <TableCell className="hidden sm:table-cell">{transaction.plan}</TableCell>
                       <TableCell>
                          <Badge variant={transaction.type === 'Primeiro Pagamento' ? 'default' : 'secondary'} className={cn(transaction.type === 'Primeiro Pagamento' && 'bg-blue-500/10 text-blue-400 border-blue-500/20')}>
                            {transaction.type}
                          </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusStyles[transaction.status]?.variant || "default"} className={cn(statusStyles[transaction.status]?.className)}>
                          {statusStyles[transaction.status]?.text}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem><Eye className="mr-2 h-4 w-4"/>Ver Detalhes</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => handleStatusChange(transaction.id, 'Pago')} disabled={transaction.status === 'Pago'}>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Marcar como Pago
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleStatusChange(transaction.id, 'Pendente')} disabled={transaction.status === 'Pendente'}>
                                <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />Marcar como Pendente
                            </DropdownMenuItem>
                             <DropdownMenuSeparator />
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                      <XCircle className="mr-2 h-4 w-4"/> Cancelar Transação
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                        <AlertDialogDescription>Isso cancelará permanentemente a transação para {transaction.member}.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleCancelTransaction(transaction.id)}>Confirmar</AlertDialogAction>
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
        
          <Card>
              <CardHeader>
                  <CardTitle>Planos de Assinatura</CardTitle>
                  <CardDescription>Gerencie os planos disponíveis.</CardDescription>
              </CardHeader>
              <CardContent>
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Plano</TableHead>
                              <TableHead className="text-right">Preço</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {plans.map(plan => (
                              <TableRow key={plan.id}>
                                  <TableCell className="font-medium">{plan.name} <Badge variant="outline" className="ml-2">{plan.recurrence}</Badge></TableCell>
                                  <TableCell className="text-right">{formatCurrency(plan.price)}</TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </CardContent>
              <CardFooter className="border-t pt-4">
                 <AddPlanDialog onAdd={handleAddPlan} />
              </CardFooter>
          </Card>
      </div>
    </div>
  );
}

    