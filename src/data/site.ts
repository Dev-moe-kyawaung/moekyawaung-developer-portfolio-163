import profileData from "./profile.json";
import telemetryData from "./telemetry.json";
import missionsData from "./missions.json";
import synapsesData from "./synapses.json";
import flightLogData from "./flightlog.json";

/* ------------------------------------------------------------------ types */

export interface Profile {
  name: string;
  title: string;
  specialization: string;
  positioning: string;
  callsign: string;
  location: string;
  email: string;
  calendlyUrl: string;
  githubUrl: string;
  githubHandle: string;
  linkedinUrl: string;
  linkedinHandle: string;
  resumeUrl: string;
  portraitUrl: string;
  fallbackPortrait: string;
  trustSignal: string;
  availability: { status: string; type: string; locationPreference: string };
}

export interface Telemetry {
  label: string;
  value: string;
  unit: string;
}

export interface Metric {
  label: string;
  value: string;
}

export interface Mission {
  id: string;
  designation: string;
  name: string;
  domain: string;
  classification: string;
  status: string;
  summary: string;
  failureMode: string;
  countermeasure: string;
  telemetry: Metric[];
  stack: string[];
  playStoreUrl: string;
  githubUrl: string;
  span: "wide" | "std";
}

export interface Branch {
  name: string;
  gain: string;
  cost: string;
}

export interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface Synapse {
  id: string;
  ref: string;
  region: string;
  title: string;
  context: string;
  branches: Branch[];
  pathway: string;
  reason: string;
  synapses: Node[];
  links: [string, string][];
}

export interface LogEntry {
  id: string;
  role: string;
  org: string;
  dates: string;
  kind: "production" | "architecture";
  readouts: string[];
  stack: string[];
}

/* -------------------------------------------------------------- exports */

export const profile: Profile = profileData;
export const telemetry: Telemetry[] = telemetryData.channels;
export const missions: Mission[] = missionsData.missions as Mission[];
export const missionsMeta = { subtitle: missionsData.subtitle };
export const clusters: Synapse[] = synapsesData.clusters as Synapse[];
export const synapsesMeta = {
  subtitle: synapsesData.subtitle,
};
export const flightLog: LogEntry[] = flightLogData.logs as LogEntry[];
export const flightLogMeta = { subtitle: flightLogData.subtitle };
