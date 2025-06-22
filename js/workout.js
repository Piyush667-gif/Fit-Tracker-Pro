// Workout Management System
class WorkoutManager {
    constructor() {
        this.currentWorkout = [];
        this.timer = {
            seconds: 0,
            interval: null,
            isRunning: false
        };
        this.exercises = this.getExerciseDatabase();
        this.init();
    }

    init() {
        this.setupTimer();
        this.loadExerciseDatabase();
        this.loadCurrentWorkout();
        this.loadWorkoutHistory();
        this.setupEventListeners();
    }

    // Timer functionality
    setupTimer() {
        const startBtn = document.getElementById('start-timer');
        const pauseBtn = document.getElementById('pause-timer');
        const resetBtn = document.getElementById('reset-timer');
        const display = document.getElementById('timer-display');

        if (startBtn) {
            startBtn.addEventListener('click', () => this.startTimer());
        }
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pauseTimer());
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetTimer());
        }

        // Load saved timer state
        const savedTime = storage.get('timer_seconds');
        if (savedTime) {
            this.timer.seconds = savedTime;
            this.updateTimerDisplay();
        }
    }

    startTimer() {
        if (!this.timer.isRunning) {
            this.timer.isRunning = true;
            this.timer.interval = setInterval(() => {
                this.timer.seconds++;
                this.updateTimerDisplay();
                storage.set('timer_seconds', this.timer.seconds);
            }, 1000);

            // Update button states
            this.updateTimerButtons();
            Utils.showToast('Timer started!', 'success');
        }
    }

    pauseTimer() {
        if (this.timer.isRunning) {
            this.timer.isRunning = false;
            clearInterval(this.timer.interval);
            this.updateTimerButtons();
            Utils.showToast('Timer paused', 'info');
        }
    }

    resetTimer() {
        this.timer.isRunning = false;
        this.timer.seconds = 0;
        clearInterval(this.timer.interval);
        this.updateTimerDisplay();
        this.updateTimerButtons();
        storage.remove('timer_seconds');
        Utils.showToast('Timer reset', 'info');
    }

    updateTimerDisplay() {
        const display = document.getElementById('timer-display');
        if (display) {
            display.textContent = Utils.formatTime(this.timer.seconds);
        }
    }

    updateTimerButtons() {
        const startBtn = document.getElementById('start-timer');
        const pauseBtn = document.getElementById('pause-timer');

        if (startBtn && pauseBtn) {
            if (this.timer.isRunning) {
                startBtn.style.opacity = '0.5';
                pauseBtn.style.opacity = '1';
            } else {
                startBtn.style.opacity = '1';
                pauseBtn.style.opacity = '0.5';
            }
        }
    }

    // Exercise database
    getExerciseDatabase() {
        return [
            {
                id: 'push-ups',
                name: 'Push-ups',
                category: 'strength',
                difficulty: 'beginner',
                description: 'Classic bodyweight exercise for chest, shoulders, and triceps',
                instructions: [
                    'Start in plank position with hands shoulder-width apart',
                    'Lower your body until chest nearly touches the floor',
                    'Push back up to starting position',
                    'Keep your body in a straight line throughout'
                ],
                muscles: ['chest', 'shoulders', 'triceps', 'core'],
                equipment: 'none',
                caloriesPerMinute: 8
            },
            {
                id: 'squats',
                name: 'Squats',
                category: 'strength',
                difficulty: 'beginner',
                description: 'Fundamental lower body exercise',
                instructions: [
                    'Stand with feet shoulder-width apart',
                    'Lower your body as if sitting back into a chair',
                    'Keep your chest up and knees behind toes',
                    'Return to starting position'
                ],
                muscles: ['quadriceps', 'glutes', 'hamstrings'],
                equipment: 'none',
                caloriesPerMinute: 6
            },
            {
                id: 'burpees',
                name: 'Burpees',
                category: 'cardio',
                difficulty: 'intermediate',
                description: 'Full-body high-intensity exercise',
                instructions: [
                    'Start standing, then squat down and place hands on floor',
                    'Jump feet back into plank position',
                    'Do a push-up, then jump feet back to squat',
                    'Jump up with arms overhead'
                ],
                muscles: ['full-body'],
                equipment: 'none',
                caloriesPerMinute: 12
            },
            {
                id: 'plank',
                name: 'Plank',
                category: 'strength',
                difficulty: 'beginner',
                description: 'Isometric core strengthening exercise',
                instructions: [
                    'Start in push-up position',
                    'Lower to forearms, keeping body straight',
                    'Hold position, engaging core muscles',
                    'Breathe normally throughout'
                ],
                muscles: ['core', 'shoulders', 'back'],
                equipment: 'none',
                caloriesPerMinute: 4
            },
            {
                id: 'jumping-jacks',
                name: 'Jumping Jacks',
                category: 'cardio',
                difficulty: 'beginner',
                description: 'Classic cardio warm-up exercise',
                instructions: [
                    'Start standing with feet together, arms at sides',
                    'Jump while spreading legs shoulder-width apart',
                    'Simultaneously raise arms overhead',
                    'Jump back to starting position'
                ],
                muscles: ['full-body'],
                equipment: 'none',
                caloriesPerMinute: 8
            },
            {
                id: 'mountain-climbers',
                name: 'Mountain Climbers',
                category: 'cardio',
                difficulty: 'intermediate',
                description: 'Dynamic core and cardio exercise',
                instructions: [
                    'Start in plank position',
                    'Bring one knee toward chest',
                    'Quickly switch legs, like running in place',
                    'Keep hips level and core engaged'
                ],
                muscles: ['core', 'shoulders', 'legs'],
                equipment: 'none',
                caloriesPerMinute: 10
            },
            {
                id: 'lunges',
                name: 'Lunges',
                category: 'strength',
                difficulty: 'beginner',
                description: 'Unilateral leg strengthening exercise',
                instructions: [
                    'Step forward with one leg',
                    'Lower hips until both knees are at 90 degrees',
                    'Keep front knee over ankle',
                    'Push back to starting position'
                ],
                muscles: ['quadriceps', 'glutes', 'hamstrings'],
                equipment: 'none',
                caloriesPerMinute: 6
            },
            {
                id: 'high-knees',
                name: 'High Knees',
                category: 'cardio',
                difficulty: 'beginner',
                description: 'Running in place with high knee lift',
                instructions: [
                    'Stand with feet hip-width apart',
                    'Run in place, lifting knees to hip level',
                    'Pump arms naturally',
                    'Land on balls of feet'
                ],
                muscles: ['legs', 'core'],
                equipment: 'none',
                caloriesPerMinute: 9
            }
        ];
    }

    loadExerciseDatabase() {
        const grid = document.getElementById('exercise-grid');
        if (!grid) return;

        grid.innerHTML = '';
        
        this.exercises.forEach(exercise => {
            const card = this.createExerciseCard(exercise);
            grid.appendChild(card);
        });

        this.setupExerciseSearch();
        this.setupExerciseFilters();
    }

    createExerciseCard(exercise) {
        const card = document.createElement('div');
        card.className = 'exercise-card';
        card.dataset.category = exercise.category;
        card.dataset.difficulty = exercise.difficulty;
        
        card.innerHTML = `
            <h3>${exercise.name}</h3>
            <p>${exercise.description}</p>
            <div class="exercise-meta">
                <span class="exercise-category">${Utils.capitalize(exercise.category)}</span>
                <span class="exercise-difficulty">${Utils.capitalize(exercise.difficulty)}</span>
            </div>
        `;

        card.addEventListener('click', () => this.showExerciseDetails(exercise));
        
        return card;
    }

    setupExerciseSearch() {
        const searchInput = document.getElementById('exercise-search');
        if (!searchInput) return;

        const debouncedSearch = Utils.debounce((query) => {
            this.filterExercises(query);
        }, 300);

        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });
    }

    setupExerciseFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter exercises
                const category = button.dataset.category;
                this.filterExercisesByCategory(category);
            });
        });
    }

    filterExercises(query) {
        const cards = document.querySelectorAll('.exercise-card');
        const searchTerm = query.toLowerCase();

        cards.forEach(card => {
            const name = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterExercisesByCategory(category) {
        const cards = document.querySelectorAll('.exercise-card');

        cards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    showExerciseDetails(exercise) {
        const modal = document.getElementById('exercise-modal');
        const modalBody = document.getElementById('exercise-modal-body');
        
        if (!modal || !modalBody) return;

        modalBody.innerHTML = `
            <div class="exercise-detail">
                <h2>${exercise.name}</h2>
                <div class="exercise-info">
                    <div class="info-item">
                        <strong>Category:</strong> ${Utils.capitalize(exercise.category)}
                    </div>
                    <div class="info-item">
                        <strong>Difficulty:</strong> ${Utils.capitalize(exercise.difficulty)}
                    </div>
                    <div class="info-item">
                        <strong>Equipment:</strong> ${Utils.capitalize(exercise.equipment)}
                    </div>
                    <div class="info-item">
                        <strong>Calories/min:</strong> ${exercise.caloriesPerMinute}
                    </div>
                </div>
                
                <div class="exercise-description">
                    <h3>Description</h3>
                    <p>${exercise.description}</p>
                </div>
                
                <div class="exercise-instructions">
                    <h3>Instructions</h3>
                    <ol>
                        ${exercise.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                    </ol>
                </div>
                
                <div class="exercise-muscles">
                    <h3>Target Muscles</h3>
                    <div class="muscle-tags">
                        ${exercise.muscles.map(muscle => `<span class="muscle-tag">${Utils.capitalize(muscle)}</span>`).join('')}
                    </div>
                </div>
                
                <div class="exercise-actions">
                    <button class="btn-primary" onclick="workoutManager.addExerciseToWorkout('${exercise.id}')">
                        <i class="fas fa-plus"></i>
                        Add to Workout
                    </button>
                </div>
            </div>
        `;

        modal.style.display = 'block';
    }

    addExerciseToWorkout(exerciseId) {
        const exercise = this.exercises.find(ex => ex.id === exerciseId);
        if (!exercise) return;

        // Show input modal for sets/reps
        this.showExerciseInputModal(exercise);
    }

    showExerciseInputModal(exercise) {
        const modal = document.getElementById('exercise-modal');
        const modalBody = document.getElementById('exercise-modal-body');
        
        modalBody.innerHTML = `
            <div class="exercise-input">
                <h2>Add ${exercise.name}</h2>
                <form id="exercise-form">
                    <div class="form-group">
                        <label for="sets">Sets:</label>
                        <input type="number" id="sets" min="1" max="10" value="3" required>
                    </div>
                    <div class="form-group">
                        <label for="reps">Reps (or duration in seconds):</label>
                        <input type="number" id="reps" min="1" value="10" required>
                    </div>
                    <div class="form-group">
                        <label for="weight">Weight (kg) - Optional:</label>
                        <input type="number" id="weight" min="0" step="0.5" placeholder="0">
                    </div>
                    <div class="form-group">
                        <label for="rest">Rest between sets (seconds):</label>
                        <input type="number" id="rest" min="0" value="60">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">
                            <i class="fas fa-plus"></i>
                            Add Exercise
                        </button>
                        <button type="button" class="btn-secondary" onclick="document.getElementById('exercise-modal').style.display='none'">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        `;

        const form = document.getElementById('exercise-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const workoutExercise = {
                id: Utils.generateId(),
                exerciseId: exercise.id,
                name: exercise.name,
                category: exercise.category,
                sets: parseInt(document.getElementById('sets').value),
                reps: parseInt(document.getElementById('reps').value),
                weight: parseFloat(document.getElementById('weight').value) || 0,
                restTime: parseInt(document.getElementById('rest').value),
                completed: false,
                caloriesPerMinute: exercise.caloriesPerMinute
            };

            this.currentWorkout.push(workoutExercise);
            this.updateCurrentWorkoutDisplay();
            this.saveCurrentWorkout();
            
            modal.style.display = 'none';
            Utils.showToast(`${exercise.name} added to workout!`, 'success');
        });
    }

    loadCurrentWorkout() {
        const saved = workoutData.getCurrentWorkout();
        if (saved) {
            this.currentWorkout = saved.exercises || [];
        }
        this.updateCurrentWorkoutDisplay();
    }

    updateCurrentWorkoutDisplay() {
        const container = document.getElementById('current-workout-exercises');
        if (!container) return;

        if (this.currentWorkout.length === 0) {
            container.innerHTML = `
                <div class="empty-workout">
                    <i class="fas fa-plus-circle"></i>
                    <p>Add exercises to start your workout</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.currentWorkout.map(exercise => `
            <div class="workout-exercise" data-id="${exercise.id}">
                <div class="exercise-info">
                    <h4>${exercise.name}</h4>
                    <div class="exercise-details">
                        ${exercise.sets} sets × ${exercise.reps} reps
                        ${exercise.weight > 0 ? ` @ ${exercise.weight}kg` : ''}
                        ${exercise.restTime > 0 ? ` • ${exercise.restTime}s rest` : ''}
                    </div>
                </div>
                <div class="exercise-actions">
                    <button class="exercise-action-btn edit" onclick="workoutManager.editExercise('${exercise.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="exercise-action-btn delete" onclick="workoutManager.removeExercise('${exercise.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    editExercise(exerciseId) {
        const exercise = this.currentWorkout.find(ex => ex.id === exerciseId);
        if (!exercise) return;

        const originalExercise = this.exercises.find(ex => ex.id === exercise.exerciseId);
        if (!originalExercise) return;

        // Show edit modal with current values
        const modal = document.getElementById('exercise-modal');
        const modalBody = document.getElementById('exercise-modal-body');
        
        modalBody.innerHTML = `
            <div class="exercise-input">
                <h2>Edit ${exercise.name}</h2>
                <form id="exercise-edit-form">
                    <div class="form-group">
                        <label for="edit-sets">Sets:</label>
                        <input type="number" id="edit-sets" min="1" max="10" value="${exercise.sets}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-reps">Reps (or duration in seconds):</label>
                        <input type="number" id="edit-reps" min="1" value="${exercise.reps}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-weight">Weight (kg) - Optional:</label>
                        <input type="number" id="edit-weight" min="0" step="0.5" value="${exercise.weight}">
                    </div>
                    <div class="form-group">
                        <label for="edit-rest">Rest between sets (seconds):</label>
                        <input type="number" id="edit-rest" min="0" value="${exercise.restTime}">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">
                            <i class="fas fa-save"></i>
                            Save Changes
                        </button>
                        <button type="button" class="btn-secondary" onclick="document.getElementById('exercise-modal').style.display='none'">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        `;

        const form = document.getElementById('exercise-edit-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            exercise.sets = parseInt(document.getElementById('edit-sets').value);
            exercise.reps = parseInt(document.getElementById('edit-reps').value);
            exercise.weight = parseFloat(document.getElementById('edit-weight').value) || 0;
            exercise.restTime = parseInt(document.getElementById('edit-rest').value);

            this.updateCurrentWorkoutDisplay();
            this.saveCurrentWorkout();
            
            modal.style.display = 'none';
            Utils.showToast('Exercise updated!', 'success');
        });

        modal.style.display = 'block';
    }

    removeExercise(exerciseId) {
        this.currentWorkout = this.currentWorkout.filter(ex => ex.id !== exerciseId);
        this.updateCurrentWorkoutDisplay();
        this.saveCurrentWorkout();
        Utils.showToast('Exercise removed from workout', 'info');
    }

    saveCurrentWorkout() {
        workoutData.setCurrentWorkout({
            exercises: this.currentWorkout,
            startTime: this.timer.seconds > 0 ? new Date().toISOString() : null
        });
    }

    loadWorkoutHistory() {
        const container = document.getElementById('workout-history');
        if (!container) return;

        const workouts = workoutData.getWorkouts().slice(0, 10); // Show last 10 workouts

        if (workouts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <p>No workout history yet. Complete your first workout!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = workouts.map(workout => `
            <div class="history-item">
                <div class="history-header">
                    <span class="history-date">${Utils.formatRelativeTime(workout.createdAt)}</span>
                    <span class="history-duration">${workout.duration ? Utils.formatTime(workout.duration) : 'N/A'}</span>
                </div>
                <div class="history-exercises">
                    ${workout.exercises?.length || 0} exercises • ${workout.caloriesBurned || 0} calories burned
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Modal close functionality
        const modal = document.getElementById('exercise-modal');
        const closeBtn = modal?.querySelector('.modal-close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    }
}

// Global workout functions
window.saveWorkout = function() {
    if (workoutManager.currentWorkout.length === 0) {
        Utils.showToast('Add exercises to your workout first!', 'warning');
        return;
    }

    const duration = workoutManager.timer.seconds;
    const totalCalories = workoutManager.currentWorkout.reduce((sum, exercise) => {
        const exerciseCalories = (exercise.caloriesPerMinute * duration) / 60;
        return sum + exerciseCalories;
    }, 0);

    const workout = {
        exercises: [...workoutManager.currentWorkout],
        duration: duration,
        caloriesBurned: Math.round(totalCalories),
        completedAt: new Date().toISOString()
    };

    workoutData.addWorkout(workout);
    
    // Update user stats
    const stats = achievementData.getUserStats();
    achievementData.updateUserStats({
        totalWorkouts: stats.totalWorkouts + 1,
        totalCaloriesBurned: stats.totalCaloriesBurned + workout.caloriesBurned,
        currentStreak: stats.currentStreak + 1
    });

    // Check for achievements
    achievementData.checkAchievements();

    // Clear current workout
    workoutManager.currentWorkout = [];
    workoutManager.resetTimer();
    workoutData.clearCurrentWorkout();
    workoutManager.updateCurrentWorkoutDisplay();
    workoutManager.loadWorkoutHistory();

    // Dispatch event for dashboard update
    document.dispatchEvent(new CustomEvent('workoutAdded'));

    Utils.showToast('Workout saved successfully!', 'success');
};

window.clearWorkout = function() {
    if (workoutManager.currentWorkout.length === 0) {
        Utils.showToast('Workout is already empty!', 'info');
        return;
    }

    if (confirm('Are you sure you want to clear your current workout?')) {
        workoutManager.currentWorkout = [];
        workoutManager.resetTimer();
        workoutData.clearCurrentWorkout();
        workoutManager.updateCurrentWorkoutDisplay();
        Utils.showToast('Workout cleared', 'info');
    }
};

// Initialize workout manager
document.addEventListener('DOMContentLoaded', () => {
    window.workoutManager = new WorkoutManager();
});