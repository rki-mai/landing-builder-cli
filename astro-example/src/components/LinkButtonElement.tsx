import { ButtonElement } from "../configSchema";
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
		<button className={styles.linkButton} style={style} onClick={handleClick}>
			{text}
		</button>
	);
};
