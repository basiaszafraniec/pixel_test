window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    const canvas_width = canvas.width = window.innerWidth;
    const canvas_height = canvas.height = window.innerHeight;

    class Particle {
        constructor(effect, x, y, color) {
            this.effect = effect;
            this.x = Math.random() * this.effect.width;
            this.y = Math.random() * this.effect.height;
            this.originX = Math.floor(x);
            this.originY = Math.floor(y);
            this.speedX = 0;
            this.speedY = 0;
            this.friction = 0.9;
            this.color = color;
            this.size = effect.gap + 1;
            this.ease = 0.1;
            this.distX = 0;
            this.distY = 0;
            this.distance = 0;
            this.force = 0;
            this.angle = 0;
        }
        draw(context) {
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.size, this.size)
        }
        update() {
            this.distX = this.effect.mouse.x - this.x;
            this.distY = this.effect.mouse.y - this.y;
            this.distance = (this.distX ** 2 + this.distY ** 2);
            this.force = -this.effect.mouse.radius / this.distance;

            if (this.distance < this.effect.mouse.radius) {
                this.angle = Math.atan2(this.distY, this.distX);
                this.speedX += this.force * Math.cos(this.angle);
                this.speedY += this.force * Math.sin(this.angle);
            }
            this.x += (this.speedX *= this.friction) + (this.originX - this.x) * this.ease;
            this.y += (this.speedY *= this.friction) + (this.originY - this.y) * this.ease;
        }
    }

    class Effect {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.particlesArray = [];
            this.image = document.getElementById('angler');
            this.imageX = this.width / 2 - this.image.width / 2;
            this.imageY = this.height / 2 - this.image.height / 2;
            this.gap = 3;
            this.mouse = {
                radius: 10000,
                x: undefined,
                y: undefined
            }
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            })
        }
        init(context) {
            context.drawImage(this.image, this.imageX, this.imageY, this.image.width, this.image.height)
            const pixels = context.getImageData(0, 0, canvas_width, canvas_height).data;
            for (let y = 0; y < this.height; y += this.gap) {
                for (let x = 0; x < this.width; x += this.gap) {
                    const index = (y * this.width + x) * 4;
                    const red = pixels[index];
                    const green = pixels[index + 1];
                    const blue = pixels[index + 2];
                    const alpha = pixels[index + 3];
                    const color = 'rgb(' + red + ',' + green + ',' + blue + ')';
                    if (alpha > 0) {
                        this.particlesArray.push(new Particle(this, x, y, color));
                    }
                }
            }
        }
        draw(context) {
            this.particlesArray.forEach(particle => particle.draw(context))
        }
        update() {
            this.particlesArray.forEach(particle => particle.update())
        }
    }

    const effect = new Effect(canvas_width, canvas_height);
    effect.init(ctx);


    animate();
    function animate() {
        ctx.clearRect(0, 0, canvas_width, canvas_height);
        effect.draw(ctx);
        effect.update();
        requestAnimationFrame(animate);
    }
})