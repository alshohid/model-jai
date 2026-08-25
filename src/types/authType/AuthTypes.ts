import type { FieldPath, FieldValues, UseFormRegister } from "react-hook-form";

export type AuthInputProps<
  TFieldValues extends FieldValues = FieldValues,
> = {
  label: string;
  type?: string;
  icon?: React.ReactNode;
  register: UseFormRegister<TFieldValues>;
  name: FieldPath<TFieldValues>;
  readOnly?: boolean;
  required?: boolean;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};
