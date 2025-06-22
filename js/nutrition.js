// Nutrition Management System
class NutritionManager {
    constructor() {
        this.currentMealType = 'breakfast';
        this.foodDatabase = this.getFoodDatabase();
        this.mealSuggestions = this.getMealSuggestions();
        this.init();
    }

    init() {
        this.loadNutritionOverview();
        this.setupMealLogging();
        this.loadMealSuggestions();
        this.loadTodaysMeals();
        this.setupEventListeners();
    }

    loadNutritionOverview() {
        const todaysMeals = nutritionData.getTodaysMeals();
        const summary = this.calculateNutritionSummary(todaysMeals);
        const goals = userData.getUserGoals();

        this.updateMacroRing(summary.calories, goals.dailyCalories);
        this.updateMacroBreakdown(summary);
    }

    calculateNutritionSummary(meals) {
        return meals.reduce((summary, meal) => {
            summary.calories += meal.calories || 0;
            summary.protein += meal.protein || 0;
            summary.carbs += meal.carbs || 0;
            summary.fat += meal.fat || 0;
            return summary;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }

    updateMacroRing(current, goal) {
        const percentage = Math.min((current / goal) * 100, 100);
        const ring = document.querySelector('.ring-progress');
        const valueElement = document.querySelector('.macro-value');
        
        if (ring && valueElement) {
            // Animate the ring
            this.animateMacroRing(ring, percentage);
            
            // Update the value with animation
            Utils.animateNumber(valueElement, 0, current, 1500);
        }
    }

    animateMacroRing(ring, percentage) {
        const degrees = (percentage / 100) * 360;
        ring.style.background = `conic-gradient(from 0deg, #3B82F6 0deg, #3B82F6 ${degrees}deg, rgba(255, 255, 255, 0.1) ${degrees}deg)`;
    }

    updateMacroBreakdown(summary) {
        const proteinBar = document.querySelector('.macro-item:nth-child(1) .macro-fill');
        const carbsBar = document.querySelector('.macro-item:nth-child(2) .macro-fill');
        const fatBar = document.querySelector('.macro-item:nth-child(3) .macro-fill');

        const proteinText = document.querySelector('.macro-item:nth-child(1) .macro-text');
        const carbsText = document.querySelector('.macro-item:nth-child(2) .macro-text');
        const fatText = document.querySelector('.macro-item:nth-child(3) .macro-text');

        // Calculate percentages based on goals
        const goals = { protein: 150, carbs: 200, fat: 65 }; // Daily goals in grams
        
        if (proteinBar && proteinText) {
            const proteinPercent = Math.min((summary.protein / goals.protein) * 100, 100);
            proteinBar.style.width = `${proteinPercent}%`;
            proteinText.textContent = `Protein: ${Math.round(summary.protein)}g`;
        }

        if (carbsBar && carbsText) {
            const carbsPercent = Math.min((summary.carbs / goals.carbs) * 100, 100);
            carbsBar.style.width = `${carbsPercent}%`;
            carbsText.textContent = `Carbs: ${Math.round(summary.carbs)}g`;
        }

        if (fatBar && fatText) {
            const fatPercent = Math.min((summary.fat / goals.fat) * 100, 100);
            fatBar.style.width = `${fatPercent}%`;
            fatText.textContent = `Fat: ${Math.round(summary.fat)}g`;
        }
    }

    setupMealLogging() {
        const mealTypeButtons = document.querySelectorAll('.meal-type-btn');
        const searchInput = document.getElementById('food-search');
        const searchButton = document.querySelector('.search-btn');

        // Setup meal type selection
        mealTypeButtons.forEach(button => {
            button.addEventListener('click', () => {
                mealTypeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.currentMealType = button.dataset.meal;
            });
        });

        // Setup food search
        if (searchInput) {
            const debouncedSearch = Utils.debounce((query) => {
                this.searchFoods(query);
            }, 300);

            searchInput.addEventListener('input', (e) => {
                if (e.target.value.length > 2) {
                    debouncedSearch(e.target.value);
                } else {
                    this.clearFoodResults();
                }
            });
        }

        if (searchButton) {
            searchButton.addEventListener('click', () => {
                const query = searchInput?.value;
                if (query && query.length > 2) {
                    this.searchFoods(query);
                }
            });
        }
    }

    getFoodDatabase() {
        return [
            {
                id: 'banana',
                name: 'Banana (medium)',
                calories: 105,
                protein: 1.3,
                carbs: 27,
                fat: 0.4,
                category: 'fruit'
            },
            {
                id: 'chicken-breast',
                name: 'Chicken Breast (100g)',
                calories: 165,
                protein: 31,
                carbs: 0,
                fat: 3.6,
                category: 'protein'
            },
            {
                id: 'brown-rice',
                name: 'Brown Rice (1 cup cooked)',
                calories: 216,
                protein: 5,
                carbs: 45,
                fat: 1.8,
                category: 'grain'
            },
            {
                id: 'broccoli',
                name: 'Broccoli (1 cup)',
                calories: 25,
                protein: 3,
                carbs: 5,
                fat: 0.3,
                category: 'vegetable'
            },
            {
                id: 'salmon',
                name: 'Salmon (100g)',
                calories: 208,
                protein: 25,
                carbs: 0,
                fat: 12,
                category: 'protein'
            },
            {
                id: 'avocado',
                name: 'Avocado (half)',
                calories: 160,
                protein: 2,
                carbs: 8.5,
                fat: 14.7,
                category: 'fruit'
            },
            {
                id: 'oatmeal',
                name: 'Oatmeal (1 cup cooked)',
                calories: 154,
                protein: 6,
                carbs: 28,
                fat: 3,
                category: 'grain'
            },
            {
                id: 'greek-yogurt',
                name: 'Greek Yogurt (1 cup)',
                calories: 130,
                protein: 23,
                carbs: 9,
                fat: 0,
                category: 'dairy'
            },
            {
                id: 'almonds',
                name: 'Almonds (1 oz)',
                calories: 164,
                protein: 6,
                carbs: 6,
                fat: 14,
                category: 'nuts'
            },
            {
                id: 'sweet-potato',
                name: 'Sweet Potato (medium)',
                calories: 112,
                protein: 2,
                carbs: 26,
                fat: 0.1,
                category: 'vegetable'
            }
        ];
    }

    searchFoods(query) {
        const results = this.foodDatabase.filter(food =>
            food.name.toLowerCase().includes(query.toLowerCase())
        );

        this.displayFoodResults(results);
    }

    displayFoodResults(foods) {
        const container = document.getElementById('food-results');
        if (!container) return;

        if (foods.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <p>No foods found. Try a different search term.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = foods.map(food => `
            <div class="food-result" data-food-id="${food.id}">
                <div class="food-info">
                    <h4>${food.name}</h4>
                    <div class="food-calories">${food.calories} calories</div>
                </div>
                <button class="add-food-btn" onclick="nutritionManager.addFoodToMeal('${food.id}')">
                    Add
                </button>
            </div>
        `).join('');
    }

    clearFoodResults() {
        const container = document.getElementById('food-results');
        if (container) {
            container.innerHTML = '';
        }
    }

    addFoodToMeal(foodId) {
        const food = this.foodDatabase.find(f => f.id === foodId);
        if (!food) return;

        const meal = {
            foodId: food.id,
            name: food.name,
            mealType: this.currentMealType,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            category: food.category,
            quantity: 1
        };

        nutritionData.addMeal(meal);
        this.loadNutritionOverview();
        this.loadTodaysMeals();
        
        // Dispatch event for dashboard update
        document.dispatchEvent(new CustomEvent('mealAdded'));

        Utils.showToast(`${food.name} added to ${this.currentMealType}!`, 'success');
        
        // Clear search
        const searchInput = document.getElementById('food-search');
        if (searchInput) {
            searchInput.value = '';
        }
        this.clearFoodResults();
    }

    getMealSuggestions() {
        return {
            breakfast: [
                {
                    name: 'Protein Power Bowl',
                    description: 'Greek yogurt with berries and granola',
                    calories: 320,
                    protein: 25,
                    carbs: 35,
                    fat: 8,
                    ingredients: ['Greek yogurt', 'Mixed berries', 'Granola', 'Honey']
                },
                {
                    name: 'Avocado Toast',
                    description: 'Whole grain toast with avocado and egg',
                    calories: 280,
                    protein: 12,
                    carbs: 25,
                    fat: 16,
                    ingredients: ['Whole grain bread', 'Avocado', 'Egg', 'Salt', 'Pepper']
                }
            ],
            lunch: [
                {
                    name: 'Chicken Quinoa Bowl',
                    description: 'Grilled chicken with quinoa and vegetables',
                    calories: 450,
                    protein: 35,
                    carbs: 40,
                    fat: 12,
                    ingredients: ['Chicken breast', 'Quinoa', 'Mixed vegetables', 'Olive oil']
                },
                {
                    name: 'Mediterranean Salad',
                    description: 'Fresh salad with feta and olive oil',
                    calories: 380,
                    protein: 15,
                    carbs: 20,
                    fat: 28,
                    ingredients: ['Mixed greens', 'Feta cheese', 'Olives', 'Tomatoes', 'Olive oil']
                }
            ],
            dinner: [
                {
                    name: 'Salmon & Sweet Potato',
                    description: 'Baked salmon with roasted sweet potato',
                    calories: 520,
                    protein: 35,
                    carbs: 45,
                    fat: 18,
                    ingredients: ['Salmon fillet', 'Sweet potato', 'Broccoli', 'Lemon']
                },
                {
                    name: 'Turkey Stir-fry',
                    description: 'Lean turkey with mixed vegetables',
                    calories: 420,
                    protein: 32,
                    carbs: 30,
                    fat: 15,
                    ingredients: ['Ground turkey', 'Mixed vegetables', 'Brown rice', 'Soy sauce']
                }
            ],
            snack: [
                {
                    name: 'Protein Smoothie',
                    description: 'Banana protein smoothie',
                    calories: 250,
                    protein: 20,
                    carbs: 25,
                    fat: 6,
                    ingredients: ['Protein powder', 'Banana', 'Almond milk', 'Spinach']
                },
                {
                    name: 'Nuts & Fruit',
                    description: 'Mixed nuts with apple slices',
                    calories: 200,
                    protein: 6,
                    carbs: 18,
                    fat: 12,
                    ingredients: ['Mixed nuts', 'Apple', 'Cinnamon']
                }
            ]
        };
    }

    loadMealSuggestions() {
        const container = document.getElementById('meal-suggestions');
        if (!container) return;

        // Get suggestions for current meal type or show variety
        const suggestions = [
            ...this.mealSuggestions.breakfast.slice(0, 1),
            ...this.mealSuggestions.lunch.slice(0, 1),
            ...this.mealSuggestions.dinner.slice(0, 1),
            ...this.mealSuggestions.snack.slice(0, 1)
        ];

        container.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-card" onclick="nutritionManager.addSuggestionToMeal('${suggestion.name}')">
                <h3>${suggestion.name}</h3>
                <p>${suggestion.description}</p>
                <div class="suggestion-macros">
                    <span>${suggestion.calories} cal</span>
                    <span>${suggestion.protein}g protein</span>
                    <span>${suggestion.carbs}g carbs</span>
                    <span>${suggestion.fat}g fat</span>
                </div>
            </div>
        `).join('');
    }

    addSuggestionToMeal(suggestionName) {
        const allSuggestions = [
            ...this.mealSuggestions.breakfast,
            ...this.mealSuggestions.lunch,
            ...this.mealSuggestions.dinner,
            ...this.mealSuggestions.snack
        ];

        const suggestion = allSuggestions.find(s => s.name === suggestionName);
        if (!suggestion) return;

        const meal = {
            foodId: Utils.generateId(),
            name: suggestion.name,
            mealType: this.currentMealType,
            calories: suggestion.calories,
            protein: suggestion.protein,
            carbs: suggestion.carbs,
            fat: suggestion.fat,
            category: 'meal',
            quantity: 1,
            ingredients: suggestion.ingredients
        };

        nutritionData.addMeal(meal);
        this.loadNutritionOverview();
        this.loadTodaysMeals();
        
        // Dispatch event for dashboard update
        document.dispatchEvent(new CustomEvent('mealAdded'));

        Utils.showToast(`${suggestion.name} added to ${this.currentMealType}!`, 'success');
    }

    loadTodaysMeals() {
        const container = document.getElementById('meals-list');
        if (!container) return;

        const todaysMeals = nutritionData.getTodaysMeals();
        
        if (todaysMeals.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-utensils"></i>
                    <p>No meals logged today. Start by adding your first meal!</p>
                </div>
            `;
            return;
        }

        // Group meals by type
        const mealsByType = todaysMeals.reduce((groups, meal) => {
            const type = meal.mealType || 'other';
            if (!groups[type]) groups[type] = [];
            groups[type].push(meal);
            return groups;
        }, {});

        container.innerHTML = Object.entries(mealsByType).map(([type, meals]) => {
            const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
            
            return `
                <div class="meal-entry">
                    <div class="meal-header">
                        <span class="meal-type">${Utils.capitalize(type)}</span>
                        <span class="meal-total">${totalCalories} calories</span>
                    </div>
                    <div class="meal-foods">
                        ${meals.map(meal => `
                            <div class="meal-food">
                                <span class="food-name">${meal.name}</span>
                                <span class="food-amount">${meal.calories} cal</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    setupEventListeners() {
        // Listen for meal type changes
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('meal-type-btn')) {
                this.currentMealType = e.target.dataset.meal;
            }
        });
    }

    // Export nutrition data
    exportNutritionData() {
        const meals = nutritionData.getMeals();
        const csvContent = this.convertToCSV(meals);
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nutrition-data-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    convertToCSV(meals) {
        const headers = ['Date', 'Meal Type', 'Food Name', 'Calories', 'Protein', 'Carbs', 'Fat'];
        const rows = meals.map(meal => [
            new Date(meal.createdAt).toLocaleDateString(),
            meal.mealType,
            meal.name,
            meal.calories,
            meal.protein,
            meal.carbs,
            meal.fat
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
}

// Initialize nutrition manager
document.addEventListener('DOMContentLoaded', () => {
    window.nutritionManager = new NutritionManager();
});