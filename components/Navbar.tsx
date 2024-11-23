"use client";

import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  return (
    <nav className="flex gap-4 p-4 border-b border-black ">
      <p
        className="font-medium text-sm cursor-pointer"
        onClick={() => router.push("/")}
      >
        Normal
      </p>
      <p
        className="font-medium text-sm cursor-pointer"
        onClick={() => router.push("/base-ui")}
      >
        Base Ui
      </p>
    </nav>
  );
};

export default Navbar;
