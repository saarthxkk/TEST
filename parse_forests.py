import json
import re

text = """
**Q1.** Forests are often called the "green lungs" of nature mainly because they:
(a) are always green in colour throughout the year
(b) absorb carbon dioxide and release oxygen, maintaining the atmospheric balance
(c) provide shelter to lungs-shaped leaves only
(d) are located near mountain ranges with fresh air

**Q2.** According to the latest Forest Survey of India (as given in the chapter), the forest cover in India is about:
(a) 33.33% of the geographical area
(b) 50% of the geographical area
(c) 24.62% of the geographical area
(d) 62.24% of the geographical area

**Q3.** As per the chapter, the total forest cover of India is approximately:
(a) 2,261 sq. km
(b) 22,610 sq. km
(c) 7,26,100 sq. km
(d) 7,26,10,000 sq. km

**Q4.** Which statement about India's forest cover trend, as mentioned in the text, is CORRECT?
(a) Forest cover has decreased sharply in the last decade
(b) Forest cover has increased slightly, but is still not enough to sustain the growing population
(c) Forest cover has remained exactly unchanged for the last 50 years
(d) India has no official record of its forest cover

**Q5.** A forest is best described as:
(a) an area with only tall trees and nothing else
(b) a system comprising a variety of living beings — plants, animals and decomposers
(c) a government-protected zoo
(d) a place with only herbivorous animals

**Q6.** Which of these is NOT listed in the chapter as a component of a forest's living beings?
(a) shrubs and mosses
(b) reptiles and mammals
(c) microbes
(d) coral reefs

**Q7.** A typical tree forest is described as being composed mainly of two distinct layers, namely:
(a) canopy and roots
(b) overstorey and understorey
(c) trunk and branches
(d) topsoil and subsoil

**Q8.** The overstorey (or emergent layer) of a forest is formed by:
(a) shrubs and small herbs only
(b) the tallest trees whose crowns form the topmost, sunniest layer
(c) dead leaves and decomposing matter
(d) underground root systems

**Q9.** A tree's crown is made up of which two parts?
(a) roots and trunk
(b) trunk and branches
(c) branches and leaves only
(d) canopy and floor

**Q10.** The shape formed by the crowns of several trees together, as seen from above a dense forest, is called the:
(a) understorey
(b) canopy
(c) emergent zone
(d) forest floor

**Q11.** Which of the following is NOT one of the common crown shapes of trees mentioned in the chapter?
(a) Pyramidal
(b) Round
(c) Spreading
(d) Rectangular

**Q12.** The lower layer of a forest, found beneath the overstorey, is called the:
(a) canopy
(b) understorey
(c) topsoil
(d) crown zone

**Q13.** Which statement about the understorey is TRUE?
(a) It receives more sunlight than the overstorey
(b) It is a different world in itself, composed of shrubs and smaller plants that don't get proper sunlight in dense forests
(c) It exists only in deserts, not forests
(d) It is always completely dry and lifeless

**Q14.** The layer of a forest that is dark, damp, and full of dead and decaying leaves and twigs is known as:
(a) the canopy
(b) the understorey
(c) the forest floor
(d) the crown

**Q15.** The forest floor plays an important role because it:
(a) reflects sunlight back into the atmosphere
(b) provides food and shelter to many insects, fungi and decomposers, which decompose leaves into humus
(c) is completely free of microorganisms
(d) is the tallest layer of the forest

**Q16.** Which of the following is an example of an important forest produce mentioned in the chapter?
(a) Diesel
(b) Gum, wax, rubber and honey
(c) Plastic
(d) Cement

**Q17.** Tendu leaves, which are collected from forests, are mainly used for:
(a) making paper only
(b) rolling bidis (a kind of local cigarette)
(c) making rubber tyres
(d) producing honey

**Q18.** Catechu and lac are examples of:
(a) fruits obtained from forests
(b) resins/substances obtained from forests, used by people
(c) forest animals
(d) types of forest soil

**Q19.** Which of the following is an example of a fruit obtained from forests, as per the chapter?
(a) Mango, orange, litchi
(b) Wheat, rice, maize
(c) Potato, onion, garlic
(d) Cabbage, cauliflower

**Q20.** Plants release excess water absorbed from the soil into the atmosphere in the form of water vapour through a process called:
(a) precipitation
(b) transpiration
(c) condensation
(d) respiration only

**Q21.** According to the chapter, a single apple tree can release water vapour into the atmosphere in an amount as much as:
(a) 3 litres
(b) 30 litres
(c) 300 litres
(d) 3,000 litres

**Q22.** The process by which water vapour rises, cools, and forms clouds which eventually bring rain, is termed:
(a) transpiration
(b) evaporation
(c) precipitation
(d) condensation only, with no rain involved

**Q23.** Forests help maintain groundwater level mainly because:
(a) tree roots make the soil porous, allowing rainwater to seep in and recharge groundwater
(b) trees absorb all the rainwater, leaving none for the ground
(c) tree leaves block rainwater from reaching the soil at all
(d) forests have no effect on groundwater

**Q24.** Which of the following is a direct benefit of forests preventing soil erosion, as mentioned in the text?
(a) Roots bind the soil and prevent it from being washed away
(b) Trees repel rainwater completely
(c) Forest fires improve soil binding
(d) Deforestation strengthens the topsoil

**Q25.** In the process of photosynthesis, green plants primarily use:
(a) oxygen and water to release carbon dioxide
(b) carbon dioxide and water (with sunlight) to produce food and release oxygen
(c) nitrogen and carbon dioxide to release methane
(d) only sunlight, without needing any gases

**Q26.** Why are forests described as helping to check global warming?
(a) They release large amounts of carbon dioxide
(b) They absorb carbon dioxide from the atmosphere, reducing the greenhouse gas balance
(c) They increase the amount of methane in the air
(d) They have no relationship with atmospheric gases

**Q27.** Forests are said to be a "self-sustaining system" mainly because:
(a) every part of the forest is completely independent of every other part
(b) different parts of the forest depend on each other, forming an interlinked system
(c) forests need no sunlight, water, or soil to survive
(d) only animals in a forest depend on each other, not the plants

**Q28.** Organisms that make their own food using sunlight, water, and carbon dioxide (such as green plants) are called:
(a) heterotrophs
(b) decomposers
(c) autotrophs
(d) carnivores

**Q29.** Organisms that depend on other organisms for food (herbivores and carnivores) are collectively known as:
(a) autotrophs
(b) heterotrophs
(c) producers
(d) photosynthesisers

**Q30.** A simple food chain existing in a forest, as per the chapter's example, follows the sequence:
(a) Grass → Lion → Deer
(b) Grass → Deer → Lion
(c) Lion → Deer → Grass
(d) Deer → Grass → Lion

**Q31.** A "food web" is best described as:
(a) a single straight chain with no branching
(b) many interlinked food chains showing multiple feeding relationships
(c) a chain only found in aquatic ecosystems
(d) a web spun by spiders to catch insects for food

**Q32.** If any one component of a forest's food web is disturbed or removed, then:
(a) it will have no effect on other components
(b) it will affect all other components equally, since the system is interdependent
(c) only the plants will be affected, not the animals
(d) only the top predator will be affected

**Q33.** Organisms such as fungi and bacteria, which break down dead plants and animals into simpler substances, are called:
(a) producers
(b) herbivores
(c) decomposers
(d) carnivores

**Q34.** The dark, nutrient-rich substance formed after decomposition of dead organic matter in soil is known as:
(a) humus
(b) canopy
(c) transpiration residue
(d) chlorophyll

**Q35.** Why is humus important for a forest ecosystem?
(a) It makes the soil highly fertile by continuously cycling nutrients back to plants
(b) It prevents any new plant from growing in that area
(c) It is harmful and reduces soil quality
(d) It only exists in deserts, not forests

**Q36.** Large-scale cutting of trees for human use or to increase land for agriculture and population needs is termed:
(a) afforestation
(b) deforestation
(c) precipitation
(d) reforestation

**Q37.** Which of these is a direct consequence of deforestation, as described in the chapter?
(a) Increased soil fertility and reduced erosion
(b) Loss of soil quality due to increased soil erosion
(c) Rise in groundwater level
(d) Decrease in global temperature

**Q38.** Deforestation affects groundwater by:
(a) increasing the rate of recharge of groundwater
(b) creating a shortage of drinking water due to disturbed natural recharge process
(c) having no effect on groundwater at all
(d) turning groundwater into surface water instantly

**Q39.** Loss of habitat due to deforestation puts many animals in danger mainly because:
(a) animals prefer open, treeless land
(b) their natural living space and food sources are destroyed
(c) deforestation increases the population of predators
(d) it has no real impact, as animals easily adapt

**Q40.** Deforestation contributes to global warming primarily because:
(a) fewer trees means less carbon dioxide is absorbed, so its atmospheric concentration rises
(b) cutting trees releases large amounts of oxygen suddenly
(c) trees convert oxygen into carbon dioxide when alive
(d) deforestation cools down the Earth's surface

**Q41.** Deforestation increases the risk of floods mainly because:
(a) tree roots that normally slow down the flow of runoff water are removed
(b) more trees are left to absorb rainwater than before
(c) rainfall increases only in deforested areas
(d) floods are completely unrelated to tree cover

**Q42.** Forests help in pollination and seed dispersal mainly through:
(a) wind and running water only, never animals
(b) birds, insects (bees, butterflies) and animals like monkeys that carry seeds on fur or in droppings
(c) artificial human intervention only
(d) volcanic activity

**Q43.** "Sacred groves" in India, as described in the chapter, refer to:
(a) forest areas dedicated to a local deity and traditionally protected by communities
(b) government-owned commercial timber plantations
(c) forests used exclusively for grazing cattle
(d) newly planted urban parks

**Q44.** According to the chapter, sacred groves in India cover approximately how much land area?
(a) 100 square kilometres
(b) 1,000 square kilometres
(c) 10,000 square kilometres
(d) 1,00,000 square kilometres

**Q45.** The Chipko Movement, mentioned as a Fast Fact, was started by villagers in which region to save trees from being cut down?
(a) Garhwal region of Uttarakhand
(b) Western Ghats of Kerala
(c) Sundarbans of West Bengal
(d) Aravalli range of Rajasthan

**Q46.** In the acronym-based tip for remembering forest conservation points (T-R-E-E-S), which of the following is NOT one of the listed actions?
(a) Teach others about the importance of forests
(b) Restore damaged green cover
(c) Establish national parks
(d) Eliminate all human settlements near forests

**Q47.** Which of the following is suggested in the chapter as a step to conserve forests?
(a) Encourage large-scale, unrestricted grazing of cattle in forests
(b) Promote afforestation and special tree-planting programmes like Van Mahotsava
(c) Increase indiscriminate cutting of trees for fuel wood
(d) Discourage people's participation in forest conservation

**Q48.** According to the case study in the chapter, Guindy National Park is located in which city?
(a) Bengaluru
(b) Chennai
(c) Mumbai
(d) Hyderabad

**Q49.** As per the case study, the biodiversity of Guindy National Park is surprising mainly because:
(a) it is located far away from any city, in a remote forest
(b) despite being surrounded by houses in a small area within a metropolitan city, it hosts rich flora and fauna
(c) it has no plant life, only rocky terrain
(d) it is located at a higher altitude than the surrounding city

**Q50.** Which of the following animals is mentioned in the Guindy National Park case study as being found there?
(a) Polar bear
(b) Snow leopard
(c) Blackbuck and jungle cat
(d) Kangaroo
"""

answers = {}
ans_table = "1-b, 2-c, 3-a, 4-b, 5-b, 6-d, 7-b, 8-b, 9-b, 10-b, 11-d, 12-b, 13-b, 14-c, 15-b, 16-b, 17-b, 18-b, 19-a, 20-b, 21-b, 22-c, 23-a, 24-a, 25-b, 26-b, 27-b, 28-c, 29-b, 30-b, 31-b, 32-b, 33-c, 34-a, 35-a, 36-b, 37-b, 38-b, 39-b, 40-a, 41-a, 42-b, 43-a, 44-b, 45-a, 46-d, 47-b, 48-b, 49-b, 50-c"
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

with open('questions_forests.js', 'w') as f:
    f.write('const questions_forests = ' + json.dumps(questions, indent=2) + ';\n')
