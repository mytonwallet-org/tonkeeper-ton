"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const randomTestKey_1 = require("../utils/randomTestKey");
const createTestClient4_1 = require("../utils/createTestClient4");
const core_1 = require("@ton/core");
const WalletContractV1R2_1 = require("./WalletContractV1R2");
describe('WalletContractV1R2', () => {
    it('should has balance and correct address', async () => {
        // Create contract
        let client = (0, createTestClient4_1.createTestClient4)();
        let key = (0, randomTestKey_1.randomTestKey)('v4-treasure');
        let contract = client.open(WalletContractV1R2_1.WalletContractV1R2.create({ workchain: 0, publicKey: key.publicKey }));
        let balance = await contract.getBalance();
        // Check parameters
        expect(contract.address.equals(core_1.Address.parse('EQATDkvcCA2fFWbSTHMpGCrjkNGqgEywES15ZS11HHY3UuxK'))).toBe(true);
        expect(balance > 0n).toBe(true);
    });
    it('should perform transfer', async () => {
        // Create contract
        let client = (0, createTestClient4_1.createTestClient4)();
        let key = (0, randomTestKey_1.randomTestKey)('v4-treasure');
        let contract = client.open(WalletContractV1R2_1.WalletContractV1R2.create({ workchain: 0, publicKey: key.publicKey }));
        // Prepare transfer
        let seqno = await contract.getSeqno();
        let transfer = contract.createTransfer({
            seqno,
            secretKey: key.secretKey,
            message: (0, core_1.internal)({
                to: 'kQD6oPnzaaAMRW24R8F0_nlSsJQni0cGHntR027eT9_sgtwt',
                value: '0.1',
                body: 'Hello, world!'
            })
        });
        // Perform transfer
        await contract.send(transfer);
    });
});
