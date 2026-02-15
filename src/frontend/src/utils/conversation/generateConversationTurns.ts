import { VocabularyItem } from '@/backend';

export interface ConversationTurn {
  partnerPrompt: string;
  acceptableReplies: string[];
  vocabularyItemId: bigint;
}

export function generateConversationTurn(vocabulary: VocabularyItem[], turnIndex: number): ConversationTurn {
  const sortedVocab = [...vocabulary].sort((a, b) => {
    const aId = Number(a.id);
    const bId = Number(b.id);
    return aId - bId;
  });

  const itemIndex = turnIndex % sortedVocab.length;
  const item = sortedVocab[itemIndex];

  const promptTemplates = [
    {
      prompt: `How do you say "${item.translation}"?`,
      replies: [item.word],
    },
    {
      prompt: `What does "${item.word}" mean?`,
      replies: [item.translation],
    },
    {
      prompt: `Can you translate "${item.translation}" for me?`,
      replies: [item.word],
    },
    {
      prompt: `What is the word for "${item.translation}"?`,
      replies: [item.word],
    },
    {
      prompt: `Tell me what "${item.word}" means.`,
      replies: [item.translation],
    },
  ];

  const templateIndex = Math.floor(turnIndex / sortedVocab.length) % promptTemplates.length;
  const selectedTemplate = promptTemplates[templateIndex];

  const acceptableReplies = [...selectedTemplate.replies];

  if (item.notes) {
    const notesLower = item.notes.toLowerCase();
    if (notesLower.includes('also:') || notesLower.includes('or:') || notesLower.includes('alternative:')) {
      const alternativeMatch = item.notes.match(/(?:also|or|alternative):\s*([^,.\n]+)/i);
      if (alternativeMatch) {
        acceptableReplies.push(alternativeMatch[1].trim());
      }
    }
  }

  return {
    partnerPrompt: selectedTemplate.prompt,
    acceptableReplies,
    vocabularyItemId: item.id,
  };
}
