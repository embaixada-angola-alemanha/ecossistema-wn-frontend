export interface Article {
  id: string;
  slug: string;
  tituloPt: string;
  tituloEn?: string;
  tituloDe?: string;
  tituloCs?: string;
  conteudoPt?: string;
  conteudoEn?: string;
  conteudoDe?: string;
  conteudoCs?: string;
  excertoPt?: string;
  excertoEn?: string;
  excertoDe?: string;
  metaTituloPt?: string;
  metaDescricaoPt?: string;
  metaKeywords?: string;
  estado: string;
  category?: Category;
  author?: Author;
  tags: Tag[];
  featuredImageId?: string;
  featured: boolean;
  publishedAt?: string;
  scheduledAt?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  nomePt: string;
  nomeEn?: string;
  nomeDe?: string;
  nomeCs?: string;
  descricaoPt?: string;
  descricaoEn?: string;
  descricaoDe?: string;
  cor?: string;
  sortOrder: number;
  activo: boolean;
}

export interface Tag {
  id: string;
  slug: string;
  nomePt: string;
  nomeEn?: string;
  nomeDe?: string;
}

export interface Author {
  id: string;
  nome: string;
  slug: string;
  bioPt?: string;
  bioEn?: string;
  bioDe?: string;
  email?: string;
  avatarId?: string;
  role?: string;
  activo: boolean;
}

export interface ShareLinks {
  articleUrl: string;
  title: string;
  shareLinks: Record<string, string>;
}
