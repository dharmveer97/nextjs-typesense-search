'use client';

import { Formik, Form, Field, FieldArray } from 'formik';
import { productValidationSchema } from '@/lib/validation/schemas';
import { Product } from '@/types/typesense';
import { useState } from 'react';
import { generateId } from '@/lib/utils';

interface ProductFormProps {
  onSubmit?: (product: Partial<Product>) => void;
  initialValues?: Partial<Product>;
  mode?: 'create' | 'edit';
}

const categories = [
  { value: 'Electronics', subcategories: ['Audio', 'Wearables', 'Gaming', 'Computer Accessories', 'Storage'] },
  { value: 'Photography', subcategories: ['Lenses', 'Cameras', 'Accessories'] },
  { value: 'Furniture', subcategories: ['Office', 'Home', 'Outdoor'] },
  { value: 'Sports', subcategories: ['Fitness', 'Outdoor', 'Team Sports'] },
];

export function ProductForm({ onSubmit, initialValues, mode = 'create' }: ProductFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const defaultValues: Partial<Product> = {
    name: '',
    description: '',
    category: '',
    subcategory: '',
    price: 0,
    rating: 0,
    reviews_count: 0,
    in_stock: true,
    brand: '',
    tags: [],
    image_url: '',
    ...initialValues,
  };

  const handleSubmit = async (values: Partial<Product>) => {
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const endpoint = mode === 'edit' && values.id 
        ? '/api/typesense/documents' 
        : '/api/typesense/documents';
      
      const method = mode === 'edit' && values.id ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to save product');
      }

      setSubmitSuccess(true);
      if (onSubmit) {
        onSubmit(values);
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={productValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, values, setFieldValue }) => (
        <Form className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <Field
                name="name"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.name && touched.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                Brand
              </label>
              <Field
                name="brand"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.brand && touched.brand && (
                <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Field
              name="description"
              as="textarea"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.description && touched.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <Field
                name="category"
                as="select"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setFieldValue('category', e.target.value);
                  setFieldValue('subcategory', '');
                }}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.value}
                  </option>
                ))}
              </Field>
              {errors.category && touched.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            <div>
              <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                Subcategory
              </label>
              <Field
                name="subcategory"
                as="select"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                disabled={!values.category}
              >
                <option value="">Select a subcategory</option>
                {values.category &&
                  categories
                    .find((cat) => cat.value === values.category)
                    ?.subcategories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
              </Field>
              {errors.subcategory && touched.subcategory && (
                <p className="mt-1 text-sm text-red-600">{errors.subcategory}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price ($)
              </label>
              <Field
                name="price"
                type="number"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.price && touched.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                Rating (0-5)
              </label>
              <Field
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.rating && touched.rating && (
                <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
              )}
            </div>

            <div>
              <label htmlFor="reviews_count" className="block text-sm font-medium text-gray-700">
                Review Count
              </label>
              <Field
                name="reviews_count"
                type="number"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.reviews_count && touched.reviews_count && (
                <p className="mt-1 text-sm text-red-600">{errors.reviews_count}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
              Image URL (optional)
            </label>
            <Field
              name="image_url"
              type="url"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.image_url && touched.image_url && (
              <p className="mt-1 text-sm text-red-600">{errors.image_url}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <FieldArray name="tags">
              {({ push, remove }) => (
                <div className="space-y-2">
                  {values.tags?.map((tag, index) => (
                    <div key={index} className="flex gap-2">
                      <Field
                        name={`tags.${index}`}
                        type="text"
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => push('')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Add Tag
                  </button>
                </div>
              )}
            </FieldArray>
          </div>

          <div className="flex items-center">
            <Field
              name="in_stock"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="in_stock" className="ml-2 block text-sm text-gray-900">
              In Stock
            </label>
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
              Product saved successfully!
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {submitting ? 'Saving...' : mode === 'edit' ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}