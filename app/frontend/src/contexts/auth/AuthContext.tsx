import React, { createContext, useState, useEffect, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import type { AuthContextType } from "../../types/auth/AuthContext";
import type { AuthUser } from "../../types/auth/AuthUser";
import { SaveValueByKey, ReadValueByKey, RemoveValueByKey} from "../../helpers/local_storage";
import type { JwtTokenClaims } from "../../types/auth/JwtTokenClaims";

// KREIRANJE CONTEXT-A
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper za dekodiranje JWT tokena
const decodeJWT = (token: string): JwtTokenClaims | null => {
    try {
        const decoded = jwtDecode<JwtTokenClaims>(token);

        // PRILAGODJENO: provera da JWT payload ima potrebna polja (id, username, role)
        if (decoded && decoded.id && decoded.username && decoded.role) {
            return {
                id: decoded.id,
                username: decoded.username,
                role: decoded.role,
                exp: decoded.exp
            };
        }
        return null;
    } catch (error) {
        console.error("Error decoding JWT token:", error);
        return null;
    }
};

// Helper za proveru isticanja tokena
const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode<JwtTokenClaims>(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp ? decoded.exp < currentTime : false;
    } catch {
        return true;
    }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // =========== INIT: UCITAJ TOKEN IZ LOCALSTORAGE ===========
    useEffect(() => {
        const savedToken = ReadValueByKey("jwt");
        if (savedToken && !isTokenExpired(savedToken)) {
            const claims = decodeJWT(savedToken);
            if (claims) {
                setToken(savedToken);
                setUser({
                    id: claims.id,
                    username: claims.username,
                    role: claims.role
                });
            } else {
                RemoveValueByKey("jwt");
            }
        } else {
            RemoveValueByKey("jwt");
        }
        setIsLoading(false);
    }, []);

    // =========== LOGIN METODA ===========
    const login = (newToken: string) => {
        const claims = decodeJWT(newToken);
        if (claims && !isTokenExpired(newToken)) {
            setToken(newToken);
            setUser({
                id: claims.id,
                username: claims.username,
                role: claims.role
            });
            SaveValueByKey("jwt", newToken);
        } else {
            console.error("Invalid or expired token at login.");
            RemoveValueByKey("jwt");
            setToken(null);
            setUser(null);
        }
    };

    // =========== LOGOUT METODA ===========
    const logout = () => {
        setToken(null);
        setUser(null);
        RemoveValueByKey("jwt");
    };

    const isAuthenticated = !!user && !!token;

    const value: AuthContextType = {
        user,
        token,
        login,
        logout,
        isAuthenticated,
        isLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;