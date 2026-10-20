# Optics Lab — Chapter 11: Light (Class 7 Science)

A self-contained, interactive educational physics website built for the Class 7 science chapter **"Light"** (*Science In-depth 7*, Chapter 11) and the test platform **testiiii**.

---

## 🚀 How to Open and Run

You do not need any build tools, compilers, or external dependencies. It runs directly in any modern browser on laptops, tablets, and phones.

### Option 1: Direct File Open
1. Open your browser (Chrome, Edge, Safari, Firefox).
2. Double-click or open `light.html` directly in your browser:
   ```
   file:///Users/saar.thxkk/Desktop/TEST/light.html
   ```
3. To open the main examination platform with the newly added **Chapter 11: 40 Difficult MCQs Full Chapter Test**, open `index.html`:
   ```
   file:///Users/saar.thxkk/Desktop/TEST/index.html
   ```

### Option 2: Local Web Server
You can also launch a lightweight local server from this directory:
```bash
# In your terminal inside the project directory:
python3 -m http.server 8089
```
Then visit in your browser:
- **Optics Lab (9 Interactive Simulations):** [http://localhost:8089/light.html](http://localhost:8089/light.html) or [http://localhost:8089/light/](http://localhost:8089/light/)
- **Main Test Platform (40 Difficult MCQs Full Chapter Test):** [http://localhost:8089/index.html](http://localhost:8089/index.html)

---

## 🔬 The 9 Interactive Simulations (What Each Teaches)

Every simulation follows a uniform educational layout:
1. **Title & Aim**
2. **Materials Required** (with visual badges)
3. **Procedure** (numbered interactive step list that highlights your current action)
4. **Interactive Optical Canvas** (pure HTML5 Canvas with real-time ray tracing & touch/mouse drag)
5. **Controls Panel** (sliders, preset buttons, auto-alignment tools, reset)
6. **Live Observation Box** (reactively updates as you manipulate variables)
7. **Scientific Conclusion Box** (unlocks upon completing the required interactions)
8. **"Check Yourself" Questions** (interactive MCQs with instant feedback & explanations)

### Summary of Activities:

| Sim # | Activity / Concept | Key Physics & Textbook Reference | What it Teaches |
|---|---|---|---|
| **Sim 1** | **Activity 1: Light Travels in a Straight Line** | Rectilinear propagation of light; candle flame and flexible rubber tube | Demonstrates that light travels strictly in straight lines. When the tube is straight, the flame is visible; bending or coiling the tube blocks the light path. Includes a bonus window-slit sunbeam demo. |
| **Sim 2** | **Activity 2: Image in a Plane Mirror** | Reflection, $u = v$, lateral inversion, virtual nature | Shows that the image in a plane mirror is always erect, virtual (cannot be caught on a cardboard screen), equal in size to the object, and formed at the exact same distance behind the mirror ($u = v$). Features an interactive lateral inversion demo with the word **AMBULANCE** and water reflections. |
| **Sim 3** | **Activity 3: Real Image of the Sun by a Concave Mirror** | Concentrating solar energy at Principal Focus ($F$) | Parallel incoming sunlight rays converge at the focus ($f = 20\text{ cm}$). Moving the paper screen to $F$ concentrates heat into a pinpoint real image of the Sun, causing the paper to smoke and ignite. Defines a **real image** as one that can be caught on a screen. |
| **Sim 4** | **Activity 4: Image Formation by a Concave Mirror** | Mirror formula $\frac{1}{v} + \frac{1}{u} = \frac{1}{f}$, Cartesian sign convention, optical bench | Complete optical bench ($0\text{--}100\text{ cm}$) with draggable candle and screen. Shows 3 principal rays. Real inverted images form outside focus $F$; virtual erect magnified images form inside focus $F$. Auto-filling observation table with "Record Reading" button. |
| **Sim 5** | **Convex Mirror & Field of View** | Diverging spherical mirror, virtual focus | Demonstrates that for any object distance, a convex mirror **always** forms a virtual, erect, and diminished image behind the mirror. Features an interactive field-of-view comparison showing why cars use convex rear-view mirrors. |
| **Sim 6** | **Convex Lens: Image Formation & Converging Action** | Lens formula $\frac{1}{v} - \frac{1}{u} = \frac{1}{f}$, magnifying glass effect | A converging lens (thick in middle). Demonstrates real inverted images on a screen when $u > f$, and virtual upright magnified images when $u < f$ (magnifying glass). Includes parallel sunbeam burning demo. |
| **Sim 7** | **Concave Lens: Diverging Action** | Diverging lens (thin in middle), virtual erect smaller image | Shows parallel rays diverging outwards with backward extensions meeting at a virtual focus. Explores why a concave lens **CANNOT burn paper** because it spreads light rays instead of concentrating them. |
| **Sim 8** | **Activity 5: Dispersion of Light (Prism & Spectrum)** | Snell's Law with dispersion ($n = 1.512\text{--}1.536$), VIBGYOR band | Splits a narrow beam of white sunlight into the seven rainbow colours (Violet, Indigo, Blue, Green, Yellow, Orange, Red). Violet deviates the most; Red deviates the least. Features an interactive **Rainbow Demo** illustrating why the observer must have their back to the Sun. |
| **Sim 9** | **Newton's Disc: Make & Spin** | Persistence of vision ($\approx 1/16\text{s}$), colour recombination | 5-step construction guide: Cut disc $\to$ 7 equal sectors ($51.4^\circ$) $\to$ Paint VIBGYOR $\to$ Center spindle $\to$ Spin up to $3000\text{ RPM}$. At high speeds, the colours visually combine on the retina to appear whitish, proving that seven colours make white light. |

---

## 📝 Chapter 11: 40 Difficult MCQs Full Chapter Test (Newly Added)

In addition to the quick MCQs within the simulation, a comprehensive 40-question exam-level test covering **all 9 pages of Chapter 11** has been integrated into the platform:

- **Question Bank File:** [`questions_light.js`](questions_light.js)
- **Sections & Topics Covered:**
  - **Section A (Q1–Q12): Difficult statement-based MCQs**
    - Nature and visibility of light (Q1)
    - Rectilinear propagation & rubber tube (Q2)
    - Reflection of light (Q3)
    - Images formed by plane mirrors (Q4)
    - Real and virtual images (Q5)
    - Lateral inversion & ambulance lettering (Q6)
    - Identification of spherical mirrors & focal points (Q7)
    - Comparing concave and convex mirrors (Q8)
    - Uses of spherical and plane mirrors (Q9)
    - Basic properties of converging and diverging lenses (Q10)
    - Concave lenses & image formation (Q11)
    - White light & dispersion (Q12)
  - **Section B (Q13–Q30): Lengthy case-based MCQs**
    - Case studies on bent tubes, plane mirror distances, screen projection failures, ambulance lettering, decorative room mirrors, concentrating sunlight at focus, shaving mirrors, side-view mirrors, spoon curvature, concave mirror distances, magnifying glasses, distant convex lens images, peepholes, lens identification, instrument lens selection, prism dark room dispersion, soap bubbles/CDs, and rainbow observation.
  - **Section C (Q31–Q40): Lengthy application and integrated MCQs**
    - Case studies on Newton's disc persistence of vision, supermarket security equipment, focal properties of spherical mirrors, lens-selection challenge, lens misconceptions, spectrum color reconstruction, relationship between dispersion and color recombination, multi-device selection, and comprehensive laboratory challenge matching.

### How to Take the 40 MCQs Test:
1. Open `index.html`.
2. Scroll to the **Available Chapters** section and select **Ch. 11 — Light (40 Difficult MCQs — Full Chapter)**, or choose it from the **Select Chapter** dropdown.
3. Enter your student name and click **BEGIN TEST**.
4. Complete the 40 questions with the 25-minute timer and anti-cheat protection.
5. Receive an instant scored feedback card with a detailed question-by-question review!

---

## 🎨 Design & Accessibility Highlights

- **Child-Friendly, Radiant Optics UI:** Clean high-contrast dark theme (deep navy background with luminous amber rays, cyan lenses, and vibrant VIBGYOR spectra) switchable to a crisp lab light theme.
- **Progress Tracking in Memory:** Session counter tracks how many of the 9 experiments have been completed without using `localStorage`.
- **Accurate Physics Equations:** Ray tracing is calculated dynamically from optical equations (mirror formula, lens formula, and dispersion), with $\epsilon$-handling for objects at focus ($u = f \implies v \to \infty$).
- **Responsive:** Fluid layout supporting mobile phones ($360\text{px}$ wide) up to large desktop monitors.
