// Dashboard Management
class Dashboard {
    constructor() {
        this.updateInterval = null;
        this.init();
    }

    init() {
        this.loadDashboardData();
        this.initializeCharts();
        this.startRealTimeUpdates();
        this.setupEventListeners();
    }

    loadDashboardData() {
        this.updateStats();
        this.updateProgressCircles();
        this.updateQuickActions();
    }

    updateStats() {
        const stats = this.calculateDailyStats();
        
        // Animate stat numbers
        this.animateStatValue('calories-burned', stats.caloriesBurned);
        this.animateStatValue('avg-heart-rate', stats.avgHeartRate);
        this.animateStatValue('workout-time', stats.workoutTime);
        this.animateStatValue('streak-count', stats.streakCount);

        // Update trend indicators
        this.updateTrendIndicators(stats);
    }

    calculateDailyStats() {
        const today = new Date().toDateString();
        const workouts = workoutData.getWorkouts().filter(workout => 
            new Date(workout.createdAt).toDateString() === today
        );
        
        const meals = nutritionData.getTodaysMeals();
        const userStats = achievementData.getUserStats();

        return {
            caloriesBurned: workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
            avgHeartRate: this.calculateAverageHeartRate(workouts),
            workoutTime: workouts.reduce((sum, w) => sum + (w.duration || 0), 0),
            streakCount: userStats.currentStreak || 0,
            totalCalories: meals.reduce((sum, m) => sum + (m.calories || 0), 0),
            waterIntake: this.getWaterIntake(),
            sleepHours: this.getSleepHours()
        };
    }

    calculateAverageHeartRate(workouts) {
        if (workouts.length === 0) return 0;
        
        const heartRates = workouts
            .map(w => w.avgHeartRate)
            .filter(hr => hr && hr > 0);
            
        if (heartRates.length === 0) return 142; // Default value
        
        return Math.round(heartRates.reduce((sum, hr) => sum + hr, 0) / heartRates.length);
    }

    getWaterIntake() {
        // Simulate water intake data
        return 1.5; // liters
    }

    getSleepHours() {
        // Simulate sleep data
        return 7.2; // hours
    }

    animateStatValue(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const currentValue = parseInt(element.textContent) || 0;
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const value = Math.round(currentValue + (targetValue - currentValue) * this.easeOutQuart(progress));
            element.textContent = value;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }

    updateTrendIndicators(stats) {
        // Get yesterday's stats for comparison
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStats = this.getStatsForDate(yesterday);

        this.updateTrendIndicator('calories-burned', stats.caloriesBurned, yesterdayStats.caloriesBurned);
        this.updateTrendIndicator('avg-heart-rate', stats.avgHeartRate, yesterdayStats.avgHeartRate);
        this.updateTrendIndicator('workout-time', stats.workoutTime, yesterdayStats.workoutTime);
        this.updateTrendIndicator('streak-count', stats.streakCount, yesterdayStats.streakCount);
    }

    updateTrendIndicator(statId, current, previous) {
        const statCard = document.querySelector(`#${statId}`).closest('.stat-card');
        const trendElement = statCard.querySelector('.stat-trend');
        
        if (!trendElement) return;

        const change = current - previous;
        const percentChange = previous > 0 ? Math.round((change / previous) * 100) : 0;

        trendElement.className = `stat-trend ${change >= 0 ? 'up' : 'down'}`;
        trendElement.querySelector('i').className = `fas fa-arrow-${change >= 0 ? 'up' : 'down'}`;
        trendElement.querySelector('span').textContent = `${Math.abs(percentChange)}%`;
    }

    getStatsForDate(date) {
        const dateStr = date.toDateString();
        const workouts = workoutData.getWorkouts().filter(workout => 
            new Date(workout.createdAt).toDateString() === dateStr
        );

        return {
            caloriesBurned: workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
            avgHeartRate: this.calculateAverageHeartRate(workouts),
            workoutTime: workouts.reduce((sum, w) => sum + (w.duration || 0), 0),
            streakCount: 0 // Would need historical data
        };
    }

    updateProgressCircles() {
        const stats = this.calculateDailyStats();
        const goals = userData.getUserGoals();

        // Update steps progress
        this.updateCircularProgress('.progress-item:nth-child(1)', 7500, goals.dailySteps);
        
        // Update water intake progress
        this.updateCircularProgress('.progress-item:nth-child(2)', stats.waterIntake, 2.5);
        
        // Update sleep progress
        this.updateCircularProgress('.progress-item:nth-child(3)', stats.sleepHours, goals.sleepHours);
    }

    updateCircularProgress(selector, current, goal) {
        const progressItem = document.querySelector(selector);
        if (!progressItem) return;

        const percentage = Math.min((current / goal) * 100, 100);
        const circle = progressItem.querySelector('.circle');
        const valueElement = progressItem.querySelector('.progress-value');
        const textElement = progressItem.querySelector('span');

        // Update percentage display
        valueElement.textContent = `${Math.round(percentage)}%`;
        
        // Update progress text
        if (selector.includes('nth-child(1)')) {
            textElement.textContent = `${current.toLocaleString()} / ${goal.toLocaleString()}`;
        } else if (selector.includes('nth-child(2)')) {
            textElement.textContent = `${current}L / ${goal}L`;
        } else {
            textElement.textContent = `${current}h / ${goal}h`;
        }

        // Animate the circular progress
        this.animateCircularProgress(circle, percentage);
    }

    animateCircularProgress(circle, percentage) {
        const degrees = (percentage / 100) * 360;
        circle.style.background = `conic-gradient(from 0deg, #3B82F6 0deg, #3B82F6 ${degrees}deg, rgba(255, 255, 255, 0.1) ${degrees}deg)`;
    }

    initializeCharts() {
        // Initialize weekly progress chart
        setTimeout(() => {
            chartManager.createWeeklyChart('weeklyChart');
        }, 500);

        // Initialize activity distribution chart
        setTimeout(() => {
            chartManager.createActivityChart('activityChart');
        }, 1000);
    }

    updateQuickActions() {
        const actionButtons = document.querySelectorAll('.action-btn');
        
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.addClickAnimation(button);
            });
        });
    }

    addClickAnimation(element) {
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = '';
        }, 150);
    }

    startRealTimeUpdates() {
        // Update dashboard every 30 seconds
        this.updateInterval = setInterval(() => {
            this.updateStats();
            this.updateProgressCircles();
        }, 30000);
    }

    setupEventListeners() {
        // Listen for data changes
        document.addEventListener('workoutAdded', () => {
            this.loadDashboardData();
            this.refreshCharts();
        });

        document.addEventListener('mealAdded', () => {
            this.loadDashboardData();
        });

        document.addEventListener('achievementUnlocked', () => {
            this.loadDashboardData();
        });
    }

    refreshCharts() {
        // Refresh weekly chart
        if (chartManager.charts['weeklyChart']) {
            const newData = {
                labels: chartManager.getWeeklyData().labels,
                datasets: [
                    {
                        label: 'Calories Burned',
                        data: chartManager.getWeeklyData().calories,
                        borderColor: '#3B82F6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Workout Minutes',
                        data: chartManager.getWeeklyData().minutes,
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            };
            chartManager.updateChart('weeklyChart', newData);
        }

        // Refresh activity chart
        if (chartManager.charts['activityChart']) {
            const activityData = chartManager.getActivityData();
            const newData = {
                labels: activityData.labels,
                datasets: [{
                    data: activityData.values,
                    backgroundColor: [
                        '#3B82F6',
                        '#8B5CF6',
                        '#10B981',
                        '#F59E0B',
                        '#EF4444'
                    ],
                    borderWidth: 2,
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                }]
            };
            chartManager.updateChart('activityChart', newData);
        }
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Quick action functions
window.startQuickWorkout = function() {
    Utils.showToast('Starting quick workout...', 'info');
    
    // Switch to workouts section
    document.querySelector('[data-section="workouts"]').click();
    
    // Start timer after a short delay
    setTimeout(() => {
        const startButton = document.getElementById('start-timer');
        if (startButton) {
            startButton.click();
        }
    }, 500);
};

window.logMeal = function() {
    Utils.showToast('Opening meal logging...', 'info');
    
    // Switch to nutrition section
    document.querySelector('[data-section="nutrition"]').click();
    
    // Focus on food search after a short delay
    setTimeout(() => {
        const foodSearch = document.getElementById('food-search');
        if (foodSearch) {
            foodSearch.focus();
        }
    }, 500);
};

window.checkWeather = function() {
    Utils.showToast('Checking weather conditions...', 'info');
    
    // Switch to environment section
    document.querySelector('[data-section="environment"]').click();
};

window.exportData = function() {
    Utils.showToast('Preparing data export...', 'info');
    
    // Export all user data
    setTimeout(() => {
        storage.downloadBackup();
        Utils.showToast('Data exported successfully!', 'success');
    }, 1000);
};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});