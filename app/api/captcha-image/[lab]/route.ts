import { NextRequest,NextResponse } from 'next/server';
import { isLab,LABS } from '@/lib/labs';
import { makeChallenge,setChallenge } from '@/lib/security';
export async function GET(req:NextRequest,{params}:{params:{lab:string}}){if(!isLab(params.lab)||!LABS[params.lab].captcha)return new NextResponse('Not found',{status:404});const challenge=makeChallenge(params.lab);setChallenge(params.lab,challenge.answer);return new NextResponse(challenge.svg,{headers:{'Content-Type':'image/svg+xml; charset=utf-8','Cache-Control':'no-store, max-age=0','X-Content-Type-Options':'nosniff'}});}
