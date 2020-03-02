# What is this?

Provides some utils used often used in other projects.
Resusing an CLI KeyTool, encyrption code and DateUtils as an NPM module

# Installation
Run npm install for a local installation in your project.
`npm install jni-utils`

# How to use

Make sure a folder `secrets` is created in your project directory.

## Keytool
Then use the following command to start the KeyTool Text UI from your cli
```
    npx jni-keytool
```

The text offers the following 4 options
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
if existing and create a folder ./secrets in the project if not already existing.

Creating a pair for keys is possible without text UI by using the following command
```
    npx jni-keytool --createKeys "Your passphrase to create a reproducable set of keys"
```