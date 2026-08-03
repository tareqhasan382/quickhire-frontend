import { Select } from './Select'
import type { SelectProps } from './Select'
import { categories } from '../../data/categories'

export interface CategorySelectProps extends Omit<SelectProps, 'options'> {
  valueMode?: 'name' | 'slug'
}

export function CategorySelect({
  valueMode = 'name',
  placeholder = 'Select a category',
  ...props
}: CategorySelectProps) {
  const options = categories.map((category) => ({
    value: valueMode === 'slug' ? category.slug : category.name,
    label: category.name,
  }))

  return <Select {...props} options={options} placeholder={placeholder} />
}
