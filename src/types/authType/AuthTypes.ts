import { useForm } from "react-hook-form";

export type AuthInputProps = {
  label: string;
  type?: string;
  icon?: React.ReactNode;
  register: ReturnType<typeof useForm>["register"];
  name: string;
  readOnly?: boolean;
  required?: boolean;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};
