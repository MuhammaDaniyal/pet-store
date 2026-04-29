import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Category } from "../lib/models/Category";
import { Product } from "../lib/models/Product";
import { User } from "../lib/models/User";

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ Error: MONGODB_URI environment variable is not set");
  console.error("Please add it to your .env.local file:");
  console.error("  MONGODB_URI=mongodb://localhost:27017/pet-store");
  process.exit(1);
}

const testUsers = [
  {
    name: "Admin User",
    email: "admin@petstore.com",
    password: "Admin@123",
    role: "admin" as const,
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "User@123",
    role: "user" as const,
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "User@123",
    role: "user" as const,
  },
];

const categories = [
  { name: "Dogs", slug: "dogs", icon: "🐕", description: "Puppies and adult dogs" },
  { name: "Cats", slug: "cats", icon: "🐈", description: "Kittens and adult cats" },
  { name: "Birds", slug: "birds", icon: "🦜", description: "Parrots, finches, and more" },
  { name: "Fish", slug: "fish", icon: "🐟", description: "Freshwater and saltwater" },
  { name: "Reptiles", slug: "reptiles", icon: "🦎", description: "Lizards, turtles, snakes" },
];

const products = [
  // DOGS
  {
    name: "Golden Retriever Puppy",
    slug: "golden-retriever-puppy",
    description: "Friendly, playful 8-week-old Golden Retriever. Vaccinated and dewormed.",
    price: 45000,
    stock: 3,
    animalType: "dog",
    breed: "Golden Retriever",
    age: "8 weeks",
    gender: "male",
    isLiveAnimal: true,
    isFeatured: true,
    images: [],
  },
  {
    name: "German Shepherd Puppy",
    slug: "german-shepherd-puppy",
    description: "Loyal and intelligent GSD pup. 10 weeks old, first shots done.",
    price: 35000,
    stock: 2,
    animalType: "dog",
    breed: "German Shepherd",
    age: "10 weeks",
    gender: "female",
    isLiveAnimal: true,
    images: [],
  },
  {
    name: "Labrador Retriever Puppy",
    slug: "labrador-retriever-puppy",
    description: "Black Lab puppy, 9 weeks old. Great family dog.",
    price: 30000,
    stock: 4,
    animalType: "dog",
    breed: "Labrador Retriever",
    age: "9 weeks",
    gender: "male",
    isLiveAnimal: true,
    images: [],
  },

  // CATS
  {
    name: "Persian Kitten",
    slug: "persian-kitten",
    description: "White Persian kitten, 3 months old. Calm and affectionate.",
    price: 20000,
    stock: 2,
    animalType: "cat",
    breed: "Persian",
    age: "3 months",
    gender: "female",
    isLiveAnimal: true,
    isFeatured: true,
    images: [],
  },
  {
    name: "Siamese Kitten",
    slug: "siamese-kitten",
    description: "Classic Siamese, vocal and social. 12 weeks old.",
    price: 15000,
    stock: 3,
    animalType: "cat",
    breed: "Siamese",
    age: "12 weeks",
    gender: "male",
    isLiveAnimal: true,
    images: [],
  },

  // BIRDS
  {
    name: "African Grey Parrot",
    slug: "african-grey-parrot",
    description: "Hand-tamed African Grey. Excellent talker, 6 months old.",
    price: 80000,
    stock: 1,
    animalType: "bird",
    breed: "African Grey",
    age: "6 months",
    gender: "unknown",
    isLiveAnimal: true,
    isFeatured: true,
    images: [],
  },
  {
    name: "Budgerigar Pair",
    slug: "budgerigar-pair",
    description: "A bonded pair of budgies. Great for beginners.",
    price: 3000,
    stock: 5,
    animalType: "bird",
    breed: "Budgerigar",
    age: "4 months",
    gender: "unknown",
    isLiveAnimal: true,
    images: [],
  },

  // FISH
  {
    name: "Arowana (Silver)",
    slug: "arowana-silver",
    description: "Silver Arowana, 6 inches. Healthy and active.",
    price: 12000,
    stock: 2,
    animalType: "fish",
    breed: "Silver Arowana",
    age: "unknown",
    gender: "unknown",
    isLiveAnimal: true,
    isFeatured: true,
    images: [],
  },
  {
    name: "Goldfish (Pack of 6)",
    slug: "goldfish-pack-6",
    description: "Common Goldfish, great starter fish. Healthy and vibrant.",
    price: 1500,
    stock: 20,
    animalType: "fish",
    breed: "Common Goldfish",
    age: "unknown",
    gender: "unknown",
    isLiveAnimal: true,
    images: [],
  },

  // REPTILES
  {
    name: "Bearded Dragon",
    slug: "bearded-dragon",
    description: "Docile and friendly Bearded Dragon. 4 months old, eating well.",
    price: 18000,
    stock: 2,
    animalType: "reptile",
    breed: "Bearded Dragon",
    age: "4 months",
    gender: "male",
    isLiveAnimal: true,
    images: [],
  },
  {
    name: "Red-Eared Slider Turtle",
    slug: "red-eared-slider-turtle",
    description: "Classic aquatic turtle. Easy to care for, 3 months old.",
    price: 5000,
    stock: 6,
    animalType: "reptile",
    breed: "Red-Eared Slider",
    age: "3 months",
    gender: "unknown",
    isLiveAnimal: true,
    images: [],
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI!);
  console.log("Connected to MongoDB");

  // Clear existing data
  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});

  // Create test users with hashed passwords
  const hashedUsers = await Promise.all(
    testUsers.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 12),
    }))
  );
  const insertedUsers = await User.insertMany(hashedUsers);
  console.log(`Inserted ${insertedUsers.length} users`);
  console.log(`  - Admin: admin@petstore.com / Admin@123`);
  console.log(`  - User: john@example.com / User@123`);
  console.log(`  - User: jane@example.com / User@123`);

  // Insert categories
  const insertedCategories = await Category.insertMany(categories);
  console.log(`Inserted ${insertedCategories.length} categories`);

  // Map slug → _id
  const catMap: Record<string, mongoose.Types.ObjectId> = {};
  insertedCategories.forEach((c) => { catMap[c.slug] = c._id; });

  // Attach category _id to each product
  const productsWithCat = products.map((p) => ({
    ...p,
    category: catMap[p.animalType === "dog" ? "dogs"
      : p.animalType === "cat" ? "cats"
      : p.animalType === "bird" ? "birds"
      : p.animalType === "fish" ? "fish"
      : "reptiles"],
    isActive: true,
  }));

  const insertedProducts = await Product.insertMany(productsWithCat);
  console.log(`Inserted ${insertedProducts.length} products`);

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch(console.error);