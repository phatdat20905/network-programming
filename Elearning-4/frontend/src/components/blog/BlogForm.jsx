import React, { useState, useEffect } from 'react'
import { useForm } from '../../hooks/useForm'
import { Input, Textarea, Select, Button, ImageUpload } from '../ui'
import { validation } from '../../utils/validation'
import { categoryAPI, tagAPI, uploadAPI } from '../../api'
import toast from 'react-hot-toast'

const BlogForm = ({ initialData = {}, onSubmit, loading = false }) => {
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [imageUploading, setImageUploading] = useState(false)

  const isEdit = !!initialData.id

  const { values, errors, handleChange, handleBlur, setValue, validate } = useForm(
    {
      title: initialData.title || '',
      content: initialData.content || '',
      excerpt: initialData.excerpt || '',
      category_id: initialData.category_id || '',
      image_url: initialData.image_url || '',
      status: initialData.status || 'published'
    },
    validation.validateBlog
  )

  useEffect(() => {
    loadCategories()
    loadTags()
    if (initialData.tags) {
      setSelectedTags(initialData.tags.map(tag => tag.id))
    }
  }, [initialData])

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getAll({ limit: 100 })
      setCategories(response.data)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadTags = async () => {
    try {
      const response = await tagAPI.getAll({ limit: 100 })
      setTags(response.data)
    } catch (error) {
      console.error('Error loading tags:', error)
    }
  }

  const handleImageUpload = async (file) => {
    try {
      setImageUploading(true)
      const formData = new FormData()
      formData.append('image', file)
      
      const response = await uploadAPI.uploadImage(formData)
      setValue('image_url', response.data.url)
      toast.success('Image uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload image')
      console.error('Image upload error:', error)
    } finally {
      setImageUploading(false)
    }
  }

  const handleTagChange = (tagId) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId)
      } else {
        return [...prev, tagId]
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validate()) return

    const formData = {
      ...values,
      tags: selectedTags
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <Input
        label="Blog Title"
        name="title"
        value={values.title}
        onChange={(e) => handleChange('title', e.target.value)}
        onBlur={() => handleBlur('title')}
        error={errors.title}
        placeholder="Enter a compelling title for your blog"
        required
      />

      {/* Excerpt */}
      <Textarea
        label="Excerpt"
        name="excerpt"
        value={values.excerpt}
        onChange={(e) => handleChange('excerpt', e.target.value)}
        onBlur={() => handleBlur('excerpt')}
        error={errors.excerpt}
        placeholder="Brief description of your blog (optional)"
        rows={3}
        helperText="A short summary that will appear in blog listings"
      />

      {/* Category */}
      <Select
        label="Category"
        name="category_id"
        value={values.category_id}
        onChange={(e) => handleChange('category_id', e.target.value)}
        onBlur={() => handleBlur('category_id')}
        error={errors.category_id}
        required
        options={[
          { value: '', label: 'Select a category' },
          ...categories.map(cat => ({
            value: cat.id,
            label: cat.name
          }))
        ]}
      />

      {/* Featured Image */}
      <ImageUpload
        label="Featured Image"
        imageUrl={values.image_url}
        onImageUpload={handleImageUpload}
        onRemove={() => setValue('image_url', '')}
        uploading={imageUploading}
        helperText="Upload a featured image for your blog (optional)"
      />

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleTagChange(tag.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedTags.includes(tag.id)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Click to select tags for your blog
        </p>
      </div>

      {/* Content */}
      <Textarea
        label="Blog Content"
        name="content"
        value={values.content}
        onChange={(e) => handleChange('content', e.target.value)}
        onBlur={() => handleBlur('content')}
        error={errors.content}
        placeholder="Write your blog content here..."
        rows={12}
        required
        helperText="You can use Markdown or HTML formatting"
      />

      {/* Status */}
      <Select
        label="Status"
        name="status"
        value={values.status}
        onChange={(e) => handleChange('status', e.target.value)}
        options={[
          { value: 'draft', label: 'Draft' },
          { value: 'published', label: 'Published' }
        ]}
        helperText="Save as draft or publish immediately"
      />

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          loading={loading}
          className="flex-1"
          size="large"
        >
          {isEdit ? 'Update Blog' : 'Publish Blog'}
        </Button>
        
        {isEdit && (
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

export default BlogForm