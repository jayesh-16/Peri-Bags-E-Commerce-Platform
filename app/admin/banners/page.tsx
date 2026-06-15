import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { deleteBanner, toggleBannerStatus } from "./actions";
import CreateBannerForm from "@/components/admin/CreateBannerForm";

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-section-inner mb-8">
        <div>
          <h2 className="font-headline-h2 text-headline-h2 text-primary mb-1">Banner Management</h2>
          <p className="font-body-md text-body-md text-muted-foreground">Manage promotional hero images and marketing banners.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {banners.map((banner, idx) => (
          <div key={banner.id} className={`${idx === 0 ? 'md:col-span-2' : ''} bg-surface-container-lowest rounded-xl border border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden group hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full min-h-[300px]`}>
            <div className={`relative w-full bg-surface-container overflow-hidden ${idx === 0 ? 'h-64' : 'h-48'}`}>
              <Image fill className="object-cover group-hover:scale-105 transition-transform duration-700" alt={banner.title} src={banner.imageUrl}/>
              <div className="absolute top-4 right-4 flex gap-2">
                {banner.isActive ? (
                  <span className="bg-success/10 text-success px-3 py-1 rounded-full font-caption text-caption font-medium border border-success/20 backdrop-blur-sm">Active</span>
                ) : (
                  <span className="bg-surface-container-highest text-muted-foreground px-3 py-1 rounded-full font-caption text-caption font-medium border border-border backdrop-blur-sm">Draft</span>
                )}
                {idx === 0 && banner.isActive && (
                  <span className="bg-surface/90 text-primary px-3 py-1 rounded-full font-caption text-caption font-medium border border-border backdrop-blur-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">star</span> Primary Hero
                  </span>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                <div className="flex gap-2">
                  <form action={async (formData) => { "use server"; await toggleBannerStatus(formData); }}>
                    <input type="hidden" name="id" value={banner.id} />
                    <input type="hidden" name="currentStatus" value={banner.isActive.toString()} />
                    <button type="submit" className="w-10 h-10 rounded-full bg-surface text-primary flex items-center justify-center hover:bg-secondary hover:text-on-secondary transition-colors shadow-lg" title="Toggle Status">
                      <span className="material-symbols-outlined text-[20px]">{banner.isActive ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </form>
                  <form action={async (formData) => { "use server"; await deleteBanner(formData); }}>
                    <input type="hidden" name="id" value={banner.id} />
                    <button type="submit" className="w-10 h-10 rounded-full bg-surface text-destructive flex items-center justify-center hover:bg-error hover:text-on-error transition-colors shadow-lg" title="Delete">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="p-card-padding flex-1 flex flex-col justify-between bg-surface-container-lowest">
              <div>
                <h3 className="font-headline-h3 text-headline-h3 text-primary mb-2 truncate">{banner.title}</h3>
                {banner.subtitle && (
                  <p className="font-body-md text-body-md text-muted-foreground line-clamp-2 mb-4">{banner.subtitle}</p>
                )}
              </div>
              {banner.linkUrl && (
                <div className="flex items-center gap-2 text-sm text-secondary font-medium mt-auto pt-4 border-t border-border/50">
                  <span className="material-symbols-outlined text-[18px]">link</span>
                  <span className="truncate">{banner.linkUrl}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Create Banner Form Component */}
        <CreateBannerForm />
      </div>
    </>
  );
}
