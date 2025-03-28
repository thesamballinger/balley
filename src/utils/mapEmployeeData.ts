// src/utils/mapEmployeeData.ts
import { EmployeePreview } from '../components/PreviewEmployeeCard.tsx';
import { EmployeeDetails as EmployeeDetailsType } from '../components/DetailsCard.tsx';
import { Employee } from '../types/Employee.ts';
import { Contractor } from '../types/Contractor.ts';
import { localEmployeeService } from '../services/checkApi.ts';

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

// Map Check API employee data to our Employee model
export const mapToEmployeeModel = (apiData: any) => {
    console.log('Mapping employee data:', apiData);

    // Get locally stored metadata
    const metadata = localEmployeeService.getEmployeeMetadata(apiData.id) || {};
    const avatar = localEmployeeService.getEmployeeAvatar(apiData.id) ||
        `https://api.dicebear.com/7.x/personas/svg?seed=${apiData.first_name} ${apiData.last_name}`;

    // Find active earning rate
    const earningRate = metadata.earningRate || {
        amount: 0,
        period: 'hourly'
    };

    return {
        id: apiData.id,
        name: `${apiData.first_name} ${apiData.last_name}`,
        firstName: apiData.first_name,
        lastName: apiData.last_name,
        middleName: apiData.middle_name || '',
        role: metadata.role || 'Employee',
        employmentType: 'Employee (W2)',
        payRate: earningRate.amount,
        payRateType: earningRate.period === 'hourly' ? 'hour' : 'year',
        avatar,
        email: apiData.email,
        phone: metadata.phone || '',
        birthdate: apiData.dob,
        ssn: apiData.ssn || '',
        ssnLast4: apiData.ssn_last_four,
        address: apiData.residence ?
            `${apiData.residence.line1}, ${apiData.residence.city}, ${apiData.residence.state} ${apiData.residence.postal_code}` :
            '',
        federalWithholdings: {
            filingStatus: metadata.federalFilingStatus || 'Single',
            allowances: metadata.federalAllowances || 0,
            dependents: metadata.federalDependents || 0,
            extraWithholdings: metadata.federalExtraWithholdings || 0
        },
        stateWithholdings: {
            filingStatus: metadata.stateFilingStatus || 'Single',
            allowances: metadata.stateAllowances || 0,
            dependents: metadata.stateDependents || 0,
            extraWithholdings: metadata.stateExtraWithholdings || 0
        },
        paymentMethod: {
            bankName: metadata.bankName || 'Unknown Bank',
            accountLast4: apiData.bank_accounts && apiData.bank_accounts.length > 0 ?
                apiData.bank_accounts[0].slice(-4) : '0000',
            payFrequency: metadata.payFrequency || 'Bi-weekly payouts'
        }
    };
};

// Map our Employee model to Check API format for updates
export const mapToCheckApiFormat = (employee: Partial<Employee>): any => {
    const checkData: any = {};

    if (employee.firstName) checkData.first_name = employee.firstName;
    if (employee.lastName) checkData.last_name = employee.lastName;
    if (employee.middleName) checkData.middle_name = employee.middleName;
    if (employee.email) checkData.email = employee.email;
    if (employee.birthdate) checkData.dob = employee.birthdate;

    if (employee.address) {
        const parts = employee.address.split(',');
        checkData.residence = {
            line1: parts[0]?.trim() || '',
            line2: '',
            city: parts[1]?.trim() || '',
            state: parts[2]?.trim().split(' ')[0] || '',
            postal_code: parts[2]?.trim().split(' ')[1] || '',
            country: 'US'
        };
    }

    return checkData;
};

// Map to contractor model (for local use only since Check doesn't handle contractors)
export const mapToContractorModel = (data: any): Contractor => {
    return {
        id: data.id,
        name: `${data.first_name} ${data.last_name}`,
        firstName: data.first_name,
        lastName: data.last_name,
        role: data.metadata?.role || 'Contractor',
        payRate: parseFloat(data.metadata?.payRate || '0'),
        payRateType: data.metadata?.payRateType || 'hour',
        avatar: data.metadata?.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${data.first_name} ${data.last_name}`,
        email: data.email,
        phone: data.metadata?.phone || '',
        company: data.metadata?.company || '',
        address: data.residence ?
            `${data.residence.line1}, ${data.residence.city}, ${data.residence.state} ${data.residence.postal_code}` :
            '',
        taxId: data.metadata?.taxId || '',
        paymentMethod: {
            bankName: data.metadata?.bankName || 'Unknown Bank',
            accountLast4: data.metadata?.accountLast4 || '0000',
            payFrequency: data.metadata?.payFrequency || 'Monthly payouts'
        }
    };
};