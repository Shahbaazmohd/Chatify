import { MessageSquareIcon } from "lucide-react";

function NoChatHistoryPlaceholder({ name }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-800/50 rounded-xl my-8 border border-slate-700/50">
      <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mb-4">
        <MessageSquareIcon className="size-8 text-cyan-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No messages yet</h3>
      <p className="text-slate-400">Say hello to {name} to start the conversation!</p>
    </div>
  );
}

export default NoChatHistoryPlaceholder;
