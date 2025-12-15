import { prisma } from '@/lib/db';
import ProjectActions from '@/components/ProjectActions';
import Link from 'next/link';
import { ArrowLeft, Globe, Twitter } from 'lucide-react';

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
    const project = await prisma.project.findUnique({
        where: { id: params.id },
        include: { pools: true }
    });

    if (!project) return <div className="p-10 text-white">Project not found</div>;

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Banner */}
            <div className="h-64 bg-gradient-to-r from-indigo-900 via-purple-900 to-black relative">
                <Link href="/" className="absolute top-8 left-8 text-white/50 hover:text-white flex items-center gap-2 transition-colors">
                    <ArrowLeft size={20} /> Back to Projects
                </Link>
            </div>

            <div className="container mx-auto px-4 -mt-20 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Main Info */}
                    <div className="flex-1 space-y-8">
                        <div className="glass w-32 h-32 rounded-2xl flex items-center justify-center border-2 border-white/10 shadow-2xl bg-black">
                            {project.logoUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={project.logoUrl} alt={project.name} className="w-full h-full rounded-2xl object-cover" />
                            ) : (
                                <span className="text-4xl font-bold text-white">{project.name.charAt(0)}</span>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold text-white">{project.name}</h1>

                            <div className="flex gap-4">
                                {project.website && (
                                    <a href={project.website} target="_blank" className="flex items-center gap-2 text-indigo-300 hover:text-white bg-indigo-500/10 px-4 py-2 rounded-lg transition-colors">
                                        <Globe size={16} /> Website
                                    </a>
                                )}
                                {project.twitter && (
                                    <a href={`https://twitter.com/${project.twitter}`} target="_blank" className="flex items-center gap-2 text-sky-300 hover:text-white bg-sky-500/10 px-4 py-2 rounded-lg transition-colors">
                                        <Twitter size={16} /> Twitter
                                    </a>
                                )}
                            </div>

                            <div className="glass-card p-6 rounded-xl">
                                <h3 className="text-xl font-semibold text-white mb-4">About the Project</h3>
                                <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
                                    {project.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Actions */}
                    <div className="w-full lg:w-[400px] space-y-6">
                        <ProjectActions pools={project.pools} />

                        <div className="glass-card p-6 rounded-xl space-y-4">
                            <h3 className="text-white font-medium">Sale Information</h3>
                            <div className="space-y-2 text-sm">
                                {project.pools.map(pool => (
                                    <div key={pool.id} className="border-b border-white/5 pb-2 last:border-0">
                                        <div className="flex justify-between">
                                            <span className="text-white/50">{pool.network} Raise:</span>
                                            <span className="text-white">${pool.raiseAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/50">Token Price:</span>
                                            <span className="text-white">${pool.saleTokenPrice}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
