'use client';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { createUrl } from 'lib/utils';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export default function Pagination({
  itemsPerPage,
  itemsTotal,
  currentPage
}: {
  itemsPerPage: number;
  itemsTotal: number;
  currentPage: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const currentParams = useSearchParams();
  const q = currentParams.get('q');
  const sort = currentParams.get('sort');
  const pageCount = Math.ceil(itemsTotal / itemsPerPage);

  const handlePageClick = (page: number) => {
    const newPage = Math.ceil(page + 1);
    let newUrl = createUrl(
      pathname,
      new URLSearchParams({
        ...(q && { q }),
        ...(sort && { sort })
      })
    );
    if (page !== 0) {
      newUrl = createUrl(
        pathname,
        new URLSearchParams({
          ...(q && { q }),
          ...(sort && { sort }),
          page: newPage.toString()
        })
      );
    }
    router.replace(newUrl);
  };

  // Function to generate dots for pagination
  const renderDots = () => {
    const dots = [];
    const maxVisiblePages = 5; // Adjust this number based on your design

    if (pageCount <= maxVisiblePages) {
      // If total pages are less than or equal to maxVisiblePages, show all pages
      for (let i = 0; i < pageCount; i++) {
        dots.push(renderPageButton(i));
      }
    } else {
      // Show dot pagination with ellipses
      const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);
      const start = Math.max(0, currentPage - halfMaxVisiblePages);
      const end = Math.min(pageCount, start + maxVisiblePages);

      if (start > 0) {
        dots.push(renderPageButton(0));
        if (start > 1) {
          dots.push(
            <li key="dot-start" className="pagination-dot">
              ...
            </li>
          );
        }
      }

      for (let i = start; i < end; i++) {
        dots.push(renderPageButton(i));
      }

      if (end < pageCount) {
        if (end < pageCount - 1) {
          dots.push(
            <li key="dot-end" className="pagination-dot">
              ...
            </li>
          );
        }
        dots.push(renderPageButton(pageCount - 1));
      }
    }

    return dots;
  };

  const renderPageButton = (pageIndex: number) => (
    <li
      key={pageIndex}
      onClick={() => handlePageClick(pageIndex)}
      className={`m-2 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 sm:m-0 sm:mx-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white [&.active]:bg-gray-100 cursor-pointer${
        pageIndex === currentPage ? ' active ' : ''
      }`}
    >
      <a
        className={`ml-0 flex h-10 items-center justify-center px-4 leading-tight ${
          pageIndex === currentPage ? ' font-bold ' : ''
        }`}
        aria-label={`Goto Page ${pageIndex + 1}`}
        aria-current={pageIndex === currentPage}
        data-selected={pageIndex}
      >
        {pageIndex + 1}
      </a>
    </li>
  );

  return (
    <ul className="mx-auto inline h-10 text-base sm:flex" role="navigation" aria-label="Pagination">
      {currentPage > 0 && (
        <li
          key="prev"
          onClick={() => handlePageClick(currentPage - 1)}
          className="m-2 cursor-pointer rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 sm:m-0 sm:mx-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <a
            className="ml-0 flex h-10 items-center justify-center px-4 leading-tight"
            aria-label="Previous page"
            data-selected={currentPage}
          >
            <ArrowLeftIcon className="h-5" />
          </a>
        </li>
      )}
      {renderDots()}
      {currentPage < pageCount - 1 && (
        <li
          key="next"
          onClick={() => handlePageClick(currentPage + 1)}
          className="m-2 cursor-pointer rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 sm:m-0 sm:mx-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <a
            className="ml-0 flex h-10 items-center justify-center px-4 leading-tight"
            aria-label="Next page"
            data-selected={currentPage + 1}
          >
            <ArrowRightIcon className="h-5" />
          </a>
        </li>
      )}
    </ul>
  );
}
