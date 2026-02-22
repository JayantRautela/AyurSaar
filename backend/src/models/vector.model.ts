import mongoose, { Schema, Document } from "mongoose";

export interface IVectorDocument extends Document {
  content: string;
  embedding: number[];
  type: string;       
  metadata: {
    name?: string;
    category?: string;
  };
}

const VectorSchema = new Schema<IVectorDocument>({
  content: { 
    type: String, 
    required: true 
  },
  embedding: { 
    type: [Number], 
    required: true 
  },
  type: { 
    type: String, 
    required: true
  },
  metadata: { 
    type: Schema.Types.Mixed 
  }
}, { timestamps: true });

export default mongoose.model<IVectorDocument>("VectorDocument", VectorSchema, "vector_documents");
