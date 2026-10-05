export const initialCategories = [
  {
    name: "HOODIES",
    slug: "hoodies",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    description: "Heavyweight french terry hoodies, vintage washed & embroidered pieces",
    itemCount: 12,
    order: 1,
  },
  {
    name: "T-SHIRTS",
    slug: "t-shirts",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    description: "Drop shoulder oversized tees and vintage graphics",
    itemCount: 15,
    order: 2,
  },
  {
    name: "PANTS",
    slug: "pants",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    description: "Tactical cargos, wide-leg denim & vintage parachute trousers",
    itemCount: 10,
    order: 3,
  },
  {
    name: "JACKETS",
    slug: "jackets",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
    description: "Vintage bombers, workwear jackets & retro track tops",
    itemCount: 8,
    order: 4,
  },
  {
    name: "ACCESSORIES",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    description: "Caps, beanies, chains & streetwear crossbody bags",
    itemCount: 8,
    order: 5,
  },
];

export const initialProducts = [
  // 1. Trending Items from Mockup
  {
    title: "Dark Dreams Hoodie",
    slug: "dark-dreams-hoodie",
    price: 1699,
    originalPrice: 2499,
    category: "hoodies",
    description:
      "Premium 420 GSM french terry cotton hoodie featuring dark gothic back art and front chest typography. Washed black finish with hand-distressed detailing.",
    condition: "Mint Thrift Condition (9.5/10)",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 8,
    isTrending: true,
    isFeatured: true,
    isNewArrival: true,
  },
  {
    title: "Chaos Club Tee",
    slug: "chaos-club-tee",
    price: 899,
    originalPrice: 1299,
    category: "t-shirts",
    description:
      "Vintage cream off-white heavy cotton tee with 'Chaos Club' chest motif and oversized drop-shoulder silhouette. Pre-shrunk thrifted staple.",
    condition: "Authentic Thrift (9/10)",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    isTrending: true,
    isFeatured: true,
    isNewArrival: true,
  },
  {
    title: "Vintage Washed Tee",
    slug: "vintage-washed-tee",
    price: 949,
    originalPrice: 1499,
    category: "t-shirts",
    description:
      "Earthy brown mineral-washed heavyweight tee with minimal industrial typographic accents on chest and collar. Ultra-soft worn-in feel.",
    condition: "Vintage Curated (9.2/10)",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["M", "L", "XL"],
    stock: 12,
    isTrending: true,
    isFeatured: true,
    isNewArrival: false,
  },
  {
    title: "Utility Cargo Pants",
    slug: "utility-cargo-pants",
    price: 1599,
    originalPrice: 2299,
    category: "pants",
    description:
      "Wide-leg tactical black cargo pants featuring 6 utilitarian snap pockets, adjustable ankle bungee toggles, and reinforced knee paneling.",
    condition: "Grade A Condition (9.8/10)",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["30", "32", "34", "36"],
    stock: 10,
    isTrending: true,
    isFeatured: true,
    isNewArrival: true,
  },
  {
    title: "Neon Oversized Tee",
    slug: "neon-oversized-tee",
    price: 999,
    originalPrice: 1399,
    category: "t-shirts",
    description:
      "Charcoal acid-washed heavyweight tee with signature NEON micro-branding on chest. Relaxed boxy streetwear fit designed for layering.",
    condition: "Mint Vintage (9.5/10)",
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 14,
    isTrending: true,
    isFeatured: true,
    isNewArrival: false,
  },
  {
    title: "Essential Hoodie",
    slug: "essential-hoodie",
    price: 1499,
    originalPrice: 2199,
    category: "hoodies",
    description:
      "Minimalist sand khaki hoodie with double-layered crossover hood and no drawstrings for a sleek modern streetwear profile.",
    condition: "Near New (9.7/10)",
    images: [
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 9,
    isTrending: true,
    isFeatured: true,
    isNewArrival: true,
  },

  // 2. Additional Hoodies for Category Showcase
  {
    title: "Cyber Matrix Zip Hoodie",
    slug: "cyber-matrix-zip-hoodie",
    price: 1899,
    originalPrice: 2699,
    category: "hoodies",
    description:
      "Heavyweight full-zip charcoal hoodie with custom double-ended metal hardware, kangaroo split pockets, and cyber typographic embroidery.",
    condition: "Deadstock Condition (10/10)",
    images: [
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["M", "L", "XL"],
    stock: 6,
    isTrending: true,
    isFeatured: true,
    isNewArrival: true,
  },
  {
    title: "Washed Mineral Raw Hoodie",
    slug: "washed-mineral-raw-hoodie",
    price: 1749,
    originalPrice: 2399,
    category: "hoodies",
    description:
      "Stonewashed slate grey vintage pullover hoodie with raw edge seams and oversized drop shoulder construction.",
    condition: "Vintage Curated (9.3/10)",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L"],
    stock: 8,
    isTrending: false,
    isFeatured: true,
    isNewArrival: true,
  },
  {
    title: "Gothic Archival Pullover",
    slug: "gothic-archival-pullover",
    price: 1649,
    originalPrice: 2299,
    category: "hoodies",
    description:
      "Deep obsidian black pullover hoodie featuring vintage cross artwork and distressing on hood lip and cuffs.",
    condition: "Thrift Grade A (9.4/10)",
    images: [
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["M", "L", "XL"],
    stock: 11,
    isTrending: false,
    isFeatured: true,
    isNewArrival: false,
  },
  {
    title: "Off-Grid Heavyweight Fleece",
    slug: "off-grid-heavyweight-fleece",
    price: 1599,
    originalPrice: 2199,
    category: "hoodies",
    description:
      "460 GSM polar fleece lined streetwear hoodie in forest stone shade with concealed thumbhole cuffs.",
    condition: "Mint (9.8/10)",
    images: [
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 7,
    isTrending: false,
    isFeatured: true,
    isNewArrival: true,
  },
  {
    title: "Tokyo Underground Hoodie",
    slug: "tokyo-underground-hoodie",
    price: 1799,
    originalPrice: 2599,
    category: "hoodies",
    description:
      "Subtle Japanese kanji sleeve prints with large back distressed artwork. Heavyweight ribbing on waist and cuffs.",
    condition: "Vintage Curated (9.1/10)",
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["M", "L", "XL"],
    stock: 9,
    isTrending: false,
    isFeatured: true,
    isNewArrival: false,
  },
  {
    title: "Sandstorm Vintage Boxy Hoodie",
    slug: "sandstorm-vintage-boxy-hoodie",
    price: 1549,
    originalPrice: 2149,
    category: "hoodies",
    description:
      "Earth beige boxy cut hoodie with wide armholes and minimal tonal embroidery on sleeve.",
    condition: "Grade A (9.6/10)",
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L"],
    stock: 12,
    isTrending: false,
    isFeatured: true,
    isNewArrival: true,
  },

  // 3. T-Shirts
  {
    title: "Acid Wash Skeleton Graphic Tee",
    slug: "acid-wash-skeleton-tee",
    price: 949,
    originalPrice: 1399,
    category: "t-shirts",
    description:
      "Acid wash heavy cotton t-shirt with anatomical vintage screen-printed artwork. Pre-shrunk relaxed fit.",
    condition: "Authentic Vintage (9.3/10)",
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 14,
    isTrending: true,
    isFeatured: true,
    isNewArrival: true,
  },
  {
    title: "Archival Boxy White Heavy Tee",
    slug: "archival-boxy-white-tee",
    price: 849,
    originalPrice: 1199,
    category: "t-shirts",
    description:
      "Crisp 280 GSM heavyweight white cotton t-shirt with thick collar ribbing and wide boxy sleeves.",
    condition: "Deadstock (10/10)",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 20,
    isTrending: false,
    isFeatured: true,
    isNewArrival: false,
  },
  {
    title: "Tokyo Speed District Graphic Tee",
    slug: "tokyo-speed-district-tee",
    price: 999,
    originalPrice: 1449,
    category: "t-shirts",
    description:
      "Racing automotive archive graphic printed on washed charcoal cotton with distressed hems.",
    condition: "Thrift Grade A (9.2/10)",
    images: [
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["M", "L", "XL"],
    stock: 8,
    isTrending: false,
    isFeatured: true,
    isNewArrival: true,
  },

  // 4. Pants & Cargos
  {
    title: "Black Tactical Parachute Pants",
    slug: "black-tactical-parachute-pants",
    price: 1699,
    originalPrice: 2499,
    category: "pants",
    description:
      "Ripstop nylon parachute trousers with deep pleating, ankle toggles, and matte black hardware.",
    condition: "Mint (9.7/10)",
    images: [
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["30", "32", "34", "36"],
    stock: 8,
    isTrending: false,
    isFeatured: true,
    isNewArrival: true,
  },
  {
    title: "Vintage Baggy Denim",
    slug: "vintage-baggy-denim",
    price: 1799,
    originalPrice: 2599,
    category: "pants",
    description:
      "Mid-wash 90s skater baggy denim with custom fading around thighs and subtle distress at heels.",
    condition: "Curated Vintage (9.4/10)",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["30", "32", "34"],
    stock: 7,
    isTrending: false,
    isFeatured: true,
    isNewArrival: false,
  },

  // 5. Jackets
  {
    title: "Neon Bomber Varsity Jacket",
    slug: "neon-bomber-varsity-jacket",
    price: 2799,
    originalPrice: 3899,
    category: "jackets",
    description:
      "Black satin finish varsity bomber with custom NEON embroidered typography on the back and striped ribbed hem.",
    condition: "Curated Vintage Piece (9/10)",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["M", "L", "XL"],
    stock: 5,
    isTrending: false,
    isFeatured: true,
    isNewArrival: true,
  },
  {
    title: "Vintage Stonewash Denim Jacket",
    slug: "vintage-stonewash-denim-jacket",
    price: 2499,
    originalPrice: 3499,
    category: "jackets",
    description:
      "Classic heavyweight trucker denim jacket with vintage brass buttons and chest flap pockets.",
    condition: "Authentic Vintage (9.5/10)",
    images: [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["M", "L", "XL"],
    stock: 6,
    isTrending: false,
    isFeatured: true,
    isNewArrival: false,
  },

  // 6. Accessories
  {
    title: "Neon Heritage Embroidered Cap",
    slug: "neon-heritage-cap",
    price: 699,
    originalPrice: 999,
    category: "accessories",
    description:
      "Unstructured 6-panel dad cap in washed black twill with subtle tonal NEON embroidered logo and brass strap adjuster.",
    condition: "New Curated Deadstock (10/10)",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["ONE SIZE"],
    stock: 20,
    isTrending: false,
    isFeatured: true,
    isNewArrival: false,
  },
  {
    title: "Distressed Washed Vintage Beanie",
    slug: "distressed-washed-beanie",
    price: 599,
    originalPrice: 899,
    category: "accessories",
    description:
      "Ribbed knit fold-over fisherman beanie in washed slate grey with vintage raw stitch detailing.",
    condition: "New Curated Deadstock (10/10)",
    images: [
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["ONE SIZE"],
    stock: 18,
    isTrending: false,
    isFeatured: true,
    isNewArrival: true,
  },
  {
    title: "Silver Cuban Heavy Chain",
    slug: "silver-cuban-heavy-chain",
    price: 799,
    originalPrice: 1199,
    category: "accessories",
    description:
      "Stainless steel 8mm diamond cut curb cuban chain with heavy lobster claw clasp. Tarnishing resistant.",
    condition: "Deadstock (10/10)",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["50 CM", "60 CM"],
    stock: 15,
    isTrending: false,
    isFeatured: true,
    isNewArrival: false,
  },
];

export const initialBanners = {
  identifier: "home_banners",
  announcementText: "FREE SHIPPING ON ALL ORDERS ABOVE ₹1499",
  hero: {
    tag: "NEW ARRIVALS",
    title: "THRIFTED.\nCURATED.",
    subtitle: "Premium thrifted pieces. Handpicked for quality. Priced for you.",
    ctaText: "SHOP NOW",
    ctaLink: "/shop",
    image:
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=80",
  },
  heroSlides: [
    {
      tag: "NEW ARRIVALS",
      title: "THRIFTED.\nCURATED.",
      subtitle: "Premium thrifted pieces. Handpicked for quality. Priced for you.",
      ctaText: "SHOP NOW",
      ctaLink: "/shop",
      bgType: "image" as const,
      image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=80",
      bgColor: "#0c0c0c",
      textColor: "white" as const,
    },
    {
      tag: "VINTAGE DROP 2026",
      title: "EXCLUSIVE\nSTREETWEAR\nARCHIVES",
      subtitle: "Heavyweight graphic hoodies, Japanese denim & authentic vintage silhouettes.",
      ctaText: "EXPLORE HOODIES",
      ctaLink: "/shop?category=hoodies",
      bgType: "color" as const,
      bgColor: "#14151a",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80",
      textColor: "white" as const,
    },
    {
      tag: "LIMITED CURATION",
      title: "RAW EDGES.\nAUTHENTIC CUTS.",
      subtitle: "Up to 50% off select vintage jackets, cargo trousers and curated headwear.",
      ctaText: "VIEW SALE DROPS",
      ctaLink: "/shop?collections=all",
      bgType: "color" as const,
      bgColor: "#1a120b",
      image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1200&q=80",
      textColor: "white" as const,
    },
  ],
  valueProps: [
    {
      title: "FREE SHIPPING",
      subtitle: "On all orders above ₹1499",
      icon: "truck",
    },
    {
      title: "PREMIUM QUALITY",
      subtitle: "Handpicked & quality checked",
      icon: "award",
    },
    {
      title: "EASY RETURNS",
      subtitle: "Hassle free returns",
      icon: "package",
    },
    {
      title: "24/7 SUPPORT",
      subtitle: "We're here to help",
      icon: "headphones",
    },
  ],
  promoCards: [
    {
      tag: "NEW DROPS",
      title: "Every Week",
      ctaText: "EXPLORE",
      ctaLink: "/shop",
      image:
        "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80",
    },
    {
      tag: "PREMIUM THRIFT",
      title: "Handpicked Pieces",
      ctaText: "EXPLORE",
      ctaLink: "/shop",
      image:
        "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80",
    },
    {
      tag: "UP TO 50% OFF",
      title: "Limited Time Only",
      ctaText: "SHOP SALE",
      ctaLink: "/shop",
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    },
  ],
  shopByCategorySection: {
    enabled: true,
    title: "SHOP BY CATEGORY",
    limit: 5,
    selectedCategories: ["hoodies", "t-shirts", "pants", "jackets", "accessories"],
  },
  featuredCategorySection: {
    enabled: true,
    categorySlug: "hoodies",
    title: "FEATURED COLLECTION: HOODIES",
    subtitle: "Heavyweight french terry hoodies & vintage drops",
    limit: 10,
  },
  instagramFeed: [
    {
      image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=400&q=80",
      link: "https://instagram.com",
    },
    {
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80",
      link: "https://instagram.com",
    },
    {
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80",
      link: "https://instagram.com",
    },
    {
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=400&q=80",
      link: "https://instagram.com",
    },
    {
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=400&q=80",
      link: "https://instagram.com",
    },
    {
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=400&q=80",
      link: "https://instagram.com",
    },
    {
      image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=400&q=80",
      link: "https://instagram.com",
    },
    {
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
      link: "https://instagram.com",
    },
  ],
};

export const initialSettings = {
  identifier: "site_settings",
  storeName: "NEON",
  tagline: "Thrifted culture. Curated style. Pieces with a past, made for the present.",
  currency: "₹",
  freeShippingThreshold: 1499,
  supportEmail: "support@neonthrift.com",
  supportPhone: "+91 98765 43210",
  instagramHandle: "@neon.thrift",
  address: "Fashion District, Streetwear Vault",
  appDownload: {
    enabled: true,
    title: "DOWNLOAD OUR APP",
    subtitle: "Shop curated vintage streetwear on the go. Get instant drop alerts.",
    playStoreUrl: "https://play.google.com/store",
    appStoreUrl: "https://apps.apple.com",
  },
};

export const initialOrders = [
  {
    orderNumber: "NEON-1082",
    customer: {
      name: "Aarav Sharma",
      email: "aarav@example.com",
      phone: "+91 98765 11111",
      address: "Flat 402, Skyline Residency",
      city: "Mumbai",
      postalCode: "400001",
    },
    items: [
      {
        productId: "p1",
        title: "Dark Dreams Hoodie",
        price: 1699,
        quantity: 1,
        size: "L",
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
      },
    ],
    subtotal: 1699,
    shippingFee: 0,
    total: 1699,
    status: "processing",
    paymentMethod: "card",
    paymentStatus: "paid",
  },
  {
    orderNumber: "NEON-1081",
    customer: {
      name: "Riya Verma",
      email: "riya@example.com",
      phone: "+91 98765 22222",
      address: "14 Sector 22, Green Park",
      city: "New Delhi",
      postalCode: "110016",
    },
    items: [
      {
        productId: "p2",
        title: "Chaos Club Tee",
        price: 899,
        quantity: 1,
        size: "M",
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      },
      {
        productId: "p8",
        title: "Neon Heritage Embroidered Cap",
        price: 699,
        quantity: 1,
        size: "ONE SIZE",
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
      },
    ],
    subtotal: 1598,
    shippingFee: 0,
    total: 1598,
    status: "shipped",
    paymentMethod: "cod",
    paymentStatus: "pending",
  },
];

export const initialAbout = {
  identifier: "site_about",
  badge: "OUR PHILOSOPHY",
  title: "THRIFTED CULTURE. CURATED STYLE.",
  subtitle: "Pieces with a past, made for the present. Founded in 2024 to redefine vintage streetwear.",
  bannerImage: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80",
  storyTitle: "THE NEON VISION",
  storyContent: "Born in the underground streetwear movement, NEON reclaims authentic vintage silhouettes, heavy french terry fabrics, and timeless thrift drops for modern street expression.",
  pillars: [
    {
      number: "01. HANDPICKED",
      title: "HANDPICKED",
      description: "Every garment in our catalog is hand-selected from vintage markets, thrift vaults, and private collections across the globe. We check seams, zippers, prints, and fabric weight.",
    },
    {
      number: "02. RESTORED",
      title: "RESTORED",
      description: "Each item undergoes eco-friendly deep cleaning, conditioning, and quality grading before it hits our virtual drops. We preserve the authentic vintage character while ensuring modern wearability.",
    },
    {
      number: "03. ACCESSIBLE",
      title: "ACCESSIBLE",
      description: "Streetwear should not cost an arm and a leg. We price our drops fairly, offering true archival fits, heavy french terry cotton, and drop-shoulder silhouettes at realistic prices.",
    },
  ],
};
