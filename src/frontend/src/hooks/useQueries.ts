import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Donor, BloodGroup, DonorStatus } from '../backend';
import { toast } from 'sonner';

export function useGetAllDonors() {
  const { actor, isFetching } = useActor();

  return useQuery<Donor[]>({
    queryKey: ['donors', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDonors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDonorsByBloodGroup(bloodGroup: BloodGroup | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Donor[]>({
    queryKey: ['donors', 'bloodGroup', bloodGroup],
    queryFn: async () => {
      if (!actor || !bloodGroup) return [];
      return actor.getDonorsByBloodGroup(bloodGroup);
    },
    enabled: !!actor && !isFetching && !!bloodGroup,
  });
}

export function useGetAllAppointedDonors() {
  const { actor, isFetching } = useActor();

  return useQuery<Donor[]>({
    queryKey: ['donors', 'appointed'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAppointedDonors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllTempRejectedDonors() {
  const { actor, isFetching } = useActor();

  return useQuery<Donor[]>({
    queryKey: ['donors', 'tempRejected'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTempRejectedDonors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllPermanentlyRejectedDonors() {
  const { actor, isFetching } = useActor();

  return useQuery<Donor[]>({
    queryKey: ['donors', 'permanentlyRejected'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPermanentlyRejectedDonors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddDonor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      bloodGroup,
      phoneNumber,
    }: {
      name: string;
      bloodGroup: BloodGroup;
      phoneNumber: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.addDonor(name, bloodGroup, phoneNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donors'] });
    },
  });
}

export function useUpdateDonorStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ donorId, newStatus }: { donorId: bigint; newStatus: DonorStatus }) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.updateDonorStatus(donorId, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donors'] });
    },
  });
}

export function useEditDonor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      bloodGroup,
      phoneNumber,
    }: {
      id: bigint;
      name: string;
      bloodGroup: BloodGroup;
      phoneNumber: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.editDonor(id, name, bloodGroup, phoneNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donors'] });
    },
  });
}

export function useDeleteDonor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (donorId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.deleteDonor(donorId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donors'] });
    },
  });
}

export function useMarkDonorAsDonated() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (donorId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.markDonorAsDonated(donorId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donors'] });
    },
  });
}

export function useMarkDonorAsNotDonated() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (donorId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.markDonorAsNotDonated(donorId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donors'] });
    },
  });
}

export function useRecordCall() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (donorId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.recordCall(donorId);
    },
    onSuccess: () => {
      // Invalidate all donor queries to ensure immediate refresh across all sections
      queryClient.invalidateQueries({ queryKey: ['donors'] });
    },
    onError: (error) => {
      toast.error('Failed to record call', {
        description: error instanceof Error ? error.message : 'An error occurred',
      });
    },
  });
}
