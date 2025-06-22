// Main Application Controller
class FitTrackerApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.isInitialized = false;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupGlobalEventListeners();
        this.initializeAOS();
        this.handleInitialLoad();
        this.setupServiceWorker();
        this.isInitialized = true;
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');

        // Handle navigation clicks
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.dataset.section;
                this.navigateToSection(targetSection);
            });
        });

        // Mobile menu toggle
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            const section = e.state?.section || 'dashboard';
            this.navigateToSection(section, false);
        });
    }

    navigateToSection(sectionName, updateHistory = true) {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');

        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update navigation
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Update current section
        this.currentSection = sectionName;

        // Update browser history
        if (updateHistory) {
            history.pushState({ section: sectionName }, '', `#${sectionName}`);
        }

        // Trigger section-specific initialization
        this.initializeSection(sectionName);

        // Close mobile menu if open
        this.closeMobileMenu();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    initializeSection(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                if (window.dashboard) {
                    window.dashboard.loadDashboardData();
                }
                break;
            case 'workouts':
                if (window.workoutManager) {
                    window.workoutManager.loadWorkoutHistory();
                }
                break;
            case 'nutrition':
                if (window.nutritionManager) {
                    window.nutritionManager.loadNutritionOverview();
                    window.nutritionManager.loadTodaysMeals();
                }
                break;
            case 'environment':
                if (window.environmentManager) {
                    window.environmentManager.refreshEnvironmentData();
                }
                break;
            case 'achievements':
                if (window.gamificationManager) {
                    window.gamificationManager.loadUserProgress();
                    window.gamificationManager.loadRecentAchievements();
                }
                break;
        }
    }

    toggleMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.classList.toggle('mobile-open');
        }
    }

    closeMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.classList.remove('mobile-open');
        }
    }

    setupGlobalEventListeners() {
        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Handle online/offline status
        window.addEventListener('online', () => {
            Utils.showToast('Connection restored', 'success');
        });

        window.addEventListener('offline', () => {
            Utils.showToast('You are offline', 'warning');
        });

        // Handle visibility change (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.isInitialized) {
                this.handleAppResume();
            }
        });

        // Handle window resize
        window.addEventListener('resize', Utils.throttle(() => {
            this.handleWindowResize();
        }, 250));

        // Handle unload (save data)
        window.addEventListener('beforeunload', () => {
            this.handleAppUnload();
        });

        // Global click handler for dynamic elements
        document.addEventListener('click', (e) => {
            this.handleGlobalClick(e);
        });
    }

    handleKeyboardShortcuts(e) {
        // Only handle shortcuts when not typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        // Alt + number keys for navigation
        if (e.altKey) {
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    this.navigateToSection('dashboard');
                    break;
                case '2':
                    e.preventDefault();
                    this.navigateToSection('workouts');
                    break;
                case '3':
                    e.preventDefault();
                    this.navigateToSection('nutrition');
                    break;
                case '4':
                    e.preventDefault();
                    this.navigateToSection('environment');
                    break;
                case '5':
                    e.preventDefault();
                    this.navigateToSection('achievements');
                    break;
            }
        }

        // Escape key to close modals
        if (e.key === 'Escape') {
            this.closeAllModals();
        }

        // Space bar to start/pause timer (when in workouts section)
        if (e.key === ' ' && this.currentSection === 'workouts') {
            e.preventDefault();
            const startBtn = document.getElementById('start-timer');
            const pauseBtn = document.getElementById('pause-timer');
            
            if (window.workoutManager && !window.workoutManager.timer.isRunning) {
                startBtn?.click();
            } else if (window.workoutManager && window.workoutManager.timer.isRunning) {
                pauseBtn?.click();
            }
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }

    handleAppResume() {
        // Refresh data when app becomes visible again
        if (this.currentSection === 'dashboard' && window.dashboard) {
            window.dashboard.updateStats();
        }
        
        if (this.currentSection === 'environment' && window.environmentManager) {
            window.environmentManager.refreshEnvironmentData();
        }
    }

    handleWindowResize() {
        // Handle responsive changes
        if (window.chartManager) {
            window.chartManager.resizeCharts();
        }

        // Close mobile menu on desktop
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
    }

    handleAppUnload() {
        // Save any pending data
        if (window.workoutManager && window.workoutManager.currentWorkout.length > 0) {
            window.workoutManager.saveCurrentWorkout();
        }
    }

    handleGlobalClick(e) {
        // Handle clicks on dynamically generated elements
        const target = e.target;

        // Close dropdowns when clicking outside
        if (!target.closest('.dropdown')) {
            const dropdowns = document.querySelectorAll('.dropdown.open');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('open');
            });
        }

        // Handle modal backdrop clicks
        if (target.classList.contains('modal')) {
            target.style.display = 'none';
        }
    }

    initializeAOS() {
        // Initialize Animate On Scroll library
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50,
                delay: 0
            });
        }
    }

    handleInitialLoad() {
        // Check URL hash for initial section
        const hash = window.location.hash.slice(1);
        const validSections = ['dashboard', 'workouts', 'nutrition', 'environment', 'achievements'];
        
        if (hash && validSections.includes(hash)) {
            this.navigateToSection(hash, false);
        } else {
            this.navigateToSection('dashboard', false);
        }

        // Show welcome message for new users
        this.checkFirstTimeUser();

        // Check for updates
        this.checkForUpdates();
    }

    checkFirstTimeUser() {
        const isFirstTime = !storage.exists('user_profile');
        
        if (isFirstTime) {
            setTimeout(() => {
                this.showWelcomeMessage();
            }, 1000);
        }
    }

    showWelcomeMessage() {
        const welcomeHTML = `
            <div class="welcome-overlay">
                <div class="welcome-content">
                    <h2>Welcome to FitTracker Pro!</h2>
                    <p>Your ultimate fitness companion is ready to help you achieve your goals.</p>
                    <div class="welcome-features">
                        <div class="feature">
                            <i class="fas fa-dumbbell"></i>
                            <span>Track Workouts</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-apple-alt"></i>
                            <span>Log Nutrition</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-trophy"></i>
                            <span>Earn Achievements</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-chart-line"></i>
                            <span>Monitor Progress</span>
                        </div>
                    </div>
                    <button class="btn-primary" onclick="app.closeWelcome()">
                        Get Started
                    </button>
                </div>
            </div>
        `;

        const welcomeElement = document.createElement('div');
        welcomeElement.innerHTML = welcomeHTML;
        document.body.appendChild(welcomeElement);

        // Add welcome styles
        const style = document.createElement('style');
        style.textContent = `
            .welcome-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.5s ease-out;
            }
            
            .welcome-content {
                background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                max-width: 500px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .welcome-content h2 {
                color: #3B82F6;
                margin-bottom: 16px;
                font-size: 28px;
            }
            
            .welcome-content p {
                color: rgba(255, 255, 255, 0.8);
                margin-bottom: 32px;
                font-size: 16px;
            }
            
            .welcome-features {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                margin-bottom: 32px;
            }
            
            .feature {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                padding: 16px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
            }
            
            .feature i {
                font-size: 24px;
                color: #3B82F6;
            }
            
            .feature span {
                color: #ffffff;
                font-size: 14px;
                font-weight: 500;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    closeWelcome() {
        const welcomeOverlay = document.querySelector('.welcome-overlay');
        if (welcomeOverlay) {
            welcomeOverlay.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                welcomeOverlay.remove();
            }, 300);
        }

        // Add fadeOut animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    checkForUpdates() {
        // Simulate update check
        const lastUpdateCheck = storage.get('last_update_check');
        const now = new Date().getTime();
        const oneDay = 24 * 60 * 60 * 1000;

        if (!lastUpdateCheck || (now - lastUpdateCheck) > oneDay) {
            storage.set('last_update_check', now);
            
            // Simulate finding an update
            setTimeout(() => {
                if (Math.random() > 0.8) { // 20% chance of "update"
                    this.showUpdateNotification();
                }
            }, 5000);
        }
    }

    showUpdateNotification() {
        Utils.showToast('New features available! Refresh to update.', 'info', 8000);
    }

    setupServiceWorker() {
        // Register service worker for offline functionality
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered successfully');
                })
                .catch(error => {
                    console.log('Service Worker registration failed');
                });
        }
    }

    // Export all user data
    exportAllData() {
        const allData = {
            userProfile: userData.getUserProfile(),
            userGoals: userData.getUserGoals(),
            workouts: workoutData.getWorkouts(),
            meals: nutritionData.getMeals(),
            achievements: achievementData.getAchievements(),
            userStats: achievementData.getUserStats(),
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };

        const blob = new Blob([JSON.stringify(allData, null, 2)], 
            { type: 'application/json' });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fittracker-complete-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        Utils.showToast('Complete data export successful!', 'success');
    }

    // Import user data
    async importData(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);

            // Validate data structure
            if (!this.validateImportData(data)) {
                throw new Error('Invalid data format');
            }

            // Import data
            if (data.userProfile) userData.updateUserProfile(data.userProfile);
            if (data.userGoals) userData.updateUserGoals(data.userGoals);
            if (data.workouts) {
                data.workouts.forEach(workout => workoutData.addWorkout(workout));
            }
            if (data.meals) {
                data.meals.forEach(meal => nutritionData.addMeal(meal));
            }
            if (data.achievements) {
                data.achievements.forEach(achievement => 
                    achievementData.addAchievement(achievement));
            }
            if (data.userStats) {
                achievementData.updateUserStats(data.userStats);
            }

            // Refresh all sections
            this.refreshAllSections();

            Utils.showToast('Data imported successfully!', 'success');
            return true;
        } catch (error) {
            console.error('Import error:', error);
            Utils.showToast('Failed to import data. Please check the file format.', 'error');
            return false;
        }
    }

    validateImportData(data) {
        // Basic validation of import data structure
        return data && typeof data === 'object' && data.version;
    }

    refreshAllSections() {
        // Refresh all section data
        if (window.dashboard) window.dashboard.loadDashboardData();
        if (window.workoutManager) {
            window.workoutManager.loadWorkoutHistory();
            window.workoutManager.loadCurrentWorkout();
        }
        if (window.nutritionManager) {
            window.nutritionManager.loadNutritionOverview();
            window.nutritionManager.loadTodaysMeals();
        }
        if (window.gamificationManager) {
            window.gamificationManager.loadUserProgress();
            window.gamificationManager.loadRecentAchievements();
        }
    }

    // Get app statistics
    getAppStatistics() {
        const stats = {
            totalWorkouts: workoutData.getWorkouts().length,
            totalMeals: nutritionData.getMeals().length,
            totalAchievements: achievementData.getAchievements().length,
            userLevel: achievementData.getUserStats().level,
            currentStreak: achievementData.getUserStats().currentStreak,
            totalCaloriesBurned: achievementData.getUserStats().totalCaloriesBurned,
            storageUsed: storage.getStorageSize(),
            lastActive: new Date().toISOString()
        };

        return stats;
    }

    // Reset all app data
    resetAllData() {
        if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
            if (confirm('This will permanently delete all your workouts, meals, and achievements. Continue?')) {
                storage.clear();
                location.reload();
            }
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FitTrackerApp();
    
    // Add global error handler
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
        Utils.showToast('An error occurred. Please refresh the page.', 'error');
    });

    // Add unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        Utils.showToast('An error occurred. Please try again.', 'error');
    });
});

// Make app globally available
window.FitTrackerApp = FitTrackerApp;