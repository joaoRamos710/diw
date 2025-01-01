import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
       
        const body = await req.json();

        const resp = await fetch('https://deisishop.pythonanywhere.com/buy/', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        
        if (!resp.ok) {
            return NextResponse.json(
                { error: resp.statusText },
                { status: resp.status }
            );
        }

        const data = await resp.json();

        if (data.hasOwnProperty('error')) {
            return NextResponse.json(
                { error: data.error },
                { status: 500 }
            );
        }

       
        return NextResponse.json(data);
    } catch (error) {
   
        console.error('Erro ao processar a solicitação:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor.' },
            { status: 500 }
        );
    }
}
