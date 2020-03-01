import * as crypto from "crypto";
import fs from "fs";

const AES_256_GCM_NAME = 'aes-256-gcm';
const BASE_64_NAME = 'base64';
const UTF_8_NAME = 'utf-8';
const SHA_256_NAME = 'sha256';

const PATH_TO_SECRETS = './secrets';
const PATH_TO_KEY = `${PATH_TO_SECRETS}/KeyV2.secret`;
const PATH_TO_SALT = `${PATH_TO_SECRETS}/SaltV2.secret`;

type SecretPair = {
    key: Buffer;
    salt: Buffer;
}

export class JniCrypto {

    static version = 'v2.0';

    private _key: Buffer;
    private _salt: Buffer;
    private _prefix: string;

    constructor(passphrase?: string){
        if (passphrase){
            JniCrypto.createSecrets(passphrase);
        }
        const secretPair = JniCrypto.readSecrets();
        this._key = secretPair.key;
        this._salt = secretPair.salt;
        this._prefix = this.encryptToB64('').substr(0,21);
    }

    static createSecrets( passphrase: string ): void{
        const sidekick = JniCrypto.version;

        const saltBuffer = ((): Buffer => {
            const rawBuffer = Buffer.concat([Buffer.from(sidekick),Buffer.alloc(16)],16);
            const tempString = crypto.createHash('md5').update(rawBuffer).digest(BASE_64_NAME);
            const saltBuffer = Buffer.concat([Buffer.from(tempString)],16);
            return saltBuffer;
        })();

        const key = crypto.pbkdf2Sync(passphrase, saltBuffer, 40000, 32, SHA_256_NAME);

        if (!fs.existsSync(PATH_TO_SECRETS)){
            try{
                fs.mkdirSync(PATH_TO_SECRETS)
            }
            catch(error){
                throw new Error(`Could not created folder for secrets: ${PATH_TO_SECRETS}`);
            }
        }
        fs.writeFileSync(PATH_TO_KEY, key);
        fs.writeFileSync(PATH_TO_SALT, saltBuffer);
    }

    private static readSecrets(): SecretPair {
        try {
            const key = fs.readFileSync( PATH_TO_KEY );
            const salt = fs.readFileSync( PATH_TO_SALT );
            return {
                key: key,
                salt: salt
            };
        }
        catch(error){
            throw new Error(`Could not read secrects for Crypto. Create keys with Keytool or check paths: ${PATH_TO_KEY}, ${PATH_TO_SALT}`);
        }
    }

    shortEncryptToB64(plaintext: string): string {
        const outputBuffer = this.encryptToBuffer(plaintext);
        const outputBase64 = outputBuffer.toString(BASE_64_NAME);
        return outputBase64.substr(21);
    }

    encryptToB64(plaintext: string): string {
        const outputBuffer = this.encryptToBuffer(plaintext);
        const outputBase64 = outputBuffer.toString(BASE_64_NAME);
        return outputBase64;
    }

    private encryptToBuffer(plaintext: string): Buffer {
        const nonce = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv(AES_256_GCM_NAME, this._key, nonce, {});
        const cipherText = Buffer.concat([cipher.update(plaintext), cipher.final()]);
        const outputBuffer = Buffer.concat([this._salt, nonce, cipherText, cipher.getAuthTag()]);

        return outputBuffer;
    }

    shortDecryptFromB64(cypherText: string): string {
        const inputBuffer = Buffer.from(this._prefix.concat(cypherText), BASE_64_NAME);
        const decrypted = this.decryptFromBuffer(inputBuffer);
        return decrypted; 
    }

    decryptFromB64(cypherText: string): string {
        const inputBuffer = Buffer.from(cypherText, BASE_64_NAME); 
        const decrypted = this.decryptFromBuffer(inputBuffer);
        return decrypted; 
    }

    private decryptFromBuffer(inputBuffer: Buffer): string {
        const nonce = inputBuffer.slice(16, 28); 
        const cipherBuffer = inputBuffer.slice(28, -16); 
        const tag = inputBuffer.slice(-16);
    
        const cipher = crypto.createDecipheriv(AES_256_GCM_NAME, this._key, nonce, {}); 
        cipher.setAuthTag(tag);
        const deCryptedBuffer = Buffer.concat([cipher.update(cipherBuffer), cipher.final()]);
        return deCryptedBuffer.toString(UTF_8_NAME); 
    }
}