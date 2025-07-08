import jwt from 'jsonwebtoken'

const generateToken = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 86400000, // 1 day
  })
  return token
}

const verifyToken = token => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded
  } catch (error) {
    return null
  }
}

export { generateToken, verifyToken }
