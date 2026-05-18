import { useState } from "react";

export default function ResumeChat({ resumeText }) {

const [messages, setMessages] = useState([
{ role: "assistant", content: "Hi! Ask me anything about your resume." }
]);

const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);

const sendMessage = async () => {


if (!input.trim()) return;

const newMessages = [
  ...messages,
  { role: "user", content: input }
];

setMessages(newMessages);
setInput("");
setLoading(true);

try {

  const res = await fetch("http://localhost:5000/api/chat/resume", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: input,
      resumeText
    })
  });

  const data = await res.json();

  setMessages([
    ...newMessages,
    { role: "assistant", content: data.answer }
  ]);

} catch (err) {
  console.error(err);
}

setLoading(false);


};

return (


<div className="bg-white/[0.04] border border-white/10 rounded-xl p-4 flex flex-col h-[500px]">

  <h3 className="text-white mb-3 font-semibold">
    AI Resume Assistant
  </h3>

  <div className="flex-1 overflow-y-auto space-y-3 mb-3">

    {messages.map((m, i) => (

      <div
        key={i}
        className={`text-sm p-3 rounded-xl max-w-[80%] ${
          m.role === "user"
            ? "bg-purple-600/30 ml-auto"
            : "bg-white/10"
        }`}
      >
        {m.content}
      </div>

    ))}

    {loading && (
      <p className="text-slate-400 text-xs">
        AI is thinking...
      </p>
    )}

  </div>

  <div className="flex gap-2">

    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Ask about your resume..."
      className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
    />

    <button
      onClick={sendMessage}
      className="bg-purple-600 px-4 rounded-lg text-sm"
    >
      Send
    </button>

  </div>

</div>


);
}
