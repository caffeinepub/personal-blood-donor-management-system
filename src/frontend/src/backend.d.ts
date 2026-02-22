import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type DonorStatus = {
    __kind__: "active";
    active: null;
} | {
    __kind__: "permanentlyRejected";
    permanentlyRejected: null;
} | {
    __kind__: "appointed";
    appointed: {
        appointmentDate: Time;
        patientName: string;
    };
} | {
    __kind__: "temporarilyRejected";
    temporarilyRejected: {
        availableDate: Time;
    };
};
export interface Donor {
    id: bigint;
    status: DonorStatus;
    name: string;
    lastCalledDate?: bigint;
    bloodGroup: BloodGroup;
    phoneNumber: string;
    callCount: bigint;
}
export type Time = bigint;
export enum BloodGroup {
    AB_neg = "AB_neg",
    AB_pos = "AB_pos",
    B_neg = "B_neg",
    B_pos = "B_pos",
    A_neg = "A_neg",
    A_pos = "A_pos",
    O_neg = "O_neg",
    O_pos = "O_pos"
}
export interface backendInterface {
    addDonor(name: string, bloodGroup: BloodGroup, phoneNumber: string): Promise<bigint>;
    deleteDonor(id: bigint): Promise<void>;
    editDonor(id: bigint, newName: string, newBloodGroup: BloodGroup, newPhoneNumber: string): Promise<void>;
    getAllAppointedDonors(): Promise<Array<Donor>>;
    getAllDonors(): Promise<Array<Donor>>;
    getAllPermanentlyRejectedDonors(): Promise<Array<Donor>>;
    getAllTempRejectedDonors(): Promise<Array<Donor>>;
    getDonor(id: bigint): Promise<Donor>;
    getDonorsByBloodGroup(bloodGroup: BloodGroup): Promise<Array<Donor>>;
    markDonorAsDonated(donorId: bigint): Promise<void>;
    markDonorAsNotDonated(donorId: bigint): Promise<void>;
    recordCall(donorId: bigint): Promise<void>;
    updateDonorStatus(donorId: bigint, newStatus: DonorStatus): Promise<void>;
}
