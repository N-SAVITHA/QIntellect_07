import axios from "axios";
import { useEffect, useState } from "react";
import { createContext } from "react";

export const UserContext = createContext();

export function UserContextProvider({ children }) {
    const [user, setUser] = useState({});
    const [medical, setMedical] = useState({
        cp: "",
        trestbps: "",
        chol: "",
        thalach: "",
        exang: "",
        smoking: "",
        glucose: "",
        ht: "",
        wt: "",
    });

    return (
        <UserContext.Provider value={{ user, setUser, medical, setMedical }}>
            {children}
        </UserContext.Provider>
    )
}