'use client';
import { isObject } from 'lib/type-guards';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
type BreadCumbType = {
  label: 'Information' | 'Shipping' | 'Payment' | 'Place Order';
  href: string;
};
type BreadcrumbArray = BreadCumbType[];
const breadCrumbs: BreadcrumbArray = new Array(
  {
    label: 'Information',
    href: '/checkout/information'
  },
  {
    label: 'Shipping',
    href: '/checkout/shipping'
  },
  {
    label: 'Payment',
    href: '/checkout/payment'
  }
);
const NextBreadcrumb = () => {
  const paths = usePathname();
  const [currentPage, setCurrentPage] = useState<BreadCumbType['label']>('Information');
  const currentPath = breadCrumbs?.find((item) => item.href === paths);

  useEffect(() => {
    if (isObject(currentPath)) {
      setCurrentPage(currentPath.label);
    }
  }, [paths, currentPath]);
  let informationPassed = false;
  const BreadCrumbsArray: BreadcrumbArray = breadCrumbs.map((crumb) => {
    if (crumb.href === paths) {
      informationPassed = true;
      return { ...crumb, href: paths };
    } else if (informationPassed) {
      return { ...crumb, href: '#' };
    } else {
      return { ...crumb };
    }
  });

  return (
    <div>
      <div>
        {BreadCrumbsArray.map((item) => (
          <span
            key={item.label}
            className={`px-1 py-0.5 text-gray-700 ${currentPage === item.label ? 'font-normal text-black dark:text-gray-300' : ''}`}
          >
            {currentPage === item.label ? item.label : <Link href={item.href}>{item.label}</Link>}
            {item.label !== 'Payment' && <span className="mx-1">{'>'}</span>}
          </span>
        ))}
      </div>
    </div>
  );
};

export default NextBreadcrumb;
