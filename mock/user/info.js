// 用户信息相关接口
import { commonSrv } from '../base-api'

const info = {
  "ret_code":0,
  "message":"ok",
  "data":{
      "english_name":"youquanhe",
      "chinese_name":"何有权",
      "avatar":"https://dayu.oa.com/avatars/youquanhe/profile.jpg",
      "staff_id":135049,
      "unit":26243,
      "dept_id":25928
  }
}
const staffList = {
  "ret_code":0,
  "message":"ok",
  "data": [
    {
      data: ["youquanhe", "youquanhe(何有权)"]
    },
    {
      data: ["wickyliao", "wickyliao(廖为基)"]
    },
    {
      data: ["aaaronguo","aaaronguo(郭益诚)"]
    },
    {
      data: ["aaaronliu","aaaronliu(刘亚)"]
    }
  ]
}

export default [
  // get user info
  {
    url: `${commonSrv}/GetUserInfo`,
    type: 'get',
    response: _ => {
      return info
    }
  },
  {
    url: `${commonSrv}/GetStaffList`,
    type: 'get',
    response: _ => {
      return staffList
    }
  }
]