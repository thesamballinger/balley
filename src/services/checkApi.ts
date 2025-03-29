import axios from 'axios';
import { Employee } from '../types/Employee.ts';
import { Contractor } from '../types/Contractor.ts';
import { EarningRate } from '../types/EarningRate.ts';
import { mapCheckEmployeeToUI, mapUIEmployeeToCheck } from '../utils/dataAdapter.ts';

const API_URL = 'http://localhost:8000/api/v1';

// API client for interacting with our FastAPI backend
class CheckApiClient {
    // Employee methods
    async getEmployees(): Promise<Employee[]> {
        try {
            const response = await axios.get(`${API_URL}/employees`);

            // Fetch earning rates for all employees
            const earningRatesPromises = response.data.map((employee: any) =>
                this.getEarningRates(employee.id)
            );

            const earningRatesResults = await Promise.all(earningRatesPromises);
            console.log('All earning rates results:', earningRatesResults);

            // Map each employee with its earning rates
            return response.data.map((employee: any, index: number) => {
                console.log(`Mapping employee ${employee.first_name} ${employee.last_name} with rates:`,
                    earningRatesResults[index]);
                return mapCheckEmployeeToUI(employee, earningRatesResults[index]);
            });
        } catch (error) {
            console.error('Error fetching employees:', error);
            throw error;
        }
    }

    async getEmployee(id: string): Promise<Employee> {
        try {
            const response = await axios.get(`${API_URL}/employees/${id}`);

            // Fetch earning rates for this employee
            const earningRates = await this.getEarningRates(id);
            console.log(`Earning rates for employee ${id}:`, earningRates);

            // Map the employee with its earning rates
            return mapCheckEmployeeToUI(response.data, earningRates);
        } catch (error) {
            console.error(`Error fetching employee ${id}:`, error);
            throw error;
        }
    }

    async createEmployee(employeeData: Omit<Employee, 'id'>): Promise<Employee> {
        try {
            // Transform our UI data to Check API format
            const checkApiData = mapUIEmployeeToCheck(employeeData as Employee);

            // Add address if provided
            if (employeeData.address) {
                const addressParts = employeeData.address.split(',').map(part => part.trim());
                if (addressParts.length >= 3) {
                    checkApiData.address = {
                        line1: addressParts[0],
                        city: addressParts[addressParts.length - 3],
                        state: addressParts[addressParts.length - 2],
                        postal_code: addressParts[addressParts.length - 1],
                        country: 'US'
                    };
                }
            }

            const response = await axios.post(`${API_URL}/employees`, checkApiData);

            // If we have pay rate info, create an earning rate
            if (employeeData.payRate > 0) {
                const earningRateData = {
                    employee: response.data.id,
                    amount: employeeData.payRate,
                    period: employeeData.payRateType === 'hour' ? 'hourly' : 'annually',
                    name: 'Base Salary',
                    workweek_hours: 40.0
                };

                await this.createEarningRate(earningRateData);
            }

            // Return the mapped employee
            return this.getEmployee(response.data.id);
        } catch (error) {
            console.error('Error creating employee:', error);
            throw error;
        }
    }

    async updateEmployee(id: string, employeeData: Partial<Employee>): Promise<Employee> {
        try {
            // Transform our UI data to Check API format
            const checkApiData = mapUIEmployeeToCheck({
                ...employeeData,
                id
            } as Employee);

            // Only include fields that were provided in the update
            const updateData: any = {};
            if (employeeData.firstName) updateData.first_name = checkApiData.first_name;
            if (employeeData.lastName) updateData.last_name = checkApiData.last_name;
            if (employeeData.email) updateData.email = checkApiData.email;
            if (employeeData.phone) updateData.phone_number = checkApiData.phone_number;
            if (employeeData.birthdate) updateData.dob = checkApiData.dob;
            if (employeeData.metadata) updateData.metadata = checkApiData.metadata;

            // Update the employee
            await axios.patch(`${API_URL}/employees/${id}`, updateData);

            // If pay rate was updated, update the earning rate
            if (employeeData.payRate !== undefined) {
                // Get existing earning rates
                const earningRates = await this.getEarningRates(id);
                const primaryRate = earningRates.find(rate => rate.active);

                if (primaryRate) {
                    // Update existing rate
                    await this.updateEarningRate(primaryRate.id, {
                        amount: employeeData.payRate,
                        period: employeeData.payRateType === 'hour' ? 'hourly' : 'annually'
                    });
                } else if (employeeData.payRate > 0) {
                    // Create new rate
                    await this.createEarningRate({
                        employee: id,
                        amount: employeeData.payRate,
                        period: employeeData.payRateType === 'hour' ? 'hourly' : 'annually',
                        name: 'Base Salary',
                        workweek_hours: 40.0
                    });
                }
            }

            // Return the updated employee
            return this.getEmployee(id);
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
    async getEarningRates(employeeId: string): Promise<any[]> {
        try {
            const url = `${API_URL}/earning_rates?employee=${employeeId}`;
            console.log(`Fetching earning rates from: ${url}`);

            const response = await axios.get(url);
            console.log(`Earning rates response for ${employeeId}:`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching earning rates for employee ${employeeId}:`, error);
            return []; // Return empty array instead of throwing
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

    async updateEarningRate(id: string, data: Partial<EarningRate>): Promise<EarningRate> {
        try {
            const response = await axios.patch(`${API_URL}/earning_rates/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating earning rate ${id}:`, error);
            throw error;
        }
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
