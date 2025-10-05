export default {
  async up(queryInterface, Sequelize) {
    // Get user and category IDs
    const [users] = await queryInterface.sequelize.query('SELECT id FROM users WHERE username = "admin"');
    const [categories] = await queryInterface.sequelize.query('SELECT id FROM categories WHERE slug = "technology"');
    
    const adminId = users[0].id;
    const techCategoryId = categories[0].id;

    await queryInterface.bulkInsert('blogs', [
      {
        title: 'Getting Started with React and Vite',
        slug: 'getting-started-with-react-and-vite',
        summary: 'Learn how to set up a modern React application with Vite for fast development and building.',
        content: `# Getting Started with React and Vite

In this comprehensive guide, we'll explore how to set up a modern React application using Vite, a next-generation frontend tooling that offers incredibly fast Hot Module Replacement (HMR) and optimized builds.

## Why Vite?

Vite provides:
- Lightning-fast cold server start
- Instant Hot Module Replacement (HMR)
- Optimized build output
- Rich features out of the box

## Installation

\`\`\`bash
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev
\`\`\`

## Project Structure

A typical Vite + React project structure looks like this:

\`\`\`
src/
  components/
  pages/
  hooks/
  utils/
  styles/
  App.jsx
  main.jsx
\`\`\`

## Conclusion

Vite revolutionizes the React development experience with its speed and simplicity. Give it a try for your next project!`,
        author_id: adminId,
        category_id: techCategoryId,
        is_published: true,
        published_at: new Date(),
        view_count: 150,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Mastering Tailwind CSS for Modern Web Development',
        slug: 'mastering-tailwind-css-for-modern-web-development',
        summary: 'Discover the power of utility-first CSS with Tailwind and build beautiful, responsive interfaces faster than ever.',
        content: `# Mastering Tailwind CSS

Tailwind CSS is a utility-first CSS framework that enables you to build custom designs without ever leaving your HTML.

## Key Benefits

- **Rapid Development**: Build UIs faster with utility classes
- **Responsive Design**: Built-in responsive modifiers
- **Customizable**: Complete control over your design system
- **Performance**: Purge unused CSS in production

## Getting Started

\`\`\`bash
npm install -D tailwindcss
npx tailwindcss init
\`\`\`

## Configuration

\`\`\`javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
\`\`\`

## Example Component

\`\`\`jsx
function Button({ children, variant = 'primary' }) {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300'
  };

  return (
    <button className={\`\${baseClasses} \${variants[variant]}\`}>
      {children}
    </button>
  );
}
\`\`\`

## Conclusion

Tailwind CSS transforms how we write CSS, making it more maintainable and scalable.`,
        author_id: adminId,
        category_id: techCategoryId,
        is_published: true,
        published_at: new Date(Date.now() - 86400000), // 1 day ago
        view_count: 89,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('blogs', null, {});
  }
};