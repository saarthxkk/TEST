/* ═════════════════════════════════════════════════════════════════
   MOTION MISSION — GAME ENGINE & EDUCATIONAL CONTROLLER
   Architecture: Audio Synth + State Engine + 7 Dynamic Zone Simulators
   + Adaptive Remediation + Concept Mastery + Points Card Generator
   ═════════════════════════════════════════════════════════════════ */

// ── 1. Audio Synthesizer (Web Audio API) ─────────────────────────
class SoundFX {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }
    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
    }
    playTone(freq, type, duration, gainVal = 0.15) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch(e) {}
    }
    click() { this.playTone(600, 'sine', 0.05, 0.08); }
    correct() {
        this.playTone(523.25, 'triangle', 0.1, 0.12);
        setTimeout(() => this.playTone(659.25, 'triangle', 0.1, 0.12), 80);
        setTimeout(() => this.playTone(783.99, 'triangle', 0.2, 0.15), 160);
    }
    wrong() {
        this.playTone(240, 'sawtooth', 0.15, 0.15);
        setTimeout(() => this.playTone(190, 'sawtooth', 0.25, 0.15), 120);
    }
    fanfare() {
        [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
            setTimeout(() => this.playTone(f, 'sine', 0.25, 0.15), i * 120);
        });
    }
}
const sfx = new SoundFX();

// ── 2. Game State ────────────────────────────────────────────────
const state = {
    points: 0,
    xp: 0,
    streak: 0,
    maxStreak: 0,
    currentZone: 1,
    completedZones: new Set(),
    conceptMastery: {
        'motion_rest':      { correct: 0, total: 0, label: 'Motion & Reference Point' },
        'speed':            { correct: 0, total: 0, label: 'Speed & Calculation' },
        'uniform_motion':   { correct: 0, total: 0, label: 'Uniform vs Non-Uniform' },
        'time_measurement': { correct: 0, total: 0, label: 'Time Measurement & Clocks' },
        'pendulum':         { correct: 0, total: 0, label: 'Simple Pendulum & Oscillations' },
        'graphs':           { correct: 0, total: 0, label: 'Distance–Time Graphs' }
    },
    mistakesLog: [],
    studentName: 'Science Explorer'
};

// ── 3. DOM & Initialisation ─────────────────────────────────────
const $ = id => document.getElementById(id);

document.addEventListener('DOMContentLoaded', () => {
    // Setup Audio Toggle
    $('audio-btn').addEventListener('click', () => {
        sfx.muted = !sfx.muted;
        $('audio-btn').textContent = sfx.muted ? '🔇' : '🔊';
    });

    // Setup Zone Tabs
    document.querySelectorAll('.z-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const z = parseInt(tab.getAttribute('data-zone'), 10);
            loadZone(z);
            sfx.click();
        });
    });

    // Setup Remediation Modal Close
    $('remed-continue-btn').addEventListener('click', () => {
        $('remediation-modal').classList.add('hidden');
    });

    // Setup Share Modal Close
    $('btn-close-share').addEventListener('click', () => {
        $('share-card-modal').classList.add('hidden');
    });

    $('btn-copy-card').addEventListener('click', copyScorecard);
    $('btn-download-card-pdf').addEventListener('click', downloadScorecardPDF);

    // Initial Load Zone 1
    loadZone(1);
    updateHUD();
});

// ── 4. HUD Updates ──────────────────────────────────────────────
function updateHUD() {
    $('hud-points').textContent = state.points;
    $('hud-xp').textContent = state.xp;
    $('hud-streak').textContent = state.streak;
    
    const zoneNames = [
        'ZONE 1: MOTION DETECTIVE',
        'ZONE 2: SPEED HIGHWAY',
        'ZONE 3: UNIFORM MOTION LAB',
        'ZONE 4: TIME LABORATORY',
        'ZONE 5: PENDULUM LAB',
        'ZONE 6: GRAPH DECODER',
        'ZONE 7: FINAL MISSION'
    ];
    $('hud-zone-name').textContent = zoneNames[state.currentZone - 1] || 'FINAL MISSION';
    $('game-progress-bar').style.width = `${Math.round((state.currentZone / 7) * 100)}%`;

    // Update Tab Classes
    document.querySelectorAll('.z-tab').forEach(tab => {
        const z = parseInt(tab.getAttribute('data-zone'), 10);
        tab.classList.toggle('active', z === state.currentZone);
        tab.classList.toggle('completed', state.completedZones.has(z));
    });
}

function addPoints(pts, xpVal, conceptKey, isCorrect) {
    if (isCorrect) {
        state.streak++;
        if (state.streak > state.maxStreak) state.maxStreak = state.streak;
        const streakBonus = Math.min(state.streak * 10, 50);
        state.points += (pts + streakBonus);
        state.xp += xpVal;
        sfx.correct();
    } else {
        state.streak = 0;
        sfx.wrong();
    }

    if (conceptKey && state.conceptMastery[conceptKey]) {
        state.conceptMastery[conceptKey].total++;
        if (isCorrect) state.conceptMastery[conceptKey].correct++;
    }
    updateHUD();
}

// ── 5. ZONE LOADER ──────────────────────────────────────────────
let activeAnimationId = null;

function cleanupCurrentAnimation() {
    if (activeAnimationId) {
        cancelAnimationFrame(activeAnimationId);
        activeAnimationId = null;
    }
}

function loadZone(zoneNum) {
    cleanupCurrentAnimation();
    state.currentZone = zoneNum;
    updateHUD();
    const container = $('zone-view');
    container.innerHTML = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    switch(zoneNum) {
        case 1: renderZone1(container); break;
        case 2: renderZone2(container); break;
        case 3: renderZone3(container); break;
        case 4: renderZone4(container); break;
        case 5: renderZone5(container); break;
        case 6: renderZone6(container); break;
        case 7: renderZone7(container); break;
        default: renderZone1(container);
    }
}

// ─────────────────────────────────────────────────────────────────
// ZONE 1: MOTION DETECTIVE (Motion vs Rest & Surroundings)
// ─────────────────────────────────────────────────────────────────
function renderZone1(container) {
    container.innerHTML = `
        <div class="zone-container">
            <div class="zone-header-card">
                <div class="zone-badge-tag">ZONE 01 &middot; CONCEPT LAB</div>
                <h1 class="zone-main-title">Motion Detective: The Relativity of Rest</h1>
                <p class="zone-subtitle">Is an object moving or at rest? Discover how position changes relative to surrounding reference points.</p>
                <div class="step-tracker">
                    <span class="step-chip active">1. SEE &amp; DISCOVER</span>
                    <span class="step-chip">2. EXPERIMENT</span>
                    <span class="step-chip">3. CHALLENGE</span>
                </div>
            </div>

            <div class="experiment-stage">
                <div class="stage-title-row">
                    <h2 class="stage-title">&#128373; Interactive Observation Deck</h2>
                    <div class="stage-controls-row">
                        <div class="toggle-group">
                            <button id="z1-btn-roadside" class="toggle-btn active">&#127794; Roadside Observer</button>
                            <button id="z1-btn-passenger" class="toggle-btn">&#128652; Passenger View</button>
                        </div>
                    </div>
                </div>

                <div class="canvas-wrap">
                    <canvas id="z1-canvas" width="800" height="320" class="game-canvas"></canvas>
                </div>

                <div class="live-formula-strip">
                    <div class="formula-node">
                        <span class="fn-val" id="z1-passenger-state">MOVING (50 km/h)</span>
                        <span class="fn-label">PASSENGER STATE</span>
                    </div>
                    <span class="formula-op">&harr;</span>
                    <div class="formula-node">
                        <span class="fn-val" id="z1-ref-point">Roadside Trees / Ground</span>
                        <span class="fn-label">REFERENCE SURROUNDING</span>
                    </div>
                    <span class="formula-op">&rarr;</span>
                    <div class="formula-node">
                        <span class="fn-val formula-res" id="z1-conclusion">Position is Changing</span>
                        <span class="fn-label">PHYSICAL CONCLUSION</span>
                    </div>
                </div>
            </div>

            <div class="challenge-card" id="z1-challenge-card">
                <div class="challenge-header">
                    <span class="challenge-tag">CHALLENGE 1.1 &middot; SITUATION INTERPRETATION</span>
                    <span class="challenge-xp-badge">+100 PTS &middot; +150 XP</span>
                </div>
                <p class="challenge-question-text">
                    A passenger is sitting inside a school bus travelling steadily at 40 km/h down a straight road. Which of the following statements most accurately describes the state of this passenger according to the chapter?
                </p>
                <div class="challenge-options" id="z1-options">
                    <button class="challenge-opt-btn" data-ans="A">
                        <span class="opt-letter">A</span>
                        <span>The passenger is absolutely at rest under all conditions because they are not walking inside the bus.</span>
                    </button>
                    <button class="challenge-opt-btn" data-ans="B">
                        <span class="opt-letter">B</span>
                        <span>The passenger is in motion with respect to roadside trees, but at rest with respect to fellow passengers inside the bus.</span>
                    </button>
                    <button class="challenge-opt-btn" data-ans="C">
                        <span class="opt-letter">C</span>
                        <span>The passenger is in motion relative to everything in the universe simultaneously.</span>
                    </button>
                    <button class="challenge-opt-btn" data-ans="D">
                        <span class="opt-letter">D</span>
                        <span>An object cannot be at rest and in motion at the same time from different reference points.</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    // Zone 1 Canvas Logic
    const canvas = $('z1-canvas');
    const ctx = canvas.getContext('2d');
    let viewMode = 'roadside'; // 'roadside' or 'passenger'
    let offset = 0;

    $('z1-btn-roadside').addEventListener('click', () => {
        viewMode = 'roadside';
        $('z1-btn-roadside').classList.add('active');
        $('z1-btn-passenger').classList.remove('active');
        $('z1-passenger-state').textContent = 'MOVING (50 km/h)';
        $('z1-ref-point').textContent = 'Roadside Trees / Ground';
        $('z1-conclusion').textContent = 'Position is Changing';
        sfx.click();
    });

    $('z1-btn-passenger').addEventListener('click', () => {
        viewMode = 'passenger';
        $('z1-btn-passenger').classList.add('active');
        $('z1-btn-roadside').classList.remove('active');
        $('z1-passenger-state').textContent = 'AT REST (0 km/h)';
        $('z1-ref-point').textContent = 'Bus Interior / Fellow Passenger';
        $('z1-conclusion').textContent = 'Position is Fixed';
        sfx.click();
    });

    function drawZ1() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Sky & Ground
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, 220);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 220, canvas.width, 100);

        // Road markings
        ctx.fillStyle = '#334155';
        ctx.fillRect(0, 240, canvas.width, 60);

        if (viewMode === 'roadside') {
            offset = (offset + 3) % canvas.width;
            
            // Draw roadside trees (stationary)
            for (let i = 40; i < canvas.width; i += 180) {
                drawTree(ctx, i, 160);
            }

            // Draw moving bus
            const busX = (offset * 1.5) % (canvas.width + 240) - 160;
            drawBus(ctx, busX, 190);
        } else {
            // Passenger view: Bus is stationary, scenery rushes backwards
            offset = (offset + 5) % 180;

            // Rushing trees
            for (let i = canvas.width + 100 - offset; i > -100; i -= 180) {
                drawTree(ctx, i, 160);
            }

            // Stationary bus interior view
            drawBusInterior(ctx);
        }

        activeAnimationId = requestAnimationFrame(drawZ1);
    }
    drawZ1();

    // Challenge validation
    setupChallengeOptions('z1-options', 'B', 'motion_rest', {
        title: 'Reference Frame: Motion vs Rest',
        explanation: 'Motion is a change in position with time relative to a chosen reference object. The passenger changes position relative to trees on the ground, but remains at the same position relative to the bus seat and other passengers!',
        nextZone: 2
    });
}

function drawTree(ctx, x, y) {
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x - 6, y + 20, 12, 40);
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(x, y + 10, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x - 14, y + 22, 18, 0, Math.PI * 2);
    ctx.arc(x + 14, y + 22, 18, 0, Math.PI * 2);
    ctx.fill();
}

function drawBus(ctx, x, y) {
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.roundRect(x, y - 50, 140, 60, 8);
    ctx.fill();
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Windows
    ctx.fillStyle = '#38bdf8';
    for (let w = x + 15; w < x + 120; w += 28) {
        ctx.fillRect(w, y - 42, 20, 22);
    }

    // Passenger head visible
    ctx.fillStyle = '#f87171';
    ctx.beginPath();
    ctx.arc(x + 55, y - 28, 6, 0, Math.PI * 2);
    ctx.fill();

    // Wheels
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(x + 28, y + 12, 12, 0, Math.PI * 2);
    ctx.arc(x + 112, y + 12, 12, 0, Math.PI * 2);
    ctx.fill();
}

function drawBusInterior(ctx) {
    // Bus window frame
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 16;
    ctx.strokeRect(80, 40, canvasWrapWidth() - 160, 200);

    // Passenger reading comfortably
    ctx.fillStyle = '#f8fafc';
    ctx.font = '14px Space Mono';
    ctx.fillText('Passenger sitting calmly (Relative Speed = 0 m/s)', 120, 80);
}

function canvasWrapWidth() {
    return 800;
}

// ─────────────────────────────────────────────────────────────────
// ZONE 2: SPEED HIGHWAY (Distance, Time, Speed & Unit Conversion)
// ─────────────────────────────────────────────────────────────────
function renderZone2(container) {
    container.innerHTML = `
        <div class="zone-container">
            <div class="zone-header-card">
                <div class="zone-badge-tag">ZONE 02 &middot; MATHEMATICAL SPEEDWAY</div>
                <h1 class="zone-main-title">Speed Highway: Distance &divide; Time</h1>
                <p class="zone-subtitle">Speed is the distance covered by an object in a unit of time. Animate two vehicles, change distance &amp; time sliders, and discover why speed determines who is faster!</p>
                <div class="step-tracker">
                    <span class="step-chip done">&#10003; 1. MOTION DETECTIVE</span>
                    <span class="step-chip active">2. SPEED EXPERIMENT</span>
                    <span class="step-chip">3. UNIT CONVERTER</span>
                    <span class="step-chip">4. CHALLENGE</span>
                </div>
            </div>

            <div class="experiment-stage">
                <div class="stage-title-row">
                    <h2 class="stage-title">&#128664; Dual-Rover Speed Simulator</h2>
                    <div class="stage-controls-row">
                        <button id="z2-race-btn" class="btn-game-primary">&#9654; RACE ROVERS</button>
                        <button id="z2-reset-btn" class="btn-game-ghost">&#8635; RESET</button>
                    </div>
                </div>

                <div class="canvas-wrap">
                    <canvas id="z2-canvas" width="800" height="260" class="game-canvas"></canvas>
                </div>

                <div class="interactive-controls-panel">
                    <div class="control-group">
                        <label class="control-label">
                            <span>ROVER A DISTANCE:</span>
                            <span class="control-value" id="z2-distA-val">200 m</span>
                        </label>
                        <input type="range" min="100" max="500" step="50" value="200" class="game-slider" id="z2-distA-slider">
                    </div>
                    <div class="control-group">
                        <label class="control-label">
                            <span>ROVER A TIME:</span>
                            <span class="control-value" id="z2-timeA-val">10 s</span>
                        </label>
                        <input type="range" min="5" max="25" step="1" value="10" class="game-slider" id="z2-timeA-slider">
                    </div>
                    <div class="control-group">
                        <label class="control-label">
                            <span>ROVER B TIME: (Fixed 200m)</span>
                            <span class="control-value" id="z2-timeB-val">20 s</span>
                        </label>
                        <input type="range" min="5" max="25" step="1" value="20" class="game-slider" id="z2-timeB-slider">
                    </div>
                </div>

                <div class="live-formula-strip">
                    <div class="formula-node">
                        <span class="fn-val" id="z2-speedA-disp">20.0 m/s</span>
                        <span class="fn-label">ROVER A SPEED (d / t)</span>
                    </div>
                    <span class="formula-op">vs</span>
                    <div class="formula-node">
                        <span class="fn-val" id="z2-speedB-disp">10.0 m/s</span>
                        <span class="fn-label">ROVER B SPEED (d / t)</span>
                    </div>
                    <span class="formula-op">&rarr;</span>
                    <div class="formula-node">
                        <span class="fn-val formula-res" id="z2-winner-disp">ROVER A IS 2&times; FASTER</span>
                        <span class="fn-label">COMPARATIVE CONCLUSION</span>
                    </div>
                </div>
            </div>

            <!-- UNIT CONVERSION MINI LAB -->
            <div class="experiment-stage" style="margin-top: 20px;">
                <div class="stage-title-row">
                    <h2 class="stage-title">&#128290; Speed Unit Converter: km/h &harr; m/s</h2>
                </div>
                <div class="interactive-controls-panel">
                    <div class="control-group">
                        <label class="control-label"><span>KM/H VALUE:</span> <span class="control-value" id="z2-kmh-val">54 km/h</span></label>
                        <input type="range" min="18" max="144" step="18" value="54" class="game-slider" id="z2-kmh-slider">
                    </div>
                    <div class="formula-node" style="grid-column: span 2;">
                        <span class="fn-val" style="color: var(--accent-cyan);" id="z2-conversion-math">54 &times; (5 / 18) = 15 m/s</span>
                        <span class="fn-label">1 km = 1000 m &middot; 1 hr = 3600 s &middot; Factor = 1000/3600 = 5/18</span>
                    </div>
                </div>
            </div>

            <div class="challenge-card" id="z2-challenge-card">
                <div class="challenge-header">
                    <span class="challenge-tag">CHALLENGE 2.1 &middot; NUMERICAL CALCULATION</span>
                    <span class="challenge-xp-badge">+100 PTS &middot; +150 XP</span>
                </div>
                <p class="challenge-question-text">
                    A train travels 120 km in the first 2 hours of its journey and then travels 180 km in the next 3 hours. What is the average speed of the train for the entire journey?
                </p>
                <div class="challenge-options" id="z2-options">
                    <button class="challenge-opt-btn" data-ans="A">
                        <span class="opt-letter">A</span>
                        <span>50 km/h</span>
                    </button>
                    <button class="challenge-opt-btn" data-ans="B">
                        <span class="opt-letter">B</span>
                        <span>60 km/h, because Total Distance (300 km) &divide; Total Time (5 h) = 60 km/h</span>
                    </button>
                    <button class="challenge-opt-btn" data-ans="C">
                        <span class="opt-letter">C</span>
                        <span>75 km/h</span>
                    </button>
                    <button class="challenge-opt-btn" data-ans="D">
                        <span class="opt-letter">D</span>
                        <span>300 km/h</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    const canvas = $('z2-canvas');
    const ctx = canvas.getContext('2d');
    let racing = false;
    let progressA = 0;
    let progressB = 0;
    let distA = 200;
    let timeA = 10;
    let timeB = 20;

    function updateCalculations() {
        const speedA = (distA / timeA).toFixed(1);
        const speedB = (200 / timeB).toFixed(1);
        $('z2-distA-val').textContent = `${distA} m`;
        $('z2-timeA-val').textContent = `${timeA} s`;
        $('z2-timeB-val').textContent = `${timeB} s`;
        $('z2-speedA-disp').textContent = `${speedA} m/s`;
        $('z2-speedB-disp').textContent = `${speedB} m/s`;

        if (parseFloat(speedA) > parseFloat(speedB)) {
            $('z2-winner-disp').textContent = `ROVER A IS ${(speedA / speedB).toFixed(1)}x FASTER`;
        } else if (parseFloat(speedA) < parseFloat(speedB)) {
            $('z2-winner-disp').textContent = `ROVER B IS ${(speedB / speedA).toFixed(1)}x FASTER`;
        } else {
            $('z2-winner-disp').textContent = `EQUAL SPEED (${speedA} m/s)`;
        }
    }

    $('z2-distA-slider').addEventListener('input', e => {
        distA = parseInt(e.target.value, 10);
        updateCalculations();
    });
    $('z2-timeA-slider').addEventListener('input', e => {
        timeA = parseInt(e.target.value, 10);
        updateCalculations();
    });
    $('z2-timeB-slider').addEventListener('input', e => {
        timeB = parseInt(e.target.value, 10);
        updateCalculations();
    });

    $('z2-kmh-slider').addEventListener('input', e => {
        const val = parseInt(e.target.value, 10);
        const ms = (val * 5 / 18).toFixed(1);
        $('z2-kmh-val').textContent = `${val} km/h`;
        $('z2-conversion-math').textContent = `${val} × (5 / 18) = ${ms} m/s`;
    });

    $('z2-race-btn').addEventListener('click', () => {
        racing = true;
        progressA = 0;
        progressB = 0;
        sfx.click();
    });

    $('z2-reset-btn').addEventListener('click', () => {
        racing = false;
        progressA = 0;
        progressB = 0;
        sfx.click();
    });

    function drawZ2() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Track 1 (Rover A)
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(40, 40, 720, 70);
        // Track 2 (Rover B)
        ctx.fillRect(40, 140, 720, 70);

        // Finish Line
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(700, 30);
        ctx.lineTo(700, 220);
        ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.font = '10px Space Mono';
        ctx.fillText('FINISH LINE', 660, 25);

        // Rover A Position
        if (racing) {
            progressA += (1 / (timeA * 60));
            progressB += (1 / (timeB * 60));
            if (progressA > 1) progressA = 1;
            if (progressB > 1) progressB = 1;
        }

        const posXA = 50 + progressA * 630;
        const posXB = 50 + progressB * 630;

        // Draw Rover A (Cyan)
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.roundRect(posXA, 55, 45, 25, 4);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Inter';
        ctx.fillText('A', posXA + 18, 71);

        // Draw Rover B (Amber)
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.roundRect(posXB, 155, 45, 25, 4);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Inter';
        ctx.fillText('B', posXB + 18, 171);

        activeAnimationId = requestAnimationFrame(drawZ2);
    }
    drawZ2();

    setupChallengeOptions('z2-options', 'B', 'speed', {
        title: 'Average Speed Calculation',
        explanation: 'Average Speed = Total Distance Covered ÷ Total Time Taken. Total Distance = 120 km + 180 km = 300 km. Total Time = 2 h + 3 h = 5 h. 300 ÷ 5 = 60 km/h.',
        nextZone: 3
    });
}

// ─────────────────────────────────────────────────────────────────
// ZONE 3: UNIFORM MOTION LAB (Equal vs Unequal Intervals)
// ─────────────────────────────────────────────────────────────────
function renderZone3(container) {
    container.innerHTML = `
        <div class="zone-container">
            <div class="zone-header-card">
                <div class="zone-badge-tag">ZONE 03 &middot; MOTION PATTERNS</div>
                <h1 class="zone-main-title">Uniform Motion Lab: Equal Distances in Equal Times</h1>
                <p class="zone-subtitle">Compare Rover A (uniform motion) and Rover B (non-uniform motion) across equal 1-second interval checkpoints.</p>
                <div class="step-tracker">
                    <span class="step-chip done">&#10003; 1. DETECTIVE</span>
                    <span class="step-chip done">&#10003; 2. SPEEDWAY</span>
                    <span class="step-chip active">3. UNIFORM LAB</span>
                    <span class="step-chip">4. CHALLENGE</span>
                </div>
            </div>

            <div class="experiment-stage">
                <div class="stage-title-row">
                    <h2 class="stage-title">&#128394; Interval Track Simulator</h2>
                    <div class="stage-controls-row">
                        <button id="z3-play-btn" class="btn-game-primary">&#9654; PLAY INTERVAL SCAN</button>
                    </div>
                </div>

                <div class="canvas-wrap">
                    <canvas id="z3-canvas" width="800" height="280" class="game-canvas"></canvas>
                </div>

                <div class="live-formula-strip">
                    <div class="formula-node">
                        <span class="fn-val" style="color: var(--accent-cyan);">20m &middot; 20m &middot; 20m &middot; 20m</span>
                        <span class="fn-label">ROVER A INTERVALS (EQUAL) &rarr; UNIFORM</span>
                    </div>
                    <span class="formula-op">vs</span>
                    <div class="formula-node">
                        <span class="fn-val" style="color: var(--accent-rose);">10m &middot; 20m &middot; 35m &middot; 50m</span>
                        <span class="fn-label">ROVER B INTERVALS (UNEQUAL) &rarr; NON-UNIFORM</span>
                    </div>
                </div>
            </div>

            <div class="challenge-card" id="z3-challenge-card">
                <div class="challenge-header">
                    <span class="challenge-tag">CHALLENGE 3.1 &middot; CONCEPT INTERPRETATION</span>
                    <span class="challenge-xp-badge">+100 PTS &middot; +150 XP</span>
                </div>
                <p class="challenge-question-text">
                    A bus covers 30 km in the first hour, 20 km in the second hour, and 40 km in the third hour. The driver claims that the bus travelled with uniform speed because exactly one hour was spent in each of the three stages. Which evaluation is correct?
                </p>
                <div class="challenge-options" id="z3-options">
                    <button class="challenge-opt-btn" data-ans="A">
                        <span class="opt-letter">A</span>
                        <span>Correct, because the time spent in each part was equal.</span>
                    </button>
                    <button class="challenge-opt-btn" data-ans="B">
                        <span class="opt-letter">B</span>
                        <span>Incorrect, because uniform motion requires covering equal distances in equal intervals of time.</span>
                    </button>
                    <button class="challenge-opt-btn" data-ans="C">
                        <span class="opt-letter">C</span>
                        <span>Correct, because the average speed can easily be determined.</span>
                    </button>
                    <button class="challenge-opt-btn" data-ans="D">
                        <span class="opt-letter">D</span>
                        <span>Incorrect, because vehicles with engines can never perform uniform motion.</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    const canvas = $('z3-canvas');
    const ctx = canvas.getContext('2d');
    let t = 0;
    let isRunning = false;

    $('z3-play-btn').addEventListener('click', () => {
        t = 0;
        isRunning = true;
        sfx.click();
    });

    function drawZ3() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Tracks
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(40, 50, 720, 50);
        ctx.fillRect(40, 160, 720, 50);

        // Checkpoint markers at 0s, 1s, 2s, 3s, 4s
        const markers = [50, 200, 350, 500, 650];
        ctx.strokeStyle = '#475569';
        ctx.setLineDash([4, 4]);

        markers.forEach((m, idx) => {
            ctx.beginPath();
            ctx.moveTo(m, 30);
            ctx.lineTo(m, 230);
            ctx.stroke();
            ctx.fillStyle = '#94a3b8';
            ctx.font = '10px Space Mono';
            ctx.fillText(`t=${idx}s`, m - 12, 25);
        });
        ctx.setLineDash([]);

        if (isRunning) {
            t += 0.012;
            if (t > 4) t = 4;
        }

        // Rover A: Uniform (constant speed -> posX = 50 + t * 150)
        const posA = 50 + t * 150;
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.roundRect(posA, 62, 35, 25, 4);
        ctx.fill();

        // Rover B: Non-uniform (accelerating -> posX = 50 + (t^1.5) * 75)
        const posB = 50 + Math.pow(t, 1.45) * 80;
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.roundRect(posB, 172, 35, 25, 4);
        ctx.fill();

        activeAnimationId = requestAnimationFrame(drawZ3);
    }
    drawZ3();

    setupChallengeOptions('z3-options', 'B', 'uniform_motion', {
        title: 'Definition of Uniform Motion',
        explanation: 'An object moving along a straight line with a constant speed covers equal distances in equal intervals of time. If the distance covered changes from one hour to the next, the motion is non-uniform.',
        nextZone: 4
    });
}

// ─────────────────────────────────────────────────────────────────
// ZONE 4: TIME LABORATORY (Clocks, Stopwatches & Intervals)
// ─────────────────────────────────────────────────────────────────
function renderZone4(container) {
    container.innerHTML = `
        <div class="zone-container">
            <div class="zone-header-card">
                <div class="zone-badge-tag">ZONE 04 &middot; MEASUREMENT LAB</div>
                <h1 class="zone-main-title">Time Laboratory: Clocks &amp; Stopwatches</h1>
                <p class="zone-subtitle">How do we measure time? From ancient periodic events (sundials, sand clocks) to high-precision digital stopwatches.</p>
                <div class="step-tracker">
                    <span class="step-chip done">&#10003; 1. DETECTIVE</span>
                    <span class="step-chip done">&#10003; 2. SPEEDWAY</span>
                    <span class="step-chip done">&#10003; 3. UNIFORM LAB</span>
                    <span class="step-chip active">4. TIME LAB</span>
                    <span class="step-chip">5. CHALLENGE</span>
                </div>
            </div>

            <div class="experiment-stage">
                <div class="stage-title-row">
                    <h2 class="stage-title">&#9201; Precision Reaction &amp; Stopwatch Challenge</h2>
                    <div class="stage-controls-row">
                        <button id="z4-timer-btn" class="btn-game-primary">&#9654; START STOPWATCH</button>
                        <button id="z4-reset-btn" class="btn-game-ghost">&#8635; RESET</button>
                    </div>
                </div>

                <div style="background: #080a0e; border: 1px solid var(--border-dark); border-radius: var(--radius-md); padding: 36px; text-align: center; margin-bottom: 16px;">
                    <span style="font-family: var(--font-mono); font-size: 52px; font-weight: 700; color: var(--accent-cyan);" id="z4-digits">00:00.00</span>
                    <p style="font-size: 12px; color: var(--text-muted); margin-top: 8px;">MEASURED DURATION &middot; STOPWATCH ACCURACY: 1/100th SECOND</p>
                </div>

                <div class="interactive-controls-panel">
                    <div class="formula-node">
                        <span class="fn-val">&#9728;&#65039; Sundial</span>
                        <span class="fn-label">Position of shadow on sunlit dial</span>
                    </div>
                    <div class="formula-node">
                        <span class="fn-val">&#9203; Sand Clock</span>
                        <span class="fn-label">Flow of sand through narrow neck</span>
                    </div>
                    <div class="formula-node">
                        <span class="fn-val">&#128167; Water Clock</span>
                        <span class="fn-label">Inflow/outflow of water in vessel</span>
                    </div>
                    <div class="formula-node">
                        <span class="fn-val">&#128336; Quartz Clock</span>
                        <span class="fn-label">High-frequency electronic vibrations</span>
                    </div>
                </div>
            </div>

            <div class="challenge-card" id="z4-challenge-card">
                <div class="challenge-header">
                    <span class="challenge-tag">CHALLENGE 4.1 &middot; INSTRUMENT APPLICATION</span>
                    <span class="challenge-xp-badge">+100 PTS &middot; +150 XP</span>
                </div>
                <p class="challenge-question-text">
                    Why is a digital stopwatch or modern clock specifically used during sports events to measure a 100 m sprint, rather than an ancient sundial or sand clock?
                </p>
                <div class="challenge-options" id="z4-options">
                    <button class="challenge-opt-btn" data-ans="A">
                        <span class="opt-letter">A</span>
                        <span>Because sundials can only measure full days and cannot measure short intervals of seconds accurately.</span>
                    </button>
                    <button class="challenge-opt-btn" data-ans="B">
                        <span class="opt-letter">B</span>
                        <span>Because sand clocks only operate in night conditions.</span>
                    </button>
                    <button class="challenge-opt-btn" data-ans="C">
                        <span class="opt-letter">C</span>
                        <span>Because modern sprint rules prohibit the use of glass devices.</span>
                    </button>
                    <button class="challenge-opt-btn" data-ans="D">
                        <span class="opt-letter">D</span>
                        <span>Because sundials change size when the temperature changes.</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    let running = false;
    let startTime = 0;
    let timerId = null;

    $('z4-timer-btn').addEventListener('click', () => {
        if (!running) {
            running = true;
            startTime = performance.now();
            $('z4-timer-btn').textContent = '⏹ STOP STOPWATCH';
            $('z4-timer-btn').style.background = 'var(--accent-rose)';
            timerId = setInterval(() => {
                const elapsed = performance.now() - startTime;
                const sec = Math.floor(elapsed / 1000);
                const ms = Math.floor((elapsed % 1000) / 10);
                $('z4-digits').textContent = `${String(sec).padStart(2, '0')}:${String(ms).padStart(2, '0')}`;
            }, 10);
        } else {
            running = false;
            clearInterval(timerId);
            $('z4-timer-btn').textContent = '▶ START STOPWATCH';
            $('z4-timer-btn').style.background = 'var(--accent-cyan)';
        }
        sfx.click();
    });

    $('z4-reset-btn').addEventListener('click', () => {
        running = false;
        clearInterval(timerId);
        $('z4-digits').textContent = '00:00.00';
        $('z4-timer-btn').textContent = '▶ START STOPWATCH';
        $('z4-timer-btn').style.background = 'var(--accent-cyan)';
        sfx.click();
    });

    setupChallengeOptions('z4-options', 'A', 'time_measurement', {
        title: 'Short Interval Time Measurement',
        explanation: 'Ancient timekeeping devices like sundials relied on the sun’s daily motion to indicate the time of day, but they could not be used to measure short, precise time intervals like seconds in a race.',
        nextZone: 5
    });
}

// ─────────────────────────────────────────────────────────────────
// ZONE 5: PENDULUM LABORATORY (Oscillation, Bob & Time Period)
// ─────────────────────────────────────────────────────────────────
function renderZone5(container) {
    container.innerHTML = `
        <div class="zone-container">
            <div class="zone-header-card">
                <div class="zone-badge-tag">ZONE 05 &middot; PERIODIC MOTION</div>
                <h1 class="zone-main-title">Pendulum Laboratory: Oscillation &amp; Time Period</h1>
                <p class="zone-subtitle">A simple pendulum consists of a metallic bob suspended by a thread. An oscillation is the complete motion from A &rarr; B &rarr; C &rarr; B &rarr; A. Time Period = Total Time &divide; Number of Oscillations.</p>
                <div class="step-tracker">
                    <span class="step-chip done">&#10003; 1. DETECTIVE</span>
                    <span class="step-chip done">&#10003; 2. SPEEDWAY</span>
                    <span class="step-chip done">&#10003; 3. UNIFORM LAB</span>
                    <span class="step-chip done">&#10003; 4. TIME LAB</span>
                    <span class="step-chip active">5. PENDULUM LAB</span>
                    <span class="step-chip">6. CHALLENGE</span>
                </div>
            </div>

            <div class="experiment-stage">
                <div class="stage-title-row">
                    <h2 class="stage-title">&#128337; Interactive Pendulum Simulator</h2>
                    <div class="stage-controls-row">
                        <button id="z5-swing-btn" class="btn-game-primary">&#9654; START EXPERIMENT</button>
                        <button id="z5-slowmo-btn" class="btn-game-ghost">&#128012; SLOW MOTION: OFF</button>
                        <button id="z5-reset-btn" class="btn-game-ghost">&#8635; RESET</button>
                    </div>
                </div>

                <div class="canvas-wrap">
                    <canvas id="z5-canvas" width="800" height="340" class="game-canvas"></canvas>
                </div>

                <div class="interactive-controls-panel">
                    <div class="control-group">
                        <label class="control-label"><span>TARGET OSCILLATIONS:</span> <span class="control-value" id="z5-target-osc-val">20 Oscillations</span></label>
                        <div class="toggle-group">
                            <button class="toggle-btn z5-osc-btn" data-osc="10">10 Osc</button>
                            <button class="toggle-btn z5-osc-btn active" data-osc="20">20 Osc</button>
                            <button class="toggle-btn z5-osc-btn" data-osc="30">30 Osc</button>
                        </div>
                    </div>
                    <div class="formula-node">
                        <span class="fn-val" id="z5-live-osc-count">0 / 20</span>
                        <span class="fn-label">COMPLETED OSCILLATIONS</span>
                    </div>
                    <div class="formula-node">
                        <span class="fn-val" id="z5-live-time">0.0 s</span>
                        <span class="fn-label">TOTAL TIME RECORDED</span>
                    </div>
                </div>

                <div class="live-formula-strip">
                    <div class="formula-node">
                        <span class="fn-val" id="z5-calc-time">40.0 s</span>
                        <span class="fn-label">TOTAL TIME (t)</span>
                    </div>
                    <span class="formula-op">&divide;</span>
                    <div class="formula-node">
                        <span class="fn-val" id="z5-calc-osc">20</span>
                        <span class="fn-label">OSCILLATIONS (n)</span>
                    </div>
                    <span class="formula-op">=</span>
                    <div class="formula-node">
                        <span class="fn-val formula-res" id="z5-calc-period">2.0 s</span>
                        <span class="fn-label">TIME PERIOD (T = t / n)</span>
                    </div>
                </div>
            </div>

            <div class="challenge-card" id="z5-challenge-card">
                <div class="challenge-header">
                    <span class="challenge-tag">CHALLENGE 5.1 &middot; EXPERIMENTAL INTERPRETATION</span>
                    <span class="challenge-xp-badge">+100 PTS &middot; +150 XP</span>
                </div>
                <p class="challenge-question-text">
                    A student measures that 20 complete oscillations of a pendulum take 36 seconds. Another trial of 40 oscillations takes 72 seconds. A student concludes that the time period increases because 72 seconds is greater than 36 seconds. Which evaluation is correct?
                </p>
                <div class="challenge-options" id="z5-options">
                    <button class="challenge-opt-btn" data-ans="A">
                        <span class="opt-letter">A</span>
                        <span>Correct, because the stopwatch shows a larger total time.</span>
                    </button>
                    <button class="challenge-opt-btn" data-ans="B">
                        <span class="opt-letter">B</span>
                        <span>Incorrect, because the time period is the time for ONE oscillation (36&divide;20 = 1.8 s and 72&divide;40 = 1.8 s), which remains constant.</span>
                    </button>
                    <button class="challenge-opt-btn" data-ans="C">
                        <span class="opt-letter">C</span>
                        <span>Correct, because pendulums slow down over long trials.</span>
                    </button>
                    <button class="challenge-opt-btn" data-ans="D">
                        <span class="opt-letter">D</span>
                        <span>Incorrect, because stopwatches cannot measure 40 oscillations.</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    const canvas = $('z5-canvas');
    const ctx = canvas.getContext('2d');
    let targetOsc = 20;
    let currentOsc = 0;
    let isSwinging = false;
    let isSlowMo = false;
    let angle = 0;
    let maxAngle = 0.5;
    let angularSpeed = 0.05;
    let prevSign = 1;
    let timeElapsed = 0;

    document.querySelectorAll('.z5-osc-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.z5-osc-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            targetOsc = parseInt(btn.getAttribute('data-osc'), 10);
            $('z5-target-osc-val').textContent = `${targetOsc} Oscillations`;
            $('z5-live-osc-count').textContent = `0 / ${targetOsc}`;
            sfx.click();
        });
    });

    $('z5-slowmo-btn').addEventListener('click', () => {
        isSlowMo = !isSlowMo;
        $('z5-slowmo-btn').textContent = isSlowMo ? '🐌 SLOW MOTION: ON' : '🐌 SLOW MOTION: OFF';
        $('z5-slowmo-btn').classList.toggle('active', isSlowMo);
        sfx.click();
    });

    $('z5-swing-btn').addEventListener('click', () => {
        isSwinging = true;
        currentOsc = 0;
        timeElapsed = 0;
        sfx.click();
    });

    $('z5-reset-btn').addEventListener('click', () => {
        isSwinging = false;
        currentOsc = 0;
        timeElapsed = 0;
        angle = 0;
        $('z5-live-osc-count').textContent = `0 / ${targetOsc}`;
        $('z5-live-time').textContent = '0.0 s';
        sfx.click();
    });

    function drawZ5() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Support
        ctx.fillStyle = '#475569';
        ctx.fillRect(350, 20, 100, 10);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.strokeRect(350, 20, 100, 10);

        if (isSwinging && currentOsc < targetOsc) {
            const step = isSlowMo ? 0.02 : 0.05;
            angle += step;
            timeElapsed += (isSlowMo ? 0.01 : 0.025);

            // Count complete cycles
            const currentSign = Math.sin(angle) >= 0 ? 1 : -1;
            if (prevSign === -1 && currentSign === 1) {
                currentOsc++;
                $('z5-live-osc-count').textContent = `${currentOsc} / ${targetOsc}`;
                $('z5-live-time').textContent = `${(currentOsc * 2).toFixed(1)} s`;
                $('z5-calc-time').textContent = `${(currentOsc * 2).toFixed(1)} s`;
                $('z5-calc-osc').textContent = `${currentOsc}`;
                $('z5-calc-period').textContent = '2.0 s';
            }
            prevSign = currentSign;
        }

        const currentTheta = maxAngle * Math.sin(angle);
        const originX = 400;
        const originY = 30;
        const length = 200;

        const bobX = originX + length * Math.sin(currentTheta);
        const bobY = originY + length * Math.cos(currentTheta);

        // Swing Arc Trace
        ctx.strokeStyle = '#334155';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(originX, originY, length, Math.PI/2 - maxAngle, Math.PI/2 + maxAngle);
        ctx.stroke();
        ctx.setLineDash([]);

        // Extreme Left (A) Ghost
        ctx.fillStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.beginPath();
        ctx.arc(originX - length * Math.sin(maxAngle), originY + length * Math.cos(maxAngle), 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('A', originX - length * Math.sin(maxAngle) - 4, originY + length * Math.cos(maxAngle) + 4);

        // Extreme Right (C) Ghost
        ctx.fillStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.beginPath();
        ctx.arc(originX + length * Math.sin(maxAngle), originY + length * Math.cos(maxAngle), 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('C', originX + length * Math.sin(maxAngle) - 4, originY + length * Math.cos(maxAngle) + 4);

        // Mean Position (B) Label
        ctx.fillStyle = '#f59e0b';
        ctx.fillText('B (Mean)', originX - 24, originY + length + 28);

        // String
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(bobX, bobY);
        ctx.stroke();

        // Metallic Bob
        const grad = ctx.createRadialGradient(bobX - 4, bobY - 4, 2, bobX, bobY, 16);
        grad.addColorStop(0, '#fef08a');
        grad.addColorStop(1, '#b45309');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bobX, bobY, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        activeAnimationId = requestAnimationFrame(drawZ5);
    }
    drawZ5();

    setupChallengeOptions('z5-options', 'B', 'pendulum', {
        title: 'Time Period Constancy',
        explanation: 'The time period of a given pendulum is constant. Increasing the number of oscillations also increases the total time taken proportionally, so Total Time ÷ Oscillations remains unchanged.',
        nextZone: 6
    });
}

// ─────────────────────────────────────────────────────────────────
// ZONE 6: GRAPH DECODER (Interactive Live Distance–Time Graph)
// ─────────────────────────────────────────────────────────────────
function renderZone6(container) {
    container.innerHTML = `
        <div class="zone-container">
            <div class="zone-header-card">
                <div class="zone-badge-tag">ZONE 06 &middot; VISUAL DATA</div>
                <h1 class="zone-main-title">Graph Decoder: Real-Time Distance–Time Plotter</h1>
                <p class="zone-subtitle">Drive the science rover live and watch the distance–time graph draw in real time. Notice how driving at steady speed creates a rising line, and stopping creates a flat horizontal section!</p>
                <div class="step-tracker">
                    <span class="step-chip done">&#10003; 1. DETECTIVE</span>
                    <span class="step-chip done">&#10003; 2. SPEEDWAY</span>
                    <span class="step-chip done">&#10003; 3. UNIFORM LAB</span>
                    <span class="step-chip done">&#10003; 4. TIME LAB</span>
                    <span class="step-chip done">&#10003; 5. PENDULUM LAB</span>
                    <span class="step-chip active">6. GRAPH DECODER</span>
                    <span class="step-chip">7. FINAL MISSION</span>
                </div>
            </div>

            <div class="experiment-stage">
                <div class="stage-title-row">
                    <h2 class="stage-title">&#128200; Live Rover Telemetry &amp; Graph Plotter</h2>
                    <div class="stage-controls-row">
                        <button id="z6-move-btn" class="btn-game-primary">&#9654; DRIVE ROVER</button>
                        <button id="z6-stop-btn" class="btn-game-ghost" style="border-color: var(--accent-rose); color: var(--accent-rose);">&#9208; STOP / REST</button>
                        <button id="z6-reset-btn" class="btn-game-ghost">&#8635; RESET GRAPH</button>
                    </div>
                </div>

                <div class="canvas-wrap">
                    <canvas id="z6-canvas" width="800" height="340" class="game-canvas"></canvas>
                </div>

                <div class="live-formula-strip">
                    <div class="formula-node">
                        <span class="fn-val" id="z6-rover-state">STATIONARY</span>
                        <span class="fn-label">ROVER STATE</span>
                    </div>
                    <span class="formula-op">&rarr;</span>
                    <div class="formula-node">
                        <span class="fn-val formula-res" id="z6-graph-shape">HORIZONTAL LINE</span>
                        <span class="fn-label">GRAPH BEHAVIOUR</span>
                    </div>
                </div>
            </div>

            <div class="challenge-card" id="z6-challenge-card">
                <div class="challenge-header">
                    <span class="challenge-tag">CHALLENGE 6.1 &middot; GRAPH INTERPRETATION</span>
                    <span class="challenge-xp-badge">+100 PTS &middot; +150 XP</span>
                </div>
                <p class="challenge-question-text">
                    In a distance–time graph, an object moves from 0 m to 200 m between 0 and 4 minutes. From 4 to 8 minutes, the graph line is perfectly horizontal at 200 m. Which statement correctly interprets this horizontal section?
                </p>
                <div class="challenge-options" id="z6-options">
                    <button class="challenge-opt-btn" data-ans="A">
                        <span class="opt-letter">A</span>
                        <span>The object is moving backwards towards the starting point.</span>
                    </button>
                    <button class="challenge-opt-btn" data-ans="B">
                        <span class="opt-letter">B</span>
                        <span>The object is stationary because its distance remains constant while time continues to increase.</span>
                    </button>
                    <button class="challenge-opt-btn" data-ans="C">
                        <span class="opt-letter">C</span>
                        <span>The object is travelling with infinitely high speed.</span>
                    </button>
                    <button class="challenge-opt-btn" data-ans="D">
                        <span class="opt-letter">D</span>
                        <span>Time has stopped increasing.</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    const canvas = $('z6-canvas');
    const ctx = canvas.getContext('2d');
    let points = [{ t: 0, s: 0 }];
    let currentTime = 0;
    let currentDist = 0;
    let roverState = 'stop'; // 'drive' or 'stop'

    $('z6-move-btn').addEventListener('click', () => {
        roverState = 'drive';
        $('z6-rover-state').textContent = 'DRIVING (Uniform Speed)';
        $('z6-graph-shape').textContent = 'RISING STRAIGHT LINE';
        sfx.click();
    });

    $('z6-stop-btn').addEventListener('click', () => {
        roverState = 'stop';
        $('z6-rover-state').textContent = 'STATIONARY (Rest)';
        $('z6-graph-shape').textContent = 'HORIZONTAL FLAT LINE';
        sfx.click();
    });

    $('z6-reset-btn').addEventListener('click', () => {
        roverState = 'stop';
        points = [{ t: 0, s: 0 }];
        currentTime = 0;
        currentDist = 0;
        $('z6-rover-state').textContent = 'STATIONARY';
        $('z6-graph-shape').textContent = 'HORIZONTAL LINE';
        sfx.click();
    });

    function drawZ6() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Graph Origin (80, 280), Width 660, Height 220
        const ox = 80, oy = 280;

        // Grid
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        for (let x = ox; x <= ox + 660; x += 66) {
            ctx.beginPath(); ctx.moveTo(x, oy); ctx.lineTo(x, oy - 220); ctx.stroke();
        }
        for (let y = oy; y >= oy - 220; y -= 44) {
            ctx.beginPath(); ctx.moveTo(ox, y); ctx.lineTo(ox + 660, y); ctx.stroke();
        }

        // Axes
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + 670, oy); // X-axis (Time)
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox, oy - 230); // Y-axis (Distance)
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px Space Mono';
        ctx.fillText('Time (s) →', ox + 590, oy + 25);
        ctx.save();
        ctx.translate(ox - 30, oy - 100);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Distance (m) →', 0, 0);
        ctx.restore();

        // Update live graph
        if (currentTime < 60) {
            currentTime += 0.08;
            if (roverState === 'drive') {
                currentDist += 0.35;
            }
            points.push({ t: currentTime, s: currentDist });
        }

        // Draw plotted line
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;
        ctx.beginPath();
        points.forEach((p, idx) => {
            const px = ox + (p.t / 60) * 640;
            const py = oy - (p.s / 200) * 200;
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        });
        ctx.stroke();

        // Live Rover Animation on Top
        const lastPt = points[points.length - 1];
        const roverScreenX = ox + (lastPt.t / 60) * 640;
        ctx.fillStyle = roverState === 'drive' ? '#10b981' : '#f43f5e';
        ctx.beginPath();
        ctx.arc(roverScreenX, oy - (lastPt.s / 200) * 200, 6, 0, Math.PI * 2);
        ctx.fill();

        activeAnimationId = requestAnimationFrame(drawZ6);
    }
    drawZ6();

    setupChallengeOptions('z6-options', 'B', 'graphs', {
        title: 'Horizontal Distance–Time Graph',
        explanation: 'When an object is stationary, its distance from the origin remains unchanged while time progresses normally. On a distance–time graph, this creates a perfectly horizontal line parallel to the time axis.',
        nextZone: 7
    });
}

// ─────────────────────────────────────────────────────────────────
// ZONE 7: FINAL MOTION MISSION (Synthesis & Delivery)
// ─────────────────────────────────────────────────────────────────
function renderZone7(container) {
    container.innerHTML = `
        <div class="zone-container">
            <div class="zone-header-card">
                <div class="zone-badge-tag">ZONE 07 &middot; GRAND CAPSTONE</div>
                <h1 class="zone-main-title">Final Motion Mission: Arctic Core Delivery</h1>
                <p class="zone-subtitle">Integrate all your knowledge: calculate multi-stage average speeds, verify pendulum clock frequency, and analyze journey telemetry to deliver the Science Core!</p>
            </div>

            <div class="challenge-card" id="z7-challenge-card">
                <div class="challenge-header">
                    <span class="challenge-tag">FINAL TEST &middot; MULTI-STEP CAPSTONE</span>
                    <span class="challenge-xp-badge">+250 PTS &middot; +300 XP</span>
                </div>
                <p class="challenge-question-text">
                    The Science Rover leaves Base Alpha at 08:00 AM. It travels <strong>300 m in the first 5 minutes</strong>, stops outside an outpost for <strong>5 minutes to recharge</strong>, and then travels another <strong>200 m in the next 4 minutes</strong> before arriving at the station.
                    <br><br>
                    Which of the following calculates the <strong>average speed of the entire journey</strong> correctly according to the chapter?
                </p>
                <div class="challenge-options" id="z7-options">
                    <button class="challenge-opt-btn" data-ans="A">
                        <span class="opt-letter">A</span>
                        <span>Divide 500 m by 9 minutes, because stationary time should be excluded.</span>
                    </button>
                    <button class="challenge-opt-btn" data-ans="B">
                        <span class="opt-letter">B</span>
                        <span>Divide 500 m by the full 14 minutes, because average speed for the complete journey uses Total Distance &divide; Total Time including stopping intervals.</span>
                    </button>
                    <button class="challenge-opt-btn" data-ans="C">
                        <span class="opt-letter">C</span>
                        <span>Average speed cannot be calculated because the vehicle stopped.</span>
                    </button>
                    <button class="challenge-opt-btn" data-ans="D">
                        <span class="opt-letter">D</span>
                        <span>Add the initial and final speeds and divide by two.</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    setupChallengeOptions('z7-options', 'B', 'graphs', {
        title: 'Total Journey Average Speed',
        explanation: 'Average speed for a complete journey is defined as the Total Distance Covered divided by the Total Time Taken (including all stopping and waiting intervals).',
        isFinal: true
    });
}

// ─────────────────────────────────────────────────────────────────
// CHALLENGE OPTION SETUP & REMEDIATION MODAL
// ─────────────────────────────────────────────────────────────────
function setupChallengeOptions(optionsContainerId, correctAns, conceptKey, meta) {
    const container = $(optionsContainerId);
    if (!container) return;

    container.querySelectorAll('.challenge-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const chosen = btn.getAttribute('data-ans');
            const isCorrect = chosen === correctAns;

            container.querySelectorAll('.challenge-opt-btn').forEach(b => {
                b.disabled = true;
                if (b.getAttribute('data-ans') === correctAns) b.classList.add('correct');
                else if (b.getAttribute('data-ans') === chosen && !isCorrect) b.classList.add('wrong');
            });

            addPoints(isCorrect ? 100 : 0, isCorrect ? 150 : 25, conceptKey, isCorrect);

            if (!isCorrect) {
                // Log mistake
                state.mistakesLog.push({
                    zone: state.currentZone,
                    concept: conceptKey,
                    question: container.closest('.challenge-card').querySelector('.challenge-question-text').textContent.trim(),
                    chosen,
                    correct: correctAns,
                    explanation: meta.explanation
                });

                // Show Remediation
                setTimeout(() => {
                    $('remed-title').textContent = meta.title;
                    $('remed-explanation').innerHTML = `<p>${meta.explanation}</p>`;
                    $('remediation-modal').classList.remove('hidden');
                }, 600);
            } else {
                state.completedZones.add(state.currentZone);
                updateHUD();
                if (meta.nextZone) {
                    setTimeout(() => {
                        loadZone(meta.nextZone);
                    }, 1200);
                } else if (meta.isFinal) {
                    setTimeout(() => {
                        showFinalResults();
                    }, 1000);
                }
            }
        });
    });
}

// ─────────────────────────────────────────────────────────────────
// FINAL RESULTS & POINTS CARD
// ─────────────────────────────────────────────────────────────────
function showFinalResults() {
    sfx.fanfare();
    const container = $('zone-view');
    const totalAttempted = Object.values(state.conceptMastery).reduce((acc, c) => acc + c.total, 0);
    const totalCorrect = Object.values(state.conceptMastery).reduce((acc, c) => acc + c.correct, 0);
    const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 100;

    let rank = '🏆 MOTION MASTER';
    if (accuracy < 60) rank = '🌱 SCIENCE APPRENTICE';
    else if (accuracy < 85) rank = '⚡ SPEED SPECIALIST';

    container.innerHTML = `
        <div class="results-dashboard">
            <div class="results-hero-card">
                <div class="res-tag">MISSION ACCOMPLISHED &middot; OFFICIAL REPORT</div>
                <h1 class="res-title">Your Motion Profile</h1>
                <div class="res-score-flex">
                    <span class="res-big-pts">${state.points}</span>
                    <span class="res-pts-sub">POINTS EARNED &middot; ${state.xp} XP</span>
                </div>
                <div style="font-family: var(--font-mono); font-size: 16px; color: var(--accent-emerald); font-weight: 700; margin-bottom: 24px;">
                    ${rank} &middot; ${accuracy}% Accuracy
                </div>
                <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
                    <button id="btn-open-share-card" class="btn-game-primary">&#127942; VIEW &amp; SHARE POINTS CARD</button>
                    <button id="btn-replay-weak" class="btn-game-ghost">&#8635; REPLAY WEAK CONCEPTS</button>
                </div>
            </div>

            <div class="zone-header-card">
                <div class="zone-badge-tag">CONCEPT BREAKDOWN</div>
                <h2 style="font-family: var(--font-serif); font-size: 24px; margin-bottom: 16px;">Detailed Learning Mastery</h2>
                <div class="mastery-grid">
                    ${Object.entries(state.conceptMastery).map(([key, val]) => {
                        const pct = val.total > 0 ? Math.round((val.correct / val.total) * 100) : 100;
                        return `
                            <div class="mastery-card">
                                <div class="m-header">
                                    <span>${val.label}</span>
                                    <span class="m-pct">${pct}%</span>
                                </div>
                                <div class="m-bar-bg">
                                    <div class="m-bar-fill" style="width: ${pct}%;"></div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- WHERE YOU GOT WRONG -->
            <div class="mistakes-review-card">
                <div class="zone-badge-tag">DIAGNOSTIC REVIEW</div>
                <h2 style="font-family: var(--font-serif); font-size: 24px; margin-bottom: 16px;">Where You Got Wrong &amp; How to Master It</h2>
                ${state.mistakesLog.length === 0 ? `
                    <p style="color: var(--accent-emerald); font-size: 15px;">&#10003; Outstanding! You answered every concept challenge with 100% accuracy on the first attempt!</p>
                ` : state.mistakesLog.map((m, idx) => `
                    <div class="review-item-game">
                        <span class="rig-badge">ZONE 0${m.zone} &middot; MISCONCEPTION DETECTED</span>
                        <div class="rig-q">${idx + 1}. ${m.question}</div>
                        <div class="rig-explanation">
                            <strong style="color: var(--accent-emerald);">&#128161; Scientific Rule:</strong> ${m.explanation}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Hook View & Share Card
    $('btn-open-share-card').addEventListener('click', () => {
        populateShareModal(rank, accuracy);
        $('share-card-modal').classList.remove('hidden');
    });

    $('btn-replay-weak').addEventListener('click', () => {
        // Find weakest concept zone
        let lowestZone = 1;
        let minPct = 101;
        const zoneMap = { 'motion_rest': 1, 'speed': 2, 'uniform_motion': 3, 'time_measurement': 4, 'pendulum': 5, 'graphs': 6 };
        Object.entries(state.conceptMastery).forEach(([k, v]) => {
            const p = v.total > 0 ? (v.correct / v.total) : 1;
            if (p < minPct) {
                minPct = p;
                lowestZone = zoneMap[k] || 1;
            }
        });
        loadZone(lowestZone);
    });
}

function populateShareModal(rank, accuracy) {
    $('card-pts-val').textContent = state.points;
    $('card-xp-val').textContent = state.xp;
    $('card-streak-val').textContent = state.maxStreak;
    $('card-zones-val').textContent = `${state.completedZones.size} / 7`;
    $('card-rank-badge').textContent = rank;
    $('card-acc-val').textContent = `${accuracy}% Accuracy`;
    $('card-date-val').textContent = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const masteryContainer = $('card-mastery-list');
    masteryContainer.innerHTML = Object.entries(state.conceptMastery).map(([k, v]) => {
        const p = v.total > 0 ? Math.round((v.correct / v.total) * 100) : 100;
        return `<div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px;"><span>${v.label}</span><span style="color:var(--accent-cyan);">${p}%</span></div>`;
    }).join('');
}

function copyScorecard() {
    const text = `🚀 MOTION MISSION SCORECARD — Class 7 Science\nPoints: ${state.points} PTS | XP: ${state.xp}\nCompleted: 7/7 Zones | Max Streak: ${state.maxStreak}\nPlay & Learn: ${window.location.href}`;
    navigator.clipboard.writeText(text).then(() => {
        alert('Scorecard copied to clipboard! You can now paste and share your score.');
    }).catch(() => {
        alert(text);
    });
}

function downloadScorecardPDF() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        alert('PDF generator is initializing, please try again.');
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageW, 35, 'F');
    doc.setTextColor(6, 182, 212);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('MOTION MISSION — POINTS CARD', pageW / 2, 18, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text('NCERT Class 7 Science — Motion and Time', pageW / 2, 26, { align: 'center' });

    // Points Box
    doc.setFillColor(248, 250, 252);
    doc.rect(20, 45, pageW - 40, 45, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(20, 45, pageW - 40, 45, 'S');

    doc.setTextColor(245, 158, 11);
    doc.setFontSize(32);
    doc.text(`${state.points} PTS`, pageW / 2, 65, { align: 'center' });
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    doc.text(`Total XP: ${state.xp}   |   Max Streak: ${state.maxStreak}   |   Zones: 7/7 Completed`, pageW / 2, 78, { align: 'center' });

    // Concept Breakdown
    let y = 105;
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text('CONCEPT MASTERY PROFILE:', 20, y);
    y += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    Object.entries(state.conceptMastery).forEach(([k, v]) => {
        const pct = v.total > 0 ? Math.round((v.correct / v.total) * 100) : 100;
        doc.text(`• ${v.label}:`, 24, y);
        doc.text(`${pct}%`, pageW - 35, y, { align: 'right' });
        y += 8;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')} — testiiii Science Platform`, pageW / 2, 280, { align: 'center' });

    doc.save('Motion_Mission_Points_Card.pdf');
}
