"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function ProjectManagePage() {
    const params = useParams(); // params.id
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    // Mock pool selection (Ideally fetch project & pools, then select pool to upload specific whitelist)
    // For MVP, we'll assume we upload for a entered Pool ID or just show the UI structure
    const [targetPoolId, setTargetPoolId] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const parseCSV = async (text: string) => {
        // Basic parser: wallet,cap
        const lines = text.split('\n');
        const entries = lines.map(line => {
            const [walletAddress, cap] = line.split(',').map(s => s.trim());
            if (!walletAddress || !cap) return null;
            return { walletAddress, maxAllocation: parseFloat(cap) };
        }).filter(Boolean);
        return entries;
    };

    const handleUpload = async () => {
        if (!file || !targetPoolId) return;

        setUploading(true);
        setStatus('idle');
        try {
            const text = await file.text();
            const entries = await parseCSV(text);

            const res = await fetch('/api/admin/whitelist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    poolId: targetPoolId,
                    entries
                })
            });

            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();

            setStatus('success');
            setMessage(`Successfully uploaded ${data.count} entries.`);
        } catch (error) {
            console.error(error);
            setStatus('error');
            setMessage('Failed to upload whitelist.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <h1 className="text-3xl font-bold text-white mb-8">Manage Project</h1>

            <div className="glass-card p-8 rounded-xl space-y-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <FileText size={20} /> Upload Whitelist & Caps
                </h2>
                <p className="text-white/50 text-sm">
                    Upload a CSV file with format: <code>wallet_address, cap_amount</code>.
                    Make sure to select the correct Pool ID first.
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Target Pool ID</label>
                        <input value={targetPoolId} onChange={(e) => setTargetPoolId(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 font-mono text-sm" placeholder="cl..." />
                        <p className="text-xs text-white/30 mt-1">Copy the Pool ID from the Dashboard (or we can add a dropdown fetch).</p>
                    </div>

                    <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:bg-white/5 transition-colors cursor-pointer relative">
                        <input type="file" accept=".csv" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <div className="flex flex-col items-center gap-2">
                            <Upload className="text-primary" size={32} />
                            <span className="text-white/70 font-medium">{file ? file.name : "Click to select CSV"}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={!file || !targetPoolId || uploading}
                        className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity"
                    >
                        {uploading ? 'Processing...' : 'Upload Whitelist'}
                    </button>

                    {status === 'success' && (
                        <div className="bg-green-500/10 text-green-400 p-4 rounded-lg flex items-center gap-2">
                            <CheckCircle size={16} /> {message}
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="bg-red-500/10 text-red-400 p-4 rounded-lg flex items-center gap-2">
                            <AlertCircle size={16} /> {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
