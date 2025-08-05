import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, X, Image as ImageIcon, MapPin } from 'lucide-react';
import { usePost } from '../context/PostContext';
import Navbar from '../components/Navbar';

const Upload: React.FC = () => {
  const { createPost, loading } = usePost();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setError('');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image');
      return;
    }

    try {
      await createPost({
        image: selectedFile,
        caption: caption.trim(),
        location: location.trim(),
      });

      // Reset form
      setSelectedFile(null);
      setPreviewUrl('');
      setCaption('');
      setLocation('');
      
      // Navigate to feed
      navigate('/');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create post');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900">Create new post</h1>
            <p className="text-gray-600 mt-1">Share a photo with your followers</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* File Upload */}
            {!selectedFile ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-snapzy-primary transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload a photo
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop or click to select
                </p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select from computer
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-4">
                  JPG, PNG, GIF up to 10MB
                </p>
              </div>
            ) : (
              /* Image Preview */
              <div className="space-y-6">
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-auto max-h-96 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Caption */}
                <div>
                  <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
                    Caption
                  </label>
                  <textarea
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a caption..."
                    rows={4}
                    maxLength={500}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-snapzy-primary focus:border-transparent resize-none"
                  />
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-gray-500">
                      Use hashtags to reach more people
                    </p>
                    <p className="text-xs text-gray-500">
                      {caption.length}/500
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Location (optional)
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Add location"
                    maxLength={100}
                    className="input-field"
                  />
                </div>

                {/* Actions */}
                <div className="flex space-x-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="btn-secondary flex-1"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Change photo
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1"
                  >
                    {loading ? 'Posting...' : 'Share post'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Tips for great posts</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use good lighting for better photo quality</li>
            <li>• Add relevant hashtags to reach more people</li>
            <li>• Share authentic moments and stories</li>
            <li>• Engage with your community in the comments</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Upload;