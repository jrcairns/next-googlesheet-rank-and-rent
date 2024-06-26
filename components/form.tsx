"use client"

import { submitAction } from "@/actions/submit";
import { getFields } from "@/lib/google";
import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";
import { useFormState, useFormStatus } from "react-dom";

interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
    fields: Awaited<ReturnType<typeof getFields>>
}

export function Form({ children, className, fields, ...props }: PropsWithChildren<FormProps>) {
    const [state, formAction] = useFormState(submitAction, {
        success: false
    })

    return (
        <form
            action={formAction}
            className={cn("max-w-md w-full items-start mx-auto", className)}
            {...props}
        >
            <Fieldset>
                {fields?.map(field => (
                    <div
                        key={field.label}
                        style={{ gridColumn: `span ${field.span} / span ${field.span}` }}
                        className="space-y-1 flex flex-col"
                    >
                        <label htmlFor={field.name}>
                            {field.label} {field.required === "true" && "(*)"}
                        </label>

                        {field.component._element === "checkbox" && (
                            <input
                                type="checkbox"
                                required={field.required === "true"}
                                id={field.name}
                                name={field.name}
                                aria-label={field.name}
                            />
                        )}

                        {field.component._element === "input" && (
                            <input
                                required={field.required === "true"}
                                type={field.component.type}
                                name={field.name}
                                id={field.name}
                                placeholder={field.placeholder}
                            />
                        )}
                        {field.component._element === "textarea" && (
                            <textarea
                                required={field.required === "true"}
                                name={field.name}
                                id={field.name}
                                placeholder={field.placeholder}
                                rows={4}
                            />
                        )}
                        {field.component._element === "select" && (
                            <select name={field.name}>
                                {field.component.options?.map((option: { value: string; label: string; }) => (
                                    <option key={option.label} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        )}
                    </div>
                ))}

                <button className="bg-black text-white text-base px-3 py-2 h-10 ml-auto leading-none" type="submit">Submit</button>
            </Fieldset>
            {state.success && <p>success</p>}
        </form>
    )
}

function Fieldset({ children }: PropsWithChildren) {
    const { pending } = useFormStatus()
    return (
        <fieldset className="grid grid-cols-6 gap-3 disabled:opacity-50" disabled={pending}>{children}</fieldset>
    )
}