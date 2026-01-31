export const getPriceQueryParams = (searchParams, key, value) => {
  // 🔥 REMOVE OLD PARAMS COMPLETELY
  searchParams.delete('min')
  searchParams.delete('max')

  if (value && Number(value) > 0) {
    if (key === 'min') {
      searchParams.set('price[gte]', value)
    }

    if (key === 'max') {
      searchParams.set('price[lte]', value)
    }
  } else {
    if (key === 'min') searchParams.delete('price[gte]')
    if (key === 'max') searchParams.delete('price[lte]')
  }

  return searchParams
}
