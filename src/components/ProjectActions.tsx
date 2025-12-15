"use client";

import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useSwitchChain } from 'wagmi';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { LAUNCHPAD_ABI } from '@/constants/abis';
import { LAUNCHPAD_PROGRAM_ID, createContributeInstruction } from '@/lib/solana';
import { PublicKey } from '@solana/web3.js';
import { formatUnits, parseUnits } from 'viem';

type Pool = {
    id: string;
    network: string;
    chainId?: number;
    saleTokenPrice: number;
    tokenSymbol: string;
    raiseAmount: number;
};

export default function ProjectActions({ pools }: { pools: Pool[]; }) {
    const [selectedPoolId, setSelectedPoolId] = useState<string>(pools[0]?.id || '');
    const activePool = pools.find(p => p.id === selectedPoolId);
    const isEVM = activePool?.network === 'EVM';

    // State
    const [amount, setAmount] = useState('');
    const [capInfo, setCapInfo] = useState<{ cap: number; contributed: number; allowance: number } | null>(null);
    const [loadingCap, setLoadingCap] = useState(false);
    const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

    // EVM Hooks
    const { address: evmAddress, chainId: currentChainId } = useAccount();
    const { switchChain } = useSwitchChain();
    const { writeContractAsync } = useWriteContract();

    // Solana Hooks
    const { publicKey: solAddress, sendTransaction } = useWallet();
    const { connection } = useConnection();

    const walletAddress = isEVM ? evmAddress : solAddress?.toBase58();

    useEffect(() => {
        if (walletAddress && activePool) {
            fetchCap();
        } else {
            setCapInfo(null);
        }
    }, [walletAddress, activePool?.id]);

    const fetchCap = async () => {
        setLoadingCap(true);
        try {
            const res = await fetch(`/api/user/cap?poolId=${activePool?.id}&walletAddress=${walletAddress}`);
            const data = await res.json();
            setCapInfo(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingCap(false);
        }
    };

    const handleContribute = async () => {
        if (!activePool || !walletAddress || !amount) return;
        setTxStatus('pending');

        try {
            if (isEVM) {
                // Switch Chain Check
                if (activePool.chainId && currentChainId !== activePool.chainId) {
                    switchChain({ chainId: activePool.chainId });
                    // Wait for switch? Usually triggers re-render, so user might need to click again or we handle pending switch
                    // For now, assume user is on correct chain or manually switched
                }

                // Mock EVM Call
                await writeContractAsync({
                    address: '0x1234567890123456789012345678901234567890', // Mock Contract
                    abi: LAUNCHPAD_ABI,
                    functionName: 'contribute',
                    args: [BigInt(1), parseUnits(amount, 18), []], // Mock poolId & proof
                });

            } else {
                // Mock Solana Call
                if (!solAddress) return;
                const ix = createContributeInstruction(solAddress, new PublicKey(activePool.id), parseFloat(amount));
                const tx = await sendTransaction(
                    // @ts-ignore - Transaction constructor/version issues in adapter types sometimes
                    { instructions: [ix], feePayer: solAddress, recentBlockhash: (await connection.getLatestBlockhash()).blockhash },
                    connection
                );
                await connection.confirmTransaction(tx, 'confirmed');
            }

            setTxStatus('success');
            fetchCap(); // Refresh
        } catch (error) {
            console.error(error);
            setTxStatus('error');
        }
    };

    if (!activePool) return <div>No active pools</div>;

    return (
        <div className="glass-card p-6 rounded-xl space-y-6">
            {/* Pool Selector */}
            {pools.length > 1 && (
                <div className="flex gap-2 p-1 bg-black/20 rounded-lg">
                    {pools.map(pool => (
                        <button
                            key={pool.id}
                            onClick={() => setSelectedPoolId(pool.id)}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${selectedPoolId === pool.id
                                    ? 'bg-white/10 text-white shadow-sm'
                                    : 'text-white/50 hover:text-white/80'
                                }`}
                        >
                            {pool.network} Pool
                        </button>
                    ))}
                </div>
            )}

            {/* Wallet Connection */}
            <div className="flex justify-center py-4 border-b border-white/10">
                {isEVM ? <ConnectButton /> : <WalletMultiButton />}
            </div>

            {/* Cap Info */}
            <div className="space-y-4">
                <div className="flex justify-between text-sm">
                    <span className="text-white/60">Your Cap</span>
                    <span className="text-white font-mono">
                        {loadingCap ? <Loader2 size={14} className="animate-spin" /> :
                            capInfo ? `$${capInfo.cap.toLocaleString()}` : '-'}
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-white/60">Contributed</span>
                    <span className="text-white font-mono">
                        {loadingCap ? <Loader2 size={14} className="animate-spin" /> :
                            capInfo ? `$${capInfo.contributed.toLocaleString()}` : '-'}
                    </span>
                </div>
            </div>

            {/* Input */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Contribution Amount ($)</label>
                <div className="relative">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={!walletAddress || txStatus === 'pending'}
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-lg font-mono focus:border-primary outline-none"
                        placeholder="0.0"
                    />
                    <button
                        onClick={() => setAmount(capInfo?.allowance.toString() || '0')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary hover:text-white transition-colors"
                    >
                        MAX
                    </button>
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={handleContribute}
                disabled={!walletAddress || !amount || txStatus === 'pending' || (capInfo && parseFloat(amount) > capInfo.allowance)}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg transition-all"
            >
                {txStatus === 'pending' ? (
                    <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Processing</span>
                ) : (
                    'Contribute Now'
                )}
            </button>

            {/* Status Messages */}
            {txStatus === 'success' && (
                <div className="bg-green-500/20 text-green-300 p-3 rounded-lg text-sm flex items-center gap-2">
                    <CheckCircle size={16} /> Contribution Successful!
                </div>
            )}
            {txStatus === 'error' && (
                <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle size={16} /> Transaction Failed.
                </div>
            )}
        </div>
    );
}
