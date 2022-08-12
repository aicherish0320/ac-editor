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

export const saveWork = (data: any) =>
  request({
    method: 'patch',
    url: `/works/${data.id}`,
    data: data.data
  })

export const publishWork = (data: any) =>
  request({
    method: 'post',
    url: `/works/publish/${data}`
  })

export const getChannel = (data: any) =>
  request({
    method: 'get',
    url: `/channel/getWorkChannels/${data}`
  })

export const channel = (data: any) =>
  request({
    method: 'post',
    url: '/channel',
    data
  })

export const delChannel = (data: any) =>
  request({
    method: 'delete',
    url: `/channel/${data}`
  })

export const fetchChannels = (data: any) =>
  request({
    method: 'get',
    url: `/channel/getWorkChannels/${data}`
  })

export const createChannel = (data: any) =>
  request({
    method: 'post',
    url: '/channel',
    data
  })
