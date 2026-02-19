export interface NewsletterSubscription {
  email: string;
  nome?: string;
  idioma?: string;
}

export interface NewsletterResponse {
  id: string;
  email: string;
  nome?: string;
  idioma: string;
  activo: boolean;
  confirmed: boolean;
  createdAt: string;
}
