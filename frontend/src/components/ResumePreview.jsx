import React from 'react'

export default function ResumePreview({ data }) {
  return (
    <div className="border rounded-lg p-6 bg-white shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">{data.name}</h2>
      <p className="text-gray-600">{data.email} | {data.phone}</p>
      
      {data.summary && (
        <div className="mt-4">
          <h3 className="font-semibold border-b pb-1">Professional Summary</h3>
          <p className="mt-2">{data.summary}</p>
        </div>
      )}
      
      {data.skills && (
        <div className="mt-4">
          <h3 className="font-semibold border-b pb-1">Skills</h3>
          <p className="mt-2">{data.skills}</p>
        </div>
      )}
      
      {data.experience && (
        <div className="mt-4">
          <h3 className="font-semibold border-b pb-1">Experience</h3>
          <p className="mt-2">{data.experience}</p>
        </div>
      )}
      
      {data.education && (
        <div className="mt-4">
          <h3 className="font-semibold border-b pb-1">Education</h3>
          <p className="mt-2">{data.education}</p>
        </div>
      )}
      
      {data.projects && (
        <div className="mt-4">
          <h3 className="font-semibold border-b pb-1">Projects</h3>
          <p className="mt-2">{data.projects}</p>
        </div>
      )}
    </div>
  )
}