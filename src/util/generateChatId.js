/**
    *Generates a unique, deterministic 1-on-1 chat room ID.
    *e.g., getChatId("user_B", "user_A") -> "user_A_user_B"
    *@param {string} uid1
    *@param {string} uid2
    *@returns {string}
**/
export const getChatId = ( uid1, uid2 ) => {
    if ( !uid1 || !uid2 ) return '';
    return [ uid1, uid2 ].sort().join( '_' );
};