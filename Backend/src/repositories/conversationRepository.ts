import Conversation, { ConversationDocument } from "../models/conversationModel";

class ConversationRepository {
  async findOneByMember(memberId: string): Promise<ConversationDocument | null> {
    return Conversation.findOne({ members: memberId });
  }

  async create(members: string[]): Promise<ConversationDocument> {
    return Conversation.create({ members });
  }
}

export const conversationRepo = new ConversationRepository();
