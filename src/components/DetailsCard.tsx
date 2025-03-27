import React from 'react';

export type EmployeeDetails = {
  id: number | string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  birthdate: string;
  ssnMasked: string;        // e.g. ***-**-2244
  address: string;
  federalWithholdings: {
    filingStatus: 'Married' | 'Jointly' | 'Head of household' | 'Single';
    allowances: number;
    dependents: number;
    extraWithholdings: number;
  };
  stateWithholdings: {
    filingStatus: 'Married' | 'Single';
    allowances: number;
    dependents: number;
    extraWithholdings: number;
  };
  paymentMethod: {
    bankName: string;
    accountLast4: string;
    payFrequency: string; // e.g. 'Bi-weekly payouts'
  };
  // Add any other full detail fields you might need
};

interface DetailsCardProps {
  employeeDetails: EmployeeDetails | null;
}

const DetailsCard: React.FC<DetailsCardProps> = ({ employeeDetails }) => {
  if (!employeeDetails) {
    return (
      <div style={{ flex: 1, padding: '2rem' }}>
        <h2>Select an employee to see detailed info</h2>
      </div>
    );
  }

  const {
    name,
    contactEmail,
    contactPhone,
    birthdate,
    ssnMasked,
    address,
    federalWithholdings,
    stateWithholdings,
    paymentMethod,
  } = employeeDetails;

  return (
    <div
      style={{
        flex: 1,
        padding: '2rem',
        backgroundColor: '#fefefe',
        border: '1px solid #ccc',
        borderRadius: '25px',
      }}
    >
      <h2 style={{ marginBottom: '1rem' }}>{name}</h2>

      {/* Contact Info */}
      <section style={{ marginBottom: '1.5rem' }}>
        <h3>Contact</h3>
        <p>Email: {contactEmail}</p>
        <p>Phone: {contactPhone}</p>
      </section>

      {/* Employee Info */}
      <section style={{ marginBottom: '1.5rem' }}>
        <h3>Employee Info</h3>
        <p>Birthdate: {birthdate}</p>
        <p>SSN: {ssnMasked}</p>
        <p>Address: {address}</p>
      </section>

      {/* Federal Withholdings */}
      <section style={{ marginBottom: '1.5rem' }}>
        <h3>Federal Withholdings</h3>
        <p>Filing Status: {federalWithholdings.filingStatus}</p>
        <p>Allowances: {federalWithholdings.allowances}</p>
        <p>Dependents: {federalWithholdings.dependents}</p>
        <p>Extra Withholdings: ${federalWithholdings.extraWithholdings}</p>
      </section>

      {/* State Withholdings */}
      <section style={{ marginBottom: '1.5rem' }}>
        <h3>State Withholdings</h3>
        <p>Filing Status: {stateWithholdings.filingStatus}</p>
        <p>Allowances: {stateWithholdings.allowances}</p>
        <p>Dependents: {stateWithholdings.dependents}</p>
        <p>Extra Withholdings: ${stateWithholdings.extraWithholdings}</p>
      </section>

      {/* Payment Method */}
      <section style={{ marginBottom: '1.5rem' }}>
        <h3>Payment</h3>
        <p>Bank: {paymentMethod.bankName}</p>
        <p>Account Last 4: **** {paymentMethod.accountLast4}</p>
        <p>Pay Frequency: {paymentMethod.payFrequency}</p>
      </section>
    </div>
  );
};

export default DetailsCard;