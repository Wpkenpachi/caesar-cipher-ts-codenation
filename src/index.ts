import { CaesarCipher } from "./caesar-cipher";

const cipher = CaesarCipher();
const decrypted = cipher.decrypt("mrxip mrwmhi mw e kszivrqirx aevrmrk viuymvih fc pea. yrorsar", {
    config: {
        defaultNotAllowedExcpetions: true,
        leapValue: 4
    }
});

console.log(decrypted.decrypted);