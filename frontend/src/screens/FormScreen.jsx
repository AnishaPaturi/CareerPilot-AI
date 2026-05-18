import React, { useState } from 'react'

export default function FormScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    summary: '',
    skills: '',
    experience: '',
    education: '',
    projects: ''
  })

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem('resumeData', JSON.stringify(formData))
    window.location.href = '/preview'
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Resume Builder</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Professional Summary</label>
          <textarea name="summary" value={formData.summary} onChange={handleChange} className="w-full p-2 border rounded" rows="3" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
          <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Experience</label>
          <textarea name="experience" value={formData.experience} onChange={handleChange} className="w-full p-2 border rounded" rows="3" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Education</label>
          <textarea name="education" value={formData.education} onChange={handleChange} className="w-full p-2 border rounded" rows="3" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Projects</label>
          <textarea name="projects" value={formData.projects} onChange={handleChange} className="w-full p-2 border rounded" rows="3" />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Preview Resume
        </button>
      </form>
    </div>
  )
}