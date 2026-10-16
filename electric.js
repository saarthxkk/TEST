/* ═══════════════════════════════════════════════
   Electric Current Simulation — Engine
   testiiii · Class 7 · Chapter 10
   All 4 Canvas Simulations + Mini Quiz
   ═══════════════════════════════════════════════ */

// ─── GLOBALS ───
const DPR = window.devicePixelRatio || 1;

function setupHiDPI(canvas) {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * DPR;
    canvas.height = rect.height * DPR;
    const ctx = canvas.getContext('2d');
    ctx.scale(DPR, DPR);
    return { ctx, w: rect.width, h: rect.height };
}

// ═══════════════════════════════════════════════
// LAB 1: CIRCUIT BUILDER
// ═══════════════════════════════════════════════
(function() {
    const canvas = document.getElementById('circuit-canvas');
    let ctx, W, H;
    let switchOn = false;
    let resistance = 3;
    const voltage = 9;
    let electrons = [];
    let animId;
    let bulbGlow = 0;
    let time = 0;

    // Circuit path waypoints (normalized 0-1, scaled to canvas)
    function getCircuitPath() {
        return [
            // Battery top terminal → right → top wire
            { x: W * 0.5, y: H * 0.12 },
            { x: W * 0.78, y: H * 0.12 },
            // Down right side
            { x: W * 0.78, y: H * 0.5 },
            // Down to bottom right
            { x: W * 0.78, y: H * 0.82 },
            // Bottom wire (right to left, through bulb area)
            { x: W * 0.5, y: H * 0.82 },
            // Bulb position
            { x: W * 0.35, y: H * 0.82 },
            // Bottom left
            { x: W * 0.22, y: H * 0.82 },
            // Up left side
            { x: W * 0.22, y: H * 0.5 },
            // Switch location
            { x: W * 0.22, y: H * 0.3 },
            // Back to top
            { x: W * 0.22, y: H * 0.12 },
            // Top wire back to battery
            { x: W * 0.5, y: H * 0.12 },
        ];
    }

    function initElectrons() {
        electrons = [];
        const path = getCircuitPath();
        const totalLen = getPathLength(path);
        const count = 20;
        for (let i = 0; i < count; i++) {
            electrons.push({
                progress: i / count,
                speed: 0.003
            });
        }
    }

    function getPathLength(path) {
        let len = 0;
        for (let i = 0; i < path.length - 1; i++) {
            len += dist(path[i], path[i + 1]);
        }
        return len;
    }

    function dist(a, b) {
        return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
    }

    function getPositionOnPath(path, progress) {
        const totalLen = getPathLength(path);
        let targetDist = progress * totalLen;
        let accumulated = 0;
        for (let i = 0; i < path.length - 1; i++) {
            const segLen = dist(path[i], path[i + 1]);
            if (accumulated + segLen >= targetDist) {
                const t = (targetDist - accumulated) / segLen;
                return {
                    x: path[i].x + (path[i + 1].x - path[i].x) * t,
                    y: path[i].y + (path[i + 1].y - path[i].y) * t
                };
            }
            accumulated += segLen;
        }
        return path[path.length - 1];
    }

    function drawCircuit() {
        ctx.clearRect(0, 0, W, H);
        const path = getCircuitPath();
        const current = switchOn ? voltage / resistance : 0;
        const brightness = switchOn ? Math.min(1, current / 5) : 0;

        // Draw background grid
        ctx.strokeStyle = 'rgba(30, 34, 55, 0.5)';
        ctx.lineWidth = 0.5;
        const gridSize = 30;
        for (let x = 0; x < W; x += gridSize) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 0; y < H; y += gridSize) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }

        // Draw wires
        ctx.beginPath();
        ctx.strokeStyle = switchOn ? `rgba(96, 165, 250, ${0.5 + brightness * 0.5})` : 'rgba(90, 94, 120, 0.5)';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            // Draw gap for switch
            if (i === 8 && !switchOn) {
                ctx.stroke();
                ctx.beginPath();
                // Draw open switch arm
                const sx = path[8].x;
                const sy = path[8].y;
                ctx.save();
                ctx.strokeStyle = '#f97316';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(sx, sy + 15);
                ctx.lineTo(sx + 20, sy - 15);
                ctx.stroke();
                // Switch dots
                ctx.fillStyle = '#f97316';
                ctx.beginPath(); ctx.arc(sx, sy + 15, 4, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(sx, sy - 15, 4, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(90, 94, 120, 0.5)';
                ctx.lineWidth = 3;
                ctx.moveTo(path[i].x, path[i].y);
                continue;
            }
            if (i === 8 && switchOn) {
                // Closed switch
                const sx = path[8].x;
                const sy = path[8].y;
                ctx.lineTo(sx, sy);
                ctx.stroke();
                ctx.save();
                ctx.strokeStyle = '#22c55e';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(sx, sy + 15);
                ctx.lineTo(sx, sy - 15);
                ctx.stroke();
                ctx.fillStyle = '#22c55e';
                ctx.beginPath(); ctx.arc(sx, sy + 15, 4, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(sx, sy - 15, 4, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
                ctx.beginPath();
                ctx.strokeStyle = switchOn ? `rgba(96, 165, 250, ${0.5 + brightness * 0.5})` : 'rgba(90, 94, 120, 0.5)';
                ctx.lineWidth = 3;
                ctx.moveTo(path[i].x, path[i].y);
                continue;
            }
            ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();

        // Draw battery
        const bx = W * 0.5, by = H * 0.12;
        ctx.save();
        // Battery body
        ctx.fillStyle = '#1a1d2e';
        ctx.strokeStyle = switchOn ? '#60a5fa' : '#3a3e55';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(bx - 35, by - 20, 70, 40, 6);
        ctx.fill();
        ctx.stroke();
        // Battery terminals
        ctx.fillStyle = switchOn ? '#60a5fa' : '#5a5e78';
        ctx.fillRect(bx - 20, by - 8, 4, 16);  // negative (thin)
        ctx.fillRect(bx + 10, by - 12, 8, 24);  // positive (thick)
        // Labels
        ctx.fillStyle = '#8b8fa6';
        ctx.font = '10px "Space Mono"';
        ctx.textAlign = 'center';
        ctx.fillText('−', bx - 18, by + 32);
        ctx.fillText('+', bx + 14, by + 32);
        ctx.fillStyle = switchOn ? '#60a5fa' : '#5a5e78';
        ctx.font = 'bold 11px "Space Mono"';
        ctx.fillText('9V', bx, by + 4);
        ctx.restore();

        // Draw resistor (right side)
        const rx = W * 0.78, ry = H * 0.5;
        ctx.save();
        ctx.strokeStyle = switchOn ? '#fbbf24' : '#5a5e78';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const zigzagH = 30;
        const zigzagW = 8;
        const segments = 6;
        ctx.moveTo(rx, ry - zigzagH);
        for (let i = 0; i < segments; i++) {
            const dir = i % 2 === 0 ? 1 : -1;
            ctx.lineTo(rx + zigzagW * dir, ry - zigzagH + (zigzagH * 2 / segments) * (i + 0.5));
            ctx.lineTo(rx, ry - zigzagH + (zigzagH * 2 / segments) * (i + 1));
        }
        ctx.stroke();
        ctx.fillStyle = '#8b8fa6';
        ctx.font = '11px "Space Mono"';
        ctx.textAlign = 'left';
        ctx.fillText(resistance + 'Ω', rx + 16, ry + 4);
        ctx.restore();

        // Draw light bulb
        const lx = W * 0.35, ly = H * 0.82;
        ctx.save();
        if (switchOn) {
            // Glow effect
            bulbGlow += (brightness - bulbGlow) * 0.05;
            const grd = ctx.createRadialGradient(lx, ly, 0, lx, ly, 50 + bulbGlow * 40);
            grd.addColorStop(0, `rgba(251, 191, 36, ${bulbGlow * 0.8})`);
            grd.addColorStop(0.5, `rgba(251, 191, 36, ${bulbGlow * 0.3})`);
            grd.addColorStop(1, 'rgba(251, 191, 36, 0)');
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(lx, ly, 60, 0, Math.PI * 2);
            ctx.fill();
        } else {
            bulbGlow *= 0.95;
        }

        // Bulb body
        ctx.beginPath();
        ctx.arc(lx, ly - 5, 18, 0, Math.PI * 2);
        const bulbColor = switchOn
            ? `rgba(251, 191, 36, ${0.3 + brightness * 0.7})`
            : 'rgba(50, 54, 70, 0.8)';
        ctx.fillStyle = bulbColor;
        ctx.fill();
        ctx.strokeStyle = switchOn ? `rgba(251, 191, 36, ${0.5 + brightness * 0.5})` : '#3a3e55';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Bulb filament
        ctx.beginPath();
        ctx.strokeStyle = switchOn ? `rgba(255, 230, 100, ${brightness})` : '#3a3e55';
        ctx.lineWidth = 1.5;
        ctx.moveTo(lx - 5, ly + 5);
        ctx.lineTo(lx - 3, ly - 8);
        ctx.lineTo(lx, ly - 2);
        ctx.lineTo(lx + 3, ly - 8);
        ctx.lineTo(lx + 5, ly + 5);
        ctx.stroke();

        // Bulb base
        ctx.fillStyle = '#5a5e78';
        ctx.fillRect(lx - 8, ly + 12, 16, 8);
        ctx.restore();

        // Labels
        ctx.save();
        ctx.fillStyle = '#5a5e78';
        ctx.font = '10px "Space Mono"';
        ctx.textAlign = 'center';
        ctx.fillText('BATTERY', bx, by - 28);
        ctx.fillText('SWITCH', W * 0.22, H * 0.3 - 28);
        ctx.fillText('RESISTOR', W * 0.78, H * 0.5 - 40);
        ctx.fillText('BULB', lx, ly + 32);
        ctx.restore();

        // Draw electrons
        if (switchOn) {
            const speed = 0.001 + (current / 10) * 0.006;
            electrons.forEach(e => {
                e.progress += speed;
                if (e.progress >= 1) e.progress -= 1;
                const pos = getPositionOnPath(path, e.progress);

                // Electron glow
                const grd = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 8);
                grd.addColorStop(0, 'rgba(96, 165, 250, 0.9)');
                grd.addColorStop(1, 'rgba(96, 165, 250, 0)');
                ctx.fillStyle = grd;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
                ctx.fill();

                // Electron core
                ctx.fillStyle = '#60a5fa';
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
                ctx.fill();

                // Minus sign
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(pos.x - 2, pos.y - 0.5, 4, 1);
            });
        }

        // Update readouts
        const current_val = switchOn ? (voltage / resistance).toFixed(1) : '0.0';
        document.getElementById('readout-current').textContent = current_val + ' A';
        document.getElementById('readout-bulb').textContent = switchOn ? (brightness > 0.6 ? 'BRIGHT' : brightness > 0.3 ? 'DIM' : 'VERY DIM') : 'OFF';
        document.getElementById('readout-bulb').style.color = switchOn ? '#fbbf24' : '#5a5e78';

        time++;
        animId = requestAnimationFrame(drawCircuit);
    }

    function init() {
        const setup = setupHiDPI(canvas);
        ctx = setup.ctx; W = setup.w; H = setup.h;
        initElectrons();
        drawCircuit();
    }

    // Controls
    document.getElementById('btn-switch-toggle').addEventListener('click', () => {
        switchOn = !switchOn;
        document.getElementById('switch-indicator').className = 'switch-indicator ' + (switchOn ? 'on' : 'off');
        document.getElementById('switch-label').textContent = switchOn ? 'ON' : 'OFF';
        document.getElementById('btn-switch-toggle').classList.toggle('active', switchOn);
    });

    document.getElementById('resistance-slider').addEventListener('input', (e) => {
        resistance = parseInt(e.target.value);
        document.getElementById('res-value').textContent = resistance;
    });

    // Scroll button
    document.getElementById('btn-scroll-sim').addEventListener('click', () => {
        document.getElementById('sim-main').scrollIntoView({ behavior: 'smooth' });
    });

    window.addEventListener('load', init);
    window.addEventListener('resize', () => {
        cancelAnimationFrame(animId);
        init();
    });
})();


// ═══════════════════════════════════════════════
// LAB 2: HEATING EFFECT
// ═══════════════════════════════════════════════
(function() {
    const canvas = document.getElementById('heating-canvas');
    let ctx, W, H;
    let isOn = false;
    let currentLevel = 1;
    let temperature = 25;
    let targetTemp = 25;
    let particles = [];
    let animId;

    function initParticles() {
        particles = [];
        for (let i = 0; i < 60; i++) {
            particles.push({
                x: Math.random() * 200 - 100,
                y: Math.random() * 40 - 20,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                alpha: Math.random()
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // Background grid
        ctx.strokeStyle = 'rgba(30, 34, 55, 0.3)';
        ctx.lineWidth = 0.5;
        for (let x = 0; x < W; x += 30) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 0; y < H; y += 30) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }

        const cx = W / 2, cy = H / 2;
        const wireLen = W * 0.5;
        const wireY = cy;

        // Nichrome wire
        if (isOn) {
            targetTemp = 25 + currentLevel * 80;
            temperature += (targetTemp - temperature) * 0.02;
        } else {
            targetTemp = 25;
            temperature += (25 - temperature) * 0.03;
        }

        const heatFraction = Math.min(1, (temperature - 25) / 800);

        // Wire glow
        if (isOn && heatFraction > 0.05) {
            const grd = ctx.createRadialGradient(cx, wireY, 0, cx, wireY, 80 + heatFraction * 60);
            grd.addColorStop(0, `rgba(249, 115, 22, ${heatFraction * 0.5})`);
            grd.addColorStop(0.5, `rgba(239, 68, 68, ${heatFraction * 0.2})`);
            grd.addColorStop(1, 'rgba(239, 68, 68, 0)');
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(cx, wireY, 100 + heatFraction * 60, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw wire supports
        ctx.fillStyle = '#2a2d44';
        ctx.fillRect(cx - wireLen / 2 - 10, wireY - 15, 20, 30);
        ctx.fillRect(cx + wireLen / 2 - 10, wireY - 15, 20, 30);

        // Draw coiled wire
        ctx.beginPath();
        ctx.strokeStyle = isOn
            ? `hsl(${30 - heatFraction * 30}, ${80 + heatFraction * 20}%, ${40 + heatFraction * 30}%)`
            : '#5a5e78';
        ctx.lineWidth = 3;
        const coils = 20;
        const coilAmp = 8 + heatFraction * 4;
        for (let i = 0; i <= coils * 10; i++) {
            const t = i / (coils * 10);
            const x = cx - wireLen / 2 + wireLen * t;
            const y = wireY + Math.sin(t * coils * Math.PI * 2) * coilAmp;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Heat particles rising
        if (isOn && heatFraction > 0.1) {
            particles.forEach(p => {
                p.y -= (0.5 + heatFraction * 2) * (p.size / 2);
                p.x += p.vx * 0.3;
                p.alpha -= 0.005;

                if (p.y < -80 || p.alpha <= 0) {
                    p.x = (Math.random() - 0.5) * wireLen;
                    p.y = (Math.random() - 0.5) * 10;
                    p.alpha = 0.3 + Math.random() * 0.5;
                }

                ctx.fillStyle = `rgba(249, 115, 22, ${p.alpha * heatFraction})`;
                ctx.beginPath();
                ctx.arc(cx + p.x, wireY + p.y - 20, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        // Battery on left
        ctx.save();
        const bx = W * 0.1, by = cy;
        ctx.fillStyle = '#1a1d2e';
        ctx.strokeStyle = isOn ? '#f97316' : '#3a3e55';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(bx - 20, by - 30, 40, 60, 6);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = isOn ? '#f97316' : '#5a5e78';
        ctx.font = 'bold 10px "Space Mono"';
        ctx.textAlign = 'center';
        ctx.fillText('DC', bx, by + 4);
        ctx.restore();

        // Wires from battery to coil
        ctx.strokeStyle = isOn ? `rgba(249, 115, 22, 0.5)` : 'rgba(90, 94, 120, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bx + 20, by - 10);
        ctx.lineTo(cx - wireLen / 2, wireY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(bx + 20, by + 10);
        ctx.lineTo(cx - wireLen / 2, wireY + 20);
        ctx.lineTo(cx + wireLen / 2, wireY + 20);
        ctx.lineTo(cx + wireLen / 2, wireY);
        ctx.stroke();

        // Labels
        ctx.fillStyle = '#5a5e78';
        ctx.font = '10px "Space Mono"';
        ctx.textAlign = 'center';
        ctx.fillText('NICHROME WIRE', cx, wireY + 50);
        ctx.fillText('BATTERY', bx, by + 50);

        // Temperature indicator
        if (isOn) {
            ctx.fillStyle = heatFraction > 0.6 ? '#ef4444' : '#f97316';
            ctx.font = 'bold 16px "Space Mono"';
            ctx.fillText(Math.round(temperature) + '°C', cx, wireY - 40);
        }

        // Update UI
        document.getElementById('temp-value').textContent = Math.round(temperature) + '°C';
        document.getElementById('temp-value').style.color =
            temperature > 500 ? '#ef4444' : temperature > 200 ? '#f97316' : '#fbbf24';

        animId = requestAnimationFrame(draw);
    }

    function init() {
        const setup = setupHiDPI(canvas);
        ctx = setup.ctx; W = setup.w; H = setup.h;
        initParticles();
        draw();
    }

    document.getElementById('btn-heating-toggle').addEventListener('click', () => {
        isOn = !isOn;
        document.getElementById('heating-switch-ind').className = 'switch-indicator ' + (isOn ? 'on' : 'off');
        document.getElementById('heating-switch-label').textContent = isOn ? 'ON' : 'OFF';
        document.getElementById('btn-heating-toggle').classList.toggle('active', isOn);
    });

    document.getElementById('heating-slider').addEventListener('input', (e) => {
        currentLevel = parseInt(e.target.value);
        document.getElementById('heating-value').textContent = currentLevel;
    });

    window.addEventListener('load', init);
    window.addEventListener('resize', () => { cancelAnimationFrame(animId); init(); });
})();


// ═══════════════════════════════════════════════
// LAB 3: MAGNETIC EFFECT (ELECTROMAGNET)
// ═══════════════════════════════════════════════
(function() {
    const canvas = document.getElementById('magnet-canvas');
    let ctx, W, H;
    let isOn = false;
    let coilTurns = 10;
    let fieldStrength = 0;
    let ironPieces = [];
    let animId;

    function initIronPieces() {
        ironPieces = [];
        for (let i = 0; i < 12; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 120 + Math.random() * 100;
            ironPieces.push({
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist,
                origX: Math.cos(angle) * dist,
                origY: Math.sin(angle) * dist,
                rotation: Math.random() * Math.PI,
                size: 6 + Math.random() * 6,
                attracted: false
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        const cx = W / 2, cy = H / 2;

        // Background grid
        ctx.strokeStyle = 'rgba(30, 34, 55, 0.3)';
        ctx.lineWidth = 0.5;
        for (let x = 0; x < W; x += 30) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 0; y < H; y += 30) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }

        if (isOn) {
            fieldStrength += (coilTurns / 30 - fieldStrength) * 0.03;
        } else {
            fieldStrength *= 0.97;
        }

        // Magnetic field lines
        if (fieldStrength > 0.05) {
            const lineCount = Math.floor(4 + coilTurns / 5);
            for (let i = 0; i < lineCount; i++) {
                const spread = 20 + (i * 20);
                ctx.strokeStyle = `rgba(168, 85, 247, ${fieldStrength * 0.3 * (1 - i / lineCount)})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                // Draw curved field lines
                ctx.ellipse(cx, cy, 50 + spread, 20 + spread * 0.6, 0, 0, Math.PI * 2);
                ctx.stroke();
            }

            // N and S pole labels
            ctx.fillStyle = `rgba(168, 85, 247, ${fieldStrength})`;
            ctx.font = 'bold 14px "Space Mono"';
            ctx.textAlign = 'center';
            ctx.fillText('N', cx - 80, cy - 60);
            ctx.fillText('S', cx + 80, cy - 60);
        }

        // Iron nail
        ctx.save();
        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = isOn ? `rgba(168, 85, 247, ${fieldStrength})` : '#3a3e55';
        ctx.lineWidth = 2;
        // Nail body
        ctx.beginPath();
        ctx.roundRect(cx - 60, cy - 8, 120, 16, 3);
        ctx.fill(); ctx.stroke();
        // Nail head
        ctx.beginPath();
        ctx.roundRect(cx - 70, cy - 12, 14, 24, 2);
        ctx.fill(); ctx.stroke();
        // Nail point
        ctx.beginPath();
        ctx.moveTo(cx + 60, cy - 8);
        ctx.lineTo(cx + 75, cy);
        ctx.lineTo(cx + 60, cy + 8);
        ctx.fill();
        ctx.restore();

        // Draw coil around nail
        ctx.save();
        const coilW = 90;
        const startX = cx - coilW / 2;
        for (let i = 0; i < coilTurns; i++) {
            const t = i / coilTurns;
            const x = startX + coilW * t;
            ctx.strokeStyle = isOn
                ? `rgba(168, 85, 247, ${0.5 + fieldStrength * 0.5})`
                : 'rgba(90, 94, 120, 0.4)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(x, cy, 6, 22, 0, -Math.PI * 0.3, Math.PI * 1.3);
            ctx.stroke();
        }
        ctx.restore();

        // Battery
        const bx = W * 0.12, by = cy;
        ctx.fillStyle = '#1a1d2e';
        ctx.strokeStyle = isOn ? '#a855f7' : '#3a3e55';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(bx - 20, by - 28, 40, 56, 6);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = isOn ? '#a855f7' : '#5a5e78';
        ctx.font = 'bold 10px "Space Mono"';
        ctx.textAlign = 'center';
        ctx.fillText('DC', bx, by + 4);

        // Wires
        ctx.strokeStyle = isOn ? 'rgba(168, 85, 247, 0.5)' : 'rgba(90, 94, 120, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bx + 20, by - 12);
        ctx.lineTo(startX, cy - 22);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(bx + 20, by + 12);
        ctx.lineTo(startX, cy + 30);
        ctx.lineTo(startX + coilW, cy + 30);
        ctx.lineTo(startX + coilW, cy + 22);
        ctx.stroke();

        // Iron pieces
        ironPieces.forEach(p => {
            const targetX = isOn ? p.origX * (1 - fieldStrength * 0.7) : p.origX;
            const targetY = isOn ? p.origY * (1 - fieldStrength * 0.7) : p.origY;
            p.x += (targetX - p.x) * 0.04;
            p.y += (targetY - p.y) * 0.04;

            if (isOn) {
                p.rotation += (Math.atan2(p.y, p.x) - p.rotation) * 0.05;
            }

            ctx.save();
            ctx.translate(cx + p.x, cy + p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = isOn && fieldStrength > 0.3 ? '#94a3b8' : '#475569';
            ctx.strokeStyle = isOn && fieldStrength > 0.3 ? 'rgba(168, 85, 247, 0.4)' : '#334155';
            ctx.lineWidth = 1;

            // Draw small iron filing
            ctx.beginPath();
            ctx.roundRect(-p.size / 2, -2, p.size, 4, 1);
            ctx.fill(); ctx.stroke();
            ctx.restore();
        });

        // Labels
        ctx.fillStyle = '#5a5e78';
        ctx.font = '10px "Space Mono"';
        ctx.textAlign = 'center';
        ctx.fillText('ELECTROMAGNET', cx, cy + 55);
        ctx.fillText('BATTERY', bx, by + 50);
        ctx.fillText('IRON FILINGS', cx + 130, cy + 100);

        animId = requestAnimationFrame(draw);
    }

    function init() {
        const setup = setupHiDPI(canvas);
        ctx = setup.ctx; W = setup.w; H = setup.h;
        initIronPieces();
        draw();
    }

    document.getElementById('btn-magnet-toggle').addEventListener('click', () => {
        isOn = !isOn;
        document.getElementById('magnet-switch-ind').className = 'switch-indicator ' + (isOn ? 'on' : 'off');
        document.getElementById('magnet-switch-label').textContent = isOn ? 'ON' : 'OFF';
        document.getElementById('btn-magnet-toggle').classList.toggle('active', isOn);
    });

    document.getElementById('coil-slider').addEventListener('input', (e) => {
        coilTurns = parseInt(e.target.value);
        document.getElementById('coil-value').textContent = coilTurns;
    });

    window.addEventListener('load', init);
    window.addEventListener('resize', () => { cancelAnimationFrame(animId); init(); });
})();


// ═══════════════════════════════════════════════
// LAB 4: CHEMICAL EFFECT (ELECTROPLATING)
// ═══════════════════════════════════════════════
(function() {
    const canvas = document.getElementById('chemical-canvas');
    let ctx, W, H;
    let isOn = false;
    let elapsedTime = 0;
    let coating = 0;
    let bubbles = [];
    let ions = [];
    let animId;
    let lastTime = 0;

    function initBubbles() {
        bubbles = [];
        for (let i = 0; i < 30; i++) {
            bubbles.push({
                x: Math.random() * 40 - 20,
                y: Math.random() * 100,
                size: 1 + Math.random() * 3,
                speed: 0.3 + Math.random() * 0.8,
                alpha: 0.2 + Math.random() * 0.4,
                electrode: Math.random() > 0.5 ? 'left' : 'right'
            });
        }
    }

    function initIons() {
        ions = [];
        for (let i = 0; i < 15; i++) {
            ions.push({
                x: Math.random() * 200 - 100,
                y: Math.random() * 120 - 60,
                targetX: 0,
                vx: 0,
                size: 3 + Math.random() * 2,
                alpha: 0.4 + Math.random() * 0.4,
                active: false
            });
        }
    }

    function draw(timestamp) {
        ctx.clearRect(0, 0, W, H);

        const cx = W / 2, cy = H / 2;
        const beakerW = W * 0.5;
        const beakerH = H * 0.55;
        const beakerX = cx - beakerW / 2;
        const beakerY = cy - beakerH / 2 + 20;

        // Background grid
        ctx.strokeStyle = 'rgba(30, 34, 55, 0.3)';
        ctx.lineWidth = 0.5;
        for (let x = 0; x < W; x += 30) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 0; y < H; y += 30) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }

        if (isOn) {
            if (timestamp - lastTime > 1000) {
                elapsedTime++;
                lastTime = timestamp;
            }
            coating = Math.min(100, coating + 0.08);
        }

        // Draw beaker
        ctx.save();
        // Solution (blue-green liquid)
        const liquidGrd = ctx.createLinearGradient(beakerX, beakerY + 20, beakerX, beakerY + beakerH);
        liquidGrd.addColorStop(0, 'rgba(20, 184, 166, 0.15)');
        liquidGrd.addColorStop(1, 'rgba(20, 184, 166, 0.25)');
        ctx.fillStyle = liquidGrd;
        ctx.fillRect(beakerX + 4, beakerY + 20, beakerW - 8, beakerH - 24);

        // Beaker glass
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(beakerX, beakerY);
        ctx.lineTo(beakerX, beakerY + beakerH);
        ctx.lineTo(beakerX + beakerW, beakerY + beakerH);
        ctx.lineTo(beakerX + beakerW, beakerY);
        ctx.stroke();
        ctx.restore();

        // Electrodes
        const leftElecX = cx - 60;
        const rightElecX = cx + 60;
        const elecTop = beakerY - 10;
        const elecBottom = beakerY + beakerH - 20;

        // Left electrode (Copper — Anode, dissolves)
        ctx.fillStyle = isOn ? '#d97706' : '#92400e';
        ctx.fillRect(leftElecX - 8, elecTop, 16, elecBottom - elecTop);
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(leftElecX - 8, elecTop, 16, elecBottom - elecTop);

        // Right electrode (Iron — Cathode, gets coated)
        // Base iron
        ctx.fillStyle = '#64748b';
        ctx.fillRect(rightElecX - 8, elecTop, 16, elecBottom - elecTop);
        // Copper coating layer
        if (coating > 0) {
            const coatHeight = (elecBottom - elecTop - 10) * (coating / 100);
            ctx.fillStyle = `rgba(217, 119, 6, ${0.3 + coating / 100 * 0.7})`;
            ctx.fillRect(rightElecX - 10, elecBottom - coatHeight - 5, 20, coatHeight);
        }

        // Bubbles at electrodes
        if (isOn) {
            bubbles.forEach(b => {
                b.y -= b.speed;
                if (b.y < -60) {
                    b.y = 60;
                    b.x = Math.random() * 20 - 10;
                }

                const ex = b.electrode === 'left' ? leftElecX : rightElecX;
                const by_pos = beakerY + beakerH / 2 + b.y;
                if (by_pos > beakerY + 20 && by_pos < beakerY + beakerH - 5) {
                    ctx.fillStyle = `rgba(20, 184, 166, ${b.alpha})`;
                    ctx.beginPath();
                    ctx.arc(ex + b.x, by_pos, b.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // Copper ions moving from left to right
            ions.forEach(ion => {
                if (!ion.active && Math.random() < 0.02) {
                    ion.active = true;
                    ion.x = leftElecX - cx;
                    ion.y = (Math.random() - 0.5) * (beakerH - 60);
                }
                if (ion.active) {
                    ion.x += 1.2;
                    ion.y += (Math.random() - 0.5) * 0.5;
                    if (ion.x > rightElecX - cx) {
                        ion.active = false;
                    }

                    ctx.fillStyle = `rgba(251, 191, 36, ${ion.alpha})`;
                    ctx.beginPath();
                    ctx.arc(cx + ion.x, cy + ion.y + 20, ion.size, 0, Math.PI * 2);
                    ctx.fill();

                    // Cu²⁺ label
                    ctx.fillStyle = `rgba(251, 191, 36, ${ion.alpha * 0.7})`;
                    ctx.font = '8px "Space Mono"';
                    ctx.fillText('Cu²⁺', cx + ion.x + 6, cy + ion.y + 16);
                }
            });
        }

        // Wires to battery
        const bx = W * 0.88, by = cy;
        ctx.strokeStyle = isOn ? 'rgba(16, 185, 129, 0.5)' : 'rgba(90, 94, 120, 0.4)';
        ctx.lineWidth = 2;
        // Wire to left electrode (positive)
        ctx.beginPath();
        ctx.moveTo(leftElecX, elecTop);
        ctx.lineTo(leftElecX, beakerY - 40);
        ctx.lineTo(bx - 20, beakerY - 40);
        ctx.lineTo(bx - 20, by - 15);
        ctx.stroke();
        // Wire to right electrode (negative)
        ctx.beginPath();
        ctx.moveTo(rightElecX, elecTop);
        ctx.lineTo(rightElecX, beakerY - 55);
        ctx.lineTo(bx + 5, beakerY - 55);
        ctx.lineTo(bx + 5, by - 15);
        ctx.stroke();

        // Battery
        ctx.fillStyle = '#1a1d2e';
        ctx.strokeStyle = isOn ? '#10b981' : '#3a3e55';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(bx - 25, by - 15, 50, 60, 6);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = isOn ? '#10b981' : '#5a5e78';
        ctx.font = 'bold 10px "Space Mono"';
        ctx.textAlign = 'center';
        ctx.fillText('DC', bx, by + 14);
        ctx.fillText('+', bx - 12, by - 2);
        ctx.fillText('−', bx + 12, by - 2);

        // Labels
        ctx.fillStyle = '#5a5e78';
        ctx.font = '10px "Space Mono"';
        ctx.textAlign = 'center';
        ctx.fillText('COPPER (ANODE)', leftElecX, elecBottom + 20);
        ctx.fillText('IRON (CATHODE)', rightElecX, elecBottom + 20);
        ctx.fillText('CuSO₄ SOLUTION', cx, beakerY + beakerH + 20);
        ctx.fillText('BATTERY', bx, by + 50);

        // Update UI
        document.getElementById('chemical-timer-val').textContent = elapsedTime + 's';
        document.getElementById('coating-bar').style.width = coating + '%';
        document.getElementById('coating-pct').textContent = Math.round(coating) + '%';

        animId = requestAnimationFrame(draw);
    }

    function init() {
        const setup = setupHiDPI(canvas);
        ctx = setup.ctx; W = setup.w; H = setup.h;
        initBubbles();
        initIons();
        draw(0);
    }

    document.getElementById('btn-chemical-toggle').addEventListener('click', () => {
        isOn = !isOn;
        if (isOn) lastTime = performance.now();
        document.getElementById('chemical-switch-ind').className = 'switch-indicator ' + (isOn ? 'on' : 'off');
        document.getElementById('chemical-switch-label').textContent = isOn ? 'ON' : 'OFF';
        document.getElementById('btn-chemical-toggle').classList.toggle('active', isOn);
    });

    window.addEventListener('load', init);
    window.addEventListener('resize', () => { cancelAnimationFrame(animId); init(); });
})();


// ═══════════════════════════════════════════════
// LAB 5: MINI QUIZ
// ═══════════════════════════════════════════════
(function() {
    const quizData = [
        {
            q: "What happens when an electric circuit is open (switch OFF)?",
            options: [
                "Current flows normally",
                "Current does not flow",
                "Bulb glows brighter",
                "Battery gets recharged"
            ],
            correct: 1,
            explanation: "When the switch is OFF (open circuit), the circuit is broken and no current can flow through it. The bulb remains off."
        },
        {
            q: "If you increase the resistance in a circuit, what happens to the current?",
            options: [
                "Current increases",
                "Current stays the same",
                "Current decreases",
                "Current becomes zero"
            ],
            correct: 2,
            explanation: "According to Ohm's law (I = V/R), if resistance increases while voltage stays the same, the current decreases."
        },
        {
            q: "Which of the following is NOT an example of the heating effect of electric current?",
            options: [
                "Electric iron",
                "Electric fuse",
                "Electromagnet",
                "Electric heater"
            ],
            correct: 2,
            explanation: "An electromagnet is an example of the MAGNETIC effect of electric current, not the heating effect. Electric iron, fuse, and heater all work on the heating effect."
        },
        {
            q: "What is electroplating?",
            options: [
                "Melting metal using electricity",
                "Depositing a layer of one metal on another using electric current",
                "Making a magnet using electricity",
                "Breaking water into hydrogen and oxygen"
            ],
            correct: 1,
            explanation: "Electroplating is the process of depositing a layer of a desired metal over another metal by passing electric current through an electrolyte solution."
        },
        {
            q: "How can you make an electromagnet stronger?",
            options: [
                "By decreasing the current",
                "By using a wooden core instead of iron",
                "By increasing the number of coil turns and current",
                "By making the wire shorter"
            ],
            correct: 2,
            explanation: "An electromagnet becomes stronger when you increase the number of coil turns around the iron nail or increase the current flowing through the coil."
        }
    ];

    let selected = {};
    let submitted = false;

    function renderQuiz() {
        const container = document.getElementById('sim-quiz-container');
        container.innerHTML = quizData.map((q, qi) => `
            <div class="quiz-item" id="quiz-item-${qi}">
                <div class="quiz-q-num">QUESTION ${qi + 1} OF ${quizData.length}</div>
                <div class="quiz-q-text">${q.q}</div>
                <div class="quiz-options">
                    ${q.options.map((opt, oi) => `
                        <div class="quiz-opt" data-q="${qi}" data-o="${oi}">
                            <span class="quiz-opt-marker">${String.fromCharCode(65 + oi)}</span>
                            <span>${opt}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="quiz-explanation" id="quiz-exp-${qi}">💡 ${q.explanation}</div>
            </div>
        `).join('');

        // Attach listeners
        container.querySelectorAll('.quiz-opt').forEach(opt => {
            opt.addEventListener('click', () => {
                if (submitted) return;
                const qi = parseInt(opt.dataset.q);
                const oi = parseInt(opt.dataset.o);
                selected[qi] = oi;

                // Deselect others in same question
                container.querySelectorAll(`.quiz-opt[data-q="${qi}"]`).forEach(o => {
                    o.classList.remove('selected');
                });
                opt.classList.add('selected');
            });
        });
    }

    function submitQuiz() {
        if (submitted) return;
        submitted = true;

        let score = 0;
        quizData.forEach((q, qi) => {
            const item = document.getElementById(`quiz-item-${qi}`);
            const opts = document.querySelectorAll(`.quiz-opt[data-q="${qi}"]`);
            const expEl = document.getElementById(`quiz-exp-${qi}`);

            if (selected[qi] === q.correct) {
                score++;
                item.classList.add('correct');
                opts[q.correct].classList.add('correct-answer');
            } else {
                item.classList.add('incorrect');
                opts[q.correct].classList.add('correct-answer');
                if (selected[qi] !== undefined) {
                    opts[selected[qi]].classList.add('wrong-answer');
                }
            }
            expEl.style.display = 'block';
        });

        document.getElementById('sim-quiz-score').textContent = score + '/' + quizData.length;
        document.getElementById('sim-quiz-result').classList.remove('hidden');
        document.getElementById('btn-sim-quiz-submit').classList.add('hidden');
    }

    function retryQuiz() {
        submitted = false;
        selected = {};
        document.getElementById('sim-quiz-result').classList.add('hidden');
        document.getElementById('btn-sim-quiz-submit').classList.remove('hidden');
        renderQuiz();
    }

    document.getElementById('btn-sim-quiz-submit').addEventListener('click', submitQuiz);
    document.getElementById('btn-sim-retry').addEventListener('click', retryQuiz);

    window.addEventListener('load', renderQuiz);
})();
