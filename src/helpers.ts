export const getImageDimensions = (url: string | File) => {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image()
    img.src = typeof url === 'string' ? url : URL.createObjectURL(url)
    img.addEventListener('load', () => {
      const { naturalWidth: width, naturalHeight: height } = img
      resolve({ width, height })
    })
    img.addEventListener('error', () => {
      reject(new Error('error'))
    })
  })
}

export const getParentElement = (
  element: HTMLElement | null,
  className: string
) => {
  while (element) {
    if (element.classList.contains(className)) {
      return element
    } else {
      element = element.parentNode as HTMLElement
    }
  }

  return null
}
