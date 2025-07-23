import React, { createContext, ReactNode, useContext } from "react";



interface ApiContextType{
    dummyProperty: string; // Replace with actual properties and methods
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider : React.FC<{children: ReactNode}> = ({ children }) => {
    const apiContextValue: ApiContextType = {
        dummyProperty: "This is a dummy property" // Replace with actual implementation
    };

    return (
        <ApiContext.Provider value={apiContextValue}>
            {children}
        </ApiContext.Provider>
    );
}

export const useApi = () =>{
    const context = useContext(ApiContext);

    if (!context) {
        throw new Error("useApi must be used within an ApiProvider");
    }

    return context;
}