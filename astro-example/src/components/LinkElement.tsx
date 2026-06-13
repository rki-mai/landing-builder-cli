import { LinkElement } from "../configSchema";

export const LinkElementComponent = ({ element }: { element: LinkElement }) => {
	return (
        <a className="link-element" style={element.styles} href={element.src}>
            {element.value}
        </a>
	);
};
