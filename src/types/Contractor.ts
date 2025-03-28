export type Contractor = {
    id: string | number;
    name: string;
    firstName?: string;
    lastName?: string;
    role: string;
    payRate: number;
    payRateType: 'hour' | 'year';
    avatar?: string;
    email?: string;
    phone?: string;
    company?: string;
    address?: string;
    taxId?: string;
    paymentMethod?: {
        bankName: string;
        accountLast4: string;
        payFrequency: string;
    };
}; 