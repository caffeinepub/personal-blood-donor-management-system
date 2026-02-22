import Map "mo:core/Map";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";



actor {
  public type BloodGroup = {
    #A_pos;
    #A_neg;
    #B_pos;
    #B_neg;
    #AB_pos;
    #AB_neg;
    #O_pos;
    #O_neg;
  };

  public type DonorStatus = {
    #active;
    #appointed : {
      appointmentDate : Time.Time;
      patientName : Text;
    };
    #temporarilyRejected : { availableDate : Time.Time };
    #permanentlyRejected;
  };

  public type Donor = {
    id : Nat;
    name : Text;
    bloodGroup : BloodGroup;
    phoneNumber : Text;
    status : DonorStatus;
    callCount : Int;
    lastCalledDate : ?Int;
  };

  module Donor {
    public func compare(donor1 : Donor, donor2 : Donor) : Order.Order {
      Text.compare(donor1.name, donor2.name);
    };
  };

  let donors = Map.empty<Nat, Donor>();
  var nextId = 0;

  public shared ({ caller }) func addDonor(name : Text, bloodGroup : BloodGroup, phoneNumber : Text) : async Nat {
    // Input validation
    if (name.size() == 0) {
      Runtime.trap("Name cannot be empty");
    };

    // Check if phone number is unique
    let existingDonor = donors.values().find(
      func(donor) {
        donor.phoneNumber == phoneNumber;
      }
    );
    switch (existingDonor) {
      case (?_) { Runtime.trap("Phone number already exists") };
      case (null) {};
    };

    let donor : Donor = {
      id = nextId;
      name;
      bloodGroup;
      phoneNumber;
      status = #active;
      callCount = 0;
      lastCalledDate = null;
    };
    donors.add(nextId, donor);
    let currentId = nextId;
    nextId += 1;
    currentId;
  };

  public shared ({ caller }) func updateDonorStatus(donorId : Nat, newStatus : DonorStatus) : async () {
    let existingDonor = switch (donors.get(donorId)) {
      case (null) { Runtime.trap("Donor not found") };
      case (?donor) { donor };
    };

    let updatedDonor : Donor = {
      id = existingDonor.id;
      name = existingDonor.name;
      bloodGroup = existingDonor.bloodGroup;
      phoneNumber = existingDonor.phoneNumber;
      status = newStatus;
      callCount = existingDonor.callCount;
      lastCalledDate = existingDonor.lastCalledDate;
    };
    donors.add(donorId, updatedDonor);
  };

  // New: Edit donor details
  public shared ({ caller }) func editDonor(id : Nat, newName : Text, newBloodGroup : BloodGroup, newPhoneNumber : Text) : async () {
    if (newName.size() == 0) {
      Runtime.trap("Name cannot be empty");
    };

    let existingDonor = switch (donors.get(id)) {
      case (null) { Runtime.trap("Donor not found") };
      case (?donor) { donor };
    };

    // Check if new phone number is unique (excluding current donor)
    if (existingDonor.phoneNumber != newPhoneNumber) {
      let duplicate = donors.values().find(
        func(donor) { donor.phoneNumber == newPhoneNumber }
      );
      if (duplicate != null) {
        Runtime.trap("Phone number already exists");
      };
    };

    let updatedDonor : Donor = {
      id = existingDonor.id;
      name = newName;
      bloodGroup = newBloodGroup;
      phoneNumber = newPhoneNumber;
      status = existingDonor.status;
      callCount = existingDonor.callCount;
      lastCalledDate = existingDonor.lastCalledDate;
    };
    donors.add(id, updatedDonor);
  };

  // New: Delete donor
  public shared ({ caller }) func deleteDonor(id : Nat) : async () {
    ignore switch (donors.get(id)) {
      case (null) { Runtime.trap("Donor not found") };
      case (_) { true };
    };
    donors.remove(id);
  };

  // New: Mark donor as donated with 3 month cooldown
  public shared ({ caller }) func markDonorAsDonated(donorId : Nat) : async () {
    let existingDonor = switch (donors.get(donorId)) {
      case (null) { Runtime.trap("Donor not found") };
      case (?donor) { donor };
    };

    // Calculate 3 months from now (in nanoseconds, for simulated time)
    let currentTime = Time.now();
    let threeMonthsInNanos = 3 * 30 * 24 * 60 * 60 * 1000000000; // 3 months in ns

    let updatedDonor : Donor = {
      id = existingDonor.id;
      name = existingDonor.name;
      bloodGroup = existingDonor.bloodGroup;
      phoneNumber = existingDonor.phoneNumber;
      status = #temporarilyRejected {
        availableDate = currentTime + threeMonthsInNanos;
      };
      callCount = existingDonor.callCount;
      lastCalledDate = existingDonor.lastCalledDate;
    };
    donors.add(donorId, updatedDonor);
  };

  // New: Mark donor as not donated
  public shared ({ caller }) func markDonorAsNotDonated(donorId : Nat) : async () {
    let existingDonor = switch (donors.get(donorId)) {
      case (null) { Runtime.trap("Donor not found") };
      case (?donor) { donor };
    };

    let updatedDonor : Donor = {
      id = existingDonor.id;
      name = existingDonor.name;
      bloodGroup = existingDonor.bloodGroup;
      phoneNumber = existingDonor.phoneNumber;
      status = #active;
      callCount = existingDonor.callCount;
      lastCalledDate = existingDonor.lastCalledDate;
    };
    donors.add(donorId, updatedDonor);
  };

  // New: Record a call to a donor
  public shared ({ caller }) func recordCall(donorId : Nat) : async () {
    let existingDonor = switch (donors.get(donorId)) {
      case (null) { Runtime.trap("Donor not found") };
      case (?donor) { donor };
    };

    let updatedDonor : Donor = {
      id = existingDonor.id;
      name = existingDonor.name;
      bloodGroup = existingDonor.bloodGroup;
      phoneNumber = existingDonor.phoneNumber;
      status = existingDonor.status;
      callCount = existingDonor.callCount + 1;
      lastCalledDate = ?Time.now();
    };
    donors.add(donorId, updatedDonor);
  };

  public query ({ caller }) func getAllDonors() : async [Donor] {
    donors.values().toArray().sort();
  };

  public query ({ caller }) func getDonorsByBloodGroup(bloodGroup : BloodGroup) : async [Donor] {
    let filtered = donors.values().filter(
      func(donor) {
        donor.bloodGroup == bloodGroup and (
          switch (donor.status) {
            case (#active) { true };
            case (#appointed _) { true };
            case (_) { false };
          }
        )
      }
    );
    filtered.toArray();
  };

  public query ({ caller }) func getDonor(id : Nat) : async Donor {
    switch (donors.get(id)) {
      case (null) { Runtime.trap("Donor not found") };
      case (?donor) { donor };
    };
  };

  public query ({ caller }) func getAllAppointedDonors() : async [Donor] {
    let appointedDonors = donors.values().filter(
      func(donor) {
        switch (donor.status) {
          case (#appointed _) { true };
          case (_) { false };
        }
      }
    );
    appointedDonors.toArray();
  };

  public query ({ caller }) func getAllTempRejectedDonors() : async [Donor] {
    let tempRejectedDonors = donors.values().filter(
      func(donor) {
        switch (donor.status) {
          case (#temporarilyRejected _) { true };
          case (_) { false };
        }
      }
    );
    tempRejectedDonors.toArray();
  };

  public query ({ caller }) func getAllPermanentlyRejectedDonors() : async [Donor] {
    let permRejectedDonors = donors.values().filter(
      func(donor) {
        switch (donor.status) {
          case (#permanentlyRejected) { true };
          case (_) { false };
        }
      }
    );
    permRejectedDonors.toArray();
  };
};

