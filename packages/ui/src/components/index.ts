// Components will be implemented in the mobile app
// This is a placeholder for shared component types/interfaces

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}

export interface CardProps {
  children: React.ReactNode;
  padding?: keyof typeof import('../tokens').spacing;
}

