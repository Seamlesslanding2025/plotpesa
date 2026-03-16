import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Calendar, ChevronRight, BookOpen } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
    const supabase = await createClient()

    // Fetch blog posts
    const { data: rawPosts, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false })

    const posts = rawPosts as any[]

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-pesa-green py-24 text-white relative overflow-hidden border-b-8 border-pesa-gold">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl animate-pulse"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6">
                        Market <span className="text-pesa-gold">Insights</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 font-medium max-w-3xl mx-auto leading-relaxed">
                        Your trusted guide to land investment, legal compliance, and market trends in the Kenyan real estate ecosystem.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16">
                {posts && posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {posts.map((post) => (
                            <Link
                                href={`/blog/${post.slug}`}
                                key={post.id}
                                className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col"
                            >
                                <div className="aspect-[16/10] overflow-hidden relative">
                                    <img
                                        src={post.featured_image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop'}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-pesa-green text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-3 rounded-lg shadow-lg">
                                            {post.category.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(post.published_at).toLocaleDateString()}
                                    </div>
                                    <h2 className="text-2xl font-black text-pesa-green leading-tight mb-4 group-hover:text-pesa-gold transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-500 font-medium text-sm line-clamp-3 mb-8">
                                        {post.excerpt}
                                    </p>
                                    <div className="mt-auto flex items-center text-pesa-green font-black text-sm uppercase tracking-tighter gap-1">
                                        Read Insight <ChevronRight className="h-4 w-4" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[4rem] border border-gray-100 shadow-inner">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BookOpen className="h-12 w-12 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-400 uppercase">Coming Soon</h2>
                        <p className="text-gray-400 font-medium mt-2">We're crafting professional insights just for you.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
