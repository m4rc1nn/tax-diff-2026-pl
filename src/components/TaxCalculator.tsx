
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CircleDollarSign, TrendingDown, TrendingUp } from 'lucide-react';

type TaxFormType = 'skala' | 'liniowka' | 'ryczalt';

interface TaxResult {
  income: number;
  currentTax: number;
  futureTax: number;
  difference: number;
  percentChange: number;
}

const TaxCalculator = () => {
  const { toast } = useToast();
  const [income, setIncome] = useState<string>('');
  const [taxForm, setTaxForm] = useState<TaxFormType>('skala');
  const [result, setResult] = useState<TaxResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Tax calculation function based on the provided image data
  const calculateTax = (amount: number, type: TaxFormType, year: 'current' | 'future'): number => {
    const numericAmount = Number(amount);
    
    // Current year tax calculations
    if (year === 'current') {
      if (type === 'skala') {
        if (numericAmount <= 0) return 0;
        if (numericAmount <= 2000) return 314.96;
        if (numericAmount <= 4666) return 419.94;
        if (numericAmount <= 5000) return 450.00;
        if (numericAmount <= 8000) return 720.00;
        if (numericAmount <= 10000) return 900.00;
        if (numericAmount <= 15000) return 1350.00;
        if (numericAmount <= 20000) return 1800.00;
        if (numericAmount <= 30000) return 2700.00;
        if (numericAmount <= 40000) return 3600.00;
        if (numericAmount <= 50000) return 4500.00;
        if (numericAmount <= 60000) return 5400.00;
        if (numericAmount <= 80000) return 7200.00;
        if (numericAmount <= 100000) return 9000.00;
        if (numericAmount <= 150000) return 13500.00;
        if (numericAmount <= 200000) return 18000.00;
        return 45000.00; // for > 200000
      } 
      
      if (type === 'liniowka') {
        if (numericAmount <= 0) return 0;
        if (numericAmount <= 8000) return 314.96;
        if (numericAmount <= 10000) return 490.00;
        if (numericAmount <= 15000) return 735.00;
        if (numericAmount <= 20000) return 980.00;
        if (numericAmount <= 30000) return 1470.00;
        if (numericAmount <= 40000) return 1960.00;
        if (numericAmount <= 50000) return 2450.00;
        if (numericAmount <= 60000) return 2940.00;
        if (numericAmount <= 80000) return 3920.00;
        if (numericAmount <= 100000) return 4900.00;
        if (numericAmount <= 150000) return 7350.00;
        if (numericAmount <= 200000) return 9800.00;
        return 24500.00; // for > 200000
      } 
      
      if (type === 'ryczalt') {
        if (numericAmount <= 0) return 0;
        if (numericAmount <= 8000) return 461.66;
        if (numericAmount <= 10000) return 769.43;
        if (numericAmount <= 15000) return 769.43;
        if (numericAmount <= 20000) return 769.43;
        if (numericAmount <= 30000) return 1384.97;
        if (numericAmount <= 40000) return 1384.97;
        if (numericAmount <= 50000) return 1384.97;
        if (numericAmount <= 60000) return 1384.97;
        if (numericAmount <= 80000) return 1384.97;
        if (numericAmount <= 100000) return 1384.97;
        if (numericAmount <= 150000) return 1384.97;
        if (numericAmount <= 200000) return 1384.97;
        return 1384.97; // for > 200000
      }
    }
    
    // Future (2026) tax calculations
    if (year === 'future') {
      if (type === 'skala' || type === 'liniowka') {
        if (numericAmount <= 0) return 0;
        if (numericAmount <= 15000) return 314.96;
        if (numericAmount <= 20000) return 662.86;
        if (numericAmount <= 30000) return 1152.86;
        if (numericAmount <= 40000) return 1642.86;
        if (numericAmount <= 50000) return 2132.86;
        if (numericAmount <= 60000) return 2622.86;
        if (numericAmount <= 80000) return 3602.86;
        if (numericAmount <= 100000) return 4582.86;
        if (numericAmount <= 150000) return 7032.86;
        if (numericAmount <= 200000) return 9482.86;
        return 24182.86; // for > 200000
      }
      
      if (type === 'ryczalt') {
        if (numericAmount <= 0) return 0;
        if (numericAmount <= 15000) return 314.96;
        if (numericAmount <= 20000) return 314.96;
        if (numericAmount <= 30000) return 461.96;
        if (numericAmount <= 40000) return 811.96;
        if (numericAmount <= 50000) return 1161.96;
        if (numericAmount <= 60000) return 1511.96;
        if (numericAmount <= 80000) return 2211.96;
        if (numericAmount <= 100000) return 2911.96;
        if (numericAmount <= 150000) return 4661.96;
        if (numericAmount <= 200000) return 6411.96;
        return 16911.96; // for > 200000
      }
    }
    
    return 0;
  };

  const handleCalculate = () => {
    if (!income || isNaN(Number(income)) || Number(income) < 0) {
      toast({
        title: "Błąd",
        description: "Wprowadź prawidłową wartość dochodu.",
        variant: "destructive",
      });
      return;
    }

    const numericIncome = Number(income);
    const currentTax = calculateTax(numericIncome, taxForm, 'current');
    const futureTax = calculateTax(numericIncome, taxForm, 'future');
    const difference = futureTax - currentTax;
    const percentChange = currentTax > 0 ? (difference / currentTax) * 100 : 0;

    setResult({
      income: numericIncome,
      currentTax,
      futureTax,
      difference,
      percentChange,
    });

    setShowResults(true);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getChartData = () => {
    if (!result) return [];
    
    return [
      {
        name: 'Teraz',
        wartość: result.currentTax,
      },
      {
        name: '2026',
        wartość: result.futureTax,
      },
    ];
  };

  const getTaxFormName = (form: TaxFormType): string => {
    switch(form) {
      case 'skala': return 'Skala podatkowa';
      case 'liniowka': return 'Podatek liniowy';
      case 'ryczalt': return 'Ryczałt';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Card className="mb-8 border-purple-light/20 shadow-lg">
        <CardHeader className="tax-calculator-gradient text-white">
          <CardTitle className="text-2xl md:text-3xl font-bold">
            <span className="gold-text">Składka zdrowotna dla przedsiębiorców</span>
          </CardTitle>
          <CardDescription className="text-white/90 text-lg md:text-xl">
            Porównanie: Teraz vs w 2026 roku
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="income" className="text-base font-medium mb-2 block">
                Miesięczny przychód/dochód brutto (PLN)
              </Label>
              <div className="relative">
                <CircleDollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="income"
                  placeholder="np. 10000"
                  className="pl-10"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-2 block">
                Forma opodatkowania
              </Label>
              <RadioGroup
                value={taxForm}
                onValueChange={(value) => setTaxForm(value as TaxFormType)}
                className="grid gap-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="skala" id="skala" />
                  <Label htmlFor="skala">Skala podatkowa</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="liniowka" id="liniowka" />
                  <Label htmlFor="liniowka">Podatek liniowy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ryczalt" id="ryczalt" />
                  <Label htmlFor="ryczalt">Ryczałt</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Button 
            className="mt-6 bg-gold hover:bg-gold-dark text-white"
            onClick={handleCalculate}
          >
            Oblicz składkę
          </Button>

          {showResults && result && (
            <div className="mt-8">
              <Tabs defaultValue="tabela">
                <TabsList className="mb-4">
                  <TabsTrigger value="tabela">Tabela</TabsTrigger>
                  <TabsTrigger value="wykres">Wykres</TabsTrigger>
                </TabsList>
                
                <TabsContent value="tabela" className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="table-header text-left">Parametr</th>
                          <th className="table-header text-right">Obecna składka</th>
                          <th className="table-header text-right">Składka od 2026</th>
                          <th className="table-header text-right">Różnica</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="table-cell">Miesięczny dochód</td>
                          <td className="table-cell text-right">{formatCurrency(result.income)}</td>
                          <td className="table-cell text-right">{formatCurrency(result.income)}</td>
                          <td className="table-cell text-right">-</td>
                        </tr>
                        <tr>
                          <td className="table-cell">Forma opodatkowania</td>
                          <td className="table-cell text-right">{getTaxFormName(taxForm)}</td>
                          <td className="table-cell text-right">{getTaxFormName(taxForm)}</td>
                          <td className="table-cell text-right">-</td>
                        </tr>
                        <tr>
                          <td className="table-cell font-semibold">Składka zdrowotna</td>
                          <td className="table-cell-current text-right font-medium">{formatCurrency(result.currentTax)}</td>
                          <td className="table-cell-future text-right font-medium">{formatCurrency(result.futureTax)}</td>
                          <td className={`table-cell text-right font-bold ${result.difference > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {result.difference > 0 ? '+' : ''}{formatCurrency(result.difference)}
                            <div className="text-xs">
                              {result.difference > 0 ? 
                                <span className="flex items-center justify-end gap-1"><TrendingUp className="h-3 w-3" /> +{result.percentChange.toFixed(2)}%</span> : 
                                <span className="flex items-center justify-end gap-1"><TrendingDown className="h-3 w-3" /> {result.percentChange.toFixed(2)}%</span>
                              }
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="wykres">
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getChartData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [formatCurrency(Number(value)), "Składka zdrowotna"]}
                        />
                        <Legend />
                        <Bar 
                          name="Składka zdrowotna" 
                          dataKey="wartość" 
                          fill={result.difference > 0 ? "#ef4444" : "#10b981"}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 p-4 rounded-md bg-gray-50 border border-gray-200">
                <h3 className="font-semibold text-lg mb-2">Podsumowanie:</h3>
                <p>
                  {result.difference > 0 ? (
                    <span className="text-red-600">
                      Składka zdrowotna wzrośnie o {formatCurrency(result.difference)} miesięcznie ({result.percentChange.toFixed(2)}%).
                    </span>
                  ) : (
                    <span className="text-green-600">
                      Składka zdrowotna zmniejszy się o {formatCurrency(Math.abs(result.difference))} miesięcznie ({Math.abs(result.percentChange).toFixed(2)}%).
                    </span>
                  )}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Kalkulacja na podstawie danych z 2025 roku. Rzeczywiste kwoty mogą się różnić.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxCalculator;
