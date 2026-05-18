import { useState } from "react";

export default function ResumeRewriter({ resumeText }) {

const [loading, setLoading] = useState(false);
const [improved, setImproved] = useState("");

const rewriteResume = async () => {


setLoading(true);

try {

  const res = await fetch("http://localhost:5000/api/ai/rewrite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ resumeText })
  });

  const data = await res.json();

  setImproved(data.improvedResume);

} catch (err) {

  console.error(err);

}

setLoading(false);


};

const downloadResume = () => {


const blob = new Blob([improved], { type: "text/plain" });

const url = URL.createObjectURL(blob);

const a = document.createElement("a");
a.href = url;
a.download = "improved_resume.txt";
a.click();


};

return (


<div className="bg-white/[0.04] border border-white/10 rounded-xl p-6 mt-6">

  <h3 className="text-white font-semibold mb-4">
    AI Resume Rewriter
  </h3>

  <button
    onClick={rewriteResume}
    className="bg-purple-600 px-4 py-2 rounded-lg text-sm"
  >
    {loading ? "Improving Resume..." : "Improve Resume"}
  </button>

  {improved && (

    <div className="mt-6">

      <h4 className="text-white mb-2">
        Improved Resume
      </h4>

      <textarea
        value={improved}
        readOnly
        className="w-full h-64 bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white"
      />

      <button
        onClick={downloadResume}
        className="mt-3 bg-green-600 px-4 py-2 rounded-lg text-sm"
      >
        Download Resume
      </button>

    </div>

  )}

</div>


);
}
