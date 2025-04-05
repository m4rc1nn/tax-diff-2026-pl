import { TaxFormType, TaxCalculationParams } from '@/types/tax';

export const calculateTax = ({ amount, expenses, type, year }: TaxCalculationParams): number => {
    const numericAmount = Number(amount);
    const netAmount = type !== 'ryczalt' ? Math.max(0, numericAmount - expenses) : numericAmount;

    if (year === 'current') {
        if (type === 'skala') {
            if (netAmount <= 0) return 314.96;
            return Math.max(314.96, netAmount * 0.09);
        }

        if (type === 'liniowka') {
            if (netAmount <= 0) return 314.96;
            return Math.max(314.96, netAmount * 0.049);
        }

        if (type === 'ryczalt') {
            if (numericAmount <= 0) return 0;
            if (numericAmount <= 5000) return 461.66;
            if (numericAmount <= 25000) return 769.43;
            return 1384.97;
        }
    }

    if (year === 'future') {
        const calculationAmount = type !== 'ryczalt' ? netAmount : numericAmount;

        if (type === 'skala' || type === 'liniowka') {
            if (calculationAmount <= 0) return 337.50;
            if (calculationAmount <= 12900) return 337.50;
            const excess = calculationAmount - 12900;
            return 337.50 + excess * 0.049;
        }

        if (type === 'ryczalt') {
            if (calculationAmount <= 0) return 0;
            if (calculationAmount <= 25800) return 337.50;
            const excess = calculationAmount - 25800;
            return 337.50 + excess * 0.035;
        }
    }

    return 0;
};

export const getBestFutureTaxForm = (income: number, expenses: number): { form: TaxFormType[]; amount: number } => {
    const skalaAmount = calculateTax({ amount: income, expenses, type: 'skala', year: 'future' });
    const liniowkaAmount = calculateTax({ amount: income, expenses, type: 'liniowka', year: 'future' });
    const ryczaltAmount = calculateTax({ amount: income, expenses: 0, type: 'ryczalt', year: 'future' });

    let bestForm: TaxFormType[] = ['skala'];
    let bestAmount = skalaAmount;

    if (liniowkaAmount < bestAmount) {
        bestForm = ["liniowka"];
        bestAmount = liniowkaAmount;
    }
    if (liniowkaAmount == bestAmount) {
        !bestForm.includes("liniowka") && bestForm.push("liniowka");
    }

    if (ryczaltAmount < bestAmount) {
        bestForm = ["ryczalt"];
        bestAmount = ryczaltAmount;
    }
    if (ryczaltAmount == bestAmount) {
        !bestForm.includes("ryczalt") && bestForm.push("ryczalt");
    }

    return { form: bestForm, amount: bestAmount };
};

export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

export const getTaxFormName = (form: TaxFormType): string => {
    switch (form) {
        case 'skala':
            return 'Skala podatkowa';
        case 'liniowka':
            return 'Podatek liniowy';
        case 'ryczalt':
            return 'Ryczałt';
        default:
            return '';
    }
};