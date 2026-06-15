import { prisma } from "@/lib/prisma";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const contentRecords = await prisma.siteContent.findMany({
    where: {
      key: {
        in: ["store_name", "support_email", "support_phone", "shipping_fee"],
      },
    },
  });

  const initialSettings = contentRecords.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-primary">Store Settings</h1>
        <p className="text-on-surface-variant mt-2 font-body-md">
          Configure global store preferences and contact information.
        </p>
      </div>

      <SettingsForm initialSettings={initialSettings} />
    </div>
  );
}
