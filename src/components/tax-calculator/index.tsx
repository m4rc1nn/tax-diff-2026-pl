'use client';

import { useState } from 'react';
import { TaxFormType, TaxResult } from '@/types/tax';
import { calculateTax, getBestFutureTaxForm } from '@/lib/tax-calculator';
import { TaxCalculatorForm } from './tax-calculator-form';
import { TaxCalculatorResults } from './tax-calculator-results';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function TaxCalculator() {
  const [result, setResult] = useState<TaxResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = (income: number, expenses: number, taxForm: TaxFormType) => {
    const netIncome = Math.max(0, income - expenses);
    
    const currentTax = calculateTax({
      amount: income,
      expenses,
      type: taxForm,
      year: 'current'
    });

    const futureTax = calculateTax({
      amount: income,
      expenses,
      type: taxForm,
      year: 'future'
    });

    const difference = futureTax - currentTax;
    const percentChange = currentTax > 0 ? (difference / currentTax) * 100 : 0;
    
    const bestFuture = getBestFutureTaxForm(income, expenses);

    setResult({
      income,
      expenses,
      netIncome,
      currentTaxForm: taxForm,
      currentTax,
      futureTax,
      difference,
      percentChange,
      bestFutureTaxForm: bestFuture.form,
      bestFutureTaxAmount: bestFuture.amount
    });

    setShowResults(true);
  };

  return (
    <Card className="mb-8 border-purple-light/20 shadow-lg">
      <CardHeader className="tax-calculator-gradient text-white">
        <CardTitle className="text-2xl md:text-3xl font-bold">
          <span className="gold-text">Składka zdrowotna dla przedsiębiorców</span>
        </CardTitle>
        <CardDescription className="text-white/90 text-lg md:text-xl">
          Porównanie: Teraz vs w 2026 roku
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <TaxCalculatorForm onCalculate={handleCalculate} clearResults={() => setResult(null)} />
        {showResults && result && (
          <TaxCalculatorResults result={result} />
        )}
      </CardContent>
    </Card>
  );
} 