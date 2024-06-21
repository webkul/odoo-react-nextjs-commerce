import { Carousel } from 'components/carousel';
import { ThreeItemGrid } from 'components/grid/three-items';
import Footer from 'components/layout/footer';
import Navbar from 'components/layout/navbar';
import { getHomepageCollectionProducts } from 'lib/odoo';

export const metadata = {
  description: 'High-performance ecommerce store built with Next.js, Vercel, and Odoo.',
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage() {
  const homepageItems = await getHomepageCollectionProducts();

  return (
    <>
      <Navbar />
      <ThreeItemGrid homeCollection={homepageItems?.[0]} />
      <Carousel homeCollection={homepageItems?.[1]} />
      <Footer />
    </>
  );
}
