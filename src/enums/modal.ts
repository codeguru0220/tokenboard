export enum ModalType {
  SelectWallet = "SELECT_WALLET",
  UpgradeToT = "UPGRADE_TO_T",
  UpgradedToT = "UPGRADED_TO_T",
  TransactionIsPending = "TRANSACTION_IS_PENDING",
  TransactionIsWaitingForConfirmation = "TRANSACTION_IS_WAITING_FOR_CONFIRMATION",
  TransactionFailed = "TRANSACTION_FAILED",
  StakingChecklist = "STAKING_CHECKLIST",
  ConfirmStakingParams = "CONFIRM_STAKING_PARAMS",
  StakeSuccess = "STAKE_SUCCESS",
  UnstakeT = "UNSTAKE_T",
  UnstakeTStep2 = "UNSTAKE_T_STEP_2",
  UnstakeSuccess = "UNSTAKE_SUCCESS",
  TopupT = "TOP_UP_T",
  TopupLegacyStake = "TOP_UP_LEGACY_STAKE",
  TopupTSuccess = "TOP_UP_T_SUCCESS",
  ClaimingRewards = "CLAIMING_REWARDS",
  ClaimingRewardsSuccess = "CLAIMING_REWARDS_SUCCESS",
  SubmitStake = "SUBMIT_STAKE",
  TbtcRecoveryJson = "TBTC_RECOVERY_JSON",
  TbtcMintingConfirmation = "TBTC_MINTING_CONFIRMATION",
  UseDesktop = "USE_DESKTOP",
}
