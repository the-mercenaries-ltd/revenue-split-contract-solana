Changing the contract to a new split arrangement:

1. Fork this repoistory and set it up on your machine.

2. Change the variables in `./tests/anchor.ts` config area at the top (between "CONFIG START" and "CONFIG END")

3. Run `anchor test` to see the tests fail

4. Change the variables at `./programs/anchor/src/lib.rs:split` (between "CONFIG START" and "CONFIG END")

3. Run `anchor test` to see the tests pass (4 passing)

Deploy to devnet:
