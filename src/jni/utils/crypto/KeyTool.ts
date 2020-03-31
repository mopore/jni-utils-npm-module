#!/usr/bin/env node

import { runTextUi } from "./KeyToolTextUi";
import { findCreatePassphraseInfo, CREATE_KEYS_COMMAND, ENCRYPT_B64_COMMAND, DECRYPT_B64_COMMAND } from "./ArgProcessor";
import { JniCrypto } from "../../..";

const argCommand = findCreatePassphraseInfo();

if (argCommand){
    try {
        switch (argCommand.type) {
            case CREATE_KEYS_COMMAND: {
                JniCrypto.Engine.createSecrets(argCommand.input);
                console.log('Key pair successfully created...');
                break;
            }
            case ENCRYPT_B64_COMMAND: {
                const engine = new JniCrypto.Engine();
                const result = engine.encryptToB64(argCommand.input);
                console.log(result);
                break;
            }
            case DECRYPT_B64_COMMAND: {
                const engine = new JniCrypto.Engine();
                const result = engine.decryptFromB64(argCommand.input);
                console.log(result);
                break;
            }
        }
    }
    catch (error){
        console.error(`Could not execute "${argCommand.type}" due to: ${error.message}`);
        process.exit(1);
    }
}
else {
    runTextUi();
}