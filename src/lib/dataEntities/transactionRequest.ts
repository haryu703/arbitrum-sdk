import { TransactionRequest } from '@ethersproject/providers'
import { BigNumber } from 'ethers'

/**
 * A transaction request for a transaction that will trigger some sort of
 * execution on the L2
 */
export interface L1ToL2TransactionRequest {
  /**
   * Core fields needed to forma transaction request: `to`, `data`, `from`
   */
  txRequestCore: Required<Pick<TransactionRequest, 'to' | 'data' | 'value'>>
  /**
   * The gas limit provided to this transactin when executed on L2 (units of gas)
   */
  l2GasLimit: BigNumber
  /**
   * The max fee per gas that will be paid on L2 (wei per gas).
   * Caution: Gas price changes on the L2 could mean that the l2MaxFeePerGas set here may not be high
   * enough by the time it's executed.
   * If that is the case the retryable ticket will fail to be redeemed automatically, and must be redeemed manually
   * by calling redeem on the l1ToL2Message.
   */
  l2MaxFeePerGas: BigNumber
  /**
   * The L2 retryable ticket submission cost (wei).
   * Caution: The Arbitrum submission price changes according to the l1 base fee,
   * which in turn means that the l2SubmissionFee needs to be changed in order to ensure submission succeeds.
   * If the l1 base fee increases by too much, then this transaction will fail upon execution on the L1.
   */
  l2SubmissionFee: BigNumber
  /**
   * The maximum total amount of eth that could be spent on L2 (wei)
   */
  l2GasCostsMaxTotal: BigNumber
}

/**
 * Ensure the T is not of TransactionRequest type by ensure it doesnt have a specific TransactionRequest property
 */
type IsNotTransactionRequest<T> = T extends { txRequest: any } ? never : T

/**
 * Check if an object is of L1ToL2TransactionRequest type
 * @param possibleRequest
 * @returns
 */
export const isL1ToL2TransactionRequest = <T>(
  possibleRequest: IsNotTransactionRequest<T> | L1ToL2TransactionRequest
): possibleRequest is L1ToL2TransactionRequest => {
  return (
    (possibleRequest as L1ToL2TransactionRequest).txRequestCore != undefined
  )
}
