/* ═══════════════════════════════════════════════
   testiiii — Main Script
   ═══════════════════════════════════════════════ */

// ── State ──────────────────────────────────────
let testStarted    = false;
let testSubmitted  = false;
let timerInterval  = null;
let timeLeft       = 25 * 60;
let timeUsed       = 0;
let currentQuestions = [];
let scorecardData  = {};

// ── DOM refs (resolved lazily on need) ─────────
const $ = id => document.getElementById(id);

// ─────────────────────────────────────────────
// NAVIGATION / MOBILE MENU & AUTHOR SPLASH
// ─────────────────────────────────────────────
function closeMobileMenu() {
    $('mobile-menu').classList.add('hidden');
}

function showAuthorSplash() {
    $('home-screen').classList.add('hidden');
    $('quiz-screen').classList.add('hidden');
    $('result-screen').classList.add('hidden');
    $('author-splash').classList.remove('hidden');
    window.scrollTo(0, 0);
}

function hideAuthorSplash() {
    $('author-splash').classList.add('hidden');
    $('home-screen').classList.remove('hidden');
    window.scrollTo(0, 0);
}

document.addEventListener('DOMContentLoaded', () => {

    // Author Splash Screen Continue button
    const splashContinueBtn = $('splash-continue-btn');
    if (splashContinueBtn) {
        splashContinueBtn.addEventListener('click', hideAuthorSplash);
    }

    // Nav Author profile button
    const navAuthorBtn = $('nav-author-btn');
    if (navAuthorBtn) {
        navAuthorBtn.addEventListener('click', showAuthorSplash);
    }

    // Footer Author link button
    const footerAuthorBtn = $('footer-author-btn');
    if (footerAuthorBtn) {
        footerAuthorBtn.addEventListener('click', showAuthorSplash);
    }

    // Hamburger
    const hamburger = $('hamburger-btn');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            $('mobile-menu').classList.toggle('hidden');
        });
    }

    // Nav "Start Test" → scroll to form
    const navStartBtn = $('nav-start-btn');
    if (navStartBtn) {
        navStartBtn.addEventListener('click', () => {
            $('start-section').scrollIntoView({ behavior: 'smooth' });
            closeMobileMenu();
        });
    }

    // Hero "Take a Test" → scroll to form
    const heroStartBtn = $('hero-start-btn');
    if (heroStartBtn) {
        heroStartBtn.addEventListener('click', () => {
            $('start-section').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Chapter cards "START →" buttons
    document.querySelectorAll('.chapter-start-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const chapter = btn.getAttribute('data-chapter');
            // Pre-select in the form and scroll to it
            $('chapter-select').value = chapter;
            $('start-section').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => $('student-name').focus(), 600);
        });
    });

    // Review filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterReview(btn.getAttribute('data-filter'));
        });
    });

    // Restart button
    const restartBtn = $('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', restartApp);
    }

    // Start form submit
    const startForm = $('start-form');
    if (startForm) {
        startForm.addEventListener('submit', handleStartForm);
    }

    // Quiz submit button
    const submitBtn = $('submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            if (confirm('Submit the test? This cannot be undone.')) {
                submitTest();
            }
        });
    }

    // Track answered questions for progress
    document.addEventListener('change', e => {
        if (e.target.type === 'radio') {
            updateProgress();
            // Mark card as answered
            const card = e.target.closest('.question-card');
            if (card) card.classList.add('answered');
        }
    });
});

// ─────────────────────────────────────────────
// START FORM
// ─────────────────────────────────────────────
function handleStartForm(e) {
    e.preventDefault();
    const name = $('student-name').value.trim();
    const chapterEl = $('chapter-select');
    const chapterVal = chapterEl.value;

    const chapterMap = {
        'physical':       { questions: () => questions_physical,       label: 'Ch. 6 — Physical & Chemical Changes' },
        'heat':           { questions: () => questions_heat,           label: 'Ch. 3 — Heat' },
        'forests':        { questions: () => questions_forests,        label: 'Ch. 12 — Forests: Our Lifeline' },
        'transportation': { questions: () => questions_transportation,  label: 'Ch. 7 — Transportation (Part 1)' },
        'transportation2':{ questions: () => questions_transportation2, label: 'Ch. 7 — Transportation (Part 2)' },
        'reproduction':   { questions: () => questions_reproduction,   label: 'Ch. 8 — Reproduction in Plants (Part 1)' },
        'reproduction2':  { questions: () => questions_reproduction2,  label: 'Ch. 8 — Reproduction in Plants (Part 2 — Very Hard)' }
    };

    const selected = chapterMap[chapterVal];
    if (!selected) return;

    currentQuestions = selected.questions();
    if (!currentQuestions || currentQuestions.length === 0) {
        alert('Questions not loaded yet. Please refresh and try again.');
        return;
    }

    scorecardData = {
        studentName:  name,
        chapterLabel: chapterEl.options[chapterEl.selectedIndex].text,
        chapterVal:   chapterVal
    };

    // Update quiz screen
    $('display-name').textContent = name;
    $('qtb-chapter').textContent = selected.label;
    $('total-count').textContent = currentQuestions.length;
    $('answered-count').textContent = '0';

    renderQuestions(currentQuestions);

    // Switch screens
    $('home-screen').classList.add('hidden');
    $('quiz-screen').classList.remove('hidden');
    window.scrollTo(0, 0);

    testStarted   = true;
    testSubmitted = false;
    timeLeft      = 25 * 60;
    timeUsed      = 0;
    startTimer();
}

// ─────────────────────────────────────────────
// RENDER QUESTIONS
// ─────────────────────────────────────────────
function renderQuestions(questions) {
    const container = $('questions-container');
    container.innerHTML = '';

    questions.forEach((q, index) => {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.id = `qcard-${q.id}`;

        // Header
        const header = document.createElement('div');
        header.className = 'q-header';
        const imgHtml = q.image ? `<div class="question-image-wrap"><img src="${q.image}" alt="Question Diagram" class="question-diagram-img" loading="lazy"></div>` : '';
        header.innerHTML = `<span class="q-num">Q ${String(index + 1).padStart(2, '0')}</span>
                            <div class="question-text">${q.question}${imgHtml}</div>`;
        card.appendChild(header);

        // Options
        const opts = document.createElement('div');
        opts.className = 'options-container';

        for (const [key, value] of Object.entries(q.options)) {
            const label = document.createElement('label');
            label.className = 'option-label';
            label.innerHTML = `
                <input type="radio" name="q${q.id}" value="${key}">
                <span class="opt-key">${key}</span>
                <span class="opt-text">${value}</span>
            `;
            opts.appendChild(label);
        }

        card.appendChild(opts);
        container.appendChild(card);
    });

    updateProgress();
}

// ─────────────────────────────────────────────
// PROGRESS
// ─────────────────────────────────────────────
function updateProgress() {
    const total = currentQuestions.length;
    let answered = 0;
    currentQuestions.forEach(q => {
        if (document.querySelector(`input[name="q${q.id}"]:checked`)) answered++;
    });
    $('answered-count').textContent = answered;
    $('total-count').textContent = total;
    const pct = total > 0 ? (answered / total) * 100 : 0;
    $('quiz-progress-bar').style.width = pct + '%';
}

// ─────────────────────────────────────────────
// TIMER
// ─────────────────────────────────────────────
function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeLeft--;
        timeUsed++;
        updateTimerDisplay();

        if (timeLeft <= 60) {
            $('timer-display').classList.add('warning');
        }
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitTest();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    $('timer-display').textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ─────────────────────────────────────────────
// SUBMIT TEST
// ─────────────────────────────────────────────
function submitTest() {
    if (testSubmitted) return;
    testSubmitted = true;
    clearInterval(timerInterval);
    hideWarning();

    let score = 0;
    const results = [];

    currentQuestions.forEach(q => {
        const radioEl = document.querySelector(`input[name="q${q.id}"]:checked`);
        const selected = radioEl ? radioEl.value : null;
        const isCorrect = selected === q.answer;
        if (isCorrect) score++;
        results.push({
            id: q.id,
            question: q.question,
            image: q.image,
            options: q.options,
            answer: q.answer,
            selected,
            isCorrect
        });
    });

    const total = currentQuestions.length;
    const pct = Math.round((score / total) * 100);
    const correct  = results.filter(r => r.isCorrect).length;
    const incorrect = results.filter(r => !r.isCorrect && r.selected).length;
    const skipped   = results.filter(r => !r.selected).length;

    // Grade
    let grade = 'F';
    if (pct >= 90) grade = 'A+';
    else if (pct >= 80) grade = 'A';
    else if (pct >= 70) grade = 'B';
    else if (pct >= 60) grade = 'C';
    else if (pct >= 50) grade = 'D';

    // Time used
    const usedMin = Math.floor(timeUsed / 60);
    const usedSec = timeUsed % 60;
    const timeStr = `${String(usedMin).padStart(2, '0')}:${String(usedSec).padStart(2, '0')}`;

    // Store for PDF
    scorecardData.score    = score;
    scorecardData.total    = total;
    scorecardData.pct      = pct;
    scorecardData.grade    = grade;
    scorecardData.correct  = correct;
    scorecardData.incorrect = incorrect;
    scorecardData.skipped  = skipped;
    scorecardData.timeTaken = timeStr;
    scorecardData.results  = results;
    scorecardData.date     = new Date().toLocaleString('en-IN', {
        day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    window._scorecardData = scorecardData;

    // Fill result screen
    $('result-student-name-display').textContent = scorecardData.studentName;
    $('score').textContent           = score;
    $('total-questions').textContent = total;
    $('result-grade').textContent    = grade;
    $('result-pct').textContent      = pct + '%';
    $('rsb-correct').textContent     = correct;
    $('rsb-incorrect').textContent   = incorrect;
    $('rsb-skipped').textContent     = skipped;
    $('rsb-time').textContent        = timeStr;

    // Score message
    const msgs = {
        'A+': 'Outstanding. You have mastered this chapter.',
        'A':  'Excellent work. Just a few gaps to close.',
        'B':  'Good job. Review the questions you missed.',
        'C':  'Decent effort. More practice will sharpen you.',
        'D':  'Keep at it. Go through the detailed review below.',
        'F':  'Don\'t give up. Read the chapter again and retake.'
    };
    $('score-message').textContent = msgs[grade] || '';

    // Build review
    buildReview(results);

    // Switch screens
    $('quiz-screen').classList.add('hidden');
    $('result-screen').classList.remove('hidden');
    window.scrollTo(0, 0);
}

// ─────────────────────────────────────────────
// BUILD REVIEW
// ─────────────────────────────────────────────
function buildReview(results) {
    const container = $('review-list');
    container.innerHTML = '';

    results.forEach((r, idx) => {
        const statusClass = r.isCorrect ? 'ri-correct' : (r.selected ? 'ri-incorrect' : 'ri-skipped');
        const filterAttr  = r.isCorrect ? 'correct'   : (r.selected ? 'incorrect'    : 'skipped');

        const card = document.createElement('div');
        card.className = `review-item ${statusClass}`;
        card.setAttribute('data-status', filterAttr);

        // Q header
        const qh = document.createElement('div');
        qh.className = 'review-q-header';
        const imgHtml = r.image ? `<div class="question-image-wrap"><img src="${r.image}" alt="Question Diagram" class="question-diagram-img" loading="lazy"></div>` : '';
        qh.innerHTML = `<span class="review-q-num">Q ${String(idx + 1).padStart(2, '0')}</span>
                        <div class="review-question">${r.question}${imgHtml}</div>`;
        card.appendChild(qh);

        // Options
        const optsDiv = document.createElement('div');
        optsDiv.className = 'review-options';

        for (const [key, value] of Object.entries(r.options)) {
            const isCorrectOpt = key === r.answer;
            const isWrongOpt   = key === r.selected && !r.isCorrect;
            const optDiv = document.createElement('div');
            optDiv.className = `review-option${isCorrectOpt ? ' ro-correct' : isWrongOpt ? ' ro-wrong' : ''}`;
            optDiv.innerHTML = `<span class="ro-key">${key}</span><span>${value}</span>`;
            optsDiv.appendChild(optDiv);
        }
        card.appendChild(optsDiv);

        // Status line
        const status = document.createElement('div');
        status.className = 'review-status';
        if (r.isCorrect) {
            status.innerHTML = `<span class="status-correct">✓ CORRECT</span>`;
        } else if (r.selected) {
            status.innerHTML = `<span class="status-incorrect">✗ INCORRECT — you chose ${r.selected}, correct is ${r.answer}</span>`;
        } else {
            status.innerHTML = `<span class="status-skipped">— NOT ATTEMPTED — correct is ${r.answer}</span>`;
        }
        card.appendChild(status);

        container.appendChild(card);
    });
}

// ─────────────────────────────────────────────
// FILTER REVIEW
// ─────────────────────────────────────────────
function filterReview(filter) {
    document.querySelectorAll('.review-item').forEach(item => {
        if (filter === 'all' || item.getAttribute('data-status') === filter) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// ─────────────────────────────────────────────
// RESTART
// ─────────────────────────────────────────────
function restartApp() {
    testStarted    = false;
    testSubmitted  = false;
    timeLeft       = 25 * 60;
    timeUsed       = 0;
    currentQuestions = [];
    scorecardData  = {};
    window._scorecardData = null;

    $('timer-display').classList.remove('warning');
    $('timer-display').textContent = '25:00';

    $('result-screen').classList.add('hidden');
    $('quiz-screen').classList.add('hidden');
    $('home-screen').classList.remove('hidden');

    // Reset form
    $('start-form').reset();
    window.scrollTo(0, 0);
}

// ─────────────────────────────────────────────
// ANTI-CHEAT
// ─────────────────────────────────────────────
document.addEventListener('visibilitychange', () => {
    if (testStarted && !testSubmitted && document.hidden) showWarning();
    else if (testStarted && !testSubmitted) setTimeout(hideWarning, 3000);
});
window.addEventListener('blur', () => { if (testStarted && !testSubmitted) showWarning(); });
window.addEventListener('focus', () => { if (testStarted && !testSubmitted) setTimeout(hideWarning, 3000); });

function showWarning() {
    $('warning-overlay').classList.remove('hidden');
    const snd = $('warning-sound');
    if (snd) { snd.volume = 1.0; snd.play().catch(() => {}); }
}
function hideWarning() {
    $('warning-overlay').classList.add('hidden');
    const snd = $('warning-sound');
    if (snd) { snd.pause(); snd.currentTime = 0; }
}


// ═══════════════════════════════════════════════
// PDF GENERATION
// ═══════════════════════════════════════════════
function downloadScoreCard() {
    const data = window._scorecardData;
    if (!data || !data.results) { alert('No scorecard data available.'); return; }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const M = 18;
    const CW = pageW - M * 2;

    // ── COVER: Black header ──
    doc.setFillColor(15, 14, 13);
    doc.rect(0, 0, pageW, 56, 'F');

    // Brand
    doc.setTextColor(240, 237, 232);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text('testiiii.', pageW / 2, 22, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(120, 116, 110);
    doc.setCharSpace(2);
    doc.text('SCIENCE  ·  NCERT  ·  CLASS 7', pageW / 2, 32, { align: 'center' });
    doc.setCharSpace(0);

    doc.setFontSize(8);
    doc.setTextColor(80, 76, 72);
    doc.text(data.chapterLabel || '', pageW / 2, 44, { align: 'center' });

    // ── Score panel ──
    doc.setFillColor(248, 245, 240);
    doc.rect(M, 64, CW, 58, 'F');
    doc.setDrawColor(200, 196, 190);
    doc.rect(M, 64, CW, 58, 'S');

    // Big score
    let gradeColor = [139, 26, 26];
    if (data.pct >= 90) gradeColor = [26, 92, 53];
    else if (data.pct >= 80) gradeColor = [26, 92, 53];
    else if (data.pct >= 70) gradeColor = [30, 60, 120];
    else if (data.pct >= 60) gradeColor = [140, 100, 0];
    else if (data.pct >= 50) gradeColor = [160, 80, 0];

    doc.setTextColor(...gradeColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(42);
    doc.text(`${data.score} / ${data.total}`, pageW / 2 - 14, 94, { align: 'center' });

    doc.setFontSize(18);
    doc.text(data.grade, pageW / 2 + 36, 94);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(122, 118, 114);
    doc.setCharSpace(1.5);
    doc.text(`${data.pct}%  SCORE`, pageW / 2, 104, { align: 'center' });
    doc.setCharSpace(0);

    // Student + date
    doc.setTextColor(42, 40, 38);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Student: ${data.studentName}`, M + 4, 118);
    doc.text(`Date: ${data.date}`, pageW - M - 4, 118, { align: 'right' });

    // Divider
    doc.setDrawColor(200, 196, 190);
    doc.line(M, 124, pageW - M, 124);

    // Stats row
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 92, 53);
    doc.text(`✓ CORRECT: ${data.correct}`, M + 4, 133);
    doc.setTextColor(139, 26, 26);
    doc.text(`✗ INCORRECT: ${data.incorrect}`, M + 52, 133);
    doc.setTextColor(100, 96, 92);
    doc.text(`— SKIPPED: ${data.skipped}`, M + 106, 133);
    doc.setTextColor(42, 40, 38);
    doc.text(`⏱ TIME: ${data.timeTaken}`, M + 144, 133);

    // ── Question Review heading ──
    let y = 148;
    doc.setDrawColor(200, 196, 190);
    doc.line(M, y, pageW - M, y);
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(122, 118, 114);
    doc.setCharSpace(2);
    doc.text('DETAILED QUESTION REVIEW', M, y);
    doc.setCharSpace(0);
    y += 10;

    // ── Per-question blocks ──
    data.results.forEach((r) => {
        const qLines = doc.splitTextToSize(`${r.id}. ${r.question}`, CW - 14);
        const optCount = Object.keys(r.options).length;
        const blockH = 8 + qLines.length * 4.5 + optCount * 5.5 + 8;

        if (y + blockH > pageH - 18) {
            doc.addPage();
            // mini header repeat
            doc.setFillColor(15, 14, 13);
            doc.rect(0, 0, pageW, 12, 'F');
            doc.setTextColor(200, 196, 190);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7);
            doc.text('testiiii. — SCORE CARD', M, 8);
            doc.text(data.studentName, pageW - M, 8, { align: 'right' });
            y = 20;
        }

        const bgColor = r.isCorrect ? [232, 245, 238] : (r.selected ? [250, 234, 234] : [245, 243, 239]);
        const lineColor = r.isCorrect ? [26, 92, 53] : (r.selected ? [139, 26, 26] : [160, 156, 150]);

        doc.setFillColor(...bgColor);
        doc.rect(M, y, CW, blockH, 'F');
        doc.setDrawColor(...lineColor);
        doc.setLineWidth(0.7);
        doc.line(M, y, M, y + blockH);
        doc.setLineWidth(0.2);

        // Question text
        let qy = y + 5.5;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(32, 30, 28);
        qLines.forEach(line => { doc.text(line, M + 4, qy); qy += 4.5; });

        // Status badge top right
        doc.setFontSize(7.5);
        if (r.isCorrect) {
            doc.setTextColor(26, 92, 53);
            doc.text('✓ CORRECT', pageW - M - 2, y + 5.5, { align: 'right' });
        } else if (r.selected) {
            doc.setTextColor(139, 26, 26);
            doc.text(`✗ CHOSE ${r.selected}`, pageW - M - 2, y + 5.5, { align: 'right' });
        } else {
            doc.setTextColor(122, 118, 114);
            doc.text('— SKIPPED', pageW - M - 2, y + 5.5, { align: 'right' });
        }

        // Options
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        for (const [key, value] of Object.entries(r.options)) {
            const isCorrectOpt = key === r.answer;
            const isWrongOpt   = key === r.selected && !r.isCorrect;
            if (isCorrectOpt) { doc.setTextColor(26, 92, 53); doc.setFont('helvetica', 'bold'); }
            else if (isWrongOpt) { doc.setTextColor(139, 26, 26); doc.setFont('helvetica', 'bold'); }
            else { doc.setTextColor(122, 118, 114); doc.setFont('helvetica', 'normal'); }
            const prefix = isCorrectOpt ? '✓' : (isWrongOpt ? '✗' : ' ');
            doc.text(`  ${prefix} ${key}. ${value}`, M + 4, qy);
            qy += 5.5;
        }

        y += blockH + 2;
    });

    // Footer
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(160, 156, 150);
    doc.text('testiiii. — Created by Sarthak Pandey — NCERT Class 7 Science', pageW / 2, pageH - 6, { align: 'center' });

    const filename = `testiiii_ScoreCard_${(data.studentName || 'Student').replace(/\s+/g, '_')}.pdf`;
    doc.save(filename);
}

// ═══════════════════════════════════════════════
// SHARE
// ═══════════════════════════════════════════════
async function shareScoreCard() {
    const data = window._scorecardData;
    if (!data) { alert('No scorecard data available.'); return; }

    const text = `📚 testiiii — Science Test Result
👤 ${data.studentName}
📖 ${data.chapterLabel}
🎯 Score: ${data.score}/${data.total} (${data.pct}%) — Grade: ${data.grade}
📅 ${data.date}

Taken on testiiii — Science Chapter Tests by Sarthak Pandey`;

    if (navigator.share) {
        try { await navigator.share({ title: 'testiiii Score Card', text }); }
        catch (err) { if (err.name !== 'AbortError') console.error(err); }
    } else {
        try {
            await navigator.clipboard.writeText(text);
            const btn = $('share-btn');
            const orig = btn.innerHTML;
            btn.textContent = '✅ COPIED!';
            setTimeout(() => { btn.innerHTML = orig; }, 2500);
        } catch {
            alert(text);
        }
    }
}
