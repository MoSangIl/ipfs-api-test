function toBase64(arr) {
    // arr = new Uint8Array(arr) //if it's an ArrayBuffer
    return btoa(
       arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
 }