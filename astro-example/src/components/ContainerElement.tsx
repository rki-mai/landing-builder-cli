import { ReactNode } from "react";
import { type ContainerElement } from "../configSchema";
import { ElementComponent, ElementComponentsContainer } from "./ElementComponent";


export const ContainerElementComponent = ({ element, children }: { element: ContainerElement, children: ReactNode }) => {
    return (
        <ElementComponent>
            <ElementComponentsContainer>
                {children}
            </ElementComponentsContainer>
        </ElementComponent>
    );
};
