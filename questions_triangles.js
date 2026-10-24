const questions_triangles = [
  {
    "id": 1,
    "question": "The measures of two angles of a triangle are 35° and 116°. What is the measure of the third angle?",
    "options": {
      "A": "29°",
      "B": "39°",
      "C": "19°",
      "D": "49°"
    },
    "answer": "A",
    "explanation": "The angle sum property of a triangle states that the sum of all three interior angles is always 180°. Therefore, third angle = 180° − (35° + 116°) = 180° − 151° = 29°."
  },
  {
    "id": 2,
    "question": "One of the acute angles of a right triangle is 63°. Find the other acute angle.",
    "options": {
      "A": "17°",
      "B": "27°",
      "C": "37°",
      "D": "63°"
    },
    "answer": "B",
    "explanation": "In a right triangle, one angle is 90°, so the sum of the other two acute angles is 90°. Hence, the other acute angle = 90° − 63° = 27°."
  },
  {
    "id": 3,
    "question": "The three angles of a triangle are equal to one another. What are their measures?",
    "options": {
      "A": "60°, 60°, 60°",
      "B": "45°, 45°, 90°",
      "C": "30°, 60°, 90°",
      "D": "50°, 60°, 70°"
    },
    "answer": "A",
    "explanation": "Let each angle be x. Then x + x + x = 3x = 180° ⇒ x = 60°. An equiangular triangle has all three angles equal to 60° (equilateral triangle)."
  },
  {
    "id": 4,
    "question": "One angle of a triangle is twice the smallest angle, and another angle is three times the smallest angle. Find the three angles.",
    "options": {
      "A": "30°, 60°, 90°",
      "B": "20°, 70°, 90°",
      "C": "45°, 45°, 90°",
      "D": "30°, 75°, 75°"
    },
    "answer": "A",
    "explanation": "Let the smallest angle be x. The three angles are x, 2x, and 3x. Sum of angles = x + 2x + 3x = 6x = 180° ⇒ x = 30°. Therefore, the angles are 30°, 2(30°) = 60°, and 3(30°) = 90°."
  },
  {
    "id": 5,
    "question": "In triangle ABC, if 3∠A = 4∠B = 6∠C, calculate the angles.",
    "options": {
      "A": "∠A = 80°, ∠B = 60°, ∠C = 40°",
      "B": "∠A = 40°, ∠B = 60°, ∠C = 80°",
      "C": "∠A = 60°, ∠B = 80°, ∠C = 40°",
      "D": "∠A = 80°, ∠B = 40°, ∠C = 60°"
    },
    "answer": "A",
    "explanation": "Let 3∠A = 4∠B = 6∠C = k. Then ∠A = k/3, ∠B = k/4, ∠C = k/6. Since ∠A + ∠B + ∠C = 180°, we have k/3 + k/4 + k/6 = 180° ⇒ (4k + 3k + 2k)/12 = 180° ⇒ 9k/12 = 180° ⇒ 3k/4 = 180° ⇒ k = 240°. Thus, ∠A = 240°/3 = 80°, ∠B = 240°/4 = 60°, and ∠C = 240°/6 = 40°."
  },
  {
    "id": 6,
    "question": "Is it possible to have a triangle in which two of the angles are right angles?",
    "options": {
      "A": "Yes, in every triangle",
      "B": "No, because two right angles already sum to 180°",
      "C": "Only if the triangle is equilateral",
      "D": "Only if two sides are equal"
    },
    "answer": "B",
    "explanation": "Two right angles sum to 90° + 90° = 180°. That leaves 0° for the third angle, which is impossible because every triangle must have three angles with positive measures summing to 180°."
  },
  {
    "id": 7,
    "question": "One exterior angle of a triangle is 100°, and its two interior opposite angles are equal. What is the measure of each of these two interior opposite angles?",
    "options": {
      "A": "40°",
      "B": "50°",
      "C": "60°",
      "D": "80°"
    },
    "answer": "B",
    "explanation": "By the Exterior Angle Property, exterior angle = sum of interior opposite angles. Let each interior opposite angle be x. Then x + x = 100° ⇒ 2x = 100° ⇒ x = 50°."
  },
  {
    "id": 8,
    "question": "One exterior angle of a triangle is 130°, and the two interior opposite angles are in the ratio 2 : 3. Find the three interior angles of the triangle.",
    "options": {
      "A": "50°, 52°, 78°",
      "B": "50°, 65°, 65°",
      "C": "40°, 60°, 80°",
      "D": "30°, 50°, 100°"
    },
    "answer": "A",
    "explanation": "The sum of the two interior opposite angles equals the exterior angle (130°). In ratio 2 : 3, let the angles be 2x and 3x: 2x + 3x = 5x = 130° ⇒ x = 26°. The two opposite angles are 2(26°) = 52° and 3(26°) = 78°. The third interior angle = 180° − 130° = 50°. Thus, the three interior angles are 50°, 52°, and 78°."
  },
  {
    "id": 9,
    "question": "Find the lettered angle x in the figure.",
    "image": "images/q9_triangle_exterior.svg",
    "options": {
      "A": "40°",
      "B": "50°",
      "C": "70°",
      "D": "100°"
    },
    "answer": "A",
    "explanation": "By the Exterior Angle Property, exterior angle ∠EBA = ∠BAC + ∠ACB. Hence, 70° = x + 30° ⇒ x = 70° − 30° = 40°."
  },
  {
    "id": 10,
    "question": "Find the lettered angle x in the figure.",
    "image": "images/q10_isosceles_equal_angles.svg",
    "options": {
      "A": "50°",
      "B": "65°",
      "C": "80°",
      "D": "100°"
    },
    "answer": "C",
    "explanation": "In △ABC, sides AB and AC are marked with identical tick marks, showing AB = AC. In an isosceles triangle, angles opposite to equal sides are equal: ∠ACB = ∠ABC = 80°. Therefore, x = 80°."
  },
  {
    "id": 11,
    "question": "Find the lettered angle x in the figure.",
    "image": "images/q11_isosceles_vertex_angle.svg",
    "options": {
      "A": "35°",
      "B": "50°",
      "C": "65°",
      "D": "70°"
    },
    "answer": "B",
    "explanation": "Sides AB and AC are equal (AB = AC), so base angles opposite them are equal: ∠ACB = ∠ABC = 65°. In △ABC, ∠BAC + ∠ABC + ∠ACB = 180° ⇒ x + 65° + 65° = 180° ⇒ x + 130° = 180° ⇒ x = 50°."
  },
  {
    "id": 12,
    "question": "Find the lettered angle x in the figure.",
    "image": "images/q12_triangle_rotated.svg",
    "options": {
      "A": "40°",
      "B": "50°",
      "C": "80°",
      "D": "100°"
    },
    "answer": "B",
    "explanation": "Sides BA and AC are marked equal (BA = AC). The vertex between them is A, with ∠BAC = 80°. The angles opposite the equal sides are equal: ∠ABC = ∠BCA = x. Sum of angles = 80° + x + x = 180° ⇒ 2x = 100° ⇒ x = 50°."
  },
  {
    "id": 13,
    "question": "Find the missing side x in the figure.",
    "image": "images/q13_triangle_equal_angles_side.svg",
    "options": {
      "A": "6",
      "B": "5",
      "C": "10",
      "D": "12"
    },
    "answer": "A",
    "explanation": "In △ABC, ∠ABC = 55° and ∠ACB = 55°. In any triangle, sides opposite to equal angles are equal. Since ∠ABC = ∠ACB, side AC = side AB. With AB = 6, it follows that x = AC = 6."
  },
  {
    "id": 14,
    "question": "Find the area of the shaded square in the figure.",
    "image": "images/q14_pythagoras_squares.svg",
    "options": {
      "A": "28 cm²",
      "B": "64 cm²",
      "C": "100 cm²",
      "D": "36 cm²"
    },
    "answer": "C",
    "explanation": "By Pythagoras Theorem, the area of the square constructed on the hypotenuse of a right triangle equals the sum of the areas of the squares constructed on the two perpendicular sides: Area = 36 cm² + 64 cm² = 100 cm²."
  },
  {
    "id": 15,
    "question": "Three squares have areas 27 cm², 12 cm² and 15 cm². Will they exactly surround a right-angled triangle?",
    "options": {
      "A": "No, because 27 is greater than 12 + 15",
      "B": "Yes, because 27 = 12 + 15",
      "C": "Yes, because 27 = 12 × 15",
      "D": "No, because 27 is less than 12 + 15"
    },
    "answer": "B",
    "explanation": "By Pythagoras Theorem, three squares constructed on the sides of a right triangle satisfy: (Area on hypotenuse) = (Area on leg 1) + (Area on leg 2). Since 12 + 15 = 27 cm², the condition is satisfied exactly."
  },
  {
    "id": 16,
    "question": "Which equation can be used to find the missing length x in the figure?",
    "image": "images/q16_pythagoras_equation.svg",
    "options": {
      "A": "x² = 4² + 7²",
      "B": "x² = 7² − 4²",
      "C": "7² = x² + 4²",
      "D": "4² = x² + 7²"
    },
    "answer": "A",
    "explanation": "In a right-angled triangle, Pythagoras Theorem states that (Hypotenuse)² = (Perpendicular)² + (Base)². Here, the side opposite the right angle is x, and the two legs are 4 and 7. Thus, x² = 4² + 7²."
  },
  {
    "id": 17,
    "question": "A rectangular garden measures 24 m by 32 m. A diagonal walk is constructed from one corner to the opposite corner. What is the length of the walk?",
    "options": {
      "A": "36 m",
      "B": "40 m",
      "C": "44 m",
      "D": "56 m"
    },
    "answer": "B",
    "explanation": "The diagonal forms the hypotenuse of a right-angled triangle with sides 24 m and 32 m. By Pythagoras Theorem: Diagonal² = 24² + 32² = 576 + 1024 = 1600. Therefore, Diagonal = √1600 = 40 m."
  },
  {
    "id": 18,
    "question": "Determine whether a triangle with side lengths 10, 22 and 26 is a right-angled triangle.",
    "options": {
      "A": "Yes, because 10² + 22² = 26²",
      "B": "No, because 10² + 22² ≠ 26²",
      "C": "Yes, because 10 + 22 = 26",
      "D": "No, because 10² + 26² = 22²"
    },
    "answer": "B",
    "explanation": "For a right-angled triangle, the sum of squares of the two smaller sides must equal the square of the largest side. 10² + 22² = 100 + 484 = 584, while 26² = 676. Since 584 ≠ 676, 10² + 22² ≠ 26², so the triangle is not right-angled."
  },
  {
    "id": 19,
    "question": "Can triangle ABC be formed if AB = 7 cm, BC = 3 cm and AC = 8 cm?",
    "options": {
      "A": "Yes, because 7 + 3 > 8",
      "B": "No, because 7 + 3 < 8",
      "C": "No, because 7 + 3 = 8",
      "D": "Yes, because 7 + 3 = 8"
    },
    "answer": "A",
    "explanation": "By the Triangle Inequality Theorem, the sum of lengths of any two sides must be strictly greater than the third side: 7 + 3 = 10 > 8, 7 + 8 = 15 > 3, and 3 + 8 = 11 > 7. Because 7 + 3 > 8, the triangle can be formed."
  },
  {
    "id": 20,
    "question": "Can triangle XYZ be formed if XY = 5 cm, YZ = 12 cm and XZ = 7 cm?",
    "options": {
      "A": "Yes, because 5 + 7 > 12",
      "B": "No, because 5 + 7 = 12",
      "C": "No, because 5 + 7 < 12",
      "D": "Yes, because all three side lengths are different"
    },
    "answer": "B",
    "explanation": "According to the Triangle Inequality Theorem, the sum of lengths of any two sides must be strictly greater than the third side. Here, XY + XZ = 5 + 7 = 12 = YZ. Since the sum is equal to (not strictly greater than) the third side, points X, Y, and Z lie on a straight line, and no triangle can be formed."
  }
];
