export interface PatchNote {
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
      } | null
    date: string
    slug: string
    content: string[]
  }