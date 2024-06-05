const { z } = require('zod');

// Define the Zod schema for nested objects first
const posterImageUrlSchema = z.object({
  public_id: z.string().nonempty(),
  imageUrl: z.string().url().nonempty()
});

const hoverImageUrlSchema = z.object({
  public_id: z.string().optional(),
  imageUrl: z.string().url().optional()
});

const imageUrlSchema = z.object({
  public_id: z.string().nonempty(),
  imageUrl: z.string().url().nonempty(),
  colorCode: z.string().nonempty()
});

const colorSchema = z.object({
  colorName: z.string().optional()
});

const modelDetailsSchema = z.object({
  name: z.string().nonempty(),
  detail: z.string().nonempty()
});

const spacificationSchema = z.object({
  specsDetails: z.string().nonempty()
});

const variantStockQuantitySchema = z.object({
  variant: z.string().nonempty(),
  quantity: z.number().nonnegative()
});

// Define the main product schema
const productSchema = z.object({
  name: z.string().nonempty(),
  posterImageUrl: posterImageUrlSchema,
  hoverImageUrl: hoverImageUrlSchema.optional(),
  description: z.string().nonempty(),
  price: z.number().nonnegative(),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
  imageUrl: z.array(imageUrlSchema),
  discountPrice: z.number().nonnegative().optional(),
  colors: z.array(colorSchema).optional(),
  modelDetails: z.array(modelDetailsSchema),
  spacification: z.array(spacificationSchema),
  createdAt: z.date().optional().default(() => new Date()),
  updatedAt: z.date().optional().default(() => new Date()),
  totalStockQuantity: z.number().nonnegative(),
  variantStockQuantities: z.array(variantStockQuantitySchema)
});

module.exports = productSchema;
