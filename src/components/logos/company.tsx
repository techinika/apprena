import { APP } from "@/variables/globals";
import Image from "next/image";
import Link from "next/link";

const Company = () => (
  <Link
    href="/"
    className="relative z-20 flex items-center text-lg font-medium"
  >
    <Image
      src="/white-logo.png"
      width={40}
      height={100}
      alt={APP?.DESCRIPTION}
    />
  </Link>
);
export default Company;
