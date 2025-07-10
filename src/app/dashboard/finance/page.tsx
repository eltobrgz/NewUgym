
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
import { MoreHorizontal, Download, FileText, CheckCircle, AlertTriangle, XCircle, Eye } from "lucide-react";
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
  { id: "TRN-001", member: "Olivia Martin", amount: 99.99, status: "Paid", date: "2024-07-28", plan: "Pro Annual" },
  { id: "TRN-002", member: "Jackson Lee", amount: 29.99, status: "Pending", date: "2024-08-01", plan: "Pro Monthly" },
  { id: "TRN-003", member: "Isabella Nguyen", amount: 15.00, status: "Overdue", date: "2024-07-10", plan: "Basic Monthly" },
  { id: "TRN-004", member: "William Kim", amount: 99.99, status: "Paid", date: "2024-07-25", plan: "Pro Annual" },
  { id: "TRN-005", member: "Sofia Davis", amount: 29.99, status: "Paid", date: "2024-07-18", plan: "Pro Monthly" },
  { id: "TRN-006", member: "David Chen", amount: 29.99, status: "Pending", date: "2024-08-02", plan: "Pro Monthly" },
];

const statusStyles: { [key in TransactionStatus]: { variant: "default" | "secondary" | "destructive" | "outline", className?: string }} = {
  "Paid": { variant: "secondary", className: "bg-green-500/10 text-green-400 border-green-500/20" },
  "Pending": { variant: "secondary", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  "Overdue": { variant: "destructive" },
};

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();

  const handleStatusChange = (id: string, newStatus: TransactionStatus) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    toast({ title: "Status Updated", description: `Transaction ${id} has been marked as ${newStatus}.` });
  };

  const handleCancelTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({ title: "Transaction Canceled", description: `Transaction ${id} has been removed.`, variant: "destructive" });
  };
  
  const handleExport = (type: 'CSV' | 'Report') => {
      toast({
          title: "Export Started",
          description: `Your ${type} file is being generated and will be downloaded shortly.`
      })
  }

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
             <Button className="w-full" onClick={() => handleExport('Report')}>
              <FileText className="mr-2 h-4 w-4" />
              Gerar Relatório
            </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Faturamento Total (Mês)</CardTitle>
            <CardDescription>Soma de todas as transações pagas em Agosto.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R$ 2.548,75</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pagamentos Pendentes</CardTitle>
            <CardDescription>Valor total de mensalidades aguardando pagamento.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R$ 598,50</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inadimplência</CardTitle>
            <CardDescription>Valor total de mensalidades atrasadas.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">R$ 125,90</p>
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
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">R$ {transaction.amount.toFixed(2)}</TableCell>
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
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>This will permanently cancel the transaction for {transaction.member}.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleCancelTransaction(transaction.id)}>Confirm</AlertDialogAction>
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
