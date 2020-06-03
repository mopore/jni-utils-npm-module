# What is this?

Provides some utils I used often in my current projects.
These include a 
* KeyTool with a text UI and a CLI option
* Wrapper for the Node crypto engine to customized for my purposes
* Code to easier operate with dates, delays and arrays

# Release History
v1.6.1 Bugfix for getLatestSunday in DateUtils
v1.6.0 Simplified hash function added to JniCrypto


# Installation
Run npm install for a local installation in your project.
`npm install jni-utils`

# How to use

## Keytool

### Text UI
Use the following command to start the KeyTool text UI from terminal.
```
    npx jni-keytool
```
If started for the first time in your project. The tool will ask to create a new set of keys.
Without this set of keys the tool will not be able to encrypt/decrypt.
If you allow to create the key set. The following menu will appear.

The text UI offers the following 4 options
```
🔑  J N I   C R Y P T O  (v2.2)
-------------------------------

(1) Recreate your keyset.
(2) Encrypt a text phrase.
(3) Deycrypt encrypted phrase.
(0) Exit.

Please choose an option (1,2,3,0)...
```

The encrypt text option (2) will create a decyrpted Base 64 encoded text which will always vary.
However, given your set of keys is based on the same passphrase as the one used to encrypt,
the decryption will always work.

The recreate your keyset option (1) will create a new set of keys, overwritten existing keys,
if existing and create a folder `./secrets` in the project if not already existing.

### CLI-only commands

Creating a pair for keys is also possible without text UI by using the following command:
```
npx jni-keytool --create-keys "Your passphrase to create a reproducable set of keys"
```

To encrypt AND base-64 a string via CLI with already created keys:
```
npx jni-keytool --encrypt-base64 "The string you want to encrypt"
```

To decrypt an encrypted AND base-64'ed text via CLI with already created keys:
```
npx jni-keytool --decrypt-base64 "The text you want to decrypt"
```

## JniCrypto

The crypto wrapper for node is available via `JniCrypto.Engine` and offers the same functionality
on coding level as the KeyTool. In fact. The KeyTool obiously makes use of the wrapper.

## JniCommon
The util code in the JniCommon is pretty much self-explaining.