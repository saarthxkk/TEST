/* ════════════════════════════════════════════════════════════════════
   OPTICS LAB — JAVASCRIPT SIMULATION SUITE
   Class 7 Science · Chapter 11: Light
   All 9 Experiments, Ray Tracing, Physics Engines & Quiz
   ════════════════════════════════════════════════════════════════════ */

// ─── GLOBAL APPLICATION STATE ───
const AppState = {
    currentView: 'view-hub',
    completedSims: new Set(), // Session memory only (no localStorage)
    theme: 'dark',
    activeSubtabs: {
        sim1: 'sim1-tube',
        sim2: 'sim2-distance',
        sim5: 'sim5-bench',
        sim6: 'sim6-bench',
        sim7: 'sim7-bench',
        sim8: 'sim8-prism',
        sim9: 'sim9-builder'
    }
};

// ─── INITIALIZATION ON DOM READY ───
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTheme();
    initModals();
    initMCQHandlers();
    initChapterQuiz();

    // Initialize all 9 simulation engines
    Sim1.init();
    Sim2.init();
    Sim3.init();
    Sim4.init();
    Sim5.init();
    Sim6.init();
    Sim7.init();
    Sim8.init();
    Sim9.init();

    // Start global animation loop for dynamic canvas effects (candle flames, dust, sparks)
    startGlobalAnimationLoop();
});

// ─── NAVIGATION & ROUTING ───
function initNavigation() {
    // Hub cards click
    document.querySelectorAll('.hub-card').forEach(card => {
        card.addEventListener('click', () => {
            const simKey = card.getAttribute('data-sim');
            showView(`view-${simKey}`);
            resizeActiveCanvas(`canvas-${simKey}`);
        });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });

    // Back to hub buttons
    document.querySelectorAll('.btn-back-hub, #btn-nav-home').forEach(btn => {
        btn.addEventListener('click', () => {
            showView('view-hub');
            updateHubProgress();
        });
    });

    // Next simulation buttons
    document.querySelectorAll('.btn-next-sim').forEach(btn => {
        btn.addEventListener('click', () => {
            const next = btn.getAttribute('data-next');
            showView(`view-${next}`);
            resizeActiveCanvas(`canvas-${next}`);
        });
    });

    // Open Quiz banner button
    const btnOpenQuiz = document.getElementById('btn-open-quiz');
    if (btnOpenQuiz) {
        btnOpenQuiz.addEventListener('click', () => {
            showView('view-quiz');
        });
    }

    // Subtab buttons across simulations
    document.querySelectorAll('.subtab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const parent = btn.closest('.sim-container');
            const subtabId = btn.getAttribute('data-subtab');
            parent.querySelectorAll('.subtab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const simId = parent.parentElement.id.replace('view-', '');
            AppState.activeSubtabs[simId] = subtabId;

            // Trigger redraw on active sim
            if (simId === 'sim1') Sim1.draw();
            if (simId === 'sim2') Sim2.draw();
            if (simId === 'sim5') Sim5.draw();
            if (simId === 'sim6') Sim6.draw();
            if (simId === 'sim7') Sim7.draw();
            if (simId === 'sim8') Sim8.draw();
            if (simId === 'sim9') Sim9.draw();
        });
    });
}

function showView(viewId) {
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    const target = document.getElementById(viewId);
    if (target) {
        target.classList.add('active');
        AppState.currentView = viewId;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updateHubProgress() {
    const total = 9;
    const completedCount = AppState.completedSims.size;
    const countText = `${completedCount} / ${total} Completed`;
    
    const pillText = document.getElementById('progress-count-text');
    if (pillText) pillText.textContent = countText;

    const statDone = document.getElementById('stat-completed');
    if (statDone) statDone.textContent = completedCount;

    // Update badges on cards
    for (let i = 1; i <= 9; i++) {
        const badge = document.getElementById(`badge-sim${i}`);
        if (badge) {
            if (AppState.completedSims.has(`sim${i}`)) {
                badge.textContent = 'Completed';
                badge.classList.add('completed');
            } else {
                badge.textContent = 'Pending';
                badge.classList.remove('completed');
            }
        }
    }
}

function markSimCompleted(simId) {
    if (!AppState.completedSims.has(simId)) {
        AppState.completedSims.add(simId);
        updateHubProgress();
    }
    const concl = document.getElementById(`${simId}-conclusion`);
    if (concl) {
        concl.classList.remove('locked');
    }
}

// ─── THEME TOGGLE ───
function initTheme() {
    const toggleBtn = document.getElementById('btn-theme-toggle');
    const icon = document.getElementById('theme-icon');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
        AppState.theme = AppState.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', AppState.theme);
        icon.textContent = AppState.theme === 'dark' ? '☀️' : '🌙';
    });
}

// ─── MODALS ───
function initModals() {
    const fastFactsModal = document.getElementById('modal-fast-facts');
    const glossaryModal = document.getElementById('modal-glossary');

    document.getElementById('btn-fast-facts')?.addEventListener('click', () => {
        fastFactsModal?.classList.remove('hidden');
    });
    document.getElementById('btn-close-facts')?.addEventListener('click', () => {
        fastFactsModal?.classList.add('hidden');
    });

    document.getElementById('btn-glossary')?.addEventListener('click', () => {
        glossaryModal?.classList.remove('hidden');
    });
    document.getElementById('btn-close-glossary')?.addEventListener('click', () => {
        glossaryModal?.classList.add('hidden');
    });

    [fastFactsModal, glossaryModal].forEach(modal => {
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    });
}

// ─── CHECK YOURSELF MCQ ENGINE ───
function initMCQHandlers() {
    document.querySelectorAll('.mcq-card').forEach(card => {
        const options = card.querySelectorAll('.mcq-opt');
        const explanation = card.querySelector('.mcq-explanation');

        options.forEach(opt => {
            opt.addEventListener('click', () => {
                if (card.getAttribute('data-answered') === 'true') return;
                card.setAttribute('data-answered', 'true');

                const isCorrect = opt.getAttribute('data-correct') === 'true';
                if (isCorrect) {
                    opt.classList.add('correct');
                } else {
                    opt.classList.add('incorrect');
                    options.forEach(o => {
                        if (o.getAttribute('data-correct') === 'true') o.classList.add('correct');
                    });
                }
                options.forEach(o => o.disabled = true);
                if (explanation) explanation.classList.remove('hidden');
            });
        });
    });
}

// ─── HELPER CANVAS RESIZING ───
function resizeActiveCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    // ensure crisp display
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && canvas.width !== 840) {
        canvas.width = 840;
    }
}

// Global animation timer
let animFrameId = null;
function startGlobalAnimationLoop() {
    function loop(time) {
        if (AppState.currentView === 'view-sim1') Sim1.draw(time);
        else if (AppState.currentView === 'view-sim2') Sim2.draw(time);
        else if (AppState.currentView === 'view-sim3') Sim3.draw(time);
        else if (AppState.currentView === 'view-sim4') Sim4.draw(time);
        else if (AppState.currentView === 'view-sim5') Sim5.draw(time);
        else if (AppState.currentView === 'view-sim6') Sim6.draw(time);
        else if (AppState.currentView === 'view-sim7') Sim7.draw(time);
        else if (AppState.currentView === 'view-sim8') Sim8.draw(time);
        else if (AppState.currentView === 'view-sim9') Sim9.draw(time);

        animFrameId = requestAnimationFrame(loop);
    }
    animFrameId = requestAnimationFrame(loop);
}


/* ════════════════════════════════════════════════════════════════════
   SIMULATION 1: LIGHT TRAVELS IN A STRAIGHT LINE
   ════════════════════════════════════════════════════════════════════ */
const Sim1 = {
    canvas: null,
    ctx: null,
    bend: 0, // 0 = straight, >0 = bent
    isCoiled: false,
    flameOffset: 0,
    hasTestedStraight: true,
    hasTestedBent: false,
    isDragging: false,

    init() {
        this.canvas = document.getElementById('canvas-sim1');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        const bendSlider = document.getElementById('sim1-bend-slider');
        const bendVal = document.getElementById('sim1-bend-val');
        const candleY = document.getElementById('sim1-candle-y');
        const btnStraight = document.getElementById('sim1-btn-straight');
        const btnCoiled = document.getElementById('sim1-btn-coiled');
        const btnReset = document.getElementById('sim1-btn-reset');

        bendSlider?.addEventListener('input', (e) => {
            this.bend = parseFloat(e.target.value);
            this.isCoiled = this.bend > 15;
            bendVal.textContent = this.bend === 0 ? '0° (Straight)' : `${this.bend}° (Bent)`;
            btnStraight.classList.toggle('active', this.bend === 0);
            btnCoiled.classList.toggle('active', this.bend > 0);
            this.checkInteraction();
            this.updateObservation();
        });

        candleY?.addEventListener('input', (e) => {
            this.flameOffset = parseFloat(e.target.value);
            this.updateObservation();
        });

        btnStraight?.addEventListener('click', () => {
            this.bend = 0;
            this.isCoiled = false;
            bendSlider.value = 0;
            bendVal.textContent = '0° (Straight)';
            btnStraight.classList.add('active');
            btnCoiled.classList.remove('active');
            this.hasTestedStraight = true;
            this.checkInteraction();
            this.updateObservation();
        });

        btnCoiled?.addEventListener('click', () => {
            this.bend = 55;
            this.isCoiled = true;
            bendSlider.value = 55;
            bendVal.textContent = '55° (Bent / Coiled)';
            btnStraight.classList.remove('active');
            btnCoiled.classList.add('active');
            this.hasTestedBent = true;
            this.checkInteraction();
            this.updateObservation();
        });

        btnReset?.addEventListener('click', () => {
            btnStraight?.click();
            if (candleY) candleY.value = 0;
            this.flameOffset = 0;
        });

        // Mouse/touch drag on canvas
        const handleDrag = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const y = (clientY - rect.top) * (this.canvas.height / rect.height);
            const midY = 180;
            const diff = Math.abs(y - midY);
            this.bend = Math.min(100, Math.max(0, diff * 1.2));
            bendSlider.value = this.bend;
            bendVal.textContent = `${Math.round(this.bend)}° (Bent)`;
            btnStraight.classList.toggle('active', this.bend === 0);
            btnCoiled.classList.toggle('active', this.bend > 0);
            this.checkInteraction();
            this.updateObservation();
        };

        this.canvas.addEventListener('mousedown', (e) => { this.isDragging = true; handleDrag(e); });
        window.addEventListener('mousemove', (e) => { if (this.isDragging) handleDrag(e); });
        window.addEventListener('mouseup', () => { this.isDragging = false; });
        this.canvas.addEventListener('touchstart', (e) => { this.isDragging = true; handleDrag(e); });
        window.addEventListener('touchmove', (e) => { if (this.isDragging) handleDrag(e); });
        window.addEventListener('touchend', () => { this.isDragging = false; });

        this.draw();
    },

    checkInteraction() {
        if (this.bend > 20) this.hasTestedBent = true;
        if (this.hasTestedStraight && this.hasTestedBent) {
            markSimCompleted('sim1');
        }
    },

    updateObservation() {
        const obs = document.getElementById('sim1-observation');
        const step1 = document.getElementById('sim1-step1');
        const step2 = document.getElementById('sim1-step2');
        const step3 = document.getElementById('sim1-step3');

        if (this.bend < 12) {
            obs.innerHTML = 'The tube is straight! The light coming from the candle flame travels in a <strong>straight line</strong> and is <strong>clearly visible</strong> to the observer\'s eye.';
            step1.classList.remove('active');
            step2.classList.add('active');
            step3.classList.remove('active');
        } else {
            obs.innerHTML = 'The rubber tube is bent/coiled! Light rays travel strictly in straight lines and <strong>cannot bend around the curve</strong>. The rays strike the inner wall of the tube and are blocked. <strong>The light is NOT seen by the eye</strong>.';
            step1.classList.remove('active');
            step2.classList.remove('active');
            step3.classList.add('active');
        }
    },

    draw(time = 0) {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        ctx.clearRect(0, 0, w, h);

        const subtab = AppState.activeSubtabs.sim1;
        if (subtab === 'sim1-slit') {
            this.drawSlitDemo(time);
            return;
        }

        // Background laboratory table
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, w, h);

        // Table surface
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(40, 290, w - 80, 16);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(40, 306, w - 80, 40);

        const eyeX = 140;
        const eyeY = 180;
        const flameX = 700;
        const flameY = 180 + this.flameOffset;

        const isLightVisible = this.bend < 12 && Math.abs(this.flameOffset) < 15;

        // 1. Draw Eye on the left
        this.drawObserverEye(ctx, eyeX, eyeY, isLightVisible);

        // 2. Draw Candle on the right
        this.drawCandle(ctx, flameX, flameY, time);

        // 3. Draw Rubber Tube
        const tubeStartX = eyeX + 40;
        const tubeEndX = flameX - 40;
        const tubeMidX = (tubeStartX + tubeEndX) / 2;
        const tubeMidY = 180 - this.bend * 1.1;

        // Draw light ray first if straight
        if (isLightVisible) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(flameX - 10, flameY);
            ctx.lineTo(eyeX + 15, eyeY);
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 4;
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 15;
            ctx.stroke();

            // Arrow heads on ray
            this.drawArrow(ctx, (tubeStartX + tubeEndX) / 2 + 50, 180, (tubeStartX + tubeEndX) / 2 - 50, 180);
            ctx.restore();
        } else {
            // Blocked ray from candle into tube entrance
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(flameX - 10, flameY);
            const blockX = tubeMidX + 40;
            const blockY = 180 - this.bend * 0.4;
            ctx.lineTo(blockX, blockY);
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 8;
            ctx.stroke();

            // Red X blocking marker
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(blockX - 8, blockY - 8);
            ctx.lineTo(blockX + 8, blockY + 8);
            ctx.moveTo(blockX + 8, blockY - 8);
            ctx.lineTo(blockX - 8, blockY + 8);
            ctx.stroke();
            ctx.restore();
        }

        // Draw rubber tube path
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(tubeStartX, eyeY);
        ctx.quadraticCurveTo(tubeMidX, tubeMidY, tubeEndX, 180);
        ctx.lineWidth = 26;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#334155';
        ctx.stroke();

        // Inner hollow bore
        ctx.beginPath();
        ctx.moveTo(tubeStartX, eyeY);
        ctx.quadraticCurveTo(tubeMidX, tubeMidY, tubeEndX, 180);
        ctx.lineWidth = 14;
        ctx.strokeStyle = isLightVisible ? 'rgba(251, 191, 36, 0.4)' : '#0f172a';
        ctx.stroke();

        // Drag handle on the tube
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(tubeMidX, tubeMidY, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Labels
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px Space Mono, monospace';
        ctx.fillText('Observer Eye', eyeX - 35, eyeY + 60);
        ctx.fillText('Lighted Candle', flameX - 45, flameY + 105);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('Rubber Tube (Drag middle)', tubeMidX - 70, tubeMidY - 18);
        ctx.restore();
    },

    drawObserverEye(ctx, x, y, illuminated) {
        ctx.save();
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.ellipse(x, y, 26, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Iris
        ctx.fillStyle = illuminated ? '#0284c7' : '#334155';
        ctx.beginPath();
        ctx.arc(x + 6, y, 10, 0, Math.PI * 2);
        ctx.fill();

        // Pupil
        ctx.fillStyle = illuminated ? '#fbbf24' : '#0f172a';
        ctx.beginPath();
        ctx.arc(x + 7, y, 5, 0, Math.PI * 2);
        ctx.fill();

        if (illuminated) {
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = 12;
            ctx.strokeStyle = '#fef08a';
            ctx.stroke();
        }
        ctx.restore();
    },

    drawCandle(ctx, x, y, time) {
        ctx.save();
        // Stand
        ctx.fillStyle = '#475569';
        ctx.fillRect(x - 24, 275, 48, 15);
        // Candle body
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(x - 12, y + 20, 24, 75);
        // Wick
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y + 20);
        ctx.lineTo(x, y + 8);
        ctx.stroke();

        // Flame animation
        const flicker = Math.sin(time * 0.015) * 2;
        const grad = ctx.createRadialGradient(x + flicker * 0.3, y, 2, x, y, 18);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, '#fde047');
        grad.addColorStop(0.7, '#f97316');
        grad.addColorStop(1, 'rgba(239, 68, 68, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(x + flicker * 0.5, y, 9, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        // Outer glow
        ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
        ctx.beginPath();
        ctx.arc(x, y, 35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    },

    drawArrow(ctx, fromX, fromY, toX, toY) {
        const headlen = 10;
        const angle = Math.atan2(toY - fromY, toX - fromX);
        const midX = (fromX + toX) / 2;
        const midY = (fromY + toY) / 2;
        ctx.beginPath();
        ctx.moveTo(midX, midY);
        ctx.lineTo(midX - headlen * Math.cos(angle - Math.PI / 6), midY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(midX, midY);
        ctx.lineTo(midX - headlen * Math.cos(angle + Math.PI / 6), midY - headlen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
    },

    drawSlitDemo(time) {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Darkened room
        ctx.fillStyle = '#06080e';
        ctx.fillRect(0, 0, w, h);

        // Window on the left with small slit
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, 80, h);
        ctx.fillStyle = '#334155';
        ctx.fillRect(80, 0, 20, 140);
        ctx.fillRect(80, 180, 20, h - 180);

        // Slit opening
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(80, 140, 20, 40);

        // Sun outside
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(35, 160, 26, 0, Math.PI * 2);
        ctx.fill();

        // Collimated straight beam cutting across the dark room
        const beamGrad = ctx.createLinearGradient(100, 160, w - 80, 280);
        beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
        beamGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.55)');
        beamGrad.addColorStop(1, 'rgba(251, 191, 36, 0.15)');

        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(100, 145);
        ctx.lineTo(w - 60, 240);
        ctx.lineTo(w - 60, 310);
        ctx.lineTo(100, 175);
        ctx.closePath();
        ctx.fill();

        // Dust particles dancing in straight beam
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 35; i++) {
            const px = 120 + ((i * 37 + time * 0.04) % (w - 200));
            const progress = (px - 100) / (w - 160);
            const topY = 145 + progress * 95;
            const botY = 175 + progress * 135;
            const py = topY + ((i * 19) % (botY - topY));
            ctx.beginPath();
            ctx.arc(px, py, 1.2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Room Floor & Wall
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(w - 60, 0, 60, h);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, h - 30, w, 30);

        // Bright patch on wall
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.ellipse(w - 60, 275, 12, 35, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '13px Space Mono, monospace';
        ctx.fillText('Window Slit', 95, 125);
        ctx.fillText('Sunbeam travelling in straight lines', 260, 200);
        ctx.fillText('Bright spot on wall', w - 190, 275);
    }
};


/* ════════════════════════════════════════════════════════════════════
   SIMULATION 2: IMAGE FORMED BY A PLANE MIRROR
   ════════════════════════════════════════════════════════════════════ */
const Sim2 = {
    canvas: null,
    ctx: null,
    u: 30, // cm
    screenX: 30,
    hasScreen: true,
    testedPositions: new Set(),
    isDraggingObject: false,

    init() {
        this.canvas = document.getElementById('canvas-sim2');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        const uSlider = document.getElementById('sim2-u-slider');
        const uVal = document.getElementById('sim2-u-slider-val');
        const screenSlider = document.getElementById('sim2-screen-x');
        const screenVal = document.getElementById('sim2-screen-val');
        const btnScreenOn = document.getElementById('sim2-btn-screen-on');
        const btnScreenOff = document.getElementById('sim2-btn-screen-off');
        const btnReset = document.getElementById('sim2-btn-reset');

        uSlider?.addEventListener('input', (e) => {
            this.u = parseFloat(e.target.value);
            uVal.textContent = `${this.u} cm`;
            this.testedPositions.add(Math.round(this.u / 10));
            if (this.testedPositions.size >= 3) markSimCompleted('sim2');
            this.updateMetrics();
        });

        screenSlider?.addEventListener('input', (e) => {
            this.screenX = parseFloat(e.target.value);
            screenVal.textContent = `Behind Mirror (+${this.screenX} cm)`;
            this.updateMetrics();
        });

        btnScreenOn?.addEventListener('click', () => {
            this.hasScreen = true;
            btnScreenOn.classList.add('active');
            btnScreenOff.classList.remove('active');
            this.updateMetrics();
        });

        btnScreenOff?.addEventListener('click', () => {
            this.hasScreen = false;
            btnScreenOff.classList.add('active');
            btnScreenOn.classList.remove('active');
            this.updateMetrics();
        });

        btnReset?.addEventListener('click', () => {
            this.u = 30;
            if (uSlider) uSlider.value = 30;
            if (uVal) uVal.textContent = '30 cm';
            this.hasScreen = true;
            btnScreenOn?.classList.add('active');
            btnScreenOff?.classList.remove('active');
            this.updateMetrics();
        });

        // Mouse/touch dragging on candle
        const handleDrag = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientY;
            const x = (clientX - rect.left) * (this.canvas.width / rect.width);
            const mirrorX = 420;
            if (x < mirrorX - 20) {
                const distCm = (mirrorX - x) / 5.5;
                this.u = Math.min(65, Math.max(10, Math.round(distCm)));
                if (uSlider) uSlider.value = this.u;
                if (uVal) uVal.textContent = `${this.u} cm`;
                this.testedPositions.add(Math.round(this.u / 10));
                if (this.testedPositions.size >= 3) markSimCompleted('sim2');
                this.updateMetrics();
            }
        };

        this.canvas.addEventListener('mousedown', (e) => { this.isDraggingObject = true; handleDrag(e); });
        window.addEventListener('mousemove', (e) => { if (this.isDraggingObject) handleDrag(e); });
        window.addEventListener('mouseup', () => { this.isDraggingObject = false; });
        this.canvas.addEventListener('touchstart', (e) => { this.isDraggingObject = true; handleDrag(e); });
        window.addEventListener('touchmove', (e) => { if (this.isDraggingObject) handleDrag(e); });
        window.addEventListener('touchend', () => { this.isDraggingObject = false; });

        this.updateMetrics();
        this.draw();
    },

    updateMetrics() {
        const v = this.u; // plane mirror: u = v
        const ho = 8.0;
        const hi = 8.0;

        document.getElementById('sim2-u-val').textContent = `${this.u.toFixed(1)} cm`;
        document.getElementById('sim2-v-val').textContent = `${v.toFixed(1)} cm`;
        document.getElementById('sim2-ho-val').textContent = `${ho.toFixed(1)} cm`;
        document.getElementById('sim2-hi-val').textContent = `${hi.toFixed(1)} cm`;

        const obs = document.getElementById('sim2-observation');
        let screenMsg = this.hasScreen 
            ? 'The cardboard screen placed behind the mirror shows <strong>no image</strong> &rarr; proving the image is <strong>VIRTUAL</strong>!' 
            : 'Image is erect, equal in height (8 cm), and formed at the exact same distance behind the mirror.';
        obs.innerHTML = `Object distance <strong>u = ${this.u} cm</strong>. Image distance <strong>v = ${v} cm</strong>. The image is <strong>erect, same size</strong>, formed behind the mirror. ${screenMsg}`;
    },

    draw(time = 0) {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        ctx.clearRect(0, 0, w, h);

        const subtab = AppState.activeSubtabs.sim2;
        if (subtab === 'sim2-lateral') {
            this.drawLateralInversion(time);
            return;
        } else if (subtab === 'sim2-water') {
            this.drawWaterReflection(time);
            return;
        }

        // Dark stage
        ctx.fillStyle = '#080c14';
        ctx.fillRect(0, 0, w, h);

        const mirrorX = 420;
        const scale = 5.5; // px per cm
        const groundY = 310;

        // Ruler bench scale
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(40, groundY);
        ctx.lineTo(w - 40, groundY);
        ctx.stroke();

        for (let cm = -60; cm <= 60; cm += 10) {
            const x = mirrorX + cm * scale;
            if (x >= 40 && x <= w - 40) {
                ctx.beginPath();
                ctx.moveTo(x, groundY);
                ctx.lineTo(x, groundY + (cm % 20 === 0 ? 10 : 5));
                ctx.stroke();
                if (cm % 20 === 0) {
                    ctx.fillStyle = '#64748b';
                    ctx.font = '9px Space Mono, monospace';
                    ctx.fillText(`${Math.abs(cm)}`, x - 6, groundY + 22);
                }
            }
        }

        // Vertical Plane Mirror at mirrorX
        ctx.save();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.fillRect(mirrorX - 4, 60, 8, 250);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.strokeRect(mirrorX - 4, 60, 8, 250);

        // Silvered backing hatching lines (hatching on right side)
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1;
        for (let y = 70; y < 310; y += 12) {
            ctx.beginPath();
            ctx.moveTo(mirrorX + 4, y);
            ctx.lineTo(mirrorX + 14, y - 8);
            ctx.stroke();
        }
        ctx.restore();

        // Candle object (Front, Left)
        const objX = mirrorX - this.u * scale;
        const objY = groundY - 70;
        this.drawCandle(ctx, objX, objY, time, false);

        // Virtual Image (Behind, Right)
        const imgX = mirrorX + this.u * scale;
        const imgY = groundY - 70;
        this.drawCandle(ctx, imgX, imgY, time, true);

        // Ray Tracing:
        // Ray 1: Flame tip perpendicular to mirror
        const flameObjY = objY - 20;
        ctx.save();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        // Incident ray
        ctx.beginPath();
        ctx.moveTo(objX, flameObjY);
        ctx.lineTo(mirrorX, flameObjY);
        ctx.stroke();
        // Virtual extension behind mirror
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(mirrorX, flameObjY);
        ctx.lineTo(imgX, flameObjY);
        ctx.strokeStyle = '#94a3b8';
        ctx.stroke();
        ctx.restore();

        // Ray 2: Oblique ray to mirror bottom
        ctx.save();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        const hitY = flameObjY + 70;
        ctx.beginPath();
        ctx.moveTo(objX, flameObjY);
        ctx.lineTo(mirrorX, hitY);
        ctx.stroke();

        // Reflected ray into observer's zone
        const reflectAngleY = hitY + (hitY - flameObjY);
        ctx.beginPath();
        ctx.moveTo(mirrorX, hitY);
        ctx.lineTo(objX - 60, reflectAngleY);
        ctx.stroke();

        // Backward extension dotted
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(mirrorX, hitY);
        ctx.lineTo(imgX, flameObjY);
        ctx.stroke();
        ctx.restore();

        // Cardboard screen behind mirror
        if (this.hasScreen) {
            const scX = mirrorX + this.screenX * scale;
            ctx.save();
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(scX - 3, 90, 6, 210);
            ctx.strokeStyle = '#b45309';
            ctx.strokeRect(scX - 3, 90, 6, 210);

            // Screen label tag
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(scX - 70, 65, 140, 22);
            ctx.strokeStyle = '#f59e0b';
            ctx.strokeRect(scX - 70, 65, 140, 22);
            ctx.fillStyle = '#fde68a';
            ctx.font = '10px Space Mono, monospace';
            ctx.fillText('NO IMAGE ON SCREEN', scX - 62, 80);
            ctx.restore();
        }

        // Labels
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '12px Space Mono, monospace';
        ctx.fillText(`Real Object (u = ${this.u}cm)`, objX - 60, groundY + 45);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`Virtual Image (v = ${this.u}cm)`, imgX - 60, groundY + 45);
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Plane Mirror', mirrorX - 40, 50);
    },

    drawCandle(ctx, x, y, time, isVirtual) {
        ctx.save();
        if (isVirtual) {
            ctx.globalAlpha = 0.55;
            ctx.setLineDash([3, 3]);
        }
        // Candle stick
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(x - 8, y, 16, 65);
        ctx.strokeStyle = '#94a3b8';
        ctx.strokeRect(x - 8, y, 16, 65);

        // Wick
        ctx.strokeStyle = '#000000';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - 8);
        ctx.stroke();

        // Flame
        const flicker = isVirtual ? 0 : Math.sin(time * 0.02) * 1.5;
        const grad = ctx.createRadialGradient(x + flicker, y - 18, 1, x, y - 18, 14);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.4, '#fde047');
        grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(x + flicker, y - 18, 7, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    },

    drawLateralInversion(time) {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.fillStyle = '#080d1a';
        ctx.fillRect(0, 0, w, h);

        const mirrorX = 420;

        // Mirror divider
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(mirrorX, 40);
        ctx.lineTo(mirrorX, h - 40);
        ctx.stroke();

        // Letter F demo
        ctx.fillStyle = '#f8fafc';
        ctx.font = '72px Inter, sans-serif';
        ctx.fillText('F', 240, 160);

        // Inverted F
        ctx.save();
        ctx.translate(600, 160);
        ctx.scale(-1, 1);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('F', 0, 0);
        ctx.restore();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '13px Space Mono, monospace';
        ctx.fillText('Original Letter', 200, 200);
        ctx.fillText('Laterally Inverted Image', 520, 200);

        // Ambulance Demo
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(100, 240, 240, 70);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 26px Space Mono, monospace';
        ctx.fillText('ƎƆИAJUᗺMA', 130, 285);

        ctx.fillStyle = '#38bdf8';
        ctx.fillText('Seen in rear-view mirror:', 460, 260);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 26px Space Mono, monospace';
        ctx.fillText('AMBULANCE', 520, 300);

        ctx.font = '11px Inter, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Why emergency vehicles print letters reversed: so drivers ahead see it upright!', 160, 345);
    },

    drawWaterReflection(time) {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.fillStyle = '#09101d';
        ctx.fillRect(0, 0, w, h);

        const lakeY = 200;

        // Water surface
        const grad = ctx.createLinearGradient(0, lakeY, 0, h);
        grad.addColorStop(0, '#0284c7');
        grad.addColorStop(1, '#082f49');
        ctx.fillStyle = grad;
        ctx.fillRect(0, lakeY, w, h - lakeY);

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, lakeY);
        ctx.lineTo(w, lakeY);
        ctx.stroke();

        // Sky & Tree / Bird
        ctx.fillStyle = '#22c55e';
        // Upright Tree
        ctx.beginPath();
        ctx.moveTo(350, lakeY);
        ctx.lineTo(390, lakeY - 110);
        ctx.lineTo(430, lakeY);
        ctx.fill();
        ctx.fillStyle = '#78350f';
        ctx.fillRect(384, lakeY - 20, 12, 20);

        // Reflected Upside-down Tree in water
        ctx.save();
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.moveTo(350, lakeY);
        ctx.lineTo(390, lakeY + 110);
        ctx.lineTo(430, lakeY);
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = '#f8fafc';
        ctx.font = '14px Space Mono, monospace';
        ctx.fillText('Calm Water Acts as a Horizontal Plane Mirror', 220, 60);
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Horizontal reflection causes vertical inversion (upside down)', 200, 340);
    }
};


/* ════════════════════════════════════════════════════════════════════
   SIMULATION 3: REAL IMAGE OF SUN BY CONCAVE MIRROR
   ════════════════════════════════════════════════════════════════════ */
const Sim3 = {
    canvas: null,
    ctx: null,
    paperPos: 32, // cm
    holdTime: 0,
    isBurning: false,
    particles: [],

    init() {
        this.canvas = document.getElementById('canvas-sim3');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        const paperSlider = document.getElementById('sim3-paper-slider');
        const posVal = document.getElementById('sim3-slider-pos-val');
        const holdSlider = document.getElementById('sim3-hold-slider');
        const holdVal = document.getElementById('sim3-slider-hold-val');
        const btnSnap = document.getElementById('sim3-btn-snap-focus');
        const btnReset = document.getElementById('sim3-btn-reset');

        paperSlider?.addEventListener('input', (e) => {
            this.paperPos = parseFloat(e.target.value);
            posVal.textContent = `${this.paperPos.toFixed(1)} cm`;
            this.updateObservation();
        });

        holdSlider?.addEventListener('input', (e) => {
            this.holdTime = parseFloat(e.target.value);
            holdVal.textContent = `${this.holdTime.toFixed(1)} s`;
            this.updateObservation();
        });

        btnSnap?.addEventListener('click', () => {
            this.paperPos = 20.0;
            if (paperSlider) paperSlider.value = 20;
            if (posVal) posVal.textContent = '20.0 cm';
            this.updateObservation();
        });

        btnReset?.addEventListener('click', () => {
            this.paperPos = 32;
            this.holdTime = 0;
            this.isBurning = false;
            if (paperSlider) paperSlider.value = 32;
            if (posVal) posVal.textContent = '32.0 cm';
            if (holdSlider) holdSlider.value = 0;
            if (holdVal) holdVal.textContent = '0 s';
            this.updateObservation();
        });

        this.updateObservation();
        this.draw();
    },

    updateObservation() {
        const atFocus = Math.abs(this.paperPos - 20) < 1.0;
        document.getElementById('sim3-pos-val').textContent = `${this.paperPos.toFixed(1)} cm`;

        const heatVal = document.getElementById('sim3-heat-val');
        const timerVal = document.getElementById('sim3-timer-val');
        const obs = document.getElementById('sim3-observation');

        timerVal.textContent = `${this.holdTime.toFixed(1)} s`;

        if (atFocus) {
            heatVal.textContent = '100% (Extreme Heat!)';
            heatVal.style.color = '#ef4444';
            if (this.holdTime >= 3.0) {
                this.isBurning = true;
                markSimCompleted('sim3');
                obs.innerHTML = '<strong>The paper starts burning!</strong> Smoke is rising and charred black spots appear at the focal point. <em>Conclusion:</em> The tiny bright spot is the <strong>REAL IMAGE of the Sun</strong> concentrating all solar heat!';
            } else {
                obs.innerHTML = 'Paper is at the principal focus F (20 cm). A tiny, intensely bright pinpoint spot of sunlight forms! Hold steady for 3 seconds to ignite paper.';
            }
        } else {
            this.isBurning = false;
            const diff = Math.abs(this.paperPos - 20);
            const heatPct = Math.max(10, Math.round(100 - diff * 4.5));
            heatVal.textContent = `${heatPct}% (Diffused)`;
            heatVal.style.color = '#38bdf8';
            obs.innerHTML = `The paper is at ${this.paperPos.toFixed(1)} cm. Sunbeams form a large, diffused bright circle. Heat is scattered and the paper does not burn.`;
        }
    },

    draw(time = 0) {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        ctx.clearRect(0, 0, w, h);

        // Deep blue sky / lab background
        ctx.fillStyle = '#070a12';
        ctx.fillRect(0, 0, w, h);

        const mirrorX = 680;
        const mirrorCenterY = 190;
        const focalLength = 20; // cm
        const pxPerCm = 15;
        const focusX = mirrorX - focalLength * pxPerCm; // 380
        const paperX = mirrorX - this.paperPos * pxPerCm;

        // Principal Axis
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(40, mirrorCenterY);
        ctx.lineTo(w - 40, mirrorCenterY);
        ctx.stroke();

        // Concave Mirror Arc
        ctx.save();
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(mirrorX + 160, mirrorCenterY, 200, Math.PI - 0.7, Math.PI + 0.7);
        ctx.stroke();

        // Shading on outer back
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        for (let a = Math.PI - 0.65; a <= Math.PI + 0.65; a += 0.12) {
            const rx = mirrorX + 160 + 200 * Math.cos(a);
            const ry = mirrorCenterY + 200 * Math.sin(a);
            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.lineTo(rx + 8, ry - 4);
            ctx.stroke();
        }
        ctx.restore();

        // Incoming Parallel Sun Rays from left
        const rayYs = [90, 130, 160, 220, 250, 290];
        ctx.save();
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 6;

        rayYs.forEach(ry => {
            // Find mirror intersection
            const dy = ry - mirrorCenterY;
            const dx = 200 - Math.sqrt(Math.max(0, 200 * 200 - dy * dy));
            const hitX = (mirrorX + 160 - 200) + dx;

            // Incident ray
            ctx.beginPath();
            ctx.moveTo(60, ry);
            ctx.lineTo(hitX, ry);
            ctx.stroke();

            // Reflected ray converging to Focus F (focusX, mirrorCenterY)
            ctx.beginPath();
            ctx.moveTo(hitX, ry);
            ctx.lineTo(focusX, mirrorCenterY);
            // extend ray past focus
            const extX = focusX - (hitX - focusX) * 0.4;
            const extY = mirrorCenterY - (ry - mirrorCenterY) * 0.4;
            ctx.lineTo(extX, extY);
            ctx.stroke();
        });
        ctx.restore();

        // Focus Mark F
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(focusX, mirrorCenterY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f87171';
        ctx.font = '12px Space Mono, monospace';
        ctx.fillText('Focus F (20cm)', focusX - 45, mirrorCenterY + 22);

        // Paper Screen at paperX
        ctx.save();
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(paperX - 3, 110, 6, 160);
        ctx.strokeStyle = '#cbd5e1';
        ctx.strokeRect(paperX - 3, 110, 6, 160);

        // Spot on the paper
        const diff = Math.abs(this.paperPos - 20);
        const spotRadius = Math.max(3, diff * 1.5);
        const atFocus = diff < 1.0;

        ctx.fillStyle = atFocus ? '#ffffff' : 'rgba(254, 240, 138, 0.7)';
        ctx.shadowColor = atFocus ? '#ef4444' : '#fbbf24';
        ctx.shadowBlur = atFocus ? 20 : 6;
        ctx.beginPath();
        ctx.arc(paperX, mirrorCenterY, spotRadius, 0, Math.PI * 2);
        ctx.fill();

        // Burn effects: Smoke & sparks if burning
        if (this.isBurning) {
            ctx.fillStyle = '#451a03';
            ctx.beginPath();
            ctx.arc(paperX, mirrorCenterY, 5, 0, Math.PI * 2);
            ctx.fill();

            // Emit smoke particles
            if (Math.random() < 0.4) {
                this.particles.push({
                    x: paperX + (Math.random() - 0.5) * 4,
                    y: mirrorCenterY,
                    vx: (Math.random() - 0.5) * 0.8,
                    vy: -1.2 - Math.random() * 1.5,
                    alpha: 0.8,
                    size: 3 + Math.random() * 4
                });
            }

            // Draw particles
            this.particles.forEach((p, idx) => {
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= 0.015;
                p.size += 0.08;
                ctx.fillStyle = `rgba(148, 163, 184, ${p.alpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
            this.particles = this.particles.filter(p => p.alpha > 0);
        }
        ctx.restore();

        // Labels
        ctx.fillStyle = '#fbbf24';
        ctx.font = '12px Space Mono, monospace';
        ctx.fillText('Parallel Sunlight Rays', 70, 75);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('Concave Mirror', mirrorX - 40, 60);
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(`Paper Screen (${this.paperPos}cm)`, paperX - 45, 95);
    }
};


/* ════════════════════════════════════════════════════════════════════
   SIMULATION 4: IMAGE FORMED BY CONCAVE MIRROR (OPTICAL BENCH)
   ════════════════════════════════════════════════════════════════════ */
const Sim4 = {
    canvas: null,
    ctx: null,
    u: 50, // cm
    f: 15, // cm
    screenPos: 21.4,
    recordCount: 1,

    init() {
        this.canvas = document.getElementById('canvas-sim4');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        const uSlider = document.getElementById('sim4-u-slider');
        const uVal = document.getElementById('sim4-u-slider-val');
        const fSlider = document.getElementById('sim4-f-slider');
        const fVal = document.getElementById('sim4-f-val');
        const screenSlider = document.getElementById('sim4-screen-slider');
        const screenVal = document.getElementById('sim4-screen-slider-val');
        const btnSnapScreen = document.getElementById('sim4-btn-snap-screen');
        const btnRecord = document.getElementById('sim4-btn-record');
        const btnReset = document.getElementById('sim4-btn-reset');

        uSlider?.addEventListener('input', (e) => {
            this.u = parseFloat(e.target.value);
            uVal.textContent = `${this.u} cm`;
            this.updatePhysics();
        });

        fSlider?.addEventListener('input', (e) => {
            this.f = parseFloat(e.target.value);
            fVal.textContent = `${this.f} cm (C = ${this.f * 2} cm)`;
            this.updatePhysics();
        });

        screenSlider?.addEventListener('input', (e) => {
            this.screenPos = parseFloat(e.target.value);
            this.updatePhysics();
        });

        btnSnapScreen?.addEventListener('click', () => {
            const v = this.computeV();
            if (v > 0 && isFinite(v)) {
                this.screenPos = Math.round(v * 10) / 10;
                if (screenSlider) screenSlider.value = this.screenPos;
                this.updatePhysics();
            }
        });

        btnRecord?.addEventListener('click', () => {
            this.recordReading();
        });

        btnReset?.addEventListener('click', () => {
            this.u = 50;
            this.f = 15;
            this.screenPos = 21.4;
            if (uSlider) uSlider.value = 50;
            if (uVal) uVal.textContent = '50 cm';
            if (fSlider) fSlider.value = 15;
            if (fVal) fVal.textContent = '15 cm (C = 30 cm)';
            if (screenSlider) screenSlider.value = 21.4;
            this.updatePhysics();
        });

        // Presets
        document.querySelectorAll('#view-sim4 .btn-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                this.u = parseFloat(btn.getAttribute('data-u'));
                if (uSlider) uSlider.value = this.u;
                if (uVal) uVal.textContent = `${this.u} cm`;
                this.updatePhysics();
            });
        });

        this.updatePhysics();
        this.draw();
    },

    computeV() {
        // Cartesian formula: 1/v = 1/f - 1/u => v = (u * f) / (u - f)
        if (Math.abs(this.u - this.f) < 0.2) return Infinity;
        return (this.u * this.f) / (this.u - this.f);
    },

    updatePhysics() {
        const v = this.computeV();
        const m = isFinite(v) ? -v / this.u : -Infinity;

        const uValEl = document.getElementById('sim4-u-val');
        const vValEl = document.getElementById('sim4-v-val');
        const mValEl = document.getElementById('sim4-m-val');
        const natureEl = document.getElementById('sim4-nature-val');
        const screenVal = document.getElementById('sim4-screen-slider-val');
        const obs = document.getElementById('sim4-observation');

        uValEl.textContent = `${this.u.toFixed(1)} cm`;

        if (!isFinite(v)) {
            vValEl.textContent = 'At Infinity (∞)';
            mValEl.textContent = 'Highly Magnified';
            natureEl.textContent = 'Real, Inverted at ∞';
            obs.innerHTML = 'Object is at <strong>Focus F (15 cm)</strong>! Reflected rays emerge <strong>parallel</strong> and meet at infinity. No sharp image can be focused on a nearby screen.';
            return;
        }

        vValEl.textContent = `${Math.abs(v).toFixed(1)} cm ${v < 0 ? '(Behind Mirror)' : ''}`;
        mValEl.textContent = `${m.toFixed(2)}`;

        let sizeText = Math.abs(m) < 0.95 ? 'Smaller (Diminished)' : (Math.abs(m) > 1.05 ? 'Larger (Magnified)' : 'Same Size');
        let orientText = v > 0 ? 'Inverted' : 'Erect';
        let natureText = v > 0 ? 'Real' : 'Virtual';

        natureEl.textContent = `${natureText}, ${orientText}, ${sizeText}`;

        const isSharp = v > 0 && Math.abs(this.screenPos - v) < 1.2;
        screenVal.textContent = `${this.screenPos.toFixed(1)} cm ${isSharp ? '(In Sharp Focus!)' : ''}`;

        if (v < 0) {
            obs.innerHTML = `At u = ${this.u} cm (inside focus F), rays diverge after reflection. Their virtual back-extensions form a <strong>virtual, erect, and magnified</strong> image behind the mirror! The screen cannot catch it.`;
        } else {
            obs.innerHTML = `At u = ${this.u} cm, a <strong>${natureText.toLowerCase()}, ${orientText.toLowerCase()}, and ${sizeText.toLowerCase()}</strong> image is formed at v = ${v.toFixed(1)} cm. ${isSharp ? '✨ <strong>The screen is aligned: inverted flame is razor-sharp!</strong>' : 'Move the screen to align with v for a sharp flame.'}`;
        }
    },

    recordReading() {
        if (this.recordCount >= 5) return;
        this.recordCount++;

        const v = this.computeV();
        const m = isFinite(v) ? -v / this.u : -Infinity;
        const tbody = document.getElementById('sim4-table-body');
        const countBadge = document.getElementById('sim4-table-count');

        let isSmaller = Math.abs(m) < 0.95 ? '✓ Yes' : '—';
        let isLarger = Math.abs(m) > 1.05 ? '✓ Yes' : (Math.abs(m) >= 0.95 && Math.abs(m) <= 1.05 ? 'Same Size' : '—');
        let orient = v > 0 ? 'Inverted' : 'Erect';
        let nature = v > 0 ? 'Real' : 'Virtual';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${this.recordCount}</td>
            <td>${this.u} cm</td>
            <td>${isSmaller}</td>
            <td>${isLarger}</td>
            <td>${orient}</td>
            <td>${nature}</td>
        `;
        tbody?.appendChild(tr);
        countBadge.textContent = `${this.recordCount} of 5 Readings Recorded`;

        if (this.recordCount >= 4) {
            markSimCompleted('sim4');
        }
    },

    draw(time = 0) {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        ctx.clearRect(0, 0, w, h);

        ctx.fillStyle = '#080d19';
        ctx.fillRect(0, 0, w, h);

        const mirrorX = 640;
        const axisY = 230;
        const scale = 7.0; // px per cm

        // Optical bench scale
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(30, axisY + 80);
        ctx.lineTo(w - 30, axisY + 80);
        ctx.stroke();

        for (let cm = 0; cm <= 80; cm += 10) {
            const bx = mirrorX - cm * scale;
            if (bx >= 30) {
                ctx.beginPath();
                ctx.moveTo(bx, axisY + 80);
                ctx.lineTo(bx, axisY + 88);
                ctx.stroke();
                ctx.fillStyle = '#64748b';
                ctx.font = '9px Space Mono, monospace';
                ctx.fillText(`${cm}`, bx - 5, axisY + 102);
            }
        }

        // Principal Axis
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(30, axisY);
        ctx.lineTo(w - 30, axisY);
        ctx.stroke();

        // Points F and C
        const fX = mirrorX - this.f * scale;
        const cX = mirrorX - (this.f * 2) * scale;

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(fX, axisY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText(`F (${this.f})`, fX - 12, axisY + 18);

        ctx.beginPath();
        ctx.arc(cX, axisY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText(`C (${this.f * 2})`, cX - 12, axisY + 18);

        // Concave Mirror Arc at mirrorX
        ctx.save();
        ctx.lineWidth = 7;
        ctx.strokeStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(mirrorX + 180, axisY, 200, Math.PI - 0.55, Math.PI + 0.55);
        ctx.stroke();

        // Shading on back
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        for (let a = Math.PI - 0.5; a <= Math.PI + 0.5; a += 0.12) {
            const rx = mirrorX + 180 + 200 * Math.cos(a);
            const ry = axisY + 200 * Math.sin(a);
            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.lineTo(rx + 6, ry - 3);
            ctx.stroke();
        }
        ctx.restore();

        // Object Candle
        const objX = mirrorX - this.u * scale;
        const ho = 40; // px
        this.drawCandle(ctx, objX, axisY, ho, false, time);

        // Compute Image
        const v = this.computeV();
        const m = isFinite(v) ? -v / this.u : 0;
        const hi = ho * m;

        if (isFinite(v)) {
            const imgX = mirrorX - v * scale;
            if (imgX > 20 && imgX < w - 20) {
                this.drawCandle(ctx, imgX, axisY, Math.abs(hi), v < 0, time, v > 0);
            }

            // Ray Diagrams (3 Principal Rays)
            ctx.save();
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 1.5;

            // Ray 1: Parallel to axis -> reflects through F
            ctx.beginPath();
            ctx.moveTo(objX, axisY - ho);
            ctx.lineTo(mirrorX, axisY - ho);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(mirrorX, axisY - ho);
            if (v > 0) {
                ctx.lineTo(imgX, axisY - hi);
            } else {
                ctx.lineTo(fX, axisY);
                // virtual extension behind mirror
                ctx.setLineDash([3, 3]);
                ctx.strokeStyle = '#94a3b8';
                ctx.beginPath();
                ctx.moveTo(mirrorX, axisY - ho);
                ctx.lineTo(imgX, axisY - hi);
                ctx.stroke();
            }
            ctx.stroke();
            ctx.restore();
        }

        // Draggable Screen
        if (v > 0) {
            const scX = mirrorX - this.screenPos * scale;
            const isSharp = Math.abs(this.screenPos - v) < 1.2;
            ctx.save();
            ctx.fillStyle = isSharp ? '#22c55e' : '#f59e0b';
            ctx.fillRect(scX - 3, axisY - 55, 6, 110);
            ctx.strokeStyle = '#ffffff';
            ctx.strokeRect(scX - 3, axisY - 55, 6, 110);

            // Screen flame preview
            ctx.fillStyle = isSharp ? '#ffffff' : 'rgba(251, 191, 36, 0.3)';
            ctx.beginPath();
            ctx.arc(scX, axisY - hi * 0.7, isSharp ? 6 : 14, 0, Math.PI * 2);
            ctx.fill();

            ctx.font = '10px Space Mono, monospace';
            ctx.fillText(isSharp ? 'SHARP FLAME' : 'BLURRY', scX - 25, axisY - 65);
            ctx.restore();
        }

        ctx.fillStyle = '#f8fafc';
        ctx.font = '12px Space Mono, monospace';
        ctx.fillText(`Concave Mirror (f = ${this.f}cm)`, mirrorX - 70, 60);
    },

    drawCandle(ctx, x, groundY, h, isVirtual, time, isInverted = false) {
        ctx.save();
        if (isVirtual) {
            ctx.globalAlpha = 0.55;
            ctx.setLineDash([3, 3]);
        }
        const dir = isInverted ? 1 : -1;

        // Stick
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(x - 5, groundY, 10, dir * h * 0.75);
        ctx.strokeStyle = '#94a3b8';
        ctx.strokeRect(x - 5, groundY, 10, dir * h * 0.75);

        // Flame
        const flameY = groundY + dir * (h * 0.75);
        const flicker = isVirtual ? 0 : Math.sin(time * 0.02) * 1.5;
        const grad = ctx.createRadialGradient(x + flicker, flameY + dir * 6, 1, x, flameY + dir * 6, 10);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.5, '#fde047');
        grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(x + flicker, flameY + dir * 6, 5, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
};


/* ════════════════════════════════════════════════════════════════════
   SIMULATION 5: CONVEX MIRROR (WIDE FIELD OF VIEW)
   ════════════════════════════════════════════════════════════════════ */
const Sim5 = {
    canvas: null,
    ctx: null,
    u: 35, // cm
    f: 15, // cm
    recordCount: 1,

    init() {
        this.canvas = document.getElementById('canvas-sim5');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        const uSlider = document.getElementById('sim5-u-slider');
        const uVal = document.getElementById('sim5-u-slider-val');
        const btnRecord = document.getElementById('sim5-btn-record');
        const btnReset = document.getElementById('sim5-btn-reset');

        uSlider?.addEventListener('input', (e) => {
            this.u = parseFloat(e.target.value);
            uVal.textContent = `${this.u} cm`;
            this.updatePhysics();
        });

        btnRecord?.addEventListener('click', () => {
            this.recordReading();
        });

        btnReset?.addEventListener('click', () => {
            this.u = 35;
            if (uSlider) uSlider.value = 35;
            if (uVal) uVal.textContent = '35 cm';
            this.updatePhysics();
        });

        this.updatePhysics();
        this.draw();
    },

    computeV() {
        // Convex mirror: focal length is behind mirror (+f in sign convention for virtual focus)
        // 1/v + 1/(-u) = 1/(+f) => v = (u * f) / (u + f)
        return (this.u * this.f) / (this.u + this.f);
    },

    updatePhysics() {
        const v = this.computeV();
        const m = v / this.u; // erect, diminished

        document.getElementById('sim5-u-val').textContent = `${this.u.toFixed(1)} cm`;
        document.getElementById('sim5-v-val').textContent = `${v.toFixed(1)} cm (Behind Mirror)`;
        document.getElementById('sim5-m-val').textContent = `+${m.toFixed(2)}`;

        const obs = document.getElementById('sim5-observation');
        obs.innerHTML = `At u = ${this.u} cm, the image is formed behind the mirror at v = ${v.toFixed(1)} cm. It is <strong>virtual, erect (upright), and diminished (${(m * 100).toFixed(0)}% size)</strong>. The screen captures nothing!`;
    },

    recordReading() {
        if (this.recordCount >= 4) return;
        this.recordCount++;

        const v = this.computeV();
        const tbody = document.getElementById('sim5-table-body');
        const countBadge = document.getElementById('sim5-table-count');

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${this.recordCount}</td>
            <td>${this.u} cm</td>
            <td>Smaller (Diminished)</td>
            <td>Erect</td>
            <td>Virtual</td>
        `;
        tbody?.appendChild(tr);
        countBadge.textContent = `${this.recordCount} of 4 Readings Recorded`;

        if (this.recordCount >= 3) {
            markSimCompleted('sim5');
        }
    },

    draw(time = 0) {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        ctx.clearRect(0, 0, w, h);

        const subtab = AppState.activeSubtabs.sim5;
        if (subtab === 'sim5-fov') {
            this.drawFieldOfViewComparison(time);
            return;
        } else if (subtab === 'sim5-diff') {
            this.drawDifferencesTable();
            return;
        }

        ctx.fillStyle = '#080d19';
        ctx.fillRect(0, 0, w, h);

        const mirrorX = 420;
        const axisY = 220;
        const scale = 5.5;

        // Principal Axis
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(30, axisY);
        ctx.lineTo(w - 30, axisY);
        ctx.stroke();

        // Convex Mirror Arc (Bulging towards left)
        ctx.save();
        ctx.lineWidth = 7;
        ctx.strokeStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(mirrorX - 180, axisY, 200, -0.55, 0.55);
        ctx.stroke();

        // Silvered inner backing
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        for (let a = -0.5; a <= 0.5; a += 0.12) {
            const rx = mirrorX - 180 + 200 * Math.cos(a);
            const ry = axisY + 200 * Math.sin(a);
            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.lineTo(rx + 6, ry + 4);
            ctx.stroke();
        }
        ctx.restore();

        // Virtual Focus F behind mirror
        const fX = mirrorX + this.f * scale;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(fX, axisY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText(`Virtual F (${this.f}cm)`, fX - 35, axisY + 18);

        // Real Object Candle
        const objX = mirrorX - this.u * scale;
        const ho = 45;
        Sim4.drawCandle(ctx, objX, axisY, ho, false, time);

        // Virtual Diminished Image Candle behind mirror
        const v = this.computeV();
        const imgX = mirrorX + v * scale;
        const hi = ho * (v / this.u);
        Sim4.drawCandle(ctx, imgX, axisY, hi, true, time);

        // Rays:
        // Ray 1: Parallel to axis -> reflects diverging as if from F
        ctx.save();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(objX, axisY - ho);
        ctx.lineTo(mirrorX, axisY - ho);
        ctx.stroke();

        // Diverging reflected ray
        const divAngle = Math.atan2((axisY - ho) - axisY, mirrorX - fX);
        ctx.beginPath();
        ctx.moveTo(mirrorX, axisY - ho);
        ctx.lineTo(mirrorX - 120, axisY - ho - 60);
        ctx.stroke();

        // Dotted backward extension to F
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(mirrorX, axisY - ho);
        ctx.lineTo(fX, axisY);
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#f8fafc';
        ctx.font = '12px Space Mono, monospace';
        ctx.fillText('Convex Mirror (Bulging Outwards)', mirrorX - 90, 55);
    },

    drawFieldOfViewComparison(time) {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.fillStyle = '#060a12';
        ctx.fillRect(0, 0, w, h);

        // Left Half: Plane Mirror (Narrow field)
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w / 2, h);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = '14px Space Mono, monospace';
        ctx.fillText('PLANE MIRROR: Narrow Field of View', 40, 40);
        ctx.fillText('CONVEX MIRROR: Broad Field of View', w / 2 + 30, 40);

        // Plane mirror
        const pmX = 140;
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(pmX - 2, 100, 4, 120);

        // Narrow cone of view
        ctx.fillStyle = 'rgba(56, 189, 248, 0.1)';
        ctx.beginPath();
        ctx.moveTo(pmX, 160);
        ctx.lineTo(380, 80);
        ctx.lineTo(380, 240);
        ctx.closePath();
        ctx.fill();

        // Convex mirror
        const cmX = w / 2 + 130;
        ctx.save();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(cmX + 60, 160, 80, Math.PI - 0.7, Math.PI + 0.7);
        ctx.stroke();
        ctx.restore();

        // Wide panoramic cone of view
        ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
        ctx.beginPath();
        ctx.moveTo(cmX - 20, 160);
        ctx.lineTo(w - 20, 40);
        ctx.lineTo(w - 20, 290);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText('Captures only 1 vehicle lane', 80, 280);
        ctx.fillStyle = '#10b981';
        ctx.fillText('Captures multiple road lanes & pedestrian sidewalks!', w / 2 + 30, 310);
    },

    drawDifferencesTable() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.fillStyle = '#080d1a';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '16px EB Garamond, serif';
        ctx.fillText('5 Key Differences: Concave Mirror vs. Convex Mirror', 40, 40);

        const diffs = [
            ['1. Shape', 'Curved inwards (like inner bowl of spoon)', 'Curved outwards (bulges like back of spoon)'],
            ['2. Action on Rays', 'Converging mirror (focuses parallel rays)', 'Diverging mirror (spreads rays outward)'],
            ['3. Focus Nature', 'Real focus (in front of the mirror)', 'Virtual focus (behind the mirror)'],
            ['4. Image Types', 'Can form Real or Virtual, Magnified or Diminished', 'ALWAYS forms Virtual, Erect, Diminished images'],
            ['5. Chief Applications', 'Dentist mirror, solar furnace, shaving mirror', 'Car side-view mirror, blind corners, ATM security']
        ];

        let y = 80;
        diffs.forEach(([col1, col2, col3]) => {
            ctx.fillStyle = '#38bdf8';
            ctx.font = '12px Space Mono, monospace';
            ctx.fillText(col1, 40, y);
            ctx.fillStyle = '#fde047';
            ctx.fillText(col2, 180, y);
            ctx.fillStyle = '#34d399';
            ctx.fillText(col3, 490, y);
            y += 45;
        });
    }
};


/* ════════════════════════════════════════════════════════════════════
   SIMULATION 6: CONVEX LENS (CONVERGING LENS)
   ════════════════════════════════════════════════════════════════════ */
const Sim6 = {
    canvas: null,
    ctx: null,
    u: 45, // cm
    f: 15, // cm
    screenPos: 22.5,
    recordCount: 1,

    init() {
        this.canvas = document.getElementById('canvas-sim6');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        const uSlider = document.getElementById('sim6-u-slider');
        const uVal = document.getElementById('sim6-u-slider-val');
        const fSlider = document.getElementById('sim6-f-slider');
        const fVal = document.getElementById('sim6-f-val');
        const screenSlider = document.getElementById('sim6-screen-slider');
        const btnSnap = document.getElementById('sim6-btn-snap-screen');
        const btnRecord = document.getElementById('sim6-btn-record');
        const btnReset = document.getElementById('sim6-btn-reset');

        uSlider?.addEventListener('input', (e) => {
            this.u = parseFloat(e.target.value);
            uVal.textContent = `${this.u} cm`;
            this.updatePhysics();
        });

        fSlider?.addEventListener('input', (e) => {
            this.f = parseFloat(e.target.value);
            fVal.textContent = `${this.f} cm (2F = ${this.f * 2} cm)`;
            this.updatePhysics();
        });

        screenSlider?.addEventListener('input', (e) => {
            this.screenPos = parseFloat(e.target.value);
            this.updatePhysics();
        });

        btnSnap?.addEventListener('click', () => {
            const v = this.computeV();
            if (v > 0 && isFinite(v)) {
                this.screenPos = Math.round(v * 10) / 10;
                if (screenSlider) screenSlider.value = this.screenPos;
                this.updatePhysics();
            }
        });

        btnRecord?.addEventListener('click', () => {
            this.recordReading();
        });

        btnReset?.addEventListener('click', () => {
            this.u = 45;
            this.f = 15;
            this.screenPos = 22.5;
            if (uSlider) uSlider.value = 45;
            if (uVal) uVal.textContent = '45 cm';
            if (fSlider) fSlider.value = 15;
            if (screenSlider) screenSlider.value = 22.5;
            this.updatePhysics();
        });

        // Presets
        document.querySelectorAll('#view-sim6 .btn-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                this.u = parseFloat(btn.getAttribute('data-u'));
                if (uSlider) uSlider.value = this.u;
                if (uVal) uVal.textContent = `${this.u} cm`;
                this.updatePhysics();
            });
        });

        this.updatePhysics();
        this.draw();
    },

    computeV() {
        // Lens formula: 1/v - 1/(-u) = 1/f => 1/v = 1/f - 1/u => v = (f * u) / (u - f)
        if (Math.abs(this.u - this.f) < 0.2) return Infinity;
        return (this.f * this.u) / (this.u - this.f);
    },

    updatePhysics() {
        const v = this.computeV();
        const m = isFinite(v) ? -v / this.u : -Infinity;

        document.getElementById('sim6-u-val').textContent = `${this.u.toFixed(1)} cm`;
        const vVal = document.getElementById('sim6-v-val');
        const mVal = document.getElementById('sim6-m-val');
        const natureVal = document.getElementById('sim6-nature-val');
        const screenVal = document.getElementById('sim6-screen-slider-val');
        const obs = document.getElementById('sim6-observation');

        if (!isFinite(v)) {
            vVal.textContent = 'Infinity (∞)';
            mVal.textContent = 'Highly Magnified';
            natureVal.textContent = 'Real, Inverted at ∞';
            obs.innerHTML = 'Object is at <strong>Focus F (15 cm)</strong>! Refracted rays emerge parallel and meet at infinity.';
            return;
        }

        vVal.textContent = `${Math.abs(v).toFixed(1)} cm ${v < 0 ? '(Same Side - Virtual)' : ''}`;
        mVal.textContent = `${m.toFixed(2)}`;

        let sizeText = Math.abs(m) < 0.95 ? 'Smaller' : (Math.abs(m) > 1.05 ? 'Magnified' : 'Equal');
        let orientText = v > 0 ? 'Inverted' : 'Erect';
        let natureText = v > 0 ? 'Real' : 'Virtual';

        natureVal.textContent = `${natureText}, ${orientText}, ${sizeText}`;

        const isSharp = v > 0 && Math.abs(this.screenPos - v) < 1.2;
        screenVal.textContent = `${this.screenPos.toFixed(1)} cm ${isSharp ? '(In Sharp Focus!)' : ''}`;

        if (v < 0) {
            obs.innerHTML = `Object is inside focus F (u = ${this.u} cm). The lens acts as a <strong>magnifying glass</strong>: forming an <strong>erect, virtual, and magnified</strong> image on the same side.`;
        } else {
            obs.innerHTML = `At u = ${this.u} cm, a <strong>${natureText.toLowerCase()}, ${orientText.toLowerCase()}, and ${sizeText.toLowerCase()}</strong> image is formed at v = ${v.toFixed(1)} cm. ${isSharp ? '✨ Inverted sharp flame captured on screen!' : 'Adjust screen to capture image.'}`;
        }
    },

    recordReading() {
        if (this.recordCount >= 5) return;
        this.recordCount++;

        const v = this.computeV();
        const m = isFinite(v) ? -v / this.u : -Infinity;
        const tbody = document.getElementById('sim6-table-body');
        const countBadge = document.getElementById('sim6-table-count');

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${this.recordCount}</td>
            <td>${this.u} cm</td>
            <td>${Math.abs(m) < 0.95 ? 'Smaller' : 'Larger'}</td>
            <td>${v > 0 ? 'Inverted' : 'Erect'}</td>
            <td>${v > 0 ? 'Real' : 'Virtual'}</td>
        `;
        tbody?.appendChild(tr);
        countBadge.textContent = `${this.recordCount} of 5 Readings Recorded`;

        if (this.recordCount >= 4) {
            markSimCompleted('sim6');
        }
    },

    draw(time = 0) {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        ctx.clearRect(0, 0, w, h);

        const subtab = AppState.activeSubtabs.sim6;
        if (subtab === 'sim6-sun') {
            this.drawSunBurning();
            return;
        } else if (subtab === 'sim6-converge') {
            this.drawConvergingAction();
            return;
        }

        ctx.fillStyle = '#080d19';
        ctx.fillRect(0, 0, w, h);

        const lensX = 420;
        const axisY = 220;
        const scale = 6.0;

        // Principal Axis
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(30, axisY);
        ctx.lineTo(w - 30, axisY);
        ctx.stroke();

        // Lens Shape (Convex - thick in center)
        ctx.save();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(lensX, axisY, 18, 110, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Focus marks F1, 2F1 (left) and F2, 2F2 (right)
        const f1X = lensX - this.f * scale;
        const f2X = lensX + this.f * scale;

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(f1X, axisY, 3, 0, Math.PI * 2);
        ctx.arc(f2X, axisY, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '10px Space Mono, monospace';
        ctx.fillText('F₁', f1X - 6, axisY + 16);
        ctx.fillText('F₂', f2X - 6, axisY + 16);

        // Object Candle
        const objX = lensX - this.u * scale;
        const ho = 40;
        Sim4.drawCandle(ctx, objX, axisY, ho, false, time);

        // Compute Image
        const v = this.computeV();
        const m = isFinite(v) ? -v / this.u : 0;
        const hi = ho * m;

        if (isFinite(v)) {
            const imgX = lensX + v * scale;
            if (imgX > 20 && imgX < w - 20) {
                Sim4.drawCandle(ctx, imgX, axisY, Math.abs(hi), v < 0, time, v > 0);
            }

            // Rays
            ctx.save();
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 1.5;

            // Ray 1: Parallel to axis -> refracts through F2
            ctx.beginPath();
            ctx.moveTo(objX, axisY - ho);
            ctx.lineTo(lensX, axisY - ho);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(lensX, axisY - ho);
            if (v > 0) {
                ctx.lineTo(imgX, axisY - hi);
            } else {
                ctx.lineTo(f2X + 120, axisY + 50);
                // virtual backward extension
                ctx.setLineDash([3, 3]);
                ctx.strokeStyle = '#94a3b8';
                ctx.beginPath();
                ctx.moveTo(lensX, axisY - ho);
                ctx.lineTo(imgX, axisY - hi);
                ctx.stroke();
            }
            ctx.stroke();
            ctx.restore();
        }

        // Draggable Screen on other side
        if (v > 0) {
            const scX = lensX + this.screenPos * scale;
            const isSharp = Math.abs(this.screenPos - v) < 1.2;
            ctx.save();
            ctx.fillStyle = isSharp ? '#22c55e' : '#f59e0b';
            ctx.fillRect(scX - 3, axisY - 50, 6, 100);
            ctx.restore();
        }

        ctx.fillStyle = '#f8fafc';
        ctx.font = '12px Space Mono, monospace';
        ctx.fillText(`Convex Lens (f = ${this.f}cm)`, lensX - 65, 55);
    },

    drawSunBurning() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        ctx.fillStyle = '#060a12';
        ctx.fillRect(0, 0, w, h);

        const lensX = 320;
        const fX = lensX + 180;
        const axisY = 190;

        // Convex lens
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(lensX, axisY, 16, 90, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Parallel sun rays converging
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 2;
        [-60, -30, 0, 30, 60].forEach(dy => {
            ctx.beginPath();
            ctx.moveTo(40, axisY + dy);
            ctx.lineTo(lensX, axisY + dy);
            ctx.lineTo(fX, axisY);
            ctx.stroke();
        });

        // Burning paper sheet
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(fX - 3, axisY - 50, 6, 100);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(fX, axisY, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f8fafc';
        ctx.font = '13px Space Mono, monospace';
        ctx.fillText('Real Image of the Sun by Convex Lens', 220, 50);
        ctx.fillText('Paper burns at Focus F due to concentrated solar heat', 200, 320);
    },

    drawConvergingAction() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        ctx.fillStyle = '#070a14';
        ctx.fillRect(0, 0, w, h);

        const lensX = 400;
        const fX = lensX + 220;
        const axisY = 190;

        // Rays
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        [-70, -45, -20, 0, 20, 45, 70].forEach(dy => {
            ctx.beginPath();
            ctx.moveTo(80, axisY + dy);
            ctx.lineTo(lensX, axisY + dy);
            ctx.lineTo(fX, axisY);
            ctx.stroke();
        });

        ctx.fillStyle = '#f8fafc';
        ctx.font = '14px Space Mono, monospace';
        ctx.fillText('Convex Lens = CONVERGING LENS (Thick in Middle)', 200, 50);
    }
};


/* ════════════════════════════════════════════════════════════════════
   SIMULATION 7: CONCAVE LENS (DIVERGING LENS)
   ════════════════════════════════════════════════════════════════════ */
const Sim7 = {
    canvas: null,
    ctx: null,
    u: 30, // cm
    f: 15, // cm

    init() {
        this.canvas = document.getElementById('canvas-sim7');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        const uSlider = document.getElementById('sim7-u-slider');
        const uVal = document.getElementById('sim7-u-slider-val');
        const btnReset = document.getElementById('sim7-btn-reset');
        const btnRecord = document.getElementById('sim7-btn-record');

        uSlider?.addEventListener('input', (e) => {
            this.u = parseFloat(e.target.value);
            uVal.textContent = `${this.u} cm`;
            this.updatePhysics();
        });

        btnRecord?.addEventListener('click', () => {
            markSimCompleted('sim7');
        });

        btnReset?.addEventListener('click', () => {
            this.u = 30;
            if (uSlider) uSlider.value = 30;
            if (uVal) uVal.textContent = '30 cm';
            this.updatePhysics();
        });

        this.updatePhysics();
        this.draw();
    },

    computeV() {
        // Concave lens: f = -f, u = -u => v = -(f * u) / (f + u)
        return -(this.f * this.u) / (this.f + this.u);
    },

    updatePhysics() {
        const v = this.computeV();
        const m = -v / this.u; // erect, diminished

        document.getElementById('sim7-u-val').textContent = `${this.u.toFixed(1)} cm`;
        document.getElementById('sim7-v-val').textContent = `${v.toFixed(1)} cm (Virtual)`;
        document.getElementById('sim7-m-val').textContent = `+${m.toFixed(2)}`;

        const obs = document.getElementById('sim7-observation');
        obs.innerHTML = `At u = ${this.u} cm, rays diverge through the concave lens. The virtual image is <strong>always virtual, upright (erect), and smaller</strong> (at v = ${Math.abs(v).toFixed(1)} cm in front of lens). The screen catches nothing!`;
    },

    draw(time = 0) {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        ctx.clearRect(0, 0, w, h);

        const subtab = AppState.activeSubtabs.sim7;
        if (subtab === 'sim7-burn') {
            this.drawPaperBurnDemo();
            return;
        } else if (subtab === 'sim7-diff') {
            this.drawDifferences();
            return;
        }

        ctx.fillStyle = '#080d19';
        ctx.fillRect(0, 0, w, h);

        const lensX = 460;
        const axisY = 220;
        const scale = 6.0;

        // Principal Axis
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(30, axisY);
        ctx.lineTo(w - 30, axisY);
        ctx.stroke();

        // Concave Lens Shape (Hourglass / thinner in middle)
        ctx.save();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(lensX - 16, axisY - 100);
        ctx.lineTo(lensX + 16, axisY - 100);
        ctx.quadraticCurveTo(lensX + 6, axisY, lensX + 16, axisY + 100);
        ctx.lineTo(lensX - 16, axisY + 100);
        ctx.quadraticCurveTo(lensX - 6, axisY, lensX - 16, axisY - 100);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Virtual focus on left
        const fX = lensX - this.f * scale;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(fX, axisY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText(`Virtual F (${this.f})`, fX - 35, axisY + 18);

        // Object Candle
        const objX = lensX - this.u * scale;
        const ho = 40;
        Sim4.drawCandle(ctx, objX, axisY, ho, false, time);

        // Virtual Diminished Image
        const v = Math.abs(this.computeV());
        const imgX = lensX - v * scale;
        const hi = ho * (v / this.u);
        Sim4.drawCandle(ctx, imgX, axisY, hi, true, time);

        // Diverging ray
        ctx.save();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(objX, axisY - ho);
        ctx.lineTo(lensX, axisY - ho);
        ctx.stroke();

        // Diverging out
        ctx.beginPath();
        ctx.moveTo(lensX, axisY - ho);
        ctx.lineTo(lensX + 140, axisY - ho - 40);
        ctx.stroke();

        // Dotted back to virtual F
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(lensX, axisY - ho);
        ctx.lineTo(fX, axisY);
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#f8fafc';
        ctx.font = '12px Space Mono, monospace';
        ctx.fillText('Concave Lens (Diverging)', lensX - 60, 55);
    },

    drawPaperBurnDemo() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        ctx.fillStyle = '#060a12';
        ctx.fillRect(0, 0, w, h);

        const lensX = 300;
        const axisY = 190;

        // Concave lens
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(lensX - 14, axisY - 80);
        ctx.lineTo(lensX + 14, axisY - 80);
        ctx.quadraticCurveTo(lensX + 4, axisY, lensX + 14, axisY + 80);
        ctx.lineTo(lensX - 14, axisY + 80);
        ctx.quadraticCurveTo(lensX - 4, axisY, lensX - 14, axisY - 80);
        ctx.stroke();

        // Parallel sunrays diverging outward
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 2;
        [-40, -20, 0, 20, 40].forEach(dy => {
            ctx.beginPath();
            ctx.moveTo(40, axisY + dy);
            ctx.lineTo(lensX, axisY + dy);
            ctx.lineTo(lensX + 220, axisY + dy * 2.2);
            ctx.stroke();
        });

        // Paper in diverging beam
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(520, axisY - 90, 8, 180);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '14px Space Mono, monospace';
        ctx.fillText('Can a Concave Lens Burn Paper? &rarr; NO!', 220, 50);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText('Paper Temperature: 24°C (Cool)', 540, axisY - 20);
        ctx.fillText('Rays spread out across a wide area instead of focusing!', 200, 330);
    },

    drawDifferences() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        ctx.fillStyle = '#080d19';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '16px EB Garamond, serif';
        ctx.fillText('5 Key Differences: Convex Lens vs. Concave Lens', 40, 40);

        const diffs = [
            ['1. Shape', 'Thicker in the middle, thinner at edges', 'Thinner in the middle, thicker at edges'],
            ['2. Optical Action', 'Converges parallel light rays', 'Diverges (spreads) parallel light rays'],
            ['3. Focus', 'Real focus on opposite side', 'Virtual focus on the same side'],
            ['4. Images Formed', 'Real & inverted (far) or Virtual & magnified (close)', 'ALWAYS Virtual, Erect, and Diminished'],
            ['5. Solar Burning', 'Concentrates sunlight and CAN burn paper', 'Spreads sunlight and CANNOT burn paper']
        ];

        let y = 80;
        diffs.forEach(([c1, c2, c3]) => {
            ctx.fillStyle = '#38bdf8';
            ctx.font = '12px Space Mono, monospace';
            ctx.fillText(c1, 40, y);
            ctx.fillStyle = '#fde047';
            ctx.fillText(c2, 190, y);
            ctx.fillStyle = '#34d399';
            ctx.fillText(c3, 500, y);
            y += 45;
        });
    }
};


/* ════════════════════════════════════════════════════════════════════
   SIMULATION 8: DISPERSION OF LIGHT (PRISM & RAINBOW)
   ════════════════════════════════════════════════════════════════════ */
const Sim8 = {
    canvas: null,
    ctx: null,
    angle: 0,
    beamWidth: 3,
    showLabels: true,

    init() {
        this.canvas = document.getElementById('canvas-sim8');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        const angleSlider = document.getElementById('sim8-angle-slider');
        const angleVal = document.getElementById('sim8-angle-val');
        const beamSlider = document.getElementById('sim8-beam-width');
        const btnLabelsOn = document.getElementById('sim8-btn-labels-on');
        const btnLabelsOff = document.getElementById('sim8-btn-labels-off');
        const btnReset = document.getElementById('sim8-btn-reset');

        angleSlider?.addEventListener('input', (e) => {
            this.angle = parseFloat(e.target.value);
            angleVal.textContent = `${this.angle}°`;
            markSimCompleted('sim8');
        });

        beamSlider?.addEventListener('input', (e) => {
            this.beamWidth = parseFloat(e.target.value);
        });

        btnLabelsOn?.addEventListener('click', () => {
            this.showLabels = true;
            btnLabelsOn.classList.add('active');
            btnLabelsOff.classList.remove('active');
        });

        btnLabelsOff?.addEventListener('click', () => {
            this.showLabels = false;
            btnLabelsOff.classList.add('active');
            btnLabelsOn.classList.remove('active');
        });

        btnReset?.addEventListener('click', () => {
            this.angle = 0;
            if (angleSlider) angleSlider.value = 0;
            if (angleVal) angleVal.textContent = '0°';
        });

        this.draw();
    },

    draw(time = 0) {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        ctx.clearRect(0, 0, w, h);

        const subtab = AppState.activeSubtabs.sim8;
        if (subtab === 'sim8-rainbow') {
            this.drawRainbow(time);
            return;
        }

        // Darkroom laboratory background
        ctx.fillStyle = '#05070d';
        ctx.fillRect(0, 0, w, h);

        // Window with slit on left
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, 70, h);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(68, 175, 4, 18); // slit

        // Collimated White Beam
        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = this.beamWidth;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(70, 184);
        const prismX = 380;
        const prismY = 200;
        ctx.lineTo(prismX - 45, 184);
        ctx.stroke();
        ctx.restore();

        // Prism Geometry
        ctx.save();
        ctx.translate(prismX, prismY);
        ctx.rotate((this.angle * Math.PI) / 180);

        ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, -75);
        ctx.lineTo(65, 55);
        ctx.lineTo(-65, 55);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // VIBGYOR Spectrum Dispersion
        // Violet bends most (highest n), Red bends least (lowest n)
        const spectrum = [
            { name: 'Red', color: '#ef4444', dev: 22 },
            { name: 'Orange', color: '#f97316', dev: 26 },
            { name: 'Yellow', color: '#eab308', dev: 30 },
            { name: 'Green', color: '#10b981', dev: 34 },
            { name: 'Blue', color: '#3b82f6', dev: 38 },
            { name: 'Indigo', color: '#6366f1', dev: 42 },
            { name: 'Violet', color: '#8b5cf6', dev: 46 }
        ];

        const screenX = 720;
        ctx.save();
        spectrum.forEach((col, idx) => {
            ctx.strokeStyle = col.color;
            ctx.lineWidth = 3;
            ctx.shadowColor = col.color;
            ctx.shadowBlur = 6;

            const exitY = 184 + idx * 2.2;
            const targetY = 110 + idx * 24 + this.angle * 1.5;

            ctx.beginPath();
            ctx.moveTo(prismX + 25, exitY);
            ctx.lineTo(screenX, targetY);
            ctx.stroke();
        });
        ctx.restore();

        // White Cardboard Screen on the right
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(screenX, 90, 8, 200);

        // Labels
        if (this.showLabels) {
            ctx.fillStyle = '#f8fafc';
            ctx.font = '12px Space Mono, monospace';
            ctx.fillText('White Light', 110, 165);
            ctx.fillStyle = '#38bdf8';
            ctx.fillText('Glass Prism', prismX - 45, 100);
            ctx.fillStyle = '#ef4444';
            ctx.fillText('Red (Least bent)', screenX + 15, 115);
            ctx.fillStyle = '#8b5cf6';
            ctx.fillText('Violet (Most bent)', screenX + 15, 270);
            ctx.fillStyle = '#e2e8f0';
            ctx.fillText('VIBGYOR Spectrum', screenX - 50, 310);
        }
    },

    drawRainbow(time) {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.fillStyle = '#0b1329';
        ctx.fillRect(0, 0, w, h);

        // Ground landscape
        ctx.fillStyle = '#166534';
        ctx.beginPath();
        ctx.ellipse(w / 2, h + 80, w * 0.7, 140, 0, 0, Math.PI * 2);
        ctx.fill();

        // Observer standing with BACK to the sun
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(180, 240, 10, 45); // body
        ctx.beginPath();
        ctx.arc(185, 230, 8, 0, Math.PI * 2);
        ctx.fill();

        // Sun behind observer on far left
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(60, 220, 28, 0, Math.PI * 2);
        ctx.fill();

        // Seven rainbow arcs in sky
        const rainbowColors = ['#ef4444', '#f97316', '#eab308', '#10b981', '#3b82f6', '#6366f1', '#8b5cf6'];
        ctx.save();
        rainbowColors.forEach((c, idx) => {
            ctx.strokeStyle = c;
            ctx.lineWidth = 5;
            ctx.globalAlpha = 0.85;
            ctx.beginPath();
            ctx.arc(520, 260, 180 - idx * 6, Math.PI, 0);
            ctx.stroke();
        });
        ctx.restore();

        ctx.fillStyle = '#f8fafc';
        ctx.font = '13px Space Mono, monospace';
        ctx.fillText('Sun (Behind Observer)', 20, 175);
        ctx.fillText('Observer (Facing Raindrops)', 120, 310);
        ctx.fillText('Rainbow Arch (7 Colours)', 450, 60);
    }
};


/* ════════════════════════════════════════════════════════════════════
   SIMULATION 9: NEWTON'S DISC (MAKE IT & SPIN IT)
   ════════════════════════════════════════════════════════════════════ */
const Sim9 = {
    canvas: null,
    ctx: null,
    step: 1, // 1 to 5
    rpm: 0,
    angle: 0,
    isSpinning: false,

    init() {
        this.canvas = document.getElementById('canvas-sim9');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        const rpmSlider = document.getElementById('sim9-rpm-slider');
        const rpmVal = document.getElementById('sim9-rpm-val');
        const sliderRpmVal = document.getElementById('sim9-slider-rpm-val');
        const btnQuickSpin = document.getElementById('sim9-btn-quick-spin');
        const btnStop = document.getElementById('sim9-btn-stop');
        const btnReset = document.getElementById('sim9-btn-reset');

        // Step buttons
        for (let s = 1; s <= 5; s++) {
            const btn = document.getElementById(`sim9-step-btn-${s}`);
            btn?.addEventListener('click', () => {
                this.setStep(s);
            });
        }

        rpmSlider?.addEventListener('input', (e) => {
            this.rpm = parseFloat(e.target.value);
            rpmVal.textContent = `${this.rpm} RPM`;
            sliderRpmVal.textContent = `${this.rpm} RPM`;
            this.updateAppearance();
        });

        btnQuickSpin?.addEventListener('click', () => {
            this.rpm = 2400;
            if (rpmSlider) rpmSlider.value = 2400;
            rpmVal.textContent = '2400 RPM';
            sliderRpmVal.textContent = '2400 RPM';
            this.updateAppearance();
        });

        btnStop?.addEventListener('click', () => {
            this.rpm = 0;
            if (rpmSlider) rpmSlider.value = 0;
            rpmVal.textContent = '0 RPM';
            sliderRpmVal.textContent = '0 RPM';
            this.updateAppearance();
        });

        btnReset?.addEventListener('click', () => {
            this.setStep(1);
            this.rpm = 0;
            if (rpmSlider) rpmSlider.value = 0;
            rpmVal.textContent = '0 RPM';
            sliderRpmVal.textContent = '0 RPM';
            this.updateAppearance();
        });

        this.updateAppearance();
        this.draw();
    },

    setStep(s) {
        this.step = s;
        for (let i = 1; i <= 5; i++) {
            const b = document.getElementById(`sim9-step-btn-${i}`);
            b?.classList.toggle('active', i === s);
            b?.classList.toggle('unlocked', i <= s);
        }

        const slider = document.getElementById('sim9-rpm-slider');
        const spinBtn = document.getElementById('sim9-btn-quick-spin');
        const stopBtn = document.getElementById('sim9-btn-stop');

        const canSpin = s === 5;
        if (slider) slider.disabled = !canSpin;
        if (spinBtn) spinBtn.disabled = !canSpin;
        if (stopBtn) stopBtn.disabled = !canSpin;

        const obs = document.getElementById('sim9-observation');
        if (s === 1) obs.innerHTML = '<strong>Step 1:</strong> Circular cardboard disc of ~10 cm diameter is cut out.';
        if (s === 2) obs.innerHTML = '<strong>Step 2:</strong> Divided into 7 equal sectors (each sector is 360° / 7 ≈ 51.4°).';
        if (s === 3) obs.innerHTML = '<strong>Step 3:</strong> Painted in rainbow order: Violet, Indigo, Blue, Green, Yellow, Orange, Red (VIBGYOR).';
        if (s === 4) obs.innerHTML = '<strong>Step 4:</strong> Centered spindle / pin attached. Ready to spin!';
        if (s === 5) obs.innerHTML = '<strong>Step 5:</strong> Disc is ready! Move the spin slider or click Fast Spin to rotate at high RPM.';
    },

    updateAppearance() {
        const appearVal = document.getElementById('sim9-appearance-val');
        const blendVal = document.getElementById('sim9-blend-val');
        const obs = document.getElementById('sim9-observation');

        const blendPct = Math.min(100, Math.round((this.rpm / 2000) * 100));
        blendVal.textContent = `${blendPct}% Blended`;

        if (this.rpm < 150) {
            appearVal.textContent = 'Distinct 7 Colours';
        } else if (this.rpm < 800) {
            appearVal.textContent = 'Motion Blurring';
        } else {
            appearVal.textContent = 'Whitish / Off-White!';
            markSimCompleted('sim9');
            obs.innerHTML = '<strong>On rotating swiftly, the disc appears whitish!</strong> Due to persistence of vision (~1/16s), the seven colours overlap on your retina and recombine into white light!';
        }
    },

    draw(time = 0) {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        ctx.clearRect(0, 0, w, h);

        ctx.fillStyle = '#080d19';
        ctx.fillRect(0, 0, w, h);

        const centerX = w / 2;
        const centerY = h / 2;
        const radius = 135;

        // Rotate angle
        this.angle += (this.rpm * 0.005);

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.angle);

        // Step 1: Plain white circle
        if (this.step === 1) {
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // Step 2: 7 lines
        if (this.step === 2) {
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 2;
            ctx.stroke();

            for (let i = 0; i < 7; i++) {
                const a = (i * 2 * Math.PI) / 7;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(radius * Math.cos(a), radius * Math.sin(a));
                ctx.stroke();
            }
        }

        // Step 3, 4, 5: Painted VIBGYOR Sectors
        if (this.step >= 3) {
            const colors = ['#8b5cf6', '#6366f1', '#3b82f6', '#10b981', '#eab308', '#f97316', '#ef4444'];
            const sectorAngle = (2 * Math.PI) / 7;

            // Draw sectors
            for (let i = 0; i < 7; i++) {
                ctx.fillStyle = colors[i];
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, radius, i * sectorAngle, (i + 1) * sectorAngle);
                ctx.closePath();
                ctx.fill();
            }

            // High RPM Color Blending (Persistence of Vision Math)
            if (this.rpm > 150) {
                const blendAlpha = Math.min(0.92, (this.rpm - 150) / 1800);
                ctx.fillStyle = `rgba(245, 245, 247, ${blendAlpha})`;
                ctx.beginPath();
                ctx.arc(0, 0, radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Center Spindle (Step 4 & 5)
        if (this.step >= 4) {
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(0, 0, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(0, 0, 6, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
};


/* ════════════════════════════════════════════════════════════════════
   CHAPTER QUIZ: 10 COMPREHENSIVE MCQS
   ════════════════════════════════════════════════════════════════════ */
const ChapterQuizData = [
    {
        q: "1. Light travels in:",
        options: ["A curved line", "A straight line", "A zigzag manner", "Circular orbits"],
        ans: 1,
        exp: "Light exhibits rectilinear propagation and always travels in straight lines."
    },
    {
        q: "2. The image formed by a plane mirror is always:",
        options: ["Real and inverted", "Virtual and laterally inverted", "Real and magnified", "Inverted and diminished"],
        ans: 1,
        exp: "Plane mirror images are virtual, erect, equal size, and laterally inverted."
    },
    {
        q: "3. If a candle is placed 20 cm in front of a plane mirror, what is the distance between candle and its image?",
        options: ["20 cm", "10 cm", "40 cm", "0 cm"],
        ans: 2,
        exp: "Object distance u = 20 cm, image distance v = 20 cm. Total distance = 20 + 20 = 40 cm."
    },
    {
        q: "4. An image that CANNOT be obtained on a physical screen is called a:",
        options: ["Real image", "Virtual image", "Laterally inverted image", "Diffused image"],
        ans: 1,
        exp: "By definition, a virtual image cannot be captured on a screen because rays do not actually intersect."
    },
    {
        q: "5. Why do dentists use concave mirrors?",
        options: ["To see inverted teeth", "To obtain a virtual, erect, and magnified image of teeth", "Because they are cheaper", "To divert sunlight"],
        ans: 1,
        exp: "When a concave mirror is placed close to teeth (inside F), it gives an enlarged upright image."
    },
    {
        q: "6. Which mirror is used as a rear-view mirror in cars?",
        options: ["Concave mirror", "Convex mirror", "Plane mirror", "Parabolic mirror"],
        ans: 1,
        exp: "Convex mirrors always form erect, diminished images giving a much wider field of view."
    },
    {
        q: "7. A convex lens acts as a:",
        options: ["Converging lens", "Diverging lens", "Reflecting lens", "Opaque lens"],
        ans: 0,
        exp: "A convex lens is thicker in the middle and bends parallel light rays inward to a real focus."
    },
    {
        q: "8. Can you burn paper with a concave lens in bright sunlight?",
        options: ["Yes, very quickly", "No, because it diverges light rays instead of focusing them", "Yes, in winter only", "Yes, if dipped in water"],
        ans: 1,
        exp: "A concave lens is a diverging lens that spreads light outwards and cannot focus heat."
    },
    {
        q: "9. Splitting of white sunlight into its constituent seven colours is called:",
        options: ["Rectilinear propagation", "Lateral inversion", "Dispersion", "Reflection"],
        ans: 2,
        exp: "Dispersion is the separation of white light into its component colors (VIBGYOR) through a prism."
    },
    {
        q: "10. When Newton's disc is rotated swiftly, it appears whitish due to:",
        options: ["Persistence of vision blending the 7 colours", "Paints burning off", "Air resistance cooling the disc", "Reflection disappearing"],
        ans: 0,
        exp: "The eye retains images for ~1/16 second, causing rapid color sequences to combine into white light."
    }
];

function initChapterQuiz() {
    const wrap = document.getElementById('chapter-quiz-wrap');
    if (!wrap) return;

    wrap.innerHTML = '';
    let score = 0;
    let answeredCount = 0;

    ChapterQuizData.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'mcq-card';
        card.setAttribute('data-answered', 'false');

        const qTitle = document.createElement('div');
        qTitle.className = 'mcq-question';
        qTitle.textContent = item.q;
        card.appendChild(qTitle);

        const optWrap = document.createElement('div');
        optWrap.className = 'mcq-options';

        item.options.forEach((optText, optIdx) => {
            const btn = document.createElement('button');
            btn.className = 'mcq-opt';
            btn.textContent = optText;
            btn.addEventListener('click', () => {
                if (card.getAttribute('data-answered') === 'true') return;
                card.setAttribute('data-answered', 'true');
                answeredCount++;

                const isCorrect = optIdx === item.ans;
                if (isCorrect) {
                    btn.classList.add('correct');
                    score++;
                } else {
                    btn.classList.add('incorrect');
                    optWrap.children[item.ans].classList.add('correct');
                }
                Array.from(optWrap.children).forEach(b => b.disabled = true);
                exp.classList.remove('hidden');

                if (answeredCount === ChapterQuizData.length) {
                    showQuizResults(score);
                }
            });
            optWrap.appendChild(btn);
        });
        card.appendChild(optWrap);

        const exp = document.createElement('div');
        exp.className = 'mcq-explanation hidden';
        exp.textContent = item.exp;
        card.appendChild(exp);

        wrap.appendChild(card);
    });

    document.getElementById('btn-retake-quiz')?.addEventListener('click', () => {
        initChapterQuiz();
        document.getElementById('quiz-results-card')?.classList.add('hidden');
    });

    document.getElementById('btn-quiz-score-scroll')?.addEventListener('click', () => {
        document.getElementById('quiz-results-card')?.scrollIntoView({ behavior: 'smooth' });
    });
}

function showQuizResults(score) {
    const card = document.getElementById('quiz-results-card');
    const scoreEl = document.getElementById('qrc-score');
    const msgEl = document.getElementById('qrc-msg');
    if (!card) return;

    card.classList.remove('hidden');
    scoreEl.textContent = `Score: ${score} / 10`;

    if (score >= 9) {
        msgEl.textContent = 'Outstanding! You have thoroughly mastered Class 7 Chapter 11: Light!';
    } else if (score >= 7) {
        msgEl.textContent = 'Great score! Review a few mirror and lens activities to achieve 100%.';
    } else {
        msgEl.textContent = 'Good attempt! Try exploring the ray diagrams and observation tables again to boost your score.';
    }

    card.scrollIntoView({ behavior: 'smooth' });
}
