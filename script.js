document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(5, 5, 5, 0.9)';
            navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
        } else {
            navbar.style.background = 'rgba(5, 5, 5, 0.7)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Parallax Effect
    document.addEventListener('mousemove', (e) => {
        const layers = document.querySelectorAll('.parallax-layer');
        layers.forEach(layer => {
            const speed = layer.getAttribute('data-speed');
            const x = (window.innerWidth - e.pageX * speed) / 100;
            const y = (window.innerHeight - e.pageY * speed) / 100;
            layer.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
    });

    // --- Advanced Canvas Animation (Neural Waveform) ---
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: null, y: null };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.color = `rgba(${Math.random() > 0.5 ? '139, 92, 246' : '245, 158, 11'}, ${Math.random() * 0.5 + 0.1})`; // Violet or Amber
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse interaction
            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (150 - distance) / 150;
                    const directionX = forceDirectionX * force * 0.5;
                    const directionY = forceDirectionY * force * 0.5;
                    this.vx -= directionX;
                    this.vy -= directionY;
                }
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < 80; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.strokeStyle = `rgba(139, 92, 246, ${1 - distance / 150})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Waveform Animation
    let time = 0;
    function drawWave() {
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        for (let i = 0; i < width; i++) {
            ctx.lineTo(i, height / 2 + Math.sin(i * 0.01 + time) * 50 * Math.sin(i * 0.005));
        }
        ctx.strokeStyle = 'rgba(51, 112, 255, 0.1)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        for (let i = 0; i < width; i++) {
            ctx.lineTo(i, height / 2 + Math.sin(i * 0.02 + time + 2) * 30 * Math.sin(i * 0.01));
        }
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.1)';
        ctx.stroke();

        time += 0.02;
    }

    initParticles();

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw Waveform (Sound/Data)
        drawWave();

        // Draw Particles (Neural Network)
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();

        requestAnimationFrame(animate);
    }

    animate();
});
