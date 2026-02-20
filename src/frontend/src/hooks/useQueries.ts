import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Donor, BloodGroup, DonorStatus } from '../backend';

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
      const result = await actor.addDonor(name, bloodGroup, phoneNumber);
      
      if (result.__kind__ === 'error') {
        throw new Error(result.error);
      }
      
      return result.ok;
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
      const result = await actor.updateDonorStatus(donorId, newStatus);
      
      if (result.__kind__ === 'error') {
        throw new Error(result.error);
      }
      
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donors'] });
    },
  });
}
