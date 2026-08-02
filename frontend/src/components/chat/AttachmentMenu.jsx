import { Paperclip } from "lucide-react";
import { ALLOWED_FILE_TYPES } from "@/constants/chat";

export default function AttachmentMenu({
  onSelect = () => Toast.success("File selected successfully."),
}) {
  return (
    <>
      <input
        id="chat-file"
        type="file"
        hidden
        accept={ALLOWED_FILE_TYPES.join(",")}
        onChange={onSelect}
      />

      <label
        htmlFor="chat-file"
        className="
        h-11
        w-11
        rounded-xl
        border
        border-border
        bg-card
        flex
        items-center
        justify-center
        cursor-pointer
        hover:bg-slate-700
        transition"
      >
        <Paperclip size={18} />
      </label>
    </>
  );
}