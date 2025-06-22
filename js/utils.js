// Utility Functions
class Utils {
    // Format time duration (seconds to MM:SS)
    static formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Format date to readable string
    static formatDate(date) {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('en-US', options);
    }

    // Format date to relative time (e.g., "2 days ago")
    static formatRelativeTime(date) {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    }

    // Generate random ID
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Debounce function
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Calculate calories burned based on activity
    static calculateCaloriesBurned(activity, duration, weight = 70) {
        const metValues = {
            'running': 8.0,
            'cycling': 6.0,
            'swimming': 7.0,
            'walking': 3.5,
            'yoga': 2.5,
            'strength-training': 5.0,
            'hiit': 8.5,
            'pilates': 3.0,
            'dancing': 4.5,
            'hiking': 6.0
        };
        
        const met = metValues[activity] || 4.0;
        return Math.round((met * weight * duration) / 60);
    }

    // Convert units
    static convertWeight(value, from, to) {
        const conversions = {
            'kg_to_lbs': 2.20462,
            'lbs_to_kg': 0.453592,
            'kg_to_g': 1000,
            'g_to_kg': 0.001
        };
        
        const key = `${from}_to_${to}`;
        return conversions[key] ? value * conversions[key] : value;
    }

    // Calculate BMI
    static calculateBMI(weight, height) {
        // weight in kg, height in meters
        return (weight / (height * height)).toFixed(1);
    }

    // Get BMI category
    static getBMICategory(bmi) {
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 25) return 'Normal';
        if (bmi < 30) return 'Overweight';
        return 'Obese';
    }

    // Calculate macronutrient percentages
    static calculateMacroPercentages(protein, carbs, fat) {
        const proteinCals = protein * 4;
        const carbsCals = carbs * 4;
        const fatCals = fat * 9;
        const totalCals = proteinCals + carbsCals + fatCals;
        
        return {
            protein: Math.round((proteinCals / totalCals) * 100),
            carbs: Math.round((carbsCals / totalCals) * 100),
            fat: Math.round((fatCals / totalCals) * 100)
        };
    }

    // Animate number counting
    static animateNumber(element, start, end, duration = 1000) {
        const startTime = performance.now();
        const range = end - start;
        
        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = start + (range * this.easeOutQuart(progress));
            element.textContent = Math.round(current);
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }
        
        requestAnimationFrame(updateNumber);
    }

    // Easing function for animations
    static easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }

    // Show toast notification
    static showToast(message, type = 'info', duration = 3000) {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after duration
        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    // Validate email
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Format file size
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Generate color from string (for consistent user avatars, etc.)
    static stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const hue = Math.abs(hash % 360);
        return `hsl(${hue}, 70%, 60%)`;
    }

    // Check if device is mobile
    static isMobile() {
        return window.innerWidth <= 768;
    }

    // Get current week dates
    static getCurrentWeekDates() {
        const today = new Date();
        const currentDay = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - currentDay + 1);
        
        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            weekDates.push(date);
        }
        
        return weekDates;
    }

    // Get week number
    static getWeekNumber(date = new Date()) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    // Capitalize first letter
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Deep clone object
    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    // Generate random color
    static getRandomColor() {
        const colors = [
            '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', 
            '#EF4444', '#06B6D4', '#84CC16', '#F97316'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Load image with promise
    static loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    // Smooth scroll to element
    static scrollToElement(element, offset = 0) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }

    // Get browser info
    static getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        
        if (ua.includes('Chrome')) browser = 'Chrome';
        else if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Safari')) browser = 'Safari';
        else if (ua.includes('Edge')) browser = 'Edge';
        
        return {
            browser,
            userAgent: ua,
            language: navigator.language,
            platform: navigator.platform
        };
    }

    // Check online status
    static isOnline() {
        return navigator.onLine;
    }

    // Get device info
    static getDeviceInfo() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            pixelRatio: window.devicePixelRatio,
            touchSupport: 'ontouchstart' in window,
            mobile: this.isMobile()
        };
    }
}

// Export for use in other modules
window.Utils = Utils;