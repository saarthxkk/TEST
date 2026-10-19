document.addEventListener('DOMContentLoaded', () => {
    if (typeof FEE_RECORDS === 'undefined') {
        console.error("FEE_RECORDS not found in fee_data.js");
        return;
    }

    renderSummary();
    renderTable();
    initModalHandlers();
    initCopyButtons();
});

function renderSummary() {
    let totalPaid = 0;
    let totalRemaining = 0;
    let paidMonths = [];
    let remainingMonths = [];

    FEE_RECORDS.forEach(r => {
        if (r.status.toUpperCase() === 'PAID') {
            totalPaid += r.amount;
            paidMonths.push(r.month.split(' ')[0]);
        } else {
            totalRemaining += r.amount;
            remainingMonths.push(r.month.split(' ')[0]);
        }
    });

    // Update Summary cards
    const septStatus = document.getElementById('sum-sept-status');
    const octStatus = document.getElementById('sum-oct-status');
    const remainingVal = document.getElementById('sum-remaining-val');
    const totalPaidVal = document.getElementById('sum-paid-val');

    if (septStatus) {
        const septRecord = FEE_RECORDS.find(r => r.month.toLowerCase().includes('september'));
        const isPaid = septRecord && septRecord.status.toUpperCase() === 'PAID';
        septStatus.textContent = isPaid ? 'DONE (PAID)' : 'PENDING';
        septStatus.className = `sum-value ${isPaid ? 'done' : 'remaining'}`;
    }

    if (octStatus) {
        const octRecord = FEE_RECORDS.find(r => r.month.toLowerCase().includes('october'));
        const isPaid = octRecord && octRecord.status.toUpperCase() === 'PAID';
        octStatus.textContent = isPaid ? 'DONE (PAID)' : 'REMAINING';
        octStatus.className = `sum-value ${isPaid ? 'done' : 'remaining'}`;
    }

    if (remainingVal) {
        remainingVal.textContent = `₹${totalRemaining.toLocaleString('en-IN')}`;
    }

    if (totalPaidVal) {
        totalPaidVal.textContent = `₹${totalPaid.toLocaleString('en-IN')}`;
    }
}

function renderTable() {
    const tbody = document.getElementById('fee-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    FEE_RECORDS.forEach((r, idx) => {
        const isPaid = r.status.toUpperCase() === 'PAID';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div style="font-weight:700; color:#fff; font-family:var(--font-mono);">${r.month}</div>
                <div style="font-size:11.5px; color:var(--text-dim);">${r.period}</div>
            </td>
            <td>
                <div style="color:var(--text-primary);">${r.description}</div>
                <div style="font-size:11px; color:var(--text-dim); font-style:italic;">${r.notes || ''}</div>
            </td>
            <td style="font-family:var(--font-mono); font-weight:700; font-size:14px; color:#fff;">
                ₹${r.amount.toLocaleString('en-IN')}
            </td>
            <td style="font-family:var(--font-mono); font-size:12px; color:var(--text-muted);">
                ${r.dueDate}
            </td>
            <td style="font-size:12.5px;">
                ${isPaid ? `<span style="color:var(--emerald); font-family:var(--font-mono); font-size:11px;">Paid: ${r.paidDate}</span><br><span style="font-size:10px; color:var(--text-dim);">${r.paymentMode}</span>` : `<span style="color:var(--amber); font-family:var(--font-mono); font-size:11px;">Due since ${r.dueDate}</span>`}
            </td>
            <td>
                <span class="status-tag ${isPaid ? 'paid' : 'remaining'}">
                    ${isPaid ? '✓ DONE' : '⏳ REMAINING'}
                </span>
            </td>
            <td>
                ${isPaid ? `<button class="btn-receipt" onclick="openReceiptModal(${idx})">View Receipt</button>` : `<a href="#pay-section" class="btn-receipt" style="text-decoration:none; background:rgba(245,158,11,0.1); color:var(--amber); border-color:rgba(245,158,11,0.3);">Pay Now</a>`}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.openReceiptModal = function(index) {
    const r = FEE_RECORDS[index];
    if (!r) return;

    const modal = document.getElementById('receipt-modal');
    if (!modal) return;

    document.getElementById('rec-num').textContent = r.receiptNo || 'REC-2026-PAID';
    document.getElementById('rec-student').textContent = STUDENT_PROFILE.name;
    document.getElementById('rec-month').textContent = r.month;
    document.getElementById('rec-date').textContent = r.paidDate || 'Paid';
    document.getElementById('rec-mode').textContent = r.paymentMode || 'Online';
    document.getElementById('rec-amount').textContent = `₹${r.amount.toLocaleString('en-IN')}`;

    modal.classList.remove('hidden');
};

function initModalHandlers() {
    const modal = document.getElementById('receipt-modal');
    const closeBtn = document.getElementById('btn-close-receipt');
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }
}

function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.getAttribute('data-copy');
            if (!text) return;
            navigator.clipboard.writeText(text).then(() => {
                const orig = btn.textContent;
                btn.textContent = 'Copied!';
                setTimeout(() => btn.textContent = orig, 1800);
            });
        });
    });
}
