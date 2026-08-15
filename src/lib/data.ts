/**
 * Placeholder catalogue data for the FE-04 skeleton.
 * Real menu data / imagery arrives in a later phase — these keep the
 * homepage and /menu sections rendering real, mapped content today.
 *
 * `emoji` stands in for food photography in the skeleton so we avoid
 * broken images and external image dependencies.
 */

export type Category = {
  id: string;
  name: string;
  emoji: string;
};

export type Product = {
  id: string;
  name: string;
  blurb: string;
  price: number;
  emoji: string;
  /** Optional merchandising tag, e.g. "Popular", "-20%". */
  tag?: string;
};

export const categories: Category[] = [
  { id: "pizza", name: "Pizza", emoji: "🍕" },
  { id: "burgers", name: "Burgers", emoji: "🍔" },
  { id: "sushi", name: "Sushi", emoji: "🍣" },
  { id: "desserts", name: "Desserts", emoji: "🍰" },
  { id: "drinks", name: "Drinks", emoji: "🥤" },
  { id: "healthy", name: "Healthy", emoji: "🥗" },
  { id: "noodles", name: "Noodles", emoji: "🍜" },
  { id: "coffee", name: "Coffee", emoji: "☕" },
];

export const mostPopular: Product[] = [
  { id: "p1", name: "Bamboo Margherita", blurb: "Fresh basil, mozzarella, tomato", price: 9.5, emoji: "🍕", tag: "Popular" },
  { id: "p2", name: "Panda Double Smash", blurb: "Two beef patties, cheddar, house sauce", price: 8.0, emoji: "🍔", tag: "Popular" },
  { id: "p3", name: "Dragon Roll Set", blurb: "8 pieces, spicy mayo, avocado", price: 12.0, emoji: "🍣" },
  { id: "p4", name: "Molten Choc Cake", blurb: "Warm centre, vanilla scoop", price: 5.5, emoji: "🍰" },
];

export const dailyDeals: Product[] = [
  { id: "d1", name: "Lunch Combo", blurb: "Burger + fries + drink", price: 7.5, emoji: "🍟", tag: "-25%" },
  { id: "d2", name: "Family Pizza Night", blurb: "2 large pizzas + sides", price: 19.0, emoji: "🍕", tag: "-30%" },
  { id: "d3", name: "Sweet Tooth Box", blurb: "4 desserts to share", price: 10.0, emoji: "🧁", tag: "-20%" },
];

export const pizzasAndBurgers: Product[] = [
  { id: "pb1", name: "Spicy Pepperoni", blurb: "Pepperoni, chilli flakes, mozzarella", price: 11.0, emoji: "🍕" },
  { id: "pb2", name: "Veggie Supreme", blurb: "Peppers, olives, mushroom, onion", price: 10.5, emoji: "🍕" },
  { id: "pb3", name: "Classic Cheeseburger", blurb: "Beef, cheddar, pickles, lettuce", price: 7.0, emoji: "🍔" },
  { id: "pb4", name: "Crispy Chicken Burger", blurb: "Buttermilk chicken, slaw, mayo", price: 7.5, emoji: "🍔" },
];
