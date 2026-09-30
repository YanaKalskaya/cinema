import type { ReactNode } from "react";

import "./Field.less";

interface FieldProps {
    label: string;
    error?: string;
    children: ReactNode;
}

export const Field = ({ label, error, children }: FieldProps) => (
    <label className="field">
        <span className="fieldLabel">{label}</span>
        {children}
        {error && <span className="fieldError">{error}</span>}
    </label>
);
