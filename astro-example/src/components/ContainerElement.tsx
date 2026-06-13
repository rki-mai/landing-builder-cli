import { ReactNode } from "react";
import { type ContainerElement } from "../configSchema";


export const ContainerElementComponent = ({ element, children }: { element: ContainerElement, children: ReactNode }) => {
    return <div>{children}</div>
};
