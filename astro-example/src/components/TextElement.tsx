import { CSSProperties } from "react";
import { type TextElement } from "../configSchema"

export const TextElementComponent = ({ element }: { element: TextElement }) => {
    const style: CSSProperties = {};
	if (element.styles) {
		if (element.styles.color) style.color = element.styles.color;
		if (element.styles.fontSize)
			style.fontSize = `${element.styles.fontSize}px`;
	}

    return <p style={style}>{element.value}</p>
}
