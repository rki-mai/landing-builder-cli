import { type ElementsTreeNode } from "../treeBuilder"
import { ContainerElementComponent } from "./ContainerElement"
import { ImageElementComponent } from "./ImageElement"
import { ButtonElementComponent } from "./LinkButtonElement"
import { LinkElementComponent } from "./LinkElement"
import { TextElementComponent } from "./TextElement"

export const ElementsTreeNodeComponent = ({ node }: { node: ElementsTreeNode | ElementsTreeNode[] }) => {
    if (Array.isArray(node)) {
        return <>{...node.map(child => <ElementsTreeNodeComponent node={child} />)}</>
    }

    if (node.element.element === "text") {
        return <TextElementComponent element={node.element} />
    } else if (node.element.element === "container") {
        return <ContainerElementComponent element={node.element}>
            <ElementsTreeNodeComponent node={node.children} />
        </ContainerElementComponent>
    } else if (node.element.element === "link") {
        return <LinkElementComponent element={node.element} />
    } else if (node.element.element === "image") {
        return <ImageElementComponent element={node.element} />
    } else {
        return <ButtonElementComponent element={node.element} />
    }
}
