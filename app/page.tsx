import { Form } from "@/components/form";
import { getFields } from "@/lib/google";

export default async function Home() {
  const fields = await getFields()

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-12">
      <Form fields={fields} />
    </div>
  );
}