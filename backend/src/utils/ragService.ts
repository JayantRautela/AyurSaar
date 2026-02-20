import herbs from "../../data/herbs.json" with { type: "json" };
import homeopathy from "../../data/homeopathy.json" with { type: "json" };
import naturopathy from "../../data/naturopathy.json" with { type: "json" };
import siddha from "../../data/siddha.json" with { type: "json" };
import unani from "../../data/unani.json" with { type: "json" };
import symptoms from "../../data/symptoms.json" with { type: "json" };

export const findSymptom = (userQuery: string) => {
  const lowerQuery = userQuery.toLowerCase();

  return symptoms.find(s =>
    lowerQuery.includes(s.symptom.toLowerCase())
  );
};

export const buildContext = (matchedSymptom: any) => {
  if (!matchedSymptom) return null;

  return `
    Symptom: ${matchedSymptom.symptom}

    Ayurveda Herbs: ${matchedSymptom.herbs.join(", ")}
    Yoga: ${matchedSymptom.yoga.join(", ")}
    Diet: ${matchedSymptom.diet.join(", ")}

    Unani: ${matchedSymptom.unani.join(", ")}
    Siddha: ${matchedSymptom.siddha.join(", ")}
    Naturopathy: ${matchedSymptom.naturopathy.join(", ")}
    Homeopathy: ${matchedSymptom.homeopathy.join(", ")}
  `;
};


