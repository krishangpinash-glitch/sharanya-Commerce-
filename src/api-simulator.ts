import { sampleProducts, sampleCoupons, categories } from "./data";
import { Product, Category, Order, Address, Coupon, Review, Notification, CartItem } from "./types";

// Check if running in a static environment (e.g. GitHub Pages) where No Live Express Server exists
export const isStaticEnv = 
  typeof window !== "undefined" && 
  (window.location.hostname.endsWith("github.io") || 
   window.location.hostname.includes("github.io") || 
   window.location.search.includes("mockApi=true") ||
   (!window.location.hostname.includes(".run.app") && 
    !window.location.hostname.includes("localhost") && 
    !window.location.hostname.includes("127.0.0.1")));

if (isStaticEnv) {
  console.log("⚡ [SmartCommerce Base Path Resolve] Static GitHub Pages build environment detected.");
  console.log("🛠️  [SmartCommerce API Simulator] Intercepting fetch calls with high-fidelity localStorage client database.");
  initSimulatorLocalStorage();
  overrideGlobalFetch();
}

// -------------------------------------------------------------
// Database Initializer (synchronized from standard data seeds)
// -------------------------------------------------------------
function initSimulatorLocalStorage() {
  if (!localStorage.getItem("sc_users")) {
    const initialUsers = [
      { id: "user-1", name: "Sharanya Viswanathan", email: "pvsharanya21@gmail.com", password: "user123", mobile: "+91 9876543210", role: "Customer", gender: "Female", dob: "1998-05-12", profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
      { id: "admin-1", name: "Chief Commerce Admin", email: "admin@smartcommerce.com", password: "admin123", mobile: "+91 9999999999", role: "Admin", gender: "Male", dob: "1985-01-01", profilePic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" }
    ];
    localStorage.setItem("sc_users", JSON.stringify(initialUsers));
  }

  if (!localStorage.getItem("sc_categories")) {
    localStorage.setItem("sc_categories", JSON.stringify(categories));
  }

  if (!localStorage.getItem("sc_products")) {
    // Add additional products to complete initial catalog
    const expandedProducts = [...sampleProducts];
    
    // Ensure all 7 products described are loaded if not already completely filled
    const pIds = expandedProducts.map(p => p.id);
    if (!pIds.includes("prod-groc-1")) {
      expandedProducts.push({
        id: "prod-groc-1",
        name: "Artisan Ethiopian Yirgacheffe Coffee Beans (Single Origin)",
        description: "Light-medium roast whole organic coffee beans sourced directly from the high-altitude fields of Yirgacheffe, Ethiopia. Delivers exceptional floral notes, bright citrus acidity, and rich jasmine fragrance.",
        category: "grocery",
         brand: "Artisan Coffee",
         sku: "ART-ETH-YIRG-500",
         price: 28,
         discountPrice: 22,
         quantity: 150,
         images: [
           "https://images.unsplash.com/photo-1559056191-72147ef31e13?w=600&auto=format&fit=crop&q=80",
           "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80"
         ],
         specifications: {
           "Origin": "Yirgacheffe, Ethiopia (Single-Origin Specialty Grain)",
           "Roast Level": "Light-Medium Roast profiles",
           "Flavor Accents": "Meyer Lemon, Floral Tea, Mandarin Honey",
           "Package Net Weight": "500g"
         },
         weight: "500g",
         dimensions: "220 x 110 x 60 mm",
         warranty: "Freshly roasted. Best consumed within 12 months.",
         rating: 4.9,
         numReviews: 83,
         isBestseller: true,
         isNew: true
      });
    }

    if (!pIds.includes("prod-groc-2")) {
      expandedProducts.push({
        id: "prod-groc-2",
        name: "Gourmet Madagascar Organic Dark Chocolate (85% Cocoa Blend)",
        description: "Artisanal hand-tempered single-origin Madagascar cocoa bar. Infused with natural Bourbon vanilla, dynamic sea salt crystals, and a velvety smooth cocoa-butter profile.",
        category: "grocery",
        brand: "Chocolatier Royale",
         sku: "CHOC-85-MAD-100",
         price: 12,
         discountPrice: 9.5,
         quantity: 200,
         images: [
           "https://images.unsplash.com/photo-1549007994-cb92ca813bec?w=600&auto=format&fit=crop&q=80",
           "https://images.unsplash.com/photo-1504973960431-1c467e159aa4?w=600&auto=format&fit=crop&q=80"
         ],
         specifications: {
           "Cocoa Mass percentage": "85% Single-Origin Madagascar Cocoa",
           "Ingredients": "Madagascar Cocoa Beans, Organic Sugar, Pure Cocoa Butter, Sea Salt, Vanilla",
           "Diets supported": "Gluten-Free, Certified Organic, Vegan Friendly",
           "Bar Net Weight": "100g premium golden foil wrapping"
         },
         weight: "100g",
         dimensions: "160 x 80 x 10 mm",
         warranty: "100% Organic, Fair Trade Sourced ingredient warranty",
         rating: 4.8,
         numReviews: 47,
         isTrending: true
      });
    }

    if (!pIds.includes("prod-books-1")) {
      expandedProducts.push({
         id: "prod-books-1",
         name: "Universal Design Systems: Principles and Custom Code",
         description: "The complete hardcover professional textbook for modern UX Designers and Software Architects. Learn tokenization, cross-framework layouts, component API patterns, fluid typography scaling, and real production Figma conversions.",
         category: "books",
         brand: "DesignTech Press",
         sku: "BK-UDS-2026",
         price: 55,
         discountPrice: 45,
         quantity: 75,
         images: [
           "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
           "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80"
         ],
         specifications: {
           "ISBN-13": "978-3-16-148410-0",
           "Cover Type": "Premium Linen Hardbound with Metallic Ribbon Marker",
           "Pages count": "480 Pages, printed in full-color soy oil inks",
           "Target Audience": "Senior UI/UX Designers, Frontend engineers, Tech Leads"
         },
         weight: "850g",
         dimensions: "240 x 170 x 32 mm",
         warranty: "Collectible Author signed edition guarantee",
         rating: 4.9,
         numReviews: 142,
         isBestseller: true
      });
    }

    if (!pIds.includes("prod-sports-1")) {
      expandedProducts.push({
         id: "prod-sports-1",
         name: "Stryder High-Density Alignment Yoga Mat",
         description: "Premium eco-friendly TPE yoga training mat featuring laser-engraved central alignment guide vectors, superior non-slip texture on both surfaces, and customized dual-layer thermal shock absorption system protecting sensitive joints.",
         category: "sports",
         brand: "Stryder",
         sku: "STRY-YGM-ALIGN-P",
         price: 65,
         discountPrice: 49,
         quantity: 80,
         images: [
           "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&auto=format&fit=crop&q=80",
           "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop&q=80"
         ],
         specifications: {
           "Thickness": "6mm Cushioning High-Responsive Memory Foam",
           "Material": "Eco-Friendly Recycled Biodegradable TPE",
           "Alignment Assist": "Laser Deep Engraved Linear vector guides"
         },
         weight: "1.1kg",
         dimensions: "1830 x 610 x 6 mm",
         warranty: "1 Year Non-Deformation & Core Peel Warranty",
         rating: 4.8,
         numReviews: 128,
         isBestseller: true
      });
    }

    if (!pIds.includes("prod-acc-1")) {
      expandedProducts.push({
         id: "prod-acc-1",
         name: "Helix Omnicharge 140W GaN Desktop Tower",
         description: "State-of-the-art Gallium Nitride multi-port high frequency desktop power brick. Integrates three USB-C PD3.1 ports and one smart USB-A port with digital power consumption display screen. Easily charge laptops, tablets and phones simultaneously.",
         category: "mobile-accessories",
         brand: "Helix",
         sku: "HX-OC-140GAN",
         price: 89,
         discountPrice: 69,
         quantity: 95,
         images: [
           "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
           "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80"
         ],
         specifications: {
           "Total Power Output": "140W Max Dynamic Balancing Power Tech",
           "Gate Material": "Navitas Premium GaNFast Power Semiconductors",
           "Interface LCD screen": "Real-time Watts & Voltage draw distribution matrix display"
         },
         weight: "295g",
         dimensions: "110 x 42 x 38 mm",
         warranty: "18 Months Global Damage Liability & Replacement Warranty",
         rating: 4.8,
         numReviews: 119,
         isNew: true,
         isBestseller: true
      });
    }

    if (!pIds.includes("prod-home-2")) {
      expandedProducts.push({
         id: "prod-home-2",
         name: "SilentAir H13 True HEPA Intelligent Purifier",
         description: "Advanced active home air quality purifier fitted with high efficiency medical-grade True HEPA filter capturing 99.97% of airborne pathogens, dust, pollens and odours. Integrates automatic PM2.5 monitoring and dynamic LED loop color indices.",
         category: "home-appliances",
         brand: "SilentAir",
         sku: "SA-H13-IPUR",
         price: 220,
         discountPrice: 179,
         quantity: 40,
         images: [
           "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80",
           "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80"
         ],
         specifications: {
           "Filter Standard": "Certified Medical-Grade True HEPA H13 Multi-layer setup",
           "CADR Rating": "320 m³/h volumetric output flow",
           "Decibels scale": "Silent Whispering night-quiet mode"
         },
         weight: "3.8kg",
         dimensions: "480 x 240 x 240 mm",
         warranty: "2 Years comprehensive electronics and motor coverage",
         rating: 4.8,
         numReviews: 95,
         isTrending: true
      });
    }

    localStorage.setItem("sc_products", JSON.stringify(expandedProducts));
  }

  if (!localStorage.getItem("sc_orders")) {
    const initialOrders = [
      {
        id: "SMC-2026-9041",
        date: "2026-06-08T10:15:30Z",
        status: "Delivered",
        items: [
          { productId: "prod-foot-1", productName: "Stryder Aero-Pace Running Shoes", productPrice: 95, quantity: 1, productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100" }
        ],
        total: 120,
        discountAmount: 25,
        payableAmount: 95,
        address: { id: "addr-1", fullName: "Sharanya Viswanathan", phone: "+91 9876543210", houseNumber: "Apt 4B, Harmony Towers", street: "IT Expressway, Sholinganallur", city: "Chennai", state: "Tamil Nadu", country: "India", pinCode: "600119" },
        paymentMethod: "UPI",
        paymentStatus: "Success"
      },
      {
        id: "SMC-2026-1182",
        date: "2026-06-09T14:22:15Z",
        status: "Shipped",
        items: [
          { productId: "prod-elec-2", productName: "VocalNoise Studio Pro Headset", productPrice: 249, quantity: 1, productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100" }
        ],
        total: 299,
        discountAmount: 50,
        payableAmount: 249,
        address: { id: "addr-1", fullName: "Sharanya Viswanathan", phone: "+91 9876543210", houseNumber: "Apt 4B, Harmony Towers", street: "IT Expressway, Sholinganallur", city: "Chennai", state: "Tamil Nadu", country: "India", pinCode: "600119" },
        paymentMethod: "Credit Card",
        paymentStatus: "Success"
      }
    ];
    localStorage.setItem("sc_orders", JSON.stringify(initialOrders));
  }

  if (!localStorage.getItem("sc_coupons")) {
    localStorage.setItem("sc_coupons", JSON.stringify(sampleCoupons));
  }

  if (!localStorage.getItem("sc_addresses")) {
    const initialAddresses = {
      "user-1": [
        { id: "addr-1", fullName: "Sharanya Viswanathan", phone: "+91 9876543210", houseNumber: "Apt 4B, Harmony Towers", street: "IT Expressway, Sholinganallur", city: "Chennai", state: "Tamil Nadu", country: "India", pinCode: "600119" },
        { id: "addr-2", fullName: "Sharanya Viswanathan (Office)", phone: "+91 9876543210", houseNumber: "B-Block, Elite Tech Park", street: "OMR Road", city: "Chennai", state: "Tamil Nadu", country: "India", pinCode: "600096" }
      ]
    };
    localStorage.setItem("sc_addresses", JSON.stringify(initialAddresses));
  }

  if (!localStorage.getItem("sc_carts")) {
    localStorage.setItem("sc_carts", JSON.stringify({}));
  }

  if (!localStorage.getItem("sc_wishlists")) {
    localStorage.setItem("sc_wishlists", JSON.stringify({}));
  }

  if (!localStorage.getItem("sc_reviews")) {
    const initialReviews = [
      { id: "rev-1", productId: "prod-elec-1", productName: "Quantum Ultra-Sync Smartphone 5G", userName: "Rohan Sharma", rating: 5, comment: "Absolutely brilliant phone! Charges in 15 minutes, camera detail is incredible. High quality product.", isSpam: false, date: "2026-06-01" },
      { id: "rev-2", productId: "prod-elec-1", productName: "Quantum Ultra-Sync Smartphone 5G", userName: "Deepa S.", rating: 4, comment: "Battery backup is average if you play 3D games constantly, but the 120W charging compensates perfectly. Recommended.", isSpam: false, date: "2026-06-03" },
      { id: "rev-3", productId: "prod-fash-1", productName: "Classic Italian Leather Bomber Jacket - Antique Brown", userName: "Aman Malhotra", rating: 5, comment: "Authentic premium leather. It smells amazing, stitching is precise, looks highly elegant. Sizing runs slightly snug.", isSpam: false, date: "2026-06-04" },
      { id: "rev-4", productId: "prod-elec-1", productName: "Quantum Ultra-Sync Smartphone 5G", userName: "Spam bot 300", rating: 1, comment: "!!! EARN $$$ EASY HOME ONLINE CLICKS NOW !!! CLICK SITE http://scammy-clicks.com !!!", isSpam: true, date: "2026-06-05" }
    ];
    localStorage.setItem("sc_reviews", JSON.stringify(initialReviews));
  }

  if (!localStorage.getItem("sc_notifications")) {
    const initialNotifs = [
      { id: "notif-1", title: "Out for Delivery!", text: "Your order #SMC-2026-9041 containing Stryder Aero-Pace Running Shoes represents successful delivery attempts today.", date: "2026-06-08T09:00:00Z", isRead: true, type: "order" },
      { id: "notif-2", title: "Low Stock Alert: VocNoise Headset", text: "Product: 'VocalNoise Studio Pro Gen-2 Headset' (SKU: VN-SP2-SLVR) has only 3 pieces left in main inventory warehouse.", date: "2026-06-10T11:45:00Z", isRead: false, type: "inventory" },
      { id: "notif-3", title: "Super Coupon Active!", text: "Unlock 20% off all catalog items above $100 value with check-out code: SMART20.", date: "2026-06-10T08:00:00Z", isRead: false, type: "offer" }
    ];
    localStorage.setItem("sc_notifications", JSON.stringify(initialNotifs));
  }
}

// Helper Getters & Setters
function getDB(key: string) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function setDB(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

// -------------------------------------------------------------
// Global overrides for Fetch function to redirect to Simulated API
// -------------------------------------------------------------
function overrideGlobalFetch() {
  const originalFetch = window.fetch;

  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const urlStr = typeof input === "string" ? input : input instanceof URL ? input.toString() : (input as any).url || "";
    
    // Check if path is targeted towards an API route
    if (urlStr.includes("/api/")) {
      const url = new URL(urlStr, window.location.origin);
      const pathname = url.pathname;
      const method = (init?.method || "GET").toUpperCase();
      const bodyData = init?.body && typeof init.body === "string" ? JSON.parse(init.body) : null;

      try {
        const responseResult = await handleMockRoute(pathname, method, bodyData, url.searchParams);
        
        // Return a mock OK fetch response matching browser paradigms
        return new Response(JSON.stringify(responseResult.body), {
          status: responseResult.status || 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (err: any) {
        console.error("Simulator request interception processing error:", err);
        return new Response(JSON.stringify({ message: err.message || "Interception dispatch error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // Direct fallback to real network routing for normal assets (JS, CSS, images)
    return originalFetch.apply(window, [input, init]);
  } as any;
}

// -------------------------------------------------------------
// HIGH-FIDELITY APP ROTATION LAYER (Replicates Express Logic Client-side)
// -------------------------------------------------------------
async function handleMockRoute(pathname: string, method: string, body: any, params: URLSearchParams) {
  // Define clean route segments matching
  const segs = pathname.split("/").filter(Boolean); // e.g., ["api", "products", "prod-1"]

  // --- 1. CATEGORIES ---
  if (segs[0] === "api" && segs[1] === "categories" && segs.length === 2 && method === "GET") {
    return { status: 200, body: getDB("sc_categories") };
  }

  // --- 2. REPORTS ---
  if (segs[0] === "api" && segs[1] === "admin" && segs[2] === "reports" && method === "GET") {
    const products = getDB("sc_products") as Product[];
    const orders = getDB("sc_orders") as Order[];
    const coupons = getDB("sc_coupons") as Coupon[];
    const reviews = getDB("sc_reviews") as Review[];
    
    const activeOrders = orders.filter(o => o.status !== "Cancelled");
    const totalRevenue = activeOrders.reduce((sum, o) => sum + o.payableAmount, 0);
    const lowStockCount = products.filter(p => p.quantity <= 5).length;
    const spamReviewsCount = reviews.filter(r => r.isSpam).length;

    // Build standard report statistics matches
    return {
      status: 200,
      body: {
        totalUsers: (getDB("sc_users")).length,
        totalProducts: products.length,
        totalCategories: 10,
        totalOrders: orders.length,
        revenue: totalRevenue,
        lowStockItemsCount: lowStockCount,
        activeCouponsCount: coupons.filter(c => c.isActive).length,
        spamReviewsCount: spamReviewsCount,
        categoryChart: [
          { name: "Electronics", count: products.filter(p => p.category === "electronics").length, revenue: orders.reduce((sum, o) => sum + (o.items.some(i => i.productId.includes("elec")) ? o.payableAmount : 0), 0) },
          { name: "Fashion", count: products.filter(p => p.category === "fashion").length, revenue: orders.reduce((sum, o) => sum + (o.items.some(i => i.productId.includes("fash")) ? o.payableAmount : 0), 0) },
          { name: "Footwear", count: products.filter(p => p.category === "footwear").length, revenue: orders.reduce((sum, o) => sum + (o.items.some(i => i.productId.includes("foot")) ? o.payableAmount : 0), 0) },
          { name: "Beauty", count: products.filter(p => p.category === "beauty").length, revenue: orders.reduce((sum, o) => sum + (o.items.some(i => i.productId.includes("beau")) ? o.payableAmount : 0), 0) },
          { name: "Home", count: products.filter(p => p.category === "home-appliances").length, revenue: orders.reduce((sum, o) => sum + (o.items.some(i => i.productId.includes("home")) ? o.payableAmount : 0), 0) }
        ],
        salesTrend: [
          { name: "Mon", sales: orders.length * 90 },
          { name: "Tue", sales: orders.length * 125 },
          { name: "Wed", sales: orders.length * 160 },
          { name: "Thu", sales: orders.length * 210 },
          { name: "Fri", sales: orders.length * 310 },
          { name: "Sat", sales: orders.length * 480 },
          { name: "Sun", sales: orders.length * 520 }
        ]
      }
    };
  }

  // --- 3. PRODUCTS GET CATALOG ---
  if (segs[0] === "api" && segs[1] === "products") {
    const products = getDB("sc_products") as Product[];

    // Detail query: /api/products/:id
    if (segs.length === 3 && method === "GET") {
      const pId = segs[2];
      const p = products.find(prod => prod.id === pId);
      if (!p) return { status: 404, body: { message: "Product not located in catalogue." } };
      return { status: 200, body: p };
    }

    // Detail query: /api/products/:id/stock (Update stock)
    if (segs.length === 4 && segs[3] === "stock" && method === "PUT") {
      const pId = segs[2];
      const p = products.find(prod => prod.id === pId);
      if (!p) return { status: 404, body: { message: "Product not located." } };
      p.quantity = Number(body.quantity);
      setDB("sc_products", products);
      return { status: 200, body: { message: "Stock quantity synchronized", product: p } };
    }

    // Delete query: /api/products/:id
    if (segs.length === 3 && method === "DELETE") {
      const pId = segs[2];
      const filtered = products.filter(prod => prod.id !== pId);
      setDB("sc_products", filtered);
      return { status: 200, body: { message: "Product removed successfully" } };
    }

    // Add query: /api/products (POST)
    if (segs.length === 2 && method === "POST") {
      const newId = `prod-${body.category}-${products.length + 1}`;
      const newProd: Product = {
        id: newId,
        name: body.name,
        description: body.description,
        category: body.category,
        brand: body.brand,
        sku: body.sku || "SKU-" + Math.floor(Math.random() * 900000),
        price: Number(body.price),
        discountPrice: body.discountPrice ? Number(body.discountPrice) : undefined,
        quantity: Number(body.quantity) || 10,
        images: body.images && body.images.length ? body.images : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"],
        specifications: body.specifications || {},
        weight: body.weight || "0.5kg",
        dimensions: body.dimensions || "10x10x10 cm",
        warranty: body.warranty || "1 Year Brand",
        rating: 5,
        numReviews: 0,
        isNew: true
      };
      products.push(newProd);
      setDB("sc_products", products);

      // Trigger automatic welcome notification
      const notifs = getDB("sc_notifications");
      notifs.unshift({
        id: "notif-prod-" + Date.now().toString(),
        title: "New Product Arrival! 🚀",
        text: `Hot entry in ${newProd.category}: check out "${newProd.name}" by ${newProd.brand} now available for sale for just $${newProd.price}!`,
        date: new Date().toISOString(),
        isRead: false,
        type: "inventory"
      });
      setDB("sc_notifications", notifs);

      return { status: 201, body: { message: "Product added to catalog", product: newProd } };
    }

    // List categories/search/sorting: GET /api/products?category=...&search=...&sorting=...
    if (segs.length === 2 && method === "GET") {
      let list = [...products];
      const category = params.get("category");
      const search = params.get("search");
      const sorting = params.get("sorting") || params.get("sort"); // handle both query formats

      if (category && category !== "all") {
        list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
      }
      if (sorting) {
        if (sorting === "price_asc" || sorting === "price_low_high") {
          list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        } else if (sorting === "price_desc" || sorting === "price_high_low") {
          list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        } else if (sorting === "popular") {
          list.sort((a, b) => b.rating - a.rating);
        } else if (sorting === "newest") {
          list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        }
      }
      return { status: 200, body: list };
    }
  }

  // --- 4. CART OPERATIONS ---
  if (segs[0] === "api" && segs[1] === "cart" && segs.length >= 3) {
    const userId = segs[2];
    const carts = getDB("sc_carts") as Record<string, CartItem[]>;
    if (!carts[userId]) carts[userId] = [];

    // GET /api/cart/:userId
    if (segs.length === 3 && method === "GET") {
      return { status: 200, body: carts[userId] };
    }

    // POST /api/cart/:userId (Add/increment item)
    if (segs.length === 3 && method === "POST") {
      const { productId, quantity } = body;
      const existing = carts[userId].find(i => i.productId === productId);
      if (existing) {
        existing.quantity += (quantity || 1);
      } else {
        carts[userId].push({ productId, quantity: (quantity || 1) });
      }
      setDB("sc_carts", carts);
      return { status: 200, body: carts[userId] };
    }

    // PUT /api/cart/:userId (Overwrite quantity)
    if (segs.length === 3 && method === "PUT") {
      const { productId, quantity } = body;
      const existing = carts[userId].find(i => i.productId === productId);
      if (existing) {
        existing.quantity = quantity;
        if (existing.quantity <= 0) {
          carts[userId] = carts[userId].filter(i => i.productId !== productId);
        }
      }
      setDB("sc_carts", carts);
      return { status: 200, body: carts[userId] };
    }

    // DELETE /api/cart/:userId/:productId
    if (segs.length === 4 && method === "DELETE") {
      const productId = segs[3];
      carts[userId] = carts[userId].filter(i => i.productId !== productId);
      setDB("sc_carts", carts);
      return { status: 200, body: carts[userId] };
    }
  }

  // --- 5. WISHLIST OPERATIONS ---
  if (segs[0] === "api" && segs[1] === "wishlist" && segs.length >= 3) {
    const userId = segs[2];
    const wishlists = getDB("sc_wishlists") as Record<string, string[]>;
    if (!wishlists[userId]) wishlists[userId] = [];

    // GET /api/wishlist/:userId
    if (segs.length === 3 && method === "GET") {
      return { status: 200, body: wishlists[userId] };
    }

    // POST /api/wishlist/:userId
    if (segs.length === 3 && method === "POST") {
      const { productId } = body;
      if (!wishlists[userId].includes(productId)) {
        wishlists[userId].push(productId);
      }
      setDB("sc_wishlists", wishlists);
      return { status: 200, body: wishlists[userId] };
    }

    // DELETE /api/wishlist/:userId/:productId
    if (segs.length === 4 && method === "DELETE") {
      const productId = segs[3];
      wishlists[userId] = wishlists[userId].filter(id => id !== productId);
      setDB("sc_wishlists", wishlists);
      return { status: 200, body: wishlists[userId] };
    }
  }

  // --- 6. ADDRESS OPERATIONS ---
  if (segs[0] === "api" && segs[1] === "addresses" && segs.length >= 3) {
    const userId = segs[2];
    const addresses = getDB("sc_addresses") as Record<string, Address[]>;
    if (!addresses[userId]) addresses[userId] = [];

    // GET /api/addresses/:userId
    if (segs.length === 3 && method === "GET") {
      return { status: 200, body: addresses[userId] };
    }

    // POST /api/addresses/:userId (Create Address)
    if (segs.length === 3 && method === "POST") {
      const newAddr: Address = {
        id: "addr-" + Date.now(),
        fullName: body.fullName,
        phone: body.phone,
        houseNumber: body.houseNumber,
        street: body.street,
        city: body.city,
        state: body.state,
        country: body.country,
        pinCode: body.pinCode
      };
      addresses[userId].push(newAddr);
      setDB("sc_addresses", addresses);
      return { status: 201, body: newAddr };
    }

    // DELETE /api/addresses/:userId/:addressId
    if (segs.length === 4 && method === "DELETE") {
      const addressId = segs[3];
      addresses[userId] = addresses[userId].filter(a => a.id !== addressId);
      setDB("sc_addresses", addresses);
      return { status: 200, body: { message: "Address deleted successfully", addresses: addresses[userId] } };
    }
  }

  // --- 7. COUPONS VALIDATE & CONTROLS ---
  if (segs[0] === "api" && segs[1] === "coupons") {
    const coupons = getDB("sc_coupons") as Coupon[];
    
    // GET /api/coupons (Admin Dashboard list)
    if (segs.length === 2 && method === "GET") {
      return { status: 200, body: coupons };
    }

    // POST /api/coupons (Create new coupon)
    if (segs.length === 2 && method === "POST") {
      const newC: Coupon = {
        code: body.code.toUpperCase(),
        type: body.type,
        value: Number(body.value),
        expiryDate: body.expiryDate || "2026-12-31",
        minBillValue: Number(body.minBillValue) || 50,
        isActive: true
      };
      coupons.push(newC);
      setDB("sc_coupons", coupons);
      return { status: 201, body: { message: "Coupon created", coupon: newC } };
    }

    // PUT /api/coupons/:code/toggle
    if (segs.length === 4 && segs[3] === "toggle" && method === "PUT") {
      const code = segs[2].toUpperCase();
      const c = coupons.find(coupon => coupon.code === code);
      if (!c) return { status: 404, body: { message: "Coupon not matched" } };
      c.isActive = !c.isActive;
      setDB("sc_coupons", coupons);
      return { status: 200, body: { message: `Coupon active state set to ${c.isActive}`, coupon: c } };
    }

    // POST /api/coupons/validate
    if (segs[2] === "validate" && method === "POST") {
      const code = (body.code || "").toUpperCase();
      const c = coupons.find(coupon => coupon.code === code);
      if (!c) {
        return { status: 400, body: { message: "Promo coupon code invalid or not found!" } };
      }
      if (!c.isActive) {
        return { status: 400, body: { message: "This coupon is currently inactive." } };
      }
      return { status: 200, body: c };
    }
  }

  // --- 8. REVIEWS ---
  if (segs[0] === "api" && segs[1] === "reviews") {
    const reviews = getDB("sc_reviews") as Review[];

    // GET /api/reviews
    if (segs.length === 2 && method === "GET") {
      return { status: 200, body: reviews };
    }

    // POST /api/reviews
    if (segs.length === 2 && method === "POST") {
      // Direct Spam analysis
      const commentText = body.comment || "";
      const isSpam = 
        commentText.includes("$$$") || 
        commentText.includes("http://") || 
        commentText.includes("CLICK NOW") || 
        commentText.includes("EARN") || 
        commentText.includes("scam");

      const newRev: Review = {
        id: "rev-" + Date.now().toString(),
        productId: body.productId,
        productName: body.productName || "SmartCommerce Product",
        userName: body.userName || "Anonymous Shopper",
        rating: Number(body.rating) || 5,
        comment: commentText,
        isSpam: isSpam,
        date: new Date().toISOString().split("T")[0]
      };
      
      reviews.push(newRev);
      setDB("sc_reviews", reviews);

      if (isSpam) {
        const notifs = getDB("sc_notifications");
        notifs.unshift({
          id: "notif-spam-" + Date.now(),
          title: "Intrusion Blocked: Review Spam",
          text: `Spam-filter isolated standard comment by "${newRev.userName}" on product code ${newRev.productId}. Review marked as hidden.`,
          date: new Date().toISOString(),
          isRead: false,
          type: "inventory"
        });
        setDB("sc_notifications", notifs);
      }

      return { status: 201, body: { message: "Review posted successfully", review: newRev } };
    }

    // DELETE /api/reviews/:id
    if (segs.length === 3 && method === "DELETE") {
      const revId = segs[2];
      const filtered = reviews.filter(r => r.id !== revId);
      setDB("sc_reviews", filtered);
      return { status: 200, body: { message: "Review deleted successfully" } };
    }
  }

  // --- 9. NOTIFICATIONS ---
  if (segs[0] === "api" && segs[1] === "notifications") {
    const notifications = getDB("sc_notifications") as Notification[];

    // GET /api/notifications
    if (segs.length === 2 && method === "GET") {
      return { status: 200, body: notifications };
    }

    // POST /api/notifications/read-all
    if (segs.length === 3 && segs[2] === "read-all" && method === "POST") {
      notifications.forEach(n => n.isRead = true);
      setDB("sc_notifications", notifications);
      return { status: 200, body: { message: "All notifications designated as read successfully." } };
    }
  }

  // --- 10. ORDERS ---
  if (segs[0] === "api" && segs[1] === "orders") {
    const orders = getDB("sc_orders") as Order[];

    // GET /api/orders
    if (segs.length === 2 && method === "GET") {
      return { status: 200, body: orders };
    }

    // PUT /api/orders/:id (Update order status)
    if (segs.length === 3 && method === "PUT") {
      const orderId = segs[2];
      const o = orders.find(ord => ord.id === orderId);
      if (!o) return { status: 404, body: { message: "Order not found" } };
      o.status = body.status;
      setDB("sc_orders", orders);

      // Trigger user order status update notification
      const notifs = getDB("sc_notifications");
      notifs.unshift({
        id: "notif-order-status-" + Date.now(),
        title: `Order Status: ${o.status}!`,
        text: `Your SmartCommerce order #${o.id} status is now updated to: ${o.status}. Watch progress closely.`,
        date: new Date().toISOString(),
        isRead: false,
        type: "order"
      });
      setDB("sc_notifications", notifs);

      return { status: 200, body: { message: "Order status updated successfully", order: o } };
    }

    // POST /api/orders (Create Order)
    if (segs.length === 2 && method === "POST") {
      const { userId, items, address, total, discountAmount, payableAmount, paymentMethod } = body;
      const orderId = "SMC-2026-" + Math.floor(1000 + Math.random() * 9000);
      const newOrder: Order = {
        id: orderId,
        date: new Date().toISOString(),
        status: "Confirmed",
        items,
        total,
        discountAmount,
        payableAmount,
        address,
        paymentMethod,
        paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Success"
      };

      // Reduce quantity of products stock
      const products = getDB("sc_products") as Product[];
      items.forEach((item: any) => {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          prod.quantity = Math.max(0, prod.quantity - item.quantity);
          if (prod.quantity <= 5) {
            const notifs = getDB("sc_notifications");
            notifs.unshift({
              id: "notif-stock-" + Date.now() + Math.random(),
              title: "Warehouse Stock Alert",
              text: `Critical! Product '${prod.name}' is running low (Current stock: ${prod.quantity}). Synchronize stock now.`,
              date: new Date().toISOString(),
              isRead: false,
              type: "inventory"
            });
            setDB("sc_notifications", notifs);
          }
        }
      });
      setDB("sc_products", products);

      // Save order
      orders.unshift(newOrder);
      setDB("sc_orders", orders);

      // Empty user cart
      const carts = getDB("sc_carts");
      carts[userId] = [];
      setDB("sc_carts", carts);

      // Welcome Order Notif
      const notifs = getDB("sc_notifications");
      notifs.unshift({
        id: "notif-order-" + Date.now(),
        title: "Order Placed Successfully!",
        text: `Your purchase of ${items.length} item(s) (Order ID: ${orderId}) is confirmed of value $${payableAmount}.`,
        date: new Date().toISOString(),
        isRead: false,
        type: "order"
      });
      setDB("sc_notifications", notifs);

      return { status: 201, body: { message: "Order processed successfully!", order: newOrder } };
    }
  }

  // --- 11. AUTHENTICATION & PROFILES ---
  if (segs[0] === "api" && segs[1] === "auth") {
    const users = getDB("sc_users") as any[];

    // POST /api/auth/login
    if (segs[2] === "login" && method === "POST") {
      const { email, password } = body;
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return { status: 401, body: { message: "Invalid credentials. Email not found in offline simulator." } };
      }
      if (user.password !== password) {
        return { status: 401, body: { message: "Invalid credentials. Incorrect password code." } };
      }
      return {
        status: 200,
        body: {
          message: "Login successful (Simulator)",
          token: "simulated-jwt-header-for-" + user.id,
          user: { id: user.id, name: user.name, email: user.email, mobile: user.mobile, role: user.role, gender: user.gender, dob: user.dob, profilePic: user.profilePic }
        }
      };
    }

    // POST /api/auth/register
    if (segs[2] === "register" && method === "POST") {
      const { name, email, mobile, password, gender, dob } = body;
      const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        return { status: 409, body: { message: "Email is already registered on SmartCommerce." } };
      }
      const newUser = {
        id: "user-" + (users.length + 1),
        name,
        email,
        password,
        mobile,
        role: "Customer",
        gender: gender || "Other",
        dob: dob || "1999-01-01",
        profilePic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
      };
      users.push(newUser);
      setDB("sc_users", users);
      return {
        status: 201,
        body: { message: "Account created successfully!", user: { id: newUser.id, name: newUser.name, email: newUser.email, role: "Customer" } }
      };
    }

    // POST /api/auth/google
    if (segs[2] === "google" && method === "POST") {
      const { email } = body;
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return { status: 404, body: { message: "Email not found in database." } };
      }
      return {
        status: 200,
        body: { message: "Google Sign-In successful", user }
      };
    }

    // POST /api/auth/google-register
    if (segs[2] === "google-register" && method === "POST") {
      const { email, name } = body;
      const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        return { status: 409, body: { message: "Email is already registered on SmartCommerce." } };
      }
      const userPart = email.split("@")[0];
      const cleanName = name || (userPart.charAt(0).toUpperCase() + userPart.slice(1));
      const newUser = {
        id: "user-" + (users.length + 1),
        name: cleanName,
        email: email.toLowerCase(),
        password: "google-auth-no-password",
        mobile: "+91 " + Math.floor(9000000000 + Math.random() * 999999999),
        role: "Customer",
        gender: "Other",
        dob: "1999-01-01",
        profilePic: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(userPart)}`
      };
      users.push(newUser);
      setDB("sc_users", users);
      return {
        status: 201,
        body: { message: "Google account registered and verified!", user: newUser }
      };
    }

    // POST /api/auth/reset-password
    if (segs[2] === "reset-password" && method === "POST") {
      const { target, password } = body;
      const user = users.find(u => u.email.toLowerCase() === target.toLowerCase() || u.mobile === target);
      if (!user) {
        return { status: 404, body: { message: "No matched registered account found." } };
      }
      user.password = password;
      setDB("sc_users", users);
      return { status: 200, body: { message: "Password updated successfully!" } };
    }

    // PUT /api/auth/update-profile
    if (segs[2] === "update-profile" && method === "PUT") {
      const { userId, name, mobile, gender, dob, profilePic } = body;
      const user = users.find(u => u.id === userId);
      if (!user) return { status: 404, body: { message: "User not found to update." } };
      if (name) user.name = name;
      if (mobile) user.mobile = mobile;
      if (gender) user.gender = gender;
      if (dob) user.dob = dob;
      if (profilePic) user.profilePic = profilePic;
      setDB("sc_users", users);
      return { status: 200, body: { message: "Profile updated successfully!", user } };
    }
  }

  // --- 12. CHATBOT PREVIEWS ---
  if (segs[0] === "api" && segs[1] === "chatbot" && method === "POST") {
    const textQuery = (body.message || "").toLowerCase();
    
    // Heuristic Context Synthesis
    const products = getDB("sc_products") as Product[];
    const orders = getDB("sc_orders") as Order[];
    const coupons = getDB("sc_coupons") as Coupon[];

    let chatbotReply = "";

    if (textQuery.includes("coupon") || textQuery.includes("promo") || textQuery.includes("discount") || textQuery.includes("smart20")) {
      const codeList = coupons.filter(c => c.isActive).map(c => `* **${c.code}**: Get ${c.value}${c.type === "Percentage" ? "%" : "$"} off (Min spend: $${c.minBillValue})`).join("\n");
      chatbotReply = `Yes, we have active promo coupons waiting for you! ✨\n\n${codeList}\n\nMake sure to enter **SMART20** at checkout in your Customer Mobile App cart to claim an automatic 20% savings on Electronics!`;
    } 
    else if (textQuery.includes("order") || textQuery.includes("track") || textQuery.includes("smc-")) {
      // Find matches for order numbers
      const matchedOrder = orders.find(o => textQuery.includes(o.id.toLowerCase()));
      if (matchedOrder) {
        chatbotReply = `🔍 **Order Tracking Identified!**\n\nI located Order **${matchedOrder.id}** in our secure ledger database:\n* **Date Purchased**: ${new Date(matchedOrder.date).toLocaleDateString()}\n* **Current Status**: \`${matchedOrder.status}\` 🚚\n* **Payable Total**: $${matchedOrder.payableAmount} via ${matchedOrder.paymentMethod}\n* **Courier Address**: ${matchedOrder.address.houseNumber}, ${matchedOrder.address.street}, ${matchedOrder.address.city}\n\nOur delivery team is processing your cargo. We appreciate your shopping with SmartCommerce!`;
      } else if (orders.length > 0) {
        const latestO = orders[0];
        chatbotReply = `I couldn't locate that exact code, but referencing your latest history, Order **${latestO.id}** is in status **${latestO.status}** with a payable sum of $${latestO.payableAmount}. Let me know if you would like me to detail its shipping destination!`;
      } else {
        chatbotReply = `I notice you do not have any active purchases logged in our database currently. Why not browse our Electronics or Fashion catalog and make your first order? Use coupon **SMART20** to save 20%!`;
      }
    } 
    else if (textQuery.includes("electronics") || textQuery.includes("phone") || textQuery.includes("smartphone") || textQuery.includes("headset") || textQuery.includes("audio") || textQuery.includes("product") || textQuery.includes("catalog")) {
      const elecItems = products.slice(0, 4).map(p => `* **${p.name}** - Price: $${p.discountPrice || p.price} (_Brand: ${p.brand}, Stock: ${p.quantity} left_)`).join("\n");
      chatbotReply = `Here are some of our premium products available right now in our catalog:🛍️\n\n${elecItems}\n\nAny item looks interesting? Simply add it to your cart, and I can walk you through the payment options!`;
    } 
    else {
      chatbotReply = `👋 **Hello! I am your SmartCommerce AI Shopping Assistant** (Simulator Context Mode).\n\nI can assist you with:\n1. 🔍 **Browsing products**: Ask me what is in stock (e.g. \"Do you have electronics?\")\n2. 🚚 **Tracking orders**: Enter your order code (e.g., \"Track my order SMC-2026-1182\")\n3. 💸 **Claiming discounts**: Ask about our coupons (e.g., \"Are there active coupons?\")\n\nLet me know how I can help you today!`;
    }

    return {
      status: 200,
      body: { text: chatbotReply }
    };
  }

  // --- DEFAULT ROUTE ---
  return { status: 404, body: { message: `Simulated path '${pathname}' [${method}] not found.` } };
}
