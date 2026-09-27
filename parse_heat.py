import json
import re

text = """
**Q1.** Heat flows from one body to another whenever there is a difference in their:
(a) mass
(b) volume
(c) temperature
(d) specific colour

**Q2.** Which statement BEST defines heat?
(a) Heat is the degree of hotness of a body
(b) Heat is a form of energy that causes the sensation of hotness and coldness
(c) Heat is the same physical quantity as temperature
(d) Heat is a substance contained inside every hot object

**Q3.** In Activity–1 (bowls A, B and C), the right-hand fingers (kept in ice-cold water) feel bowl B's water as:
(a) cold
(b) hot
(c) warm
(d) exactly the same as bowl A

**Q4.** In the same activity, the LEFT-hand fingers (kept in hot water) feel bowl B's water as:
(a) warm
(b) cold
(c) hot
(d) neutral, neither hot nor cold

**Q5.** The conclusion of Activity–1 is that:
(a) our sense of touch always gives correct temperature readings
(b) our sense of touch is not reliable for judging exact hotness/coldness
(c) lukewarm water has no definite temperature
(d) both hands must always agree on temperature

**Q6.** An object feels hot to us when:
(a) heat flows from our body to the object
(b) heat flows from the object to our body
(c) no heat flows at all, only touch sensation changes
(d) the object's mass increases

**Q7.** The lower fixed point on the Celsius scale corresponds to:
(a) boiling point of water at sea level
(b) freezing point of water at sea level
(c) normal human body temperature
(d) absolute zero

**Q8.** Upper fixed point and lower fixed point on a thermometer are always marked at:
(a) any convenient altitude
(b) the top of a mountain, for accuracy
(c) sea level
(d) the centre of the Earth

**Q9.** On the Fahrenheit scale, the boiling point of water is taken as:
(a) 100°F
(b) 180°F
(c) 212°F
(d) 273°F

**Q10.** On the Kelvin scale, the freezing point of water is approximately:
(a) 0 K
(b) 100 K
(c) 273 K
(d) 373 K

**Q11.** If a body's Celsius temperature is C and its Fahrenheit temperature is F, the correct relation is:
(a) C/100 = F/180
(b) C/100 = (F − 32)/180
(c) C/180 = (F − 32)/100
(d) C/100 = (F + 32)/180

**Q12.** A temperature of 100°C on the Kelvin scale corresponds to:
(a) 100 K
(b) 273 K
(c) 373 K
(d) 473 K

**Q13.** The SI unit of temperature is:
(a) degree Celsius
(b) degree Fahrenheit
(c) kelvin
(d) joule

**Q14.** A clinical thermometer typically has a scale ranging from:
(a) −10°C to 110°C
(b) 0°C to 100°C
(c) 35°C to 42°C
(d) 32°F to 212°F

**Q15.** A laboratory thermometer generally has a scale ranging from:
(a) 35°C to 42°C
(b) 94°F to 108°F
(c) −10°C to 110°C
(d) 0°C to 37°C

**Q16.** The narrow bend (constriction) present just above the bulb of a clinical thermometer is meant to:
(a) speed up the rise of mercury
(b) prevent mercury from flowing back into the bulb once removed from the mouth
(c) allow mercury to evaporate safely
(d) increase the accuracy of the Fahrenheit scale only

**Q17.** Why does a laboratory thermometer NOT have a constriction like a clinical thermometer?
(a) because its readings are taken while it is still in contact with the substance being measured
(b) because it never touches liquids
(c) because it is scaled only in Fahrenheit
(d) because it does not use mercury

**Q18.** Which of the following is TRUE about a laboratory thermometer as compared to a clinical thermometer?
(a) Its mercury level falls back on its own; no jerks are needed
(b) Its mercury level needs jerks to fall, like a clinical thermometer
(c) It can only be read after removing it from the substance
(d) It has a smaller temperature range than a clinical thermometer

**Q19.** Mercury is preferred as a thermometric liquid mainly because it:
(a) is transparent and colourless
(b) sticks to glass, giving accurate readings
(c) is shiny, doesn't stick to glass, and expands uniformly with temperature
(d) freezes at a very low temperature only, never expands

**Q20.** A digital thermometer is generally considered safer than a mercury thermometer because:
(a) it gives a faster reading
(b) it does not use toxic mercury
(c) it can measure much higher temperatures
(d) it never needs a battery

**Q21.** A maximum-minimum thermometer is most commonly used to:
(a) measure body temperature of infants
(b) record the highest and lowest temperature of a day for weather reports
(c) measure temperature of boiling liquids only
(d) measure temperature inside a thermos flask

**Q22.** The transfer of heat from one particle to a neighbouring particle, without the particles themselves changing position, is called:
(a) convection
(b) radiation
(c) conduction
(d) insulation

**Q23.** In Activity–3 (nails fixed with wax on a heated metal strip), which nail falls FIRST?
(a) the nail nearest to the flame
(b) the nail farthest from the flame
(c) all nails fall simultaneously
(d) none of the nails fall

**Q24.** In Activity–4, rods of copper, iron and glass are heated equally. Which nail falls off LAST (or not at all)?
(a) nail on the copper rod
(b) nail on the iron rod
(c) nail on the glass rod
(d) all three fall together

**Q25.** From Activity–4, the correct order of heat conduction (fastest to slowest) is:
(a) glass > iron > copper
(b) copper > iron > glass
(c) iron > copper > glass
(d) copper > glass > iron

**Q26.** Heat conduction between two objects in contact requires that:
(a) both objects be solids only
(b) they be in direct contact AND at different temperatures
(c) they be separated by a vacuum
(d) one of them must be a liquid

**Q27.** Which of these is NOT a good conductor of heat?
(a) silver
(b) aluminium
(c) asbestos
(d) copper

**Q28.** Cooking utensils are made of metals, but their handles are made of insulating material such as wood or bakelite. This is an application of the fact that:
(a) metals are poor conductors and wood is a good conductor
(b) metals are good conductors and insulators prevent heat reaching the hand
(c) wood conducts heat faster than metal
(d) insulators generate their own heat

**Q29.** Which of the following is generally a POOR conductor (insulator) of heat?
(a) iron
(b) brass
(c) rubber
(d) stainless steel

**Q30.** Vehicles carrying petrol or diesel are often covered with insulating material during summer mainly to:
(a) make the vehicle look attractive
(b) reduce evaporation loss and prevent fire due to excessive heating
(c) increase the weight of the vehicle for stability
(d) allow heat to enter faster for better mixing

**Q31.** The transfer of heat in fluids due to the actual movement of heated particles from one place to another is called:
(a) conduction
(b) convection
(c) radiation
(d) insulation

**Q32.** Convection can take place in:
(a) solids only
(b) liquids and gases only
(c) solids and liquids only
(d) vacuum only

**Q33.** In Activity–5 (potassium permanganate crystal in a flask of water heated from below), the purple colour is observed to:
(a) stay exactly at the bottom where heating occurs
(b) rise from the heated region, move around, and then sink again — showing convection currents
(c) immediately dissolve and disappear without moving
(d) move only sideways, never up or down

**Q34.** Solids cannot show convection because:
(a) solids do not contain any heat
(b) the constituent particles of a solid cannot leave their fixed positions
(c) solids are always cooler than liquids
(d) solids reflect all radiation

**Q35.** Ventilators are usually provided near the ceiling of a room because:
(a) cold air is lighter and rises to the ceiling
(b) warm air is lighter, rises up, and escapes through the ceiling ventilators
(c) sunlight enters more easily from the ceiling
(d) it keeps insects away from the floor

**Q36.** During the daytime, the wind that blows from the sea towards the land is called:
(a) land breeze
(b) sea breeze
(c) valley breeze
(d) monsoon breeze

**Q37.** A sea breeze occurs because, during the day:
(a) land warms up faster than the sea, so air over land rises and cooler air from the sea moves in
(b) the sea warms up faster than land, so air over the sea rises
(c) land and sea warm up at exactly the same rate
(d) no temperature difference exists between land and sea

**Q38.** A land breeze occurs:
(a) during the day, from sea to land
(b) at night, when air over the (relatively warmer) sea rises and cooler air from land moves towards the sea
(c) at night, when land is warmer than the sea
(d) only during winter afternoons

**Q39.** The mode of heat transfer that does NOT require any material medium at all is:
(a) conduction
(b) convection
(c) radiation
(d) both conduction and convection

**Q40.** We feel warm while sitting near a fire even though the surrounding air (a poor conductor) separates us from it, and the hot air from the fire rises upward rather than towards us. This heat reaches us mainly by:
(a) conduction through air
(b) convection through air
(c) radiation
(d) evaporation

**Q41.** In Activity–6, two identical tin cans (one painted white, one black) filled with equal water are kept in the sun. After an hour:
(a) water in the white can is warmer, showing white bodies absorb heat better
(b) water in the black can is warmer, showing black bodies absorb heat better
(c) both cans show identical temperature, proving colour makes no difference
(d) the white can's water evaporates completely

**Q42.** In Activity–7, two cans (white and black) are filled with hot water and kept in shade. After some time:
(a) the black can's water is at a lower temperature than the white can's, since black bodies radiate (lose) heat faster
(b) the white can's water is at a lower temperature than the black can's
(c) both stay at the same temperature since radiation doesn't apply to cooling
(d) the black can's water temperature rises further

**Q43.** A polished, shiny surface is generally:
(a) a good absorber and good radiator of heat
(b) a poor absorber and poor radiator (good reflector) of heat
(c) a good absorber but poor radiator
(d) unrelated to heat absorption or radiation

**Q44.** The reflecting surface behind the heating element of a room heater is polished mainly to:
(a) absorb maximum heat into the metal
(b) reflect heat radiation towards the people sitting in front
(c) reduce the brightness of the heater
(d) prevent the heater from radiating any heat at all

**Q45.** The inner walls of a thermos flask are silvered/polished mainly to:
(a) increase heat absorption from outside
(b) minimise heat loss or gain by reducing radiation
(c) make the flask lightweight
(d) allow convection currents to form inside

**Q46.** During summer, we generally prefer wearing light-coloured clothes because they:
(a) absorb more heat and keep us warm
(b) absorb less heat, keeping the body cooler
(c) are cheaper than dark-coloured clothes
(d) conduct heat away from the body by convection

**Q47.** Woollen clothes keep us warm in winter mainly because:
(a) wool itself generates heat chemically
(b) wool is a good conductor that quickly brings outside heat to the body
(c) wool traps air, which is a poor conductor, preventing body heat from escaping
(d) wool reflects all radiation like a polished surface

**Q48.** Two thin woollen blankets keep a person warmer than one thick blanket of the same total thickness mainly because:
(a) two blankets weigh less than one thick blanket
(b) the layer of trapped air between the two blankets acts as an additional insulator
(c) thick blankets conduct heat faster than thin ones
(d) two blankets reflect more light than one

**Q49.** One litre of water at 30°C is mixed with one litre of water at 50°C (no heat lost to surroundings). The resulting temperature of the mixture will be:
(a) 80°C
(b) 20°C
(c) exactly 40°C
(d) between 30°C and 50°C, but not necessarily exactly 40°C for all such mixing problems in general

**Q50.** An iron ball at 40°C is dropped into a mug of water also at 40°C. What happens to heat flow between them?
(a) Heat flows from the iron ball to the water
(b) Heat flows from the water to the iron ball
(c) Heat does not flow from either to the other, since there is no temperature difference
(d) Heat flows both ways simultaneously, increasing both temperatures
"""

answers = {
    "1": "C", "2": "B", "3": "C", "4": "A", "5": "B", "6": "B", "7": "B", "8": "C", "9": "C", "10": "C",
    "11": "B", "12": "C", "13": "C", "14": "C", "15": "C", "16": "B", "17": "A", "18": "A", "19": "C", "20": "B",
    "21": "B", "22": "C", "23": "A", "24": "C", "25": "B", "26": "B", "27": "C", "28": "B", "29": "C", "30": "B",
    "31": "B", "32": "B", "33": "B", "34": "B", "35": "B", "36": "B", "37": "A", "38": "B", "39": "C", "40": "C",
    "41": "B", "42": "A", "43": "B", "44": "B", "45": "B", "46": "B", "47": "C", "48": "B", "49": "C", "50": "C"
}
# Override answers based on provided table
ans_table = "1-c, 2-b, 3-c, 4-a, 5-b, 6-b, 7-b, 8-c, 9-c, 10-c, 11-b, 12-c, 13-c, 14-c, 15-c, 16-b, 17-a, 18-a, 19-c, 20-b, 21-b, 22-c, 23-a, 24-c, 25-b, 26-b, 27-c, 28-b, 29-c, 30-b, 31-b, 32-b, 33-b, 34-b, 35-b, 36-b, 37-a, 38-b, 39-c, 40-c, 41-b, 42-a, 43-b, 44-b, 45-b, 46-b, 47-c, 48-b, 49-c, 50-c"
for pair in ans_table.split(','):
    pair = pair.strip()
    k, v = pair.split('-')
    answers[k] = v.upper()

questions = []
blocks = re.split(r'\*\*Q\d+\.\*\*', text)[1:]
for i, block in enumerate(blocks):
    block = block.strip()
    lines = [line.strip() for line in block.split('\n') if line.strip()]
    question_text = lines[0]
    options = {}
    for line in lines[1:]:
        if line.startswith('(a)'): options['A'] = line[3:].strip()
        elif line.startswith('(b)'): options['B'] = line[3:].strip()
        elif line.startswith('(c)'): options['C'] = line[3:].strip()
        elif line.startswith('(d)'): options['D'] = line[3:].strip()
    
    q_dict = {
        "id": i + 1,
        "question": question_text,
        "options": options,
        "answer": answers[str(i + 1)]
    }
    questions.append(q_dict)

with open('questions_heat.js', 'w') as f:
    f.write('const questions_heat = ' + json.dumps(questions, indent=2) + ';\n')
