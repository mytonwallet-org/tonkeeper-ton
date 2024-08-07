"use strict";
/* Made by @Gusarich and @Miandic */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultisigOrderBuilder = void 0;
const core_1 = require("@ton/core");
const MultisigOrder_1 = require("./MultisigOrder");
class MultisigOrderBuilder {
    constructor(walletId, offset) {
        this.messages = (0, core_1.beginCell)();
        this.queryId = 0n;
        this.walletId = walletId;
        this.queryOffset = offset || 7200;
    }
    addMessage(message, mode) {
        if (this.messages.refs >= 4) {
            throw Error('only 4 refs are allowed');
        }
        this.updateQueryId();
        this.messages.storeUint(mode, 8);
        this.messages.storeRef((0, core_1.beginCell)().store((0, core_1.storeMessageRelaxed)(message)).endCell());
    }
    clearMessages() {
        this.messages = (0, core_1.beginCell)();
    }
    build() {
        return MultisigOrder_1.MultisigOrder.fromPayload((0, core_1.beginCell)()
            .storeUint(this.walletId, 32)
            .storeUint(this.queryId, 64)
            .storeBuilder(this.messages)
            .endCell());
    }
    updateQueryId() {
        const time = BigInt(Math.floor(Date.now() / 1000 + this.queryOffset));
        this.queryId = time << 32n;
    }
}
exports.MultisigOrderBuilder = MultisigOrderBuilder;
