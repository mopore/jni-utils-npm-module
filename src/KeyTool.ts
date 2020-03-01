import { createInterface } from "readline";
import { KeyToolHelper } from "./KeyToolHelper";

const CREATE_UPDATE_KEYSET = 1;
const ENCRYPT_TEXT = 2;
const DECRYPT_PHRASE = 3;
const EXIT = 0;


const readline = createInterface({
    input: process.stdin,
    output: process.stdout
});

const exitKeyTool = (): void => {
    KeyToolHelper.clearScreen();
    console.info( "\n👋  Bye, Bye and take care of your keys!");
    readline.close();
}

const createKeysWithPassphrase = ( callback: (() => void) ): void => {
    KeyToolHelper.clearScreen();
    readline.question( "Enter your passphrase for key creation: ", ( input: string) => {
        KeyToolHelper.createKeys(input)
        callback();
    });
}

const recreatKeys = ( callback: (() => void) ): void => {
    KeyToolHelper.clearScreen();
    console.info( '⚠️  Recreating your keys will invalidate ALL prior encrypted phrases!' );
    readline.question( "Do you really want to recreate the keys? (y/n)...", (input) => {
        const recreateKeys = (input.trim().toLowerCase()) === 'y';
        if ( recreateKeys){
            createKeysWithPassphrase((): void =>{
                KeyToolHelper.clearScreen();
                console.info( '✅  Your keys have been recreated successfully.' );
                KeyToolHelper.pressAnyKeyToContinue( readline, callback );
            });
        }
        else{
            callback();
        }
    });
}

const encryptText = ( callback: (() => void) ): void => {
    KeyToolHelper.clearScreen();
    readline.question( "Enter your text to encrypt: ", ( input: string) => {
        const encrypted = KeyToolHelper.encrypt( input );
        console.error( `Your encrypted phase: ${encrypted}`);
        KeyToolHelper.pressAnyKeyToContinue( readline, callback );
    });
}

const decryptPhrase = ( callback: (() => void) ): void => {
    KeyToolHelper.clearScreen();
    readline.question( "Enter your phrase to decrypt: ", ( input: string) => {
        try{ 
            const decrypted = KeyToolHelper.decrypt( input );
            console.error( `Your decrypted phase: ${decrypted}`);
        }
        catch(error){
            console.error('🛑  Can not decrypt the encrypted text. Wrong keys?')
        }
        KeyToolHelper.pressAnyKeyToContinue( readline, callback );
    });
}

const showMainMenu = (): void => {
    KeyToolHelper.clearScreen();
    KeyToolHelper.headerLine();
    console.info( '(1) Recreate your keyset.' );
    console.info( '(2) Encrypt a text phrase.' );
    console.info( '(3) Deycrypt encrypted phrase.' );
    console.info( '(0) Exit.\n' );
    readline.question( "Please choose an option (1,2,3,0)...", (input) => {
        const option = Number(input);
        switch (option) {
            case CREATE_UPDATE_KEYSET: {
                recreatKeys( showMainMenu );
                break;
            }
            case ENCRYPT_TEXT: {
                encryptText( showMainMenu );
                break;
            }
            case DECRYPT_PHRASE: {
                decryptPhrase( showMainMenu );
                break;
            }
            case EXIT: {
                exitKeyTool();
                break;
            }
            default:{
                console.error( '\nPlease choose a valid option...\n' );
                showMainMenu();
                break;
            }
        }
    });
}

const checkKeys = (): void => {
    const noKeys = ! KeyToolHelper.keysExists();
    if ( noKeys ) {
        KeyToolHelper.headerLine();
        console.info( 'This tool needs to operate on a valid set of crypto keys in you project.')
        readline.question( "No valid keys could be found. Create a new set of keys? (y/n)...", (input) => {
            const createKeys = (input.trim().toLowerCase()) === 'y';
            if ( createKeys){
                createKeysWithPassphrase((): void =>{
                    KeyToolHelper.clearScreen();
                    console.info( '✅  Your keys have been created successfully.' );
                    KeyToolHelper.pressAnyKeyToContinue( readline, showMainMenu );
                });
            }
            else{
                console.error( 'Tool will exit without any action.' );
                KeyToolHelper.pressAnyKeyToContinue( readline, exitKeyTool );
            }
        });
    }
    else {
        showMainMenu();
    }
}

KeyToolHelper.clearScreen();
checkKeys();