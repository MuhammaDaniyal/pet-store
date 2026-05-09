/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import dotenv from "dotenv";

// Adjust these imports to point to your actual model files
import { User } from "../src/lib/models/User";
import { Category } from "../src/lib/models/Category";
import { Product } from "../src/lib/models/Product";
import { Review } from "../src/lib/models/Review";
import { Coupon } from "../src/lib/models/Coupon";
import { Cart } from "../src/lib/models/Cart";
import { Order } from "../src/lib/models/Order";

dotenv.config({ path: ".env.local" });    // Load environment variables from .env.local

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

// Helper to generate URL-friendly slugs
const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

async function seedDatabase() {
  try {
    console.log("⏳ Connecting to database...");
    await mongoose.connect(MONGODB_URI as string);
    console.log("✅ Connected to database.");

    console.log("🧹 Clearing existing data...");
    await Order.deleteMany({});
    await Cart.deleteMany({});
    await Review.deleteMany({});
    await Coupon.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    //await User.deleteMany({});

    // ----------------------------------------------------------------------
    // 1. SEED USERS
    // ----------------------------------------------------------------------
    console.log("🌱 Seeding Users...");
    /*
    const admin = await User.create({
      name: "Admin User",
      email: "admin@petstore.com",
      password: "hashed_password_placeholder",
      role: "admin",
      phone: "+1234567890",
      address: { street: "123 Admin Way", city: "Tech City", province: "CA", postalCode: "90210", country: "USA" }
    });
    */

    const customer = await User.create({
      name: "Mike Jack", // Matching the name from your UI screenshots
      email: "i230523@isb.nu.edu.pk",
      password: "$2b$12$XqFwE6RTp.5r60ECh4uyLen95f0xqb..CTurkT4BIkFcQKNPWmo46",
      role: "user",
      phone: "+923154686405",
      address: { street: "32 Khan Colony", city: "Gilgit", province: "Gilgit Baltistan", postalCode: "34873", country: "Pakistan" }
    });

    /*
    const customer2 = await User.create({
      name: "Steve", // Matching the name from your UI screenshots
      email: "steve@petstore.com",
      password: "skjsdhk34kj3h45j3h4kj4h3kj4h5k3j4h5k3j4h3",
      role: "user",
      phone: "+0987654321",
      address: { street: "0, 0 Spawn Point", city: "The Overworld", province: "Plains Biome", postalCode: "00000", country: "Minecraft" }
    });
    */

    // ----------------------------------------------------------------------
    // 2. SEED CATEGORIES
    // ----------------------------------------------------------------------
    console.log("🌱 Seeding Categories...");
    const categoriesData = [
      { name: "Dogs", slug: "dogs", icon: "🐕", description: "Loyal canine companions.", order: 1 },
      { name: "Cats", slug: "cats", icon: "🐱", description: "Elegant feline friends.", order: 2 },
      { name: "Birds", slug: "birds", icon: "🦜", description: "Beautiful feathered pets.", order: 3 },
      { name: "Fish", slug: "fish", icon: "🐟", description: "Aquatic life for your aquarium.", order: 4 },
      { name: "Small Pets", slug: "small-pets", icon: "🐹", description: "Cuddly small mammals.", order: 5 },
      { name: "Wild Pets", slug: "wild-pets", icon: "🦎", description: "Exotic reptiles and amphibians.", order: 6 },
      { name: "Other", slug: "other", icon: "🕷️", description: "Invertebrates and unique pets.", order: 7 },
    ];

    const createdCategories: Record<string, any> = {};
    for (const cat of categoriesData) {
      createdCategories[cat.slug] = await Category.create(cat);
    }

    // ----------------------------------------------------------------------
    // 3. SEED PRODUCTS
    // ----------------------------------------------------------------------
    console.log("🌱 Seeding Products...");

    const rawProducts = [
      // --- CATS (5) ---
      { name: 'Fluffy Persian', price: 799, categorySlug: 'cats', animalType: 'cat', age: 'Adult (2-7 years)', description: 'Elegant Persian cat with silky fur', imageUrl: 'https://images.unsplash.com/photo-1673125301348-d98f7af1ac40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzaWFuJTIwY2F0JTIwa2l0dGVufGVufDF8fHx8MTc3MzgxMzMyNnww&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: true },
      { name: 'Siamese Bella', price: 649, categorySlug: 'cats', animalType: 'cat', age: 'Young (6-24 months)', description: 'Graceful Siamese cat with blue eyes', imageUrl: 'https://images.unsplash.com/photo-1568152950566-c1bf43f4ab28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWFtZXNlJTIwY2F0fGVufDF8fHx8MTc3Mzc3ODQ1MHww&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: false },
      { name: 'British Blue', price: 729, categorySlug: 'cats', animalType: 'cat', age: 'Baby (0-6 months)', description: 'Charming British Shorthair kitten', imageUrl: 'https://images.unsplash.com/photo-1629624467541-f73ef8f12df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicml0aXNoJTIwc2hvcnRoYWlyJTIwY2F0fGVufDF8fHx8MTc3MzgyMzQ0MHww&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: false },
      { name: 'Maine Luna', price: 849, categorySlug: 'cats', animalType: 'cat', age: 'Adult (2-7 years)', description: 'Majestic Maine Coon with fluffy coat', imageUrl: 'https://images.unsplash.com/photo-1606213651356-0272cc0becd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWluZSUyMGNvb24lMjBjYXR8ZW58MXx8fHwxNzczODIzNDQwfDA&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: false },
      { name: 'Ragdoll Princess', price: 899, categorySlug: 'cats', animalType: 'cat', age: 'Young (6-24 months)', description: 'Elegant and calm breed', imageUrl: 'https://images.unsplash.com/photo-1685291989288-a48c55c22eac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWdkb2xsJTIwY2F0JTIwZmx1ZmZ5fGVufDF8fHx8MTc3MzgyNTUzNnww&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: false },

      // --- DOGS (6) ---
      { name: 'Golden Buddy', price: 599, categorySlug: 'dogs', animalType: 'dog', age: 'Baby (0-6 months)', description: 'Friendly and energetic Golden Retriever puppy', imageUrl: 'https://images.unsplash.com/photo-1615233500064-caa995e2f9dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjByZXRyaWV2ZXIlMjBwdXBweXxlbnwxfHx8fDE3NzM3MjM3NDl8MA&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: true },
      { name: 'Beagle Charlie', price: 699, categorySlug: 'dogs', animalType: 'dog', age: 'Young (6-24 months)', description: 'Loyal and loving beagle companion', imageUrl: 'https://images.unsplash.com/photo-1606833694770-40a04762ac16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFnbGUlMjBwdXBweXxlbnwxfHx8fDE3NzM4MTI1MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: false },
      { name: 'Labrador Max', price: 649, categorySlug: 'dogs', animalType: 'dog', age: 'Adult (2-7 years)', description: 'Playful Labrador with gentle nature', imageUrl: 'https://images.unsplash.com/photo-1566898366079-bfb480d669ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWJyYWRvciUyMGRvZyUyMHBldHxlbnwxfHx8fDE3NzM3OTc3MDh8MA&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: false },
      { name: 'Husky Storm', price: 899, categorySlug: 'dogs', animalType: 'dog', age: 'Young (6-24 months)', description: 'Beautiful Siberian Husky with blue eyes', imageUrl: 'https://images.unsplash.com/photo-1708892732612-3a7fb4335b93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodXNreSUyMGRvZyUyMHBldHxlbnwxfHx8fDE3NzM4MjM0NDB8MA&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: true },
      { name: 'Corgi Puppy', price: 899, categorySlug: 'dogs', animalType: 'dog', age: 'Baby (0-6 months)', description: 'Adorable and playful Corgi puppy', imageUrl: 'https://images.unsplash.com/photo-1622065713075-a5e28dcc802c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwY29yZ2klMjBkb2d8ZW58MXx8fHwxNzczODI1NTM1fDA&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: true },
      { name: 'Pomeranian', price: 799, categorySlug: 'dogs', animalType: 'dog', age: 'Young (6-24 months)', description: 'Tiny and energetic Pomeranian', imageUrl: 'https://images.unsplash.com/photo-1626211596179-d1fe8beaf75c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb21lcmFuaWFuJTIwcHVwcHl8ZW58MXx8fHwxNzczODI1NTM2fDA&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: false },

      // --- BIRDS (5) ---
      { name: 'Rainbow Parrot', price: 999, categorySlug: 'birds', animalType: 'bird', age: 'Young (6-24 months)', description: 'Vibrant and talkative macaw parrot', imageUrl: 'https://images.unsplash.com/photo-1584888890205-9b49eaf0c660?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHBhcnJvdCUyMGJpcmR8ZW58MXx8fHwxNzczODEyNTE5fDA&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: true },
      { name: 'Cockatiel Sunny', price: 349, categorySlug: 'birds', animalType: 'bird', age: 'Young (6-24 months)', description: 'Cheerful cockatiel with a happy song', imageUrl: 'https://images.unsplash.com/photo-1648398476212-6a5a77353e32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrYXRpZWwlMjBiaXJkfGVufDF8fHx8MTc3Mzc3ODQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: false },
      { name: 'Parakeet Pair', price: 279, categorySlug: 'birds', animalType: 'bird', age: 'Young (6-24 months)', description: 'Two adorable parakeets, perfect companions', imageUrl: 'https://images.unsplash.com/photo-1614025209598-00c231889bd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJha2VldCUyMGJpcmQlMjBwZXR8ZW58MXx8fHwxNzczODIzNDQxfDA&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: false },
      { name: 'Canary Melody', price: 199, categorySlug: 'birds', animalType: 'bird', age: 'Adult (2-7 years)', description: 'Beautiful yellow canary with sweet song', imageUrl: 'https://images.unsplash.com/photo-1654181920354-5c4add3989a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5hcnklMjBiaXJkJTIweWVsbG93fGVufDF8fHx8MTc3Mzc1OTc0N3ww&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: false },
      { name: 'Macaw Parrot', price: 1499, categorySlug: 'birds', animalType: 'bird', age: 'Adult (2-7 years)', description: 'Colorful and intelligent Blue Macaw', imageUrl: 'https://images.unsplash.com/photo-1652635966566-df3992f1a6f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwbWFjYXclMjBwYXJyb3R8ZW58MXx8fHwxNzczNzQwODAxfDA&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: true },

      // --- FISH (5) ---
      { name: 'Tropical Tank', price: 299, categorySlug: 'fish', animalType: 'fish', age: 'Adult (2-7 years)', description: 'Beautiful collection of tropical fish', imageUrl: 'https://images.unsplash.com/photo-1631300692372-d96d2d13c20c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGZpc2glMjBhcXVhcml1bXxlbnwxfHx8fDE3NzM3ODU1OTV8MA&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: true },
      { name: 'Goldfish Bowl', price: 149, categorySlug: 'fish', animalType: 'fish', age: 'Young (6-24 months)', description: 'Classic goldfish in decorative bowl', imageUrl: 'https://images.unsplash.com/photo-1592072467526-0506c6530493?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZmlzaCUyMGFxdWFyaXVtfGVufDF8fHx8MTc3MzgyMzQ0Mnww&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: false },
      { name: 'Betta Beauty', price: 89, categorySlug: 'fish', animalType: 'fish', age: 'Young (6-24 months)', description: 'Stunning colorful Betta fish', imageUrl: 'https://images.unsplash.com/photo-1573976366069-ee53f0cc76db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXR0YSUyMGZpc2glMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzM4MjM0NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: false },
      { name: 'Neon Tetra Shoal', price: 45, categorySlug: 'fish', animalType: 'fish', age: 'Baby (0-6 months)', description: 'School of glowing neon tetras', imageUrl: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&q=80', isFeatured: false },
      { name: 'Majestic Angelfish', price: 65, categorySlug: 'fish', animalType: 'fish', age: 'Adult (2-7 years)', description: 'Elegant freshwater angelfish pair', imageUrl: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=600&q=80', isFeatured: false },

      // --- SMALL PETS (5) ---
      { name: 'Snowball Bunny', price: 399, categorySlug: 'small-pets', animalType: 'small-animal', age: 'Young (6-24 months)', description: 'Adorable white rabbit with soft fur', imageUrl: 'https://images.unsplash.com/photo-1654015619377-2ea602839f98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJhYmJpdCUyMGJ1bm55fGVufDF8fHx8MTc3MzgwMzEwNXww&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: true },
      { name: 'Tiny Hamster', price: 199, categorySlug: 'small-pets', animalType: 'small-animal', age: 'Young (6-24 months)', description: 'Cute and playful dwarf hamster', imageUrl: 'https://images.unsplash.com/photo-1577099595920-bf19294bc408?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW1zdGVyJTIwcGV0fGVufDF8fHx8MTc3MzgxMzMyN3ww&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: false },
      { name: 'Guinea Duo', price: 329, categorySlug: 'small-pets', animalType: 'small-animal', age: 'Adult (2-7 years)', description: 'Two friendly guinea pigs, bonded pair', imageUrl: 'https://images.unsplash.com/photo-1732932772898-de99230c63e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWluZWElMjBwaWclMjBwZXR8ZW58MXx8fHwxNzczNzQ4MzI1fDA&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: false },
      { name: 'Ferret Flash', price: 449, categorySlug: 'small-pets', animalType: 'small-animal', age: 'Young (6-24 months)', description: 'Energetic and playful ferret', imageUrl: 'https://images.unsplash.com/photo-1551148408-9b3cc5e1add6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXJyZXQlMjBwZXR8ZW58MXx8fHwxNzczODIzNDQzfDA&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: false },
      { name: 'Fluffy Chinchilla', price: 549, categorySlug: 'small-pets', animalType: 'small-animal', age: 'Young (6-24 months)', description: 'Incredibly soft and cuddly chinchilla', imageUrl: 'https://images.unsplash.com/photo-1636676980996-f05cc9fc0652?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluY2hpbGxhJTIwcGV0fGVufDF8fHx8MTc3MzgyNTUzN3ww&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: true },

      // --- WILD PETS (10) ---
      { name: 'Ball Python', price: 325, categorySlug: 'wild-pets', animalType: 'wild-animal', age: 'Young (6-24 months)', description: 'Perfect for beginners, low maintenance', imageUrl: 'https://images.unsplash.com/photo-1610029944798-5bfafcbd4c9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxsJTIwcHl0aG9uJTIwc25ha2UlMjBjb2lsZWR8ZW58MXx8fHwxNzc1MDY4ODM4fDA&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: true },
      { name: 'Bearded Dragon', price: 225, categorySlug: 'wild-pets', animalType: 'wild-animal', age: 'Young (6-24 months)', description: 'Interactive and easy to handle', imageUrl: 'https://images.unsplash.com/photo-1542884738-c35f6c9c9ea2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFyZGVkJTIwZHJhZ29uJTIwbGl6YXJkJTIwcm9ja3xlbnwxfHx8fDE3NzUwNjg4Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: true },
      { name: 'Leopard Gecko', price: 140, categorySlug: 'wild-pets', animalType: 'wild-animal', age: 'Young (6-24 months)', description: 'Great starter reptile, nocturnal', imageUrl: 'https://images.unsplash.com/photo-1576517457961-e4c71a0b999d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZW9wYXJkJTIwZ2Vja28lMjBzcG90dGVkJTIwcmVwdGlsZXxlbnwxfHx8fDE3NzUwNjg4Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: true },
      { name: 'Red-Eared Slider', price: 100, categorySlug: 'wild-pets', animalType: 'wild-animal', age: 'Baby (0-6 months)', description: 'Popular water turtle species', imageUrl: 'https://images.unsplash.com/photo-1684105566222-37c3cb6d02e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBlYXJlZCUyMHNsaWRlciUyMHR1cnRsZXxlbnwxfHx8fDE3NzQ5NTAxNjN8MA&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: false },
      { name: 'Crested Gecko', price: 210, categorySlug: 'wild-pets', animalType: 'wild-animal', age: 'Young (6-24 months)', description: 'No heat lamp needed, easy care', imageUrl: 'https://images.unsplash.com/photo-1729707339394-15bdc7dfbc21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVzdGVkJTIwZ2Vja28lMjBicmFuY2glMjB0cmVlfGVufDF8fHx8MTc3NTA2ODgzOXww&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: false },
      { name: 'African Pygmy Hedgehog', price: 275, categorySlug: 'wild-pets', animalType: 'wild-animal', age: 'Young (6-24 months)', description: 'Quiet, low odor, unique pet', imageUrl: 'https://images.unsplash.com/photo-1598255352496-e67192a8a5ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwcHlnbXklMjBoZWRnZWhvZyUyMGN1dGV8ZW58MXx8fHwxNzc1MDY4ODQwfDA&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: false },
      { name: 'Sugar Glider', price: 400, categorySlug: 'wild-pets', animalType: 'wild-animal', age: 'Young (6-24 months)', description: 'Social, needs companion or attention', imageUrl: 'https://images.unsplash.com/photo-1738003036693-b8ea89832f24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWdhciUyMGdsaWRlciUyMGZseWluZyUyMG1hcnN1cGlhbHxlbnwxfHx8fDE3NzUwNjg4NDB8MA&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: false },
      { name: 'Pacman Frog', price: 75, categorySlug: 'wild-pets', animalType: 'wild-animal', age: 'Young (6-24 months)', description: 'Easy to care for, vibrant colors', imageUrl: 'https://images.unsplash.com/photo-1684735472795-b91410568404?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWNtYW4lMjBmcm9nJTIwY29sb3JmdWx8ZW58MXx8fHwxNzc1MDY4ODQxfDA&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: false },
      { name: 'Axolotl', price: 105, categorySlug: 'wild-pets', animalType: 'wild-animal', age: 'Young (6-24 months)', description: 'Unique appearance, fully aquatic', imageUrl: 'https://images.unsplash.com/photo-1682428999927-5be191db3882?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxheG9sb3RsJTIwcGluayUyMHNhbGFtYW5kZXIlMjBhcXVhdGljfGVufDF8fHx8MTc3NTA2ODg0MXww&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: true },
      { name: 'Fire-Bellied Toad', price: 55, categorySlug: 'wild-pets', animalType: 'wild-animal', age: 'Young (6-24 months)', description: 'Bright warning colors, active', imageUrl: 'https://images.unsplash.com/photo-1763418213691-bc4b83bd76fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXJlJTIwYmVsbGllZCUyMHRvYWQlMjBvcmFuZ2V8ZW58MXx8fHwxNzc1MDY4ODQyfDA&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: false },

      // --- OTHER / INVERTEBRATES (5) ---
      { name: 'Chilean Rose Tarantula', price: 70, categorySlug: 'other', animalType: 'other', age: 'Adult (2-7 years)', description: 'Calm temperament for beginners', imageUrl: 'https://images.unsplash.com/photo-1646750909578-0333ec40a956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3NlJTIwaGFpciUyMHRhcmFudHVsYSUyMHNwaWRlcnxlbnwxfHx8fDE3NzUwNjg4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: false },
      { name: 'Emperor Scorpion', price: 45, categorySlug: 'other', animalType: 'other', age: 'Adult (2-7 years)', description: 'Gentle giant, glows under blacklight', imageUrl: 'https://images.unsplash.com/photo-1618752362049-bcc57fb5ddb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY29ycGlvbiUyMGJsYWNrJTIwYXJ0aHJvcG9kfGVufDF8fHx8MTc3NTA2ODg0Nnww&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: false },
      { name: 'Hermit Crab', price: 25, categorySlug: 'other', animalType: 'other', age: 'Adult (2-7 years)', description: 'Social, needs tank mates', imageUrl: 'https://images.unsplash.com/photo-1693169537285-eee7b637f743?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJtaXQlMjBjcmFiJTIwY29sb3JmdWwlMjBzaGVsbHxlbnwxfHx8fDE3NzUwNjg4NDN8MA&ixlib=rb-4.1.0&q=80&w=1080', isFeatured: false },
      { name: 'Madagascar Hissing Cockroach', price: 15, categorySlug: 'other', animalType: 'other', age: 'Young (6-24 months)', description: 'Large, fascinating insect', imageUrl: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&q=80', isFeatured: false },
      { name: 'Giant African Millipede', price: 35, categorySlug: 'other', animalType: 'other', age: 'Young (6-24 months)', description: 'Docile, multi-legged marvel', imageUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&q=80', isFeatured: false },
    ];

    const productsDb: Record<string, any> = {};

    for (const p of rawProducts) {
      const categoryId = createdCategories[p.categorySlug]._id;
      const created = await Product.create({
        name: p.name,
        slug: slugify(p.name),
        description: p.description,
        price: p.price,
        stock: 10,
        category: categoryId,
        images: [p.imageUrl],
        animalType: p.animalType,
        age: p.age,
        isLiveAnimal: true,
        isFeatured: p.isFeatured,
      });
      productsDb[p.name] = created; // Cache the MongoDB document by name for easy reference
    }

    // Add extra order items that were in our custom layout
    const customOrderGolden = await Product.create({
      name: 'Golden Retriever',
      slug: 'golden-retriever-custom',
      description: 'Friendly and loyal companion',
      price: 1299,
      stock: 5,
      category: createdCategories['dogs']._id,
      images: ['https://images.unsplash.com/photo-1633722715463-d30f4f325e24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjByZXRyaWV2ZXIlMjBkb2d8ZW58MXx8fHwxNzczODI1NTM2fDA&ixlib=rb-4.1.0&q=80&w=1080'],
      animalType: 'dog',
      isLiveAnimal: true,
    });
    productsDb['Golden Retriever'] = customOrderGolden;

    const customOrderPersian = await Product.create({
      name: 'Persian Cat',
      slug: 'persian-cat-custom',
      description: 'Elegant and calm breed',
      price: 899,
      stock: 5,
      category: createdCategories['cats']._id,
      images: ['https://images.unsplash.com/photo-1685291989288-a48c55c22eac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWdkb2xsJTIwY2F0JTIwZmx1ZmZ5fGVufDF8fHx8MTc3MzgyNTUzNnww&ixlib=rb-4.1.0&q=80&w=1080'],
      animalType: 'cat',
      isLiveAnimal: true,
    });
    productsDb['Persian Cat'] = customOrderPersian;

    // ----------------------------------------------------------------------
    // 4. SEED FAVORITES (WISHLIST)
    // ----------------------------------------------------------------------
    console.log("🌱 Seeding User Favorites (Wishlist)...");
    customer.wishlist = [
      productsDb['Golden Retriever']._id,
      productsDb['Persian Cat']._id,
      productsDb['Macaw Parrot']._id,
      productsDb['Corgi Puppy']._id,
      productsDb['Fluffy Chinchilla']._id,
      productsDb['Pomeranian']._id,
    ];
    await customer.save();

    // ----------------------------------------------------------------------
    // 5. SEED CART
    // ----------------------------------------------------------------------
    console.log("🌱 Seeding Cart...");
    await Cart.create({
      user: customer._id,
      items: [
        { product: productsDb['Golden Buddy']._id, quantity: 1 },
        { product: productsDb['Fluffy Persian']._id, quantity: 1 },
        { product: productsDb['Snowball Bunny']._id, quantity: 1 }
      ]
    });

    // ----------------------------------------------------------------------
    // 6. SEED RECENT ORDERS
    // ----------------------------------------------------------------------
    console.log("🌱 Seeding Recent Orders...");
    await Order.create({
      user: customer._id,
      items: [
        {
          product: productsDb['Golden Retriever']._id,
          name: productsDb['Golden Retriever'].name,
          price: productsDb['Golden Retriever'].price,
          quantity: 1,
          // FIX: Force Mongoose to unwrap the string!
          image: String(productsDb['Golden Retriever'].images) 
        }
      ],
      total: 1299,
      status: "delivered",
      address: {
        fullName: customer.name,
        phone: customer.phone,
        street: customer.address?.street,
        city: customer.address?.city,
        province: customer.address?.province,
        postalCode: customer.address?.postalCode,
      },
      createdAt: new Date("2026-03-15T12:00:00.000Z")
    });

    await Order.create({
      user: customer._id,
      items: [
        {
          product: productsDb['Persian Cat']._id,
          name: productsDb['Persian Cat'].name,
          price: productsDb['Persian Cat'].price,
          quantity: 1,
          // FIX: Force Mongoose to unwrap the string!
          image: String(productsDb['Persian Cat'].images)
        }
      ],
      total: 899,
      status: "shipped", 
      address: {
        fullName: customer.name,
        phone: customer.phone,
        street: customer.address?.street,
        city: customer.address?.city,
        province: customer.address?.province,
        postalCode: customer.address?.postalCode,
      },
      createdAt: new Date("2026-03-16T12:00:00.000Z")
    });

    await Order.create({
      user: customer._id,
      items: [
        {
          product: productsDb['Macaw Parrot']._id,
          name: productsDb['Macaw Parrot'].name,
          price: productsDb['Macaw Parrot'].price,
          quantity: 1,
          // FIX: Force Mongoose to unwrap the string!
          image: String(productsDb['Macaw Parrot'].images)
        }
      ],
      total: 1499,
      status: "pending", 
      address: {
        fullName: customer.name,
        phone: customer.phone,
        street: customer.address?.street,
        city: customer.address?.city,
        province: customer.address?.province,
        postalCode: customer.address?.postalCode,
      },
      createdAt: new Date("2026-03-18T12:00:00.000Z")
    });

    console.log("🎉 Database seeded successfully with all categories, products, carts, and orders!");
    process.exit(0);
  } 
  catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();