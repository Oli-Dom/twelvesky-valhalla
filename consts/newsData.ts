import { NewsItem } from "@/types/newsType";

export const newsData: NewsItem[] = [
  {
    id: 1,
    title: "Game Invitiation Event",
    excerpt: "Join us for an exciting game invitation event!",
    coverImage: {
      logo: "/images/news/news_1_cover.png",
    },
    contentImage: {
      logo: "/images/news/news_1_content.png",
      width: 300,
      height: 300,
    },
    date: "April 25, 2025",
    slug: "game-invitation-event",
    content:
      "Join us for an exciting game invitation event! Participate and win amazing prizes. Don't miss out!",
  },
] as const;
