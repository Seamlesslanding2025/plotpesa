
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Needs service role key to bypass RLS for seeding

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedBlog() {
    console.log('--- Seeding Blog Posts ---')
    const blogDataPath = path.join(process.cwd(), 'scripts', 'seed-blog.json')
    const blogPosts = JSON.parse(fs.readFileSync(blogDataPath, 'utf8'))

    for (const post of blogPosts) {
        const { error } = await supabase
            .from('blog_posts')
            .upsert(post, { onConflict: 'slug' })

        if (error) {
            console.error(`Error seeding post "${post.title}":`, error.message)
        } else {
            console.log(`Successfully seeded: ${post.title}`)
        }
    }
}

async function run() {
    try {
        await seedBlog()
        console.log('\n✅ Seeding complete! You can now view the blog at /blog')
    } catch (err) {
        console.error('Seeding failed:', err)
    }
}

run()
