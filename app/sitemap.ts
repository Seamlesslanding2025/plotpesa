import { MetadataRoute } from 'next'
import { createClient } from '../lib/supabase/server'

const COUNTIES = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu',
    'Garissa', 'Homa-Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho',
    'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui',
    'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
    'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Muranga', 'Nairobi-City',
    'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
    'Samburu', 'Siaya', 'Taita-Taveta', 'Tana-River', 'Tharaka-Nithi',
    'Trans-Nzoia', 'Turkana', 'Uasin-Gishu', 'Vihiga', 'Wajir', 'West-Pokot'
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://plotpesa.com'

    // 1. Fetch all verified plots
    const { data: plots } = await supabase
        .from('plots')
        .select('id, updated_at')
        .eq('status', 'published')

    const typedPlots = (plots as any[]) || []

    // 2. Static Pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/plots`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        }
    ]

    // 3. County Landing Pages (GEO Optimization)
    const countyPages: MetadataRoute.Sitemap = COUNTIES.map(county => ({
        url: `${baseUrl}/plots/county/${county.toLowerCase()}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }))

    // 4. Property Detail Pages
    const propertyPages: MetadataRoute.Sitemap = typedPlots.map(plot => ({
        url: `${baseUrl}/plots/${plot.id}`,
        lastModified: new Date(plot.updated_at),
        changeFrequency: 'weekly',
        priority: 0.7,
    })) || []

    return [...staticPages, ...countyPages, ...propertyPages]
}
