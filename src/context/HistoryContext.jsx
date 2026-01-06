import { createContext, useContext, useEffect, useState } from "react";

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem("viewHistory");
        return saved ? JSON.parse(saved) : [];
    });

    const addToHistory = (item) => {
        setHistory((prev) => {
            const filtered = prev.filter((i) => i.id !== item.id);
            const updated = [item, ...filtered].slice(0, 10);
            return updated;
        });
    };

    const removeFromHistory = (id) => {
        setHistory((prev) => prev.filter((item) => item.id !== id))
    }

    const clearHistory = () => {
        setHistory([])
    }

    useEffect(() => {
        localStorage.setItem("viewHistory", JSON.stringify(history));
    }, [history]);

    return (
        <HistoryContext.Provider value={{ history, addToHistory, removeFromHistory, clearHistory }}>
            {children}
        </HistoryContext.Provider>
    );
};

export const useHistory = () => useContext(HistoryContext);