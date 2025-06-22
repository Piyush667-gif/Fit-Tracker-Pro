// Environment Monitoring System
class EnvironmentManager {
    constructor() {
        this.weatherData = null;
        this.airQualityData = null;
        this.location = { lat: 37.7749, lon: -122.4194 }; // Default to San Francisco
        this.init();
    }

    init() {
        this.loadCurrentWeather();
        this.loadAirQuality();
        this.loadForecast();
        this.generateActivityRecommendations();
        this.setupLocationDetection();
    }

    setupLocationDetection() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.location = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    };
                    this.loadCurrentWeather();
                    this.loadAirQuality();
                },
                (error) => {
                    console.log('Location access denied, using default location');
                    // Continue with default location
                }
            );
        }
    }

    loadCurrentWeather() {
        // Simulate weather data (in a real app, this would be an API call)
        this.weatherData = this.generateMockWeatherData();
        this.displayCurrentWeather();
    }

    generateMockWeatherData() {
        const conditions = [
            { icon: 'fas fa-sun', description: 'sunny', temp: 24 },
            { icon: 'fas fa-cloud-sun', description: 'partly cloudy', temp: 22 },
            { icon: 'fas fa-cloud', description: 'cloudy', temp: 18 },
            { icon: 'fas fa-cloud-rain', description: 'rainy', temp: 16 }
        ];

        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        
        return {
            temperature: condition.temp + Math.floor(Math.random() * 6) - 3,
            description: condition.description,
            icon: condition.icon,
            humidity: 40 + Math.floor(Math.random() * 30),
            windSpeed: 5 + Math.floor(Math.random() * 15),
            visibility: 8 + Math.floor(Math.random() * 5),
            feelsLike: condition.temp + Math.floor(Math.random() * 4) - 2,
            location: 'San Francisco, CA'
        };
    }

    displayCurrentWeather() {
        const container = document.getElementById('current-weather');
        if (!container) return;

        const weather = this.weatherData;
        
        container.innerHTML = `
            <div class="weather-main">
                <div class="weather-icon">
                    <i class="${weather.icon}"></i>
                </div>
                <div class="weather-info">
                    <div class="temperature">${weather.temperature}°C</div>
                    <div class="description">${Utils.capitalize(weather.description)}</div>
                    <div class="location">${weather.location}</div>
                </div>
            </div>
            
            <div class="weather-details">
                <div class="detail-item">
                    <i class="fas fa-eye"></i>
                    <span>Visibility: ${weather.visibility}km</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-tint"></i>
                    <span>Humidity: ${weather.humidity}%</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-wind"></i>
                    <span>Wind: ${weather.windSpeed} km/h</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-thermometer-half"></i>
                    <span>Feels like: ${weather.feelsLike}°C</span>
                </div>
            </div>
        `;

        // Add weather animation
        this.animateWeatherIcon();
    }

    animateWeatherIcon() {
        const icon = document.querySelector('.weather-icon i');
        if (!icon) return;

        // Add pulsing animation for sun
        if (icon.classList.contains('fa-sun')) {
            icon.style.animation = 'weatherFloat 3s ease-in-out infinite, sunGlow 2s ease-in-out infinite alternate';
        }
    }

    loadAirQuality() {
        // Simulate air quality data
        this.airQualityData = this.generateMockAirQualityData();
        this.displayAirQuality();
    }

    generateMockAirQualityData() {
        const aqi = 20 + Math.floor(Math.random() * 80); // AQI between 20-100
        
        return {
            aqi: aqi,
            category: this.getAQICategory(aqi),
            pollutants: {
                pm25: 8 + Math.floor(Math.random() * 20),
                pm10: 15 + Math.floor(Math.random() * 25),
                o3: 40 + Math.floor(Math.random() * 40),
                no2: 10 + Math.floor(Math.random() * 30),
                so2: 5 + Math.floor(Math.random() * 15)
            }
        };
    }

    getAQICategory(aqi) {
        if (aqi <= 50) return { name: 'Good', class: 'good' };
        if (aqi <= 100) return { name: 'Moderate', class: 'moderate' };
        if (aqi <= 150) return { name: 'Unhealthy for Sensitive Groups', class: 'unhealthy-sensitive' };
        if (aqi <= 200) return { name: 'Unhealthy', class: 'unhealthy' };
        if (aqi <= 300) return { name: 'Very Unhealthy', class: 'very-unhealthy' };
        return { name: 'Hazardous', class: 'hazardous' };
    }

    displayAirQuality() {
        const aqiDisplay = document.querySelector('.aqi-value');
        const aqiLabel = document.querySelector('.aqi-label');
        const aqiDetails = document.querySelector('.aqi-details');
        
        if (!aqiDisplay || !aqiLabel || !aqiDetails) return;

        const aq = this.airQualityData;
        
        // Update AQI display
        aqiDisplay.textContent = aq.aqi;
        aqiDisplay.className = `aqi-value ${aq.category.class}`;
        aqiLabel.textContent = aq.category.name;

        // Update pollutant details
        aqiDetails.innerHTML = `
            <div class="aqi-item">
                <span class="pollutant">PM2.5</span>
                <div class="pollutant-bar">
                    <div class="pollutant-fill" style="width: ${Math.min((aq.pollutants.pm25 / 50) * 100, 100)}%"></div>
                </div>
                <span class="pollutant-value">${aq.pollutants.pm25} µg/m³</span>
            </div>
            
            <div class="aqi-item">
                <span class="pollutant">PM10</span>
                <div class="pollutant-bar">
                    <div class="pollutant-fill" style="width: ${Math.min((aq.pollutants.pm10 / 100) * 100, 100)}%"></div>
                </div>
                <span class="pollutant-value">${aq.pollutants.pm10} µg/m³</span>
            </div>
            
            <div class="aqi-item">
                <span class="pollutant">O3</span>
                <div class="pollutant-bar">
                    <div class="pollutant-fill" style="width: ${Math.min((aq.pollutants.o3 / 150) * 100, 100)}%"></div>
                </div>
                <span class="pollutant-value">${aq.pollutants.o3} µg/m³</span>
            </div>
        `;

        // Animate the bars
        setTimeout(() => {
            const fills = document.querySelectorAll('.pollutant-fill');
            fills.forEach(fill => {
                fill.style.transition = 'width 1s ease-out';
            });
        }, 100);
    }

    generateActivityRecommendations() {
        const weather = this.weatherData;
        const airQuality = this.airQualityData;
        
        const recommendations = this.calculateRecommendations(weather, airQuality);
        this.displayRecommendations(recommendations);
    }

    calculateRecommendations(weather, airQuality) {
        const recommendations = [];

        // Running recommendation
        let runningStatus = 'recommended';
        let runningReason = 'Perfect conditions for running outdoors';
        
        if (weather.temperature < 5 || weather.temperature > 35) {
            runningStatus = 'caution';
            runningReason = 'Extreme temperature - consider indoor alternatives';
        }
        if (weather.description.includes('rain')) {
            runningStatus = 'not-recommended';
            runningReason = 'Rainy conditions - not safe for outdoor running';
        }
        if (airQuality.aqi > 100) {
            runningStatus = 'caution';
            runningReason = 'Air quality concerns - limit outdoor exposure';
        }

        recommendations.push({
            activity: 'Outdoor Running',
            icon: 'fas fa-running',
            status: runningStatus,
            reason: runningReason
        });

        // Cycling recommendation
        let cyclingStatus = 'recommended';
        let cyclingReason = 'Great weather for bike rides';
        
        if (weather.windSpeed > 20) {
            cyclingStatus = 'caution';
            cyclingReason = 'Strong winds - be extra careful';
        }
        if (weather.description.includes('rain')) {
            cyclingStatus = 'not-recommended';
            cyclingReason = 'Wet roads are dangerous for cycling';
        }

        recommendations.push({
            activity: 'Cycling',
            icon: 'fas fa-bicycle',
            status: cyclingStatus,
            reason: cyclingReason
        });

        // Hiking recommendation
        let hikingStatus = 'recommended';
        let hikingReason = 'Perfect hiking weather';
        
        if (weather.visibility < 5) {
            hikingStatus = 'caution';
            hikingReason = 'Low visibility - check trail conditions first';
        }
        if (weather.description.includes('rain') || weather.windSpeed > 25) {
            hikingStatus = 'not-recommended';
            hikingReason = 'Weather conditions not suitable for hiking';
        }

        recommendations.push({
            activity: 'Hiking',
            icon: 'fas fa-hiking',
            status: hikingStatus,
            reason: hikingReason
        });

        return recommendations;
    }

    displayRecommendations(recommendations) {
        const container = document.querySelector('.recommendations-grid');
        if (!container) return;

        container.innerHTML = recommendations.map(rec => `
            <div class="recommendation-card ${rec.status}">
                <div class="rec-icon">
                    <i class="${rec.icon}"></i>
                </div>
                <h3>${rec.activity}</h3>
                <p>${rec.reason}</p>
                <div class="rec-status">
                    <i class="fas fa-${this.getStatusIcon(rec.status)}"></i>
                    <span>${Utils.capitalize(rec.status.replace('-', ' '))}</span>
                </div>
            </div>
        `).join('');
    }

    getStatusIcon(status) {
        switch (status) {
            case 'recommended': return 'check-circle';
            case 'caution': return 'exclamation-triangle';
            case 'not-recommended': return 'times-circle';
            default: return 'question-circle';
        }
    }

    loadForecast() {
        const forecast = this.generateMockForecast();
        this.displayForecast(forecast);
    }

    generateMockForecast() {
        const days = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri'];
        const conditions = [
            { icon: 'fas fa-sun', desc: 'sunny' },
            { icon: 'fas fa-cloud-sun', desc: 'partly cloudy' },
            { icon: 'fas fa-cloud', desc: 'cloudy' },
            { icon: 'fas fa-cloud-rain', desc: 'light rain' }
        ];

        return days.map((day, index) => {
            const condition = conditions[Math.floor(Math.random() * conditions.length)];
            const baseTemp = 20 + Math.floor(Math.random() * 10);
            
            return {
                day: day,
                icon: condition.icon,
                description: condition.desc,
                high: baseTemp + Math.floor(Math.random() * 5),
                low: baseTemp - Math.floor(Math.random() * 8)
            };
        });
    }

    displayForecast(forecast) {
        const container = document.getElementById('forecast-grid');
        if (!container) return;

        container.innerHTML = forecast.map((day, index) => `
            <div class="forecast-item" style="animation-delay: ${index * 0.1}s">
                <div class="forecast-day">${day.day}</div>
                <div class="forecast-icon">
                    <i class="${day.icon}"></i>
                </div>
                <div class="forecast-temps">
                    <span class="temp-high">${day.high}°</span>
                    <span class="temp-low">${day.low}°</span>
                </div>
                <div class="forecast-desc">${day.description}</div>
            </div>
        `).join('');

        // Add entrance animation
        const items = container.querySelectorAll('.forecast-item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease-out';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Refresh all environment data
    refreshEnvironmentData() {
        Utils.showToast('Refreshing environment data...', 'info');
        
        setTimeout(() => {
            this.loadCurrentWeather();
            this.loadAirQuality();
            this.loadForecast();
            this.generateActivityRecommendations();
            
            Utils.showToast('Environment data updated!', 'success');
        }, 1000);
    }

    // Get weather alerts
    getWeatherAlerts() {
        const alerts = [];
        
        if (this.weatherData.temperature > 35) {
            alerts.push({
                type: 'warning',
                message: 'Extreme heat warning - stay hydrated and avoid prolonged outdoor activities'
            });
        }
        
        if (this.weatherData.temperature < 0) {
            alerts.push({
                type: 'warning',
                message: 'Freezing temperatures - dress warmly and be cautious of icy conditions'
            });
        }
        
        if (this.airQualityData.aqi > 150) {
            alerts.push({
                type: 'error',
                message: 'Poor air quality - limit outdoor activities and consider wearing a mask'
            });
        }
        
        if (this.weatherData.windSpeed > 30) {
            alerts.push({
                type: 'warning',
                message: 'High wind warning - be cautious during outdoor activities'
            });
        }

        return alerts;
    }

    // Display weather alerts
    displayWeatherAlerts() {
        const alerts = this.getWeatherAlerts();
        
        alerts.forEach(alert => {
            Utils.showToast(alert.message, alert.type, 5000);
        });
    }

    // Export environment data
    exportEnvironmentData() {
        const data = {
            weather: this.weatherData,
            airQuality: this.airQualityData,
            timestamp: new Date().toISOString(),
            location: this.location
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `environment-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize environment manager
document.addEventListener('DOMContentLoaded', () => {
    window.environmentManager = new EnvironmentManager();
    
    // Show weather alerts after a short delay
    setTimeout(() => {
        environmentManager.displayWeatherAlerts();
    }, 2000);
});