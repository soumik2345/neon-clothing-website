export interface HeroBannerType {
  tag: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

export interface HeroSlideType {
  id?: string;
  tag: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  bgType: "image" | "color";
  image?: string;
  bgColor?: string;
  textColor?: "white" | "black";
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
  id?: string;
  enabled: boolean;
  tag?: string;
  categorySlug: string;
  title: string;
  subtitle?: string;
  limit: number;
  selectedProductIds?: string[];
}

export interface ShopByCategorySectionType {
  enabled?: boolean;
  title?: string;
  limit?: number; // e.g. 5 or 6 (admin selected)
  selectedCategories?: string[]; // array of category slugs
}

export interface CategoryTabItemType {
  categorySlug: string;
  label?: string;
  limit: number;
  selectedProductIds?: string[];
  enabled: boolean;
}

export interface CategoryTabbedSectionType {
  enabled: boolean;
  tag?: string;
  title: string;
  subtitle?: string;
  items: CategoryTabItemType[];
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
  heroSlides?: HeroSlideType[];
  valueProps: ValuePropType[];
  promoCards: PromoCardType[];
  shopByCategorySection?: ShopByCategorySectionType;
  featuredCategorySection?: FeaturedCategorySectionType;
  featuredCategorySections?: FeaturedCategorySectionType[];
  categoryTabbedSection?: CategoryTabbedSectionType;
  instagramFeed: InstagramPostType[];
}
