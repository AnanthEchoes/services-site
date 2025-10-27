import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'author', title: 'ClientName', type: 'string' }),
    defineField({ name: 'message', title: 'Company', type: 'string' }),
    defineField({ name: 'rating', title: 'Feedback', type: 'text' }), // optional
  ],
})
