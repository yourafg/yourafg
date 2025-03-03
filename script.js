const n = 19
const rots = [
  { ry: 270, a:0.5 },
  { ry: 0,   a:0.85 },
  { ry: 90,  a:0.4 },
  { ry: 180, a:0.0 }
]

window.onload = window.onresize = ()=> {
  const h = n*56
}

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('matrix');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const purple = '#8B65E4';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    let frameCount = 0;

    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }

    function drawMatrix() {
        frameCount++;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = purple;
        ctx.font = fontSize + 'px monospace';
        ctx.shadowBlur = 8;
        ctx.shadowColor = purple;

        for (let i = 0; i < drops.length; i++) {
            const text = characters[Math.floor(Math.random() * characters.length)];

            const waveOffset = Math.sin(frameCount * 0.02 + i * 0.1) * 2;

            ctx.fillText(text, i * fontSize + waveOffset, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i] += 0.5 + Math.sin(frameCount * 0.01 + i) * 0.2;
        }

        requestAnimationFrame(drawMatrix);
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const newColumns = canvas.width / fontSize;
        drops.length = 0;
        for (let i = 0; i < newColumns; i++) {
            drops[i] = Math.random() * -100;
        }
    });

    requestAnimationFrame(drawMatrix);

    const card = document.querySelector('.card');
    const cardContainer = document.querySelector('.card-container');

    const maxTilt = 15;
    const maxRotate = 5;
    let isFlipped = false;
    let lastX = 0;
    let lastY = 0;
    let currentX = 0;
    let currentY = 0;

    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    document.addEventListener('mousemove', (e) => {
        const cardRect = cardContainer.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;

        const deltaX = e.clientX - cardCenterX;
        const deltaY = e.clientY - cardCenterY;

        const xPercent = (deltaX / window.innerWidth) * 2;
        const yPercent = (deltaY / window.innerHeight) * 2;

        lastX = xPercent * maxTilt;
        lastY = yPercent * -maxTilt;
    });

    function animate() {
        currentX = lerp(currentX, lastX, 0.1);
        currentY = lerp(currentY, lastY, 0.1);
        
        const rotate = currentX * (maxRotate / maxTilt);

        if (!isFlipped) {
            card.style.transform = `rotateX(${currentY}deg) rotateY(${currentX}deg) rotate(${rotate}deg)`;
        } else {
            card.style.transform = `rotateY(180deg) rotateX(${-currentY}deg) rotateY(${-currentX}deg) rotate(${-rotate}deg)`;
        }

        requestAnimationFrame(animate);
    }

    animate();

    card.addEventListener('click', function() {
        isFlipped = !isFlipped;
        card.style.transition = 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        if (isFlipped) {
            this.classList.add('flipped');
            this.style.transform = 'rotateY(180deg)';
        } else {
            this.classList.remove('flipped');
            this.style.transform = 'rotateY(0deg)';
        }

        setTimeout(() => {
            card.style.transition = 'none';
        }, 700);
    });

    card.addEventListener('mouseenter', function() {
        const hint = this.querySelector('.click-hint');
        if (hint) {
            hint.style.opacity = '1';
        }
    });

    card.addEventListener('mouseleave', function() {
        const hint = this.querySelector('.click-hint');
        if (hint) {
            hint.style.opacity = '0';
        }
    });
});