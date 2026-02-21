import symptoms from "../../data/symptoms.json" with { type: "json" };

export const classifySymptom = async (query: string): Promise<string | null> => {
  const lower = query.toLowerCase();
  const match = symptoms.find((s: any) =>
    lower.includes(s.symptom.toLowerCase())
  );
  console.log(match)
  return match ? match.symptom : null;
};

export const buildContext = (symptomName: string) => {
  const match: any = symptoms.find(
    (s: any) => s.symptom === symptomName
  );

  if (!match) return "";

  return `
    Symptom: ${match.symptom}

    Herbs: ${match.herbs.join(", ")}
    Yoga: ${match.yoga.join(", ")}
    Diet: ${match.diet.join(", ")}
    Unani: ${match.unani.join(", ")}
    Siddha: ${match.siddha.join(", ")}
    Naturopathy: ${match.naturopathy.join(", ")}
    Homeopathy: ${match.homeopathy.join(", ")}
  `;
};
