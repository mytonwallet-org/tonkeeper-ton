/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Address, Contract, ContractProvider } from "@ton/core";
export declare class JettonMaster implements Contract {
    static create(address: Address): JettonMaster;
    readonly address: Address;
    constructor(address: Address);
    getWalletAddress(provider: ContractProvider, owner: Address): Promise<Address>;
    getJettonData(provider: ContractProvider): Promise<{
        totalSupply: bigint;
        mintable: boolean;
        adminAddress: Address;
        content: import("@ton/core").Cell;
        walletCode: import("@ton/core").Cell;
    }>;
}
