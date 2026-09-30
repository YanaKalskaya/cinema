import "./StatusBlock.less";

interface StatusBlockProps {
    title: string;
    text?: string;
}

export const StatusBlock = ({ title, text }: StatusBlockProps) => (
    <div className="statusBlock">
        <p className="statusBlockTitle">{title}</p>
        {text && <p className="statusBlockText">{text}</p>}
    </div>
);
