export const transformRating = reviews => {
  if (!reviews || reviews.length === 0) return 1

  const rating =
    reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
  const clamped = Math.min(Math.max(rating, 0.5), 5)
  const rounded = Math.round(clamped * 2) / 2
  return rounded
}
