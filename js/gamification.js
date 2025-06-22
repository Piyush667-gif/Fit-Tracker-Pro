// Gamification and Achievement System
class GamificationManager {
    constructor() {
        this.achievements = this.getAchievementDefinitions();
        this.challenges = this.getChallengeDefinitions();
        this.init();
    }

    init() {
        this.loadUserProgress();
        this.loadRecentAchievements();
        this.loadCurrentChallenges();
        this.loadAchievementCategories();
        this.setupEventListeners();
    }

    loadUserProgress() {
        const stats = achievementData.getUserStats();
        this.updateLevelDisplay(stats);
    }

    updateLevelDisplay(stats) {
        const levelNumber = document.querySelector('.level-number');
        const xpFill = document.querySelector('.xp-fill');
        const xpText = document.querySelector('.xp-text');

        if (levelNumber) {
            levelNumber.textContent = stats.level;
        }

        if (xpFill && xpText) {
            const currentLevelXP = (stats.level - 1) * 1000;
            const nextLevelXP = stats.level * 1000;
            const progressXP = stats.xp - currentLevelXP;
            const neededXP = nextLevelXP - currentLevelXP;
            const percentage = (progressXP / neededXP) * 100;

            xpFill.style.width = `${percentage}%`;
            xpText.textContent = `${stats.xp.toLocaleString()} / ${nextLevelXP.toLocaleString()} XP`;

            // Animate XP bar
            setTimeout(() => {
                xpFill.style.transition = 'width 1.5s ease-out';
            }, 100);
        }
    }

    loadRecentAchievements() {
        const container = document.getElementById('recent-achievements');
        if (!container) return;

        const achievements = achievementData.getAchievements().slice(0, 5);

        if (achievements.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-trophy"></i>
                    <p>Complete workouts and meals to unlock achievements!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = achievements.map((achievement, index) => `
            <div class="achievement-item" style="animation-delay: ${index * 0.1}s">
                <div class="achievement-icon">
                    <i class="${achievement.icon || 'fas fa-trophy'}"></i>
                </div>
                <div class="achievement-content">
                    <div class="achievement-title">${achievement.title}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                    <div class="achievement-date">${Utils.formatRelativeTime(achievement.unlockedAt)}</div>
                </div>
                <div class="achievement-points">+${achievement.xpReward || 100} XP</div>
            </div>
        `).join('');
    }

    loadCurrentChallenges() {
        const container = document.getElementById('current-challenges');
        if (!container) return;

        const activeChallenges = this.getActiveChallenges();

        container.innerHTML = activeChallenges.map((challenge, index) => `
            <div class="challenge-card" style="animation-delay: ${index * 0.1}s">
                <div class="challenge-header">
                    <span class="challenge-title">${challenge.title}</span>
                    <span class="challenge-reward">+${challenge.xpReward} XP</span>
                </div>
                <div class="challenge-desc">${challenge.description}</div>
                <div class="challenge-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${challenge.progress}%"></div>
                    </div>
                    <div class="progress-text">
                        <span>${challenge.current} / ${challenge.target}</span>
                        <span>${Math.round(challenge.progress)}%</span>
                    </div>
                </div>
                <div class="challenge-time">${this.getTimeRemaining(challenge.endDate)}</div>
            </div>
        `).join('');

        // Animate progress bars
        setTimeout(() => {
            const progressFills = container.querySelectorAll('.progress-fill');
            progressFills.forEach(fill => {
                fill.style.transition = 'width 1s ease-out';
            });
        }, 500);
    }

    getActiveChallenges() {
        const stats = achievementData.getUserStats();
        const now = new Date();
        
        return [
            {
                id: 'weekly-workouts',
                title: 'Weekly Warrior',
                description: 'Complete 5 workouts this week',
                current: Math.min(stats.totalWorkouts % 7, 5),
                target: 5,
                progress: Math.min((stats.totalWorkouts % 7) / 5 * 100, 100),
                xpReward: 500,
                endDate: this.getEndOfWeek()
            },
            {
                id: 'calorie-burn',
                title: 'Calorie Crusher',
                description: 'Burn 2000 calories this week',
                current: Math.min(stats.totalCaloriesBurned % 2000, 2000),
                target: 2000,
                progress: Math.min((stats.totalCaloriesBurned % 2000) / 2000 * 100, 100),
                xpReward: 750,
                endDate: this.getEndOfWeek()
            },
            {
                id: 'consistency',
                title: 'Consistency King',
                description: 'Maintain a 10-day streak',
                current: Math.min(stats.currentStreak, 10),
                target: 10,
                progress: Math.min((stats.currentStreak / 10) * 100, 100),
                xpReward: 1000,
                endDate: this.getEndOfMonth()
            }
        ];
    }

    getEndOfWeek() {
        const now = new Date();
        const endOfWeek = new Date(now);
        endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
        endOfWeek.setHours(23, 59, 59, 999);
        return endOfWeek;
    }

    getEndOfMonth() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    getTimeRemaining(endDate) {
        const now = new Date();
        const diff = endDate - now;
        
        if (diff <= 0) return 'Expired';
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (days > 0) return `${days}d ${hours}h remaining`;
        return `${hours}h remaining`;
    }

    loadAchievementCategories() {
        const container = document.getElementById('achievements-grid');
        if (!container) return;

        const currentCategory = document.querySelector('.category-tab.active')?.dataset.category || 'workout';
        const categoryAchievements = this.achievements.filter(a => a.category === currentCategory);
        const unlockedIds = achievementData.getAchievements().map(a => a.achievementId);

        container.innerHTML = categoryAchievements.map(achievement => {
            const isUnlocked = unlockedIds.includes(achievement.id);
            
            return `
                <div class="achievement-badge ${isUnlocked ? 'unlocked' : 'locked'}">
                    <div class="badge-icon ${isUnlocked ? 'unlocked' : 'locked'}">
                        <i class="${achievement.icon}"></i>
                    </div>
                    <div class="badge-title">${achievement.title}</div>
                    <div class="badge-desc">${achievement.description}</div>
                    ${isUnlocked ? `<div class="badge-unlocked">Unlocked!</div>` : ''}
                </div>
            `;
        }).join('');

        this.setupCategoryTabs();
    }

    setupCategoryTabs() {
        const tabs = document.querySelectorAll('.category-tab');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.loadAchievementCategories();
            });
        });
    }

    getAchievementDefinitions() {
        return [
            // Workout Achievements
            {
                id: 'first_workout',
                title: 'First Steps',
                description: 'Complete your first workout',
                icon: 'fas fa-dumbbell',
                category: 'workout',
                xpReward: 100
            },
            {
                id: 'workout_streak_7',
                title: 'Week Warrior',
                description: 'Complete workouts for 7 days straight',
                icon: 'fas fa-fire',
                category: 'workout',
                xpReward: 250
            },
            {
                id: 'workout_streak_30',
                title: 'Monthly Master',
                description: 'Complete workouts for 30 days straight',
                icon: 'fas fa-calendar-check',
                category: 'workout',
                xpReward: 1000
            },
            {
                id: 'total_workouts_50',
                title: 'Half Century',
                description: 'Complete 50 total workouts',
                icon: 'fas fa-medal',
                category: 'workout',
                xpReward: 500
            },
            {
                id: 'total_workouts_100',
                title: 'Century Club',
                description: 'Complete 100 total workouts',
                icon: 'fas fa-trophy',
                category: 'workout',
                xpReward: 1000
            },
            
            // Nutrition Achievements
            {
                id: 'first_meal',
                title: 'Nutrition Newbie',
                description: 'Log your first meal',
                icon: 'fas fa-apple-alt',
                category: 'nutrition',
                xpReward: 50
            },
            {
                id: 'balanced_day',
                title: 'Balanced Eater',
                description: 'Log all meals for a complete day',
                icon: 'fas fa-balance-scale',
                category: 'nutrition',
                xpReward: 200
            },
            {
                id: 'protein_goal',
                title: 'Protein Power',
                description: 'Meet your protein goal for 7 days',
                icon: 'fas fa-egg',
                category: 'nutrition',
                xpReward: 300
            },
            {
                id: 'calorie_tracking_30',
                title: 'Calorie Counter',
                description: 'Track calories for 30 consecutive days',
                icon: 'fas fa-calculator',
                category: 'nutrition',
                xpReward: 750
            },
            
            // Consistency Achievements
            {
                id: 'early_bird',
                title: 'Early Bird',
                description: 'Complete 10 morning workouts',
                icon: 'fas fa-sun',
                category: 'consistency',
                xpReward: 300
            },
            {
                id: 'weekend_warrior',
                title: 'Weekend Warrior',
                description: 'Work out every weekend for a month',
                icon: 'fas fa-calendar-weekend',
                category: 'consistency',
                xpReward: 400
            },
            {
                id: 'never_miss_monday',
                title: 'Monday Motivator',
                description: 'Work out every Monday for 8 weeks',
                icon: 'fas fa-calendar-day',
                category: 'consistency',
                xpReward: 500
            },
            
            // Milestone Achievements
            {
                id: 'calories_10k',
                title: 'Calorie Crusher',
                description: 'Burn 10,000 total calories',
                icon: 'fas fa-fire-alt',
                category: 'milestones',
                xpReward: 500
            },
            {
                id: 'calories_50k',
                title: 'Inferno',
                description: 'Burn 50,000 total calories',
                icon: 'fas fa-burn',
                category: 'milestones',
                xpReward: 2000
            },
            {
                id: 'level_10',
                title: 'Double Digits',
                description: 'Reach level 10',
                icon: 'fas fa-star',
                category: 'milestones',
                xpReward: 1000
            },
            {
                id: 'level_25',
                title: 'Quarter Century',
                description: 'Reach level 25',
                icon: 'fas fa-crown',
                category: 'milestones',
                xpReward: 2500
            }
        ];
    }

    getChallengeDefinitions() {
        return [
            {
                id: 'weekly-workouts',
                title: 'Weekly Warrior',
                description: 'Complete 5 workouts this week',
                type: 'weekly',
                target: 5,
                xpReward: 500
            },
            {
                id: 'daily-calories',
                title: 'Daily Burn',
                description: 'Burn 300 calories today',
                type: 'daily',
                target: 300,
                xpReward: 100
            },
            {
                id: 'monthly-consistency',
                title: 'Consistency Champion',
                description: 'Work out 20 days this month',
                type: 'monthly',
                target: 20,
                xpReward: 1500
            }
        ];
    }

    setupEventListeners() {
        // Listen for workout completion
        document.addEventListener('workoutAdded', () => {
            this.checkChallengeProgress();
            this.loadUserProgress();
            this.loadCurrentChallenges();
        });

        // Listen for meal logging
        document.addEventListener('mealAdded', () => {
            this.checkChallengeProgress();
        });

        // Listen for achievement unlocks
        document.addEventListener('achievementUnlocked', (e) => {
            this.showAchievementNotification(e.detail);
            this.loadRecentAchievements();
        });
    }

    checkChallengeProgress() {
        const challenges = this.getActiveChallenges();
        
        challenges.forEach(challenge => {
            if (challenge.progress >= 100) {
                this.completeChallengeIfNotCompleted(challenge);
            }
        });
    }

    completeChallengeIfNotCompleted(challenge) {
        const completedChallenges = storage.get('completed_challenges') || [];
        const challengeKey = `${challenge.id}_${this.getChallengeTimeframe(challenge)}`;
        
        if (!completedChallenges.includes(challengeKey)) {
            this.completeChallenge(challenge);
            completedChallenges.push(challengeKey);
            storage.set('completed_challenges', completedChallenges);
        }
    }

    getChallengeTimeframe(challenge) {
        const now = new Date();
        if (challenge.id.includes('weekly')) {
            return `week_${Utils.getWeekNumber(now)}_${now.getFullYear()}`;
        }
        if (challenge.id.includes('daily')) {
            return now.toDateString();
        }
        if (challenge.id.includes('monthly')) {
            return `${now.getMonth()}_${now.getFullYear()}`;
        }
        return 'general';
    }

    completeChallenge(challenge) {
        // Award XP
        achievementData.awardXP(challenge.xpReward);
        
        // Show notification
        Utils.showToast(`Challenge Complete: ${challenge.title}! +${challenge.xpReward} XP`, 'success', 5000);
        
        // Add celebration effect
        this.showCelebrationEffect();
    }

    showCelebrationEffect() {
        // Create confetti effect
        const confettiContainer = document.createElement('div');
        confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${Utils.getRandomColor()};
                top: -10px;
                left: ${Math.random() * 100}%;
                animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
                transform: rotate(${Math.random() * 360}deg);
            `;
            confettiContainer.appendChild(confetti);
        }

        // Add confetti animation CSS if not exists
        if (!document.getElementById('confetti-styles')) {
            const style = document.createElement('style');
            style.id = 'confetti-styles';
            style.textContent = `
                @keyframes confettiFall {
                    to {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(confettiContainer);

        // Remove confetti after animation
        setTimeout(() => {
            if (confettiContainer.parentNode) {
                confettiContainer.parentNode.removeChild(confettiContainer);
            }
        }, 5000);
    }

    showAchievementNotification(achievement) {
        // Create achievement popup
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
            border: 2px solid #10B981;
            border-radius: 20px;
            padding: 30px;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            animation: achievementPopup 3s ease-out forwards;
        `;

        popup.innerHTML = `
            <div style="font-size: 48px; color: #10B981; margin-bottom: 16px;">
                <i class="${achievement.icon || 'fas fa-trophy'}"></i>
            </div>
            <h2 style="color: #ffffff; margin-bottom: 8px;">Achievement Unlocked!</h2>
            <h3 style="color: #10B981; margin-bottom: 12px;">${achievement.title}</h3>
            <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 16px;">${achievement.description}</p>
            <div style="color: #F59E0B; font-weight: 600;">+${achievement.xpReward || 100} XP</div>
        `;

        // Add popup animation CSS
        if (!document.getElementById('achievement-popup-styles')) {
            const style = document.createElement('style');
            style.id = 'achievement-popup-styles';
            style.textContent = `
                @keyframes achievementPopup {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 0;
                    }
                    20% {
                        transform: translate(-50%, -50%) scale(1.1);
                        opacity: 1;
                    }
                    30% {
                        transform: translate(-50%, -50%) scale(1);
                    }
                    90% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(popup);

        // Remove popup after animation
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 3000);

        // Show celebration effect
        this.showCelebrationEffect();
    }

    // Get user's fitness score
    calculateFitnessScore() {
        const stats = achievementData.getUserStats();
        const workouts = workoutData.getWorkouts();
        const meals = nutritionData.getMeals();

        // Calculate various factors
        const consistencyScore = Math.min(stats.currentStreak * 5, 100);
        const activityScore = Math.min(stats.totalWorkouts * 2, 100);
        const nutritionScore = Math.min(meals.length * 1, 100);
        const achievementScore = Math.min(achievementData.getAchievements().length * 10, 100);

        // Weighted average
        const fitnessScore = Math.round(
            (consistencyScore * 0.3) +
            (activityScore * 0.3) +
            (nutritionScore * 0.2) +
            (achievementScore * 0.2)
        );

        return {
            total: fitnessScore,
            consistency: consistencyScore,
            activity: activityScore,
            nutrition: nutritionScore,
            achievements: achievementScore
        };
    }

    // Generate personalized recommendations
    generateRecommendations() {
        const score = this.calculateFitnessScore();
        const recommendations = [];

        if (score.consistency < 50) {
            recommendations.push({
                type: 'consistency',
                title: 'Build Consistency',
                description: 'Try to work out at the same time each day to build a habit',
                priority: 'high'
            });
        }

        if (score.activity < 30) {
            recommendations.push({
                type: 'activity',
                title: 'Increase Activity',
                description: 'Aim for at least 3 workouts per week to see progress',
                priority: 'high'
            });
        }

        if (score.nutrition < 40) {
            recommendations.push({
                type: 'nutrition',
                title: 'Track Nutrition',
                description: 'Log your meals to better understand your eating patterns',
                priority: 'medium'
            });
        }

        return recommendations;
    }
}

// Initialize gamification manager
document.addEventListener('DOMContentLoaded', () => {
    window.gamificationManager = new GamificationManager();
});