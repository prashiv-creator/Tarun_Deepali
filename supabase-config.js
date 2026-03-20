// Supabase Configuration for Wedding Invitation
// Replace Appwrite with Supabase for data storage

const SUPABASE_CONFIG = {
    // Supabase Project Settings - UPDATE THESE WITH YOUR VALUES
    url: 'https://nmddaacwmtteaztwqcco.supabase.co', // e.g., 'https://your-project-id.supabase.co'
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZGRhYWN3bXR0ZWF6dHdxY2NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDg2NTEsImV4cCI6MjA4OTQyNDY1MX0.3txVry-CbdqsHzcty_al3dbyOwP6iJdtRQ8FOMEtVns', // Get from Supabase Dashboard > Settings > API
    
    // Table and view names
    tableName: 'wedding_wishes',
    viewName: 'approved_wedding_wishes',
    
    // Configuration
    enabled: true,
    fallbackEnabled: true, // Fallback to localStorage if Supabase fails
    
    // Retry configuration
    maxRetries: 3,
    retryDelay: 1000
};

// Supabase API functions
class SupabaseAPI {
    constructor() {
        this.config = SUPABASE_CONFIG;
        this.client = null;
        this.isOnline = navigator.onLine;
    }
    
    // Initialize Supabase client
    getClient() {
        if (!this.client) {
            // Check if Supabase library is loaded
            if (typeof supabase === 'undefined') {
                throw new Error('Supabase library not loaded. Please include the Supabase JS SDK.');
            }
            
            this.client = supabase.createClient(
                this.config.url,
                this.config.anonKey
            );
        }
        return this.client;
    }
    
    // Check if Supabase is available
    async checkConnection() {
        if (!this.config.enabled || !this.isOnline) {
            return false;
        }
        
        try {
            const client = this.getClient();
            const { data, error } = await client
                .from(this.config.viewName)
                .select('id')
                .limit(1);
            
            return !error;
        } catch (error) {
            console.log('Supabase connection failed:', error);
            return false;
        }
    }
    
    // Save wish to Supabase
    async saveWish(wishData) {
        if (!this.config.enabled) {
            return this.fallbackSave(wishData);
        }
        
        try {
            console.log('Attempting to save to Supabase...');
            const client = this.getClient();
            
            // Get client info for optional tracking
            const clientInfo = {
                ip_address: null, // Supabase handles this server-side if needed
                user_agent: navigator.userAgent
            };
            
            const { data, error } = await client
                .from(this.config.tableName)
                .insert([
                    {
                        name: wishData.name || "",
                        message: wishData.message || "",
                        ...clientInfo
                    }
                ])
                .select();
            
            if (error) {
                throw error;
            }
            
            console.log('Supabase save successful:', data);
            return {
                status: 'success',
                message: 'Wish saved to Supabase',
                id: data[0].id
            };
            
        } catch (error) {
            console.error('Supabase save failed:', error);
            console.log('Falling back to localStorage...');
            return this.fallbackSave(wishData);
        }
    }
    
    // Get all wishes from Supabase
    async getAllWishes() {
        if (!this.config.enabled) {
            return this.fallbackGetAll();
        }
        
        try {
            const client = this.getClient();
            
            const { data, error } = await client
                .from(this.config.viewName)
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                throw error;
            }
            
            const wishes = data.map(wish => ({
                id: wish.id,
                name: wish.name || "",
                message: wish.message || "",
                date: wish.date || new Date(wish.created_at).toLocaleString()
            }));
            
            return {
                status: 'success',
                wishes: wishes
            };
            
        } catch (error) {
            console.log('Supabase fetch failed:', error);
            return this.fallbackGetAll();
        }
    }
    
    // Get statistics from Supabase
    async getStats() {
        if (!this.config.enabled) {
            return this.fallbackGetStats();
        }
        
        try {
            const client = this.getClient();
            
            // Use the custom function we created
            const { data, error } = await client
                .rpc('get_wedding_stats');
            
            if (error) {
                throw error;
            }
            
            return {
                status: 'success',
                stats: { 
                    total: data[0]?.total_wishes || 0,
                    today: data[0]?.today_wishes || 0,
                    latest: data[0]?.latest_wish || "",
                    latest_name: data[0]?.latest_name || ""
                }
            };
            
        } catch (error) {
            console.log('Supabase stats failed:', error);
            return this.fallbackGetStats();
        }
    }
    
    // Get recent wishes (limited number)
    async getRecentWishes(limit = 5) {
        if (!this.config.enabled) {
            return this.fallbackGetRecentWishes(limit);
        }
        
        try {
            const client = this.getClient();
            
            const { data, error } = await client
                .from(this.config.viewName)
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);
            
            if (error) {
                throw error;
            }
            
            const wishes = data.map(wish => ({
                id: wish.id,
                name: wish.name || "",
                message: wish.message || "",
                date: wish.date || new Date(wish.created_at).toLocaleString()
            }));
            
            return {
                status: 'success',
                wishes: wishes
            };
            
        } catch (error) {
            console.log('Supabase recent wishes failed:', error);
            return this.fallbackGetRecentWishes(limit);
        }
    }
    
    // Delete all wishes (admin function)
    async clearAllWishes() {
        if (!this.config.enabled) {
            return this.fallbackClearAll();
        }
        
        try {
            const client = this.getClient();
            
            const { error } = await client
                .from(this.config.tableName)
                .delete()
                .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
            
            if (error) {
                throw error;
            }
            
            return {
                status: 'success',
                message: 'All wishes cleared from Supabase'
            };
            
        } catch (error) {
            console.log('Supabase clear failed:', error);
            return this.fallbackClearAll();
        }
    }
    
    // Fallback to localStorage methods
    fallbackSave(wishData) {
        const wishes = JSON.parse(localStorage.getItem('weddingWishes') || '[]');
        wishes.push({
            ...wishData,
            timestamp: new Date().toISOString(),
            id: Date.now(),
            date: new Date().toLocaleString()
        });
        localStorage.setItem('weddingWishes', JSON.stringify(wishes));
        
        return {
            status: 'success',
            message: 'Saved to localStorage (Supabase unavailable)',
            entry: wishes.length
        };
    }
    
    fallbackGetAll() {
        const wishes = JSON.parse(localStorage.getItem('weddingWishes') || '[]');
        return {
            status: 'success',
            wishes: wishes.reverse()
        };
    }
    
    fallbackGetStats() {
        const wishes = JSON.parse(localStorage.getItem('weddingWishes') || '[]');
        const today = new Date().toDateString();
        const todayWishes = wishes.filter(w => new Date(w.timestamp).toDateString() === today);
        
        const stats = {
            total: wishes.length,
            today: todayWishes.length,
            latest: wishes[wishes.length - 1]?.message || "",
            latest_name: wishes[wishes.length - 1]?.name || ""
        };
        
        return {
            status: 'success',
            stats: stats
        };
    }
    
    fallbackGetRecentWishes(limit = 5) {
        const wishes = JSON.parse(localStorage.getItem('weddingWishes') || '[]');
        const recent = wishes.slice(-limit).reverse();
        
        return {
            status: 'success',
            wishes: recent
        };
    }
    
    fallbackClearAll() {
        localStorage.removeItem('weddingWishes');
        return {
            status: 'success',
            message: 'All wishes cleared from localStorage'
        };
    }
}

// Initialize Supabase API
window.SupabaseAPI = new SupabaseAPI();

// Test connection function
window.testSupabaseConnection = async function() {
    console.log('Testing Supabase connection...');
    const resultDiv = document.getElementById('testResult') || document.createElement('div');
    
    if (!document.getElementById('testResult')) {
        resultDiv.id = 'testResult';
        resultDiv.style.cssText = 'margin: 10px 0; padding: 10px; border-radius: 5px;';
        document.querySelector('.admin-section').appendChild(resultDiv);
    }
    
    resultDiv.style.display = 'block';
    resultDiv.style.background = '#fff3cd';
    resultDiv.style.color = '#856404';
    resultDiv.innerHTML = '🔄 Testing connection...';
    
    try {
        const api = window.SupabaseAPI;
        
        // Check if Supabase library is loaded
        if (typeof supabase === 'undefined') {
            throw new Error('Supabase library not loaded. Please include the Supabase JS SDK.');
        }
        
        console.log('Supabase library available:', typeof supabase !== 'undefined');
        console.log('URL:', api.config.url);
        console.log('Table:', api.config.tableName);
        
        // Test basic connection
        const isConnected = await api.checkConnection();
        
        if (isConnected) {
            // Test actual data access
            const result = await api.getStats();
            console.log('Stats test successful:', result);
            
            resultDiv.style.background = '#d4edda';
            resultDiv.style.color = '#155724';
            resultDiv.innerHTML = '✅ Supabase connection successful! Ready to save wishes.';
            
            return true;
        } else {
            throw new Error('Connection test failed');
        }
        
    } catch (error) {
        console.error('Supabase connection test failed:', error);
        console.error('Error details:', error.message);
        
        resultDiv.style.background = '#f8d7da';
        resultDiv.style.color = '#721c24';
        resultDiv.innerHTML = '❌ Connection failed: ' + error.message + '<br>Using localStorage fallback.';
        
        return false;
    }
};

// Usage example:
// To save a wish: await window.SupabaseAPI.saveWish({name: 'John', message: 'Congratulations!'});
// To get all wishes: await window.SupabaseAPI.getAllWishes();
// To get stats: await window.SupabaseAPI.getStats();
// To get recent wishes: await window.SupabaseAPI.getRecentWishes(5);
// To test connection: await window.testSupabaseConnection();
