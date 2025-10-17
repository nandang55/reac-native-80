export const maskPhoneNumber = (phoneNumber: string) => {
  const digits = phoneNumber.replace(/\D/g, '');

  const mask = '**-****-';

  const visible = digits.slice(-4);

  return `${mask}${visible}`;
};

export const maskEmailAddress = (email: string) => {
  const [address, domain] = email.split('@');

  const maskedLength = Math.floor(address.length * 0.7);
  const mask = '*'.repeat(maskedLength);

  const visible = address.substring(maskedLength);

  return `${mask}${visible}@${domain}`;
};
