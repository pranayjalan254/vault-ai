"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const InitializeAgent_1 = require("./InitializeAgent");
const chatmode_1 = require("./chatmode");
const validation_1 = require("./validation");
const ethers_1 = require("ethers");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, validation_1.validateEnvironment)();
            const { agent, config } = yield (0, InitializeAgent_1.initializeAgent)();
            console.log("the wallet address", ethers_1.ethers.Wallet.fromMnemonic("various turn tilt ecology attitude often tumble rally proof title weekend much"));
            yield (0, chatmode_1.ChatMode)(agent, config);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error:", error.message);
            }
            process.exit(1);
        }
    });
}
// Start the agent when running directly
if (require.main === module) {
    console.log("Starting Agent...");
    main().catch(error => {
        console.error("Fatal error:", error);
        process.exit(1);
    });
}
