# Supabase Setup Guide for Wedding Guest Book

## चरण 1: Supabase Project बनाएं

1. [Supabase.com](https://supabase.com) पर जाएं
2. Sign up करें या login करें
3. "New Project" पर क्लिक करें
4. Project का नाम दें (जैसे: "wedding-guest-book")
5. Database password set करें
6. Region select करें (सबसे close वाला)
7. "Create new project" पर क्लिक करें

## चरण 2: Database Schema Setup

1. Supabase Dashboard में जाएं
2. Left sidebar में "SQL Editor" पर क्लिक करें
3. "New query" पर क्लिक करें
4. `supabase-schema.sql` file की content copy करके paste करें
5. "Run" बटन पर क्लिक करें

यह आपकी database में ये tables बना देगा:
- `wedding_wishes` - wishes store करने के लिए
- `approved_wedding_wishes` - approved wishes की view
- `get_wedding_stats()` function - statistics के लिए

## चरण 3: API Keys प्राप्त करें

1. Supabase Dashboard में "Settings" > "API" पर जाएं
2. ये values copy करें:
   - **Project URL** (जैसे: `https://your-project-id.supabase.co`)
   - **anon public** key (जो `anon key` section में है)

## चरण 4: Configuration File Update

`supabase-config.js` file में ये values update करें:

```javascript
const SUPABASE_CONFIG = {
    // यहाँ अपनी values डालें
    url: 'YOUR_SUPABASE_URL', // e.g., 'https://your-project-id.supabase.co'
    anonKey: 'YOUR_SUPABASE_ANON_KEY', // Copy from Settings > API
    
    // बाकी settings same रखें
    tableName: 'wedding_wishes',
    viewName: 'approved_wedding_wishes',
    enabled: true,
    fallbackEnabled: true,
    maxRetries: 3,
    retryDelay: 1000
};
```

## चरण 5: Testing

1. `simple-guest-book.html` file को browser में open करें
2. Admin panel में "🔍 Test Supabase" बटन पर क्लिक करें
3. Green message आए तो connection successful है
4. Red message आए तो configuration check करें

## Features Available

### ✅ Available Features:
- **Save Wishes**: Guests can submit their wishes
- **Display Wishes**: Recent 5 wishes show होंगी
- **Statistics**: Total wishes count
- **Download Excel**: All wishes CSV format में download
- **Clear All**: Admin सभी wishes clear कर सकते हैं
- **Fallback**: localStorage backup if Supabase fails

### 🔧 Security Features:
- **Row Level Security (RLS)**: Enabled
- **Public Read**: Anyone can read approved wishes
- **Public Insert**: Anyone can submit wishes
- **Approval System**: `is_approved` field से control

## Database Structure

### wedding_wishes table:
```sql
- id (UUID, Primary Key)
- name (TEXT, Required)
- message (TEXT, Required)
- created_at (TIMESTAMP, Auto)
- date (TEXT, Generated)
- is_approved (BOOLEAN, Default: true)
- ip_address (TEXT, Optional)
- user_agent (TEXT, Optional)
```

### Functions:
- `get_wedding_stats()`: Returns statistics
  - total_wishes
  - today_wishes
  - latest_wish
  - latest_name

## Troubleshooting

### Common Issues:

1. **Connection Failed**:
   - Check URL और anon key सही हैं
   - Internet connection check करें
   - Supabase project active है

2. **CORS Error**:
   - Supabase Dashboard में "Authentication" > "URL Configuration" में अपनी website URL add करें
   - `http://localhost` और `https://yourdomain.com` add करें

3. **Permission Denied**:
   - RLS policies check करें
   - SQL schema properly run हुई है

4. **Data Not Showing**:
   - `is_approved` field check करें
   - Browser console में errors check करें

## Migration from Appwrite

अगर आप पहले Appwise use कर रहे थे:
1. Existing data export करें
2. Supabase में manually import करें (optional)
3. `appwrite-config.js` file delete कर सकते हैं
4. New configuration test करें

## Production Deployment

1. Supabase project को "Paused" से "Active" करें
2. Proper URL configuration करें
3. Database backups enable करें
4. Monitoring setup करें

---

**अगर कोई problem आए तो console में error messages check करें और Supabase dashboard में logs देखें!** 🎉
