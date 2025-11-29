import React, { useState } from 'react';

const FileSubmission = ({ taskId, userId }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const apiBase = 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setMessage('❌ File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('❌ Please select a file');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('taskId', taskId);
      formData.append('userId', userId);

      const res = await fetch(`${apiBase}/submissions/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        setMessage('✅ File submitted successfully! Admin will review it soon.');
        setFile(null);
        e.target.reset();
      } else {
        setMessage('❌ Failed to submit file');
      }
    } catch (error) {
      setMessage('❌ Error submitting file: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-submission-container">
      <form onSubmit={handleSubmit} className="submission-form">
        <div className="form-group">
          <label htmlFor="file-input">📁 Select File to Submit:</label>
          <input
            id="file-input"
            type="file"
            onChange={handleFileChange}
            className="file-input"
            disabled={uploading}
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.mp4,.mov"
          />
          {file && <p className="file-selected">✅ Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)</p>}
        </div>

        <button type="submit" disabled={uploading || !file} className="submit-btn">
          {uploading ? '⏳ Uploading...' : '📤 Submit File'}
        </button>
      </form>

      {message && <p className={`message ${message.includes('✅') ? 'success' : 'error'}`}>{message}</p>}

      <div className="submission-info">
        <h4>📋 Submission Guidelines:</h4>
        <ul>
          <li>Maximum file size: 10MB</li>
          <li>Accepted formats: PDF, DOC, DOCX, TXT, JPG, PNG, MP4, MOV</li>
          <li>Admin will review and approve/reject within 24 hours</li>
          <li>You'll receive feedback on your submission</li>
        </ul>
      </div>
    </div>
  );
};

export default FileSubmission;
