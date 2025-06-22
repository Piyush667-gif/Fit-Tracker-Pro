// Local Storage Management
class StorageManager {
    constructor() {
        this.prefix = 'fittracker_';
    }

    // Get item from localStorage
    get(key) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error getting item from storage:', error);
            return null;
        }
    }

    // Set item in localStorage
    set(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error setting item in storage:', error);
            return false;
        }
    }

    // Remove item from localStorage
    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (error) {
            console.error('Error removing item from storage:', error);
            return false;
        }
    }

    // Clear all app data
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    // Get all keys with app prefix
    getAllKeys() {
        const keys = Object.keys(localStorage);
        return keys
            .filter(key => key.startsWith(this.prefix))
            .map(key => key.replace(this.prefix, ''));
    }

    // Check if key exists
    exists(key) {
        return localStorage.getItem(this.prefix + key) !== null;
    }

    // Get storage size
    getStorageSize() {
        let total = 0;
        const keys = Object.keys(localStorage);
        
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                total += localStorage.getItem(key).length;
            }
        });
        
        return total;
    }

    // Export all data
    exportData() {
        const data = {};
        const keys = this.getAllKeys();
        
        keys.forEach(key => {
            data[key] = this.get(key);
        });
        
        return data;
    }

    // Import data
    importData(data) {
        try {
            Object.keys(data).forEach(key => {
                this.set(key, data[key]);
            });
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    // Backup data to file
    downloadBackup() {
        const data = this.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], 
            { type: 'application/json' });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fittracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Restore data from file
    async restoreBackup(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            if (this.importData(data)) {
                Utils.showToast('Backup restored successfully!', 'success');
                return true;
            } else {
                throw new Error('Failed to import data');
            }
        } catch (error) {
            console.error('Error restoring backup:', error);
            Utils.showToast('Failed to restore backup', 'error');
            return false;
        }
    }
}

// Specific data managers
class UserDataManager extends StorageManager {
    constructor() {
        super();
        this.initializeDefaults();
    }

    initializeDefaults() {
        if (!this.exists('user_profile')) {
            this.set('user_profile', {
                name: 'Fitness Enthusiast',
                age: 30,
                weight: 70,
                height: 175,
                goal: 'maintenance',
                activityLevel: 'moderate',
                createdAt: new Date().toISOString()
            });
        }

        if (!this.exists('user_goals')) {
            this.set('user_goals', {
                dailySteps: 10000,
                dailyCalories: 2000,
                waterIntake: 2.5,
                sleepHours: 8,
                workoutDays: 4
            });
        }
    }

    getUserProfile() {
        return this.get('user_profile');
    }

    updateUserProfile(updates) {
        const profile = this.getUserProfile();
        const updatedProfile = { ...profile, ...updates };
        return this.set('user_profile', updatedProfile);
    }

    getUserGoals() {
        return this.get('user_goals');
    }

    updateUserGoals(updates) {
        const goals = this.getUserGoals();
        const updatedGoals = { ...goals, ...updates };
        return this.set('user_goals', updatedGoals);
    }
}

class WorkoutDataManager extends StorageManager {
    constructor() {
        super();
    }

    getWorkouts() {
        return this.get('workouts') || [];
    }

    addWorkout(workout) {
        const workouts = this.getWorkouts();
        workout.id = Utils.generateId();
        workout.createdAt = new Date().toISOString();
        workouts.unshift(workout);
        return this.set('workouts', workouts);
    }

    updateWorkout(id, updates) {
        const workouts = this.getWorkouts();
        const index = workouts.findIndex(w => w.id === id);
        
        if (index !== -1) {
            workouts[index] = { ...workouts[index], ...updates };
            return this.set('workouts', workouts);
        }
        return false;
    }

    deleteWorkout(id) {
        const workouts = this.getWorkouts();
        const filtered = workouts.filter(w => w.id !== id);
        return this.set('workouts', filtered);
    }

    getWorkoutsByDateRange(startDate, endDate) {
        const workouts = this.getWorkouts();
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return workouts.filter(workout => {
            const workoutDate = new Date(workout.createdAt);
            return workoutDate >= start && workoutDate <= end;
        });
    }

    getCurrentWorkout() {
        return this.get('current_workout') || null;
    }

    setCurrentWorkout(workout) {
        return this.set('current_workout', workout);
    }

    clearCurrentWorkout() {
        return this.remove('current_workout');
    }
}

class NutritionDataManager extends StorageManager {
    constructor() {
        super();
    }

    getMeals() {
        return this.get('meals') || [];
    }

    addMeal(meal) {
        const meals = this.getMeals();
        meal.id = Utils.generateId();
        meal.createdAt = new Date().toISOString();
        meals.unshift(meal);
        return this.set('meals', meals);
    }

    updateMeal(id, updates) {
        const meals = this.getMeals();
        const index = meals.findIndex(m => m.id === id);
        
        if (index !== -1) {
            meals[index] = { ...meals[index], ...updates };
            return this.set('meals', meals);
        }
        return false;
    }

    deleteMeal(id) {
        const meals = this.getMeals();
        const filtered = meals.filter(m => m.id !== id);
        return this.set('meals', filtered);
    }

    getTodaysMeals() {
        const meals = this.getMeals();
        const today = new Date().toDateString();
        
        return meals.filter(meal => {
            const mealDate = new Date(meal.createdAt).toDateString();
            return mealDate === today;
        });
    }

    getMealsByDateRange(startDate, endDate) {
        const meals = this.getMeals();
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return meals.filter(meal => {
            const mealDate = new Date(meal.createdAt);
            return mealDate >= start && mealDate <= end;
        });
    }

    getDailyNutritionSummary(date = new Date()) {
        const dateStr = date.toDateString();
        const meals = this.getMeals().filter(meal => 
            new Date(meal.createdAt).toDateString() === dateStr
        );

        return meals.reduce((summary, meal) => {
            summary.calories += meal.calories || 0;
            summary.protein += meal.protein || 0;
            summary.carbs += meal.carbs || 0;
            summary.fat += meal.fat || 0;
            return summary;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }
}

class AchievementDataManager extends StorageManager {
    constructor() {
        super();
        this.initializeAchievements();
    }

    initializeAchievements() {
        if (!this.exists('achievements')) {
            this.set('achievements', []);
        }

        if (!this.exists('user_stats')) {
            this.set('user_stats', {
                level: 1,
                xp: 0,
                totalWorkouts: 0,
                totalCaloriesBurned: 0,
                longestStreak: 0,
                currentStreak: 0,
                badges: [],
                joinDate: new Date().toISOString()
            });
        }
    }

    getAchievements() {
        return this.get('achievements') || [];
    }

    addAchievement(achievement) {
        const achievements = this.getAchievements();
        achievement.id = Utils.generateId();
        achievement.unlockedAt = new Date().toISOString();
        achievements.unshift(achievement);
        
        this.set('achievements', achievements);
        this.awardXP(achievement.xpReward || 100);
        
        return true;
    }

    getUserStats() {
        return this.get('user_stats');
    }

    updateUserStats(updates) {
        const stats = this.getUserStats();
        const updatedStats = { ...stats, ...updates };
        return this.set('user_stats', updatedStats);
    }

    awardXP(amount) {
        const stats = this.getUserStats();
        const newXP = stats.xp + amount;
        const newLevel = Math.floor(newXP / 1000) + 1;
        
        const levelUp = newLevel > stats.level;
        
        this.updateUserStats({
            xp: newXP,
            level: newLevel
        });

        if (levelUp) {
            Utils.showToast(`Level Up! You're now level ${newLevel}!`, 'success');
        }

        return { levelUp, newLevel, newXP };
    }

    checkAchievements() {
        const stats = this.getUserStats();
        const achievements = this.getAchievements();
        const unlockedIds = achievements.map(a => a.achievementId);

        // Check for new achievements based on stats
        const possibleAchievements = this.getPossibleAchievements();
        
        possibleAchievements.forEach(achievement => {
            if (!unlockedIds.includes(achievement.id) && 
                this.checkAchievementCondition(achievement, stats)) {
                
                this.addAchievement({
                    achievementId: achievement.id,
                    title: achievement.title,
                    description: achievement.description,
                    icon: achievement.icon,
                    xpReward: achievement.xpReward
                });
                
                Utils.showToast(`Achievement Unlocked: ${achievement.title}!`, 'success');
            }
        });
    }

    getPossibleAchievements() {
        return [
            {
                id: 'first_workout',
                title: 'First Steps',
                description: 'Complete your first workout',
                icon: 'fas fa-dumbbell',
                condition: stats => stats.totalWorkouts >= 1,
                xpReward: 100
            },
            {
                id: 'week_streak',
                title: 'Consistency',
                description: 'Maintain a 7-day workout streak',
                icon: 'fas fa-fire',
                condition: stats => stats.currentStreak >= 7,
                xpReward: 250
            },
            {
                id: 'calorie_burner',
                title: 'Calorie Crusher',
                description: 'Burn 10,000 calories total',
                icon: 'fas fa-fire-alt',
                condition: stats => stats.totalCaloriesBurned >= 10000,
                xpReward: 500
            },
            {
                id: 'hundred_workouts',
                title: 'Century Club',
                description: 'Complete 100 workouts',
                icon: 'fas fa-trophy',
                condition: stats => stats.totalWorkouts >= 100,
                xpReward: 1000
            }
        ];
    }

    checkAchievementCondition(achievement, stats) {
        return achievement.condition(stats);
    }
}

// Initialize storage managers
const storage = new StorageManager();
const userData = new UserDataManager();
const workoutData = new WorkoutDataManager();
const nutritionData = new NutritionDataManager();
const achievementData = new AchievementDataManager();

// Export for global use
window.storage = storage;
window.userData = userData;
window.workoutData = workoutData;
window.nutritionData = nutritionData;
window.achievementData = achievementData;