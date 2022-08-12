import html2canvas from 'html2canvas'
import request from './utils/request'

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

export const insertAt = (arr: any[], index: number, newItem: any) => {
  return [...arr.slice(0, index), newItem, ...arr.slice(index)]
}

function getCanvasBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    })
  })
}

export async function takeScreenshotAndUpload(ele: HTMLElement) {
  const canvas = await html2canvas(ele, { width: 375, useCORS: true, scale: 1 })
  const canvasBlob = await getCanvasBlob(canvas)
  if (canvasBlob) {
    const data = await uploadFile(canvasBlob)
    return data
  }
}

async function uploadFile(
  file: Blob,
  url = '/utils/upload-img',
  fileName = 'screenshot.png'
) {
  const newFile = file instanceof File ? file : new File([file], fileName)
  const formData = new FormData()
  formData.append(newFile.name, newFile)
  const { data } = await request.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}
