import json
import re

raw_text = """
1. The human excretory system is composed of a pair of kidneys and:
a) Heart, liver, lungs b) Ureter, urethra, urinary bladder c) Stomach, intestine, pancreas d) Trachea, esophagus, larynx

2. The shape of the kidneys is:
a) Round b) Bean-shaped c) Tube-shaped d) Star-shaped

3. Kidneys function essentially like:
a) Pumps b) Filters c) Storage tanks d) Valves

4. The tube-like structure connecting the kidney to the urinary bladder is the:
a) Urethra b) Ureter c) Aorta d) Trachea

5. The waste-laden liquid content of the ureter is called:
a) Sweat b) Urine c) Plasma d) Lymph

6. As per the text, urine is approximately composed of:
a) 50% water, 50% urea b) 95% water, 2–2.5% urea, rest other wastes c) 100% urea d) 75% water, 25% salts

7. Urine leaves the body through the:
a) Ureter b) Urethra c) Urinary bladder wall directly d) Kidney directly

8. An adult excretes approximately how much urine per day, as per the text?
a) 0.5–1 litre b) 1–1.5 litres c) 3–4 litres d) 5 litres

9. A condition in which the kidneys stop filtering blood properly is called:
a) Hemophilia b) Renal failure c) Dialysis d) Transpiration

10. Artificial filtering of blood to compensate for malfunctioning kidneys is called:
a) Transplant b) Dialysis c) Transpiration d) Translocation

11. Replacing a diseased kidney with a healthy, closely matched donor kidney is called:
a) Dialysis b) Kidney transplant c) Renal failure d) Excretion

12. Apart from urine, another route through which the body excretes wastes is:
a) Sweat glands in the skin b) The stomach lining c) The brain d) The heart

13. Sweat mainly removes from the body:
a) Fats and proteins b) Water and dissolved salts c) Hemoglobin d) Glucose only

14. White patches sometimes seen on clothes in summer are caused by:
a) Dust b) Dissolved salts left behind after sweat evaporates c) Soap residue d) Sunlight bleaching

15. Besides removing waste, sweating also helps to:
a) Raise body temperature b) Cool the body c) Increase blood pressure d) Produce hormones

16. Nitrogenous wastes are mainly produced from the digestion of:
a) Carbohydrates b) Fats c) Proteins d) Vitamins

17. The three forms of nitrogenous waste mentioned in the text are ammonia, urea, and:
a) Uric acid b) Creatinine c) Bile d) Lactic acid

18. Animals that excrete nitrogenous waste directly as ammonia are called:
a) Ureotelic b) Ammonotelic c) Uricotelic d) Hemotelic

19. Ammonotelic animals need large amounts of water to excrete waste mainly because:
a) Ammonia is toxic and needs to be diluted/dissolved in water b) Ammonia is solid c) Ammonia needs sunlight to break down d) Ammonia does not dissolve in water

20. Fish and frogs, being aquatic, are classified as:
a) Ureotelic b) Uricotelic c) Ammonotelic d) None of these

21. Humans and other mammals mainly excrete nitrogenous waste as:
a) Ammonia b) Urea c) Uric acid d) Creatine

22. Animals that excrete urea as their main nitrogenous waste are called:
a) Ammonotelic b) Ureotelic c) Uricotelic d) Osmotelic

23. Compared with ammonia excretion, excreting urea requires:
a) More water b) Less water c) No water at all d) The same amount of water

24. Reptiles like lizards and snakes, and birds, mainly excrete nitrogenous waste as:
a) Ammonia b) Urea c) Uric acid d) Carbon dioxide

25. Animals that excrete uric acid as their main nitrogenous waste are called:
a) Ammonotelic b) Ureotelic c) Uricotelic d) Hemotelic

26. Uric acid is excreted in semisolid form by reptiles and birds mainly because this:
a) Saves energy b) Conserves water c) Speeds up digestion d) Increases water loss

27. Which excretion pattern requires the least amount of water overall?
a) Ammonotelic b) Ureotelic c) Uricotelic d) All require equal water

28. The excretory system works together with all of the following systems EXCEPT:
a) Respiratory system b) Endocrine system c) Digestive system d) Skeletal system

29. The respiratory system assists excretion by removing:
a) Urea and salts b) Carbon dioxide and water vapour c) Bile and uric acid d) Sweat and hormones

30. Plants prepare their own food through the process of:
a) Respiration b) Photosynthesis c) Transpiration d) Translocation

31. According to the text, transport in plants occurs at how many levels?
a) 2 b) 3 c) 4 d) 5

32. The first level of plant transport (cell-to-cell movement of solutes and ions) mainly occurs through:
a) Transpiration and translocation b) Diffusion and osmosis c) Root pressure and capillary action d) Photosynthesis and respiration

33. In osmosis, water moves from a region of:
a) Low solute concentration to high solute concentration b) High solute concentration to low solute concentration c) High to low water potential only in roots d) Water does not move based on concentration

34. Diffusion is the movement of particles from a region of:
a) Lower concentration to higher concentration b) Higher concentration to lower concentration c) Root to leaf only d) Leaf to root only

35. Root hairs improve water and nutrient absorption mainly by:
a) Producing more chlorophyll b) Increasing the surface area of the root c) Storing more starch d) Thickening the root cortex

36. The third level of plant transport — moving water and nutrients up to the highest point of a tall tree — is made possible mainly by:
a) Capillary tubes in the stem alone b) Transpiration pull c) Gravity d) Chlorophyll pigments

37. The two main vascular tissues found in plants are:
a) Cortex and epidermis b) Xylem and phloem c) Stomata and lenticels d) Root hair and root cap

38. Xylem is mainly responsible for transporting:
a) Food from leaves to other parts b) Water and dissolved minerals c) Oxygen only d) Hormones

39. Transport of substances through xylem is:
a) Bidirectional b) Unidirectional, from root to leaf c) Random d) Unidirectional, from leaf to root

40. Phloem transport is described as bidirectional because it:
a) Only carries water upward b) Carries food to different plant parts in more than one direction c) Carries only gases d) Moves only during the night

41. Phloem mainly transports:
a) Water and minerals b) Food materials c) Oxygen and carbon dioxide d) Nitrogenous wastes

42. The small pores on the surface of leaves through which water vapour escapes are called:
a) Lenticels b) Stomata c) Root hairs d) Xylem vessels

43. The loss of water vapour from plant surfaces, mainly through leaves, is called:
a) Translocation b) Transpiration c) Osmosis d) Dialysis

44. Transpiration creates a pull within the xylem tissue known as:
a) Root pressure b) Transpiration pull c) Capillary force d) Osmotic pressure

45. The suction effect that transpiration pull produces on the xylem water column is compared in the text to:
a) Blood flowing through arteries b) Sucking water or a cold drink through a straw c) A pump forcing water upward d) Rainwater seeping into soil

46. Transpiration in plants tends to stop during:
a) Midday b) The night c) Early morning d) Rainy afternoons

47. The fluid containing water and dissolved nutrients that moves through xylem is called sap, and its movement is termed:
a) Ascent of sap b) Exudation c) Secretion d) Circulation

48. The transport of prepared food from the leaves to other parts of the plant via phloem is called:
a) Transpiration b) Translocation c) Ascent of sap d) Diffusion

49. Which of the following is NOT one of the ways plants carry out excretion, according to the text?
a) Releasing gaseous wastes through stomata and lenticels b) Shedding leaves and bark that have accumulated wastes c) Filtering waste through a specialised excretory organ d) Storing harmless waste as solids like resins, gums, and latex

50. According to the "Fast Fact," a plant with many roots survives drought better than one with few roots mainly because more roots provide:
a) Greater photosynthetic area b) Greater absorptive capacity for water c) Stronger stems d) More chlorophyll production
"""

ans_key_raw = "1-b, 2-b, 3-b, 4-b, 5-b, 6-b, 7-b, 8-b, 9-b, 10-b, 11-b, 12-a, 13-b, 14-b, 15-b, 16-c, 17-a, 18-b, 19-a, 20-c, 21-b, 22-b, 23-b, 24-c, 25-c, 26-b, 27-c, 28-d, 29-b, 30-b, 31-b, 32-b, 33-a, 34-b, 35-b, 36-b, 37-b, 38-b, 39-b, 40-b, 41-b, 42-b, 43-b, 44-b, 45-b, 46-b, 47-a, 48-b, 49-c, 50-b"

answers = {}
for pair in ans_key_raw.split(','):
    pair = pair.strip()
    if not pair:
        continue
    k, v = pair.split('-')
    answers[int(k.strip())] = v.strip().upper()

# Pattern to find each question:
# Match number followed by dot
# e.g., "1. The human..." up to next number or end
pattern = re.compile(r'(?:^|\n)\s*(\d+)\.\s*(.*?)(?=(?:\n\s*\d+\.|\Z))', re.DOTALL)

matches = pattern.findall(raw_text)
print(f"Total matched questions: {len(matches)}")

questions = []
for num_str, content in matches:
    qid = int(num_str)
    content = content.strip()
    
    # Split question text and options
    # The options start with a) or A)
    # Regex to extract question and options
    opt_match = re.search(r'a\)\s*(.*?)\s*b\)\s*(.*?)\s*c\)\s*(.*?)\s*d\)\s*(.*)', content, re.DOTALL)
    if not opt_match:
        print(f"Error parsing options for Q{qid}: {content}")
        continue
    
    # Question text is everything before a)
    q_text = content[:opt_match.start()].strip()
    # clean up newlines in question text
    q_text = " ".join(q_text.split())
    
    opt_a = " ".join(opt_match.group(1).strip().split())
    opt_b = " ".join(opt_match.group(2).strip().split())
    opt_c = " ".join(opt_match.group(3).strip().split())
    opt_d = " ".join(opt_match.group(4).strip().split())
    
    questions.append({
        "id": qid,
        "question": q_text,
        "options": {
            "A": opt_a,
            "B": opt_b,
            "C": opt_c,
            "D": opt_d
        },
        "answer": answers[qid]
    })

print(f"Parsed {len(questions)} questions successfully.")
assert len(questions) == 50

# Output to questions_transportation2.js
with open("questions_transportation2.js", "w", encoding="utf-8") as f:
    f.write("const questions_transportation2 = " + json.dumps(questions, indent=2, ensure_ascii=False) + ";\n")

print("Wrote questions_transportation2.js successfully!")
