const CREATE_KEYS_COMMAND = '--createKeys';
export const findCreatePassphraseInfo = (): (string | undefined) => {
    const args = process.argv.slice(2);
    if ( args.length > 0){
        if ( args.length === 2){
            if ( args[0] === CREATE_KEYS_COMMAND)
                return args[1]
        }
        console.error(`Usage: ${CREATE_KEYS_COMMAND} <passphrase>`);
        process.exit(1);
    }
}