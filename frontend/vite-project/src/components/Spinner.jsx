function Spinner() {
  // Small spinner for buttons and small loading areas
  return (
    <span
      className="
        inline-block
        h-4
        w-4
        animate-spin
        rounded-full
        border-2
        border-current
        border-t-transparent
      "
    ></span>
  );
}

export default Spinner;
