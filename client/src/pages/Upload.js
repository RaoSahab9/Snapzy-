import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, X, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Upload = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('Image size must be less than 10MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image) {
      toast.error('Please select an image');
      return;
    }

    setIsUploading(true);

    try {
      const formData = {
        image: preview,
        caption: caption.trim(),
        location: location.trim(),
        tags: tags.trim()
      };

      await axios.post('/api/posts', formData);
      toast.success('Post created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Upload error:', error);
      const message = error.response?.data?.message || 'Failed to create post';
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Post</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            
            {!preview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
              >
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Click to upload an image</p>
                <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
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
              rows={3}
              className="input resize-none"
              placeholder="Write a caption for your post..."
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 mt-1">
              {caption.length}/1000 characters
            </p>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location (optional)
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input"
              placeholder="Add location..."
              maxLength={100}
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags (optional)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="input"
              placeholder="Add tags separated by commas..."
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: travel, nature, photography
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={!image || isUploading}
              className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4" />
                  <span>Share Post</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;