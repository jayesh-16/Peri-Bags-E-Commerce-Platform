"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";

export default function Navbar({ 
  categories = [] 
}: { 
  categories?: { id: string; name: string; slug: string; }[] 
}) {
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const itemCount = useCart((state) => state.getItemCount());
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    if (!searchQuery.trim() || !searchOpen) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.products || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchOpen]);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 py-6 px-8 flex justify-between items-center ${
        scrolled ? "nav-scrolled" : ""
      }`}
      id="navbar"
    >
      <div className="flex-1 md:flex hidden">
        <ul className="flex gap-10 items-center text-[13px] font-medium tracking-widest-plus uppercase">
          <li className="relative group">
            <Link href="/products" className="hover:text-secondary transition-colors duration-300 py-4 block">
              Collections
            </Link>
            
            {/* Dropdown Menu */}
            {categories.length > 0 && (
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="w-48 bg-surface-container-low shadow-lg border-t-2 border-secondary flex flex-col py-2 rounded-b-md">
                  {categories.map((category) => (
                    <Link 
                      key={category.id} 
                      href={`/products?category=${category.slug}`}
                      className="px-4 py-2.5 hover:bg-surface-container hover:text-secondary transition-colors text-[11px] font-semibold tracking-widest"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </li>
          <li>
            <Link href="/about" className="hover:text-secondary transition-colors duration-300 py-4 block">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-secondary transition-colors duration-300 py-4 block">
              Contact
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <Link href="/" className="flex items-center justify-center gap-3 hover:opacity-80 transition-opacity">
          <div className="relative w-12 h-12 overflow-hidden">
            <Image 
              src="/images/logo.png" 
              alt="Peri Bags Logo" 
              fill 
              className="object-contain transition-all duration-500"
            />
          </div>
          <span className="font-display text-[26px] tracking-tight font-semibold hidden sm:inline-block">Peri Bags</span>
        </Link>
      </div>
      <div className="flex-1 flex justify-end items-center gap-6">
        <div className="relative flex items-center">
          <form 
            onSubmit={handleSearch} 
            className={`transition-all duration-300 flex items-center overflow-visible ${searchOpen ? 'w-48 opacity-100 mr-2' : 'w-0 opacity-0'}`}
          >
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-transparent border-b border-primary/30 outline-none text-[13px] font-body pb-1 px-1 placeholder:text-primary/50 focus:border-primary text-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus={searchOpen}
              />
              
              {/* Auto-suggest dropdown */}
              {searchOpen && (searchQuery.trim().length > 0) && (
                <div className="absolute top-full right-0 mt-3 w-64 bg-surface-container-low shadow-[0_4px_20px_rgba(0,0,0,0.08)] border-t-2 border-secondary rounded-b-md overflow-hidden z-50">
                  {isSearching ? (
                    <div className="p-4 text-center text-[12px] text-on-surface-variant font-body animate-pulse">Searching...</div>
                  ) : suggestions.length > 0 ? (
                    <ul className="max-h-[60vh] overflow-y-auto">
                      {suggestions.map((product) => (
                        <li key={product.id} className="border-b border-border/50 last:border-0">
                          <Link 
                            href={`/products/${product.slug}`}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-surface transition-colors"
                          >
                            {product.images && product.images[0] ? (
                              <div className="relative w-12 h-12 rounded-sm bg-muted overflow-hidden flex-shrink-0">
                                <Image src={product.images[0].url} alt={product.images[0].altText || product.name} fill className="object-cover" />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-sm bg-muted flex-shrink-0"></div>
                            )}
                            <div className="flex flex-col">
                              <span className="font-body text-[12px] font-semibold text-primary line-clamp-1">{product.name}</span>
                              <span className="font-body text-[11px] text-secondary mt-0.5">₹{product.price.toLocaleString('en-IN')}</span>
                            </div>
                          </Link>
                        </li>
                      ))}
                      <li className="bg-surface-container-lowest">
                        <button 
                          type="button"
                          onClick={handleSearch}
                          className="w-full text-center p-3 text-[10px] font-bold tracking-widest uppercase text-secondary hover:text-primary transition-colors"
                        >
                          View all results
                        </button>
                      </li>
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-[12px] text-on-surface-variant font-body">No products found.</div>
                  )}
                </div>
              )}
            </div>
          </form>
          <button 
            aria-label="search" 
            onClick={() => setSearchOpen(!searchOpen)}
            className="hover:text-secondary transition-colors duration-300"
          >
            <span className="material-symbols-outlined">{searchOpen ? 'close' : 'search'}</span>
          </button>
        </div>
        <Link href="/login" aria-label="account" className="hover:text-secondary transition-colors duration-300 flex items-center">
          <span className="material-symbols-outlined">person</span>
        </Link>
        <Link href="/cart" aria-label="shopping_bag" className="hover:text-secondary transition-colors duration-300 relative inline-flex">
          <span className="material-symbols-outlined">shopping_bag</span>
          {isMounted && itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 text-[9px] w-4 h-4 flex items-center justify-center font-bold bg-primary text-on-primary rounded-full">
              {itemCount}
            </span>
          )}
        </Link>
        <button className="md:hidden">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </nav>
  );
}
