import * as Yup from 'yup';

export const productValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .max(200, 'Name must be less than 200 characters')
    .required('Product name is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .required('Description is required'),
  category: Yup.string()
    .required('Category is required'),
  subcategory: Yup.string()
    .required('Subcategory is required'),
  price: Yup.number()
    .positive('Price must be a positive number')
    .required('Price is required'),
  rating: Yup.number()
    .min(0, 'Rating must be at least 0')
    .max(5, 'Rating must be at most 5')
    .required('Rating is required'),
  reviews_count: Yup.number()
    .min(0, 'Reviews count must be at least 0')
    .integer('Reviews count must be an integer')
    .required('Reviews count is required'),
  in_stock: Yup.boolean()
    .required('Stock status is required'),
  brand: Yup.string()
    .required('Brand is required'),
  tags: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one tag is required'),
  image_url: Yup.string()
    .url('Must be a valid URL')
    .nullable(),
});