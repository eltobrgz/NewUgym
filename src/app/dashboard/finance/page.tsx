
"use client";

import { useState, useMemo } from "react";
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


type TransactionStatus = "Paid" | "Pending" | "Overdue";
type Transaction = {
  id: string;
  member: string;
  amount: number;
  status: TransactionStatus;
  date: string;
  plan: string;
};

const initialTransactions: Transaction[] = [
  { id: "TRN-001", member: "Olivia Martin", amount: 99.99, status: "Paid", date: "2024-07-28", plan: "Pro Anual" },
  { id: "TRN-002", member: "Jackson Lee", amount: 29.99, status: "Pending", date: "2024-08-01", plan: "Pro Mensal" },
  { id: "TRN-003", member: "Isabella Nguyen", amount: 15.00, status: "Overdue", date: "2024-07-10", plan: "Básico Mensal" },
  { id: "TRN-004", member: "William Kim", amount: 99.99, status: "Paid", date: "2024-07-25", plan: "Pro Anual" },
  { id: "TRN-005", member: "Sofia Davis", amount: 29.99, status: "Paid", date: "2024-07-18", plan: "Pro Mensal" },
  { id: "TRN-006", member: "David Chen", amount: 29.99, status: "Pending", date: "2024-08-02", plan: "Pro Mensal" },
];

const statusStyles: { [key in TransactionStatus]: { variant: "default" | "secondary" | "destructive" | "outline", className?: string, text: string }} = {
  "Paid": { variant: "secondary", className: "bg-green-500/10 text-green-400 border-green-500/20", text: "Pago" },
  "Pending": { variant: "secondary", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", text: "Pendente" },
  "Overdue": { variant: "destructive", text: "Atrasado" },
};

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [filter, setFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const summary = useMemo(() => {
    return transactions.reduce((acc, t) => {
        if (t.status === 'Paid') acc.paid += t.amount;
        if (t.status === 'Pending') acc.pending += t.amount;
        if (t.status === 'Overdue') acc.overdue += t.amount;
        return acc;
    }, { paid: 0, pending: 0, overdue: 0 });
  }, [transactions]);
  
  const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
  }

  const handleStatusChange = (id: string, newStatus: TransactionStatus) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    toast({ title: "Status Atualizado", description: `A transação ${id} foi marcada como ${newStatus}.` });
  };

  const handleCancelTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({ title: "Transação Cancelada", description: `A transação ${id} foi removida.`, variant: "destructive" });
  };
  
  const handleExport = (type: 'CSV' | 'Relatório') => {
      toast({
          title: "Exportação Iniciada",
          description: `Seu arquivo ${type} está sendo gerado e será baixado em breve.`
      })
  }

  const handleAddTransaction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newTransaction: Transaction = {
        id: `TRN-${Date.now()}`,
        member: formData.get("member") as string,
        amount: parseFloat(formData.get("amount") as string),
        status: formData.get("status") as TransactionStatus,
        date: formData.get("date") as string,
        plan: formData.get("plan") as string,
    }

    setTransactions(prev => [newTransaction, ...prev]);
    toast({ title: "Transação Adicionada", description: `Nova transação para ${newTransaction.member} foi criada.` });
    setIsAddDialogOpen(false);
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter === "all") return true;
    return t.status.toLowerCase() === filter;
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
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Transação
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Nova Transação</DialogTitle>
                        <DialogDescription>Preencha os detalhes para criar um novo registro de transação.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddTransaction} className="space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="member">Membro</Label>
                                <Input id="member" name="member" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="plan">Plano</Label>
                                <Input id="plan" name="plan" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                                <Label htmlFor="amount">Valor (R$)</Label>
                                <Input id="amount" name="amount" type="number" step="0.01" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Data</Label>
                                <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} required />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select name="status" required defaultValue="Paid">
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Paid">Pago</SelectItem>
                                    <SelectItem value="Pending">Pendente</SelectItem>
                                    <SelectItem value="Overdue">Atrasado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Adicionar Transação</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <TableHead className="hidden md:table-cell">Data</TableHead>
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
                  <TableCell className="hidden md:table-cell">{transaction.date}</TableCell>
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
                        <DropdownMenuItem onSelect={() => handleStatusChange(transaction.id, 'Paid')} disabled={transaction.status === 'Paid'}>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Marcar como Pago
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleStatusChange(transaction.id, 'Pending')} disabled={transaction.status === 'Pending'}>
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
    </div>
  );
}
