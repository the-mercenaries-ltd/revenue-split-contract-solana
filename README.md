# revenue-split-contract

This is a Solana smart contract for splitting money between multiple parties.

The contract is currently setup to have this split arrangement:

    a. 5% should be sent to Jack: EAdiYGQ2m9A1AzVABRwFakh6aTtY5FDFkRYpZ6ijTvXP
    b. 75% should be sent to the brothers: C7v5L2AdUcD42rGKik5bxH5HcnWUriN1ScWbLFZU7icE
    c. 20% should be sent to the DAO: 5o3YBSyzqzBxbgporUmtSABFYHj5g3BX8swa7kQD9WnV
    
To set this up four your arrangement, you mainly want to edit the split function found in programs/anchor/src/lib.rs

You will be changing the following things:
1. the accounts and their public keys
2. the split amounts (i.e. 0.05, 0.75 and 0.20 for this example)

After that you need to run the initPoolAccount command.

Example scripts exist in the app folder, but will need to be edited to use your keypairs.

Notes:
a. the pool account is a program-derived address owned by this smart contract. the money is sent to this account waiting to be split
b. this contract will always be changeable unless your run pass the `--final` flag during deployment, see https://docs.solana.com/cli/deploy-a-program for more info

If you have any questions, feel free to open an issue on Github or message me on Discord: my username is "Jack Robson#9682".
# revenue-split-contract-solana
# revenue-split-contract-solana
