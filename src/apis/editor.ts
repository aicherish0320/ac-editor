import request from '@/utils/request'

export const works = (data: any) =>
  request({
    method: 'post',
    url: '/works',
    data
  })
export const getWorkById = (data: any) =>
  request({
    method: 'get',
    url: `/works/${data}`
  })
