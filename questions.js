const questions = [
  {
    "id": 1,
    "question": "Which of the following is a physical property of a substance?",
    "options": {
      "A": "Reactivity with oxygen",
      "B": "Ability to form a new substance",
      "C": "Colour",
      "D": "Reaction with acids"
    },
    "answer": "C"
  },
  {
    "id": 2,
    "question": "A sheet of paper is folded and then unfolded. This change is:",
    "options": {
      "A": "Chemical and irreversible",
      "B": "Physical and reversible",
      "C": "Chemical and reversible",
      "D": "Physical and irreversible"
    },
    "answer": "B"
  },
  {
    "id": 3,
    "question": "Which statement correctly describes a physical change?",
    "options": {
      "A": "A new substance must always be formed",
      "B": "Chemical composition changes completely",
      "C": "Only physical properties may change",
      "D": "Chemical properties always change"
    },
    "answer": "C"
  },
  {
    "id": 4,
    "question": "A student tears a sheet of paper into very small pieces. Which statement is correct?",
    "options": {
      "A": "A new substance is formed",
      "B": "Chemical composition of paper changes",
      "C": "Original sheet cannot be recovered, so it is chemical",
      "D": "No new substance is formed, so it is a physical change"
    },
    "answer": "D"
  },
  {
    "id": 5,
    "question": "Which pair contains only physical changes?",
    "options": {
      "A": "Burning coal and melting ice",
      "B": "Rusting iron and curd formation",
      "C": "Dissolving sugar and melting wax",
      "D": "Digestion and tearing paper"
    },
    "answer": "C"
  },
  {
    "id": 6,
    "question": "Sugar is dissolved in water. The solution is concentrated by heating and then cooled, producing sugar crystals. This demonstrates that dissolution of sugar is:",
    "options": {
      "A": "Chemical and irreversible",
      "B": "Physical but irreversible",
      "C": "Physical and reversible",
      "D": "Chemical but reversible"
    },
    "answer": "C"
  },
  {
    "id": 7,
    "question": "Why is dissolution of sugar in water considered a physical change?",
    "options": {
      "A": "Sugar reacts chemically with water",
      "B": "Sugar loses its sweet taste",
      "C": "Sugar can be recovered and retains its basic properties",
      "D": "Water changes permanently into sugar"
    },
    "answer": "C"
  },
  {
    "id": 8,
    "question": "Which change involves only a change of state?",
    "options": {
      "A": "Burning wax",
      "B": "Melting ice",
      "C": "Rusting iron",
      "D": "Burning magnesium"
    },
    "answer": "B"
  },
  {
    "id": 9,
    "question": "When water changes into vapour and then back into water, the processes involved are:",
    "options": {
      "A": "Freezing and melting",
      "B": "Vaporisation and condensation",
      "C": "Condensation and freezing",
      "D": "Melting and vaporisation"
    },
    "answer": "B"
  },
  {
    "id": 10,
    "question": "Stretching a rubber band is considered a physical change mainly because:",
    "options": {
      "A": "A new substance is formed",
      "B": "Its chemical composition changes",
      "C": "Only its size changes and it can return to its original form",
      "D": "Heat and light are produced"
    },
    "answer": "C"
  },
  {
    "id": 11,
    "question": "Which statement about physical changes is NOT correct according to the chapter?",
    "options": {
      "A": "No new substance is formed",
      "B": "Physical properties may change",
      "C": "They are generally temporary and reversible",
      "D": "They always involve a large amount of energy"
    },
    "answer": "D"
  },
  {
    "id": 12,
    "question": "Which of the following is an irreversible physical change mentioned in the chapter?",
    "options": {
      "A": "Melting ice",
      "B": "Folding paper",
      "C": "Tearing paper",
      "D": "Dissolving sugar"
    },
    "answer": "C"
  },
  {
    "id": 13,
    "question": "A chemical change is best identified by:",
    "options": {
      "A": "Change in shape only",
      "B": "Change in state only",
      "C": "Formation of one or more new substances",
      "D": "Change in size only"
    },
    "answer": "C"
  },
  {
    "id": 14,
    "question": "When carbon burns, carbon dioxide is formed. This is a chemical change because:",
    "options": {
      "A": "Carbon changes its size",
      "B": "Carbon dioxide has different properties from carbon",
      "C": "Carbon changes from solid to liquid",
      "D": "Carbon becomes smaller"
    },
    "answer": "B"
  },
  {
    "id": 15,
    "question": "Which combination gives two chemical changes?",
    "options": {
      "A": "Melting wax and freezing water",
      "B": "Tearing paper and stretching rubber",
      "C": "Burning wood and digestion of food",
      "D": "Dissolving sugar and condensation"
    },
    "answer": "C"
  },
  {
    "id": 16,
    "question": "Which of the following is not sufficient by itself to prove that a chemical change has occurred?",
    "options": {
      "A": "Formation of a new substance",
      "B": "Change in chemical composition",
      "C": "Change in shape only",
      "D": "Formation of substances with different properties"
    },
    "answer": "C"
  },
  {
    "id": 17,
    "question": "When milk changes into curd, the change is chemical mainly because:",
    "options": {
      "A": "Milk changes from liquid to semi-solid",
      "B": "Its colour may change",
      "C": "Its taste changes",
      "D": "Milk cannot be obtained back by a simple method and new properties appear"
    },
    "answer": "D"
  },
  {
    "id": 18,
    "question": "Which statement about rust is correct?",
    "options": {
      "A": "Rust and iron are the same substance",
      "B": "Rust is a physical form of iron",
      "C": "Rust has different composition and properties from iron",
      "D": "Rust can easily be converted back into iron by physical methods"
    },
    "answer": "C"
  },
  {
    "id": 19,
    "question": "Rusting of iron requires:",
    "options": {
      "A": "Only oxygen",
      "B": "Only water",
      "C": "Oxygen and moisture",
      "D": "Carbon dioxide and sunlight"
    },
    "answer": "C"
  },
  {
    "id": 20,
    "question": "An iron object is kept in a dry desert-like environment. Rusting is slower mainly because:",
    "options": {
      "A": "Oxygen is absent",
      "B": "Moisture is very low",
      "C": "Iron cannot react with oxygen",
      "D": "Temperature is always zero"
    },
    "answer": "B"
  },
  {
    "id": 21,
    "question": "Why does iron generally rust faster in coastal areas?",
    "options": {
      "A": "Coastal air contains no oxygen",
      "B": "Coastal areas have higher moisture/humidity",
      "C": "Iron becomes softer near the sea",
      "D": "Sunlight is stronger near the sea"
    },
    "answer": "B"
  },
  {
    "id": 22,
    "question": "Which of the following is NOT a method of preventing rusting given in the chapter?",
    "options": {
      "A": "Painting",
      "B": "Galvanisation",
      "C": "Alloying",
      "D": "Melting"
    },
    "answer": "D"
  },
  {
    "id": 23,
    "question": "Painting an iron gate prevents rusting because paint:",
    "options": {
      "A": "Converts iron into zinc",
      "B": "Removes oxygen permanently from air",
      "C": "Prevents moist air from contacting the iron surface",
      "D": "Changes rust into iron"
    },
    "answer": "C"
  },
  {
    "id": 24,
    "question": "Grease is applied to bicycle chains mainly because it:",
    "options": {
      "A": "Increases the amount of moisture touching iron",
      "B": "Prevents contact between iron and moist air",
      "C": "Converts iron into an alloy",
      "D": "Produces oxygen around the chain"
    },
    "answer": "B"
  },
  {
    "id": 25,
    "question": "Galvanisation involves coating iron with:",
    "options": {
      "A": "Copper",
      "B": "Aluminium",
      "C": "Zinc",
      "D": "Magnesium"
    },
    "answer": "C"
  },
  {
    "id": 26,
    "question": "Which statement best explains why galvanisation protects iron?",
    "options": {
      "A": "Zinc allows water to reach iron faster",
      "B": "Zinc coating prevents iron from coming into contact with moist air",
      "C": "Zinc changes iron into rust",
      "D": "Zinc removes all oxygen from the atmosphere"
    },
    "answer": "B"
  },
  {
    "id": 27,
    "question": "Stainless steel is an example of preventing corrosion by:",
    "options": {
      "A": "Painting",
      "B": "Galvanisation",
      "C": "Alloying",
      "D": "Crystallisation"
    },
    "answer": "C"
  },
  {
    "id": 28,
    "question": "Which metals are mentioned as being used in alloying iron to prevent corrosion?",
    "options": {
      "A": "Nickel, chromium and manganese",
      "B": "Copper, zinc and silver",
      "C": "Sodium, potassium and calcium",
      "D": "Carbon, oxygen and hydrogen"
    },
    "answer": "A"
  },
  {
    "id": 29,
    "question": "Burning a candle demonstrates:",
    "options": {
      "A": "Only a physical change",
      "B": "Only a chemical change",
      "C": "Both physical and chemical changes",
      "D": "Neither physical nor chemical change"
    },
    "answer": "C"
  },
  {
    "id": 30,
    "question": "During burning of a candle, melting of wax is:",
    "options": {
      "A": "Chemical and irreversible",
      "B": "Physical and reversible",
      "C": "Chemical and reversible",
      "D": "Physical and irreversible"
    },
    "answer": "B"
  },
  {
    "id": 31,
    "question": "During burning of a candle, burning of wax and the cotton thread is:",
    "options": {
      "A": "Physical change",
      "B": "Chemical change",
      "C": "Reversible physical change",
      "D": "Change of state only"
    },
    "answer": "B"
  },
  {
    "id": 32,
    "question": "Which substances are produced when wax undergoes combustion?",
    "options": {
      "A": "Oxygen and hydrogen",
      "B": "Carbon dioxide and water vapour",
      "C": "Carbon and oxygen",
      "D": "Water and nitrogen"
    },
    "answer": "B"
  },
  {
    "id": 33,
    "question": "Burning of a candle is considered irreversible because:",
    "options": {
      "A": "Wax becomes solid",
      "B": "Melted wax can never be obtained",
      "C": "Burnt materials cannot be recovered in their original form by a simple method",
      "D": "Candle changes its shape"
    },
    "answer": "C"
  },
  {
    "id": 34,
    "question": "When vinegar reacts with baking soda, which gas is produced?",
    "options": {
      "A": "Oxygen",
      "B": "Nitrogen",
      "C": "Carbon dioxide",
      "D": "Hydrogen"
    },
    "answer": "C"
  },
  {
    "id": 35,
    "question": "Which observation can occur during the reaction between vinegar and baking soda?",
    "options": {
      "A": "Formation of ice",
      "B": "Evolution of gas with a hissing sound",
      "C": "Formation of sugar crystals",
      "D": "Freezing of vinegar"
    },
    "answer": "B"
  },
  {
    "id": 36,
    "question": "The chemical name of baking soda given in the chapter is:",
    "options": {
      "A": "Sodium carbonate",
      "B": "Sodium hydrogen carbonate",
      "C": "Calcium carbonate",
      "D": "Sodium acetate"
    },
    "answer": "B"
  },
  {
    "id": 37,
    "question": "Which observation provides evidence of a chemical change in the reaction between copper sulphate solution and iron?",
    "options": {
      "A": "Iron nail becomes smaller only",
      "B": "Solution changes colour and copper is deposited",
      "C": "Water evaporates",
      "D": "Iron changes shape"
    },
    "answer": "B"
  },
  {
    "id": 38,
    "question": "In the reaction between copper sulphate solution and iron, the products mentioned are:",
    "options": {
      "A": "Iron oxide and zinc",
      "B": "Iron sulphate and copper",
      "C": "Copper oxide and iron",
      "D": "Copper carbonate and iron oxide"
    },
    "answer": "B"
  },
  {
    "id": 39,
    "question": "Why is the reaction between copper sulphate solution and iron considered chemical?",
    "options": {
      "A": "The iron nail changes shape",
      "B": "The solution is stirred",
      "C": "New substances are formed and the original copper sulphate cannot be recovered by a physical method",
      "D": "Water is present"
    },
    "answer": "C"
  },
  {
    "id": 40,
    "question": "A magnesium ribbon is cleaned with sandpaper before burning mainly as part of the preparation for the experiment. When it burns, it produces:",
    "options": {
      "A": "Magnesium chloride",
      "B": "Magnesium oxide",
      "C": "Magnesium sulphate",
      "D": "Magnesium carbonate"
    },
    "answer": "B"
  },
  {
    "id": 41,
    "question": "The flame produced when magnesium ribbon burns is described as:",
    "options": {
      "A": "Dull yellow",
      "B": "Green",
      "C": "Dazzling white",
      "D": "Blue-black"
    },
    "answer": "C"
  },
  {
    "id": 42,
    "question": "Which observation is associated with burning magnesium ribbon?",
    "options": {
      "A": "A new substance is formed",
      "B": "Magnesium simply changes its shape",
      "C": "Magnesium can immediately be recovered from the ash physically",
      "D": "Only its state changes"
    },
    "answer": "A"
  },
  {
    "id": 43,
    "question": "Which of the following pairs contains one physical and one chemical change, respectively?",
    "options": {
      "A": "Melting wax; burning wax",
      "B": "Rusting iron; melting ice",
      "C": "Digestion; freezing water",
      "D": "Burning wood; tearing paper"
    },
    "answer": "A"
  },
  {
    "id": 44,
    "question": "Crystallisation is defined as:",
    "options": {
      "A": "Melting a solid completely",
      "B": "Formation of large and pure crystals from a saturated solution",
      "C": "Formation of rust on iron",
      "D": "Burning a substance to form ash"
    },
    "answer": "B"
  },
  {
    "id": 45,
    "question": "Crystallisation is classified in the chapter as:",
    "options": {
      "A": "Chemical change",
      "B": "Physical change",
      "C": "Irreversible chemical process",
      "D": "Biological change"
    },
    "answer": "B"
  },
  {
    "id": 46,
    "question": "Which substance is specifically used in the activity to prepare crystals by crystallisation?",
    "options": {
      "A": "Copper sulphate",
      "B": "Iron oxide",
      "C": "Magnesium oxide",
      "D": "Sodium acetate"
    },
    "answer": "A"
  },
  {
    "id": 47,
    "question": "Which sequence correctly represents preparation of copper sulphate crystals?",
    "options": {
      "A": "Heat \u2192 add water \u2192 burn \u2192 filter",
      "B": "Prepare solution \u2192 heat/concentrate \u2192 filter \u2192 cool undisturbed",
      "C": "Freeze \u2192 burn \u2192 filter \u2192 heat",
      "D": "Burn copper sulphate \u2192 dissolve iron \u2192 cool"
    },
    "answer": "B"
  },
  {
    "id": 48,
    "question": "Which statement correctly compares crystallisation and rusting?",
    "options": {
      "A": "Both are chemical changes",
      "B": "Both form new substances",
      "C": "Crystallisation is a physical change, while rusting is a chemical change",
      "D": "Crystallisation is irreversible, while rusting is reversible"
    },
    "answer": "C"
  },
  {
    "id": 49,
    "question": "Which set contains only chemical changes?",
    "options": {
      "A": "Photosynthesis, digestion, rusting",
      "B": "Melting wax, freezing water, condensation",
      "C": "Dissolving sugar, tearing paper, crystallisation",
      "D": "Stretching rubber, melting ice, cutting wood"
    },
    "answer": "A"
  },
  {
    "id": 50,
    "question": "A student makes the following claims:\\nI. Tearing paper is a physical change.\\nII. Rusting of iron is a chemical change.\\nIII. Melting wax is a chemical change.\\nIV. Burning wax is a chemical change.\\nWhich option is correct?",
    "options": {
      "A": "I and II only",
      "B": "II and III only",
      "C": "I, II and IV only",
      "D": "I, III and IV only"
    },
    "answer": "C"
  }
];