export const LABS = {
  labA: { name: 'A1 Diagnostics', theme: 'blue', dateStyle: 'ddmmyyyy', captcha: false, layout: 'table' },
  labB: { name: 'CityScan Imaging', theme: 'green', dateStyle: 'pretty', captcha: true, layout: 'cards' },
  labC: { name: 'Vitals Labs', theme: 'grey', dateStyle: 'iso', captcha: true, layout: 'list' },
} as const;
export type LabId = keyof typeof LABS;
export function isLab(value: string): value is LabId { return value in LABS; }
export function labRoot(lab: LabId) { return `/${lab}`; }
export function formatDate(value: string, style: string) {
  const [y,m,d] = value.split('-');
  if (style === 'ddmmyyyy') return `${d}-${m}-${y}`;
  if (style === 'pretty') return new Date(`${value}T12:00:00Z`).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'});
  return value;
}
