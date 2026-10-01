import json

raw_questions = [
    {
        "id": 1,
        "question": "A student observes an organism in which a small bulb-like projection first appears on the parent body. The nucleus of the parent divides, with one part moving into this projection. After sufficient development, the projection separates from the parent and survives independently. Based strictly on the process described, which of the following conclusions is most appropriate?",
        "options": {
            "A": "It is fragmentation because the parent body divides into two or more fragments, each forming a new organism.",
            "B": "It is budding because a projection develops on the parent body and eventually becomes an independent individual.",
            "C": "It is spore formation because the new organism develops from a thick-walled reproductive body.",
            "D": "It is vegetative propagation because reproduction necessarily occurs through a root, stem or leaf."
        },
        "answer": "B"
    },
    {
        "id": 2,
        "question": "A biology teacher gives four observations:\n\n1. A single organism produces a new individual without seeds.\n2. A protective coating allows a reproductive structure to survive unfavorable conditions.\n3. A long filamentous body breaks into several pieces, each of which grows independently.\n4. A plant produces another plant from a modified underground structure.\n\nIf the observations are arranged according to the four asexual reproduction methods discussed in the chapter, which sequence is correct?",
        "options": {
            "A": "Budding → spore formation → fragmentation → vegetative propagation",
            "B": "Spore formation → budding → vegetative propagation → fragmentation",
            "C": "Budding → fragmentation → spore formation → vegetative propagation",
            "D": "Vegetative propagation → spore formation → fragmentation → budding"
        },
        "answer": "A"
    },
    {
        "id": 3,
        "question": "A culture contains yeast cells under conditions where sufficient nutrients are available. Initially, a small projection develops on one cell. Later, the nucleus divides, the projection increases in size, and eventually the new cell separates. If the same organism continues reproducing under suitable conditions, which statement is least consistent with the description given in the chapter?",
        "options": {
            "A": "The process can produce new individuals without seeds.",
            "B": "The process requires only one organism for reproduction.",
            "C": "The process involves a bulb-like projection called a bud.",
            "D": "The process requires fusion of male and female gametes."
        },
        "answer": "D"
    },
    {
        "id": 4,
        "question": "A student places a piece of stale bread in a moist and warm place for several days. A white, fluffy mass eventually appears on its surface. The student concludes that the visible fluffy mass itself is the original food material that has transformed directly into a new plant. Which correction best matches the explanation in the chapter?",
        "options": {
            "A": "The fluffy mass represents fragments of the bread that independently become plants.",
            "B": "The fluffy mass represents germinating spores of Rhizopus.",
            "C": "The fluffy mass represents buds produced by yeast cells present in the bread.",
            "D": "The fluffy mass represents modified roots developing from the bread surface."
        },
        "answer": "B"
    },
    {
        "id": 5,
        "question": "Consider the following hypothetical situations:\n\n• P: A reproductive structure possesses a thick and hard protective coating and remains capable of surviving unfavorable conditions.\n• Q: A filamentous organism breaks into several pieces and every piece develops into an individual.\n• R: A small projection grows on the body of a parent organism and later separates.\n• S: A swollen underground plant part gives rise to a new plant.\n\nWhich pair represents processes that are most clearly distinguished by the fact that one involves breaking of an existing body into pieces, while the other involves growth from a plant's vegetative part?",
        "options": {
            "A": "P and Q",
            "B": "Q and S",
            "C": "R and S",
            "D": "P and R"
        },
        "answer": "B"
    },
    {
        "id": 6,
        "question": "A student claims that fragmentation and vegetative propagation are identical because in both cases 'a part of an existing organism produces another individual without seeds.' Which statement most accurately identifies the distinction presented in the chapter?",
        "options": {
            "A": "Fragmentation occurs only in flowering plants, whereas vegetative propagation occurs only in non-flowering plants.",
            "B": "Fragmentation involves breaking of a filamentous body into fragments, whereas vegetative propagation involves reproductive growth from vegetative plant parts such as root, stem or leaf.",
            "C": "Fragmentation always requires artificial intervention, whereas vegetative propagation is always natural.",
            "D": "Fragmentation involves gamete fusion, whereas vegetative propagation occurs through spores."
        },
        "answer": "B"
    },
    {
        "id": 7,
        "question": "A gardener notices that a plant obtained through vegetative propagation begins flowering considerably earlier than another plant of the same kind raised from a seed. According to the information in the chapter, which inference is most directly supported?",
        "options": {
            "A": "Vegetative propagation always produces plants with greater genetic variation than seed formation.",
            "B": "Plants raised through vegetative propagation can begin bearing flowers and fruits earlier than plants produced from seeds.",
            "C": "Seed-produced plants cannot produce flowers or fruits unless they undergo artificial propagation.",
            "D": "Vegetative propagation changes the reproductive organs of a plant into vegetative organs."
        },
        "answer": "B"
    },
    {
        "id": 8,
        "question": "A researcher wants to obtain several new plants from a single parent plant while preserving the characteristics of the parent. He considers four methods described in the chapter. Which combination of reason + method is most appropriate?",
        "options": {
            "A": "Production of genetically identical plants in less time → cutting",
            "B": "Production of maximum variation → cutting",
            "C": "Production through fusion of gametes → layering",
            "D": "Production exclusively through underground roots → grafting"
        },
        "answer": "A"
    },
    {
        "id": 9,
        "question": "A potato farmer cuts a potato into several pieces, but deliberately ensures that every piece contains at least one 'eye.' The pieces are planted in soil and watered regularly. After some time, shoots emerge. Which interpretation is most consistent with the chapter?",
        "options": {
            "A": "The eyes are seeds that undergo sexual reproduction inside the soil.",
            "B": "The eyes are buds on a modified underground stem and can produce new plants.",
            "C": "The eyes are spores protected by a thick reproductive coating.",
            "D": "The eyes are flowers that directly develop into new plants."
        },
        "answer": "B"
    },
    {
        "id": 10,
        "question": "A student is shown four plant structures:\n\nP: swollen root of sweet potato\nQ: ginger\nR: potato\nS: onion bulb\n\nThe teacher asks which arrangement correctly identifies structures specifically described as modified underground stems, rather than modified roots.",
        "options": {
            "A": "P only",
            "B": "Q, R and S",
            "C": "P, Q and R",
            "D": "P and S only"
        },
        "answer": "B"
    },
    {
        "id": 11,
        "question": "A plant has a leaf with small buds located along the margins. When the leaf is placed in suitable conditions, these buds can develop into new plants. If a student classifies this process according to the source of the new plant, which category should be selected?",
        "options": {
            "A": "Vegetative propagation by modified roots",
            "B": "Vegetative propagation by leaves",
            "C": "Vegetative propagation by underground stems",
            "D": "Sexual reproduction through seeds"
        },
        "answer": "B"
    },
    {
        "id": 12,
        "question": "A slender branch of a plant originates near the base of the main stem. As it grows, it bends until it touches the soil. At the point of contact, roots and a bud develop, after which a new plant arises. Which method is being represented?",
        "options": {
            "A": "Cutting",
            "B": "Layering",
            "C": "Grafting",
            "D": "Spore formation"
        },
        "answer": "B"
    },
    {
        "id": 13,
        "question": "Which of the following situations would NOT correctly represent the artificial method of vegetative propagation called cutting?",
        "options": {
            "A": "A small piece of stem containing leaf buds is planted so that it develops roots and grows into a new plant.",
            "B": "A branch of rose containing a suitable bud is separated from the parent and planted in moist soil.",
            "C": "A lower branch is bent toward the ground and covered with moist soil until roots develop before separation.",
            "D": "A stem piece is used to produce a new plant without the formation of seeds."
        },
        "answer": "C"
    },
    {
        "id": 14,
        "question": "A horticulturist possesses a rooted plant whose stem is capable of supporting another desired plant variety. He takes a cutting from the desired plant and inserts it into a cut made in the stem/branch of the rooted plant. The two parts are tied together so that the inserted portion receives necessary nutrients.\n\nWhich statement correctly identifies the two components?",
        "options": {
            "A": "Rooted plant = scion; inserted cutting = stock",
            "B": "Rooted plant = stock; inserted cutting = scion",
            "C": "Rooted plant = bud; inserted cutting = spore",
            "D": "Rooted plant = fragment; inserted cutting = rhizome"
        },
        "answer": "B"
    },
    {
        "id": 15,
        "question": "A farmer wants to combine the properties of a particular desired plant portion with the established root system of another rooted plant. The farmer therefore joins two plant portions in the manner described in the chapter. Which reason best explains why this method is particularly useful?",
        "options": {
            "A": "It allows the complete elimination of vegetative reproduction.",
            "B": "It is helpful in producing desired varieties of plants and fruits.",
            "C": "It guarantees that the resulting plant will reproduce only by spores.",
            "D": "It works by breaking the parent plant into multiple independent fragments."
        },
        "answer": "B"
    },
    {
        "id": 16,
        "question": "A student compares cutting, layering and grafting and writes the following statements:\n\n1. Cutting involves a piece of stem having leaf buds.\n2. Layering involves bending a lower branch to the ground and covering it with moist soil.\n3. Grafting involves inserting a scion into a rooted stock.\n4. All three methods necessarily involve seeds before a new plant can develop.\n\nWhich option correctly evaluates the statements?",
        "options": {
            "A": "Only 1 and 2 are correct.",
            "B": "Only 2 and 4 are correct.",
            "C": "Statements 1, 2 and 3 are correct.",
            "D": "All four statements are correct."
        },
        "answer": "C"
    },
    {
        "id": 17,
        "question": "A laboratory wants to produce many small plants from a very small piece of plant tissue under controlled conditions. The procedure involves taking a small tissue piece called an explant, placing it in a nutrient medium, allowing a mass of cells called callus to develop, and eventually obtaining tiny plantlets.\n\nWhich method is being described?",
        "options": {
            "A": "Layering",
            "B": "Tissue culture",
            "C": "Fragmentation",
            "D": "Spore formation"
        },
        "answer": "B"
    },
    {
        "id": 18,
        "question": "A horticultural scientist argues that artificial/vegetative propagation has several practical advantages. Which observation would provide the strongest support for the chapter's stated advantages?",
        "options": {
            "A": "Plants produced vegetatively are genetically identical to the parent under the same conditions and can begin producing flowers or fruits sooner.",
            "B": "Plants produced vegetatively always show greater variation and therefore adapt to every disease.",
            "C": "Plants produced vegetatively necessarily require more time than plants produced from seeds.",
            "D": "Plants produced vegetatively cannot reproduce without first forming flowers."
        },
        "answer": "A"
    },
    {
        "id": 19,
        "question": "A farmer chooses vegetative propagation for a plant that does not produce seeds easily. Another farmer argues that seed-based reproduction should always be preferred because it creates greater variation. Based only on the chapter, which response is most appropriate?",
        "options": {
            "A": "Vegetative propagation can be useful for plants that do not produce seeds and can produce genetically identical offspring, but lack of variation is also a disadvantage.",
            "B": "Vegetative propagation is unsuitable whenever a plant does not produce seeds.",
            "C": "Vegetative propagation always increases variation and therefore eliminates disease susceptibility.",
            "D": "Seed reproduction and vegetative propagation have exactly the same advantages and disadvantages."
        },
        "answer": "A"
    },
    {
        "id": 20,
        "question": "A student makes the following chain:\n\nVegetative part → no reproductive organ → new plant → genetically identical to parent → no variation\n\nThe teacher says the chain is broadly consistent with the chapter but asks the student to identify the statement that cannot be concluded directly from the chapter.",
        "options": {
            "A": "Vegetative propagation can occur without the help of reproductive organs.",
            "B": "New plants produced under the same conditions are genetically identical to the parent plant.",
            "C": "Vegetative propagation does not lead to variation in the plant population.",
            "D": "Every vegetatively produced plant is completely resistant to diseases specific to its species."
        },
        "answer": "D"
    },
    {
        "id": 21,
        "question": "A flowering plant is examined before reproduction. The observer finds that the flower possesses only one of the two reproductive organs—either the male reproductive organ or the female reproductive organ. According to the terminology used in the chapter, this flower should be classified as:",
        "options": {
            "A": "Bisexual because every flower must possess both reproductive organs.",
            "B": "Unisexual because it contains only one type of reproductive organ.",
            "C": "Asexual because it contains a reproductive organ.",
            "D": "Vegetative because it lacks both reproductive organs."
        },
        "answer": "B"
    },
    {
        "id": 22,
        "question": "Two flowers are examined:\n\n• Flower X: possesses only the male reproductive organ.\n• Flower Y: possesses both male and female reproductive organs.\n\nWhich classification is correct according to the chapter?",
        "options": {
            "A": "X = bisexual, Y = unisexual",
            "B": "X = unisexual, Y = bisexual",
            "C": "X = asexual, Y = unisexual",
            "D": "X = vegetative, Y = reproductive"
        },
        "answer": "B"
    },
    {
        "id": 23,
        "question": "A student is asked to identify the male reproductive structure of a flower and is shown four structures: stigma, ovary, anther and ovule. The student chooses the structure that directly carries pollen grains. Which answer should be selected?",
        "options": {
            "A": "Stigma",
            "B": "Ovary",
            "C": "Anther",
            "D": "Ovule"
        },
        "answer": "C"
    },
    {
        "id": 24,
        "question": "Consider the following sequence describing the reproductive structures of a flower:\n\nStructure P → produces/carries pollen grains → pollen grains produce male gametes\nStructure Q → receives pollen → connected downward to ovary\n\nWhich pair correctly identifies P and Q?",
        "options": {
            "A": "P = stigma; Q = anther",
            "B": "P = anther; Q = stigma",
            "C": "P = ovary; Q = filament",
            "D": "P = ovule; Q = sepal"
        },
        "answer": "B"
    },
    {
        "id": 25,
        "question": "A teacher gives a student the following collection of statements without naming the processes:\n\n1. One organism is sufficient.\n2. Seeds are not required.\n3. A new structure may arise as a projection from the parent.\n4. A thick protective coating may help a reproductive structure survive unfavorable conditions.\n5. A filamentous body may break into pieces, each producing an individual.\n6. A root, stem or leaf may give rise to a new plant.\n7. A cutting may be inserted into a rooted plant.\n8. A tissue sample may be grown in nutrient medium under controlled conditions.\n\nThe student is asked to determine which statements collectively describe only asexual/vegetative methods discussed in the first seven pages. Which option is correct?",
        "options": {
            "A": "1, 2, 3, 4, 5, 6, 7 and 8",
            "B": "1, 2, 3, 5 and 8 only",
            "C": "2, 4, 6 and 7 only",
            "D": "1, 3, 4 and 8 only"
        },
        "answer": "A"
    }
]

with open("questions_reproduction.js", "w", encoding="utf-8") as f:
    f.write("const questions_reproduction = " + json.dumps(raw_questions, indent=2, ensure_ascii=False) + ";\n")

print("Generated questions_reproduction.js with", len(raw_questions), "questions.")
