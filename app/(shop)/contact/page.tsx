import { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Contact Us | Peri Bags",
  description: "Get in touch with the craftsmen and support team at Peri Bags.",
};

export default async function ContactPage() {
  const contentRecords = await prisma.siteContent.findMany({
    where: {
      key: { in: ["support_email", "support_phone"] },
    },
  });

  const settings = contentRecords.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const supportEmail = settings["support_email"] || "concierge@peribags.com";
  const supportPhone = settings["support_phone"] || "+1 (800) 555-PERI";

  return (
    <main className="flex-grow pt-32 pb-24 bg-surface">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="mb-16 text-center">
          <span className="text-secondary font-medium uppercase tracking-widest-plus text-[11px] mb-4 block">
            At Your Service
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-primary mb-6">
            Contact Us
          </h1>
          <div className="h-px w-24 bg-border mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Contact Form */}
          <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-border/50">
            <h2 className="font-display text-3xl text-primary mb-6">Send a Message</h2>
            <p className="text-on-surface-variant font-body mb-8">
              Whether you have a question about our materials, need help with an order, or want to discuss a custom piece, we're here to help.
            </p>
            
            <form className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-xs uppercase tracking-widest text-on-surface-variant font-medium">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg font-body focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                  placeholder="Jane Doe"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs uppercase tracking-widest text-on-surface-variant font-medium">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg font-body focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="block text-xs uppercase tracking-widest text-on-surface-variant font-medium">Subject</label>
                <select 
                  id="subject" 
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg font-body focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all text-primary"
                >
                  <option>Order Inquiry</option>
                  <option>Product Question</option>
                  <option>Repairs & Warranty</option>
                  <option>Custom Commission</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-xs uppercase tracking-widest text-on-surface-variant font-medium">Message</label>
                <textarea 
                  id="message" 
                  rows={5}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg font-body focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all resize-none"
                  placeholder="How can we assist you?"
                ></textarea>
              </div>

              <button 
                type="button" 
                className="w-full bg-primary text-white font-label-button text-[14px] uppercase tracking-widest py-4 rounded-full hover:bg-secondary transition-colors mt-4 shadow-sm"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Details & Visuals */}
          <div className="space-y-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div>
                  <h3 className="font-display text-xl text-primary font-semibold mb-2">Email</h3>
                  <p className="text-on-surface-variant font-body">{supportEmail}</p>
                  <p className="text-on-surface-variant font-body text-sm mt-1">Expect a reply within 24 hours.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">call</span>
                </div>
                <div>
                  <h3 className="font-display text-xl text-primary font-semibold mb-2">Phone</h3>
                  <p className="text-on-surface-variant font-body">{supportPhone}</p>
                  <p className="text-on-surface-variant font-body text-sm mt-1">Mon-Fri, 9am - 6pm EST</p>
                </div>
              </div>

              <div className="space-y-4 sm:col-span-2">
                <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">storefront</span>
                </div>
                <div>
                  <h3 className="font-display text-xl text-primary font-semibold mb-2">Our Atelier</h3>
                  <p className="text-on-surface-variant font-body">124 Artisan Way, Studio 4</p>
                  <p className="text-on-surface-variant font-body">New York, NY 10012</p>
                  <p className="text-on-surface-variant font-body text-sm mt-2 italic">By appointment only.</p>
                </div>
              </div>
            </div>

            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              {/* Optional embedded map or aesthetic image */}
              <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                 <Image 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRqBKduBSiVzLoCz8BbnFdjMlOPgQs8XTq-h4hvhpPJQahtkW2PJK9nvPOuHMdmGbypuT5QKGpBbG1W4dXDExGrcRj-tS48Kw5tdSm5yb9eHU9AbWb6lHCXcwJQMmsZCjqwNaKT2ZSARWg3aLMkjgkNHsEWxkT49sp7dPczGAl3-_oLoeQfEZKnExFDT5nYCtnIOS-w8mdYuWwCHjYAeqjiCIR9mTw49bnwbuy5OT9Lz-43cJzjU10CsZXDdC5--VNWCQW2lGaEtTF"
                    alt="Leather working tools"
                    fill
                    className="object-cover opacity-80 mix-blend-multiply"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
                 <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white font-display text-2xl italic">Crafted with intention.</p>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
