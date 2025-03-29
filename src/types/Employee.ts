export interface Address {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
}

export interface OnboardingStatus {
    status: string;
    blocking_steps: string[];
    remaining_steps: string[];
    ssn?: string[];
    withholdings?: Array<{
        id: string;
        name: string;
        status: string;
        filingStatus?: string;
    }>;
    company_defined_attributes?: Array<{
        id: string;
        name: string;
        status: string;
    }>;
}

export interface EarningRateData {
    id: string;
    employee: string;
    amount: number;
    period: string;
    name: string;
    active: boolean;
    workweek_hours?: number;
}

export interface Employee {
    id: string;
    first_name: string;
    last_name: string;
    middle_name?: string;
    name?: string; // Derived field: first_name + last_name
    email?: string;
    phone?: string;
    phone_number?: string;
    dob?: string;
    birthdate?: string; // Alias for dob for UI compatibility
    bank_accounts?: string[];
    ssn_last_four?: string;
    ssnLast4?: string; // Alias for ssn_last_four for UI compatibility
    ssn_validation_status?: string;
    onboard?: OnboardingStatus;
    payment_method_preference?: string;
    default_net_pay_split?: string;
    company?: string;
    workplaces?: string[];
    primary_workplace?: string;
    start_date?: string;
    termination_date?: string;
    active?: boolean;
    residence?: Address;
    address?: string; // Formatted address string for UI compatibility
    w2_electronic_consent_provided?: boolean;
    metadata?: Record<string, any>;

    // UI-specific fields
    role?: string;
    employmentType?: string;
    payRate?: number;
    payRateType?: 'hour' | 'year';
    avatar?: string;

    // Withholding information
    federalWithholdings?: {
        filingStatus: string;
        allowances: number;
        dependents: number;
        extraWithholdings: number;
    };
    stateWithholdings?: {
        filingStatus: string;
        allowances: number;
        dependents: number;
        extraWithholdings: number;
    };

    // Payment method information
    paymentMethod?: {
        bankName: string;
        accountLast4: string;
        payFrequency: string;
    };

    // Add raw earning rates data
    earningRates?: EarningRateData[];
}
