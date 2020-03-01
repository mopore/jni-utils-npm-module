import { JniCrypto } from "./JniCrypto";

export const createJniCrypto = (passphrase?: string): JniCrypto => {
    return new JniCrypto(passphrase);
}