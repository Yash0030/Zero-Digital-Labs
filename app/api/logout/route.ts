import { NextRequest,NextResponse } from 'next/server';
import { clearSession } from '@/lib/security';
import { isLab } from '@/lib/labs';
export async function POST(req:NextRequest){const form=await req.formData();const lab=String(form.get('lab')||'');if(!isLab(lab))return NextResponse.redirect(new URL('/',req.url));clearSession(lab);const res=NextResponse.redirect(new URL(`/${lab}/login`,req.url),303);res.cookies.delete(`demo_pending_${lab}`);return res;}
