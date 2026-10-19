/**
 * ══════════════════════════════════════════════════════════════════════════════
 * STUDENT FEE LEDGER DATA
 * Student: Aradhya Joshi | Class 7 Science
 * 
 * Monthly Tuition Fee: ₹1,000
 * September 2026: Paid (Done)
 * October 2026: Pending (Remaining)
 * ══════════════════════════════════════════════════════════════════════════════
 */

const STUDENT_PROFILE = {
    name: "Aradhya Joshi",
    grade: "Class 7 &middot; Science",
    curriculum: "NCERT &middot; Science In-Depth",
    academicYear: "2026–2027",
    monthlyTuition: 1000
};

const FEE_RECORDS = [
    {
        month: "October 2026",
        period: "01 Oct 2026 – 31 Oct 2026",
        description: "Monthly Tuition Fee — Class 7 Science (Ch. 10 & 11)",
        amount: 1000,
        dueDate: "10 Oct 2026",
        paidDate: null,
        paymentMode: "Pending",
        receiptNo: null,
        status: "REMAINING", // October fee is pending
        notes: "Fee for October session is pending"
    },
    {
        month: "September 2026",
        period: "01 Sep 2026 – 30 Sep 2026",
        description: "Monthly Tuition Fee — Class 7 Science (Ch. 8 & 9)",
        amount: 1000,
        dueDate: "10 Sep 2026",
        paidDate: "05 Sep 2026",
        paymentMode: "UPI / Online Transfer",
        receiptNo: "REC-2026-09-142",
        status: "PAID", // September fee is done
        notes: "Full payment of ₹1,000 received with thanks"
    }
];

const PAYMENT_INFO = {
    upiId: "sarthak@upi",
    accountHolder: "Sarthak Pandey",
    bankName: "HDFC Bank",
    accountNumber: "50100492817291",
    ifscCode: "HDFC0001234"
};
