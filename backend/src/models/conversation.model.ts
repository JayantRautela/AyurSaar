import { Types, Schema, model, Document } from "mongoose";
import type { IUser } from "./user.model.js";

export interface IMessage {
  role: "user" | "assistant";
  content: string;
  user?: Types.ObjectId | IUser;
  timestamp: Date;
}

export interface IConversation extends Document {
  conversationId: string;
  messages: IMessage[];
}

const MessageSchema = new Schema<IMessage>({
  role: { 
    type: String, 
    enum: ["user", "assistant"],
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

const ConversationSchema = new Schema<IConversation>({
  conversationId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  messages: {
    type: [MessageSchema],
    default: []
  }
}, { timestamps: true });

const Conversation =  model<IConversation>("Conversation", ConversationSchema);
export default Conversation;
