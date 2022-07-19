import { Module } from 'vuex'
import { GlobalDataProps } from '..'

export interface TemplateProps {
  id?: number
  title?: string
  coverImg?: string
  author?: string
}

const templateLists: TemplateProps[] = [
  {
    author: '136****5632',
    coverImg:
      'https://static.imooc-lego.com/upload-files/screenshot-889755.png',
    id: 18,
    title: '前端架构师直播海报'
  },
  {
    author: '136****5632',
    coverImg:
      'https://static.imooc-lego.com/upload-files/screenshot-889755.png',
    id: 181,
    title: '前端架构师直播海报'
  },
  {
    author: '136****5632',
    coverImg:
      'https://static.imooc-lego.com/upload-files/screenshot-889755.png',
    id: 182,
    title: '前端架构师直播海报'
  },
  {
    author: '136****5632',
    coverImg:
      'https://static.imooc-lego.com/upload-files/screenshot-889755.png',
    id: 138,
    title: '前端架构师直播海报'
  },
  {
    author: '136****5632',
    coverImg:
      'https://static.imooc-lego.com/upload-files/screenshot-889755.png',
    id: 148,
    title: '前端架构师直播海报'
  },
  {
    author: '136****5632',
    coverImg:
      'https://static.imooc-lego.com/upload-files/screenshot-889755.png',
    id: 158,
    title: '前端架构师直播海报'
  }
]

export interface TemplatesProps {
  data: TemplateProps[]
}

const templates: Module<TemplatesProps, GlobalDataProps> = {
  state: {
    data: templateLists
  },
  getters: {
    getTemplateById: (state) => (id: number) => {
      return state.data.find((item) => item.id === id)
    }
  }
}

export default templates
