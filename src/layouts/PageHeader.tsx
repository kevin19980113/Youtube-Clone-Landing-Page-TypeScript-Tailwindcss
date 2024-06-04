import { IoMdMenu } from "react-icons/io";
import logoImg from "../assets/logo.svg";
import { Button } from "../components/Button";
import { FaRegBell, FaRegUserCircle } from "react-icons/fa";
import { RiVideoUploadLine } from "react-icons/ri";
import { IoMic } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";

export function PageHeader() {
  const [showfullWidthSearch, setshowfullWidthSearch] = useState(false);

  return (
    <header className="flex gap-10 lg:gap-20 justify-between pt-2 mb-6 mx-4">
      <section
        className={`gap-4 items-center flex-shrink-0 ${
          showfullWidthSearch ? "hidden" : "flex"
        }`}
      >
        <Button size="icon" variant="ghost">
          <IoMdMenu className="size-6" />
        </Button>
        <a href="/" className="flex items-center gap-1 relative">
          <img src={logoImg} alt="logo" className="h-8" />
          <span className="text-2xl font-medium tracking-tighter">YouTube</span>
          <span className="text-xs text-bold text-gray-500 absolute top-0 right-0 translate-x-4">
            CA
          </span>
        </a>
      </section>

      <form
        className={`gap-4 flex-grow justify-center ${
          showfullWidthSearch ? "flex" : "hidden md:flex"
        }`}
      >
        {showfullWidthSearch && (
          <Button
            size="icon"
            variant="ghost"
            type="button"
            className="flex-shrink-0"
            onClick={() => setshowfullWidthSearch(false)}
          >
            <FaArrowLeft className="size-6" />
          </Button>
        )}
        <div className="flex flex-grow max-w-[600px]">
          <input
            type="search"
            placeholder="search"
            className="rounded-l-full border border-secondary-border shadow-inner shadow-secondary 
            py-1 px-4 text-lg w-full focus:border-blue-600 outline-none"
          />
          <Button
            className="py-2 px-4 rounded-r-full border-secondary-border border border-l-0
          flex-shrink-0"
          >
            <CiSearch className="size-6" />
          </Button>
        </div>
        <Button size="icon" type="button" className="flex-shrink-0">
          <IoMic className="size-6" />
        </Button>
      </form>

      <section
        className={`flex-shrink-0 items-center gap-1 ${
          showfullWidthSearch ? " hidden" : " flex"
        }`}
      >
        <Button
          size="icon"
          variant="ghost"
          className="md:hidden"
          onClick={() => setshowfullWidthSearch(true)}
        >
          <CiSearch className="size-6" />
        </Button>
        <Button size="icon" variant="ghost" className="md:hidden">
          <IoMic className="size-6" />
        </Button>
        <Button size="icon" variant="ghost">
          <RiVideoUploadLine className="size-5" />
        </Button>
        <Button size="icon" variant="ghost">
          <FaRegBell className="size-5" />
        </Button>
        <Button size="icon" variant="ghost">
          <FaRegUserCircle className="size-5" />
        </Button>
      </section>
    </header>
  );
}
