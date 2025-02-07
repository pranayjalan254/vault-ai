"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnvironment = void 0;
const validateEnvironment = () => {
    const missingVars = [];
    // Check required variables
    const requiredVars = ["OPENAI_API_KEY", "CDP_API_KEY_NAME", "CDP_API_KEY_PRIVATE_KEY"];
    requiredVars.forEach(varName => {
        if (!process.env[varName]) {
            missingVars.push(varName);
        }
    });
    // Exit if any required variables are missing
    if (missingVars.length > 0) {
        console.error("Error: Required environment variables are not set");
        missingVars.forEach(varName => {
            console.error(`${varName}=your_${varName.toLowerCase()}_here`);
        });
        process.exit(1);
    }
    // Warn about optional NETWORK_ID
    if (!process.env.NETWORK_ID) {
        console.warn("Warning: NETWORK_ID not set, defaulting to base-sepolia testnet");
    }
};
exports.validateEnvironment = validateEnvironment;
