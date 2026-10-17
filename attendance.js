/**
 * ══════════════════════════════════════════════════════════════════════════════
 * testiiii — ATTENDANCE PORTAL ENGINE
 * Computes stats, renders daily ledger, roster analytics, calendar heatmap,
 * and provides the Daily Code Snippet Generator.
 * ══════════════════════════════════════════════════════════════════════════════
 */

// Global State
let currentDateIndex = 0; // Index in ATTENDANCE_LOGS (0 is the latest)
let currentFilter = 'all';
let searchQuery = '';
let activeTab = 'daily';
let selectedStudentId = null;

// Helper Code Generator Temporary State
let generatorState = {
    date: new Date().toISOString().split('T')[0],
    topic: "Chapter Revision & Quiz",
    instructor: "Sarthak Pandey",
    note: "Regular Session",
    attendance: {}
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    if (typeof STUDENTS_ROSTER === 'undefined' || typeof ATTENDANCE_LOGS === 'undefined') {
        console.error("Attendance database not found. Ensure attendance_data.js is loaded.");
        return;
    }

    // Sort logs by date descending (latest first)
    ATTENDANCE_LOGS.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Render Metrics
    renderOverviewMetrics();

    // Setup Date Dropdown
    populateDateDropdown();

    // Render Current Day Ledger
    renderDailyView();

    // Render Roster Grid
    renderRosterGrid();

    // Render Calendar
    renderCalendar();

    // Setup Event Listeners
    setupEventListeners();
}

/**
 * Computes aggregate and student-level statistics
 */
function computeAllStats() {
    const totalLogs = ATTENDANCE_LOGS.length;
    const studentStats = {};

    STUDENTS_ROSTER.forEach(s => {
        studentStats[s.id] = {
            id: s.id,
            roll: s.roll,
            name: s.name,
            batch: s.batch,
            avatar: s.avatar,
            contact: s.contact,
            present: 0,
            absent: 0,
            late: 0,
            excused: 0,
            totalDays: totalLogs,
            streak: 0,
            history: []
        };
    });

    // Populate history and counts
    ATTENDANCE_LOGS.forEach(log => {
        STUDENTS_ROSTER.forEach(s => {
            const status = (log.attendance && log.attendance[s.id]) ? log.attendance[s.id].toUpperCase() : 'A';
            const statObj = studentStats[s.id];

            statObj.history.push({
                date: log.date,
                topic: log.topic,
                status: status
            });

            if (status === 'P') statObj.present++;
            else if (status === 'L') statObj.late++;
            else if (status === 'E') statObj.excused++;
            else statObj.absent++;
        });
    });

    // Compute percentages & streak
    let totalPresentOverall = 0;
    let totalPossibleDays = totalLogs * STUDENTS_ROSTER.length;

    Object.values(studentStats).forEach(s => {
        // Effective attendance weight: P=1, L=1, E=1, A=0
        const attendedUnits = s.present + s.late + s.excused;
        s.rate = s.totalDays > 0 ? ((attendedUnits / s.totalDays) * 100) : 0;
        totalPresentOverall += attendedUnits;

        // Current streak from newest log backwards
        let streak = 0;
        for (let i = 0; i < s.history.length; i++) {
            const st = s.history[i].status;
            if (st === 'P' || st === 'L' || st === 'E') {
                streak++;
            } else {
                break;
            }
        }
        s.streak = streak;
    });

    const classAverageRate = totalPossibleDays > 0 ? ((totalPresentOverall / totalPossibleDays) * 100) : 0;

    return {
        studentStats,
        classAverageRate,
        totalLogs,
        totalStudents: STUDENTS_ROSTER.length
    };
}

/**
 * Top KPI Cards
 */
function renderOverviewMetrics() {
    const stats = computeAllStats();
    const students = Object.values(stats.studentStats);

    const highAttendanceCount = students.filter(s => s.rate >= 90).length;
    const atRiskCount = students.filter(s => s.rate < 75).length;

    document.getElementById('metric-avg-rate').textContent = `${stats.classAverageRate.toFixed(1)}%`;
    document.getElementById('metric-total-students').textContent = stats.totalStudents;
    document.getElementById('metric-total-days').textContent = stats.totalLogs;
    document.getElementById('metric-honor-roll').textContent = highAttendanceCount;
    document.getElementById('metric-at-risk').textContent = atRiskCount;
}

/**
 * Populates the date selector dropdown
 */
function populateDateDropdown() {
    const select = document.getElementById('date-dropdown-select');
    select.innerHTML = '';

    ATTENDANCE_LOGS.forEach((log, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = `${log.date} (${log.day || getDayName(log.date)}) — ${log.topic || 'Class'}`;
        select.appendChild(opt);
    });

    select.value = currentDateIndex;
}

function getDayName(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * Render Daily Ledger View
 */
function renderDailyView() {
    const log = ATTENDANCE_LOGS[currentDateIndex];
    if (!log) return;

    // Update Date Header
    const formattedDate = new Date(log.date + "T00:00:00").toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    document.getElementById('current-day-title').textContent = formattedDate;
    document.getElementById('current-day-subtitle').textContent = 
        `${log.topic || 'Regular Session'} · Instructor: ${log.instructor || 'Sarthak Pandey'}${log.note ? ' · ' + log.note : ''}`;

    // Update Prev / Next buttons
    document.getElementById('btn-prev-day').disabled = currentDateIndex >= ATTENDANCE_LOGS.length - 1;
    document.getElementById('btn-next-day').disabled = currentDateIndex <= 0;
    document.getElementById('date-dropdown-select').value = currentDateIndex;

    // Count day metrics
    let pCount = 0, aCount = 0, lCount = 0, eCount = 0;
    STUDENTS_ROSTER.forEach(s => {
        const st = (log.attendance && log.attendance[s.id]) ? log.attendance[s.id].toUpperCase() : 'A';
        if (st === 'P') pCount++;
        else if (st === 'A') aCount++;
        else if (st === 'L') lCount++;
        else if (st === 'E') eCount++;
    });

    const dayTotal = STUDENTS_ROSTER.length;
    const dayRate = dayTotal > 0 ? (((pCount + lCount + eCount) / dayTotal) * 100).toFixed(1) : 0;

    document.getElementById('day-pill-present').textContent = `Present: ${pCount}`;
    document.getElementById('day-pill-absent').textContent = `Absent: ${aCount}`;
    document.getElementById('day-pill-late').textContent = `Late: ${lCount}`;
    document.getElementById('day-pill-rate').textContent = `Day Attendance: ${dayRate}%`;

    // Render Table Rows
    const tbody = document.getElementById('daily-table-body');
    tbody.innerHTML = '';

    const allStats = computeAllStats().studentStats;

    let filteredList = STUDENTS_ROSTER.filter(s => {
        const st = (log.attendance && log.attendance[s.id]) ? log.attendance[s.id].toUpperCase() : 'A';
        
        // Search filter
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              s.roll.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;

        // Status filter
        if (currentFilter === 'all') return true;
        if (currentFilter === 'present' && st === 'P') return true;
        if (currentFilter === 'absent' && st === 'A') return true;
        if (currentFilter === 'late' && (st === 'L' || st === 'E')) return true;

        return false;
    });

    if (filteredList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:32px; color:var(--text-muted); font-family:var(--font-mono);">No students found matching your search/filter.</td></tr>`;
        return;
    }

    filteredList.forEach(s => {
        const st = (log.attendance && log.attendance[s.id]) ? log.attendance[s.id].toUpperCase() : 'A';
        const stData = allStats[s.id];

        let badgeClass = 'badge-present';
        let badgeText = 'Present';

        if (st === 'A') {
            badgeClass = 'badge-absent';
            badgeText = 'Absent';
        } else if (st === 'L') {
            badgeClass = 'badge-late';
            badgeText = 'Late';
        } else if (st === 'E') {
            badgeClass = 'badge-excused';
            badgeText = 'Excused';
        }

        const tr = document.createElement('tr');
        tr.onclick = () => openStudentModal(s.id);

        tr.innerHTML = `
            <td style="font-family:var(--font-mono); font-weight:700; color:var(--text-secondary); width:70px;">
                #${s.roll}
            </td>
            <td>
                <div class="student-col">
                    <div class="student-avatar">${s.avatar || s.name.substring(0,2).toUpperCase()}</div>
                    <div class="student-name-box">
                        <h4>${s.name}</h4>
                        <span>${s.batch || 'Class 7A'}</span>
                    </div>
                </div>
            </td>
            <td>
                <span class="badge-status ${badgeClass}">${badgeText}</span>
            </td>
            <td>
                <div class="pct-bar-wrap">
                    <div class="pct-track">
                        <div class="pct-fill" style="width: ${stData.rate}%; background: ${stData.rate >= 80 ? 'var(--present-color)' : (stData.rate >= 65 ? 'var(--late-color)' : 'var(--absent-color)')};"></div>
                    </div>
                    <span class="pct-text">${stData.rate.toFixed(0)}%</span>
                </div>
            </td>
            <td style="font-family:var(--font-mono); font-size:12px; color:#fb923c;">
                ${stData.streak > 0 ? `🔥 ${stData.streak} days` : '—'}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Render Roster Cumulative View
 */
function renderRosterGrid() {
    const grid = document.getElementById('roster-grid');
    grid.innerHTML = '';

    const allStats = computeAllStats().studentStats;
    const sorted = Object.values(allStats).sort((a, b) => b.rate - a.rate);

    sorted.forEach(s => {
        let tagColor = '#10b981';
        let tagBg = 'rgba(16, 185, 129, 0.15)';
        let tagLabel = 'EXCELLENT';

        if (s.rate < 75) {
            tagColor = '#f43f5e';
            tagBg = 'rgba(244, 63, 94, 0.15)';
            tagLabel = 'AT RISK';
        } else if (s.rate < 85) {
            tagColor = '#f59e0b';
            tagBg = 'rgba(245, 158, 11, 0.15)';
            tagLabel = 'AVERAGE';
        }

        const card = document.createElement('div');
        card.className = 'student-card';
        card.onclick = () => openStudentModal(s.id);

        card.innerHTML = `
            <div class="sc-header">
                <div class="student-col">
                    <div class="student-avatar">${s.avatar}</div>
                    <div class="student-name-box">
                        <h4>${s.name}</h4>
                        <span>Roll #${s.roll} &middot; ${s.batch}</span>
                    </div>
                </div>
                <span class="sc-rate-tag" style="background:${tagBg}; color:${tagColor};">${tagLabel}</span>
            </div>

            <div class="pct-bar-wrap" style="width:100%; margin-bottom:8px;">
                <div class="pct-track" style="height:8px;">
                    <div class="pct-fill" style="width:${s.rate}%; background:${tagColor};"></div>
                </div>
                <span class="pct-text" style="font-size:13px; font-weight:700;">${s.rate.toFixed(1)}%</span>
            </div>

            <div class="sc-stats-row">
                <div class="sc-stat-col">
                    <span>ATTENDED</span>
                    <strong>${s.present + s.late} / ${s.totalDays} Days</strong>
                </div>
                <div class="sc-stat-col">
                    <span>MISSED</span>
                    <strong style="color:var(--absent-color);">${s.absent} Days</strong>
                </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="sc-streak">
                    ${s.streak > 0 ? `🔥 ${s.streak} Days Streak` : 'No active streak'}
                </span>
                <span style="font-family:var(--font-mono); font-size:11px; color:var(--cyan-accent);">
                    View Record &rarr;
                </span>
            </div>
        `;
        grid.appendChild(card);
    });
}

/**
 * Monthly Calendar Grid
 */
function renderCalendar() {
    const calGrid = document.getElementById('cal-days-grid');
    calGrid.innerHTML = '';

    // Use current month of newest log or current date
    const anchorDate = ATTENDANCE_LOGS.length > 0 ? new Date(ATTENDANCE_LOGS[0].date + "T00:00:00") : new Date();
    const year = anchorDate.getFullYear();
    const month = anchorDate.getMonth(); // 0-indexed

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById('cal-month-title').textContent = `${monthNames[month]} ${year}`;

    // Map logs by YYYY-MM-DD
    const logsMap = {};
    ATTENDANCE_LOGS.forEach((l, idx) => {
        logsMap[l.date] = { log: l, index: idx };
    });

    // First day of month (0 = Sun, 1 = Mon, etc.)
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Fill leading empty cells
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'cal-cell cal-empty';
        calGrid.appendChild(emptyCell);
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const cell = document.createElement('div');
        cell.className = 'cal-cell';
        if (dateStr === todayStr) cell.classList.add('today');

        const logEntry = logsMap[dateStr];

        if (logEntry) {
            cell.classList.add('has-log');
            cell.onclick = () => {
                currentDateIndex = logEntry.index;
                switchTab('daily');
                renderDailyView();
                window.scrollTo({ top: 400, behavior: 'smooth' });
            };

            // Calculate day attendance %
            let pres = 0;
            STUDENTS_ROSTER.forEach(s => {
                const st = logEntry.log.attendance[s.id];
                if (st === 'P' || st === 'L' || st === 'E') pres++;
            });
            const rate = ((pres / STUDENTS_ROSTER.length) * 100).toFixed(0);

            let bg = 'rgba(16, 185, 129, 0.2)';
            let color = 'var(--present-color)';
            if (rate < 75) {
                bg = 'rgba(244, 63, 94, 0.2)';
                color = 'var(--absent-color)';
            } else if (rate < 85) {
                bg = 'rgba(245, 158, 11, 0.2)';
                color = 'var(--late-color)';
            }

            cell.innerHTML = `
                <div class="cal-date-num">${day}</div>
                <div class="cal-status-pill" style="background:${bg}; color:${color};">
                    ${rate}%
                </div>
            `;
            cell.title = `${logEntry.log.topic || 'Class'} (${rate}% Present)`;
        } else {
            cell.innerHTML = `<div class="cal-date-num">${day}</div>`;
        }

        calGrid.appendChild(cell);
    }
}

/**
 * Switch Navigation Tabs
 */
function switchTab(tabId) {
    activeTab = tabId;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `tab-${tabId}`);
    });
}

/**
 * Open Student Modal
 */
function openStudentModal(studentId) {
    selectedStudentId = studentId;
    const stats = computeAllStats().studentStats[studentId];
    if (!stats) return;

    const modal = document.getElementById('student-modal');
    document.getElementById('modal-student-name').textContent = stats.name;
    document.getElementById('modal-student-meta').textContent = `Roll #${stats.roll} · ${stats.batch} · ${stats.contact || 'student@school.edu'}`;
    document.getElementById('modal-student-rate').textContent = `${stats.rate.toFixed(1)}%`;
    document.getElementById('modal-student-streak').textContent = `🔥 ${stats.streak} Days Active Streak`;

    document.getElementById('modal-count-present').textContent = stats.present;
    document.getElementById('modal-count-absent').textContent = stats.absent;
    document.getElementById('modal-count-late').textContent = stats.late;
    document.getElementById('modal-count-excused').textContent = stats.excused;

    // Render student history log
    const historyList = document.getElementById('modal-student-history');
    historyList.innerHTML = '';

    stats.history.forEach(item => {
        let badgeClass = 'badge-present';
        let label = 'PRESENT';
        if (item.status === 'A') { badgeClass = 'badge-absent'; label = 'ABSENT'; }
        else if (item.status === 'L') { badgeClass = 'badge-late'; label = 'LATE'; }
        else if (item.status === 'E') { badgeClass = 'badge-excused'; label = 'EXCUSED'; }

        const row = document.createElement('div');
        row.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:#0e131d; border-radius:6px; margin-bottom:6px; font-size:13px; border:1px solid #1a2333;';
        row.innerHTML = `
            <div>
                <strong style="color:#ffffff; font-family:var(--font-mono); font-size:12px;">${item.date}</strong>
                <span style="color:var(--text-muted); margin-left:8px; font-size:12px;">${item.topic || 'Class'}</span>
            </div>
            <span class="badge-status ${badgeClass}">${label}</span>
        `;
        historyList.appendChild(row);
    });

    modal.classList.add('open');
}

function closeStudentModal() {
    document.getElementById('student-modal').classList.remove('open');
}

/**
 * DAILY CODE SNIPPET GENERATOR
 * This lets the teacher mark attendance visually on the web page,
 * then instantly copies the formatted JavaScript code block to paste into attendance_data.js!
 */
function openCodeHelperModal() {
    const modal = document.getElementById('code-helper-modal');
    
    // Set initial date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('gen-date').value = today;
    generatorState.date = today;

    // Default all students to 'P'
    STUDENTS_ROSTER.forEach(s => {
        if (!generatorState.attendance[s.id]) {
            generatorState.attendance[s.id] = 'P';
        }
    });

    renderHelperStudentsList();
    generateCodeSnippet();

    modal.classList.add('open');
}

function closeCodeHelperModal() {
    document.getElementById('code-helper-modal').classList.remove('open');
}

function renderHelperStudentsList() {
    const list = document.getElementById('helper-student-list');
    list.innerHTML = '';

    STUDENTS_ROSTER.forEach(s => {
        const currentVal = generatorState.attendance[s.id] || 'P';
        const row = document.createElement('div');
        row.className = 'helper-student-row';

        row.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-family:var(--font-mono); font-size:11px; color:var(--text-muted); width:28px;">#${s.roll}</span>
                <span style="font-size:13px; color:#ffffff; font-weight:500;">${s.name}</span>
            </div>
            <div class="helper-radio-group">
                <button type="button" class="helper-radio-btn ${currentVal === 'P' ? 'selected-P' : ''}" onclick="setStudentGeneratorStatus('${s.id}', 'P')">P</button>
                <button type="button" class="helper-radio-btn ${currentVal === 'A' ? 'selected-A' : ''}" onclick="setStudentGeneratorStatus('${s.id}', 'A')">A</button>
                <button type="button" class="helper-radio-btn ${currentVal === 'L' ? 'selected-L' : ''}" onclick="setStudentGeneratorStatus('${s.id}', 'L')">L</button>
            </div>
        `;
        list.appendChild(row);
    });
}

function setStudentGeneratorStatus(studentId, status) {
    generatorState.attendance[studentId] = status;
    renderHelperStudentsList();
    generateCodeSnippet();
}

function markAllGenerator(status) {
    STUDENTS_ROSTER.forEach(s => {
        generatorState.attendance[s.id] = status;
    });
    renderHelperStudentsList();
    generateCodeSnippet();
}

function generateCodeSnippet() {
    const date = document.getElementById('gen-date').value || today;
    const day = getDayName(date);
    const topic = document.getElementById('gen-topic').value || "Class Revision";
    const note = document.getElementById('gen-notes').value || "Regular Session";
    const instructor = document.getElementById('gen-instructor').value || "Sarthak Pandey";

    let attLines = [];
    STUDENTS_ROSTER.forEach(s => {
        const val = generatorState.attendance[s.id] || 'P';
        attLines.push(`            "${s.id}": "${val}"`);
    });

    const snippet = `    {
        date: "${date}",
        day: "${day}",
        topic: "${topic}",
        instructor: "${instructor}",
        note: "${note}",
        attendance: {
${attLines.join(',\n')}
        }
    },`;

    document.getElementById('code-output-area').textContent = snippet;
}

function copyCodeSnippet() {
    const text = document.getElementById('code-output-area').textContent;
    navigator.clipboard.writeText(text).then(() => {
        const copyBtn = document.getElementById('btn-copy-code');
        const oldHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = `✓ COPIED TO CLIPBOARD!`;
        copyBtn.style.background = '#10b981';
        copyBtn.style.color = '#ffffff';

        setTimeout(() => {
            copyBtn.innerHTML = oldHtml;
            copyBtn.style.background = '';
            copyBtn.style.color = '';
        }, 2200);
    }).catch(err => {
        alert("Clipboard copy failed. Please select and copy manually.");
    });
}

/**
 * Export CSV
 */
function exportCSV() {
    let csv = "Roll,Name,Batch,Overall Rate %,Days Attended,Days Missed,Active Streak\n";
    const stats = computeAllStats().studentStats;

    Object.values(stats).forEach(s => {
        csv += `"${s.roll}","${s.name}","${s.batch}",${s.rate.toFixed(1)},${s.present + s.late},${s.absent},${s.streak}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Event Listeners
 */
function setupEventListeners() {
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Date navigation
    document.getElementById('btn-prev-day').addEventListener('click', () => {
        if (currentDateIndex < ATTENDANCE_LOGS.length - 1) {
            currentDateIndex++;
            renderDailyView();
        }
    });

    document.getElementById('btn-next-day').addEventListener('click', () => {
        if (currentDateIndex > 0) {
            currentDateIndex--;
            renderDailyView();
        }
    });

    document.getElementById('date-dropdown-select').addEventListener('change', (e) => {
        currentDateIndex = parseInt(e.target.value, 10);
        renderDailyView();
    });

    // Search
    document.getElementById('student-search-input').addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderDailyView();
    });

    // Status Filters
    document.querySelectorAll('.filter-pill-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-pill-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.status;
            renderDailyView();
        });
    });

    // Generator inputs live update
    document.getElementById('gen-date').addEventListener('change', generateCodeSnippet);
    document.getElementById('gen-topic').addEventListener('input', generateCodeSnippet);
    document.getElementById('gen-instructor').addEventListener('input', generateCodeSnippet);
    document.getElementById('gen-notes').addEventListener('input', generateCodeSnippet);

    // Close modals on overlay click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('open');
        }
    });
}
