export const CATEGORIES = [
  { id: "all", label: "All treats", icon: "sparkles" },
  { id: "cocktails", label: "Cocktails & juices", icon: "citrus" },
  { id: "shakes", label: "Milkshakes", icon: "cup" },
  { id: "crepes", label: "Crepes", icon: "cookie" },
  { id: "plates", label: "Kashta & fruit", icon: "cherry" },
];

// Prices transcribed from the supplied printed menu, in Lebanese pounds.
// Each product has an explicit local, optimized image; see docs/stock-media.md.
export const MENU = [
  {
    id: 1,
    category: "cocktails",
    name: "Fruit Pieces Cocktail",
    arabic: "كوكتيل شقف",
    description: "A colorful mix of seasonal fruit, freshly cut.",
    featured: true,
    image: "/images/fruit-pieces-real.webp",
    options: [
      { label: "Medium", price: 300000 },
      { label: "Large", price: 400000 },
    ],
  },
  {
    id: 2,
    category: "cocktails",
    name: "Blended Cocktail",
    arabic: "كوكتيل مخفوق",
    description: "Silky seasonal fruits blended to order.",
    image: "/images/juice-blended.webp",
    options: [
      { label: "Medium", price: 200000 },
      { label: "Large", price: 300000 },
      { label: "Bottle", price: 600000 },
    ],
  },
  {
    id: 3,
    category: "cocktails",
    name: "Avocado",
    arabic: "أفوكادو",
    description: "Rich avocado blend, creamy and satisfying.",
    featured: true,
    image: "/images/juice-avocado.webp",
    options: [
      { label: "Medium", price: 350000 },
      { label: "Large", price: 500000 },
      { label: "Bottle", price: 800000 },
    ],
  },
  {
    id: 4,
    category: "cocktails",
    name: "Pineapple",
    arabic: "أناناس",
    description: "Bright tropical pineapple, naturally refreshing.",
    image: "/images/juice-pineapple.webp",
    options: [
      { label: "Medium", price: 300000 },
      { label: "Large", price: 400000 },
      { label: "Bottle", price: 800000 },
    ],
  },
  {
    id: 5,
    category: "cocktails",
    name: "Strawberry",
    arabic: "فراولة",
    description: "Sweet strawberries blended into a summer classic.",
    image: "/images/juice-strawberry.webp",
    options: [
      { label: "Medium", price: 200000 },
      { label: "Large", price: 300000 },
      { label: "Bottle", price: 600000 },
    ],
  },
  {
    id: 6,
    category: "cocktails",
    name: "Lemonade",
    arabic: "ليموناضة",
    description: "Zesty, bright and made fresh for every order.",
    image: "/images/juice-lemonade.webp",
    options: [
      { label: "Medium", price: 200000 },
      { label: "Large", price: 300000 },
      { label: "Bottle", price: 600000 },
    ],
  },
  {
    id: 7,
    category: "cocktails",
    name: "Pomegranate",
    arabic: "رمان",
    description: "Deep ruby pomegranate with a vibrant finish.",
    image: "/images/juice-pomegranate.webp",
    options: [
      { label: "Medium", price: 300000 },
      { label: "Large", price: 400000 },
      { label: "Bottle", price: 800000 },
    ],
  },
  {
    id: 8,
    category: "cocktails",
    name: "Orange",
    arabic: "برتقال",
    description: "Freshly squeezed orange packed with sunshine.",
    image: "/images/juice-orange.webp",
    options: [
      { label: "Medium", price: 200000 },
      { label: "Large", price: 300000 },
      { label: "Bottle", price: 600000 },
    ],
  },
  {
    id: 9,
    category: "cocktails",
    name: "Cantaloupe",
    arabic: "شمام",
    description: "Light, mellow and naturally sweet.",
    image: "/images/juice-cantaloupe.webp",
    options: [
      { label: "Medium", price: 200000 },
      { label: "Large", price: 300000 },
    ],
  },
  {
    id: 10,
    category: "cocktails",
    name: "Berry",
    arabic: "توت",
    description: "A bold blend of juicy mixed berries.",
    image: "/images/juice-berry.webp",
    options: [
      { label: "Medium", price: 300000 },
      { label: "Large", price: 400000 },
    ],
  },
  {
    id: 11,
    category: "cocktails",
    name: "Fekhfakhina",
    arabic: "فخفخينا",
    description: "The signature Lebanese fruit cocktail experience.",
    featured: true,
    image: "/images/fruit-pieces.webp",
    options: [
      { label: "Medium", price: 200000 },
      { label: "Large", price: 300000 },
      { label: "Bottle", price: 600000 },
    ],
  },
  {
    id: 12,
    category: "cocktails",
    name: "Apple & Carrot",
    arabic: "جزر وتفاح",
    description: "Crisp apple and earthy carrot, balanced perfectly.",
    image: "/images/juice-apple-carrot.webp",
    options: [
      { label: "Medium", price: 200000 },
      { label: "Large", price: 300000 },
      { label: "Bottle", price: 600000 },
    ],
  },
  {
    id: 13,
    category: "shakes",
    name: "Chocolate Milkshake",
    arabic: "ميلك شيك شوكولا",
    description: "Thick, cold and deeply chocolatey.",
    featured: true,
    image: "/images/shake-chocolate.webp",
    options: [
      { label: "Medium", price: 300000 },
      { label: "Large", price: 400000 },
    ],
  },
  {
    id: 14,
    category: "shakes",
    name: "Banana Milkshake",
    arabic: "ميلك شيك موز",
    description: "A smooth and creamy banana classic.",
    image: "/images/shake-banana.webp",
    options: [
      { label: "Medium", price: 200000 },
      { label: "Large", price: 300000 },
    ],
  },
  {
    id: 15,
    category: "crepes",
    name: "Nutella Crepe",
    arabic: "كريب نوتيلا",
    description: "Warm crepe folded around silky hazelnut chocolate.",
    featured: true,
    image: "/images/crepe-nutella.webp",
    options: [{ label: "Regular", price: 400000 }],
  },
  {
    id: 16,
    category: "crepes",
    name: "Kinder Crepe",
    arabic: "كريب كيندر",
    description: "Creamy Kinder chocolate in every warm bite.",
    image: "/images/crepe-kinder-representative.webp",
    options: [{ label: "Regular", price: 450000 }],
  },
  {
    id: 17,
    category: "crepes",
    name: "Oreo Crepe",
    arabic: "كريب أوريو",
    description: "Chocolate cream finished with Oreo crunch.",
    image: "/images/crepe-oreo-real.webp",
    options: [{ label: "Regular", price: 400000 }],
  },
  {
    id: 18,
    category: "crepes",
    name: "Lotus Crepe",
    arabic: "كريب لوتس",
    description: "Caramelized biscuit spread with Lotus crumble.",
    image: "/images/crepe-lotus-real.webp",
    options: [{ label: "Regular", price: 400000 }],
  },
  {
    id: 19,
    category: "crepes",
    name: "Crunchy Crepe",
    arabic: "كريب كرانشي",
    description: "Chocolate, wafers and a satisfying crisp finish.",
    image: "/images/crepe-crunchy.webp",
    options: [{ label: "Regular", price: 450000 }],
  },
  {
    id: 20,
    category: "plates",
    name: "Kashta Plate",
    arabic: "قشطة",
    description: "Fresh Lebanese ashta, simply presented.",
    image: "/images/kashta-plain.webp",
    options: [{ label: "Medium", price: 400000 }],
  },
  {
    id: 21,
    category: "plates",
    name: "Kashta & Fruits",
    arabic: "قشطة وفواكه",
    description: "Creamy ashta surrounded by fresh seasonal fruit.",
    featured: true,
    image: "/images/kashta-fruit.webp",
    options: [{ label: "Medium", price: 500000 }],
  },
];

export const money = (value) =>
  new Intl.NumberFormat("en-US").format(value) + " L.L.";
export const cartKey = (id, size) => id + "-" + size;
export const totalPrice = (cart) =>
  cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
export const MAX_QUANTITY = 99;

export function makeLine(item, option, quantity = 1) {
  return {
    key: cartKey(item.id, option.label),
    id: item.id,
    name: item.name,
    image: item.image,
    size: option.label,
    price: option.price,
    quantity,
  };
}

export function restoreCart(raw) {
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.reduce((lines, saved) => {
      if (
        !saved ||
        !Number.isSafeInteger(saved.quantity) ||
        saved.quantity <= 0
      )
        return lines;
      const item = MENU.find((entry) => entry.id === saved.id);
      const option = item?.options.find((size) => size.label === saved.size);
      if (!option) return lines;
      const existing = lines.find(
        (line) => line.key === cartKey(item.id, option.label),
      );
      if (existing)
        existing.quantity = Math.min(
          MAX_QUANTITY,
          existing.quantity + saved.quantity,
        );
      else
        lines.push(
          makeLine(item, option, Math.min(MAX_QUANTITY, saved.quantity)),
        );
      return lines;
    }, []);
  } catch {
    return [];
  }
}

export function whatsappUrl(cart, details = {}) {
  const delivery = details.method === "delivery";
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);
  const lines = cart.flatMap((line, index) => [
    `${index + 1}. *${line.name}*`,
    `   Size: ${line.size} · Qty: ${line.quantity}`,
    `   ${money(line.price)} each · Line total: ${money(line.price * line.quantity)}`,
    "",
  ]);
  const message = [
    "*BEIRUT SWEETS*", "Order request", "──────────────────", "",
    "*ORDER DETAILS*",
    "Order type: " + (delivery ? "Delivery" : "Pickup"),
    details.name?.trim() ? "Name: " + details.name.trim() : null,
    delivery && details.address?.trim() ? "Delivery address: " + details.address.trim() : null,
    "", "*YOUR SELECTION*", ...lines, "──────────────────",
    `Total quantity: ${count} ${count === 1 ? "item" : "items"}`,
    "*Items total: " + money(totalPrice(cart)) + "*",
    delivery ? "Delivery fee: to be confirmed (not included above)." : "Collection: at the restaurant.",
    ...(details.notes?.trim() ? ["", "*SPECIAL REQUESTS*", "Notes: " + details.notes.trim()] : []),
    "", "Please confirm availability, " + (delivery ? "delivery time and final total" : "pickup time") + ".", "Thank you!",
  ].filter(line => line !== null);
  return "https://wa.me/96176804192?text=" + encodeURIComponent(message.join("\n"));
}
