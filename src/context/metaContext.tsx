import { createContext, useContext, useEffect, useState } from "react";
import { getStatuses, getPriorities } from "../api/metaService";

type MetaItem = { id: number; name: string };

type MetaContextType = {
    statuses: MetaItem[];
    priorities: MetaItem[];
    refreshStatuses: () => Promise<void>;
    refreshPriorities: () => Promise<void>;
};

const MetaContext = createContext<MetaContextType | null>(null);

export const MetaProvider = ({ children }: { children: React.ReactNode }) => {
    const [statuses, setStatuses] = useState<MetaItem[]>([]);
    const [priorities, setPriorities] = useState<MetaItem[]>([]);

    const refreshStatuses = async () => {
        setStatuses(await getStatuses());
    };

    const refreshPriorities = async () => {
        setPriorities(await getPriorities());
    };

    useEffect(() => {
        refreshStatuses();
        refreshPriorities();
    }, []);

    return (
        <MetaContext.Provider
            value={{
                statuses,
                priorities,
                refreshStatuses,
                refreshPriorities,
            }}
        >
            {children}
        </MetaContext.Provider>
    );
};

export const useMeta = () => {
    const ctx = useContext(MetaContext);
    if (!ctx) {
        throw new Error("useMeta must be used inside MetaProvider");
    }
    return ctx;
};
