import { Compass } from "lucide-react"
import { useOutletContext } from "react-router-dom";
function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const categories = [
    "All",
    "Music",
    "Gaming",
    "React",
    "JavaScript",
    "Programming",
    "News",
    "Live",
    "Entertainment"

  ];
  const { toggleSidebar } = useOutletContext();
  return (
    <div className="category-scroll mb-5 flex gap-3 overflow-x-auto pb-1">
      <button className="sm:hidden" onClick={toggleSidebar}>
        {" "}
        <Compass size={24} />
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`
      shrink-0 rounded-lg px-4 py-2
      text-sm font-medium
      transition
      ${
        selectedCategory === category
          ? "bg-black text-white dark:bg-white dark:text-black"
          : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
      }
    `}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
