import { PropsWithChildren } from "react"

export const ElementComponent = ({ children }: PropsWithChildren) => {
    return <div>{children}</div>;
}

export const ElementComponentsContainer = ({ children }: PropsWithChildren) => {
    return <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>{children}</div>
}