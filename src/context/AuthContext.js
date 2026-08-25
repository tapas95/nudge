import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/services/firebase";
import { loginUser, registerUser, forgotPassword, logoutUser } from "@/services/authService";

const AuthContext = createContext( null );

export const AuthProvider = ( { children } ) => {
    const [ user, setUser ] = useState( null );
    const [ initializing, setInitializing ] = useState( true );
    useEffect( () => {
        let unsubscribeProfile = null;
        const unsubscribeAuth = onAuthStateChanged( auth, ( firebaseUser ) => {
            if ( firebaseUser ) {
                const userDocRef = doc( db, 'users', firebaseUser.uid );
                unsubscribeProfile = onSnapshot(
                    userDocRef,
                    ( docSnap ) => {
                        if ( docSnap.exists() ) {
                            setUser( docSnap.data() );
                        } else {
                            setUser( { uid: firebaseUser.uid, email: firebaseUser.email } );
                        }
                        setInitializing( false );
                    },
                    ( error ) => {
                        console.error( 'Firestore user fetch error:', error );
                        setInitializing( false );
                    }
                );
            } else {
                setUser( null );
                if ( unsubscribeProfile ) unsubscribeProfile();
                setInitializing( false );
            }
        } );
        return () => {
            unsubscribeAuth();
            if ( unsubscribeProfile ) unsubscribeProfile();
        };
    }, [] );
    const value = {
        user,
        isAuthenticated: !!user,
        initializing,
        register: registerUser,
        login: loginUser,
        resetPassword: forgotPassword,
        logout: logoutUser,
    };
    return <AuthContext.Provider value={ value }>{ children }</AuthContext.Provider>;
}
export const useAuth = () => {
    const context = useContext( AuthContext );
    if ( !context ) {
        throw new Error( 'useAuth must be used within an AuthProvider' );
    }
    return context;
};