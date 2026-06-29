import type { ReactNode } from "react";

interface FieldLabelProps {
  children: ReactNode;
  required?: boolean;
}

export default function FieldLabel({ children, required = false }: FieldLabelProps) {
  return (
    <label className="text-xs font-black uppercase tracking-[0.12em] text-white/75">
      {children}{" "}
      {required ? <span className="text-[#ff43ff]">*</span> : null}
    </label>
  );
}
