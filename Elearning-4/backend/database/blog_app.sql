-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 06, 2025 lúc 06:04 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `blog_app`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `blogs`
--

CREATE TABLE `blogs` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `summary` text DEFAULT NULL,
  `content` longtext NOT NULL,
  `featured_image` varchar(255) DEFAULT NULL,
  `author_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT 0,
  `published_at` datetime DEFAULT NULL,
  `view_count` int(11) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `blogs`
--

INSERT INTO `blogs` (`id`, `title`, `slug`, `summary`, `content`, `featured_image`, `author_id`, `category_id`, `is_published`, `published_at`, `view_count`, `created_at`, `updated_at`) VALUES
(1, 'Getting Started with React and Vite', 'getting-started-with-react-and-vite', 'Learn how to set up a modern React application with Vite for fast development and building.', '# Getting Started with React and Vite\n\nIn this comprehensive guide, we\'ll explore how to set up a modern React application using Vite, a next-generation frontend tooling that offers incredibly fast Hot Module Replacement (HMR) and optimized builds.\n\n## Why Vite?\n\nVite provides:\n- Lightning-fast cold server start\n- Instant Hot Module Replacement (HMR)\n- Optimized build output\n- Rich features out of the box\n\n## Installation\n\n```bash\nnpm create vite@latest my-react-app -- --template react\ncd my-react-app\nnpm install\nnpm run dev\n```\n\n## Project Structure\n\nA typical Vite + React project structure looks like this:\n\n```\nsrc/\n  components/\n  pages/\n  hooks/\n  utils/\n  styles/\n  App.jsx\n  main.jsx\n```\n\n## Conclusion\n\nVite revolutionizes the React development experience with its speed and simplicity. Give it a try for your next project!', NULL, 1, 1, 1, '2025-10-06 03:57:57', 150, '2025-10-06 03:57:57', '2025-10-06 03:57:57'),
(2, 'Mastering Tailwind CSS for Modern Web Development', 'mastering-tailwind-css-for-modern-web-development', 'Discover the power of utility-first CSS with Tailwind and build beautiful, responsive interfaces faster than ever.', '# Mastering Tailwind CSS\n\nTailwind CSS is a utility-first CSS framework that enables you to build custom designs without ever leaving your HTML.\n\n## Key Benefits\n\n- **Rapid Development**: Build UIs faster with utility classes\n- **Responsive Design**: Built-in responsive modifiers\n- **Customizable**: Complete control over your design system\n- **Performance**: Purge unused CSS in production\n\n## Getting Started\n\n```bash\nnpm install -D tailwindcss\nnpx tailwindcss init\n```\n\n## Configuration\n\n```javascript\n// tailwind.config.js\nmodule.exports = {\n  content: [\"./src/**/*.{js,jsx,ts,tsx}\"],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n}\n```\n\n## Example Component\n\n```jsx\nfunction Button({ children, variant = \'primary\' }) {\n  const baseClasses = \'px-4 py-2 rounded-lg font-medium transition-colors\';\n  const variants = {\n    primary: \'bg-blue-600 text-white hover:bg-blue-700\',\n    secondary: \'bg-gray-200 text-gray-900 hover:bg-gray-300\'\n  };\n\n  return (\n    <button className={`${baseClasses} ${variants[variant]}`}>\n      {children}\n    </button>\n  );\n}\n```\n\n## Conclusion\n\nTailwind CSS transforms how we write CSS, making it more maintainable and scalable.', NULL, 1, 1, 1, '2025-10-05 03:57:57', 89, '2025-10-06 03:57:57', '2025-10-06 03:57:57');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `blog_tags`
--

CREATE TABLE `blog_tags` (
  `id` int(11) NOT NULL,
  `blog_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `blog_tags`
--

INSERT INTO `blog_tags` (`id`, `blog_id`, `tag_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 3);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Technology', 'technology', 'Articles about technology and programming', '2025-10-06 03:57:57', '2025-10-06 03:57:57'),
(2, 'Lifestyle', 'lifestyle', 'Lifestyle and personal development', '2025-10-06 03:57:57', '2025-10-06 03:57:57'),
(3, 'Travel', 'travel', 'Travel experiences and guides', '2025-10-06 03:57:57', '2025-10-06 03:57:57'),
(4, 'Food', 'food', 'Recipes and food reviews', '2025-10-06 03:57:57', '2025-10-06 03:57:57');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(500) NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_revoked` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('001-create-users.js'),
('002-create-categories.js'),
('003-create-blogs.js'),
('004-create-tags.js'),
('005-create-blog-tags.js'),
('006-create-refresh-tokens.js');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tags`
--

INSERT INTO `tags` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES
(1, 'JavaScript', 'javascript', '2025-10-06 03:57:57', '2025-10-06 03:57:57'),
(2, 'NodeJS', 'nodejs', '2025-10-06 03:57:57', '2025-10-06 03:57:57'),
(3, 'React', 'react', '2025-10-06 03:57:57', '2025-10-06 03:57:57');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `full_name`, `avatar`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@blog.com', '$2b$12$WWgmu5Vfpdp5SEXuYJbwSOVZw9fWDUKCDrTNuECYLGG/vu975R2cy', 'Administrator', NULL, 'admin', 1, '2025-10-06 03:57:57', '2025-10-06 03:57:57'),
(2, 'johndoe', 'john@example.com', '$2b$12$WWgmu5Vfpdp5SEXuYJbwSOVZw9fWDUKCDrTNuECYLGG/vu975R2cy', 'John Doe', NULL, 'user', 1, '2025-10-06 03:57:57', '2025-10-06 03:57:57'),
(3, 'sarahsmith', 'sarah@example.com', '$2b$12$WWgmu5Vfpdp5SEXuYJbwSOVZw9fWDUKCDrTNuECYLGG/vu975R2cy', 'Sarah Smith', NULL, 'user', 1, '2025-10-06 03:57:57', '2025-10-06 03:57:57');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `blogs_author_id` (`author_id`),
  ADD KEY `blogs_category_id` (`category_id`),
  ADD KEY `blogs_slug` (`slug`),
  ADD KEY `blogs_is_published_published_at` (`is_published`,`published_at`);

--
-- Chỉ mục cho bảng `blog_tags`
--
ALTER TABLE `blog_tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `blog_tags_unique` (`blog_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `categories_slug` (`slug`);

--
-- Chỉ mục cho bảng `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `refresh_tokens_token` (`token`),
  ADD KEY `refresh_tokens_user_id` (`user_id`),
  ADD KEY `refresh_tokens_expires_at` (`expires_at`);

--
-- Chỉ mục cho bảng `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Chỉ mục cho bảng `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `tags_slug` (`slug`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `users_email` (`email`),
  ADD KEY `users_username` (`username`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `blog_tags`
--
ALTER TABLE `blog_tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `blogs`
--
ALTER TABLE `blogs`
  ADD CONSTRAINT `blogs_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `blog_tags`
--
ALTER TABLE `blog_tags`
  ADD CONSTRAINT `blog_tags_ibfk_1` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `blog_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
