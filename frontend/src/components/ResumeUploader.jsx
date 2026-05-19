import { useState } from "react";

export default function ResumeUploader({ onUploaded }) {

const [progress, setProgress] = useState(0);

const uploadFile = (file) => {

const formData = new FormData();
formData.append("file", file);

const xhr = new XMLHttpRequest();

xhr.open("POST", "http://localhost:8080/api/ai/analyze-resume");

xhr.upload.onprogress = (event) => {

  const percent = Math.round(
    (event.loaded / event.total) * 100
  );

  setProgress(percent);

};

xhr.onload = () => {

  const res = JSON.parse(xhr.response);
  onUploaded(res);

};

xhr.send(formData);

};

const handleDrop = (e) => {

e.preventDefault();

const file = e.dataTransfer.files[0];

uploadFile(file);

};

return (

<div
  onDragOver={(e)=>e.preventDefault()}
  onDrop={handleDrop}
  className="border-2 border-dashed border-white/20 rounded-xl p-16 text-center text-white"
>

<p>Drag & Drop Resume Here</p>
<p className="text-xs text-slate-400">
  or click to upload
</p>

{progress > 0 && (

  <div className="mt-4">

    <div className="w-full bg-slate-700 h-2 rounded-full">

      <div
        style={{ width: `${progress}%` }}
        className="bg-purple-600 h-2 rounded-full"
      />

    </div>

    <p className="text-xs mt-1">
      {progress}%
    </p>

  </div>

)}

</div>

);

}
