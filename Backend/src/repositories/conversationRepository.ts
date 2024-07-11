import Conversation, { ConversationDocument } from "../models/conversationModel";

import { conversation, ConversationModel } from '../models/convoLists';

class ConversationRepository {
  async findOneByMember(memberId: string): Promise<ConversationDocument | null> {
    return Conversation.findOne({ members: memberId });
  }

  async create(members: string[]): Promise<ConversationDocument> {
    return Conversation.create({ members });
  }

  async getActiveConversations(): Promise<conversation[]> {
    return ConversationModel.find().exec();
  }

  async saveActiveConversation(conversation: conversation): Promise<conversation> {
    const newConversation = new ConversationModel(conversation);
    return newConversation.save();
  }
}

export const conversationRepo = new ConversationRepository();
