"use strict";
/* Made by @Gusarich and @Miandic */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@ton/core");
const crypto_1 = require("@ton/crypto");
const emulator_1 = require("@ton/emulator");
const MultisigOrderBuilder_1 = require("./MultisigOrderBuilder");
const MultisigWallet_1 = require("./MultisigWallet");
const MultisigOrder_1 = require("./MultisigOrder");
function createInternalMessage(bounce, dest, value, body, mode = 3) {
    return {
        info: {
            bounce,
            bounced: false,
            createdAt: 0,
            createdLt: 0n,
            dest,
            forwardFee: 0n,
            ihrDisabled: true,
            ihrFee: 0n,
            type: 'internal',
            value: {
                coins: value,
            },
        },
        body,
    };
}
describe('MultisigOrder', () => {
    var publicKeys;
    var secretKeys;
    beforeAll(async () => {
        publicKeys = [];
        secretKeys = [];
        for (let i = 0; i < 10; i += 1) {
            let kp = (0, crypto_1.keyPairFromSeed)(await (0, crypto_1.getSecureRandomBytes)(32));
            publicKeys.push(kp.publicKey);
            secretKeys.push(kp.secretKey);
        }
    });
    it('should add messages', () => {
        let order = new MultisigOrderBuilder_1.MultisigOrderBuilder(123);
        order.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address1'), 1000000000n, core_1.Cell.EMPTY), 3);
        order.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address2'), 0n, (0, core_1.beginCell)().storeUint(3, 123).endCell()), 3);
        order.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address1'), 2000000000n, core_1.Cell.EMPTY), 3);
        expect(order.messages.endCell().refs.length).toEqual(3);
    });
    it('should add signatures', () => {
        let orderBuilder = new MultisigOrderBuilder_1.MultisigOrderBuilder(123);
        orderBuilder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address1'), 1000000000n, core_1.Cell.EMPTY), 3);
        orderBuilder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address2'), 0n, (0, core_1.beginCell)().storeUint(3, 123).endCell()), 3);
        orderBuilder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address1'), 2000000000n, core_1.Cell.EMPTY), 3);
        let order = orderBuilder.build();
        order.sign(0, secretKeys[0]);
        order.sign(1, secretKeys[1]);
        order.sign(2, secretKeys[2]);
        expect(Object.keys(order.signatures)).toHaveLength(3);
    });
    it('should union signatures', () => {
        let order1Builder = new MultisigOrderBuilder_1.MultisigOrderBuilder(123);
        order1Builder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address1'), 1000000000n, core_1.Cell.EMPTY), 3);
        order1Builder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address2'), 0n, (0, core_1.beginCell)().storeUint(3, 123).endCell()), 3);
        order1Builder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address1'), 2000000000n, core_1.Cell.EMPTY), 3);
        let order1 = order1Builder.build();
        order1.sign(0, secretKeys[0]);
        order1.sign(1, secretKeys[1]);
        order1.sign(2, secretKeys[2]);
        let order2Builder = new MultisigOrderBuilder_1.MultisigOrderBuilder(123);
        order2Builder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address1'), 1000000000n, core_1.Cell.EMPTY), 3);
        order2Builder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address2'), 0n, (0, core_1.beginCell)().storeUint(3, 123).endCell()), 3);
        order2Builder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address1'), 2000000000n, core_1.Cell.EMPTY), 3);
        let order2 = order2Builder.build();
        order2.sign(3, secretKeys[3]);
        order2.sign(2, secretKeys[2]);
        order2.sign(5, secretKeys[5]);
        order1.unionSignatures(order2);
        expect(Object.keys(order1.signatures)).toHaveLength(5);
    });
    it('should clear signatures', () => {
        let orderBuilder = new MultisigOrderBuilder_1.MultisigOrderBuilder(123);
        orderBuilder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address1'), 1000000000n, core_1.Cell.EMPTY), 3);
        orderBuilder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address2'), 0n, (0, core_1.beginCell)().storeUint(3, 123).endCell()), 3);
        orderBuilder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address1'), 2000000000n, core_1.Cell.EMPTY), 3);
        let order = orderBuilder.build();
        order.sign(0, secretKeys[0]);
        order.sign(1, secretKeys[1]);
        order.sign(2, secretKeys[2]);
        order.clearSignatures();
        expect(order.signatures).toBeNull;
    });
    it('should clear messages', () => {
        let orderBuilder = new MultisigOrderBuilder_1.MultisigOrderBuilder(123);
        orderBuilder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address1'), 1000000000n, core_1.Cell.EMPTY), 3);
        orderBuilder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address2'), 0n, (0, core_1.beginCell)().storeUint(3, 123).endCell()), 3);
        orderBuilder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address1'), 2000000000n, core_1.Cell.EMPTY), 3);
        orderBuilder.clearMessages();
        expect(orderBuilder.messages).toEqual((0, core_1.beginCell)());
    });
    it('should add signatures without secret key', () => {
        let orderBuilder = new MultisigOrderBuilder_1.MultisigOrderBuilder(123);
        orderBuilder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address1'), 1000000000n, core_1.Cell.EMPTY), 3);
        orderBuilder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address2'), 0n, (0, core_1.beginCell)().storeUint(3, 123).endCell()), 3);
        orderBuilder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address1'), 2000000000n, core_1.Cell.EMPTY), 3);
        let order = orderBuilder.build();
        order.sign(0, secretKeys[0]);
        order.addSignature(1, (0, crypto_1.sign)(order.payload.hash(), secretKeys[1]), new MultisigWallet_1.MultisigWallet(publicKeys, 0, 123, 2));
        expect(Object.keys(order.signatures)).toHaveLength(2);
    });
    it('should throw on more than 4 messages', () => {
        let orderBuilder = new MultisigOrderBuilder_1.MultisigOrderBuilder(123);
        orderBuilder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address1'), 1000000000n, core_1.Cell.EMPTY), 3);
        orderBuilder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address2'), 0n, (0, core_1.beginCell)().storeUint(3, 123).endCell()), 3);
        orderBuilder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address1'), 2000000000n, core_1.Cell.EMPTY), 3);
        orderBuilder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address1'), 2000000000n, core_1.Cell.EMPTY), 3);
        expect(() => orderBuilder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address1'), 2000000000n, core_1.Cell.EMPTY), 3)).toThrow();
    });
    it('should throw on invalid signature', () => {
        let orderBuilder = new MultisigOrderBuilder_1.MultisigOrderBuilder(123);
        orderBuilder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address1'), 1000000000n, core_1.Cell.EMPTY), 3);
        orderBuilder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address2'), 0n, (0, core_1.beginCell)().storeUint(3, 123).endCell()), 3);
        orderBuilder.addMessage(createInternalMessage(true, (0, emulator_1.testAddress)('address1'), 2000000000n, core_1.Cell.EMPTY), 3);
        let order = orderBuilder.build();
        order.sign(0, secretKeys[0]);
        expect(() => order.addSignature(1, Buffer.alloc(64), new MultisigWallet_1.MultisigWallet(publicKeys, 0, 123, 2))).toThrow();
    });
    it('should export to cell', () => { });
    it('should load from cell', () => {
        const order1Cell = core_1.Cell.fromBoc(Buffer.from('B5EE9C7241010201004700011B0000000031FD2F910000000001C0010068620014811EF5893924A58891883AA5563EE83305B47E62061D349E4BDECD66D2F2B1A02FAF08000000000000000000000000000021E26136', 'hex'))[0];
        const order2Cell = core_1.Cell.fromBoc(Buffer.from('B5EE9C7241010301008C00021B8000000031FD2F910000000001C001020083E67410438C1007888D2CD45436502FBA877BECE26E7F384709B29B4A607181B8473CC4D45B44F7C47590740936231AE001727CCCA955DCDF959955D3889F4E0F00400068620014811EF5893924A58891883AA5563EE83305B47E62061D349E4BDECD66D2F2B1A02FAF080000000000000000000000000000621311E8', 'hex'))[0];
        const order3Cell = core_1.Cell.fromBoc(Buffer.from('B5EE9C724101040100D100021B8000000031FD2F910000000001C0010201836100CBF8BBD98C5FE999FB232678DF1CC06A3522DB55736B3FF846C65AD1619694B8BDEF50B8DCF390AD54A4076B7444600FE54CC2EBFA68ED07F3063437DF0501C0030068620014811EF5893924A58891883AA5563EE83305B47E62061D349E4BDECD66D2F2B1A02FAF0800000000000000000000000000000083E67410438C1007888D2CD45436502FBA877BECE26E7F384709B29B4A607181B8473CC4D45B44F7C47590740936231AE001727CCCA955DCDF959955D3889F4E0F0040A434CD60', 'hex'))[0];
        const order1 = MultisigOrder_1.MultisigOrder.fromCell(order1Cell);
        const order2 = MultisigOrder_1.MultisigOrder.fromCell(order2Cell);
        const order3 = MultisigOrder_1.MultisigOrder.fromCell(order3Cell);
        expect(order1.payload.refs).toHaveLength(1);
        expect(Object.keys(order1.signatures)).toHaveLength(0);
        expect(Object.keys(order2.signatures)).toHaveLength(1);
        expect(Object.keys(order3.signatures)).toHaveLength(2);
    });
});
