import { z } from 'astro/zod';

const baseElementSchema = z.object({
    id: z.string(),
    parentId: z.string(),
    index: z.number(),
}).strip();

const textELementStylesSchema = z.object({
    color: z.string().optional(),
    fontSize: z.string().optional(),
	bold: z.boolean().optional(),
	italic: z.boolean().optional(),
	underline: z.boolean().optional(),
	textAlign: z.union([z.literal("left"), z.literal("center"), z.literal("right")]).optional(),
	format: z.union([z.literal("h1"), z.literal("h2"), z.literal("h3"), z.literal("paragraph")]).optional(),
}).strip();

const textElementSchema = baseElementSchema.extend({
	element: z.literal("text"),
	value: z.string(),
	styles: textELementStylesSchema.optional(),
}).strip();

const containerElementSchema = baseElementSchema.extend({
	element: z.literal("container"),
}).strip();

const linkElementStylesSchema = z.object({
    textDecoration: z.union([z.literal("underline"), z.literal("none")]).optional(),
}).strip();

const linkElementSchema = baseElementSchema.extend({
	element: z.literal("link"),
	value: z.string(),
	src: z.string(),
	styles: linkElementStylesSchema.optional(),
}).strip();

const imageElementsStylesSchema = z.object({
    width: z.string().optional(),
    position: z.union([z.literal("left"), z.literal("center"), z.literal("right")]).optional(),
}).strip();

const imageElementSchema = baseElementSchema.extend({
	element: z.literal("image"),
	value: z.string(),
	alt: z.optional(z.string()),
	styles: imageElementsStylesSchema.optional(),
}).strip();

const buttonElementStylesSchema = z.object({
	backgroundColor: z.string().optional(),
	color: z.string().optional(),
}).strip();

const buttonElementSchema = baseElementSchema.extend({
	element: z.literal("button"),
	value: z.string(),
	src: z.string(),
	styles: buttonElementStylesSchema.optional(),
}).strip();

const landingElementSchema = z.discriminatedUnion("element", [
	textElementSchema,
	containerElementSchema,
	linkElementSchema,
	imageElementSchema,
	buttonElementSchema,
]);

const draftSchema = z
	.object({ elements: z.array(landingElementSchema) })
	.strip();

export type TextElement = z.infer<typeof textElementSchema>;
export type ContainerElement = z.infer<typeof containerElementSchema>;
export type LinkElement = z.infer<typeof linkElementSchema>;
export type ImageElement = z.infer<typeof imageElementSchema>;
export type ButtonElement = z.infer<typeof buttonElementSchema>;
export type LandingElement = z.infer<typeof landingElementSchema>;

export const validateConfig = (config: unknown) => {
    return draftSchema.parse(config);
}
