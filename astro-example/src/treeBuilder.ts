import { type LandingElement } from "./configSchema";

export interface ElementsTreeNode {
    element: LandingElement;
    children: ElementsTreeNode[];
}

export const buildTree = (elements: LandingElement[], parentId: string = "root"): ElementsTreeNode[] => {
    return elements
        .filter(el => el.parentId === parentId)
        .sort((a, b) => a.index - b.index)
        .map(el => {
            return {
                element: el,
                children: buildTree(elements, el.id),
            }
        });
}