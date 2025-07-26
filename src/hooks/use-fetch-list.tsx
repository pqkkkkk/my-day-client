import { useEffect, useState } from "react";
import { useApi } from "@/contexts/ApiContext";
import { ListFilterObject, TaskFilterObject } from "@/types/api-request-body";

export const useFetchList = <Q extends object, T extends object> (entity: string, query: Q) => {
    const { listService, taskService } = useApi();

    const [data, setData] = useState<T[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                switch (entity){
                    case "list":
                        const response = await listService.getLists(query as ListFilterObject);
                        setData(response.data.content as T[])
                        setTotalPages(response.data.totalPages);
                        break;
                    case "task":
                        const taskResponse = await taskService.getTasks(query as TaskFilterObject);
                        setData(taskResponse.data.content as T[]);
                        setTotalPages(taskResponse.data.totalPages);
                        break;
                    default:
                        throw new Error(`Unsupported entity: ${entity}`);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [entity, query, listService, taskService]);

    const addToList = (newObject: T) =>{
        setData(prevData => [...prevData, newObject]);
    }
    return {
        data,
        totalPages,
        addToList
    };
}