"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { submitReview } from "@/app/(shop)/account/history/actions";

interface ReviewFormModalProps {
  productId: string;
  productName: string;
  alreadyReviewed: boolean;
}

export function ReviewFormModal({ productId, productName, alreadyReviewed }: ReviewFormModalProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isPending, startTransition] = useTransition();

  if (alreadyReviewed) {
    return (
      <button disabled className="border border-success/30 text-success bg-success/5 text-xs font-medium tracking-wide uppercase px-4 py-2 rounded-full cursor-default">
        Review Submitted
      </button>
    );
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating before submitting.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append("productId", productId);
    formData.append("rating", rating.toString());

    startTransition(async () => {
      const result = await submitReview(formData);
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="border border-border text-primary text-xs font-medium tracking-wide uppercase px-4 py-2 rounded-full hover:bg-muted transition-colors">
          Write Review
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-primary">Write a Review</DialogTitle>
          <p className="text-on-surface-variant text-sm mt-1">Share your thoughts on the {productName}.</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="flex flex-col items-center gap-2 mb-6">
            <span className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant">Overall Rating</span>
            <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  onMouseEnter={() => setHoverRating(star)}
                  onClick={() => setRating(star)}
                >
                  <span 
                    className={`material-symbols-outlined text-4xl transition-colors ${
                      (hoverRating || rating) >= star 
                        ? 'text-secondary' 
                        : 'text-outline-variant'
                    }`}
                    style={{ fontVariationSettings: (hoverRating || rating) >= star ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    star
                  </span>
                </button>
              ))}
            </div>
            <div className="h-4 text-xs text-secondary font-medium">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Average"}
              {rating === 4 && "Good"}
              {rating === 5 && "Excellent"}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-primary mb-1">
                Review Title (Optional)
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Summarize your experience"
                className="w-full px-4 py-3 bg-surface-container-lowest border border-border rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body text-sm"
              />
            </div>
            <div>
              <label htmlFor="body" className="block text-sm font-semibold text-primary mb-1">
                Review <span className="text-error">*</span>
              </label>
              <textarea
                id="body"
                name="body"
                rows={4}
                required
                placeholder="What did you like or dislike? How is the quality?"
                className="w-full px-4 py-3 bg-surface-container-lowest border border-border rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body text-sm resize-none"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-6 py-2.5 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wide"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-primary text-white text-sm font-semibold uppercase tracking-wide px-8 py-2.5 rounded-full hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPending && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
              Submit Review
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
