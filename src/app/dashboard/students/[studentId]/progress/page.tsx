
'use client';

import { useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, ArrowRight, Weight, Ruler, HeartPulse, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

// Mock data for a specific student, you would fetch this based on params.studentId in a real app
const studentData: { [key: string]: any } = {
  'alex-johnson': {
    name: 'Alex Johnson',
    heightInCm: 180,
    progressData: [
      { date: '2024-05-01', weight: 90, bodyFat: 25, arm: 39, leg: 60, waist: 95 },
      { date: '2024-06-01', weight: 88, bodyFat: 23, arm: 39.5, leg: 61, waist: 92 },
      { date: '2024-07-01', weight: 86, bodyFat: 22, arm: 40, leg: 61.5, waist: 90 },
      { date: '2024-08-01', weight: 85, bodyFat: 21, arm: 40.5, leg: 62, waist: 88 },
    ],
    workoutProgress: 75,
  },
  'maria-garcia': {
    name: 'Maria Garcia',
    heightInCm: 165,
    progressData: [
      { date: '2024-05-01', weight: 65, bodyFat: 28, arm: 32, leg: 55, waist: 75 },
      { date: '2024-06-01', weight: 64, bodyFat: 27, arm: 32.5, leg: 55.5, waist: 73 },
      { date: '2024-07-01', weight: 62, bodyFat: 25, arm: 33, leg: 56, waist: 71 },
      { date: '2024-08-01', weight: 62, bodyFat: 24.5, arm: 33, leg: 56, waist: 70 },
    ],
    workoutProgress: 90,
  }
};

const calculateBmi = (weight: number, height: number) => {
    if(!height) return 0;
    return (weight / ((height / 100) * (height / 100))).toFixed(1);
}

const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Abaixo do peso", color: "bg-blue-500", variant: "default"};
    if (bmi < 24.9) return { category: "Peso normal", color: "bg-green-500", variant: "default"};
    if (bmi < 29.9) return { category: "Sobrepeso", color: "bg-yellow-500", variant: "secondary"};
    return { category: "Obesidade", color: "bg-red-500", variant: "destructive"};
}

const chartComponents = {
  line: LineChart,
  bar: BarChart,
  area: AreaChart,
};

const ChartComponent = ({ type, data, metric } : { type: keyof typeof chartComponents, data: any[], metric: string}) => {
  const Chart = chartComponents[type];
  const color = "hsl(var(--primary))";

  return (
    <ResponsiveContainer width="100%" height={300}>
      <Chart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
        <Legend />
        {type === 'line' && <Line type="monotone" dataKey={metric} stroke={color} strokeWidth={2} name={metric.charAt(0).toUpperCase() + metric.slice(1)} />}
        {type === 'bar' && <Bar dataKey={metric} fill={color} name={metric.charAt(0).toUpperCase() + metric.slice(1)} />}
        {type === 'area' && <Area type="monotone" dataKey={metric} stroke={color} fill={color} fillOpacity={0.3} name={metric.charAt(0).toUpperCase() + metric.slice(1)} />}
      </Chart>
    </ResponsiveContainer>
  );
};


export default function StudentProgressPage({ params }: { params: { studentId: string } }) {
  const [chartType, setChartType] = useState<keyof typeof chartComponents>('line');
  const [selectedMetric, setSelectedMetric] = useState('weight');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  
  // Use a fallback if studentId is not in mock data
  const data = studentData[params.studentId] || studentData['alex-johnson'];
  const { name, heightInCm, progressData, workoutProgress } = data;
  
  const currentWeight = progressData[progressData.length - 1].weight;
  const previousWeight = progressData[progressData.length - 2].weight;
  const weightTrend = currentWeight > previousWeight ? 'increase' : currentWeight < previousWeight ? 'decrease' : 'stable';
  const currentBmi = parseFloat(calculateBmi(currentWeight, heightInCm));
  const bmiInfo = getBmiCategory(currentBmi);


  const handleAddMetric = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you would add the metric to your state/DB for this specific student
    toast({
        title: "Medição Adicionada!",
        description: `As novas métricas para ${name} foram salvas com sucesso.`,
    });
    setIsModalOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Progresso de {name}</h1>
         <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Medição
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar Medição para {name}</DialogTitle>
                    <DialogDescription>Preencha as métricas mais recentes do aluno.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddMetric} className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="date">Data</Label>
                        <Input id="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="weight">Peso (kg)</Label>
                        <Input id="weight" type="number" step="0.1" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="bodyFat">Gordura Corporal (%)</Label>
                        <Input id="bodyFat" type="number" step="0.1" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="arm">Braço (cm)</Label>
                        <Input id="arm" type="number" step="0.1" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="leg">Perna (cm)</Label>
                        <Input id="leg" type="number" step="0.1" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="waist">Cintura (cm)</Label>
                        <Input id="waist" type="number" step="0.1" />
                    </div>
                    <DialogFooter className="col-span-2">
                        <Button type="submit">Salvar Medição</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Peso Atual</CardTitle>
                <Weight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{currentWeight} kg</div>
                 <div className="text-xs text-muted-foreground flex items-center">
                    {weightTrend === 'increase' && <TrendingUp className="mr-1 h-4 w-4 text-red-500" />}
                    {weightTrend === 'decrease' && <TrendingDown className="mr-1 h-4 w-4 text-green-500" />}
                    {weightTrend === 'stable' && <ArrowRight className="mr-1 h-4 w-4 text-muted-foreground" />}
                    {weightTrend === 'increase' ? 'Aumento' : weightTrend === 'decrease' ? 'Redução' : 'Estável'} desde a última medição
                </div>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Altura</CardTitle>
                <Ruler className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{heightInCm} cm</div>
                <p className="text-xs text-muted-foreground">Medição estática</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">IMC</CardTitle>
                <HeartPulse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{currentBmi}</div>
                <Badge variant={bmiInfo.variant} className="text-xs">{bmiInfo.category}</Badge>
            </CardContent>
        </Card>
         <Card>
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Progresso de Treino</CardTitle>
             </CardHeader>
            <CardContent>
                 <div className="flex items-center gap-3">
                    <Progress value={workoutProgress} className="h-2" />
                    <span className="text-lg font-bold">{workoutProgress}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Exercícios concluídos este mês.</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
             <div>
                <CardTitle>Evolução das Métricas</CardTitle>
                <CardDescription>Acompanhe o progresso do aluno ao longo do tempo.</CardDescription>
             </div>
             <div className="flex gap-2">
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Selecionar Métrica" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="weight">Peso (kg)</SelectItem>
                        <SelectItem value="bodyFat">Gordura Corporal (%)</SelectItem>
                        <SelectItem value="arm">Braço (cm)</SelectItem>
                        <SelectItem value="leg">Perna (cm)</SelectItem>
                        <SelectItem value="waist">Cintura (cm)</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={chartType} onValueChange={(v) => setChartType(v as any)}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                        <SelectValue placeholder="Tipo de Gráfico" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="line">Linha</SelectItem>
                        <SelectItem value="bar">Barras</SelectItem>
                        <SelectItem value="area">Área</SelectItem>
                    </SelectContent>
                </Select>
             </div>
          </div>
        </CardHeader>
        <CardContent>
           <ChartComponent type={chartType} data={progressData} metric={selectedMetric} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico Detalhado</CardTitle>
          <CardDescription>Todos os registros de medições do aluno.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Peso (kg)</TableHead>
                <TableHead className="hidden sm:table-cell">Gordura (%)</TableHead>
                <TableHead className="hidden sm:table-cell">Braço (cm)</TableHead>
                <TableHead className="hidden md:table-cell">Perna (cm)</TableHead>
                <TableHead className="hidden md:table-cell">Cintura (cm)</TableHead>
                 <TableHead>IMC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {progressData.map((entry: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.weight}</TableCell>
                  <TableCell className="hidden sm:table-cell">{entry.bodyFat}</TableCell>
                  <TableCell className="hidden sm:table-cell">{entry.arm}</TableCell>
                  <TableCell className="hidden md:table-cell">{entry.leg}</TableCell>
                  <TableCell className="hidden md:table-cell">{entry.waist}</TableCell>
                   <TableCell>{calculateBmi(entry.weight, heightInCm)}</TableCell>
                </TableRow>
              )).reverse()}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

