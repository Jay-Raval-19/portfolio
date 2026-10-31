// Shared photo types + defaults. NO server/Supabase imports here so this file
// is safe to import from client components.

export type Photo = {
  id?: string;
  caption: string;
  location: string;
  date: string;
  aspect: string; // e.g. '4/5', '3/2', '1/1', '16/9'
  image_url: string; // public URL; empty => placeholder grain tile
  image_path?: string; // storage path, used for deletion
  sort_order?: number;
};

export const ASPECT_OPTIONS = ['4/5', '3/2', '1/1', '16/9', '2/3'];

// Fallback contact sheet shown when Supabase isn't configured or empty.
// These have no image_url, so the gallery renders its placeholder grain tiles.
export const defaultFrames: Photo[] = [
  {
    caption: 'first light through the window',
    location: 'ahmedabad',
    date: '2024',
    aspect: '4/5',
    image_url: ''
  },
  {
    caption: 'street / motion / grain',
    location: 'mumbai',
    date: '2024',
    aspect: '3/2',
    image_url: ''
  },
  {
    caption: 'shadows folding',
    location: 'ahmedabad',
    date: '2023',
    aspect: '1/1',
    image_url: ''
  },
  {
    caption: 'rain, reflected',
    location: 'goa',
    date: '2024',
    aspect: '4/5',
    image_url: ''
  },
  {
    caption: 'a quiet room',
    location: 'ahmedabad',
    date: '2025',
    aspect: '3/2',
    image_url: ''
  },
  {
    caption: 'monsoon, late',
    location: 'mumbai',
    date: '2025',
    aspect: '4/5',
    image_url: ''
  }
];
