import * as anchor from "@project-serum/anchor";
const { SystemProgram, LAMPORTS_PER_SOL } = anchor.web3;
import { Program } from "@project-serum/anchor";
import { PublicKey, Keypair } from "@solana/web3.js";

anchor.setProvider(anchor.Provider.local("https://metaplex.devnet.rpcpool.com"));

async function main() {
    const provider: anchor.Provider = anchor.Provider.local("https://metaplex.devnet.rpcpool.com");
    const idl = JSON.parse(require('fs').readFileSync('/root/vexfundforward/target/idl/anchor.json', 'utf8'));
    const programId = new anchor.web3.PublicKey('5xbYuZUnisvPi1ZP1JNGADeqLedyPm6GvMqxrQSMWvZA');
    const program: Program = new anchor.Program(idl, programId);
    
    const [poolAccount, bump] = await PublicKey.findProgramAddress([Buffer.from("escrow1")], program.programId);

    console.log({poolAccount: poolAccount.toBase58()})

    console.log('Success');
  }
  
  main().then(
    () => process.exit(),
    err => {
      console.error(err);
      process.exit(-1);
    },
  );
  
