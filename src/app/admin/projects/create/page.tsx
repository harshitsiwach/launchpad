"use client";

import React, { useState } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type PoolForm = {
    network: 'EVM' | 'SOLANA';
    chainId?: number;
    tokenName: string;
    tokenSymbol: string;
    tokenAddress?: string;
    saleTokenPrice: number;
    raiseAmount: number;
    startTime: string;
    endTime: string;
    vestingType: string;
    tgePercentage: number;
    cliffMonths: number;
    vestingMonths: number;
};

type ProjectFormInputs = {
    name: string;
    description: string;
    logoUrl?: string;
    website?: string;
    twitter?: string;
    pools: PoolForm[];
};

export default function CreateProjectPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, control, handleSubmit, watch, formState: { errors } } = useForm<ProjectFormInputs>({
        defaultValues: {
            pools: [{
                network: 'EVM',
                tokenName: '',
                tokenSymbol: '',
                saleTokenPrice: 0,
                raiseAmount: 0,
                startTime: '',
                endTime: '',
                vestingType: 'LINEAR',
                tgePercentage: 10,
                cliffMonths: 1,
                vestingMonths: 12
            }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "pools"
    });

    const onSubmit: SubmitHandler<ProjectFormInputs> = async (data) => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/admin/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Failed to create project');

            router.push('/admin/dashboard');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Error creating project');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto max-w-4xl py-10 px-4">
            <h1 className="text-3xl font-bold mb-8 text-white">Create New Project</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Project Details */}
                <div className="glass-card p-6 rounded-xl space-y-4">
                    <h2 className="text-xl font-semibold text-white">Project Details</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Project Name</label>
                            <input {...register("name", { required: true })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. My DeFi Protocol" />
                            {errors.name && <span className="text-red-500 text-xs">Required</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea {...register("description", { required: true })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none h-24" placeholder="Brief description..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Website</label>
                                <input {...register("website")} className="w-full bg-black/20 border border-white/10 rounded-lg p-2" placeholder="https://..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Twitter</label>
                                <input {...register("twitter")} className="w-full bg-black/20 border border-white/10 rounded-lg p-2" placeholder="@handle" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Logo URL</label>
                            <input {...register("logoUrl")} className="w-full bg-black/20 border border-white/10 rounded-lg p-2" placeholder="https://..." />
                        </div>
                    </div>
                </div>

                {/* Pools Configuration */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-white">Sale Pools</h2>
                        <button type="button" onClick={() => append({
                            network: 'EVM',
                            tokenName: '',
                            tokenSymbol: '',
                            saleTokenPrice: 0,
                            raiseAmount: 0,
                            startTime: '',
                            endTime: '',
                            vestingType: 'LINEAR',
                            tgePercentage: 10,
                            cliffMonths: 1,
                            vestingMonths: 12
                        } as PoolForm)} className="flex items-center gap-2 text-sm bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1.5 rounded-lg transition-colors">
                            <Plus size={16} /> Add Pool
                        </button>
                    </div>

                    {fields.map((field, index) => (
                        <div key={field.id} className="glass-card p-6 rounded-xl relative">
                            <button type="button" onClick={() => remove(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-300">
                                <Trash2 size={18} />
                            </button>

                            <h3 className="text-lg font-medium mb-4 text-white/90">Pool #{index + 1}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Network</label>
                                    <select {...register(`pools.${index}.network`)} className="w-full bg-black/20 border border-white/10 rounded-lg p-2">
                                        <option value="EVM">EVM (Ethereum/L2s)</option>
                                        <option value="SOLANA">Solana</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Chain ID (EVM Only)</label>
                                    <input type="number" {...register(`pools.${index}.chainId`)} className="w-full bg-black/20 border border-white/10 rounded-lg p-2" placeholder="1 or 11155111" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Token Symbol</label>
                                    <input {...register(`pools.${index}.tokenSymbol`, { required: true })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2" placeholder="ETH" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Token Address</label>
                                    <input {...register(`pools.${index}.tokenAddress`)} className="w-full bg-black/20 border border-white/10 rounded-lg p-2" placeholder="0x... or sol address" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Sale Price ($)</label>
                                    <input type="number" step="0.000001" {...register(`pools.${index}.saleTokenPrice`, { required: true })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Raise Amount ($)</label>
                                    <input type="number" {...register(`pools.${index}.raiseAmount`, { required: true })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Start Time</label>
                                    <input type="datetime-local" {...register(`pools.${index}.startTime`, { required: true })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white/80" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">End Time</label>
                                    <input type="datetime-local" {...register(`pools.${index}.endTime`, { required: true })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white/80" />
                                </div>

                                {/* Vesting */}
                                <div className="md:col-span-2 border-t border-white/10 pt-4 mt-2">
                                    <h4 className="text-sm font-semibold text-white/70 mb-3">Vesting Schedule</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium mb-1">TGE %</label>
                                            <input type="number" {...register(`pools.${index}.tgePercentage`)} className="w-full bg-black/20 border border-white/10 rounded-lg p-2" placeholder="10" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Cliff (Months)</label>
                                            <input type="number" {...register(`pools.${index}.cliffMonths`)} className="w-full bg-black/20 border border-white/10 rounded-lg p-2" placeholder="1" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Vesting (Months)</label>
                                            <input type="number" {...register(`pools.${index}.vestingMonths`)} className="w-full bg-black/20 border border-white/10 rounded-lg p-2" placeholder="12" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button disabled={isSubmitting} type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform transform active:scale-[0.98] flex justify-center items-center gap-2">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Create Project'}
                </button>
            </form>
        </div>
    );
}
