export interface NewsItem {
    id: number
    title: string
    excerpt: string
    coverImage: {
      logo: any
    }
    contentImage: {
        logo: any,
        width: number,
        height: number,
      }
    date: string
    slug: string
    content: string
  }