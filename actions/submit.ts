"use server"

import { doc } from "@/lib/google";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type FormState = {
    success: boolean
}

export async function submitAction(prevState: FormState, formData: FormData): Promise<FormState> {
    const data = Object.fromEntries(formData)

    const parsed = createRowSchema.safeParse(data)

    if (!parsed.success) {
        return { success: false }
    }

    try {
        await doc.loadInfo()

        const sheet = doc.sheetsByTitle[process.env.APP_URL!]

        sheet.setHeaderRow(Object.keys(parsed.data).map(key => key))

        await sheet.addRow({ ...parsed.data });

        revalidatePath('/')

        return { success: true }
    } catch (error) {
        return { success: false }
    }
}

const createRowSchema = z.object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    phone_number: z.string().min(1),
    email_address: z.string().min(1),
    postal_code: z.string().min(1),
    project_budget: z.string().optional()
})