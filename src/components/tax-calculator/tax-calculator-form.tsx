'use client';

import { useState } from 'react';
import { TaxFormType } from '@/types/tax';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, CircleDollarSign } from 'lucide-react';
import { getTaxFormName } from '@/lib/tax-calculator';

interface TaxCalculatorFormProps {
    onCalculate: (income: number, expenses: number, taxForm: TaxFormType) => void;
    clearResults: () => void;
}

export function TaxCalculatorForm({ onCalculate, clearResults }: TaxCalculatorFormProps) {
    const { toast } = useToast();
    const [income, setIncome] = useState<string>('');
    const [expenses, setExpenses] = useState<string>('');
    const [taxForm, setTaxForm] = useState<TaxFormType>('skala');

    const handleSubmit = () => {
        if (!income || isNaN(Number(income)) || Number(income) < 0) {
            toast({
                title: "Błąd",
                description: "Wprowadź prawidłową wartość przychodu.",
                variant: "destructive",
            });
            return;
        }

        onCalculate(Number(income), Number(expenses) || 0, taxForm);
    };

    return (
        <div className="space-y-6">
            <div className="md:col-span-2">
                <Label className="text-base font-medium mb-2 block">
                    Forma opodatkowania
                </Label>
                <RadioGroup
                    value={taxForm}
                    onValueChange={(value) => setTaxForm(value as TaxFormType)}
                    className="grid md:grid-cols-3 gap-3"
                >
                    {(['skala', 'liniowka', 'ryczalt'] as const).map((form) => (
                        <div key={form} className="flex items-center space-x-2">
                            <RadioGroupItem value={form} id={form} />
                            <Label htmlFor={form}>{getTaxFormName(form)}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
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
            </div>

            <div className="mt-6 flex items-center flex-col sm:flex-row gap-2">
                <Button
                    className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-white"
                    onClick={handleSubmit}
                >
                    Oblicz składkę
                </Button>
                <Button
                    onClick={clearResults}
                    variant='outline'
                    className="w-full sm:w-auto"
                >
                    Wyczyść wyniki
                </Button>
            </div>
        </div>
    );
} 