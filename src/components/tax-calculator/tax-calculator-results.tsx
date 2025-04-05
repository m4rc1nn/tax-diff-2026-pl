'use client';

import { TaxResult } from '@/types/tax';
import { ArrowRight, TrendingDown, TrendingUp } from 'lucide-react';
import { calculateTax, formatCurrency, getTaxFormName } from '@/lib/tax-calculator';

interface TaxCalculatorResultsProps {
    result: TaxResult;
}

export function TaxCalculatorResults({ result }: TaxCalculatorResultsProps) {
    return (
        <div className="mt-8">
            <div className="space-y-4">
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
            </div>

            <div className="mt-6 p-4 border rounded-md bg-gray-50">
                <h3 className="text-lg font-semibold mb-3">Optymalizacja od 2026 roku</h3>

                {result.bestFutureTaxForm && result.bestFutureTaxAmount && (
                    <>
                        <div className="mb-4">
                            <p className="mb-2">Składka zdrowotna od 2026 przy obecnej formie opodatkowania: <span className="font-medium">{formatCurrency(result.futureTax)}</span></p>
                        </div>

                        {result.bestFutureTaxForm !== result.currentTaxForm ? (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                                <h4 className="text-base font-semibold flex items-center gap-1 text-green-700">
                                    <ArrowRight className="h-4 w-4" /> Zalecana zmiana formy opodatkowania
                                </h4>
                                <div className="mt-2 space-y-2">
                                    <p>Najkorzystniejsza forma opodatkowania od 2026: <span className="font-medium">{getTaxFormName(result.bestFutureTaxForm)}</span></p>
                                    <p>Składka zdrowotna po zmianie: <span className="font-medium">{formatCurrency(result.bestFutureTaxAmount)}</span></p>
                                    <p className="text-green-700 font-medium">
                                        Możesz zaoszczędzić: {formatCurrency(result.futureTax - result.bestFutureTaxAmount)} miesięcznie
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                <h4 className="text-base font-semibold text-blue-700 flex items-center gap-1">
                                    <ArrowRight className="h-4 w-4" /> Aktualna forma opodatkowania jest optymalna
                                </h4>
                                <p className="mt-2">
                                    Dla Twojego dochodu {getTaxFormName(result.bestFutureTaxForm)} będzie nadal najkorzystniejszą formą opodatkowania od 2026 roku.
                                </p>
                            </div>
                        )}

                        <div className="mt-4">
                            <h4 className="text-base font-semibold mb-2">Porównanie składek zdrowotnych od 2026</h4>
                            <div className="grid gap-2">
                                {(['skala', 'liniowka', 'ryczalt'] as const).map((form) => {
                                    const tax = calculateTax({
                                        amount: result.income,
                                        expenses: form === 'ryczalt' ? 0 : result.expenses,
                                        type: form,
                                        year: 'future'
                                    });
                                    return (
                                        <div key={form} className="flex justify-between py-1 border-b">
                                            <span>{getTaxFormName(form)}:</span>
                                            <span className={`font-medium ${result.bestFutureTaxForm === form ? 'text-green-600' : ''}`}>
                                                {formatCurrency(tax)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
} 