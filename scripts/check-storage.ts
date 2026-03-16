
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkStorage() {
    console.log('🔍 Checking Supabase Storage...')

    // 1. List Buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
        console.error('❌ Error listing buckets:', listError.message)
        return
    }

    console.log('📦 Buckets found:', buckets.map(b => b.name))

    const bucketName = 'plot-images'
    const bucket = buckets.find(b => b.name === bucketName)

    if (!bucket) {
        console.error(`❌ Bucket '${bucketName}' NOT found!`)
        console.log('   Creating bucket...')
        const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/*', 'application/pdf']
        })
        if (createError) console.error('   ❌ Failed to create bucket:', createError.message)
        else console.log('   ✅ Bucket created successfully!')
    } else {
        console.log(`✅ Bucket '${bucketName}' exists.`)
        console.log(`   Public: ${bucket.public}`)
    }

    // 2. Test Upload (if bucket exists)
    console.log('🧪 Testing Upload...')
    const fileBody = Buffer.from('fake-image-data')

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload('test-image.png', fileBody, {
            contentType: 'image/png',
            upsert: true
        })

    if (uploadError) {
        console.error('❌ Upload Failed:', uploadError.message)
    } else {
        console.log('✅ Upload Successful:', uploadData.path)

        // 3. Test Public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl('test-image.png')

        console.log('✅ Public URL generated:', publicUrl)
    }
}

checkStorage()
