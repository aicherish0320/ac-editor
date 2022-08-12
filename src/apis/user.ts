import request from '@/utils/request'

export const getCode = (data: any) =>
  request({ method: 'post', url: '/users/genVeriCode', data })

export const login = (data: any) =>
  request({ method: 'post', url: '/users/loginByPhoneNumber', data })
