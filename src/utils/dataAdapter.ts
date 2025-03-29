import { Employee, OnboardingStatus } from '../types/Employee';
import { EarningRate } from '../types/EarningRate';

// Map Check API employee data to our frontend Employee type
export const mapCheckEmployeeToUI = (employee: any, earningRates?: any[]): Employee => {
    // Extract name components
    const firstName = employee.first_name || '';
    const lastName = employee.last_name || '';
    const fullName = employee.name || `${firstName} ${lastName}`.trim();

    // Extract role from metadata if available
    const role = employee.metadata?.role || 'Employee';

    // Calculate pay rate from earning rates if available
    let payRate = 0;
    let payRateType = 'hour';

    console.log(`Processing pay rates for ${fullName}:`, earningRates);

    if (earningRates && earningRates.length > 0) {
        // First try to find an active rate
        const primaryRate = earningRates.find((rate: any) => rate.active === true);

        // If no active rate is found, use the first rate
        const rateToUse = primaryRate || earningRates[0];

        if (rateToUse) {
            payRate = rateToUse.amount || 0;
            payRateType = (rateToUse.period === 'hourly' || rateToUse.period === 'hour') ? 'hour' : 'year';
            console.log(`Found pay rate for ${fullName}: $${payRate} per ${payRateType}`);
        }
    } else if (employee.metadata?.payRate) {
        // Fallback to metadata if no earning rates are available
        payRate = parseFloat(employee.metadata.payRate) || 0;
        payRateType = employee.metadata.payRateType || 'hour';
        console.log(`Using metadata pay rate for ${fullName}: $${payRate} per ${payRateType}`);
    }

    // Format address if available
    let formattedAddress = '';
    if (employee.residence) {
        const { line1, line2, city, state, postal_code } = employee.residence;
        const addressParts = [line1, line2, city, state, postal_code].filter(Boolean);
        formattedAddress = addressParts.join(', ');
    }

    // Extract withholding information from onboard data
    const federalWithholding = employee.onboard?.withholdings?.find(
        (w: any) => w.name === 'Federal'
    );

    const stateWithholding = employee.onboard?.withholdings?.find(
        (w: any) => w.name && w.name !== 'Federal'
    );

    // Return mapped employee object
    return {
        id: employee.id,
        name: fullName,
        first_name: firstName,
        last_name: lastName,
        firstName: firstName,
        lastName: lastName,
        middleName: employee.middle_name || '',
        email: employee.email || '',
        phone: employee.phone_number || '',
        role: role,
        employmentType: employee.metadata?.employmentType || 'Employee (W2)',
        payRate: payRate,
        payRateType: payRateType,
        avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${fullName}`,
        birthdate: employee.dob || '',
        dob: employee.dob || '',
        ssnLast4: employee.ssn_last_four || '',
        ssn_last_four: employee.ssn_last_four || '',
        ssn_validation_status: employee.ssn_validation_status,
        address: formattedAddress,
        residence: employee.residence,
        onboard: employee.onboard,
        active: employee.active,
        bank_accounts: employee.bank_accounts || [],
        w2_electronic_consent_provided: employee.w2_electronic_consent_provided,
        workplaces: employee.workplaces,
        primary_workplace: employee.primary_workplace,

        federalWithholdings: {
            filingStatus: federalWithholding?.filingStatus || 'Single',
            allowances: employee.metadata?.federalAllowances || 0,
            dependents: employee.metadata?.federalDependents || 0,
            extraWithholdings: employee.metadata?.federalExtraWithholdings || 0
        },
        stateWithholdings: {
            filingStatus: stateWithholding?.filingStatus || 'Single',
            allowances: employee.metadata?.stateAllowances || 0,
            dependents: employee.metadata?.stateDependents || 0,
            extraWithholdings: employee.metadata?.stateExtraWithholdings || 0
        },
        paymentMethod: {
            bankName: employee.metadata?.bankName || '',
            accountLast4: employee.bank_accounts?.length > 0 ?
                employee.bank_accounts[0].slice(-4) :
                employee.metadata?.accountLast4 || '',
            payFrequency: employee.metadata?.payFrequency || 'Bi-weekly payouts'
        },
        earningRates: earningRates
    };
};

// Map UI employee data to Check API format
export const mapUIEmployeeToCheck = (employee: Employee): any => {
    return {
        first_name: employee.firstName || employee.first_name,
        last_name: employee.lastName || employee.last_name,
        middle_name: employee.middleName || employee.middle_name,
        email: employee.email,
        phone_number: employee.phone || employee.phone_number,
        dob: employee.birthdate || employee.dob,
        ssn_last_four: employee.ssnLast4 || employee.ssn_last_four,
        metadata: {
            role: employee.role,
            employmentType: employee.employmentType,
            bankName: employee.paymentMethod?.bankName,
            accountLast4: employee.paymentMethod?.accountLast4,
            payFrequency: employee.paymentMethod?.payFrequency,
            federalAllowances: employee.federalWithholdings?.allowances,
            federalDependents: employee.federalWithholdings?.dependents,
            federalExtraWithholdings: employee.federalWithholdings?.extraWithholdings,
            stateAllowances: employee.stateWithholdings?.allowances,
            stateDependents: employee.stateWithholdings?.dependents,
            stateExtraWithholdings: employee.stateWithholdings?.extraWithholdings
        }
    };
};
