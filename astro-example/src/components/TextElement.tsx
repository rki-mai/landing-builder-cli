import { CSSProperties } from "react";
import { type TextElement } from "../configSchema"
import { ElementComponent } from "./ElementComponent";

const TAG_MAP = {
	h1: 'h1', 
	h2: 'h2', 
	h3: 'h3', 
	paragraph: 'p', 
} as const;

export const TextElementComponent = ({ element }: { element: TextElement }) => {
    const style: CSSProperties = {};
	if (element.styles) {
		if (element.styles.color) style.color = element.styles.color;
		if (element.styles.fontSize)
			style.fontSize = `${element.styles.fontSize}px`;
		if (element.styles.textAlign)
			style.textAlign = element.styles.textAlign;
		if (element.styles.bold)
			style.fontWeight = "bold";
		if (element.styles.italic)
			style.fontStyle = "italic";
		if (element.styles.underline)
			style.textDecoration = "underline";
	}

	const Tag = TAG_MAP[element.styles?.format || "paragraph"];

    return (
		<ElementComponent>
			<Tag style={style}>{element.value}</Tag>
		</ElementComponent>
	);
}
