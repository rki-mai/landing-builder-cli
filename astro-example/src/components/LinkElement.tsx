import { LinkElement } from "../configSchema";
import { ElementComponent } from "./ElementComponent";

export const LinkElementComponent = ({ element }: { element: LinkElement }) => {
	return (
        <ElementComponent>
            <a className="link-element" style={element.styles} href={element.src}>
                {element.value}
            </a>
        </ElementComponent>
	);
};
