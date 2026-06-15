const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with Stitch MCP prototype data...');

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create an Admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@peribags.com',
      name: 'Admin User',
      role: 'ADMIN',
      // password: "password123" hashed with bcrypt:
      passwordHash: '$2b$10$jtcDmM6dMIMWEtqs51zNMOE05lINcDkYxCUAZ2XbYE0kUHyv/NE2C', 
    },
  });

  const categories = [
    { 
      name: 'Signature Totes', 
      slug: 'totes', 
      desc: 'Elegant leather tote bags for everyday use.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARzZdudBkUw5RUdAweWYtz7Jwyb04xwQY3cSHSa35xmYV7jThVtZUv77E0NLnzmT4rasoKBmCAUjKcWv47vK5V3QUDy_W1KJNOodwHHyj7VWvdKxj3_If4G51MDO3FMEEKbBWuNch0nkwONtzKCIaij7SU9AHtkK6fgZuyIUCB0go65mieVEKdQruR-sU3uZw4aHjPhVDa9BPT17mEp5VpwFGK0Z5Yp5xRAa_DSojS1vhZDXO0iBGVQw'
    },
    { 
      name: 'Crossbody', 
      slug: 'crossbody', 
      desc: 'Structured crossbody bags for modern corporate elegance.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6tX-ShuJSoCsoD4aqP6eCvsukeduJFE5mWryzDj5ElIx-tcw7DVgmb8Juz4xcOssWedU9wiRUM8hnJw4cx74fS-x2RWr2nI8XsvwBvuvDcXu_zMeVihHobPFk-UBGkkQ3iguH-Pd88pjRuYGDekdcFKZOKyqNC5sR0vD09_JYq43pRyV2ujQKHnDScE3mS2_xOZlHcLB0CX5wqKYNhTYwpc_uDEtdh6NmApszN79e2cSqppsnOomBtg'
    },
    { 
      name: 'Accessories', 
      slug: 'accessories', 
      desc: 'Premium leather wallets and small leather goods.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALCZf1k2JCj2ESQJuOn-zvyVrtRhVVjo5ZrsodK6yxwa5L1bofaHm2-ozQsBKkNz0nOSzbl0ycmxVlxh-ZZXhanVju34W7K7r9Oc6Z0BEkIZ-_VvXFwN68P3pL1ZdbiOIG9zffAPVWtMbFVmF8Hbymey0nqONLxo6jYA_nzNVrR2WG5N37bklJ6dLsBa2IA_qSIG6IRT3NFV7RV0rPJDzRYxFf1t78PW3UGiTYOp6cMgga3WgxOwvTnA'
    },
    { 
      name: 'Travel', 
      slug: 'travel', 
      desc: 'Beautifully crafted leather travel duffel bags.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAk3M9Lq3DSCQ35xOD_GwmN4z5VL8l9daWpXiWz30o7WJyATu46ugAlsjoCpa3bN0HzXTMKW3L0iIJF30lAeQ8wFfGoJ6xd5aVw_5Ca05y6HKfcWv2R6-cH1Uf693rA9MfGJ76cS2FcgKy_vPlZPxi6xfV66R6bmEziq40oCcvBvTcz_QRMx8MHrEC6PYNtc5VN74dF7oCiM52plWkNePT8hRviW6IGj5_97x3gv8le1Hx-9Q-UMt9Dg'
    },
  ];

  const createdCategories: Record<string, any> = {};
  for (const cat of categories) {
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.desc,
        imageUrl: cat.imageUrl,
      },
    });
    createdCategories[cat.slug] = category;
  }

  const productsData = [
    {
      name: 'The Meridian Tote',
      slug: 'the-meridian-tote',
      description: 'A clean, minimalist product shot of a terracotta-colored leather handbag set against a seamless warm-white background.',
      price: 285,
      comparePrice: 320,
      categorySlug: 'totes',
      stock: 45,
      isFeatured: true,
      sku: 'TOT-001',
      attributes: JSON.stringify({ material: 'Terracotta Leather' }),
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDaXSHevEapCr-zNyuITAopl58kC92uhAfiW4L7H07G5hktI9k30cTRg23ErTQz8ILPMv2gA3Jb8bVRlg-Oaum8TMK8xrT__nwDMJpd_CifhUoSi6yRSD3uCui76uiKrRCLJ0SfP1MhdbJIP5NF_Zn3wYmFQsc1_DHnQZ3I2TN-bGuZm3ttT8i1DQNZBKic0rgriBIO116uoHyzbtZfFERYwTVG2-1Uu2oLiDWsykoAGKan5fsz-DdZlw'
      ]
    },
    {
      name: 'Classic Bifold',
      slug: 'classic-bifold',
      description: 'A clean, minimalist product shot of a dark brown leather wallet set against a seamless warm-white background.',
      price: 85,
      comparePrice: null,
      categorySlug: 'accessories',
      stock: 120,
      isFeatured: true,
      sku: 'ACC-001',
      attributes: JSON.stringify({ material: 'Dark Brown Leather' }),
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAvOIsavSRlgZYqFYBfdBoJYeiA8IX0ApiwkLqAOGQw52uTV_X5POYgVkh-xL_x17j2KXWoGDl78ldNJqWYucNdeO30-RfI03uI12wxwQ1ay8A8p1xkKhAB9ZZegpupGBOKgUcx7QYMyNRxENNYV0gyyTmjZnKEg5qPj5bwv_oLldZyzzfFx6ggxjhuw-aWJsTGCnOPWWREavzSv7HAUyEd70RyuCE8q130iUgMSKb5rqAQO0ItVPbKDQ'
      ]
    },
    {
      name: 'The Everyday Tote',
      slug: 'the-everyday-tote',
      description: 'A minimalist leather tote bag resting on a clean, light-colored surface. The lighting is soft and studio-quality, casting subtle shadows that highlight the rich, warm brown texture of the leather.',
      price: 285,
      comparePrice: null,
      categorySlug: 'totes',
      stock: 30,
      isFeatured: true,
      sku: 'TOT-002',
      attributes: JSON.stringify({ material: 'Warm Brown Leather' }),
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDT3mJhZm5MaD6jhjWa0D-qKjXDNrPC3S2a4WGFHWKoUyp_YL0KEk4VU5aqDK6SAXRYwvNMRMjfDjq3Zc8YYCaG8ABFrKKZc0MrDD1ZqWMLjdbkK_m2MXH-ncPPb3GVOdmz6jLOpbvQfFoFx46TPuXAnooVGNQBxWVpFCqbnL6Du9cCkZoBX9Mcf4wErCf4I_Ip8hif130psnCMlrVy2Us_ODw5KkDP4aO0O30yfi3Q0jitytMOF3oKdw'
      ]
    },
    {
      name: 'City Crossbody',
      slug: 'city-crossbody',
      description: 'A sleek, structured black leather crossbody bag photographed against a warm, off-white background. The lighting is crisp, accentuating the smooth finish and precise stitching of the bag\'s edges.',
      price: 195,
      comparePrice: 220,
      categorySlug: 'crossbody',
      stock: 50,
      isFeatured: true,
      sku: 'CRO-001',
      attributes: JSON.stringify({ material: 'Black Leather' }),
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDroUvOs08R02lGLlMt5PZI6aZnoumKmZrxdsm4QpKIew5n1qO5rNpL4Nqi2wyygY8LHhvfqEpcntC97oQrg8gYwRMVQABpqe_Q-DYyquFicj42TMZApIImFyr0jSRvuuhOQx4PmwIFpY4GLStB7URGHTtTbrnMlmdePvjWGphEsbMW0to1zgX1fKOmHaa9xVZpRMZ8lxKQZo4CDHDJ1q_21xtS3rQXYtCjNDZg_8OjvzyNssUkZNoD5Q'
      ]
    },
    {
      name: 'Artisan Weekender',
      slug: 'artisan-weekender',
      description: 'A premium weekender bag made of heavy-duty cream canvas with rich brown leather accents and straps. It sits on a subtle, lightly textured surface with soft, diffused lighting that highlights the contrast between the canvas and leather.',
      price: 340,
      comparePrice: null,
      categorySlug: 'travel',
      stock: 15,
      isFeatured: true,
      sku: 'TRA-001',
      attributes: JSON.stringify({ material: 'Cream Canvas & Brown Leather' }),
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDROTmXqEDv-7HvXAYGVl07a5BM7K8xe5WdatTxBNwnk4n6-J6g2zu5RS4auEIoEdhjCmBwC0bNeWa0CyK125_dYTvYaqRcujJOJ1PTveUOF1U1jLb5JcE8rtBh_fR12NNV36UQP3KDplY9AAqEDBNoJmYfwXHuH53eNaaVPeYLY24yX6yXWX9kHX68dQorAepwRJk0xGhiFxiZ5pmXCBKkX3JVQHfR7vdfY6vMbJp-EyIaAKxxNEUyhg'
      ]
    },
    {
      name: 'Heritage Backpack',
      slug: 'heritage-backpack',
      description: 'A beautifully crafted leather backpack in a warm saddle brown color, positioned straight-on against a minimal, neutral background. The lighting emphasizes the natural grain and slight patina of the leather.',
      price: 420,
      comparePrice: 480,
      categorySlug: 'travel',
      stock: 20,
      isFeatured: true,
      sku: 'TRA-002',
      attributes: JSON.stringify({ material: 'Saddle Brown Leather' }),
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBjlTYQRjudGgwzOUaxflvhhWgANPka3psATqymZWrUe9PD58XBpw0Dk162A-OrIJDS0VOI2HwJyRU11oOYC2FGicTV_aiEOGchWGIyqlbFVFxlBmp7Ze22F-MDA_aglCLZzSBlzSwNz8Bg-cBGYNeV9VPYSVu4K-yd-3m_JymD6QD0Z02UCxLahxyH1QQiBZXyW86Ok-ji1RV0HtbikfjV6xIeXNljDy3fSxOtTOHz_J1k7Bkv7FX2bA'
      ]
    }
  ];

  // For visual testing, we'll duplicate the products a few times to fill out the products page grid
  const fullProductsData = [...productsData, ...productsData.map(p => ({
    ...p,
    name: `${p.name} - Version 2`,
    slug: `${p.slug}-v2`,
    sku: `${p.sku}-V2`,
    isFeatured: false,
  })), ...productsData.map(p => ({
    ...p,
    name: `${p.name} - Version 3`,
    slug: `${p.slug}-v3`,
    sku: `${p.sku}-V3`,
    isFeatured: false,
  }))];


  for (const prod of fullProductsData) {
    const product = await prisma.product.create({
      data: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        comparePrice: prod.comparePrice,
        sku: prod.sku,
        stock: prod.stock,
        isFeatured: prod.isFeatured,
        attributes: prod.attributes,
        categoryId: createdCategories[prod.categorySlug].id,
      },
    });

    for (let i = 0; i < prod.images.length; i++) {
      await prisma.productImage.create({
        data: {
          url: prod.images[i],
          productId: product.id,
          sortOrder: i,
        },
      });
    }
  }

  console.log('Database seeded successfully with Stitch prototype data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
