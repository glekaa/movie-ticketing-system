import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { BasketItem, BasketContextType } from "../types";

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export const BasketProvider = ({ children }: { children: ReactNode }) => {
    const [basket, setBasket] = useState<BasketItem[]>(() => {
        try {
            const saved = localStorage.getItem("cinema_basket");
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to parse basket from localStorage", e);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem("cinema_basket", JSON.stringify(basket));
        } catch (e) {
            console.error("Failed to save basket to localStorage", e);
        }
    }, [basket]);

    // Clean up expired tickets periodically
    useEffect(() => {
        const interval = setInterval(() => {
            setBasket((prev) => {
                const now = Date.now();
                const hasExpired = prev.some((item) => item.expiresAt && item.expiresAt < now);
                if (hasExpired) {
                    return prev.filter((item) => !item.expiresAt || item.expiresAt >= now);
                }
                return prev;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const addToBasket = (item: Omit<BasketItem, "id" | "totalPrice">) => {
        setBasket((prev) => {
            // Check if exact same showtime is already in the basket
            const existingIndex = prev.findIndex(
                (i) => i.showtimeId === item.showtimeId
            );

            const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes reservation time

            if (existingIndex > -1) {
                const updated = [...prev];
                const newQuantity = updated[existingIndex].quantity + item.quantity;
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: newQuantity,
                    totalPrice: Number((newQuantity * item.ticketPrice).toFixed(2)),
                    expiresAt: expiryTime, // Reset/extend timer on quantity increase
                };
                return updated;
            }

            // Otherwise add new item
            const newItem: BasketItem = {
                ...item,
                id: `${item.showtimeId}_${Date.now()}`,
                totalPrice: Number((item.quantity * item.ticketPrice).toFixed(2)),
                expiresAt: expiryTime,
            };
            return [...prev, newItem];
        });
    };

    const updateQuantity = (itemId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromBasket(itemId);
            return;
        }

        setBasket((prev) =>
            prev.map((item) =>
                item.id === itemId
                    ? {
                          ...item,
                          quantity: newQuantity,
                          totalPrice: Number((newQuantity * item.ticketPrice).toFixed(2)),
                      }
                    : item
            )
        );
    };

    const removeFromBasket = (itemId: string) => {
        setBasket((prev) => prev.filter((item) => item.id !== itemId));
    };

    const clearBasket = () => {
        setBasket([]);
    };

    return (
        <BasketContext.Provider
            value={{
                basket,
                addToBasket,
                updateQuantity,
                removeFromBasket,
                clearBasket,
            }}
        >
            {children}
        </BasketContext.Provider>
    );
};

export const useBasket = () => {
    const context = useContext(BasketContext);
    if (!context) {
        throw new Error("useBasket must be used within a BasketProvider");
    }
    return context;
};
