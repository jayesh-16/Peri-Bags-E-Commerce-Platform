import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { approveReview, deleteReview } from "./actions";

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const statusFilter = typeof searchParams.status === 'string' ? searchParams.status : 'all';
  const ratingFilter = typeof searchParams.rating === 'string' ? searchParams.rating : 'all';
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'newest';

  // Build where clause
  let where: any = {};
  if (statusFilter === 'pending') where.isApproved = false;
  if (statusFilter === 'approved') where.isApproved = true;
  
  if (ratingFilter !== 'all') {
    if (ratingFilter === '5') where.rating = 5;
    if (ratingFilter === '4') where.rating = { gte: 4 };
    if (ratingFilter === '3') where.rating = { gte: 3 };
    if (ratingFilter === '1-2') where.rating = { lte: 2 };
  }

  // Build order by
  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'oldest') orderBy = { createdAt: 'asc' };
  if (sort === 'rating_high') orderBy = { rating: 'desc' };
  if (sort === 'rating_low') orderBy = { rating: 'asc' };

  const reviews = await prisma.review.findMany({
    where,
    orderBy,
    include: {
      product: {
        include: {
          images: { take: 1 }
        }
      },
      user: true
    }
  });

  return (
    <>
      {/* Header & Filters */}
      <div className="mb-section-inner mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
          <div>
            <h2 className="font-headline-h2 text-headline-h2 text-foreground mb-1">Review Moderation</h2>
            <p className="font-body-md text-body-md text-muted-foreground">Manage and moderate customer feedback across all products.</p>
          </div>
        </div>
        {/* Simple note instead of active filters for now to focus on the wiring */}
        <div className="bg-surface rounded-xl p-card-padding border border-border shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
           <p className="text-body-md text-muted-foreground">Currently displaying {reviews.length} total reviews.</p>
        </div>
      </div>
      
      {/* Reviews Table/Grid */}
      <div className="bg-surface rounded-xl border border-border shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-border">
                <th className="py-4 px-6 font-label-button text-label-button text-muted-foreground">Product</th>
                <th className="py-4 px-6 font-label-button text-label-button text-muted-foreground">Customer &amp; Date</th>
                <th className="py-4 px-6 font-label-button text-label-button text-muted-foreground">Rating &amp; Review</th>
                <th className="py-4 px-6 font-label-button text-label-button text-muted-foreground">Status</th>
                <th className="py-4 px-6 font-label-button text-label-button text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No reviews found.
                  </td>
                </tr>
              )}
              {reviews.map((review) => {
                const img = review.product?.images[0]?.url || "https://placehold.co/100?text=No+Image";
                
                return (
                <tr key={review.id} className="hover:bg-surface-container-lowest transition-colors group">
                  <td className="py-4 px-6 align-top">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded bg-muted flex-shrink-0 border border-border overflow-hidden">
                        <Image alt={review.product?.name || "Product"} fill className="object-cover" src={img}/>
                      </div>
                      <div>
                        <p className="font-body-md text-body-md text-foreground font-medium">{review.product?.name || "Deleted Product"}</p>
                        <p className="font-caption text-caption text-muted-foreground">SKU: {review.product?.sku || "N/A"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 align-top">
                    <p className="font-body-md text-body-md text-foreground">{review.user?.name || "Anonymous"}</p>
                    <p className="font-caption text-caption text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-4 px-6 align-top max-w-md">
                    <div className="flex items-center gap-1 mb-1 text-secondary">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`material-symbols-outlined text-[18px] ${star <= review.rating ? '' : 'text-outline-variant'}`}>
                          star
                        </span>
                      ))}
                    </div>
                    {review.title && <h4 className="font-body-md text-body-md text-foreground font-medium mb-1 truncate">{review.title}</h4>}
                    <p className="font-caption text-caption text-muted-foreground line-clamp-2">{review.body}</p>
                  </td>
                  <td className="py-4 px-6 align-top">
                    {review.isApproved ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-button text-xs bg-success/10 text-success">
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-button text-xs bg-secondary-container text-on-secondary-container">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 align-top text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!review.isApproved && (
                        <form action={async (formData) => { "use server"; await approveReview(formData); }}>
                          <input type="hidden" name="id" value={review.id} />
                          <button type="submit" className="p-2 text-success hover:bg-surface-container rounded-full transition-colors" title="Approve">
                            <span className="material-symbols-outlined">check_circle</span>
                          </button>
                        </form>
                      )}
                      <form action={async (formData) => { "use server"; await deleteReview(formData); }}>
                        <input type="hidden" name="id" value={review.id} />
                        <button type="submit" className="p-2 text-destructive hover:bg-error-container rounded-full transition-colors" title="Delete/Reject">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
