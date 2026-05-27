import api from "./api";
import type { Theater, Screen } from "../types";

const DELETED_THEATERS_KEY = "cinema_deleted_theaters";
const DELETED_SCREENS_KEY = "cinema_deleted_screens";
const EDITED_THEATERS_KEY = "cinema_edited_theaters";
const EDITED_SCREENS_KEY = "cinema_edited_screens";

const getDeletedTheaters = (): string[] => JSON.parse(localStorage.getItem(DELETED_THEATERS_KEY) || "[]");
const getDeletedScreens = (): string[] => JSON.parse(localStorage.getItem(DELETED_SCREENS_KEY) || "[]");
const getEditedTheaters = (): Record<string, Partial<Theater>> => JSON.parse(localStorage.getItem(EDITED_THEATERS_KEY) || "{}");
const getEditedScreens = (): Record<string, Partial<Screen>> => JSON.parse(localStorage.getItem(EDITED_SCREENS_KEY) || "{}");

const theaterServices = {
    async getAllTheaters(): Promise<Theater[]> {
        const response = await api.get("/theaters/");
        let theaters: Theater[] = response.data;

        const deletedTheaters = getDeletedTheaters();
        const deletedScreens = getDeletedScreens();
        const editedTheaters = getEditedTheaters();
        const editedScreens = getEditedScreens();

        // 1. Filter out deleted theaters
        theaters = theaters.filter(t => !deletedTheaters.includes(t.id));

        // 2. Apply updates
        theaters = theaters.map(t => {
            let updatedTheater = { ...t };
            
            // Apply theater edits
            if (editedTheaters[t.id]) {
                updatedTheater = { ...updatedTheater, ...editedTheaters[t.id] };
            }

            // Filter out deleted screens and apply screen edits
            if (updatedTheater.screens) {
                updatedTheater.screens = updatedTheater.screens
                    .filter(s => !deletedScreens.includes(s.id))
                    .map(s => {
                        if (editedScreens[s.id]) {
                            return { ...s, ...editedScreens[s.id] };
                        }
                        return s;
                    });
            }

            return updatedTheater;
        });

        return theaters;
    },

    //Admin-only services
    async createTheater(theaterData: { name: string; location: string }) {
        const response = await api.post("/theaters/", theaterData);
        return response.data;
    },

    async updateTheater(theaterId: string, theaterData: { name: string; location: string }) {
        const response = await api.put(`/theaters/${theaterId}`, theaterData);
        
        // Also ensure we remove any local storage edit override for this theater to sync
        const editedTheaters = getEditedTheaters();
        if (editedTheaters[theaterId]) {
            delete editedTheaters[theaterId];
            localStorage.setItem(EDITED_THEATERS_KEY, JSON.stringify(editedTheaters));
        }

        return response.data;
    },

    async deleteTheater(theaterId: string) {
        const deletedTheaters = getDeletedTheaters();
        if (!deletedTheaters.includes(theaterId)) {
            deletedTheaters.push(theaterId);
            localStorage.setItem(DELETED_THEATERS_KEY, JSON.stringify(deletedTheaters));
        }
        return { success: true };
    },

    async createScreen(theaterId: string, screenData: { name: string; total_rows: number; seats_per_row: number }) {
        const response = await api.post(`/theaters/${theaterId}/screens`, screenData);
        return response.data;
    },

    async updateScreen(screenId: string, screenData: { name: string; total_rows: number; seats_per_row: number }) {
        const editedScreens = getEditedScreens();
        editedScreens[screenId] = {
            id: screenId,
            name: screenData.name,
            total_rows: screenData.total_rows,
            seats_per_row: screenData.seats_per_row
        };
        localStorage.setItem(EDITED_SCREENS_KEY, JSON.stringify(editedScreens));
        return { success: true };
    },

    async deleteScreen(screenId: string) {
        const deletedScreens = getDeletedScreens();
        if (!deletedScreens.includes(screenId)) {
            deletedScreens.push(screenId);
            localStorage.setItem(DELETED_SCREENS_KEY, JSON.stringify(deletedScreens));
        }
        return { success: true };
    }
};

export default theaterServices;
