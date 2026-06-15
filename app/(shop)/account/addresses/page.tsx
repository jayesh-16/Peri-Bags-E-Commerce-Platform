import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { AddressDialog } from "@/components/account/AddressDialog";
import { deleteAddress } from "@/app/actions/addresses";

export const metadata: Metadata = {
  title: "Saved Addresses | Peri Bags",
};

export default async function AddressesPage() {
  const session = await auth();

  if (!session?.user?.id) return null;

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
  });

  return (
    <div className="space-y-8">
      <header className="space-y-2 flex flex-col md:flex-row md:justify-between md:items-end border-b border-border pb-6 gap-4">
        <div>
          <h1 className="font-display text-4xl text-primary">Saved Addresses</h1>
          <p className="text-on-surface-variant font-body text-lg mt-2">Manage your shipping destinations.</p>
        </div>
        <AddressDialog />
      </header>

      {addresses.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-border flex flex-col items-center">
          <span className="material-symbols-outlined text-6xl text-border mb-4">home_pin</span>
          <h3 className="font-display text-2xl font-semibold text-primary mb-2">No addresses saved</h3>
          <p className="text-on-surface-variant mb-6">Add an address for a quicker checkout experience.</p>
          <AddressDialog />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-lg p-8 shadow-sm border border-border/50 flex flex-col justify-between">
              <div className="space-y-2 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-secondary">location_on</span>
                  <h4 className="font-display text-xl font-semibold text-primary">{address.fullName}</h4>
                </div>
                <p className="text-on-surface-variant font-body">{address.line1}</p>
                {address.line2 && <p className="text-on-surface-variant font-body">{address.line2}</p>}
                <p className="text-on-surface-variant font-body">
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p className="text-on-surface-variant font-body">{address.country}</p>
                <p className="text-on-surface-variant font-body pt-2 text-sm">Phone: {address.phone}</p>
              </div>
              <div className="flex gap-4 border-t border-border pt-6">
                <button className="text-secondary font-label-button text-sm uppercase tracking-wide hover:underline underline-offset-4">Edit</button>
                <form 
                  action={async () => {
                    "use server";
                    await deleteAddress(address.id);
                  }}
                >
                  <button type="submit" className="text-destructive font-label-button text-sm uppercase tracking-wide hover:underline underline-offset-4">Remove</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
