document.addEventListener('DOMContentLoaded', () => {
    if (typeof ATTENDANCE_RECORDS === 'undefined') {
        console.error("ATTENDANCE_RECORDS not found in attendance_data.js");
        return;
    }

    const records = ATTENDANCE_RECORDS;
    const totalDays = records.length;
    let presentCount = 0;

    records.forEach(r => {
        if (r.status.toLowerCase() === 'present') {
            presentCount++;
        }
    });

    const rate = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 100;
    const latest = records[0] || { date: "17 Oct 2026", day: "Saturday", status: "Present" };

    // Update stats boxes
    const todayStatusEl = document.getElementById('today-status');
    if (todayStatusEl) {
        todayStatusEl.textContent = latest.status.toUpperCase();
        todayStatusEl.className = latest.status.toLowerCase() === 'present' ? 'stat-val status-present' : 'stat-val status-absent';
    }
    const todayDateEl = document.getElementById('today-date');
    if (todayDateEl) {
        todayDateEl.textContent = `${latest.day}, ${latest.date}`;
    }
    const totalRateEl = document.getElementById('total-rate');
    if (totalRateEl) {
        totalRateEl.textContent = `${rate}%`;
    }
    const totalDaysEl = document.getElementById('total-days');
    if (totalDaysEl) {
        totalDaysEl.textContent = totalDays;
    }
    const daysSub = document.getElementById('total-days-sub');
    if (daysSub) {
        daysSub.textContent = `${presentCount} Present · ${totalDays - presentCount} Absent`;
    }

    // Render table
    const tbody = document.getElementById('records-table-body');
    if (tbody) {
        tbody.innerHTML = '';

        records.forEach(r => {
            const isPresent = r.status.toLowerCase() === 'present';
            const tr = document.createElement('tr');
            const topicText = r.topic || (r.reason ? `Reason: ${r.reason}` : 'Regular Class Session');
            tr.innerHTML = `
                <td style="font-family:var(--font-mono); font-weight:700; color:#fff;">${r.date}</td>
                <td style="color:#94a3b8;">${r.day}</td>
                <td style="color:${isPresent ? '#cbd5e1' : '#fca5a5'};">${topicText}</td>
                <td>
                    <span class="status-badge ${isPresent ? 'badge-present' : 'badge-absent'}">
                        ${r.status}
                    </span>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
});
