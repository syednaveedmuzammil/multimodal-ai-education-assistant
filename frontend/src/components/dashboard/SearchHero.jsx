import {
  Search,
  ArrowRight,
} from "lucide-react";

export default function SearchHero() {
  return (
    <div
      className="
      mt-8
      rounded-2xl
      border
      border-border
      bg-card
      flex
      items-center
      px-5
      py-3"
    >

      <Search
        size={20}
        className="text-muted"
      />

      <input
        type="text"
        placeholder="Ask anything about your studies..."
        className="
        bg-transparent
        flex-1
        px-4
        outline-none
        text-white
        placeholder:text-muted"
      />

      <button
        className="
        h-10
        w-10
        rounded-xl
        bg-primary
        flex
        items-center
        justify-center
        hover:bg-violet-700
        transition"
      >
        <ArrowRight size={18}/>
      </button>

    </div>
  );
}