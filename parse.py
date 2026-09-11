import json
import re

text = """
1.

Which of the following is a physical property of a substance?

A. Reactivity with oxygen
B. Ability to form a new substance
C. Colour
D. Reaction with acids

2.

A sheet of paper is folded and then unfolded. This change is:

A. Chemical and irreversible
B. Physical and reversible
C. Chemical and reversible
D. Physical and irreversible

3.

Which statement correctly describes a physical change?

A. A new substance must always be formed
B. Chemical composition changes completely
C. Only physical properties may change
D. Chemical properties always change

4.

A student tears a sheet of paper into very small pieces. Which statement is correct?

A. A new substance is formed
B. Chemical composition of paper changes
C. Original sheet cannot be recovered, so it is chemical
D. No new substance is formed, so it is a physical change

5.

Which pair contains only physical changes?

A. Burning coal and melting ice
B. Rusting iron and curd formation
C. Dissolving sugar and melting wax
D. Digestion and tearing paper

6.

Sugar is dissolved in water. The solution is concentrated by heating and then cooled, producing sugar crystals. This demonstrates that dissolution of sugar is:

A. Chemical and irreversible
B. Physical but irreversible
C. Physical and reversible
D. Chemical but reversible

7.

Why is dissolution of sugar in water considered a physical change?

A. Sugar reacts chemically with water
B. Sugar loses its sweet taste
C. Sugar can be recovered and retains its basic properties
D. Water changes permanently into sugar

8.

Which change involves only a change of state?

A. Burning wax
B. Melting ice
C. Rusting iron
D. Burning magnesium

9.

When water changes into vapour and then back into water, the processes involved are:

A. Freezing and melting
B. Vaporisation and condensation
C. Condensation and freezing
D. Melting and vaporisation

10.

Stretching a rubber band is considered a physical change mainly because:

A. A new substance is formed
B. Its chemical composition changes
C. Only its size changes and it can return to its original form
D. Heat and light are produced

11.

Which statement about physical changes is NOT correct according to the chapter?

A. No new substance is formed
B. Physical properties may change
C. They are generally temporary and reversible
D. They always involve a large amount of energy

12.

Which of the following is an irreversible physical change mentioned in the chapter?

A. Melting ice
B. Folding paper
C. Tearing paper
D. Dissolving sugar

13.

A chemical change is best identified by:

A. Change in shape only
B. Change in state only
C. Formation of one or more new substances
D. Change in size only

14.

When carbon burns, carbon dioxide is formed. This is a chemical change because:

A. Carbon changes its size
B. Carbon dioxide has different properties from carbon
C. Carbon changes from solid to liquid
D. Carbon becomes smaller

15.

Which combination gives two chemical changes?

A. Melting wax and freezing water
B. Tearing paper and stretching rubber
C. Burning wood and digestion of food
D. Dissolving sugar and condensation

16.

Which of the following is not sufficient by itself to prove that a chemical change has occurred?

A. Formation of a new substance
B. Change in chemical composition
C. Change in shape only
D. Formation of substances with different properties

17.

When milk changes into curd, the change is chemical mainly because:

A. Milk changes from liquid to semi-solid
B. Its colour may change
C. Its taste changes
D. Milk cannot be obtained back by a simple method and new properties appear

18.

Which statement about rust is correct?

A. Rust and iron are the same substance
B. Rust is a physical form of iron
C. Rust has different composition and properties from iron
D. Rust can easily be converted back into iron by physical methods

19.

Rusting of iron requires:

A. Only oxygen
B. Only water
C. Oxygen and moisture
D. Carbon dioxide and sunlight

20.

An iron object is kept in a dry desert-like environment. Rusting is slower mainly because:

A. Oxygen is absent
B. Moisture is very low
C. Iron cannot react with oxygen
D. Temperature is always zero

21.

Why does iron generally rust faster in coastal areas?

A. Coastal air contains no oxygen
B. Coastal areas have higher moisture/humidity
C. Iron becomes softer near the sea
D. Sunlight is stronger near the sea

22.

Which of the following is NOT a method of preventing rusting given in the chapter?

A. Painting
B. Galvanisation
C. Alloying
D. Melting

23.

Painting an iron gate prevents rusting because paint:

A. Converts iron into zinc
B. Removes oxygen permanently from air
C. Prevents moist air from contacting the iron surface
D. Changes rust into iron

24.

Grease is applied to bicycle chains mainly because it:

A. Increases the amount of moisture touching iron
B. Prevents contact between iron and moist air
C. Converts iron into an alloy
D. Produces oxygen around the chain

25.

Galvanisation involves coating iron with:

A. Copper
B. Aluminium
C. Zinc
D. Magnesium

26.

Which statement best explains why galvanisation protects iron?

A. Zinc allows water to reach iron faster
B. Zinc coating prevents iron from coming into contact with moist air
C. Zinc changes iron into rust
D. Zinc removes all oxygen from the atmosphere

27.

Stainless steel is an example of preventing corrosion by:

A. Painting
B. Galvanisation
C. Alloying
D. Crystallisation

28.

Which metals are mentioned as being used in alloying iron to prevent corrosion?

A. Nickel, chromium and manganese
B. Copper, zinc and silver
C. Sodium, potassium and calcium
D. Carbon, oxygen and hydrogen

29.

Burning a candle demonstrates:

A. Only a physical change
B. Only a chemical change
C. Both physical and chemical changes
D. Neither physical nor chemical change

30.

During burning of a candle, melting of wax is:

A. Chemical and irreversible
B. Physical and reversible
C. Chemical and reversible
D. Physical and irreversible

31.

During burning of a candle, burning of wax and the cotton thread is:

A. Physical change
B. Chemical change
C. Reversible physical change
D. Change of state only

32.

Which substances are produced when wax undergoes combustion?

A. Oxygen and hydrogen
B. Carbon dioxide and water vapour
C. Carbon and oxygen
D. Water and nitrogen

33.

Burning of a candle is considered irreversible because:

A. Wax becomes solid
B. Melted wax can never be obtained
C. Burnt materials cannot be recovered in their original form by a simple method
D. Candle changes its shape

34.

When vinegar reacts with baking soda, which gas is produced?

A. Oxygen
B. Nitrogen
C. Carbon dioxide
D. Hydrogen

35.

Which observation can occur during the reaction between vinegar and baking soda?

A. Formation of ice
B. Evolution of gas with a hissing sound
C. Formation of sugar crystals
D. Freezing of vinegar

36.

The chemical name of baking soda given in the chapter is:

A. Sodium carbonate
B. Sodium hydrogen carbonate
C. Calcium carbonate
D. Sodium acetate

37.

Which observation provides evidence of a chemical change in the reaction between copper sulphate solution and iron?

A. Iron nail becomes smaller only
B. Solution changes colour and copper is deposited
C. Water evaporates
D. Iron changes shape

38.

In the reaction between copper sulphate solution and iron, the products mentioned are:

A. Iron oxide and zinc
B. Iron sulphate and copper
C. Copper oxide and iron
D. Copper carbonate and iron oxide

39.

Why is the reaction between copper sulphate solution and iron considered chemical?

A. The iron nail changes shape
B. The solution is stirred
C. New substances are formed and the original copper sulphate cannot be recovered by a physical method
D. Water is present

40.

A magnesium ribbon is cleaned with sandpaper before burning mainly as part of the preparation for the experiment. When it burns, it produces:

A. Magnesium chloride
B. Magnesium oxide
C. Magnesium sulphate
D. Magnesium carbonate

41.

The flame produced when magnesium ribbon burns is described as:

A. Dull yellow
B. Green
C. Dazzling white
D. Blue-black

42.

Which observation is associated with burning magnesium ribbon?

A. A new substance is formed
B. Magnesium simply changes its shape
C. Magnesium can immediately be recovered from the ash physically
D. Only its state changes

43.

Which of the following pairs contains one physical and one chemical change, respectively?

A. Melting wax; burning wax
B. Rusting iron; melting ice
C. Digestion; freezing water
D. Burning wood; tearing paper

44.

Crystallisation is defined as:

A. Melting a solid completely
B. Formation of large and pure crystals from a saturated solution
C. Formation of rust on iron
D. Burning a substance to form ash

45.

Crystallisation is classified in the chapter as:

A. Chemical change
B. Physical change
C. Irreversible chemical process
D. Biological change

46.

Which substance is specifically used in the activity to prepare crystals by crystallisation?

A. Copper sulphate
B. Iron oxide
C. Magnesium oxide
D. Sodium acetate

47.

Which sequence correctly represents preparation of copper sulphate crystals?

A. Heat → add water → burn → filter
B. Prepare solution → heat/concentrate → filter → cool undisturbed
C. Freeze → burn → filter → heat
D. Burn copper sulphate → dissolve iron → cool

48.

Which statement correctly compares crystallisation and rusting?

A. Both are chemical changes
B. Both form new substances
C. Crystallisation is a physical change, while rusting is a chemical change
D. Crystallisation is irreversible, while rusting is reversible

49.

Which set contains only chemical changes?

A. Photosynthesis, digestion, rusting
B. Melting wax, freezing water, condensation
C. Dissolving sugar, tearing paper, crystallisation
D. Stretching rubber, melting ice, cutting wood

50.

A student makes the following claims:

I. Tearing paper is a physical change.
II. Rusting of iron is a chemical change.
III. Melting wax is a chemical change.
IV. Burning wax is a chemical change.

Which option is correct?

A. I and II only
B. II and III only
C. I, II and IV only
D. I, III and IV only
"""

ans_key = """
1	C	11	D	21	B	31	B	41	C
2	B	12	C	22	D	32	B	42	A
3	C	13	C	23	C	33	C	43	A
4	D	14	B	24	B	34	C	44	B
5	C	15	C	25	C	35	B	45	B
6	C	16	C	26	B	36	B	46	A
7	C	17	D	27	C	37	B	47	B
8	B	18	C	28	A	38	B	48	C
9	B	19	C	29	C	39	C	49	A
10	C	20	B	30	B	40	B	50	C
"""

answers = {}
for match in re.finditer(r'(\d+)\s+([A-D])', ans_key):
    answers[int(match.group(1))] = match.group(2)

questions = []
current_q = None
lines = text.strip().split('\n')
i = 0
while i < len(lines):
    line = lines[i].strip()
    if re.match(r'^(\d+)\.$', line):
        q_num = int(re.match(r'^(\d+)\.$', line).group(1))
        i += 1
        # Skip empty lines
        while i < len(lines) and not lines[i].strip():
            i += 1
        q_text = lines[i].strip()
        # Collect options
        options = {}
        i += 1
        while i < len(lines) and not re.match(r'^(\d+)\.$', lines[i].strip()):
            opt_line = lines[i].strip()
            if opt_line.startswith('A.'):
                options['A'] = opt_line[3:].strip()
            elif opt_line.startswith('B.'):
                options['B'] = opt_line[3:].strip()
            elif opt_line.startswith('C.'):
                options['C'] = opt_line[3:].strip()
            elif opt_line.startswith('D.'):
                options['D'] = opt_line[3:].strip()
            elif opt_line != '':
                q_text += "\\n" + opt_line
            i += 1
        
        questions.append({
            'id': q_num,
            'question': q_text,
            'options': options,
            'answer': answers.get(q_num, 'A')
        })
    else:
        i += 1

js_content = f"const questions = {json.dumps(questions, indent=2)};"

with open("/Users/saar.thxkk/Desktop/TEST/questions.js", "w") as f:
    f.write(js_content)
