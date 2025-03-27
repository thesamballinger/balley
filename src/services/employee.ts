import axios from 'axios';

// API base URL
const API_URL = 'https://sandbox.checkhq.com';

// Replace with your API authentication details (e.g., token, headers)
const API_TOKEN = 'rwGEuUWzt62t0f2GyZwgBKbOtk0m6Vioif1K3Pkp'; // TODO: Replace with actual token

// Function to fetch employees for a company
export const fetchEmployees = async (companyId: string) => {
    try {
        const response = await axios.post(
            `${API_URL}/employees?company=${companyId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.results;
    } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
    }
};

// Function to fetch detailed employee data by ID (optional, for later use)
export const fetchEmployeeDetails = async (employeeId: string) => {
    try {
        const response = await axios.get(`${API_URL}/employees/${employeeId}`, {
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching employee details:', error);
        throw error;
    }
};