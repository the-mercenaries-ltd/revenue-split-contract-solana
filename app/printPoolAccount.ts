import * as anchor from "@project-serum/anchor";
const { SystemProgram, LAMPORTS_PER_SOL } = anchor.web3;
import { Program } from "@project-serum/anchor";
import { PublicKey, Keypair } from "@solana/web3.js";

const SOLANA_RPC_URL = (process.env.SOLANA_RPC_URL) ? process.env.SOLANA_RPC_URL : "https://metaplex.devnet.rpcpool.com";

anchor.setProvider(anchor.Provider.local(SOLANA_RPC_URL));

async function main() {
    const provider: anchor.Provider = anchor.Provider.local(SOLANA_RPC_URL);
    // CONFIG START
    const idl = JSON.parse(require('fs').readFileSync('/Users/ph/Projects/the-mercenaries-ltd/revenue-split-contract-solana-example/target/idl/anchor.json', 'utf8'));
    // CONFIG END
    const programId = new anchor.web3.PublicKey('2tQ8WV5rkEdHXCpSEjvE4RgoK9Hxyuj4YqeWGfJaufjv');
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
  
