import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { auth, db } from "@/services/firebase";

//Formats Firebase error codes into human-readable user messages
const formatAuthError = ( errorCode ) => {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'This email address is already registered.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Invalid email or password.';
        case 'auth/weak-password':
            return 'Password must be at least 6 characters.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection.';
        default:
            return 'An unexpected error occurred. Please try again.';
    }
};

// Format phone number to strict E.164 (+1234567890)
export const validateAndFormatPhone = ( rawPhone, defaultCountry = 'IN' ) => {
    try {
        if ( !rawPhone || typeof rawPhone !== 'string' ) {
            return { valid: false, formatted: null };
        }
        const trimmed = rawPhone.trim();
        // Parse with international fallback
        const phoneNumber = parsePhoneNumberFromString( trimmed, defaultCountry );
        if ( phoneNumber && phoneNumber.isValid() ) {
            return {
                valid: true,
                formatted: phoneNumber.number, // Always returns strict E.164 (e.g., +918282833975)
            };
        }
        return { valid: false, formatted: null };
    } catch ( err ) {
        return { valid: false, formatted: null };
    }
};

//Register a new user
export const registerUser = async ( email, password, displayName, rawPhone ) => {
    try{
        const phoneCheck = validateAndFormatPhone( rawPhone );
        if ( !phoneCheck.valid ) {
            return { success: false, error: 'Please enter a valid phone number with country code.' };
        }
        const userCredential = await createUserWithEmailAndPassword( auth, email, password );
        const user = userCredential.user;
        const trimmedName = displayName.trim() || email.split('@')[0];
        const defaultAvatar = `https://ui-avatars.com/api/?name=${ encodeURIComponent( trimmedName ) }&background=00A884&color=fff`;
        const userDocRef = doc( db, 'users', user.uid );
        const userProfile = {
            uid: user.uid,
            email: user.email.toLowerCase(),
            displayName: trimmedName,
            phoneNumber: phoneCheck.formatted,
            avatarUrl: defaultAvatar,
            about: 'Hey there! I am using Nudge.',
            createdAt: serverTimestamp(),
            lastSeen: serverTimestamp(),
            isOnline: true,
        };
        await setDoc( userDocRef, userProfile );
        return { success: true, user: userProfile, formattedPhone: phoneCheck.formatted, error: null };
    } catch ( error ) {
        return { success: false, user: null, error: formatAuthError(error.code) };
    }
}

// 2. Complete Phone Verification in Firestore
export const completePhoneVerification = async ( uid ) => {
    try {
        const userDocRef = doc( db, 'users', uid );
        await updateDoc( userDocRef, {
            phoneVerified: true,
            updatedAt: serverTimestamp(),
        } );
        return { success: true, error: null };
    } catch ( error ) {
        return { success: false, error: error.message };
    }
};

//Sign in existing user
export const loginUser = async ( email, password ) => {
    try{
        const userCredential = await signInWithEmailAndPassword( auth, email, password );
        const user = userCredential.user;
        const userDocRef = doc( db, 'users', user.uid );
        const userDocSnap = await getDoc( userDocRef );
        if ( !userDocSnap.exists() ) {
            return { success: false, user: null, error: 'User profile not found.' };
        }
        return { success: true, user: userDocSnap.data(), error: null };
    }catch ( error ) {
        return { success: false, user: null, error: formatAuthError( error.code ) };
    }
}

//forgot password
export const forgotPassword = async email => {
    try{
        await sendPasswordResetEmail( auth, email.trim() );
        return { success: true, error: null };
    } catch( error ){
       return { success: false, error: formatAuthError( error.code ) };
    }
}

//Log out user
export const logoutUser = async () => {
    try{
        await signOut( auth );
        return { success: true, error: null };
    } catch ( error ) {
        return { success: false, error: 'Failed to log out.' };
    }
}