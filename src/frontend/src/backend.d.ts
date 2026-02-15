import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface VocabularyItem {
    id: bigint;
    timesIncorrect: bigint;
    tags?: Array<string>;
    word: string;
    translation: string;
    notes?: string;
    timesCorrect: bigint;
    lastSeen?: Time;
}
export interface LanguageSettings {
    sourceLanguage: string;
    targetLanguage: string;
}
export type Time = bigint;
export interface UserProfile {
    practiceCounter: bigint;
    activeLanguage: LanguageSettings;
    vocabulary: Array<VocabularyItem>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addVocabularyItem(word: string, translation: string, notes: string | null, tags: Array<string> | null): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteVocabularyItem(id: bigint): Promise<void>;
    getAllVocabularyItems(): Promise<Array<VocabularyItem>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getItemsDueForReview(): Promise<Array<VocabularyItem>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeUser(sourceLang: string, targetLang: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitPracticeResult(id: bigint, passed: boolean): Promise<void>;
}
