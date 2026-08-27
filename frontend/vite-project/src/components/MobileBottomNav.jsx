import { Home, PlaySquare, UserRound,} from "lucide-react";
import ytShorts from "../assets/images/shorts.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutubeShorts } from "@fortawesome/free-brands-svg-icons";

function MobileBottomNav() {
  return (
    <nav
      className="
        fixed bottom-0 left-0 z-50
        flex h-16 w-full
        items-center justify-around
        border-t border-gray-200
        bg-white
        dark:border-gray-800
        dark:bg-gray-950
        md:hidden
      "
    >
      {/* Home */}
      <button
        className="
          flex flex-col items-center
          gap-1
          text-xs
          text-black
          dark:text-white
        "
      >
        <Home size={21} />
        <span>Home</span>
      </button>

      {/* Shorts */}
      <button
        className="
          flex flex-col items-center
          gap-1
          text-xs
          text-black
          dark:text-white
        "
      >
        {/* <Youtube size={21} /> */}
        <FontAwesomeIcon icon={faYoutubeShorts} size="xl" />
        <span>Shorts</span>
      </button>

      {/* Subscriptions */}
      <button
        className="
          flex flex-col items-center
          gap-1
          text-xs
          text-black
          dark:text-white
        "
      >
        <PlaySquare size={21} />
        <span>Subscriptions</span>
      </button>

      {/* You */}
      <button
        className="
          flex flex-col items-center
          gap-1
          text-xs
          text-black
          dark:text-white
        "
      >
        <UserRound size={21} />
        <span>You</span>
      </button>
    </nav>
  );
}

export default MobileBottomNav;
