import { ButtonElement } from "../configSchema";
import { ElementComponent } from "./ElementComponent";
import styles from "./LinkButtonElement.module.css"

export const ButtonElementComponent = ({ element }: { element: ButtonElement }) => {
	return (
        <LinkButton
            text={element.value}
            style={element.styles}
            href={element.src}
        />
	);
};

const LinkButton = ({
	text,
	href,
	style,
}: {
	text: string;
	href: string;
	style?: React.CSSProperties;
}) => {
	const handleClick = () => window.open(href, "_blank");
	return (
		<ElementComponent>
			<button className={styles.linkButton} style={style} onClick={handleClick}>
				<a href={href} style={{ color: style?.color, textDecoration: "none" }} target="_blank">{text}</a>
			</button>
		</ElementComponent>
	);
};
