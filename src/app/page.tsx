import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ArrowRight, Wallet, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const projects = await prisma.project.findMany({
    include: { pools: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] -z-10" />
        <div className="container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-sm text-indigo-300 mb-6">
            <Flame size={14} className="fill-indigo-300" /> Premium Launchpad Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
            Launch into the <br /> Future with Us
          </h1>
          <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
            The premier multi-chain launchpad for high-quality projects on Ethereum and Solana. Secure, transparent, and fair.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="#projects" className="bg-white text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform">
              View Projects
            </Link>
            <Link href="/admin/dashboard" className="px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white/5 transition-colors">
              Admin Access
            </Link>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section id="projects" className="py-20 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 flex items-center gap-2">
          <Wallet className="text-indigo-400" /> Active Pools
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link href={`/projects/${project.id}`} key={project.id} className="group">
              <div className="glass-card rounded-2xl p-6 h-full transition-all duration-300 group-hover:bg-white/10 group-hover:-translate-y-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                    {project.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={project.logoUrl} alt={project.name} className="w-full h-full rounded-xl object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-white">{project.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {project.pools.map(pool => (
                      <span key={pool.id} className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded text-white/80 border border-white/10",
                        pool.network === 'EVM' ? 'bg-indigo-500/20' : 'bg-green-500/20'
                      )}>
                        {pool.network}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-2 text-white">{project.name}</h3>
                <p className="text-white/50 text-sm line-clamp-2 mb-6 h-10">
                  {project.description}
                </p>

                <div className="space-y-3">
                  {project.pools.slice(0, 1).map(pool => (
                    <div key={pool.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">Raise</span>
                        <span className="text-white font-medium">${pool.raiseAmount.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-[0%] group-hover:w-[10%] transition-all" />
                        {/* TODO: Connect real progress */}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center text-indigo-300 text-sm font-medium group-hover:gap-2 transition-all">
                  Participate Now <ArrowRight size={16} className="ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
