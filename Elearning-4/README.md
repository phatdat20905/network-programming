react-blog-app-2025/
├── frontend/                          # React + Vite + Tailwind
│   ├── src/
│   │   ├── api/
│   │   │   ├── axiosInstance.js
│   │   │   ├── auth.js
│   │   │   ├── blog.js
│   │   │   └── upload.js
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   └── LoadingSpinner.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Layout.jsx
│   │   │   └── blog/
│   │   │       ├── BlogCard.jsx
│   │   │       ├── BlogForm.jsx
│   │   │       └── BlogList.jsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useApi.js
│   │   │   └── useForm.js
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Blog/
│   │   │   │   ├── BlogList.jsx
│   │   │   │   ├── BlogCreate.jsx
│   │   │   │   ├── BlogEdit.jsx
│   │   │   │   └── BlogDetail.jsx
│   │   │   └── Profile.jsx
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── helpers.js
│   │   │   └── validation.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── router.jsx
│   ├── public/
│   ├── .env
│   ├── .env.example
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── backend/                           # Node.js + Express
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── cloudinary.js
│   │   │   └── constants.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── blogController.js
│   │   │   └── uploadController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── validation.js
│   │   │   ├── errorHandler.js
│   │   │   └── upload.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Blog.js
│   │   │   └── Category.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── blog.js
│   │   │   ├── upload.js
│   │   │   └── index.js
│   │   ├── utils/
│   │   │   ├── apiResponse.js
│   │   │   ├── apiError.js
│   │   │   ├── jwt.js
│   │   │   └── helpers.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
├── database/
│   └── schema.sql
├── postman/
│   └── Blog-API.postman_collection.json
└── README.md