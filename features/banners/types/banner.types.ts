export interface HeroBannerType {
  tag: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

export interface ValuePropType {
  title: string;
  subtitle: string;
  icon: string;
}

export interface PromoCardType {
  tag: string;
  title: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

export interface FeaturedCategorySectionType {
  enabled: boolean;
  categorySlug: string;
  title: string;
  subtitle?: string;
  limit: number;
}

export interface InstagramPostType {
  image: string;
  link: string;
}

export interface BannerContentType {
  _id?: string;
  identifier: string;
  announcementText: string;
  hero: HeroBannerType;
  valueProps: ValuePropType[];
  promoCards: PromoCardType[];
  featuredCategorySection?: FeaturedCategorySectionType;
  instagramFeed: InstagramPostType[];
}
