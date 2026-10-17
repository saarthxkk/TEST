/**
 * ══════════════════════════════════════════════════════════════════════════════
 * testiiii — DAILY ATTENDANCE DATABASE
 * ══════════════════════════════════════════════════════════════════════════════
 * 
 * 📌 HOW TO ADD DAILY ATTENDANCE BY EDITING THIS CODE:
 * ------------------------------------------------------------------------------
 * 1. Scroll to the "ATTENDANCE_LOGS" array below.
 * 2. Copy the DAILY TEMPLATE block shown below.
 * 3. Paste it at the TOP of the ATTENDANCE_LOGS list.
 * 4. Change "date", "topic" and set "P" (Present), "A" (Absent), or "L" (Late).
 * 5. Save the file! The portal will automatically calculate all stats, streaks,
 *    calendar markers, and student percentages!
 * 
 * 💡 SHORTCODES FOR ATTENDANCE:
 *    "P" = Present
 *    "A" = Absent
 *    "L" = Late (Attended late)
 *    "E" = Excused (Official leave / Medical)
 * 
 * 📋 DAILY TEMPLATE TO COPY-PASTE:
 * 
 *   {
 *     date: "2026-10-18",
 *     day: "Sunday",
 *     topic: "Electricity & Circuit Diagnostics",
 *     instructor: "Sarthak Pandey",
 *     note: "Regular Laboratory Session",
 *     attendance: {
 *       "01": "P",
 *       "02": "P",
 *       "03": "A",
 *       "04": "P",
 *       "05": "P",
 *       "06": "P",
 *       "07": "L",
 *       "08": "P",
 *       "09": "P",
 *       "10": "P",
 *       "11": "P",
 *       "12": "A",
 *       "13": "P",
 *       "14": "P",
 *       "15": "P"
 *     }
 *   },
 * 
 * ══════════════════════════════════════════════════════════════════════════════
 */

// 1. CLASS ROSTER — Modify or add your students here
const STUDENTS_ROSTER = [
    { id: "01", roll: "01", name: "Aarav Sharma", batch: "Class 7A", avatar: "AS", contact: "aarav.s@school.edu" },
    { id: "02", roll: "02", name: "Ananya Patel", batch: "Class 7A", avatar: "AP", contact: "ananya.p@school.edu" },
    { id: "03", roll: "03", name: "Devansh Verma", batch: "Class 7A", avatar: "DV", contact: "devansh.v@school.edu" },
    { id: "04", roll: "04", name: "Diya Gupta", batch: "Class 7A", avatar: "DG", contact: "diya.g@school.edu" },
    { id: "05", roll: "05", name: "Ishaan Mehta", batch: "Class 7A", avatar: "IM", contact: "ishaan.m@school.edu" },
    { id: "06", roll: "06", name: "Kabir Singh", batch: "Class 7A", avatar: "KS", contact: "kabir.s@school.edu" },
    { id: "07", roll: "07", name: "Meera Nair", batch: "Class 7A", avatar: "MN", contact: "meera.n@school.edu" },
    { id: "08", roll: "08", name: "Pranav Joshi", batch: "Class 7A", avatar: "PJ", contact: "pranav.j@school.edu" },
    { id: "09", roll: "09", name: "Riya Sen", batch: "Class 7A", avatar: "RS", contact: "riya.s@school.edu" },
    { id: "10", roll: "10", name: "Rohan Kulkarni", batch: "Class 7A", avatar: "RK", contact: "rohan.k@school.edu" },
    { id: "11", roll: "11", name: "Sanya Kapoor", batch: "Class 7A", avatar: "SK", contact: "sanya.k@school.edu" },
    { id: "12", roll: "12", name: "Shaurya Malhotra", batch: "Class 7A", avatar: "SM", contact: "shaurya.m@school.edu" },
    { id: "13", roll: "13", name: "Tanvi Rao", batch: "Class 7A", avatar: "TR", contact: "tanvi.r@school.edu" },
    { id: "14", roll: "14", name: "Vihaan Agarwal", batch: "Class 7A", avatar: "VA", contact: "vihaan.a@school.edu" },
    { id: "15", roll: "15", name: "Zara Khan", batch: "Class 7A", avatar: "ZK", contact: "zara.k@school.edu" }
];

// 2. DAILY ATTENDANCE LOGS (Newest date at the top)
const ATTENDANCE_LOGS = [
    {
        date: "2026-10-17",
        day: "Saturday",
        topic: "Electric Current & Electromagnet Lab",
        instructor: "Sarthak Pandey",
        note: "Hands-on battery & switch circuit construction",
        attendance: {
            "01": "P",
            "02": "P",
            "03": "P",
            "04": "P",
            "05": "P",
            "06": "L",
            "07": "P",
            "08": "P",
            "09": "P",
            "10": "A",
            "11": "P",
            "12": "P",
            "13": "P",
            "14": "P",
            "15": "P"
        }
    },
    {
        date: "2026-10-16",
        day: "Friday",
        topic: "Motion Mission Zone 4: Distance-Time Graphs",
        instructor: "Sarthak Pandey",
        note: "Live graph plotting and rover velocity experiment",
        attendance: {
            "01": "P",
            "02": "P",
            "03": "A",
            "04": "P",
            "05": "P",
            "06": "P",
            "07": "P",
            "08": "P",
            "09": "L",
            "10": "P",
            "11": "P",
            "12": "P",
            "13": "P",
            "14": "P",
            "15": "P"
        }
    },
    {
        date: "2026-10-15",
        day: "Thursday",
        topic: "Reproduction in Plants: Pollination & Fertilization",
        instructor: "Sarthak Pandey",
        note: "Dissection of hibiscus flower parts",
        attendance: {
            "01": "P",
            "02": "P",
            "03": "P",
            "04": "P",
            "05": "P",
            "06": "P",
            "07": "P",
            "08": "P",
            "09": "P",
            "10": "P",
            "11": "P",
            "12": "A",
            "13": "P",
            "14": "P",
            "15": "E"
        }
    },
    {
        date: "2026-10-14",
        day: "Wednesday",
        topic: "Heat Transfer: Conduction, Convection & Radiation",
        instructor: "Sarthak Pandey",
        note: "Laboratory experiment with clinical & laboratory thermometers",
        attendance: {
            "01": "P",
            "02": "P",
            "03": "P",
            "04": "P",
            "05": "L",
            "06": "P",
            "07": "P",
            "08": "P",
            "09": "P",
            "10": "P",
            "11": "A",
            "12": "P",
            "13": "P",
            "14": "P",
            "15": "P"
        }
    },
    {
        date: "2026-10-13",
        day: "Tuesday",
        topic: "Transportation in Animals & Plants: Circulatory System",
        instructor: "Sarthak Pandey",
        note: "Pulse rate measurement and human heart structure study",
        attendance: {
            "01": "P",
            "02": "P",
            "03": "P",
            "04": "P",
            "05": "P",
            "06": "P",
            "07": "P",
            "08": "A",
            "09": "P",
            "10": "P",
            "11": "P",
            "12": "P",
            "13": "P",
            "14": "P",
            "15": "P"
        }
    },
    {
        date: "2026-10-12",
        day: "Monday",
        topic: "Forests: Our Lifeline & Crown Density",
        instructor: "Sarthak Pandey",
        note: "Ecosystem food webs and canopy structure analysis",
        attendance: {
            "01": "P",
            "02": "P",
            "03": "P",
            "04": "P",
            "05": "P",
            "06": "P",
            "07": "P",
            "08": "P",
            "09": "P",
            "10": "P",
            "11": "P",
            "12": "P",
            "13": "P",
            "14": "P",
            "15": "P"
        }
    },
    {
        date: "2026-10-10",
        day: "Saturday",
        topic: "Physical & Chemical Changes: Crystallization",
        instructor: "Sarthak Pandey",
        note: "Copper sulphate crystal preparation demonstration",
        attendance: {
            "01": "P",
            "02": "L",
            "03": "P",
            "04": "P",
            "05": "P",
            "06": "P",
            "07": "P",
            "08": "P",
            "09": "P",
            "10": "A",
            "11": "P",
            "12": "P",
            "13": "P",
            "14": "P",
            "15": "P"
        }
    },
    {
        date: "2026-10-09",
        day: "Friday",
        topic: "Acids, Bases & Salts: Natural Indicators",
        instructor: "Sarthak Pandey",
        note: "Litmus paper, turmeric paste and China rose tests",
        attendance: {
            "01": "P",
            "02": "P",
            "03": "P",
            "04": "P",
            "05": "P",
            "06": "P",
            "07": "P",
            "08": "P",
            "09": "P",
            "10": "P",
            "11": "P",
            "12": "P",
            "13": "A",
            "14": "P",
            "15": "P"
        }
    },
    {
        date: "2026-10-08",
        day: "Thursday",
        topic: "Respiration in Organisms: Aerobic vs Anaerobic",
        instructor: "Sarthak Pandey",
        note: "Breathing rate during rest vs active physical exercise",
        attendance: {
            "01": "P",
            "02": "P",
            "03": "P",
            "04": "P",
            "05": "P",
            "06": "A",
            "07": "P",
            "08": "P",
            "09": "P",
            "10": "P",
            "11": "P",
            "12": "P",
            "13": "P",
            "14": "P",
            "15": "P"
        }
    },
    {
        date: "2026-10-07",
        day: "Wednesday",
        topic: "Nutrition in Animals: Human Digestive Canal",
        instructor: "Sarthak Pandey",
        note: "Digestive organs walkthrough & tooth decay awareness",
        attendance: {
            "01": "P",
            "02": "P",
            "03": "P",
            "04": "P",
            "05": "P",
            "06": "P",
            "07": "P",
            "08": "P",
            "09": "P",
            "10": "P",
            "11": "P",
            "12": "P",
            "13": "P",
            "14": "A",
            "15": "P"
        }
    }
];
