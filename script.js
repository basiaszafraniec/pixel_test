window.addEventListener('load', () => {
    const canvas1 = document.getElementById('canvas1');
    const ctx = canvas1.getContext('2d');
    const canvas_width = canvas1.width = window.innerWidth;
    const canvas_height = canvas1.height = window.innerHeight;

    class Particle {
        constructor(effect, x, y, color) {
            this.effect = effect;
            this.x = Math.floor(x);
            this.y = Math.floor(y);
            this.originX = Math.floor(x);
            this.originY = Math.floor(y);
            this.color  = color;
            this.size = effect.gap;
            this.speedX = 0;
            this.speedY = 0;
        }

        draw(context) {
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.size, this.size)
        }
        update() {
            this.x += this.originX - this.x;
            this.y += this.originY - this.y;
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
            this.gap = 3 ;
        }
        init(context) {
            context.drawImage(this.image,this.imageX,this.imageY)
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

    const effect1 = new Effect(canvas_width, canvas_height);
    effect1.init(ctx);


    animate();
    function animate() {
        ctx.clearRect(0, 0, canvas_width, canvas_height);
        effect1.draw(ctx);
        effect1.update();
        requestAnimationFrame(animate);
    }
})