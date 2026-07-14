export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // French phone number regex: 06 12 34 56 78 or +33 6 12 34 56 78
  // Accepts spaces, dots, dashes
  return /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(phone);
};

export const validatePassword = (password: string): boolean => {
  return password.length > 0;
};
