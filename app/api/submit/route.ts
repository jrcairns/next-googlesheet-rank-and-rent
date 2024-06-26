import { NextResponse } from 'next/server';
import { z } from 'zod'
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const serviceAccountAuth = new JWT({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
});

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, serviceAccountAuth);

const createRowSchema = z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().min(1),
    postal_code: z.string().min(1),
    message: z.string().min(1),
    model: z.string().optional(),
    plan: z.string().optional()
})

export async function POST(request: Request) {
    const body = await request.json();

    const parsed = createRowSchema.safeParse(body)

    if (!parsed.success) {
        return NextResponse.json({ error: 'Failed to validate input.' }, { status: 422 });
    }

    try {
        await doc.loadInfo()

        const sheet = doc.sheetsByTitle[process.env.APP_URL!]

        sheet.setHeaderRow(Object.keys(parsed.data).map(key => key))

        await sheet.addRow({ ...parsed.data });

        return NextResponse.json({ status: 201 });
    } catch (e) {
        console.log(e)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}