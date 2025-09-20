import { FormField } from "@/components/ui/form-modal";
export const serviceFormFields: FormField[] = [
  {
    name: "name",
    label: "Service Name",
    type: "text",
    required: true,
    placeholder: "Enter service name",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter service description",
    rows: 3,
  },
  {
    name: "price",
    label: "Price (€)",
    type: "number",
    placeholder: "0.00",
    min: 0,
    step: 0.01,
  },
  {
    name: "duration",
    label: "Duration (minutes)",
    type: "number",
    placeholder: "0",
    min: 1,
    step: 1,
  },
];
