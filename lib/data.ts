import fs from 'node:fs';
import path from 'node:path';
import { LabId } from './labs';
export type Patient = { id: string; name: string; age: number; sex: string; usernames: Record<string,string>; password: string };
export type Report = { report_id: string; title: string; portal_date: string; filename: string };
const dataDir = path.join(process.cwd(), 'data');
function readJson<T>(name: string): T {
  const file = path.join(dataDir, name);
  if (!fs.existsSync(file)) throw new Error(`Missing ${file}. Copy the supplied data/ folder into the project root.`);
  return JSON.parse(fs.readFileSync(file, 'utf8')) as T;
}
export function patients(): Patient[] { return readJson<Patient[]>('patients.json'); }
export function reportsFor(lab: LabId, patientId: string): Report[] {
  const all = readJson<Record<string,Record<string,Report[]>>>('portal_reports.json');
  return [...(all[lab]?.[patientId] ?? [])].sort((a,b)=>b.portal_date.localeCompare(a.portal_date));
}
export function reportBytesPath(lab: LabId, patientId: string, filename: string) {
  return path.join(dataDir, 'pdfs', lab, patientId, filename);
}
