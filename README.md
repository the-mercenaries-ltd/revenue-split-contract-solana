**Changing the contract to a new split arrangement:**

1. Fork this repoistory and set it up on your machine.

2. Change the variables in `./tests/anchor.ts` config area at the top (between "CONFIG START" and "CONFIG END")

3. Run `anchor test` to see the tests fail

4. Change the variables at `./programs/anchor/src/lib.rs:split` (between "CONFIG START" and "CONFIG END")

3. Run `anchor test` to see the tests pass (4 passing)

**Deploy to devnet/mainnet first steps:**

If you want to deploy to the devnet or mainnet-beta networks, first complete these steps, then complete the relevant section below.

1. if you haven't already, set an ANCHOR_WALLET to the wallet which will pay tx fees
`export ANCHOR_WALLET=~/.config/solana/id.json`

2. Get the program ID:
```
$ anchor keys list
anchor: 2tQ8WV5rkEdHXCpSEjvE4RgoK9Hxyuj4YqeWGfJaufjv 
```

Here, make sure you update your program ID in Anchor.toml, lib.rs and each app/*.ts script.

3. build the program
`anchor build`

4. update each app/*.ts script with the new idl (between "CONFIG START" and "CONFIG END")

Your idl will be `./target/idl/anchor.json` but I think you need to put the full path

5. update each app/split.ts script with the new wallet addresses (between "CONFIG START" and "CONFIG END")

**Deploy to devnet:**

1. connect to devnet
```solana config set --url https://metaplex.devnet.rpcpool.com/```

2 airdrop 4 SOL to your wallet
`solana airdrop 1` then wait a a minute and airdrop another

3. deploy to devnet:
```anchor deploy --provider.cluster devnet```

4. init the pool account
```ts-node ./app/initPoolAccount.ts```

5. note the pool account address
```
ts-node ./app/printPoolAccount.ts
{ poolAccount: '7pvEprs1maweW2eRTa87SWSNL8y5dH8LRvQRoX5bzTdN' }
Success
```

6. send some money to the poolAccount to test
```solana transfer 7pvEprs1maweW2eRTa87SWSNL8y5dH8LRvQRoX5bzTdN 0.5```

7. test the split works
```
ts-node ./app/split.ts
splitTx 3LiCVNBZj2FSJk4n2PNCtBAuzHQb643H1DNzgxzyoUJtvoEh7ciQ1SRAd1uMn6JtGw6rTn9qTipgdq1K7nGBJmui
Success
```

Open up the tx in Solana Explorer or Solscan, i.e. at:

https://explorer.solana.com/tx/3LiCVNBZj2FSJk4n2PNCtBAuzHQb643H1DNzgxzyoUJtvoEh7ciQ1SRAd1uMn6JtGw6rTn9qTipgdq1K7nGBJmui?cluster=devnet

Make sure you are checking the DEVNET network

**Deploy to mainnet:**

1. connect to mainnet-beta
```solana config set --url https://solana-api.projectserum.com```

2 send 4 SOL to your wallet

3. deploy to mainnet:
```anchor deploy --provider.cluster mainnet```

4. init the pool account
```SOLANA_RPC_URL=https://solana-api.projectserum.com ts-node ./app/initPoolAccount.ts```

5. note the pool account address
```
SOLANA_RPC_URL=https://solana-api.projectserum.com ts-node ./app/printPoolAccount.ts
{ poolAccount: '7pvEprs1maweW2eRTa87SWSNL8y5dH8LRvQRoX5bzTdN' }
Success
```

6. send some money to the poolAccount to test
```solana transfer 7pvEprs1maweW2eRTa87SWSNL8y5dH8LRvQRoX5bzTdN 0.01```

7. test the split works
```
SOLANA_RPC_URL=https://solana-api.projectserum.com ts-node ./app/split.ts```
splitTx 5QBTh5Q3tMPZK9yRg35rJ4mbHzCPHzz3jjvU1V7wXkP79i3cFnVv2p7yKETQdsjUjnfcaJPYeSLgHhrJvFCeiWwX
Success
```

Open up the tx in Solana Explorer or Solscan, i.e. at:

https://explorer.solana.com/tx/5QBTh5Q3tMPZK9yRg35rJ4mbHzCPHzz3jjvU1V7wXkP79i3cFnVv2p7yKETQdsjUjnfcaJPYeSLgHhrJvFCeiWwX

Make sure you are checking the MAINNET network
