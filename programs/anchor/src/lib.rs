use std::str::FromStr;
use anchor_lang::prelude::*;
use solana_program;
use solana_program::{
    clock::Clock,
    account_info::AccountInfo,
    entrypoint::ProgramResult, program::invoke, program::invoke_signed, system_instruction,
};
declare_id!("5xbYuZUnisvPi1ZP1JNGADeqLedyPm6GvMqxrQSMWvZA");

#[program]
pub mod anchor {
    use super::*;
    pub fn init_pool_account(ctx: Context<InitPoolAccount>, bump: u8, extra_lamports: u64) -> ProgramResult {
        let payer = &mut ctx.accounts.payer;
        let system_program = &ctx.accounts.system_program;
        let pool_account = &ctx.accounts.pool_account;
        invoke(
            &system_instruction::transfer(
                &payer.to_account_info().key,
                &pool_account.to_account_info().key,
                extra_lamports, 
            ),
            &[
                payer.to_account_info().clone(),
                pool_account.to_account_info().clone(),
                system_program.to_account_info().clone(),
            ],
        )?;
        Ok(())
    }
    pub fn split(ctx: Context<Split>, bump: u8) -> ProgramResult {
        let wallet_one_correct_key = Pubkey::from_str("AQU9o9gsYJ5n5GwF2kedSERMFYVFF9cqyMFK4JiXYT8i").unwrap();
        let wallet_two_correct_key = Pubkey::from_str("555yt8a7MtKExNzQMhQGQa5retoLuDxBpchVjgJFE9e3").unwrap();
        // IMPORTANT: do not add more wallets unless you check each ones key otherwise your money can be stolen by bad actors
        // let wallet_three_correct_key = Pubkey::from_str("555yt8a7MtKExNzQMhQGQa5retoLuDxBpchVjgJFE9e3").unwrap();
        // let wallet_four_correct_key = Pubkey::from_str("555yt8a7MtKExNzQMhQGQa5retoLuDxBpchVjgJFE9e3").unwrap();
        // let wallet_five_correct_key = Pubkey::from_str("555yt8a7MtKExNzQMhQGQa5retoLuDxBpchVjgJFE9e3").unwrap();

        
        let pool_account = &ctx.accounts.pool_account.to_account_info();
        let wallet_one = &mut ctx.accounts.wallet_one.to_account_info();
        let wallet_two = &mut ctx.accounts.wallet_two.to_account_info();
        // IMPORTANT: do not add more wallets unless you check each ones key otherwise your money can be stolen by bad actors
        // let wallet_three = &mut ctx.accounts.wallet_three.to_account_info();
        // let wallet_four = &mut ctx.accounts.wallet_four.to_account_info();
        // let wallet_five = &mut ctx.accounts.wallet_five.to_account_info();

        if &wallet_one.key() != &wallet_one_correct_key {
            msg!("InvalidWalletOneKey");
            return Err(ErrorCode::InvalidWalletOneKey.into())
        }

        if &wallet_two.key() != &wallet_two_correct_key {
            msg!("InvalidWalletTwoKey");
            return Err(ErrorCode::InvalidWalletTwoKey.into())
        }

        // IMPORTANT: do not add more wallets unless you check each ones key otherwise your money can be stolen by bad actors

        // if &wallet_three.key() != &wallet_three_correct_key {
        //     msg!("InvalidWalletThreeKey");
        //     return Err(ErrorCode::InvalidWalletThreeKey.into())
        // }

        // if &wallet_four.key() != &wallet_four_correct_key {
        //     msg!("InvalidWalletFourKey");
        //     return Err(ErrorCode::InvalidWalletFourKey.into())
        // }

        // if &wallet_five.key() != &wallet_five_correct_key {
        //     msg!("InvalidWalletFiveKey");
        //     return Err(ErrorCode::InvalidWalletFiveKey.into())
        // }

        let lamports_for_rent = 946560;
        let lamports_to_send_wallet_one = ((pool_account.lamports() - lamports_for_rent) as f64  * 0.50) as u64;
        let lamports_to_send_wallet_two = ((pool_account.lamports() - lamports_for_rent) as f64  * 0.50) as u64;
        // let lamports_to_send_wallet_three = ((pool_account.lamports() - lamports_for_rent) as f64  * 0.05) as u64;
        // let lamports_to_send_wallet_four = ((pool_account.lamports() - lamports_for_rent) as f64  * 0.05) as u64;
        // let lamports_to_send_wallet_five = ((pool_account.lamports() - lamports_for_rent) as f64  * 0.05) as u64;
        let lamports_total_to_send = lamports_to_send_wallet_one + lamports_to_send_wallet_two;

        **pool_account.try_borrow_mut_lamports()? = pool_account
            .lamports()
            .checked_sub(lamports_total_to_send)
            .ok_or(ProgramError::InvalidArgument)?;

        **wallet_one.try_borrow_mut_lamports()? = wallet_one
            .lamports()
            .checked_add(lamports_to_send_wallet_one)
            .ok_or(ProgramError::InvalidArgument)?;

        **wallet_two.try_borrow_mut_lamports()? = wallet_two
            .lamports()
            .checked_add(lamports_to_send_wallet_two)
            .ok_or(ProgramError::InvalidArgument)?;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct InitPoolAccount<'info> {
    #[account(init, payer = payer, space = 8, seeds = [b"escrow1"], bump)]
    pub pool_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Split<'info> {
    #[account(mut)]
    pub pool_account: Account<'info, BaseAccount>,
    #[account(mut)] 
    /// CHECK: 
    pub wallet_one: AccountInfo<'info>,
    #[account(mut)]
    /// CHECK: 
    pub wallet_two: AccountInfo<'info>,
    // #[account(mut)]
    // /// CHECK: 
    // pub wallet_three: AccountInfo<'info>,
    // #[account(mut)]
    // /// CHECK: 
    // pub wallet_four: AccountInfo<'info>,
    // #[account(mut)]
    // /// CHECK: 
    // pub wallet_five: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}
  
#[account]
pub struct BaseAccount {
}

#[error]
pub enum ErrorCode {
    #[msg("InvalidWalletOneKey")]
    InvalidWalletOneKey,
    #[msg("InvalidWalletTwoKey")]
    InvalidWalletTwoKey,
    #[msg("InvalidWalletThreeKey")]
    InvalidWalletThreeKey,
    #[msg("InvalidWalletFourKey")]
    InvalidWalletFourKey,
    #[msg("InvalidWalletFiveKey")]
    InvalidWalletFiveKey
}