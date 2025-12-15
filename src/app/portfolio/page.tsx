"use client";

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useWallet } from '@solana/wallet-adapter-react';
import { Loader2, Coins, Lock, Unlock } from 'lucide-react';
import { cn } from '@/lib/utils'; // Ensure utils is imported

// Mock data fetcher (in real app, fetch from API similar to /api/user/cap but for all pools)
// For MVP, we'll just show a placeholder or mock fetch
export default function PortfolioPage() {
    const { address: evmAddress } = useAccount();
    const { publicKey } = useWallet();
    const solAddress = publicKey?.toBase58();

    const [loading, setLoading] = useState(true);
    const [contributions, setContributions] = useState<any[]>([]);

    useEffect(() => {
        // Mock user having contributions if connected
        if (evmAddress || solAddress) {
            setTimeout(() => {
                setContributions([
                    {
                        id: '1',
                        projectName: 'DeFi Protocol',
                        tokenSymbol: 'DEFI',
                        amount: 5000,
                        claimed: 500,
                        vestingStart: new Date().toISOString(),
                        network: 'EVM'
                    }
                ]);
                setLoading(false);
            }, 1000);
        } else {
            setLoading(false);
        }
    }, [evmAddress, solAddress]);

    if (!evmAddress && !solAddress) {
        return (
            <div className="container mx-auto py-20 text-center text-white/50">
                Please connect your wallet to view your portfolio.
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <h1 className="text-3xl font-bold text-white mb-8">My Portfolio</h1>

            {loading ? (
                <div className="flex justify-center p-10"><Loader2 className="animate-spin text-white" /></div>
            ) : contributions.length === 0 ? (
                <div className="text-white/50 text-center border-2 border-dashed border-white/10 rounded-xl p-10">
                    No contributions found.
                </div>
            ) : (
                <div className="grid gap-6">
                    {contributions.map((item) => (
                        <div key={item.id} className="glass-card p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-4 rounded-full">
                                    <Coins className="text-indigo-300" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{item.projectName}</h3>
                                    <div className="flex gap-2 text-sm text-white/50">
                                        <span>{item.amount.toLocaleString()} {item.tokenSymbol}</span>
                                        <span className="bg-white/10 px-2 rounded text-xs flex items-center">{item.network}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-8 text-center">
                                <div>
                                    <p className="text-xs text-white/40 mb-1 flex items-center justify-center gap-1"><Unlock size={12} /> Claimed</p>
                                    <p className="text-white font-mono">{item.claimed.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-white/40 mb-1 flex items-center justify-center gap-1"><Lock size={12} /> Locked</p>
                                    <p className="text-white/70 font-mono">{(item.amount - item.claimed).toLocaleString()}</p>
                                </div>
                            </div>

                            <button className="bg-white text-black font-bold px-6 py-2 rounded-lg hover:bg-white/90 transition-colors">
                                Claim Tokens
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
