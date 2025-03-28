export type Employee = {
    id?: string;
    name: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    phone?: string;
    role?: string;
    employmentType: string;
    payRate?: number;
    payRateType?: 'hour' | 'year';
    avatar?: string;
    birthdate?: string;
    ssnLast4?: string;
    address?: string;
    federalWithholdings?: {
        filingStatus: 'Married' | 'Jointly' | 'Head of household' | 'Single';
        allowances: number;
        dependents: number;
        extraWithholdings: number;
    };
    stateWithholdings?: {
        filingStatus: 'Married' | 'Single';
        allowances: number;
        dependents: number;
        extraWithholdings: number;
    };
    paymentMethod?: {
        bankName: string;
        accountLast4: string;
        payFrequency: string;
    };
};
