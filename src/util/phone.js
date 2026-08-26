import { parsePhoneNumberFromString } from 'libphonenumber-js';
/**
    *Normalizes a raw phone string into E.164 format.
    *@param {string} rawPhone - e.g. "98765 43210", "+91 98765-43210"
    *@param {string} defaultCountry - Default country code fallback (e.g., 'IN')
    *@returns {string|null} - e.g. "+919876543210" or null if invalid
**/

export const normalizePhoneNumber = ( rawPhone, defaultCountry = 'IN' ) => {
    if ( !rawPhone ) return null;
    try {
        const parsed = parsePhoneNumberFromString( rawPhone, defaultCountry );
        if (parsed && parsed.isValid()) {
            return parsed.number; // Returns E.164 formatted string (e.g., "+919876543210")
        }
    } catch ( error ) {
        console.warn( 'Failed to parse phone number:', rawPhone, error );
    }
    return null;
};