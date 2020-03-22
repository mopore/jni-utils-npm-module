#!/usr/bin/env node

import { runTextUi } from "./KeyToolTextUi";
import { findCreatePassphraseInfo } from "./ArgProcessor";
import { JniCrypto } from "../../..";

const passedValue = findCreatePassphraseInfo();

if (passedValue){
    console.log('KeyTool called to create a key pair.');
    try {
        JniCrypto.Engine.createSecrets(passedValue);
        console.log('Key pair successfully created...');
    }
    catch (error){
        console.error(`Could not create keys due to: ${error.message}`);
        process.exit(1);
    }
}
else {
    runTextUi();
}