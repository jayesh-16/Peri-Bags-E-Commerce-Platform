import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-24 pb-12 px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-1">
            <h4 className="font-display text-3xl mb-6">Peri Bags</h4>
            <p className="text-white/50 text-[13px] leading-relaxed max-w-[200px]">
              Artisanal Craftsmanship. Elevating your everyday journey with premium leather goods.
            </p>
          </div>
          <div>
            <h5 className="text-[11px] uppercase tracking-widest-plus font-bold text-secondary mb-8">Navigation</h5>
            <ul className="space-y-4 text-[13px] text-white/70">
              <li>
                <Link href="/collections" className="hover:text-white transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/editorial" className="hover:text-white transition-colors">
                  Editorial
                </Link>
              </li>
              <li>
                <Link href="/gift-registry" className="hover:text-white transition-colors">
                  Gift Registry
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-[11px] uppercase tracking-widest-plus font-bold text-secondary mb-8">Assistance</h5>
            <ul className="space-y-4 text-[13px] text-white/70">
              <li>
                <Link href="/care-guide" className="hover:text-white transition-colors">
                  Care Guide
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  Shipping &amp; Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-[11px] uppercase tracking-widest-plus font-bold text-secondary mb-8">Connect</h5>
            <div className="flex gap-6 mb-8">
              <Link href="#" className="hover:text-secondary transition-colors">
                <span className="material-symbols-outlined">photo_camera</span>
              </Link>
              <Link href="#" className="hover:text-secondary transition-colors">
                <span className="material-symbols-outlined">alternate_email</span>
              </Link>
            </div>
            <p className="text-[12px] text-white/40">© 2024 Peri Bags. Made with intention.</p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-12 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/30">
            Artisanal Leather Goods • Handcrafted in Spain
          </p>
        </div>
      </div>
    </footer>
  );
}
