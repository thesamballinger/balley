import axios from 'axios';
import { Employee } from '../types/Employee';
import { Contractor } from '../types/Contractor';
import { EarningRate } from '../types/EarningRate';

const API_URL = 'http://localhost:8000/api/v1';

// API client for interacting with our FastAPI backend
class CheckApiClient {
    // Employee methods
    async getEmployees(): Promise<Employee[]> {
        try {
            const response = await axios.get(`${API_URL}/employees`);
            return this.mapEmployeesResponse(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            throw error;
        }
    }

    async getEmployee(id: string): Promise<Employee> {
        try {
            const response = await axios.get(`${API_URL}/employees/${id}`);
            return this.mapEmployeeResponse(response.data);
        } catch (error) {
            console.error(`Error fetching employee ${id}:`, error);
            throw error;
        }
    }

    async createEmployee(employeeData: Partial<Employee>): Promise<Employee> {
        try {
            // Transform our frontend model to the API expected format
            const apiData = this.prepareEmployeeData(employeeData);
            const response = await axios.post(`${API_URL}/employees`, apiData);
            return this.mapEmployeeResponse(response.data);
        } catch (error) {
            console.error('Error creating employee:', error);
            throw error;
        }
    }

    async updateEmployee(id: string, employeeData: Partial<Employee>): Promise<Employee> {
        try {
            // Transform our frontend model to the API expected format
            const apiData = this.prepareEmployeeData(employeeData);
            const response = await axios.patch(`${API_URL}/employees/${id}`, apiData);
            return this.mapEmployeeResponse(response.data);
        } catch (error) {
            console.error(`Error updating employee ${id}:`, error);
            throw error;
        }
    }

    async getEmployeeOnboardingUrl(id: string): Promise<string> {
        try {
            const response = await axios.post(`${API_URL}/employees/${id}/onboard`);
            return response.data.url;
        } catch (error) {
            console.error(`Error generating onboarding URL for employee ${id}:`, error);
            throw error;
        }
    }

    // Earning rate methods
    async getEarningRates(employeeId?: string): Promise<EarningRate[]> {
        try {
            const url = employeeId
                ? `${API_URL}/earning_rates?employee=${employeeId}`
                : `${API_URL}/earning_rates`;

            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching earning rates:', error);
            throw error;
        }
    }

    async createEarningRate(rateData: Partial<EarningRate>): Promise<EarningRate> {
        try {
            const response = await axios.post(`${API_URL}/earning_rates`, rateData);
            return response.data;
        } catch (error) {
            console.error('Error creating earning rate:', error);
            throw error;
        }
    }

    async updateEarningRate(id: string, active: boolean): Promise<EarningRate> {
        try {
            const response = await axios.patch(`${API_URL}/earning_rates/${id}`, { active });
            return response.data;
        } catch (error) {
            console.error(`Error updating earning rate ${id}:`, error);
            throw error;
        }
    }

    // Helper methods for data transformation
    private mapEmployeesResponse(apiEmployees: any[]): Employee[] {
        return apiEmployees.map(emp => this.mapEmployeeResponse(emp));
    }

    private mapEmployeeResponse(apiEmployee: any): Employee {
        // Generate avatar if not provided
        const avatar = apiEmployee.metadata?.avatar ||
            `https://api.dicebear.com/7.x/personas/svg?seed=${apiEmployee.first_name} ${apiEmployee.last_name}`;

        // Map API response to our Employee model
        return {
            id: apiEmployee.id,
            name: apiEmployee.name || `${apiEmployee.first_name} ${apiEmployee.last_name}`,
            firstName: apiEmployee.first_name,
            lastName: apiEmployee.last_name,
            middleName: apiEmployee.middle_name || '',
            email: apiEmployee.email,
            phone: apiEmployee.metadata?.phone || '',
            role: apiEmployee.role || apiEmployee.metadata?.role || 'Employee',
            employmentType: 'Employee (W2)',
            payRate: apiEmployee.metadata?.payRate || 0,
            payRateType: apiEmployee.metadata?.payRateType || 'hour',
            avatar: avatar,
            birthdate: apiEmployee.dob || '',
            ssnLast4: apiEmployee.ssn_last_four || '',
            address: apiEmployee.address?.line1
                ? `${apiEmployee.address.line1}, ${apiEmployee.address.city}, ${apiEmployee.address.state} ${apiEmployee.address.postal_code}`
                : '',
            federalWithholdings: {
                filingStatus: apiEmployee.metadata?.federalFilingStatus || 'Single',
                allowances: apiEmployee.metadata?.federalAllowances || 0,
                dependents: apiEmployee.metadata?.federalDependents || 0,
                extraWithholdings: apiEmployee.metadata?.federalExtraWithholdings || 0
            },
            stateWithholdings: {
                filingStatus: apiEmployee.metadata?.stateFilingStatus || 'Single',
                allowances: apiEmployee.metadata?.stateAllowances || 0,
                dependents: apiEmployee.metadata?.stateDependents || 0,
                extraWithholdings: apiEmployee.metadata?.stateExtraWithholdings || 0
            },
            paymentMethod: {
                bankName: apiEmployee.metadata?.bankName || 'Unknown Bank',
                accountLast4: apiEmployee.metadata?.accountLast4 || '0000',
                payFrequency: apiEmployee.metadata?.payFrequency || 'Bi-weekly payouts'
            }
        };
    }

    private prepareEmployeeData(employee: Partial<Employee>): any {
        // Extract address components if address is a string
        let address = null;
        if (typeof employee.address === 'string' && employee.address) {
            const parts = employee.address.split(',').map(part => part.trim());
            if (parts.length >= 3) {
                const line1 = parts[0];
                const city = parts[1];
                const stateZip = parts[2].split(' ');
                const state = stateZip[0];
                const postalCode = stateZip[1] || '';

                address = {
                    line1,
                    city,
                    state,
                    postal_code: postalCode,
                    country: 'US'
                };
            }
        }

        // Prepare metadata with all the custom fields we want to store
        const metadata: Record<string, any> = {
            ...(employee.role && { role: employee.role }),
            ...(employee.phone && { phone: employee.phone }),
            ...(employee.payRate && { payRate: employee.payRate }),
            ...(employee.payRateType && { payRateType: employee.payRateType }),
            ...(employee.avatar && { avatar: employee.avatar }),

            // Payment method
            ...(employee.paymentMethod?.bankName && { bankName: employee.paymentMethod.bankName }),
            ...(employee.paymentMethod?.accountLast4 && { accountLast4: employee.paymentMethod.accountLast4 }),
            ...(employee.paymentMethod?.payFrequency && { payFrequency: employee.paymentMethod.payFrequency }),

            // Federal withholdings
            ...(employee.federalWithholdings?.filingStatus && { federalFilingStatus: employee.federalWithholdings.filingStatus }),
            ...(employee.federalWithholdings?.allowances !== undefined && { federalAllowances: employee.federalWithholdings.allowances }),
            ...(employee.federalWithholdings?.dependents !== undefined && { federalDependents: employee.federalWithholdings.dependents }),
            ...(employee.federalWithholdings?.extraWithholdings !== undefined && { federalExtraWithholdings: employee.federalWithholdings.extraWithholdings }),

            // State withholdings
            ...(employee.stateWithholdings?.filingStatus && { stateFilingStatus: employee.stateWithholdings.filingStatus }),
            ...(employee.stateWithholdings?.allowances !== undefined && { stateAllowances: employee.stateWithholdings.allowances }),
            ...(employee.stateWithholdings?.dependents !== undefined && { stateDependents: employee.stateWithholdings.dependents }),
            ...(employee.stateWithholdings?.extraWithholdings !== undefined && { stateExtraWithholdings: employee.stateWithholdings.extraWithholdings })
        };

        // Prepare the API data format
        return {
            first_name: employee.firstName,
            last_name: employee.lastName,
            middle_name: employee.middleName,
            email: employee.email,
            dob: employee.birthdate,
            ...(address && { residence: address }),
            metadata
        };
    }
}

// Create a singleton instance
export const checkApi = new CheckApiClient();

// Local storage service for contractors and employee metadata
export const localStorageService = {
    // Contractor methods
    getContractors(): Contractor[] {
        const stored = localStorage.getItem('contractors');
        return stored ? JSON.parse(stored) : [];
    },

    saveContractors(contractors: Contractor[]): void {
        localStorage.setItem('contractors', JSON.stringify(contractors));
    },

    addContractor(contractor: Contractor): Contractor {
        const contractors = this.getContractors();
        const newContractor = {
            ...contractor,
            id: `contractor_${Date.now()}`
        };
        contractors.push(newContractor);
        this.saveContractors(contractors);
        return newContractor;
    },

    updateContractor(id: string, data: Partial<Contractor>): Contractor | null {
        const contractors = this.getContractors();
        const index = contractors.findIndex(c => c.id === id);
        if (index === -1) return null;

        contractors[index] = { ...contractors[index], ...data };
        this.saveContractors(contractors);
        return contractors[index];
    },

    deleteContractor(id: string): boolean {
        const contractors = this.getContractors();
        const filtered = contractors.filter(c => c.id !== id);
        if (filtered.length === contractors.length) return false;

        this.saveContractors(filtered);
        return true;
    }
};

export default checkApi;
