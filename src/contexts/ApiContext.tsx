"use client"

import { authService, listService, taskService } from "@/api/api-services";
import React, { createContext, ReactNode, useContext } from "react";


interface ApiContextType{
    authService: typeof authService,
    listService: typeof listService,
    taskService: typeof taskService
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider : React.FC<{children: ReactNode}> = ({ children }) => {
    const apiServices = {
        authService: authService,
        listService: listService,
        taskService: taskService
    }

    return (
        <ApiContext.Provider value={apiServices}>
            {children}
        </ApiContext.Provider>
    );
}

export const useApi = () => {
    const context = useContext(ApiContext);

    if (!context) {
        throw new Error("useApi must be used within an ApiProvider");
    }

    return context;
}
