import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { VocabularyItem, UserProfile } from '@/backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetAllVocabularyItems() {
  const { actor, isFetching } = useActor();

  return useQuery<VocabularyItem[]>({
    queryKey: ['vocabulary'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVocabularyItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddVocabularyItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { word: string; translation: string; notes: string | null; tags: string[] | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addVocabularyItem(params.word, params.translation, params.notes, params.tags);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabulary'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['itemsDue'] });
    },
  });
}

export function useDeleteVocabularyItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteVocabularyItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabulary'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['itemsDue'] });
    },
  });
}

export function useGetItemsDueForReview() {
  const { actor, isFetching } = useActor();

  return useQuery<VocabularyItem[]>({
    queryKey: ['itemsDue'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getItemsDueForReview();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitPracticeResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: bigint; passed: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitPracticeResult(params.id, params.passed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabulary'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['itemsDue'] });
    },
  });
}
