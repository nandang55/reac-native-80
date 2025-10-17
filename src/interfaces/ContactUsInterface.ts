export interface BodyContactUsInterface {
  name: string;
  phone: string;
  email: string;
  subject: string;
  issue: string;
}

export interface ContactUsInterface extends BodyContactUsInterface {
  phone_cc: string;
}
