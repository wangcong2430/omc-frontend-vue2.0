// 预算相关接口
import { commonSrv } from '../base-api'

const projectCode = {
  "ret_code":0,
  "message":"ok",
  "data":[
      {
          "product_code":"wzry",
          "product_name":"王者荣耀",
          "product_manager":"guiwuliu",
          "product_members":"wickyliao;terryshchen"
      },
      {
          "product_code":"lol",
          "product_name":"英雄联盟",
          "product_manager":"wickyliao",
          "product_members":"catccliu;yuningwei"
      },
      {
          "product_code":"ttkp",
          "product_name":"天天酷跑",
          "product_manager":"catccliu",
          "product_members":"jackietao;terryshchen"
      },
      {
          "product_code":"pubm",
          "product_name":"和平精英",
          "product_manager":"jackietao",
          "product_members":"lamick;terryshchen"
      },
      {
          "product_code":"cf",
          "product_name":"穿越火线",
          "product_manager":"lamick",
          "product_members":"sndzhao;terryshchen"
      },
      {
          "product_code":"nz",
          "product_name":"逆战",
          "product_manager":"sndzhao",
          "product_members":"xingzhiyang;terryshchen"
      },
      {
          "product_code":"codm",
          "product_name":"使命召唤移动版",
          "product_manager":"xingzhiyang",
          "product_members":"xavierma;yuningwei"
      },
      {
          "product_code":"cod",
          "product_name":"使命召唤",
          "product_manager":"xavierma",
          "product_members":"hhu;terryshchen"
      },
      {
          "product_code":"codmus",
          "product_name":"使命召唤西方版",
          "product_manager":"hhu",
          "product_members":"yuningwei;terryshchen"
      },
      {
          "product_code":"bwlb",
          "product_name":"保卫萝卜",
          "product_manager":"yuningwei",
          "product_members":"youquanhe;terryshchen"
      },
      {
          "product_code":"cr",
          "product_name":"部落冲突",
          "product_manager":"youquanhe",
          "product_members":"terryshchen;yuningwei"
      },
      {
          "product_code":"ddz",
          "product_name":"欢乐斗地主",
          "product_manager":"terryshchen",
          "product_members":"windyqiu;terryshchen"
      },
      {
          "product_code":"ddzzq",
          "product_name":"多多自走棋",
          "product_manager":"windyqiu",
          "product_members":"bennychen;terryshchen"
      },
      {
          "product_code":"dzz",
          "product_name":"王者荣耀",
          "product_manager":"bennychen",
          "product_members":"stanhrxu;terryshchen"
      },
      {
          "product_code":"fifa",
          "product_name":"王者荣耀",
          "product_manager":"stanhrxu",
          "product_members":"binghuiluo;terryshchen"
      },
      {
          "product_code":"hjdt",
          "product_name":"合金弹头",
          "product_manager":"binghuiluo",
          "product_members":"shamcleren;terryshchen"
      },
      {
          "product_code":"jzds",
          "product_name":"节奏大师",
          "product_manager":"shamcleren",
          "product_members":"guiwuliu;terryshchen"
      }
  ]
}
const orgInfo = {
    "ret_code":0,
    "message":"ok",
    "data":{
        "id":26215,
        "name":"效能协同中心",
        "exchange_group_name":" ",
        "enabled":1,
        "leader_id":0,
        "level":3,
        "vice_president_id":0,
        "parent_id":25928,
        "parent_name":"",
        "secretary_id":0,
        "type_id":7,
        "type_name":"60 中心",
        "org_path":"\\IEG互动娱乐事业群\\研发效能部\\效能协同中心",
        "dept_code":"",
        "unit_principal":5290,
        "is_group":0
    }
}

export default [
  {
    url: `${commonSrv}/GetProductList`,
    type: 'get',
    response: _ => {
      return projectCode
    }
  },
  {
    url: `${commonSrv}/GetOrgInfo`,
    type: 'get',
    response: _ => {
        return orgInfo
    }
  }
]