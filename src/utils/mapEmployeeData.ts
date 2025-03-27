// src/utils/mapEmployeeData.ts
import { EmployeePreview } from '../components/PreviewEmployeeCard';
import { EmployeeDetails as EmployeeDetailsType } from '../components/DetailsCard';

// Map API data to EmployeePreview
export const mapToEmployeePreview = (apiData: any): EmployeePreview => ({
    id: apiData.id,
    name: `${apiData.first_name} ${apiData.last_name}`,
    role: apiData.metadata.role || 'Unknown Role', // TODO: Determine role
    employmentType: apiData.metadata.employmentType || 'Employee (W2)', // TODO: Determine employment type
    payRateLabel: apiData.metadata.payRateLabel || 'Unknown Pay Rate', // TODO: Determine pay rate
});

// Map API data to EmployeeDetails
export const mapToEmployeeDetails = (apiData: any): EmployeeDetailsType => ({
    id: apiData.id,
    name: `${apiData.first_name} ${apiData.last_name}`,
    contactEmail: apiData.email,
    contactPhone: apiData.metadata.contactPhone || 'Unknown', // TODO: Determine contact phone
    birthdate: apiData.dob,
    ssnMasked: `***-**-${apiData.ssn_last_four}`,
    address: `${apiData.residence.line1}, ${apiData.residence.city}, ${apiData.residence.state} ${apiData.residence.postal_code}`,
    federalWithholdings: {
        filingStatus: apiData.onboard?.withholdings?.find((w: any) => w.name === 'Federal')?.filingStatus || 'Single', // TODO: Determine filing status
        allowances: 0, // TODO: Determine allowances
        dependents: 0, // TODO: Determine dependents
        extraWithholdings: 0, // TODO: Determine extra withholdings
    },
    stateWithholdings: {
        filingStatus: apiData.onboard?.withholdings?.find((w: any) => w.name === 'Minnesota')?.filingStatus || 'Single', // TODO: Determine filing status
        allowances: 0, // TODO: Determine allowances
        dependents: 0, // TODO: Determine dependents
        extraWithholdings: 0, // TODO: Determine extra withholdings
    },
    paymentMethod: {
        bankName: apiData.metadata.bankName || 'Unknown', // TODO: Determine bank name
        accountLast4: apiData.bank_accounts[0]?.slice(-4) || 'Unknown', // TODO: Determine account last 4
        payFrequency: apiData.metadata.payFrequency || 'Bi-weekly payouts', // TODO: Determine pay frequency
    },
});