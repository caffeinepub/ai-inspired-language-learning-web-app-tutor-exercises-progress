import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type LanguageSettings = {
    sourceLanguage : Text;
    targetLanguage : Text;
  };

  public type VocabularyItem = {
    id : Nat;
    word : Text;
    translation : Text;
    notes : ?Text;
    tags : ?[Text];
    timesCorrect : Nat;
    timesIncorrect : Nat;
    lastSeen : ?Time.Time;
  };

  public type UserProfile = {
    activeLanguage : LanguageSettings;
    vocabulary : [VocabularyItem];
    practiceCounter : Nat;
  };

  module VocabularyItem {
    public func compareByLastSeen(a : VocabularyItem, b : VocabularyItem) : Order.Order {
      switch (a.lastSeen, b.lastSeen) {
        case (?aTime, ?bTime) {
          Nat.compare(Int.abs(aTime).toNat(), Int.abs(bTime).toNat());
        };
        case (?_, null) { #greater };
        case (null, ?_) { #less };
        case (null, null) { #equal };
      };
    };
  };

  let storedUsers = Map.empty<Principal, UserProfile>();

  // Required profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    storedUsers.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    storedUsers.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    storedUsers.add(caller, profile);
  };

  public shared ({ caller }) func initializeUser(sourceLang : Text, targetLang : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can initialize");
    };
    if (storedUsers.containsKey(caller)) {
      Runtime.trap("User already initialized");
    };
    let newUser : UserProfile = {
      activeLanguage = {
        sourceLanguage = sourceLang;
        targetLanguage = targetLang;
      };
      vocabulary = [];
      practiceCounter = 0;
    };
    storedUsers.add(caller, newUser);
  };

  public shared ({ caller }) func addVocabularyItem(word : Text, translation : Text, notes : ?Text, tags : ?[Text]) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add vocabulary");
    };
    let user = storedUsers.get(caller);
    switch (user) {
      case (null) {
        Runtime.trap("User not found");
      };
      case (?profile) {
        let nextId = profile.vocabulary.size();
        let newItem : VocabularyItem = {
          id = nextId;
          word;
          translation;
          notes;
          tags;
          timesCorrect = 0;
          timesIncorrect = 0;
          lastSeen = null;
        };
        let updatedVocab = profile.vocabulary.concat([newItem]);
        let updatedProfile : UserProfile = {
          profile with vocabulary = updatedVocab
        };
        storedUsers.add(caller, updatedProfile);
        nextId;
      };
    };
  };

  public shared ({ caller }) func deleteVocabularyItem(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete vocabulary");
    };
    let user = storedUsers.get(caller);
    switch (user) {
      case (null) {
        Runtime.trap("User not found");
      };
      case (?profile) {
        let filteredVocab = profile.vocabulary.filter(
          func(item) {
            item.id != id;
          }
        );
        let updatedProfile : UserProfile = {
          profile with vocabulary = filteredVocab;
        };
        storedUsers.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getAllVocabularyItems() : async [VocabularyItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view vocabulary");
    };
    let user = storedUsers.get(caller);
    switch (user) {
      case (null) { [] };
      case (?profile) {
        profile.vocabulary;
      };
    };
  };

  public query ({ caller }) func getItemsDueForReview() : async [VocabularyItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view review items");
    };
    let user = storedUsers.get(caller);
    switch (user) {
      case (null) { [] };
      case (?profile) {
        let vocabList = profile.vocabulary;
        vocabList.sort(VocabularyItem.compareByLastSeen);
      };
    };
  };

  public shared ({ caller }) func submitPracticeResult(id : Nat, passed : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit practice results");
    };
    let user = storedUsers.get(caller);
    switch (user) {
      case (null) {
        Runtime.trap("User not found");
      };
      case (?profile) {
        let updatedVocab = profile.vocabulary.map(
          func(item) {
            if (item.id == id) {
              {
                item with
                timesCorrect = if (passed) { item.timesCorrect + 1 } else {
                  item.timesCorrect
                };
                timesIncorrect = if (not passed) {
                  item.timesIncorrect + 1;
                } else { item.timesIncorrect };
                lastSeen = ?Time.now();
              };
            } else { item };
          }
        );
        let updatedProfile : UserProfile = {
          profile with vocabulary = updatedVocab;
        };
        storedUsers.add(caller, updatedProfile);
      };
    };
  };
};
