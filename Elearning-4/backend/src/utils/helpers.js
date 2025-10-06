import bcrypt from 'bcryptjs';

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const validatePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const paginate = (page, limit, total) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const offset = (pageNum - 1) * limitNum;
  const totalPages = Math.ceil(total / limitNum);

  return {
    page: pageNum,
    limit: limitNum,
    offset,
    totalPages,
    hasNext: pageNum < totalPages,
    hasPrev: pageNum > 1
  };
};

export const sanitizeUser = (user) => {
  const userObj = user.toJSON ? user.toJSON() : user;
  const { password, ...sanitizedUser } = userObj;
  return sanitizedUser;
};