import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { WishlistToggleIcon } from "@/components/products/WishlistToggleIcon";

async function getHomePageData() {
  const categories = await prisma.category.findMany({
    take: 4,
    orderBy: { sortOrder: 'asc' }
  });
  
  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true },
    take: 4,
    include: { images: true, category: true }
  });

  const activeBanners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  const siteContent = await prisma.siteContent.findMany();

  return { categories, featuredProducts, activeBanners, siteContent };
}

export default async function Home() {
  const { categories, featuredProducts, activeBanners, siteContent } = await getHomePageData();

  const session = await auth();
  let wishlistProductIds: string[] = [];
  if (session?.user?.id) {
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      select: { productId: true }
    });
    wishlistProductIds = wishlistItems.map(item => item.productId);
  }

  const getContent = (key: string, fallback: string) => {
    return siteContent.find(c => c.key === key)?.value || fallback;
  };

  // Find specific categories if they exist
  const travelCategory = categories.find(c => c.slug === 'travel') || categories[0];
  const accessoriesCategory = categories.find(c => c.slug === 'accessories') || categories[1];
  
  const primaryBanner = activeBanners[0]; // the most recently created active banner

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="relative h-[100vh] min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0" id="hero-bg">
          {primaryBanner ? (
            <Image 
              src={primaryBanner.imageUrl} 
              alt={primaryBanner.title} 
              fill 
              className="object-cover" 
              priority
              unoptimized
            />
          ) : (
            <video 
              autoPlay 
              className="w-full h-full object-cover" 
              loop 
              muted 
              playsInline 
              poster="https://lh3.googleusercontent.com/aida-public/AB6AXuD5-OLgebITds4GL569hxeXjkYW9n0bqNBJlhXmYCEAm_pse-orYyQEqyXGhISCMFZplCfw7qkATLDbrvE4SrkeuHi9iHMbl5pX_S1ITVPepWnNeTaNpuw9CFsECceJM3RBKIPZUw00ZBdqd7RuQ9ctgy8YJN4IZwErXxjGfzUvs0ybzG-eo-Eatov5keM0uCNi127SqlSi9AjuCT1FaeCF-mpM4iYuuUnt4zwPsGuU7eYml7Wyr-siRA"
            >
              <source src="https://cdn.pixabay.com/video/2020/05/26/40244-425251403_large.mp4" type="video/mp4"/>
            </video>
          )}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <h1 className="font-display text-[64px] md:text-[110px] leading-[0.95] text-white mb-8 animate-slow-fade-up stagger-1 italic">
            {primaryBanner ? primaryBanner.title : (
              <>The Art of <br/> <span className="not-italic">Movement</span></>
            )}
          </h1>
          <p 
            className="font-body text-lg md:text-xl text-white/80 mb-12 max-w-xl mx-auto tracking-wide animate-slow-fade-up stagger-2"
            dangerouslySetInnerHTML={{ __html: primaryBanner?.subtitle || getContent('hero_subtext', 'Timeless leather essentials, handcrafted for the modern wanderer.') }}
          />
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slow-fade-up stagger-3">
            <Link href={primaryBanner?.linkUrl || "/products"} className="btn-magnetic bg-white text-primary text-[12px] font-semibold tracking-widest-plus uppercase px-12 py-5 rounded-full hover:bg-secondary hover:text-white transition-all duration-500 shadow-xl">
              Discover Now
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <span className="material-symbols-outlined text-white text-3xl">expand_more</span>
        </div>
      </section>

      {/* Asymmetrical Editorial Grid */}
      <section className="py-section-block px-8 max-w-[1400px] mx-auto reveal active">
        <div className="mb-20 text-center">
          <span className="text-secondary font-medium uppercase tracking-widest-plus text-[11px] mb-4 block">Collections</span>
          <h2 className="font-display text-4xl md:text-6xl text-primary">Curated Aesthetics</h2>
        </div>
        
        <div className="grid grid-cols-12 gap-6 h-auto lg:h-[900px]">
          {/* Big Feature */}
          <div className="col-span-12 lg:col-span-7 h-[500px] lg:h-full relative overflow-hidden group">
            <Image 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuARzZdudBkUw5RUdAweWYtz7Jwyb04xwQY3cSHSa35xmYV7jThVtZUv77E0NLnzmT4rasoKBmCAUjKcWv47vK5V3QUDy_W1KJNOodwHHyj7VWvdKxj3_If4G51MDO3FMEEKbBWuNch0nkwONtzKCIaij7SU9AHtkK6fgZuyIUCB0go65mieVEKdQruR-sU3uZw4aHjPhVDa9BPT17mEp5VpwFGK0Z5Yp5xRAa_DSojS1vhZDXO0iBGVQw"
              alt="Large Tote" 
              fill
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105" 
              unoptimized
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-700"></div>
            <div className="absolute bottom-12 left-12 text-white">
              <h3 className="font-display text-4xl mb-2 italic">The Signature Line</h3>
              <p className="text-[12px] uppercase tracking-widest-plus opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">Shop Totes</p>
            </div>
            <Link href="/products" className="absolute inset-0 z-10"></Link>
          </div>
          
          {/* Small Stack */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 h-full">
            <div className="flex-1 relative overflow-hidden group min-h-[300px]">
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6tX-ShuJSoCsoD4aqP6eCvsukeduJFE5mWryzDj5ElIx-tcw7DVgmb8Juz4xcOssWedU9wiRUM8hnJw4cx74fS-x2RWr2nI8XsvwBvuvDcXu_zMeVihHobPFk-UBGkkQ3iguH-Pd88pjRuYGDekdcFKZOKyqNC5sR0vD09_JYq43pRyV2ujQKHnDScE3mS2_xOZlHcLB0CX5wqKYNhTYwpc_uDEtdh6NmApszN79e2cSqppsnOomBtg"
                alt="Crossbody" 
                fill
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105" 
                unoptimized
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-700"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="font-display text-3xl text-white">Versatile Carriers</h3>
              </div>
              <Link href="/products" className="absolute inset-0 z-10"></Link>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-6 min-h-[300px]">
              {travelCategory && (
                <div className="relative overflow-hidden group bg-surface-container-low">
                  <Image 
                    src={travelCategory.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAAk3M9Lq3DSCQ35xOD_GwmN4z5VL8l9daWpXiWz30o7WJyATu46ugAlsjoCpa3bN0HzXTMKW3L0iIJF30lAeQ8wFfGoJ6xd5aVw_5Ca05y6HKfcWv2R6-cH1Uf693rA9MfGJ76cS2FcgKy_vPlZPxi6xfV66R6bmEziq40oCcvBvTcz_QRMx8MHrEC6PYNtc5VN74dF7oCiM52plWkNePT8hRviW6IGj5_97x3gv8le1Hx-9Q-UMt9Dg"}
                    alt="Travel" 
                    fill
                    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-110 transition-transform duration-1000" 
                    unoptimized
                  />
                  <div className="absolute bottom-6 left-6">
                    <p className="text-[10px] uppercase tracking-widest-plus text-primary font-bold">Voyage</p>
                  </div>
                  <Link href={`/products?category=${travelCategory.slug}`} className="absolute inset-0 z-10"></Link>
                </div>
              )}
              
              {accessoriesCategory && (
                <div className="relative overflow-hidden group bg-surface-container-low">
                  <Image 
                    src={accessoriesCategory.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuALCZf1k2JCj2ESQJuOn-zvyVrtRhVVjo5ZrsodK6yxwa5L1bofaHm2-ozQsBKkNz0nOSzbl0ycmxVlxh-ZZXhanVju34W7K7r9Oc6Z0BEkIZ-_VvXFwN68P3pL1ZdbiOIG9zffAPVWtMbFVmF8Hbymey0nqONLxo6jYA_nzNVrR2WG5N37bklJ6dLsBa2IA_qSIG6IRT3NFV7RV0rPJDzRYxFf1t78PW3UGiTYOp6cMgga3WgxOwvTnA"}
                    alt="Wallets" 
                    fill
                    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-110 transition-transform duration-1000" 
                    unoptimized
                  />
                  <div className="absolute bottom-6 left-6">
                    <p className="text-[10px] uppercase tracking-widest-plus text-primary font-bold">Essentials</p>
                  </div>
                  <Link href={`/products?category=${accessoriesCategory.slug}`} className="absolute inset-0 z-10"></Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist Product Row */}
      <section className="py-section-block bg-white reveal active">
        <div className="px-8 max-w-[1400px] mx-auto">
          <div className="flex justify-between items-baseline mb-16 border-b border-outline pb-8">
            <h2 className="font-display text-4xl text-primary">New Arrivals</h2>
            <Link href="/products" className="text-[11px] uppercase tracking-widest-plus font-semibold text-secondary hover:text-primary transition-colors flex items-center gap-2 group">
              View Catalogue <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {featuredProducts.slice(0, 3).map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <Link href={`/products/${product.slug}`}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-surface-container-low transition-all duration-700 group-hover:bg-secondary/5">
                    {product.images[0] && (
                      <Image 
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03]"
                        unoptimized
                      />
                    )}
                    {product.isFeatured && (
                      <div className="absolute top-4 left-4 bg-primary text-white text-[9px] px-3 py-1 uppercase tracking-widest font-bold z-10 pointer-events-none">New Arrival</div>
                    )}
                    <WishlistToggleIcon 
                      productId={product.id} 
                      initialInWishlist={wishlistProductIds.includes(product.id)} 
                    />
                  </div>
                  <div className="mt-6 text-center">
                    <h3 className="font-display text-xl text-primary mb-1">{product.name}</h3>
                    <p className="text-[13px] text-on-surface-variant font-light tracking-wide mb-3">{product.category?.name || 'Leather Goods'}</p>
                    <p className="text-sm font-semibold tracking-wider">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                </Link>
              </div>
            ))}

            {/* Extra Product Card for visual balance */}
            <div className="group cursor-pointer hidden lg:block">
              <Link href="/products">
                <div className="relative aspect-[3/4] overflow-hidden bg-surface-container-low transition-all duration-700 group-hover:bg-secondary/5 flex items-center justify-center p-12">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-4xl text-secondary mb-4">auto_stories</span>
                    <p className="font-display text-lg italic">Explore the Winter Lookbook</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Story Section */}
      <section className="py-section-block bg-surface px-8 reveal active">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="w-full lg:w-3/5">
            <div className="relative">
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK4m6Ilm0kVPCxd0H1vniAs-eP6DzoW-vIQP6yJZyWabn-G-0Fa5dGuKx2oz5l2XmzdJ0-X2mdRQFD1YxXIkCDYkJVXJUXKucXijc58ODt2sO0zxc-QnrKJy37D_f8OlAEcpHc2GkSTdP9zH23bKnhSyc5U-JdcVVNSpd6o1oGfhOolQNzozXU96TmBmPOXbN1ihBd0Z5pnDyxQzzpJgzPbGwcxFhoAYwF2HK3ZcAHu1-Hc1o6FsKC1w"
                alt="Workshop"
                width={800}
                height={600}
                className="w-full h-[600px] object-cover shadow-2xl rounded-sm"
                unoptimized
              />
              <div className="absolute -bottom-10 -right-10 bg-primary-container text-white p-12 max-w-sm hidden md:block">
                <p className="font-display text-2xl italic mb-4">&quot;A bag should be a companion, not just a container.&quot;</p>
                <p className="text-[10px] uppercase tracking-widest-plus font-bold text-secondary">— Our Philosophy</p>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-2/5">
            <span className="text-secondary font-medium uppercase tracking-widest-plus text-[11px] mb-6 block">Our Heritage</span>
            <h2 className="font-display text-5xl md:text-6xl text-primary mb-10 leading-tight">Crafted for the long journey ahead.</h2>
            <div 
              className="space-y-6 text-on-surface-variant font-light leading-loose tracking-wide [&>p]:mb-4"
              dangerouslySetInnerHTML={{ 
                __html: getContent('home_brand_story', '<p>At Peri Bags, we believe in the quiet luxury of objects made well.</p>') 
              }}
            />
            <div className="mt-12">
              <Link href="/products" className="btn-magnetic inline-block px-10 py-4 border border-primary text-primary text-[12px] uppercase tracking-widest-plus font-bold hover:bg-primary hover:text-white transition-all duration-500">
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
