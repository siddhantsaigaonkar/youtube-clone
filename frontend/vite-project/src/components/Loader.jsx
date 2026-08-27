function Loader() {
  // Show a spinning loader while videos are loading
  return (
    <div className="flex min-h-60 items-center justify-center">
      <div
        className="
          h-10
          w-10
          animate-spin
          rounded-full
          border-4
          border-gray-300
          border-t-red-600
          dark:border-gray-600
          dark:border-t-red-500
        "
      ></div>
    </div>
  );
}

export default Loader;
