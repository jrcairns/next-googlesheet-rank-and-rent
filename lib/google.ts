import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const serviceAccountAuth = new JWT({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
});

export const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, serviceAccountAuth);

export async function getFields() {
    await doc.loadInfo()

    const form = doc.sheetsByTitle[`${process.env.APP_URL!}:form`]

    await form.loadHeaderRow(2)

    const rows = await form.getRows();

    return rows
        .filter(row => !!row.get("label"))
        .map(row => ({
            name: row.get("label")
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '_'),
            label: row.get("label"),
            placeholder: row.get("placeholder"),
            span: row.get("span"),
            required: row.get("required").toLowerCase(),
            component: {
                _element: row.get("component"),
                type: row.get("type"),
                options: !!row.get("options")?.length ? row.get("options")?.split(",").map((option: string) => ({
                    label: option.trim(),
                    value: option.trim().toLowerCase().replace(/\s+/g, '_'),
                })) : []
            },
        }))
}