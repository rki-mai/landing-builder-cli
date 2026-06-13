import { ImageElement } from "../configSchema";
import styles from "./ImageElement.module.css"

export const ImageElementComponent = ({ element }: { element: ImageElement }) => {
	const elementStyle: React.CSSProperties = {};
	const imageStyle: React.CSSProperties = {};

	if (element.styles) {
		if (element.styles.width) imageStyle.width = `${element.styles.width}%`;
		if (element.styles.position)
			elementStyle.textAlign = element.styles.position;
	}

	return (
        <div className={styles.imageElementContainer} style={elementStyle}>
            <img
                className="image"
                src={element.value}
                style={imageStyle}
                alt={element.alt}
            />
        </div>
	);
};