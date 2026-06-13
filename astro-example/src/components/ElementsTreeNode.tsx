import { type ElementsTreeNode } from "../treeBuilder"
import { ContainerElementComponent } from "./ContainerElement"
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
    }
}
