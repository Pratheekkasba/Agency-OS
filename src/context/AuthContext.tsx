"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, onSnapshot } from "firebase/firestore";
import { ensureUserDoc } from "@/lib/firebase/firestore";

interface UserData {
    role?: "agency" | "client";
    /** Single source of truth for org membership. Do not use agencyId. */
    organization_id?: string;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    userData: UserData | null;
    loading: boolean;
    /** Bumped after refreshUser() so consumers re-read user.emailVerified */
    userRefreshKey: number;
    refreshUser: () => Promise<boolean>;
    refreshSession: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userData: null,
    loading: true,
    userRefreshKey: 0,
    refreshUser: async () => false,
    refreshSession: async () => { },
    signInWithGoogle: async () => { },
    signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [userRefreshKey, setUserRefreshKey] = useState(0);

    const refreshUser = useCallback(async (): Promise<boolean> => {
        const currentUser = auth.currentUser;
        if (!currentUser) return false;
        await currentUser.reload();
        setUser(auth.currentUser);
        setUserRefreshKey((k) => k + 1);
        return auth.currentUser?.emailVerified ?? false;
    }, []);

    const refreshSession = useCallback(async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;
        // Force refresh the ID token to pick up new Custom Claims (org_id, role)
        await currentUser.getIdToken(true);
        // Reload user object to sync properties
        await currentUser.reload();
        setUser(auth.currentUser);
        setUserRefreshKey((k) => k + 1);
    }, []);

    useEffect(() => {
        let unsubDoc: () => void;
        
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                // Refresh JWT so custom claims (organization_id) are available to Firestore rules
                user.getIdToken(true).catch(() => {});

                const userRef = doc(db, "users", user.uid);
                unsubDoc = onSnapshot(userRef, async (docSnap) => {
                    if (docSnap.exists()) {
                        setUserData(docSnap.data() as UserData);
                    } else {
                        // First sign-in: create a stub user doc
                        await ensureUserDoc(user.uid, user.email, user.displayName);
                        setUserData(null);
                    }
                    setLoading(false);
                });
            } else {
                setUserData(null);
                setLoading(false);
                if (unsubDoc) unsubDoc();
            }
        });
        
        return () => {
            unsubscribe();
            if (unsubDoc) unsubDoc();
        };
    }, []);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, userData, loading, userRefreshKey, refreshUser, refreshSession, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
