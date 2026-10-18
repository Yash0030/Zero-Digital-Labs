import { NextRequest,NextResponse } from 'next/server';
import { isLab,LABS } from '@/lib/labs';
import { patients } from '@/lib/data';
import { setSession,setChallenge,makeChallenge,setPendingLogin } from '@/lib/security';
export async function POST(req:NextRequest){const form=await req.formData();const lab=String(form.get('lab')||'');const username=String(form.get('username')||'').trim();const password=String(form.get('password')||'');if(!isLab(lab))return NextResponse.redirect(new URL('/',req.url));const patient=patients().find(p=>p.usernames?.[lab]===username&&p.password===password);if(!patient)return NextResponse.redirect(new URL(`/${lab}/login?error=invalid`,req.url),303);if(LABS[lab].captcha){const challenge=makeChallenge(lab);setChallenge(lab,challenge.answer);setPendingLogin(patient.id,lab);return NextResponse.redirect(new URL(`/${lab}/captcha`,req.url),303);}setSession(patient.id,lab);return NextResponse.redirect(new URL(`/${lab}/reports`,req.url),303);}
