import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Anchor } from '../target/types/anchor';
const { SystemProgram, LAMPORTS_PER_SOL } = anchor.web3;
import { PublicKey, Keypair } from "@solana/web3.js";
const { assert } = require('chai');

describe('anchor', async () => {
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);  
  const connection = await anchor.getProvider().connection;

  const program = anchor.workspace.Anchor as Program<Anchor>;

  let lamportsForRent = 946560;
  let extraLamports = LAMPORTS_PER_SOL * 0.1;

  /** CONFIG START */

  const walletOne = new PublicKey("EAdiYGQ2m9A1AzVABRwFakh6aTtY5FDFkRYpZ6ijTvXP");
  const walletTwo = new PublicKey("HTtjYkiT9k3Ut3P7v8BCCdJnde5mvbT1unK4awNo2BtV");
  // const walletThree = Keypair.generate();
  // const walletFour = Keypair.generate();
  // const walletFive = Keypair.generate();

  const walletOnePct = 0.6;
  const walletTwoPct = 0.4;
  // const walletThreePct = 0.5;
  // const walletFourPct = 0.5;
  // const walletFivePct = 0.5;

  /** CONFIG END */

  const randomKeypair = Keypair.generate();

  it(`init pool account with ${extraLamports} lamport and space rent (${lamportsForRent} + ${extraLamports} lamports)`, async () => {
    const [poolAccount, bump] = await PublicKey.findProgramAddress([Buffer.from("escrow1")], program.programId);

    const initTx = await program.rpc.initPoolAccount(
      bump, 
      new anchor.BN(extraLamports),
      {
        accounts: {
          poolAccount,
          payer: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
      }
    );
  
    let poolAccountBalance = await connection.getBalance(poolAccount);
    assert.equal(poolAccountBalance, lamportsForRent + extraLamports);
  });

  it(`if walletOne key is incorrect, throw error`, async () => {
    const [poolAccount, bump] = await PublicKey.findProgramAddress([Buffer.from("escrow1")], program.programId);

    try {
      const splitTx = await program.rpc.split(
        bump, 
        {
        accounts: {
          poolAccount,
          walletOne: randomKeypair.publicKey,
          walletTwo,
          systemProgram: SystemProgram.programId,
        },
      });
      assert.equal(true, false, "should not have gotten this far if walletOne's key is incorrect");
    } catch(error) {
      if (error instanceof Error) {
        console.log({message: error.message})
        assert.equal(error.message.indexOf("0x1770") != -1, true);
      }
    }
  });

  it(`if the walletTwo key is incorrect, throw error`, async () => {
    const [poolAccount, bump] = await PublicKey.findProgramAddress([Buffer.from("escrow1")], program.programId);

    console.log({
      walletOne: walletOne.toBase58()
    })

    try {
      const splitTx = await program.rpc.split(
        bump, 
        {
        accounts: {
          poolAccount,
          walletOne,
          walletTwo: randomKeypair.publicKey,
          systemProgram: SystemProgram.programId,
        },
      });
      assert.equal(true, false, "should not have gotten this far if the walletTwo's key is incorrect");
    } catch(error) {
      if (error instanceof Error) {
        console.log({message: error.message})
        assert.equal(error.message.indexOf("0x1771") != -1, true, "InvalidWalletTwoKey error ");
      }
    }
  });

  it(`
    of the extra lamports...
    a. 50% should be sent to walletOne 
    b. 50% should be sent to the walletTwo
  `, async () => {
    const [poolAccount, bump] = await PublicKey.findProgramAddress([Buffer.from("escrow1")], program.programId)
  
    const splitTx = await program.rpc.split(
      bump, 
      {
      accounts: {
        poolAccount,
        walletOne,
        walletTwo,
        systemProgram: SystemProgram.programId,
      },
    });
    console.log("splitTx", splitTx)

    let walletOneBalance = await connection.getBalance(walletOne);
    assert.equal(walletOneBalance, extraLamports * walletOnePct, "walletOne's balance is wrong");

    let walletTwoBalance = await connection.getBalance(walletTwo);
    assert.equal(walletTwoBalance, extraLamports * walletTwoPct, "the walletTwo's balance is wrong");
  });

  // setInterval(() => {}, 1 << 30)

});