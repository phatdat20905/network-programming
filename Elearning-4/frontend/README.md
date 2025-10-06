# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


frontend/
├── public/
│   ├── index.html
│   └── vite.svg
├── src/
│   ├── api/
│   │   ├── axiosInstance.js
│   │   ├── auth.js
│   │   ├── blog.js
│   │   ├── category.js
│   │   ├── tag.js
│   │   ├── user.js
│   │   └── upload.js
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Textarea.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── Alert.jsx
│   │   │   └── ImageUpload.jsx
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Layout.jsx
│   │   ├── auth/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── AdminRoute.jsx
│   │   ├── blog/
│   │   │   ├── BlogCard.jsx
│   │   │   ├── BlogList.jsx
│   │   │   ├── BlogForm.jsx
│   │   │   ├── BlogFilters.jsx
│   │   │   └── BlogDetail.jsx
│   │   └── admin/
│   │       ├── UserManagement.jsx
│   │       ├── CategoryManagement.jsx
│   │       ├── TagManagement.jsx
│   │       └── Dashboard.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   ├── useForm.js
│   │   └── useDebounce.js
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── blog/
│   │   │   ├── BlogListPage.jsx
│   │   │   ├── BlogDetailPage.jsx
│   │   │   ├── BlogCreatePage.jsx
│   │   │   └── BlogEditPage.jsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── UserManagementPage.jsx
│   │   │   ├── CategoryManagementPage.jsx
│   │   │   └── TagManagementPage.jsx
│   │   ├── Home.jsx
│   │   ├── Profile.jsx
│   │   └── NotFound.jsx
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── validation.js
│   │   └── formatters.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   ├── main.jsx
│   └── router.jsx
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js