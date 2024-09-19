import Link from 'next/link';
import LogoSquare from '~components/logo-square';
const { SITE_NAME } = process.env;
const CustomerHeader = () => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="justify-center lg:flex">
        <Link
          className="flex items-center justify-center gap-2 text-black md:pt-1 dark:text-white"
          href="/"
        >
          <LogoSquare />
          <span className="uppercase">{SITE_NAME}</span>
        </Link>
      </div>
    </div>
  );
};

export default CustomerHeader;
