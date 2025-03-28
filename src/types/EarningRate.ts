export type EarningRate = {
    id: string;
    employee: string;
    amount: number;
    period: 'hourly' | 'daily' | 'weekly' | 'biweekly' | 'semimonthly' | 'monthly' | 'annually';
    active: boolean;
    name?: string;
    workweek_hours: number;
    metadata?: Record<string, any>;
};
