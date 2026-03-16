import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, ArrowLeft, Share2, Tag } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient()

    const { data: post, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', params.slug)
        .single()

    if (!post) {
        notFound()
    }

    return (
        <article className="bg-white min-h-screen">
            {/* Header / Hero */}
            <div className="w-full h-[60vh] relative min-h-[400px]">
                <img
                    src={post.featured_image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop'}
                    className="w-full h-full object-cover"
                    alt={post.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-20">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs font-black uppercase tracking-widest mb-4"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to Insights
                        </Link>
                        <div className="flex gap-4">
                            <span className="bg-pesa-gold text-black text-[10px] font-black uppercase tracking-widest py-1.5 px-3 rounded-lg shadow-xl">
                                {post.category.replace('_', ' ')}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] uppercase tracking-tighter">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-widest text-[10px]">
                                <Calendar className="h-4 w-4" /> {new Date(post.published_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-4xl mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-[1fr_250px] gap-20">
                    {/* Main Content */}
                    <div className="space-y-10">
                        <p className="text-xl md:text-2xl font-bold text-gray-500 italic leading-relaxed border-l-8 border-pesa-gold pl-8 py-2">
                            {post.excerpt}
                        </p>

                        <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-pesa-green prose-p:text-gray-600 prose-p:font-medium prose-a:text-pesa-gold prose-strong:text-pesa-green prose-img:rounded-3xl prose-img:shadow-xl">
                            {/* In a real app we'd use a markdown component here like react-markdown */}
                            <div dangerouslySetInnerHTML={{
                                __html: post.content.replace(/\n\n/g, '<br/><br/>').replace(/### (.*)\n/g, '<h3 class="text-2xl font-black text-pesa-green mt-12 mb-4">$1</h3>').replace(/## (.*)\n/g, '<h2 class="text-3xl font-black text-pesa-green mt-16 mb-6">$1</h2>')
                            }} />
                        </div>

                        <div className="pt-16 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-black uppercase tracking-widest text-gray-400">Share Insight</span>
                                <div className="flex gap-2">
                                    <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-pesa-green hover:bg-pesa-green hover:text-white transition-all shadow-sm">
                                        <Share2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-pesa-green bg-pesa-subtle px-4 py-2 rounded-xl">
                                <Tag className="h-4 w-4" /> {post.category}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Recommended */}
                    <aside className="hidden lg:block space-y-12">
                        <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 space-y-4">
                            <h4 className="text-sm font-black text-pesa-green uppercase tracking-widest">About Insights</h4>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                Our editorial team works with verified legal and land experts across Kenya to provide the most accurate real estate intelligence.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-sm font-black text-pesa-green uppercase tracking-widest">Join the ecosystem</h4>
                            <Link href="/auth/register">
                                <div className="bg-pesa-green p-6 rounded-2xl text-white shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
                                    <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-2">Are you a pro?</p>
                                    <p className="text-lg font-black leading-tight">Join our verified professional panel.</p>
                                </div>
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </article>
    )
}
