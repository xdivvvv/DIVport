export interface Project {
  id: string;
  code: string;
  title: string;
  category: string;
  image: string;
}

export interface Award {
  title: string;
  count: number;
  description: string;
}

export interface NavItem {
  label: string;
  href: string;
}
