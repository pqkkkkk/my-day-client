"use client"

import { useAuth } from "@/contexts/AuthContext";
import { useCallback, useRef, useState, useEffect } from "react"


export const useQuery = <T extends object>(initialQuery: T, hasUsername?: boolean) => {
    const { user, isLoading } = useAuth();

    const [query, setQuery] = useState<T>(initialQuery);

    const initialQueryRef = useRef<T>(initialQuery);

    // Auto-update username when user changes (for queries that need username)
    useEffect(() => {
        if (hasUsername && !isLoading && user?.username) {
            setQuery(prevQuery => ({
                ...prevQuery,
                username: user.username
            } as T));
        }
    }, [user?.username, isLoading, hasUsername]);

    const updateQuery = useCallback((newQuery: Partial<T>) =>{
        setQuery(prevQuery => ({
            ...prevQuery,
            ...newQuery
        }));
    }, []);

    const resetQuery = useCallback(() =>{
        const resetValue = hasUsername && user?.username 
            ? { ...initialQueryRef.current, username: user.username } as T
            : initialQueryRef.current;
        setQuery(resetValue);
    }, [hasUsername, user?.username]);

    return {
        query,
        updateQuery,
        resetQuery
    };
}