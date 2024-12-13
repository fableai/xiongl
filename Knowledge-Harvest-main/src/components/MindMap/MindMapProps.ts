export type MindMapProps = {
    markdown: string;
    className?: string;
    style?: React.CSSProperties;
    onNodeClick?: (node: any) => void; // 添加节点点击回调
}

