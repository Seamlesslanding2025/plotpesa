import { createClient } from './client'

/**
 * Utility to generate optimized Supabase image URLs.
 * Uses Supabase Image Transformations to serve resized/compressed versions
 * instead of the full multi-megabyte originals.
 * Note: Your Supabase Project must have Image Transformations enabled.
 */
export function getOptimizedImageUrl(url: string | null | undefined, width: number = 400): string | null {
    if (!url) return null;
    
    // If it's already an optimized URL or not a supabase storage URL, return as is
    if (!url.includes('supabase.co/storage/v1/object/public/')) {
        return url;
    }

    try {
        // Extract the path after the bucket name
        // Example URL: https://xyz.supabase.co/storage/v1/object/public/plot-images/user_id/images/123-file.jpg
        const match = url.match(/\/object\/public\/([^/]+)\/(.+)$/);
        
        if (match && match.length === 3) {
            const bucket = match[1];
            const path = match[2];
            
            // Generate the transformed URL. We need a client instance for this.
            // But since this is just a URL builder, we can construct the query params manually if needed, 
            // or use the client. Let's use the client.
            const supabase = createClient();
            
            const { data } = supabase.storage
                .from(bucket)
                .getPublicUrl(path, {
                    transform: {
                        width,
                        resize: 'contain', 
                        format: 'origin',
                        quality: 80
                    }
                });
            
            return data.publicUrl;
        }
        
        return url;
        
    } catch (e) {
        console.error("Failed to generate optimized image URL:", e);
        return url;
    }
}
