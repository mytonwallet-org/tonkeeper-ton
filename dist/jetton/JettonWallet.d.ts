/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Address, Contract, ContractProvider } from "@ton/core";
export declare class JettonWallet implements Contract {
    static create(address: Address): JettonWallet;
    readonly address: Address;
    private constructor();
    getBalance(provider: ContractProvider): Promise<bigint>;
}
