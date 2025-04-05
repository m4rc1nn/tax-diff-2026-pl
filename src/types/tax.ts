export type TaxFormType = 'skala' | 'liniowka' | 'ryczalt';

export interface TaxResult {
  income: number;
  expenses: number;
  netIncome: number;
  currentTaxForm: TaxFormType;
  currentTax: number;
  futureTax: number;
  difference: number;
  percentChange: number;
  bestFutureTaxForm?: TaxFormType;
  bestFutureTaxAmount?: number;
}

export interface TaxCalculationParams {
  amount: number;
  expenses: number;
  type: TaxFormType;
  year: 'current' | 'future';
} 