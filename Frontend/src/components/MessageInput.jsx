import { useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, SendIcon, X } from "lucide-react";
import toast from "react-hot-toast";

function MessageInput() {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({ text: text.trim(), image: imagePreview });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 bg-slate-900 border-t border-slate-700/50 w-full mt-auto">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img src={imagePreview} alt="Preview" className="h-20 rounded-md border border-slate-600" />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center text-white"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="input flex-1"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`auth-btn px-3 !w-auto ${imagePreview ? "text-cyan-400 border-cyan-400" : "text-slate-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image className="size-5" />
          </button>
        </div>

        <button type="submit" className="auth-btn px-4 !w-auto" disabled={!text.trim() && !imagePreview}>
          <SendIcon className="size-5" />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;
