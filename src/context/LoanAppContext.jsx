import { createContext, useContext, useState } from "react";

const initialFormData = {
    personalInfo: {
        age: "",
        employmentStatus: "",
        employmentDuration: "",
    },
    financialInfo: {
        monthlyIncome: "",
        monthlyExpenses: "",
        existingDebt: "",
        creditScore: "",
    },
    loanDetails: {
        requestedAmount: "",
        loanTerm: "",
        loanPurpose: "",
    },
};

const LoanAppContext = createContext(null)

export const LoanAppProvider = ({children}) => {
    const [formData, setFormData] = useState(initialFormData);

    const updateSection = (section, data) => {
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                ...data,
            }
        }));
    };

    return (
        <LoanAppContext.Provider value={{formData, setFormData, updateSection}}>
            {children}
        </LoanAppContext.Provider>
    );
};

export const useLoanApp = () => {
    const context = useContext(LoanAppContext);

    if(!context) {
        throw new Error(
            "useLoanApplication must be used within LoanApplicationProvider"
        )
    }

    return context;
}