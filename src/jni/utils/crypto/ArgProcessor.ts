export const CREATE_KEYS_COMMAND = '--create-keys';
export const ENCRYPT_B64_COMMAND = '--encrypt-base64';
export const DECRYPT_B64_COMMAND = '--decrypt-base64';

export type ArgCommand = {
    type: string;
    input: string;
}

export const findCreatePassphraseInfo = (): (ArgCommand | undefined) => {
    const args = process.argv.slice(2);
    if ( args.length > 0){
        if ( args.length === 2){
            if ( 
                args[0] === CREATE_KEYS_COMMAND ||
                args[0] === ENCRYPT_B64_COMMAND ||
                args[0] === DECRYPT_B64_COMMAND
            )
                return {
                    type: args[0],
                    input: args[1]
                }
        }
        console.error(`Usage:`);
        console.error(` - To create a new set of keys add: ${CREATE_KEYS_COMMAND} "passphrase"`);
        console.error(` - To encrypt AND base-64 a string: ${ENCRYPT_B64_COMMAND} "The string you want to encrypt"`);
        console.error(` - To decrypt an encrypted AND base-64'ed text: ${DECRYPT_B64_COMMAND} "The text you want to decrypt"`);
        process.exit(1);
    }
}