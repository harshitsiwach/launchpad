import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const poolId = searchParams.get('poolId');
    const walletAddress = searchParams.get('walletAddress');

    if (!poolId || !walletAddress) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    try {
        // Fetch cap from whitelist
        const whitelistEntry = await prisma.whitelist.findUnique({
            where: {
                poolId_walletAddress: {
                    poolId,
                    walletAddress
                }
            }
        });

        const cap = whitelistEntry ? whitelistEntry.maxAllocation : 0;

        // Fetch total contributions
        const contributions = await prisma.contribution.findMany({
            where: {
                poolId,
                walletAddress
            }
        });

        const totalContributed = contributions.reduce((sum, c) => sum + c.amount, 0);

        return NextResponse.json({
            cap,
            contributed: totalContributed,
            allowance: Math.max(0, cap - totalContributed)
        });
    } catch (error) {
        console.error('Error fetching user info:', error);
        return NextResponse.json({ error: 'Internal User Error' }, { status: 500 });
    }
}
