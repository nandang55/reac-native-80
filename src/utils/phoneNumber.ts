export const removeFirstZeroInPhoneNumber = (phoneNumber: string) =>
  phoneNumber[0] === '0' ? phoneNumber.slice(1) : phoneNumber;

export const phoneNumberFormat = (phoneNumber: string) =>
  '+62' + removeFirstZeroInPhoneNumber(phoneNumber);

export const validationNumberFormat = (phoneNumber: string) => {
  const regex = /^(?:\+62|62|0)[0-9]{7,14}$/;
  const isInvalidPhoneNumber = regex.test(phoneNumber);

  return isInvalidPhoneNumber ? phoneNumber.replace(/^(?:\+62|62|0)/, '') : phoneNumber;
};
