// Rewards catalog (from the Cav Connect prototype, slide 10).
// `stock` is the starting inventory. Each redemption uses one up — see
// remainingStock() below — so limited items can actually sell out.

export const REWARDS = [
  {
    id: "dining-5",
    name: "$5 Dining Credit",
    partner: "UVA Dine",
    category: "Dining",
    cost: 150,
    stock: 999,
    description: "Loaded to your student ID within 24 hours.",
    emoji: "🍽️",
  },
  {
    id: "bookstore-20",
    name: "20% Off Bookstore",
    partner: "UVA Bookstore",
    category: "Merchandise",
    cost: 200,
    stock: 999,
    description: "One-time code for apparel and gifts.",
    emoji: "🏷️",
  },
  {
    id: "cav-tee",
    name: "Cav Connect Launch Tee",
    partner: "UVA Athletics",
    category: "Merchandise",
    cost: 250,
    stock: 3,
    description: "Limited run. Pick up at the JPJ box office.",
    emoji: "👕",
  },
  {
    id: "field-access",
    name: "Postgame Field Access",
    partner: "UVA Athletics",
    category: "Experiences",
    cost: 400,
    stock: 10,
    description: "Meet the team on the field after a home game.",
    emoji: "🏟️",
  },
  {
    id: "bb-lottery",
    name: "Basketball Ticket Lottery Entry",
    partner: "UVA Athletics",
    category: "Experiences",
    cost: 500,
    stock: 999,
    description: "One entry into the next JPJ student lottery.",
    emoji: "🎟️",
  },
  {
    id: "hoodie",
    name: "Retro Cavalier Hoodie",
    partner: "UVA Bookstore",
    category: "Merchandise",
    cost: 600,
    stock: 0,
    description: "Sold out — restocking in December.",
    emoji: "🧥",
  },
];

// How many of this reward are left after the fan's own redemptions.
// (Front-end prototype: there's no server, so inventory is tracked per device.)
export function remainingStock(reward, redemptions) {
  const used = redemptions.filter((x) => x.rewardId === reward.id).length;
  return Math.max(0, reward.stock - used);
}
