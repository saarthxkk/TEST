/**
 * ══════════════════════════════════════════════════════════════════════════════
 * STUDENT FEE LEDGER DATA
 * Student: Aradhya Joshi | Class 7 Science
 * 
 * 📌 To update fee status or add new months, edit FEE_RECORDS below:
 *    status: "PAID" | "REMAINING"
 * ══════════════════════════════════════════════════════════════════════════════
 */

const STUDENT_PROFILE = {
    name: "Aradhya Joshi",
    grade: "Class 7 &middot; Science",
    curriculum: "NCERT &middot; Science In-Depth",
    academicYear: "2026–2027",
    monthlyTuition: 2500
};

const FEE_RECORDS = [
    {
        month: "October 2026",
        period: "01 Oct 2026 – 31 Oct 2026",
        description: "Monthly Tuition Fee — Science In-Depth (Ch. 10 & 11)",
        amount: 2500,
        dueDate: "10 Oct 2026",
        paidDate: null,
        paymentMode: "Pending",
        receiptNo: null,
        status: "REMAINING", // Sept done, Oct remaining
        notes: "Payment pending for October session"
    },
    {
        month: "September 2026",
        period: "01 Sep 2026 – 30 Sep 2026",
        description: "Monthly Tuition Fee — Science In-Depth (Ch. 8 & 9)",
        amount: 2500,
        dueDate: "10 Sep 2026",
        paidDate: "05 Sep 2026",
        paymentMode: "UPI / Online Transfer",
        receiptNo: "REC-2026-09-142",
        status: "PAID", // Sept fee done
        notes: "Full payment received with thanks"
    }
];

const PAYMENT_INFO = {
    upiId: "sarthak@upi",
    accountHolder: "Sarthak Pandey",
    bankName: "HDFC Bank",
    accountNumber: "50100492817291",
    ifscCode: "HDFC0001234"
};
