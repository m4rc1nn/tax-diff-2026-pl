
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { CircleDollarSign, TrendingDown, TrendingUp, ArrowRight, AlertCircle } from 'lucide-react';

type TaxFormType = 'skala' | 'liniowka' | 'ryczalt';

interface TaxResult {
  income: number;
  expenses: number;
  netIncome: number;
  currentTax: number;
  futureTax: number;
  difference: number;
  percentChange: number;
  bestFutureTaxForm?: TaxFormType;
  bestFutureTaxAmount?: number;
}

const TaxCalculator = () => {
  const { toast } = useToast();
  const [income, setIncome] = useState<string>('');
  const [expenses, setExpenses] = useState<string>('');
  const [taxForm, setTaxForm] = useState<TaxFormType>('skala');
  const [result, setResult] = useState<TaxResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Tax calculation function based on the provided image data
  const calculateTax = (amount: number, expenses: number, type: TaxFormType, year: 'current' | 'future'): number => {
    const numericAmount = Number(amount);
    // For scale and linear tax, calculate based on net income (income - expenses)
    const netAmount = type !== 'ryczalt' ? Math.max(0, numericAmount - expenses) : numericAmount;
    
    // Current year tax calculations
    if (year === 'current') {
      if (type === 'skala') {
        if (netAmount <= 0) return 0;
        if (netAmount <= 2000) return 314.96;
        if (netAmount <= 4666) return 419.94;
        if (netAmount <= 5000) return 450.00;
        if (netAmount <= 8000) return 720.00;
        if (netAmount <= 10000) return 900.00;
        if (netAmount <= 15000) return 1350.00;
        if (netAmount <= 20000) return 1800.00;
        if (netAmount <= 30000) return 2700.00;
        if (netAmount <= 40000) return 3600.00;
        if (netAmount <= 50000) return 4500.00;
        if (netAmount <= 60000) return 5400.00;
        if (netAmount <= 80000) return 7200.00;
        if (netAmount <= 100000) return 9000.00;
        if (netAmount <= 150000) return 13500.00;
        if (netAmount <= 200000) return 18000.00;
        return 45000.00; // for > 200000
      } 
      
      if (type === 'liniowka') {
        if (netAmount <= 0) return 0;
        if (netAmount <= 8000) return 314.96;
        if (netAmount <= 10000) return 490.00;
        if (netAmount <= 15000) return 735.00;
        if (netAmount <= 20000) return 980.00;
        if (netAmount <= 30000) return 1470.00;
        if (netAmount <= 40000) return 1960.00;
        if (netAmount <= 50000) return 2450.00;
        if (netAmount <= 60000) return 2940.00;
        if (netAmount <= 80000) return 3920.00;
        if (netAmount <= 100000) return 4900.00;
        if (netAmount <= 150000) return 7350.00;
        if (netAmount <= 200000) return 9800.00;
        return 24500.00; // for > 200000
      } 
      
      if (type === 'ryczalt') {
        if (numericAmount <= 0) return 0;
        if (numericAmount <= 8000) return 461.66;
        if (numericAmount <= 10000) return 769.43;
        if (numericAmount <= 15000) return 769.43;
        if (numericAmount <= 20000) return 769.43;
        if (numericAmount <= 30000) return 769.43;
        if (numericAmount <= 40000) return 769.43;
        if (numericAmount <= 50000) return 769.43;
        if (numericAmount <= 60000) return 769.43;
        if (numericAmount <= 80000) return 769.43;
        if (numericAmount <= 100000) return 769.43;
        if (numericAmount <= 150000) return 769.43;
        if (numericAmount <= 200000) return 769.43;
        return 769.43; // for > 200000
      }
    }
    
    // Future (2026) tax calculations
    if (year === 'future') {
      // For future calculations, we need to consider expenses for all tax forms
      // to determine the best option
      const calculationAmount = type !== 'ryczalt' ? netAmount : numericAmount;
      
      if (type === 'skala' || type === 'liniowka') {
        if (calculationAmount <= 0) return 0;
        if (calculationAmount <= 15000) return 314.96;
        if (calculationAmount <= 20000) return 662.86;
        if (calculationAmount <= 30000) return 1152.86;
        if (calculationAmount <= 40000) return 1642.86;
        if (calculationAmount <= 50000) return 2132.86;
        if (calculationAmount <= 60000) return 2622.86;
        if (calculationAmount <= 80000) return 3602.86;
        if (calculationAmount <= 100000) return 4582.86;
        if (calculationAmount <= 150000) return 7032.86;
        if (calculationAmount <= 200000) return 9482.86;
        return 24182.86; // for > 200000
      }
      
      if (type === 'ryczalt') {
        if (calculationAmount <= 0) return 0;
        if (calculationAmount <= 15000) return 314.96;
        if (calculationAmount <= 20000) return 314.96;
        if (calculationAmount <= 30000) return 461.96;
        if (calculationAmount <= 40000) return 811.96;
        if (calculationAmount <= 50000) return 1161.96;
        if (calculationAmount <= 60000) return 1511.96;
        if (calculationAmount <= 80000) return 2211.96;
        if (calculationAmount <= 100000) return 2911.96;
        if (calculationAmount <= 150000) return 4661.96;
        if (calculationAmount <= 200000) return 6411.96;
        return 16911.96; // for > 200000
      }
    }
    
    return 0;
  };

  const getBestFutureTaxForm = (income: number, expenses: number): { form: TaxFormType; amount: number } => {
    // For calculating the best form, we need to consider expenses for all tax forms
    const netIncome = Math.max(0, income - expenses);
    
    // Calculate tax for each form using net income for scale and linear, 
    // and gross income for ryczalt
    const skalaAmount = calculateTax(income, expenses, 'skala', 'future');
    const liniowkaAmount = calculateTax(income, expenses, 'liniowka', 'future');
    
    // For ryczalt in future, use the net income calculation to determine the best form
    const ryczaltAmountForComparison = calculateTax(income, 0, 'ryczalt', 'future');
    
    let bestForm: TaxFormType = 'skala';
    let bestAmount = skalaAmount;
    
    if (liniowkaAmount < bestAmount) {
      bestForm = 'liniowka';
      bestAmount = liniowkaAmount;
    }
    
    if (ryczaltAmountForComparison < bestAmount) {
      bestForm = 'ryczalt';
      bestAmount = ryczaltAmountForComparison;
    }
    
    return { form: bestForm, amount: bestAmount };
  };

  const handleCalculate = () => {
    if (!income || isNaN(Number(income)) || Number(income) < 0) {
      toast({
        title: "Błąd",
        description: "Wprowadź prawidłową wartość przychodu.",
        variant: "destructive",
      });
      return;
    }

    const numericIncome = Number(income);
    const numericExpenses = Number(expenses) || 0;
    const netIncome = Math.max(0, numericIncome - numericExpenses);
    
    const currentTax = calculateTax(numericIncome, numericExpenses, taxForm, 'current');
    const futureTax = calculateTax(numericIncome, numericExpenses, taxForm, 'future');
    const difference = futureTax - currentTax;
    const percentChange = currentTax > 0 ? (difference / currentTax) * 100 : 0;
    
    const bestFuture = getBestFutureTaxForm(numericIncome, numericExpenses);

    setResult({
      income: numericIncome,
      expenses: numericExpenses,
      netIncome: netIncome,
      currentTax,
      futureTax,
      difference,
      percentChange,
      bestFutureTaxForm: bestFuture.form,
      bestFutureTaxAmount: bestFuture.amount
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
                Miesięczny przychód brutto (PLN)
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
              <Label htmlFor="expenses" className="text-base font-medium mb-2 block">
                Miesięczne koszty (PLN)
              </Label>
              <div className="relative">
                <CircleDollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="expenses"
                  placeholder="np. 3000"
                  className="pl-10"
                  value={expenses}
                  onChange={(e) => setExpenses(e.target.value)}
                />
              </div>
              {taxForm === 'ryczalt' && (
                <div className="mt-2 flex items-start gap-2 text-amber-600 text-sm">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Przy ryczałcie koszty nie są obecnie brane pod uwagę przy wyliczaniu składki, ale będą wykorzystane w kalkulacji optymalnej formy na 2026.</span>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <Label className="text-base font-medium mb-2 block">
                Forma opodatkowania
              </Label>
              <RadioGroup
                value={taxForm}
                onValueChange={(value) => setTaxForm(value as TaxFormType)}
                className="grid md:grid-cols-3 gap-3"
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
                  <TabsTrigger value="optymalizacja">Co wybrać od 2026</TabsTrigger>
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
                          <td className="table-cell">Miesięczny przychód</td>
                          <td className="table-cell text-right">{formatCurrency(result.income)}</td>
                          <td className="table-cell text-right">{formatCurrency(result.income)}</td>
                          <td className="table-cell text-right">-</td>
                        </tr>
                        <tr>
                          <td className="table-cell">Miesięczne koszty</td>
                          <td className="table-cell text-right">{formatCurrency(result.expenses)}</td>
                          <td className="table-cell text-right">{formatCurrency(result.expenses)}</td>
                          <td className="table-cell text-right">-</td>
                        </tr>
                        {taxForm !== 'ryczalt' && (
                          <tr>
                            <td className="table-cell">Dochód netto (podstawa)</td>
                            <td className="table-cell text-right">{formatCurrency(result.netIncome)}</td>
                            <td className="table-cell text-right">{formatCurrency(result.netIncome)}</td>
                            <td className="table-cell text-right">-</td>
                          </tr>
                        )}
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
                
                <TabsContent value="optymalizacja">
                  <div className="p-4 border rounded-md bg-gray-50">
                    <h3 className="text-lg font-semibold mb-3">Optymalizacja od 2026 roku</h3>
                    
                    <div className="mb-4">
                      <p className="mb-2">Twoja obecna forma opodatkowania: <span className="font-medium">{getTaxFormName(taxForm)}</span></p>
                      <p className="mb-2">Składka zdrowotna od 2026 przy obecnej formie opodatkowania: <span className="font-medium">{formatCurrency(result.futureTax)}</span></p>
                    </div>
                    
                    {result.bestFutureTaxForm !== taxForm ? (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                        <h4 className="text-base font-semibold flex items-center gap-1 text-green-700">
                          <ArrowRight className="h-4 w-4" /> Zalecana zmiana formy opodatkowania
                        </h4>
                        <div className="mt-2 space-y-2">
                          <p>Najkorzystniejsza forma opodatkowania od 2026: <span className="font-medium">{getTaxFormName(result.bestFutureTaxForm!)}</span></p>
                          <p>Składka zdrowotna po zmianie: <span className="font-medium">{formatCurrency(result.bestFutureTaxAmount!)}</span></p>
                          <p className="text-green-700 font-medium">
                            Możesz zaoszczędzić: {formatCurrency(result.futureTax - result.bestFutureTaxAmount!)} miesięcznie
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <h4 className="text-base font-semibold text-blue-700 flex items-center gap-1">
                          <ArrowRight className="h-4 w-4" /> Aktualna forma opodatkowania jest optymalna
                        </h4>
                        <p className="mt-2">
                          Dla Twojego dochodu {getTaxFormName(taxForm)} będzie nadal najkorzystniejszą formą opodatkowania od 2026 roku.
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <h4 className="text-base font-semibold mb-2">Porównanie składek zdrowotnych od 2026</h4>
                      <div className="grid gap-2">
                        <div className="flex justify-between py-1 border-b">
                          <span>Skala podatkowa:</span>
                          <span className={`font-medium ${result.bestFutureTaxForm === 'skala' ? 'text-green-600' : ''}`}>
                            {formatCurrency(calculateTax(result.income, result.expenses, 'skala', 'future'))}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span>Podatek liniowy:</span>
                          <span className={`font-medium ${result.bestFutureTaxForm === 'liniowka' ? 'text-green-600' : ''}`}>
                            {formatCurrency(calculateTax(result.income, result.expenses, 'liniowka', 'future'))}
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>Ryczałt:</span>
                          <span className={`font-medium ${result.bestFutureTaxForm === 'ryczalt' ? 'text-green-600' : ''}`}>
                            {formatCurrency(calculateTax(result.income, 0, 'ryczalt', 'future'))}
                          </span>
                        </div>
                      </div>
                    </div>
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
