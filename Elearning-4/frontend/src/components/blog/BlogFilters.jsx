import React from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Input, Select, Button } from '../ui'
import { useDebounce } from '../../hooks/useDebounce'

const BlogFilters = ({ 
  filters, 
  onFiltersChange, 
  categories = [], 
  tags = [],
  className = '' 
}) => {
  const [localSearch, setLocalSearch] = React.useState(filters.search)
  const debouncedSearch = useDebounce(localSearch, 500)

  React.useEffect(() => {
    onFiltersChange({ search: debouncedSearch })
  }, [debouncedSearch, onFiltersChange])

  const handleSearchChange = (value) => {
    setLocalSearch(value)
  }

  const handleCategoryChange = (category) => {
    onFiltersChange({ category: category || '' })
  }

  const handleTagChange = (tag) => {
    onFiltersChange({ tag: tag || '' })
  }

  const handleSortChange = (sortBy) => {
    onFiltersChange({ sortBy })
  }

  const clearFilters = () => {
    setLocalSearch('')
    onFiltersChange({
      search: '',
      category: '',
      tag: '',
      sortBy: 'created_at'
    })
  }

  const hasActiveFilters = filters.search || filters.category || filters.tag

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-1">
          <Input
            label="Search blogs"
            type="text"
            placeholder="Search by title or content..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>

        {/* Category Filter */}
        <div>
          <Select
            label="Category"
            value={filters.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            options={[
              { value: '', label: 'All Categories' },
              ...categories.map(cat => ({
                value: cat.id,
                label: cat.name
              }))
            ]}
          />
        </div>

        {/* Tag Filter */}
        <div>
          <Select
            label="Tag"
            value={filters.tag}
            onChange={(e) => handleTagChange(e.target.value)}
            options={[
              { value: '', label: 'All Tags' },
              ...tags.map(tag => ({
                value: tag.id,
                label: tag.name
              }))
            ]}
          />
        </div>

        {/* Sort & Clear */}
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Select
              label="Sort by"
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              options={[
                { value: 'created_at', label: 'Newest First' },
                { value: 'title', label: 'Title A-Z' },
                { value: 'view_count', label: 'Most Viewed' },
                { value: 'updated_at', label: 'Recently Updated' }
              ]}
            />
          </div>
          
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="whitespace-nowrap"
              icon={<X className="h-4 w-4" />}
            >
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogFilters