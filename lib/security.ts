import { createHmac, timingSafeEqual, randomInt } from 'node:crypto';
import { cookies } from 'next/headers';
import { LabId, isLab } from './labs';
const SESSION_SECONDS = 60 * 60 * 8;
const secret = () => { const s=process.env.SESSION_SECRET; if (!s || s.length < 32) throw new Error('SESSION_SECRET must be set to a random value of at least 32 characters.'); return s; };
function sign(value: string) { return createHmac('sha256', secret()).update(value).digest('base64url'); }
function encode(payload: object) { const body=Buffer.from(JSON.stringify(payload)).toString('base64url'); return `${body}.${sign(body)}`; }
function decode<T>(token?: string): T | null { if(!token) return null; const [body,mac,...rest]=token.split('.'); if(!body||!mac||rest.length) return null; const expected=Buffer.from(sign(body)); const actual=Buffer.from(mac); if(expected.length!==actual.length||!timingSafeEqual(expected,actual)) return null; try{return JSON.parse(Buffer.from(body,'base64url').toString('utf8')) as T;}catch{return null;} }
export type Session = { patientId: string; lab: LabId; exp: number; count?: number };
export function setSession(patientId: string, lab: LabId, count=0) { cookies().set(`demo_session_${lab}`, encode({patientId,lab,exp:Math.floor(Date.now()/1000)+SESSION_SECONDS,count} satisfies Session), {httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:SESSION_SECONDS}); }
export function getSession(lab: LabId): Session | null { const s=decode<Session>(cookies().get(`demo_session_${lab}`)?.value); if(!s||s.lab!==lab||s.exp<=Math.floor(Date.now()/1000)||!isLab(s.lab)) return null; return s; }
export function clearSession(lab: LabId) { cookies().delete(`demo_session_${lab}`); cookies().delete(`demo_captcha_${lab}`); }
export function setChallenge(lab: LabId, answer: string) { cookies().set(`demo_captcha_${lab}`, encode({lab,answer:answer.toUpperCase(),exp:Math.floor(Date.now()/1000)+300}), {httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:300}); }
export function checkChallenge(lab: LabId, answer: string) { const c=decode<{lab:LabId;answer:string;exp:number}>(cookies().get(`demo_captcha_${lab}`)?.value); return !!c&&c.lab===lab&&c.exp>Date.now()/1000&&c.answer===answer.trim().toUpperCase(); }
export function clearChallenge(lab: LabId) { cookies().delete(`demo_captcha_${lab}`); }
export type PendingLogin = { patientId: string; lab: LabId; exp: number };
export function setPendingLogin(patientId: string, lab: LabId) { cookies().set(`demo_pending_${lab}`, encode({patientId,lab,exp:Date.now()+5*60*1000} satisfies PendingLogin), {httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:300}); }
export function getPendingLogin(lab: LabId): PendingLogin | null { const p=decode<PendingLogin>(cookies().get(`demo_pending_${lab}`)?.value); return p&&p.lab===lab&&p.exp>Date.now()?p:null; }
export function clearPendingLogin(lab: LabId) { cookies().delete(`demo_pending_${lab}`); }
export function makeChallenge(lab: LabId): {answer:string;svg:string} {
  if(process.env.DEMO_CAPTCHA_FIXED==='true') { const answer=lab==='labB'?'DEMO1':'12'; return {answer,svg:lab==='labB'?textSvg(answer):mathSvg('7 + 5')}; }
  if(lab==='labB') { const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let answer=''; for(let i=0;i<5;i++) answer+=chars[randomInt(chars.length)]; return {answer,svg:textSvg(answer)}; }
  const a=randomInt(2,10), b=randomInt(2,10); return {answer:String(a+b),svg:mathSvg(`${a} + ${b}`)};
}
function textSvg(text:string) { const letters=[...text].map((c,i)=>`<text x="${22+i*29}" y="42" transform="rotate(${randomInt(-18,19)} ${22+i*29} 32)" font-size="25" font-family="monospace" font-weight="bold" fill="#${randomInt(0x222222,0x777777).toString(16)}">${c}</text>`).join(''); return `<svg xmlns="http://www.w3.org/2000/svg" width="170" height="58" viewBox="0 0 170 58"><rect width="170" height="58" rx="6" fill="#f0f3f5"/><path d="M0 12L170 45M0 44L170 8M20 0L130 58" stroke="#aab4bd" stroke-width="1.4"/>${letters}</svg>`; }
function mathSvg(text:string) { return `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="58" viewBox="0 0 180 58"><rect width="180" height="58" rx="6" fill="#f0f0f0"/><text x="90" y="38" text-anchor="middle" font-size="26" font-family="monospace" fill="#333">${text}</text></svg>`; }
