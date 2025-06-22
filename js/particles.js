// Animated Particle Background
class ParticleSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.particles = [];
        this.maxParticles = 50;
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        
        this.init();
    }

    init() {
        this.createCanvas();
        this.createParticles();
        this.animate();
        this.handleResize();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        
        this.updateCanvasSize();
        this.container.appendChild(this.canvas);
    }

    updateCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.1,
            color: this.getRandomColor()
        };
    }

    getRandomColor() {
        const colors = [
            'rgba(59, 130, 246, 0.3)',   // Blue
            'rgba(139, 92, 246, 0.3)',   // Purple
            'rgba(16, 185, 129, 0.3)',   // Green
            'rgba(245, 158, 11, 0.3)',   // Yellow
            'rgba(239, 68, 68, 0.3)'     // Red
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= this.canvas.width) {
            particle.vx *= -1;
        }
        if (particle.y <= 0 || particle.y >= this.canvas.height) {
            particle.vy *= -1;
        }

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));

        // Subtle pulsing effect
        particle.opacity += Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.002;
        particle.opacity = Math.max(0.1, Math.min(0.6, particle.opacity));
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color.replace('0.3', particle.opacity.toString());
        this.ctx.fill();

        // Add glow effect
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = particle.color;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    const opacity = (100 - distance) / 100 * 0.1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });

        // Draw connections between nearby particles
        this.drawConnections();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    handleResize() {
        window.addEventListener('resize', Utils.throttle(() => {
            this.updateCanvasSize();
            
            // Adjust particle positions for new canvas size
            this.particles.forEach(particle => {
                particle.x = Math.min(particle.x, this.canvas.width);
                particle.y = Math.min(particle.y, this.canvas.height);
            });
        }, 250));
    }

    addInteractivity() {
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Attract particles to mouse
            this.particles.forEach(particle => {
                const dx = mouseX - particle.x;
                const dy = mouseY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const force = (150 - distance) / 150 * 0.01;
                    particle.vx += (dx / distance) * force;
                    particle.vy += (dy / distance) * force;
                }
            });
        });
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Floating geometric shapes
class GeometricShapes {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.shapes = [];
        this.init();
    }

    init() {
        this.createShapes();
        this.addShapesToDOM();
    }

    createShapes() {
        const shapeTypes = ['circle', 'triangle', 'square', 'hexagon'];
        const colors = [
            'rgba(59, 130, 246, 0.1)',
            'rgba(139, 92, 246, 0.1)',
            'rgba(16, 185, 129, 0.1)',
            'rgba(245, 158, 11, 0.1)'
        ];

        for (let i = 0; i < 15; i++) {
            const shape = {
                type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
                size: Math.random() * 60 + 20,
                x: Math.random() * 100,
                y: Math.random() * 100,
                rotation: Math.random() * 360,
                duration: Math.random() * 20 + 10,
                delay: Math.random() * 5,
                color: colors[Math.floor(Math.random() * colors.length)]
            };
            this.shapes.push(shape);
        }
    }

    addShapesToDOM() {
        this.shapes.forEach((shape, index) => {
            const element = document.createElement('div');
            element.className = 'floating-shape';
            element.style.cssText = `
                position: absolute;
                width: ${shape.size}px;
                height: ${shape.size}px;
                left: ${shape.x}%;
                top: ${shape.y}%;
                background: ${shape.color};
                border-radius: ${shape.type === 'circle' ? '50%' : '0'};
                transform: rotate(${shape.rotation}deg);
                animation: float-${index} ${shape.duration}s ease-in-out infinite ${shape.delay}s,
                          rotate-${index} ${shape.duration * 2}s linear infinite;
                pointer-events: none;
                z-index: -1;
            `;

            // Add custom animations
            const style = document.createElement('style');
            style.textContent = `
                @keyframes float-${index} {
                    0%, 100% { 
                        transform: translateY(0px) rotate(${shape.rotation}deg); 
                    }
                    50% { 
                        transform: translateY(-20px) rotate(${shape.rotation + 180}deg); 
                    }
                }
                
                @keyframes rotate-${index} {
                    from { 
                        transform: rotate(${shape.rotation}deg); 
                    }
                    to { 
                        transform: rotate(${shape.rotation + 360}deg); 
                    }
                }
            `;
            document.head.appendChild(style);

            this.container.appendChild(element);
        });
    }
}

// Initialize particle system and shapes when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    const particleSystem = new ParticleSystem('particles-bg');
    particleSystem.addInteractivity();

    // Initialize geometric shapes
    const geometricShapes = new GeometricShapes('particles-bg');

    // Store references for potential cleanup
    window.particleSystem = particleSystem;
    window.geometricShapes = geometricShapes;
});