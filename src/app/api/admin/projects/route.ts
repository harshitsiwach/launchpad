import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            name,
            description,
            logoUrl,
            website,
            twitter,
            pools
        } = body;

        // TODO: Add Admin Authentication Check here

        const project = await prisma.project.create({
            data: {
                name,
                description,
                logoUrl,
                website,
                twitter,
                pools: {
                    create: pools.map((pool: any) => ({
                        network: pool.network,
                        chainId: pool.chainId,
                        tokenName: pool.tokenName,
                        tokenSymbol: pool.tokenSymbol,
                        tokenAddress: pool.tokenAddress,
                        saleTokenPrice: parseFloat(pool.saleTokenPrice),
                        raiseAmount: parseFloat(pool.raiseAmount),
                        startTime: new Date(pool.startTime),
                        endTime: new Date(pool.endTime),
                        vestingType: pool.vestingType,
                        tgePercentage: parseFloat(pool.tgePercentage),
                        cliffMonths: parseInt(pool.cliffMonths),
                        vestingMonths: parseInt(pool.vestingMonths),
                    }))
                }
            },
            include: {
                pools: true
            }
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}
