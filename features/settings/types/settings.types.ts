export interface SiteSettingsType {
  _id?: string;
  identifier: string;
  storeName: string;
  tagline: string;
  currency: string;
  freeShippingThreshold: number;
  supportEmail: string;
  supportPhone: string;
  instagramHandle: string;
  address: string;
  cloudinaryCloudName?: string;
  cloudinaryApiKey?: string;
  cloudinaryApiSecret?: string;
  appDownload?: {
    enabled?: boolean;
    title?: string;
    subtitle?: string;
    playStoreUrl?: string;
    appStoreUrl?: string;
  };
}
