// Local Storage Helper Functions
const Storage = {
    // Save data with expiration
    set: function(key, value, expireMinutes = null) {
        const data = {
            value: value,
            timestamp: Date.now(),
            expire: expireMinutes ? Date.now() + (expireMinutes * 60 * 1000) : null
        };
        localStorage.setItem(key, JSON.stringify(data));
    },

    // Get data with expiration check
    get: function(key) {
        const data = localStorage.getItem(key);
        if (!data) return null;

        try {
            const parsed = JSON.parse(data);
            if (parsed.expire && Date.now() > parsed.expire) {
                localStorage.removeItem(key);
                return null;
            }
            return parsed.value;
        } catch (e) {
            localStorage.removeItem(key);
            return null;
        }
    },

    // Remove data
    remove: function(key) {
        localStorage.removeItem(key);
    },

    // Clear all expired data
    clearExpired: function() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            this.get(key); // This will auto-remove expired items
        });
    },

    // Save user preferences
    setPreference: function(key, value) {
        const prefs = this.get('userPreferences') || {};
        prefs[key] = value;
        this.set('userPreferences', prefs);
    },

    // Get user preferences
    getPreference: function(key, defaultValue = null) {
        const prefs = this.get('userPreferences') || {};
        return prefs[key] !== undefined ? prefs[key] : defaultValue;
    },

    // Save calculation history
    saveToHistory: function(toolName, inputs, result) {
        const history = this.get('calculationHistory') || [];
        const entry = {
            id: Date.now(),
            toolName: toolName,
            inputs: inputs,
            result: result,
            timestamp: new Date().toISOString()
        };
        
        history.unshift(entry);
        
        // Keep only last 100 entries
        if (history.length > 100) {
            history.splice(100);
        }
        
        this.set('calculationHistory', history);
    },

    // Get calculation history
    getHistory: function(toolName = null, limit = 10) {
        const history = this.get('calculationHistory') || [];
        
        if (toolName) {
            return history.filter(entry => entry.toolName === toolName).slice(0, limit);
        }
        
        return history.slice(0, limit);
    },

    // Clear history
    clearHistory: function() {
        this.remove('calculationHistory');
    }
};

// Initialize storage cleanup on load
if (typeof window !== 'undefined') {
    Storage.clearExpired();
}