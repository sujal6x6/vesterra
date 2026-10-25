import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const siteSettings = sqliteTable("site_settings", {
  id: text("id").primaryKey().default("site"),
  data: text("data").notNull().default("{}"),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const enquiries = sqliteTable("enquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  interest: text("interest").notNull().default("General enquiry"),
  message: text("message").notNull().default(""),
  status: text("status").notNull().default("new"),
  note: text("note").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  rating: integer("rating").notNull().default(5),
  title: text("title").notNull().default(""),
  message: text("message").notNull(),
  status: text("status").notNull().default("pending"),
  verified: integer("verified", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const gallery = sqliteTable("gallery", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull().default("image"),
  url: text("url").notNull(),
  title: text("title").notNull().default(""),
  caption: text("caption").notNull().default(""),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  position: integer("position").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const properties = sqliteTable("properties", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  location: text("location").notNull(),
  propertyType: text("property_type").notNull().default("Residential"),
  price: text("price").notNull().default("Price on request"),
  bedrooms: integer("bedrooms").notNull().default(0),
  bathrooms: integer("bathrooms").notNull().default(0),
  area: text("area").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  description: text("description").notNull().default(""),
  status: text("status").notNull().default("Available"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
