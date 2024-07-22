import dotenv from 'dotenv'

// Load environment variables from a .env file into process.env
dotenv.config()

export const config = {
    // Port on which the application will run
    port: process.env.PORT || 3000,

    // CORS ORIGIN
    corsOrigin: process.env.CORS_ORIGIN || '',

    // Secret key for JWT (JSON Web Tokens)
    jwtSecret: process.env.NEXT_PUBLIC_JWT_SECRET || '',

    // Database configuration
    db: {
        url: process.env.DATABASE_URL || ''
    },

    // S3 (or Supabase) configuration
    s3: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        endPoint: process.env.NEXT_PUBLIC_SUPABASE_END_POINT || '',
        accessKey: process.env.NEXT_PUBLIC_SUPABASE_ACCESS_KEY || '',
        secretAccessKey: process.env.NEXT_PUBLIC_SUPABASE_SECRET_ACCESS_KEY || '',
        bucket: process.env.NEXT_PUBLIC_SUPABASE_BUCKET || '',
        region: process.env.NEXT_PUBLIC_SUPABASE_REGION || '',
        endPointUrl: process.env.NEXT_PUBLIC_SUPABASE_END_POINT_URL || ''
    },

    // Local storage configuration
    local: {
        storagePath: process.env.LOCAL_STORAGE_PATH || './storage'
    },

    // FTP configuration
    ftp: {
        host: process.env.FTP_HOST || '',
        user: process.env.FTP_USER || '',
        password: process.env.FTP_PASSWORD || '',
        basePath: process.env.FTP_BASE_PATH || ''
    }
}
