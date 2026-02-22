import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import VectorDocument from "../models/vector.model.js";
import { createEmbedding } from "../utils/embeddings.js";

import symptoms from "../../data/symptoms.json" with { type: "json" };
import herbs from "../../data/herbs.json" with { type: "json" };
import unani from "../../data/unani.json" with { type: "json" };
import siddha from "../../data/siddha.json" with { type: "json" };
import naturopathy from "../../data/naturopathy.json" with { type: "json" };
import homeopathy from "../../data/homeopathy.json" with { type: "json" };

dotenv.config();

export const indexAllData = async () => {
  await connectDB();

  console.log("Clearing old vectors...");
  await VectorDocument.deleteMany({});

  console.log("Indexing started...");
  for (const s of symptoms as any[]) {
    const content = `
      Symptom: ${s.symptom}

      Ayurveda Herbs: ${s.herbs.join(", ")}
      Yoga: ${s.yoga.join(", ")}
      Diet: ${s.diet.join(", ")}
      Unani: ${s.unani.join(", ")}
      Siddha: ${s.siddha.join(", ")}
      Naturopathy: ${s.naturopathy.join(", ")}
      Homeopathy: ${s.homeopathy.join(", ")}
    `;

    const embedding = await createEmbedding(content);

    await VectorDocument.create({
      content,
      embedding,
      type: "symptom",
      metadata: { name: s.symptom },
    });

    console.log(`Indexed Symptom: ${s.symptom}`);
  }

  for (const h of herbs as any[]) {
    const content = `
      Herb: ${h.name}

      Benefits: ${h.benefits.join(", ")}
      Used For: ${h.used_for.join(", ")}
      Preparation: ${h.preparation}
      Safety: ${h.safety}
    `;

    const embedding = await createEmbedding(content);

    await VectorDocument.create({
      content,
      embedding,
      type: "herb",
      metadata: { name: h.name },
    });

    console.log(`Indexed Herb: ${h.name}`);
  }

  for (const u of unani as any[]) {
    const content = `
      Unani Medicine: ${u.name}

      Primary Uses: ${u.primary_uses.join(", ")}
      Ingredients: ${u.key_ingredients.join(", ")}
      Administration: ${u.administration}
    `;

    const embedding = await createEmbedding(content);

    await VectorDocument.create({
      content,
      embedding,
      type: "unani",
      metadata: { name: u.name },
    });

    console.log(`Indexed Unani: ${u.name}`);
  }

  for (const s of siddha as any[]) {
    const content = `
      Siddha Medicine: ${s.name}

      Primary Uses: ${s.primary_uses.join(", ")}
      Ingredients: ${s.key_ingredients.join(", ")}
      Administration: ${s.administration}
    `;

    const embedding = await createEmbedding(content);

    await VectorDocument.create({
      content,
      embedding,
      type: "siddha",
      metadata: { name: s.name },
    });

    console.log(`Indexed Siddha: ${s.name}`);
  }

  for (const n of naturopathy as any[]) {
    const content = `
      Naturopathy Therapy: ${n.therapy_name}

      Category: ${n.element_category}
      Description: ${n.description}
      Treats: ${n.treats_symptoms.join(", ")}
      Contraindications: ${n.contraindications}
    `;

    const embedding = await createEmbedding(content);

    await VectorDocument.create({
      content,
      embedding,
      type: "naturopathy",
      metadata: { name: n.therapy_name },
    });

    console.log(`Indexed Naturopathy: ${n.therapy_name}`);
  }

  for (const h of homeopathy as any[]) {
    const content = `
      Homeopathy Remedy: ${h.name}

      Primary Uses: ${h.primary_uses.join(", ")}
      Ingredients: ${h.key_ingredients.join(", ")}
      Administration: ${h.administration}
    `;

    const embedding = await createEmbedding(content);

    await VectorDocument.create({
      content,
      embedding,
      type: "homeopathy",
      metadata: { name: h.name },
    });

    console.log(`Indexed Homeopathy: ${h.name}`);
  }

  console.log("All datasets indexed successfully.");
  process.exit(0);
};

indexAllData();
