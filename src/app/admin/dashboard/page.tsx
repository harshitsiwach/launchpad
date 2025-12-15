import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Plus, Users, Calendar } from 'lucide-react';

// Force dynamic fetch
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    const projects = await prisma.project.findMany({
        include: {
            pools: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="container mx-auto max-w-6xl py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-white/50">Manage your launchpad projects and pools.</p>
                </div>
                <Link href="/admin/projects/create" className="bg-white text-black hover:bg-white/90 font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Plus size={18} /> New Project
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {projects.length === 0 ? (
                    <div className="glass-card p-12 text-center rounded-xl border-dashed border-2 border-white/10">
                        <h3 className="text-xl font-medium text-white/50 mb-4">No projects found</h3>
                        <Link href="/admin/projects/create" className="text-primary hover:underline">
                            Create your first project
                        </Link>
                    </div>
                ) : (
                    projects.map((project) => (
                        <div key={project.id} className="glass-card hover:bg-white/5 transition-all p-6 rounded-xl flex flex-col md:flex-row justify-between md:items-center gap-4 group">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    {project.logoUrl && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={project.logoUrl} alt={project.name} className="w-8 h-8 rounded-full object-cover" />
                                    )}
                                    <h2 className="text-xl font-bold text-white group-hover:text-white/90 transition-colors">{project.name}</h2>
                                    <span className="text-xs bg-white/10 text-white/70 px-2 py-0.5 rounded-full">{project.pools.length} Pools</span>
                                </div>
                                <p className="text-sm text-white/50 line-clamp-1 max-w-md">{project.description}</p>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-white/60">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex gap-2">
                                    {project.pools.map(pool => (
                                        <span key={pool.id} className={`px-2 py-1 rounded text-xs font-bold ${pool.network === 'EVM' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-green-500/20 text-green-300'}`}>
                                            {pool.network}
                                        </span>
                                    ))}
                                </div>
                                <Link href={`/admin/projects/${project.id}`} className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 hover:text-white transition-colors">
                                    Manage
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
