
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useUserRole } from '@/contexts/user-role-context';
import { useToast } from '@/hooks/use-toast';
import { getStudentTransactions, getStudentSubscription, StudentSubscription, Transaction, cancelSubscription, generateMockTransactions } from '@/lib/finance-manager';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
};

const statusDetails: { [key in StudentSubscription['status']]: { text: string; icon: React.ElementType; className: string } } = {
  Ativo: { text: "Assinatura Ativa", icon: CheckCircle, className: "text-green-500" },
  Pendente: { text: "Pagamento Pendente", icon: Clock, className: "text-yellow-500" },
  Atrasado: { text: "Pagamento Atrasado", icon: AlertCircle, className: "text-destructive" },
  Cancelado: { text: "Assinatura Cancelada", icon: AlertCircle, className: "text-muted-foreground" },
};

export default function BillingPage() {
    const { user } = useUserRole();
    const { toast } = useToast();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [subscription, setSubscription] = useState<StudentSubscription | null>(null);

    useEffect(() => {
        // Fetch data on the client to avoid hydration issues with dates/random data
        generateMockTransactions(); // Ensure mock data is available
        setTransactions(getStudentTransactions(user.id));
        setSubscription(getStudentSubscription(user.id));
    }, [user.id]);

    const handleCancelSubscription = () => {
        cancelSubscription(user.id);
        setSubscription(getStudentSubscription(user.id)); // Refresh subscription state
        toast({
            title: "Assinatura Cancelada",
            description: "Sua assinatura foi cancelada. Você ainda terá acesso até o final do período de pagamento atual.",
            variant: "destructive",
        });
    };
    
    if (!subscription) {
        return (
            <div className="flex flex-col gap-6">
                 <h1 className="text-3xl font-bold tracking-tight">Minha Mensalidade</h1>
                 <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                        <p>Você não possui uma assinatura ativa no momento.</p>
                    </CardContent>
                 </Card>
            </div>
        );
    }
    
    const { icon: StatusIcon, text: statusText, className: statusClassName } = statusDetails[subscription.status];

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight">Minha Mensalidade</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>Visão Geral da Assinatura</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-3">
                    <div className="flex flex-col gap-1">
                        <Label className="text-sm text-muted-foreground">Plano Atual</Label>
                        <p className="text-lg font-semibold">{subscription.planName}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-sm text-muted-foreground">Status</Label>
                        <div className="flex items-center gap-2">
                             <StatusIcon className={`h-5 w-5 ${statusClassName}`} />
                             <p className={`text-lg font-semibold ${statusClassName}`}>{statusText}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-sm text-muted-foreground">Próximo Vencimento</Label>
                        <p className="text-lg font-semibold">
                            {subscription.status !== 'Cancelado' ? format(subscription.nextDueDate, "dd 'de' MMMM, yyyy", { locale: ptBR }) : 'Não aplicável'}
                        </p>
                    </div>
                </CardContent>
                <CardFooter>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="destructive" disabled={subscription.status === 'Cancelado'}>Cancelar Assinatura</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta ação irá cancelar sua assinatura. Você manterá o acesso até o final do seu ciclo de faturamento atual. Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Voltar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleCancelSubscription}>Sim, Cancelar Assinatura</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Pagamentos</CardTitle>
                    <CardDescription>Veja todas as suas transações anteriores.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Valor</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map(t => (
                                <TableRow key={t.id}>
                                    <TableCell>{format(parseISO(t.date), "dd/MM/yyyy")}</TableCell>
                                    <TableCell>Pagamento - {t.plan}</TableCell>
                                    <TableCell><Badge variant={t.status === 'Pago' ? 'default' : t.status === 'Pendente' ? 'secondary' : 'destructive'}>{t.status}</Badge></TableCell>
                                    <TableCell className="text-right">{formatCurrency(t.amount)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
