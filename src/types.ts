export interface Program {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Dakwah' | 'Ekonomi' | 'Kesehatan' | 'Pendidikan' | 'Sosial';
  image?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
}

export interface Donation {
  id: string;
  amount: number;
  donorName: string;
  programId: string;
  timestamp: string;
  status: 'pending' | 'completed';
  phone?: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
}
