export interface AccordionProps {
  id: string;
  label: string;
  description?: string;
  childData: Array<{ id: string; label: string }>;
  expanded?: boolean;
  onToggle?: () => void;
}
