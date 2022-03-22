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

  const walletOne = new PublicKey("AQU9o9gsYJ5n5GwF2kedSERMFYVFF9cqyMFK4JiXYT8i");
  const walletTwo = new PublicKey("555yt8a7MtKExNzQMhQGQa5retoLuDxBpchVjgJFE9e3");
  // const walletThree = Keypair.generate();
  // const walletFour = Keypair.generate();
  // const walletFive = Keypair.generate();

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
        assert.equal(error.message.indexOf("0x1771") != -1, true);
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
    assert.equal(walletOneBalance, extraLamports * 0.50, "walletOne's balance is wrong");

    let walletTwoBalance = await connection.getBalance(walletTwo);
    assert.equal(walletTwoBalance, extraLamports * 0.50, "the walletTwo's balance is wrong");
  });

  // setInterval(() => {}, 1 << 30)

});