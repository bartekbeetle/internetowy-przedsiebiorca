export const SITE_NAME = "Internetowy Przedsiebiorca";
export const SITE_URL = "https://internetowyprzedsiebiorca.pl";
export const KLUB_URL = "https://klub.internetowyprzedsiebiorca.pl";
export const INSTAGRAM_URL = "https://instagram.com/internetowy_przedsiebiorca";
export const INSTAGRAM_HANDLE = "@internetowy_przedsiebiorca";

export const PRODUCTS = {
  LEAD_MAGNET: {
    name: "Pierwsza Rolka w 24h",
    price: 0,
    url: "/pierwsza-rolka",
  },
  FACELESS_KIT: {
    name: "Faceless Creator Kit",
    price: 97,
    originalPrice: 885,
    url: "/faceless-kit",
  },
  ACCELERATOR: {
    name: "Faceless Accelerator",
    price: 500,
    url: "/accelerator",
    maxSlots: 5,
  },
} as const;

export const POINTS = {
  POST_CREATED: 10,
  COMMENT_CREATED: 2,
  LIKE_RECEIVED_POST: 3,
  LIKE_RECEIVED_COMMENT: 1,
  MODULE_COMPLETED: 5,
  COURSE_COMPLETED: 20,
  REEL_SAVED: 1,
  DAILY_LOGIN: 2,
} as const;
