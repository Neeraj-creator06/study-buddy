import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { materialService } from '../services/materialService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  UploadCloud,
  FileText,
  Trash2,
  BookOpen,
  Layers,
  HelpCircle,
  MessageSquare,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Clock,
  HardDrive,
  Tag,
} from 'lucide-react';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const fetchMaterials = async () => {
    try {
      const res = await materialService.getMaterials();
      if (res.success) {
        setMaterials(res.data.materials || []);
      }
    } catch (err) {
      console.error('Failed to load materials:', err);
      setError('Could not load uploaded study materials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleSelectedFile(e.target.files[0]);
    }
  };

  const handleSelectedFile = (selected) => {
    const ext = selected.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(ext)) {
      setError('Unsupported file type. Please select a PDF, DOCX, or TXT file.');
      return;
    }
    setError('');
    setFile(selected);
    if (!title) {
      setTitle(selected.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccess('');
      const res = await materialService.uploadMaterial(file, title, tags);
      if (res.success) {
        setSuccess('Document uploaded and processed successfully!');
        setFile(null);
        setTitle('');
        setTags('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchMaterials();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await materialService.deleteMaterial(id);
      setMaterials((prev) => prev.filter((m) => m._id !== id));
      setSuccess(`"${title}" deleted successfully.`);
    } catch (err) {
      setError('Failed to delete material.');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-alice tracking-tight flex items-center gap-2.5">
          <FileText className="w-7 h-7 text-salesport" />
          Study Materials Library
        </h1>
        <p className="text-xs sm:text-sm text-alice-muted mt-1">
          Upload PDF, DOCX, or TXT lecture notes. Text is parsed automatically for instant AI generation.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      {/* Upload Dropzone Form */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-brand-border">
        <h2 className="text-base font-bold text-alice mb-4 flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-salesport" />
          Upload New Study Material
        </h2>

        <form onSubmit={handleUpload} className="space-y-4">
          {/* Drag & Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
              dragActive
                ? 'border-salesport bg-salesport/15 scale-[1.01]'
                : file
                ? 'border-emerald-500/50 bg-emerald-500/10'
                : 'border-salesport/30 hover:border-salesport/60 bg-brand-surface/40 hover:bg-brand-surface/70'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-14 h-14 mx-auto rounded-2xl bg-salesport/20 border border-salesport/40 flex items-center justify-center text-salesport mb-3">
              <UploadCloud className="w-7 h-7" />
            </div>

            {file ? (
              <div>
                <p className="text-sm font-bold text-emerald-300">{file.name}</p>
                <p className="text-xs text-alice-muted mt-1">
                  Ready to process ({formatFileSize(file.size)}) — Click to change file
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-alice">
                  Drag and drop your study document here, or <span className="text-salesport underline">browse</span>
                </p>
                <p className="text-xs text-alice-muted mt-1">
                  Supported formats: PDF, Microsoft Word (.docx), Plain Text (.txt) • Up to 25 MB
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-alice mb-1">
                Custom Document Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chapter 4 - Database Normalization"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport text-alice text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-alice mb-1">
                Subject Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. DBMS, SQL, Midterm Exam"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport text-alice text-xs outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-alice glow-button flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {uploading ? (
              <span>Extracting Document Text & Uploading...</span>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>Upload & Extract Text</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Materials Cards List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-alice flex items-center gap-2">
            <span>Your Uploaded Materials</span>
            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-salesport/20 text-salesport-light border border-salesport/30">
              {materials.length} {materials.length === 1 ? 'file' : 'files'}
            </span>
          </h2>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading your documents..." />
        ) : materials.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center border border-brand-border">
            <FileText className="w-12 h-12 mx-auto text-alice-muted/40 mb-3" />
            <h3 className="text-base font-bold text-alice">No Study Materials Uploaded Yet</h3>
            <p className="text-xs text-alice-muted max-w-sm mx-auto mt-1">
              Upload your first lecture slides, chapter notes, or syllabus above to enable AI-powered study assistance.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {materials.map((mat) => (
              <div
                key={mat._id}
                className="glass-card rounded-2xl p-5 border border-brand-border hover:border-salesport/50 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border ${
                        mat.fileType === 'pdf'
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          : mat.fileType === 'docx'
                          ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {mat.fileType}
                    </span>

                    <button
                      onClick={() => handleDelete(mat._id, mat.title)}
                      className="p-1.5 rounded-lg text-alice-muted hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Delete Material"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-alice line-clamp-2 mb-2">{mat.title}</h3>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-alice-muted mb-4">
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3.5 h-3.5 text-salesport" />
                      {formatFileSize(mat.fileSize)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-salesport" />
                      {new Date(mat.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {mat.tags && mat.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {mat.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-brand-surface border border-brand-border text-alice-muted"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick AI Generators for this material */}
                <div className="pt-3 border-t border-brand-border/60 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => navigate(`/summaries?materialId=${mat._id}`)}
                    className="p-2 rounded-xl bg-brand-surface hover:bg-salesport/20 hover:border-salesport/40 border border-brand-border text-[11px] font-semibold text-alice flex items-center justify-center gap-1.5 transition"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-salesport" />
                    <span>Summary</span>
                  </button>

                  <button
                    onClick={() => navigate(`/flashcards?materialId=${mat._id}`)}
                    className="p-2 rounded-xl bg-brand-surface hover:bg-salesport/20 hover:border-salesport/40 border border-brand-border text-[11px] font-semibold text-alice flex items-center justify-center gap-1.5 transition"
                  >
                    <Layers className="w-3.5 h-3.5 text-salesport" />
                    <span>Flashcards</span>
                  </button>

                  <button
                    onClick={() => navigate(`/quiz?materialId=${mat._id}`)}
                    className="p-2 rounded-xl bg-brand-surface hover:bg-salesport/20 hover:border-salesport/40 border border-brand-border text-[11px] font-semibold text-alice flex items-center justify-center gap-1.5 transition"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-salesport" />
                    <span>Quiz</span>
                  </button>

                  <button
                    onClick={() => navigate(`/ask-ai?materialId=${mat._id}`)}
                    className="p-2 rounded-xl bg-salesport/20 hover:bg-salesport border border-salesport/40 text-[11px] font-bold text-alice flex items-center justify-center gap-1.5 transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-alice" />
                    <span>Ask AI</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
