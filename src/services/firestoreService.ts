// src/services/firestoreService.ts
import { db } from '../firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { EmployeePreview } from '../components/PreviewEmployeeCard';
import { EmployeeDetails as EmployeeDetailsType } from '../components/DetailsCard';

interface CombinedEmployeeData {
    preview: EmployeePreview;
    details: EmployeeDetailsType;
}

// Store employee data in Firestore
export const storeEmployeeData = async (
    companyId: string,
    workplaceId: string,
    employeeData: CombinedEmployeeData
) => {
    const employeeRef = doc(
        db,
        `companies/${companyId}/workplaces/${workplaceId}/employees`,
        employeeData.preview.id.toString()
    );
    await setDoc(employeeRef, {
        preview: employeeData.preview,
        details: employeeData.details,
    });
};

// Fetch all employees from Firestore
export const fetchEmployeesFromFirestore = async (
    companyId: string,
    workplaceId: string
): Promise<CombinedEmployeeData[]> => {
    const employeesRef = collection(
        db,
        `companies/${companyId}/workplaces/${workplaceId}/employees`
    );
    const snapshot = await getDocs(employeesRef);
    return snapshot.docs.map((doc) => doc.data() as CombinedEmployeeData);
};