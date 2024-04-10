import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import ProfileSection from "./profileSection";

export default async function Header() {
  return (
    <div className="sticky top-0 flex justify-between p-2 dark:dark:bg-gray-800 bg-neutral-100 transition-colors duration-100 z-10">
      {/* Left */}
      <div>
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/img/logo.webp" alt="Logo" width={50} height={50} />
          <p>Das verrückte Labyrinth</p>
        </Link>
      </div>

      <div className="flex space-x-5 items-center">
        <ProfileSection></ProfileSection>
        <ThemeToggle></ThemeToggle>
      </div>
    </div>
  );
}
