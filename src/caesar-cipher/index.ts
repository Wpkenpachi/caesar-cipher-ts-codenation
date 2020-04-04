import { strings } from "./../helpers/strings";

const _alphabet: string[] = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const _exceptions: string[] = [" ", ".", ",", ":", ";"];

interface config {
    exceptions: string[];
    defaultNotAllowedExcpetions: boolean;
    leapValue: number;
}

interface EncryptParams {
    config?: config;
    alphabet?: string[];
}

interface EncryptReturn {
    alphabet: string[];
    config: config;
}

interface DecryptParams {
    config?: config;
    alphabet?: string[];
}

interface CaesarCipherReturn {
    encrypt: Function;
    decrypt: Function;
}

export function CaesarCipher(): CaesarCipherReturn {
    return {
        encrypt,
        decrypt
    }
}

function encrypt(textPayload: string, param: EncryptParams = {}) {
    const alphabet: string[] = param.alphabet ? param?.alphabet : _alphabet;
    const exceptions: string[] = param.config?.exceptions ? [...param.config.exceptions, ..._exceptions] : _exceptions;
    const defaultNotAllowedExcpetions: boolean = !!param.config?.defaultNotAllowedExcpetions;
    const leapValue: number = param.config?.leapValue ? param.config.leapValue : 1;
    const textAsArr: string[] = textPayload.split("");
    const encryptedArr: string[] = [];
    let encrypted: string = "";

    textAsArr.forEach((letter, letterIndex) => {
        const canShow = checkNotAllowedExceptions(letter, defaultNotAllowedExcpetions, exceptions);
        const canLeap = checkExceptions(letter, exceptions);

        if (canShow) {
            let leaptLetter;
            if (canLeap) {
                const leaptIndex = leapTo(letter, leapValue, alphabet);
                console.log(leaptIndex);
                leaptLetter = alphabet[leaptIndex];
            } else {
                leaptLetter = letter;
            }
            encryptedArr.push(leaptLetter);
        }
    });

    encrypted = encryptedArr.join("");

    return {
        encrypted,
        alphabet,
        config: {
            defaultNotAllowedExcpetions,
            exceptions,
            leapValue
        }
    }
}

function decrypt(encrypted: string, param: DecryptParams = {}) {
    const alphabet: string[] = param.alphabet ? param?.alphabet : _alphabet;
    const exceptions: string[] = param.config?.exceptions ? [...param.config.exceptions, ..._exceptions] : _exceptions;
    const defaultNotAllowedExcpetions: boolean = !!param.config?.defaultNotAllowedExcpetions;
    const leapValue: number = param.config?.leapValue ? param.config.leapValue : 1;
    const textAsArr: string[] = encrypted.split("");
    const decryptedArr: string[] = [];
    let decrypted: string = "";

    textAsArr.forEach((letter, letterIndex) => {
        const canShow = checkNotAllowedExceptions(letter, defaultNotAllowedExcpetions, exceptions);
        const canLeap = checkExceptions(letter, exceptions);

        if (canShow) {
            let leaptLetter;
            if (canLeap) {
                const leaptIndex = leapTo(letter, leapValue, alphabet, false);
                leaptLetter = alphabet[leaptIndex];
            } else {
                leaptLetter = letter;
            }
            decryptedArr.push(leaptLetter);
        }
    });

    decrypted = decryptedArr.join("");

    return {
        decrypted,
        alphabet,
        config: {
            defaultNotAllowedExcpetions,
            exceptions,
            leapValue
        }
    }
}

/**
 *
 * @param letterIndex @type Integer
 * @param leapValue @type Integer
 * @param alphabet @type string[]
 * @param forwardLeap @type boolean
 */
function leapTo(letter: string, leapValue: number, alphabet: string[], forwardLeap: boolean = true): number {
    const letterIndex = alphabet.indexOf(letter);
    const alphabetLength: number = alphabet.length;
    let targetIndex: number;
    if (forwardLeap) {
        const isOutOrMaxOfRange: boolean = (letterIndex + leapValue) >= alphabetLength;
        if (isOutOrMaxOfRange) {
            targetIndex = (letterIndex + leapValue) - alphabetLength;
        } else {
            targetIndex = letterIndex + leapValue;
        }
    } else {
        const isOutOfRange: boolean = (letterIndex - leapValue) < 0;
        if (isOutOfRange) {
            targetIndex = alphabetLength - Math.abs((letterIndex - leapValue));
        } else {
            targetIndex = letterIndex - leapValue;
        }
    }

    return Math.abs(targetIndex);
}

function checkNotAllowedExceptions(letter: string, defaultNotAllowedExcpetions: boolean, exceptions: string[]): boolean {
    if (defaultNotAllowedExcpetions) {
        if (letter.match(/\W/i) && !exceptions.includes(letter)) return false;
    }
    return true;
}

function checkExceptions(letter: string, exceptions: string[]): boolean {
    if (exceptions.includes(letter)) {
        return false;
    }

    return true;
}