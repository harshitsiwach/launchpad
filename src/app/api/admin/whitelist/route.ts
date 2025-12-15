import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { poolId, entries } = await req.json();

        if (!poolId || !entries || !Array.isArray(entries)) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        // Use Prisma transaction to batch create/update
        const result = await prisma.$transaction(
            entries.map((entry: { walletAddress: string; maxAllocation: number }) =>
                prisma.whitelist.upsert({
                    where: {
                        poolId_walletAddress: {
                            poolId: poolId,
                            walletAddress: entry.walletAddress,
                        }
                    },
                    update: {
                        maxAllocation: entry.maxAllocation
                    },
                    create: {
                        poolId: poolId,
                        walletAddress: entry.walletAddress,
                        maxAllocation: entry.maxAllocation
                    }
                })
            )
        );

        return NextResponse.json({ count: result.length, message: 'Whitelist updated successfully' });
    } catch (error) {
        console.error('Error updating whitelist:', error);
        return NextResponse.json({ error: 'Failed to update whitelist' }, { status: 500 });
    }
}
