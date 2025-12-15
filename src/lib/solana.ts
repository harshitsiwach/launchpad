import { PublicKey, TransactionInstruction } from "@solana/web3.js";

export const LAUNCHPAD_PROGRAM_ID = new PublicKey("11111111111111111111111111111111"); // Mock

export function createContributeInstruction(
    user: PublicKey,
    pool: PublicKey,
    amount: number
): TransactionInstruction {
    // Return a mock instruction for demonstration
    return new TransactionInstruction({
        keys: [{ pubkey: user, isSigner: true, isWritable: true }],
        programId: LAUNCHPAD_PROGRAM_ID,
        data: Buffer.from([]), // Mock data
    });
}
