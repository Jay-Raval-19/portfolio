import { getPhotos } from '@/lib/getPhotos';
import GalleryClient from './GalleryClient';

// Warm the DNS + TLS handshake to Supabase storage while the HTML is still
// parsing, so the first frames don't pay for it.
const storageOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL;

export default async function GalleryPage() {
  const frames = await getPhotos();
  return (
    <>
      {storageOrigin && (
        <>
          <link rel="preconnect" href={storageOrigin} crossOrigin="anonymous" />
          <link rel="dns-prefetch" href={storageOrigin} />
        </>
      )}
      <GalleryClient frames={frames} />
    </>
  );
}
