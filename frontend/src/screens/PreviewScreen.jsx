import React from 'react'

export default function PreviewScreen() {
  const data = JSON.parse(localStorage.getItem('resumeData') || '{}')
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Resume Preview</h1>
      <div className="border rounded-lg p-6 bg-white shadow">
        <h2 className="text-2xl font-bold">{data.name}</h2>
        <p className="text-gray-600">{data.email} | {data.phone}</p>
        
        {data.summary && (
          <div className="mt-4">
            <h3 className="font-semibold text-lg">Professional Summary</h3>
            <p>{data.summary}</p>
          </div>
        )}
        
        {data.skills && (
          <div className="mt-4">
            <h3 className="font-semibold text-lg">Skills</h3>
            <p>{data.skills}</p>
          </div>
        )}
        
        {data.experience && (
          <div className="mt-4">
            <h3 className="font-semibold text-lg">Experience</h3>
            <p>{data.experience}</p>
          </div>
        )}
        
        {data.education && (
          <div className="mt-4">
            <h3 className="font-semibold text-lg">Education</h3>
            <p>{data.education}</p>
          </div>
        )}
        
        {data.projects && (
          <div className="mt-4">
            <h3 className="font-semibold text-lg">Projects</h3>
            <p>{data.projects}</p>
          </div>
        )}
      </div>
      <div className="mt-4 space-x-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Download PDF</button>
        <button onClick={() => window.location.href = '/form'} className="px-4 py-2 border rounded">
          Edit
        </button>
      </div>
    </div>
  )
}