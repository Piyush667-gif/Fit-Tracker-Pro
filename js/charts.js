// Chart Management and Data Visualization
class ChartManager {
    constructor() {
        this.charts = {};
        this.defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        };
    }

    // Create weekly progress chart
    createWeeklyChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const data = this.getWeeklyData();
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Calories Burned',
                        data: data.calories,
                        borderColor: '#3B82F6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Workout Minutes',
                        data: data.minutes,
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                ...this.defaultOptions,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    ...this.defaultOptions.plugins,
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#3B82F6',
                        borderWidth: 1
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });

        this.animateChart(canvasId);
        return this.charts[canvasId];
    }

    // Create activity distribution chart
    createActivityChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const data = this.getActivityData();
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        '#3B82F6',
                        '#8B5CF6',
                        '#10B981',
                        '#F59E0B',
                        '#EF4444'
                    ],
                    borderWidth: 2,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#ffffff'
                }]
            },
            options: {
                ...this.defaultOptions,
                cutout: '60%',
                plugins: {
                    ...this.defaultOptions.plugins,
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#3B82F6',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${percentage}%`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 2000
                }
            }
        });

        return this.charts[canvasId];
    }

    // Create nutrition chart
    createNutritionChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const data = this.getNutritionData();
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Calories',
                        data: data.calories,
                        backgroundColor: 'rgba(59, 130, 246, 0.7)',
                        borderColor: '#3B82F6',
                        borderWidth: 1
                    },
                    {
                        label: 'Protein (g)',
                        data: data.protein,
                        backgroundColor: 'rgba(16, 185, 129, 0.7)',
                        borderColor: '#10B981',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                ...this.defaultOptions,
                plugins: {
                    ...this.defaultOptions.plugins,
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#3B82F6',
                        borderWidth: 1
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutBounce'
                }
            }
        });

        return this.charts[canvasId];
    }

    // Create progress chart with multiple metrics
    createProgressChart(canvasId, timeframe = 'week') {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const data = this.getProgressData(timeframe);
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Current',
                    data: data.current,
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    pointBackgroundColor: '#3B82F6',
                    pointBorderColor: '#ffffff',
                    pointHoverBackgroundColor: '#ffffff',
                    pointHoverBorderColor: '#3B82F6'
                }, {
                    label: 'Goal',
                    data: data.goal,
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    pointBackgroundColor: '#10B981',
                    pointBorderColor: '#ffffff',
                    pointHoverBackgroundColor: '#ffffff',
                    pointHoverBorderColor: '#10B981'
                }]
            },
            options: {
                ...this.defaultOptions,
                scales: {
                    r: {
                        beginAtZero: true,
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        angleLines: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                plugins: {
                    ...this.defaultOptions.plugins,
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#3B82F6',
                        borderWidth: 1
                    }
                }
            }
        });

        return this.charts[canvasId];
    }

    // Get weekly data for charts
    getWeeklyData() {
        const weekDates = Utils.getCurrentWeekDates();
        const workouts = workoutData.getWorkouts();
        
        const labels = weekDates.map(date => 
            date.toLocaleDateString('en-US', { weekday: 'short' })
        );
        
        const calories = weekDates.map(date => {
            const dayWorkouts = workouts.filter(workout => 
                new Date(workout.createdAt).toDateString() === date.toDateString()
            );
            return dayWorkouts.reduce((sum, workout) => sum + (workout.caloriesBurned || 0), 0);
        });
        
        const minutes = weekDates.map(date => {
            const dayWorkouts = workouts.filter(workout => 
                new Date(workout.createdAt).toDateString() === date.toDateString()
            );
            return dayWorkouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);
        });

        return { labels, calories, minutes };
    }

    // Get activity distribution data
    getActivityData() {
        const workouts = workoutData.getWorkouts();
        const activityCounts = {};
        
        workouts.forEach(workout => {
            workout.exercises?.forEach(exercise => {
                const category = exercise.category || 'Other';
                activityCounts[category] = (activityCounts[category] || 0) + 1;
            });
        });

        const labels = Object.keys(activityCounts);
        const values = Object.values(activityCounts);

        return { labels, values };
    }

    // Get nutrition data for charts
    getNutritionData() {
        const weekDates = Utils.getCurrentWeekDates();
        const meals = nutritionData.getMeals();
        
        const labels = weekDates.map(date => 
            date.toLocaleDateString('en-US', { weekday: 'short' })
        );
        
        const calories = weekDates.map(date => {
            const dayMeals = meals.filter(meal => 
                new Date(meal.createdAt).toDateString() === date.toDateString()
            );
            return dayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
        });
        
        const protein = weekDates.map(date => {
            const dayMeals = meals.filter(meal => 
                new Date(meal.createdAt).toDateString() === date.toDateString()
            );
            return dayMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
        });

        return { labels, calories, protein };
    }

    // Get progress data for radar chart
    getProgressData(timeframe) {
        const stats = achievementData.getUserStats();
        const goals = userData.getUserGoals();
        
        const labels = ['Workouts', 'Calories', 'Consistency', 'Nutrition', 'Sleep'];
        
        // Calculate current values as percentages of goals
        const current = [
            Math.min((stats.totalWorkouts / 100) * 100, 100), // Workouts
            Math.min((stats.totalCaloriesBurned / 50000) * 100, 100), // Calories
            Math.min((stats.currentStreak / 30) * 100, 100), // Consistency
            75, // Nutrition (placeholder)
            80  // Sleep (placeholder)
        ];
        
        const goal = [100, 100, 100, 100, 100]; // All goals are 100%

        return { labels, current, goal };
    }

    // Animate chart on creation
    animateChart(canvasId) {
        const chart = this.charts[canvasId];
        if (!chart) return;

        // Add entrance animation
        chart.options.animation = {
            ...chart.options.animation,
            onComplete: () => {
                // Add sparkle effect after animation
                this.addSparkleEffect(canvasId);
            }
        };
    }

    // Add sparkle effect to charts
    addSparkleEffect(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const sparkles = document.createElement('div');
        sparkles.className = 'chart-sparkles';
        sparkles.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10;
        `;

        for (let i = 0; i < 5; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #3B82F6;
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: sparkle 2s ease-in-out infinite ${Math.random() * 2}s;
                box-shadow: 0 0 6px #3B82F6;
            `;
            sparkles.appendChild(sparkle);
        }

        // Add sparkle animation CSS
        if (!document.getElementById('sparkle-styles')) {
            const style = document.createElement('style');
            style.id = 'sparkle-styles';
            style.textContent = `
                @keyframes sparkle {
                    0%, 100% { 
                        opacity: 0; 
                        transform: scale(0); 
                    }
                    50% { 
                        opacity: 1; 
                        transform: scale(1); 
                    }
                }
            `;
            document.head.appendChild(style);
        }

        canvas.parentNode.style.position = 'relative';
        canvas.parentNode.appendChild(sparkles);

        // Remove sparkles after animation
        setTimeout(() => {
            if (sparkles.parentNode) {
                sparkles.parentNode.removeChild(sparkles);
            }
        }, 4000);
    }

    // Update chart data
    updateChart(canvasId, newData) {
        const chart = this.charts[canvasId];
        if (!chart) return;

        chart.data = newData;
        chart.update('active');
    }

    // Destroy chart
    destroyChart(canvasId) {
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
            delete this.charts[canvasId];
        }
    }

    // Destroy all charts
    destroyAllCharts() {
        Object.keys(this.charts).forEach(canvasId => {
            this.destroyChart(canvasId);
        });
    }

    // Resize all charts
    resizeCharts() {
        Object.values(this.charts).forEach(chart => {
            chart.resize();
        });
    }
}

// Initialize chart manager
const chartManager = new ChartManager();

// Handle window resize
window.addEventListener('resize', Utils.throttle(() => {
    chartManager.resizeCharts();
}, 250));

// Export for global use
window.chartManager = chartManager;