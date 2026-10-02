import json

raw_questions = [
    {
        "id": 1,
        "question": "A flower produces pollen grains in its anthers. A visiting insect is attracted because the flower produces nectar and has noticeable colour and smell. During feeding, some pollen grains stick to the insect's body. When the same insect later visits another flower of the same kind, some of these pollen grains are transferred to the stigma.\n\nWhich process has occurred in this situation?",
        "options": {
            "A": "Self-pollination because both flowers belong to the same species",
            "B": "Cross-pollination because pollen has been transferred between flowers of different plants of the same species",
            "C": "Fertilisation because pollen grains have reached the stigma",
            "D": "Seed dispersal because an insect has transported a reproductive structure"
        },
        "answer": "B"
    },
    {
        "id": 2,
        "question": "A student observes pollen transfer occurring between two flowers that are located on the same plant. Another student argues that this must be cross-pollination because two different flowers are involved. According to the terminology given in the chapter, which statement correctly resolves the disagreement?",
        "options": {
            "A": "It is cross-pollination because the flowers are different.",
            "B": "It is self-pollination because pollination occurs within the same flower only.",
            "C": "It is self-pollination because pollination can occur between two flowers of the same plant.",
            "D": "It is neither type because pollination requires two different plants."
        },
        "answer": "C"
    },
    {
        "id": 3,
        "question": "Consider the following situations:\n\n• P: Pollen moves from one flower to another flower on the same plant.\n• Q: Pollen moves from a flower of one plant to a flower of another plant of the same species.\n• R: Pollen moves from anther to stigma of the same flower.\n\nWhich option correctly identifies the types of pollination represented?",
        "options": {
            "A": "P = cross, Q = self, R = cross",
            "B": "P = self, Q = cross, R = self",
            "C": "P = self, Q = self, R = cross",
            "D": "P = cross, Q = cross, R = self"
        },
        "answer": "B"
    },
    {
        "id": 4,
        "question": "A particular flowering plant has small, inconspicuous flowers. The flowers do not produce nectar or a noticeable scent and possess long stamens that produce pollen in large quantities. The pollen grains are light enough to be carried easily through the surrounding air.\n\nWhich mode of pollination is most consistent with all these observations?",
        "options": {
            "A": "Insect pollination",
            "B": "Water pollination",
            "C": "Wind pollination",
            "D": "Animal-mediated seed dispersal"
        },
        "answer": "C"
    },
    {
        "id": 5,
        "question": "A flower has highly coloured petals and produces nectar. An insect lands on the flower and, while obtaining nectar, accidentally picks up pollen grains from the anthers. On visiting another flower of the same species, the insect leaves some of these pollen grains on its stigma.\n\nWhich statement is most accurate?",
        "options": {
            "A": "The flower is necessarily self-pollinated because insects are involved.",
            "B": "The insect acts as an agent of pollination, and the transfer may result in cross-pollination if the pollen reaches a flower on another plant.",
            "C": "The insect causes fertilisation immediately when pollen sticks to its body.",
            "D": "The process is seed dispersal because the insect carries biological material between plants."
        },
        "answer": "B"
    },
    {
        "id": 6,
        "question": "A student is given four observations about flowers:\n\n1. Production of nectar\n2. Strong smell or bright colour\n3. Pollen grains sticking to the body of visiting insects\n4. Transfer of pollen to another flower during the insect's subsequent visit\n\nWhich conclusion is least justified solely from these observations?",
        "options": {
            "A": "The flowers can be insect-pollinated.",
            "B": "Insects can act as agents in the transfer of pollen.",
            "C": "The transfer of pollen can occur between flowers.",
            "D": "Fertilisation has definitely already occurred."
        },
        "answer": "D"
    },
    {
        "id": 7,
        "question": "A botanist compares three plants:\n\n• Plant X: produces a large quantity of light pollen and has long stamens.\n• Plant Y: produces nectar and has highly coloured, strongly scented flowers.\n• Plant Z: is aquatic and releases pollen grains into water.\n\nWhich sequence correctly associates the plants with the pollination agents described in the chapter?",
        "options": {
            "A": "X — insects; Y — wind; Z — water",
            "B": "X — wind; Y — insects; Z — water",
            "C": "X — water; Y — insects; Z — wind",
            "D": "X — wind; Y — water; Z — insects"
        },
        "answer": "B"
    },
    {
        "id": 8,
        "question": "A student writes:\n\n\"Since pollen grains are transferred from anther to stigma, pollination and fertilisation must represent the same event.\"\n\nWhich correction is most appropriate according to the chapter?",
        "options": {
            "A": "Pollination is transfer of pollen from anther to stigma, whereas fertilisation involves fusion of male and female gametes.",
            "B": "Pollination occurs only after fertilisation, whereas fertilisation transfers pollen grains.",
            "C": "Pollination forms the zygote, whereas fertilisation merely transports pollen.",
            "D": "Pollination and fertilisation are two names for the formation of seeds."
        },
        "answer": "A"
    },
    {
        "id": 9,
        "question": "A pollen grain reaches the stigma of a suitable flower. Instead of immediately fusing with the female gamete, it first develops a tubular structure that grows through the style and eventually reaches an ovule inside the ovary.\n\nWhich structure is being described?",
        "options": {
            "A": "Embryo",
            "B": "Pollen tube",
            "C": "Cotyledon",
            "D": "Seed coat"
        },
        "answer": "B"
    },
    {
        "id": 10,
        "question": "A sequence of events is observed in a flowering plant:\n\nPollen reaches stigma → tubular structure develops → tube grows through style → reaches ovule → one male gamete reaches the egg → fusion occurs\n\nWhich event marks fertilisation?",
        "options": {
            "A": "Pollen reaching the stigma",
            "B": "Formation of the pollen tube",
            "C": "Growth of the pollen tube through the style",
            "D": "Fusion of the male and female gametes"
        },
        "answer": "D"
    },
    {
        "id": 11,
        "question": "A pollen tube reaches an ovule and carries two male gametes. One male gamete passes through the pollen tube and reaches the egg, where fusion occurs.\n\nWhich structure is formed immediately as a result of this fusion?",
        "options": {
            "A": "Embryo",
            "B": "Zygote",
            "C": "Seed",
            "D": "Fruit"
        },
        "answer": "B"
    },
    {
        "id": 12,
        "question": "A student proposes the following sequence:\n\nPollen grain → stigma → pollen tube → ovule → fusion of gametes → embryo → seed\n\nAnother student says the sequence incorrectly places the embryo before the zygote. Which answer correctly identifies the missing stage?",
        "options": {
            "A": "Ovary",
            "B": "Zygote",
            "C": "Pollen grain",
            "D": "Stigma"
        },
        "answer": "B"
    },
    {
        "id": 13,
        "question": "A flower has successfully undergone pollination, and a pollen tube has reached an ovule. However, no fusion between the male and female gametes has yet occurred.\n\nWhich conclusion is most appropriate?",
        "options": {
            "A": "Pollination has occurred, but fertilisation has not yet been completed.",
            "B": "Fertilisation has already occurred because the pollen tube reached the ovule.",
            "C": "A seed has already formed because pollen reached the ovule.",
            "D": "A fruit has already formed because the pollen tube entered the ovary."
        },
        "answer": "A"
    },
    {
        "id": 14,
        "question": "After successful fertilisation in a flower, several visible changes occur. The petals, stamens, style and stigma eventually fall off, while the ovary remains. Inside the ovary, the fertilised ovules continue developing.\n\nWhich statement best describes the eventual relationship between the structures?",
        "options": {
            "A": "Ovary develops into seed and ovule develops into fruit.",
            "B": "Ovule develops into seed and the ovary develops into fruit.",
            "C": "Stigma develops into seed and ovary develops into pollen grain.",
            "D": "Pollen tube develops into fruit and ovule develops into embryo."
        },
        "answer": "B"
    },
    {
        "id": 15,
        "question": "A botanist cuts open a developing seed and discovers an embryo containing one or two structures that store food for future development.\n\nWhat are these structures called according to the chapter?",
        "options": {
            "A": "Stamens",
            "B": "Cotyledons",
            "C": "Pollen tubes",
            "D": "Sepals"
        },
        "answer": "B"
    },
    {
        "id": 16,
        "question": "A student examines a pea pod and a fleshy tomato and argues that because one is classified as a pod and the other as a fleshy fruit, they must have originated from different reproductive processes.\n\nWhich statement best corrects this reasoning?",
        "options": {
            "A": "Both are fruits formed from the ovary after fertilisation; the ovary wall may become fleshy or hard depending on the plant.",
            "B": "Pea pods develop from ovules, whereas tomatoes develop directly from pollen grains.",
            "C": "Tomatoes are formed by seed dispersal whereas peas are formed by fertilisation.",
            "D": "Only fleshy structures can be considered fruits after fertilisation."
        },
        "answer": "A"
    },
    {
        "id": 17,
        "question": "A fertilised ovule contains a zygote. The zygote divides and develops into an embryo, while the surrounding ovule gradually develops into a seed. Meanwhile, the ovary undergoes development.\n\nWhich statement correctly completes the process?",
        "options": {
            "A": "The ovary develops into the fruit.",
            "B": "The ovary develops into the pollen tube.",
            "C": "The ovary develops into the cotyledon.",
            "D": "The ovary develops into the stigma."
        },
        "answer": "A"
    },
    {
        "id": 18,
        "question": "A student observes that after fertilisation, the petals and other floral structures fall off, while the ovary remains and later becomes the fruit. The student then claims that the entire flower becomes the fruit.\n\nWhich evaluation is most accurate?",
        "options": {
            "A": "Correct, because every part of the flower remains and collectively forms the fruit.",
            "B": "Incorrect, because the chapter specifically describes the ovary as developing into the fruit after fertilisation.",
            "C": "Correct, because petals are converted into cotyledons.",
            "D": "Incorrect, because fruits develop directly from pollen grains."
        },
        "answer": "B"
    },
    {
        "id": 19,
        "question": "A plant produces hundreds of seeds around its base. If all of them germinate immediately in the same small area, the resulting seedlings would have to depend on the same limited supply of sunlight, water and minerals.\n\nWhy, according to the chapter, is seed dispersal advantageous?",
        "options": {
            "A": "It ensures that all seedlings remain close to the mother plant.",
            "B": "It helps prevent overcrowding and competition and allows plants to flourish in new habitats.",
            "C": "It prevents seeds from germinating under any circumstances.",
            "D": "It ensures that all seeds are dispersed only by animals."
        },
        "answer": "B"
    },
    {
        "id": 20,
        "question": "Consider the following four seeds:\n\n• Seed P: very light and possesses structures that allow it to be carried through air\n• Seed Q: has a structure suitable for floating\n• Seed R: has hooks that can attach to animal fur\n• Seed S: is enclosed in a fruit that bursts when mature\n\nWhich sequence correctly identifies the likely dispersal mechanisms?",
        "options": {
            "A": "P—water, Q—wind, R—explosion, S—animals",
            "B": "P—wind, Q—water, R—animals, S—explosion",
            "C": "P—animals, Q—explosion, R—water, S—wind",
            "D": "P—wind, Q—animals, R—water, S—explosion"
        },
        "answer": "B"
    },
    {
        "id": 21,
        "question": "A plant produces seeds that are extremely light and have tufts of silky hair. The seeds can remain airborne and travel considerable distances away from the parent plant.\n\nWhich example from the chapter follows the same basic dispersal mechanism?",
        "options": {
            "A": "Coconut",
            "B": "Lotus",
            "C": "Dandelion",
            "D": "Pea"
        },
        "answer": "C"
    },
    {
        "id": 22,
        "question": "A seed is enclosed within a structure that has features allowing it to remain afloat when it reaches water. Water currents subsequently carry the seed away from the parent plant.\n\nWhich type of seed dispersal is being demonstrated?",
        "options": {
            "A": "Wind dispersal",
            "B": "Water dispersal",
            "C": "Animal dispersal",
            "D": "Explosion dispersal"
        },
        "answer": "B"
    },
    {
        "id": 23,
        "question": "A fruit possesses numerous hooks and spines on its surface. When an animal passes near the plant, the fruit attaches to the animal's body and is transported to another location.\n\nWhich conclusion is most consistent with the chapter?",
        "options": {
            "A": "The hooks enable the fruit/seed structure to be dispersed by animals.",
            "B": "The hooks enable pollen grains to be dispersed by wind.",
            "C": "The hooks cause the fruit to burst and disperse its seeds through explosion.",
            "D": "The hooks are reproductive organs responsible for fertilisation."
        },
        "answer": "A"
    },
    {
        "id": 24,
        "question": "A bird eats the fleshy portion of a fruit but later drops the seeds at a location considerably distant from the parent plant. The seeds subsequently germinate.\n\nWhich statement best explains the role of the bird?",
        "options": {
            "A": "It directly fertilises the seeds after eating the fruit.",
            "B": "It acts as an agent that helps disperse seeds by transporting or releasing them away from the parent plant.",
            "C": "It converts the ovary into the fruit.",
            "D": "It converts pollen grains into embryos."
        },
        "answer": "B"
    },
    {
        "id": 25,
        "question": "A researcher records the following chain of events in a flowering plant:\n\nA flower produces pollen grains. An insect visits the flower because of nectar and carries pollen to another flower of the same species growing on a different plant. The pollen reaches the stigma and subsequently forms a pollen tube. The pollen tube grows through the style toward an ovule. A male gamete reaches the egg and fuses with it, producing a zygote. The zygote develops into an embryo, while the fertilised ovule develops into a seed. The ovary develops into a fruit. Later, the mature structure is transported away from the parent plant because its seeds possess features suited to attachment to animals.\n\nWhich option correctly identifies the sequence of major processes represented?",
        "options": {
            "A": "Self-pollination → fertilisation → seed formation → fruit formation → animal dispersal",
            "B": "Cross-pollination → fertilisation → seed formation → fruit formation → animal dispersal",
            "C": "Insect pollination → self-pollination → fertilisation → wind dispersal",
            "D": "Cross-pollination → germination → fertilisation → water dispersal → fruit formation"
        },
        "answer": "B"
    },
    {
        "id": 26,
        "question": "Study the diagram showing four different modes of asexual reproduction in organisms/plants. In Diagram A, a small projection develops on the parent organism; in Diagram B, a filamentous organism breaks into several pieces; in Diagram C, reproductive structures containing spores are shown; and in Diagram D, a new plant develops from a vegetative part of the parent plant.\n\nWhich sequence correctly identifies A, B, C and D?",
        "image": "images/q26_asexual_diagram.jpg",
        "options": {
            "A": "Budding → Fragmentation → Spore formation → Vegetative propagation",
            "B": "Fragmentation → Budding → Vegetative propagation → Spore formation",
            "C": "Budding → Spore formation → Fragmentation → Vegetative propagation",
            "D": "Spore formation → Fragmentation → Budding → Vegetative propagation"
        },
        "answer": "A"
    },
    {
        "id": 27,
        "question": "A labelled diagram of a bisexual flower is shown. The labels P, Q, R and S point respectively to four different structures. P is the swollen basal portion of the female reproductive structure, Q is the sticky upper surface that receives pollen, R is the pollen-producing structure of the male reproductive organ, and S is the structure inside the ovary that develops into a seed after fertilisation.\n\nWhich option correctly identifies P, Q, R and S?",
        "image": "images/q27_flower_diagram.jpg",
        "options": {
            "A": "P — Ovary, Q — Stigma, R — Anther, S — Ovule",
            "B": "P — Ovule, Q — Style, R — Stigma, S — Ovary",
            "C": "P — Ovary, Q — Anther, R — Stigma, S — Ovule",
            "D": "P — Style, Q — Stigma, R — Filament, S — Ovary"
        },
        "answer": "A"
    },
    {
        "id": 28,
        "question": "The diagram shows the reproductive sequence in a flower. P represents pollen being transferred from anther to stigma. Q represents a tube growing down through the style. R represents the fusion of male and female gametes inside the ovule. S represents the immediate product formed following this fusion.\n\nWhich option correctly identifies the processes/events represented by P, Q, R and S?",
        "image": "images/q28_pollination_fert_diagram.jpg",
        "options": {
            "A": "P — Fertilisation, Q — Pollination, R — Seed formation, S — Embryo",
            "B": "P — Pollination, Q — Pollen tube formation/growth, R — Fertilisation, S — Zygote",
            "C": "P — Germination, Q — Pollination, R — Fertilisation, S — Fruit",
            "D": "P — Pollination, Q — Seed formation, R — Germination, S — Embryo"
        },
        "answer": "B"
    },
    {
        "id": 29,
        "question": "A diagram contains four fruits/seeds labelled P, Q, R and S:\n\n• P has a light structure with hair-like projections.\n• Q has a structure adapted for floating.\n• R has hooks/spines that can attach to animal fur.\n• S is enclosed in a fruit that bursts open when mature.\n\nWhich sequence correctly identifies their primary methods of seed dispersal?",
        "image": "images/q29_seed_dispersal_diagram.jpg",
        "options": {
            "A": "P — Wind, Q — Water, R — Animals, S — Explosion",
            "B": "P — Water, Q — Wind, R — Explosion, S — Animals",
            "C": "P — Animals, Q — Water, R — Wind, S — Explosion",
            "D": "P — Wind, Q — Animals, R — Water, S — Explosion"
        },
        "answer": "A"
    },
    {
        "id": 30,
        "question": "The diagram represents a simplified sequence beginning with a flower and ending with the establishment of new plants. The stages are labelled P, Q, R, S, T and U.\n\nThe diagram shows:\n• P: pollen transfer to stigma\n• Q: pollen tube reaching the ovule\n• R: formation of a zygote\n• S: development of the embryo/seed\n• T: development of the fruit\n• U: movement of seeds away from the parent plant\n\nWhich sequence of processes is represented most accurately?",
        "image": "images/q30_reproduction_cycle_diagram.jpg",
        "options": {
            "A": "Pollination → pollen tube growth → fertilisation → seed formation → fruit formation → seed dispersal",
            "B": "Fertilisation → pollination → seed dispersal → fruit formation → germination → budding",
            "C": "Pollination → germination → fertilisation → fruit formation → fragmentation → seed dispersal",
            "D": "Self-pollination → fertilisation → spore formation → seed formation → fruit formation → fragmentation"
        },
        "answer": "A"
    }
]

with open("questions_reproduction2.js", "w", encoding="utf-8") as f:
    f.write("const questions_reproduction2 = " + json.dumps(raw_questions, indent=2) + ";\n")

print(f"Wrote {len(raw_questions)} questions with diagram images to questions_reproduction2.js")
