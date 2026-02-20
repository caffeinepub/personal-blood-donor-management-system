import Map "mo:core/Map";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Time "mo:core/Time";
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
  };

  module Donor {
    public func compare(donor1 : Donor, donor2 : Donor) : Order.Order {
      Text.compare(donor1.name, donor2.name);
    };
  };

  let donors = Map.empty<Nat, Donor>();
  var nextId = 0;

  public shared ({ caller }) func addDonor(name : Text, bloodGroup : BloodGroup, phoneNumber : Text) : async {
    #ok : Nat;
    #error : Text;
  } {
    // Input validation
    if (name.size() == 0) {
      return #error("Name cannot be empty");
    };

    // Check if phone number is unique
    let existingDonor = donors.values().find(
      func(donor) {
        donor.phoneNumber == phoneNumber;
      }
    );
    switch (existingDonor) {
      case (?_) { return #error("Phone number already exists") };
      case (null) {};
    };

    let donor : Donor = {
      id = nextId;
      name;
      bloodGroup;
      phoneNumber;
      status = #active;
    };
    donors.add(nextId, donor);
    let currentId = nextId;
    nextId += 1;
    #ok currentId;
  };

  public shared ({ caller }) func updateDonorStatus(donorId : Nat, newStatus : DonorStatus) : async {
    #ok : ();
    #error : Text;
  } {
    let existingDonor = switch (donors.get(donorId)) {
      case (null) { return #error("Donor not found") };
      case (?donor) { donor };
    };

    let updatedDonor : Donor = {
      id = existingDonor.id;
      name = existingDonor.name;
      bloodGroup = existingDonor.bloodGroup;
      phoneNumber = existingDonor.phoneNumber;
      status = newStatus;
    };
    donors.add(donorId, updatedDonor);
    #ok();
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

  public query ({ caller }) func getDonor(id : Nat) : async {
    #ok : Donor;
    #error : Text;
  } {
    switch (donors.get(id)) {
      case (null) { #error("Donor not found") };
      case (?donor) { #ok(donor) };
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
