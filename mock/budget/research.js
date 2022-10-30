// 研发费用填报接口

// 成本中心
const coscenter = {
  "ret_code": 0,
  "message": "ok",
  "data": [
    {
      "dept_id": 25928,
      "coscenter_code": "56506",
      "coscenter_name": "研发效能部-业务支持中心"
    },
    {
      "dept_id": 25928,
      "coscenter_code": "56505",
      "coscenter_name": "研发效能部-前沿技术中心"
    },
    {
      "dept_id": 25928,
      "coscenter_code": "56504",
      "coscenter_name": "研发效能部-效能协同中心"
    },
    {
      "dept_id": 25928,
      "coscenter_code": "56503",
      "coscenter_name": "研发效能部-游戏AI研究中心"
    },
    {
      "dept_id": 25928,
      "coscenter_code": "56502",
      "coscenter_name": "研发效能部-GCloud技术服务中心"
    },
    {
      "dept_id": 25928,
      "coscenter_code": "56501",
      "coscenter_name": "研发效能部-GCloud技术研发中心"
    },
    {
      "dept_id": 25928,
      "coscenter_code": "0380H",
      "coscenter_name": "互动娱乐研发部-Tcaplus数据中心"
    },
    {
      "dept_id": 25928,
      "coscenter_code": "0380G",
      "coscenter_name": "互动娱乐研发部-前沿技术中心"
    },
    {
      "dept_id": 25928,
      "coscenter_code": "0380F",
      "coscenter_name": "互动娱乐研发部-专项测试技术中心"
    },
    {
      "dept_id": 25928,
      "coscenter_code": "0380E",
      "coscenter_name": "互动娱乐研发部-Apollo产品中心"
    },
    {
      "dept_id": 25928,
      "coscenter_code": "0380C",
      "coscenter_name": "互动娱乐研发部-GCloud基础服务中心"
    },
    {
      "dept_id": 25928,
      "coscenter_code": "0380B",
      "coscenter_name": "互动娱乐研发部-众质技术中心"
    },
    {
      "dept_id": 25928,
      "coscenter_code": "0380A",
      "coscenter_name": "互动娱乐研发部-公共技术研发中心"
    },
    {
      "dept_id": 25928,
      "coscenter_code": "03809",
      "coscenter_name": "互动娱乐研发部-游戏音频组"
    },
    {
      "dept_id": 25928,
      "coscenter_code": "03808",
      "coscenter_name": "互动娱乐研发部-游戏研究组"
    },
    {
      "dept_id": 25928,
      "coscenter_code": "03807",
      "coscenter_name": "互动娱乐研发部-引擎技术中心"
    },
    {
      "dept_id": 25928,
      "coscenter_code": "03805",
      "coscenter_name": "互动娱乐研发部-研发能力中心"
    },
    {
      "dept_id": 25928,
      "coscenter_code": "03803",
      "coscenter_name": "互动娱乐研发部-美术设计中心"
    },
    {
      "dept_id": 25928,
      "coscenter_code": "03802",
      "coscenter_name": "互动娱乐研发部-管理支持中心"
    },
    {
      "dept_id": 25928,
      "coscenter_code": "03801",
      "coscenter_name": "互动娱乐研发部-互动娱乐研发中心"
    },
    {
      "dept_id": 25928,
      "coscenter_code": "03800",
      "coscenter_name": "研发效能部-公共"
    }
  ]
}
// 物料
const materialCategory = {
  "ret_code":0,
  "message":"ok",
  "data":[
      {
          "id":6,
          "cate_name":"研发费-高校合作",
          "enabled":1,
          "parent_id":0,
          "unit":"",
          "sort":1,
          "child":[
              {
                  "id":57,
                  "cate_name":"高校合作",
                  "enabled":1,
                  "parent_id":6,
                  "unit":"",
                  "sort":1,
                  "child":[
                      {
                          "id":165,
                          "cate_name":"高校合作",
                          "enabled":1,
                          "parent_id":57,
                          "unit":"",
                          "sort":1,
                          "child":null
                      }
                  ]
              }
          ]
      },
      {
          "id":3,
          "cate_name":"研发费-外包开发",
          "enabled":1,
          "parent_id":0,
          "unit":"",
          "sort":1,
          "child":[
              {
                  "id":20,
                  "cate_name":"外包开发",
                  "enabled":1,
                  "parent_id":3,
                  "unit":"",
                  "sort":1,
                  "child":null
              }
          ]
      },
      {
          "id":2,
          "cate_name":"研发费-项目外包",
          "enabled":1,
          "parent_id":0,
          "unit":"",
          "sort":1,
          "child":[
              {
                  "id":10,
                  "cate_name":"外包开发测试",
                  "enabled":1,
                  "parent_id":2,
                  "unit":"",
                  "sort":1,
                  "child":[
                      {
                          "id":71,
                          "cate_name":"初级开发-L1",
                          "enabled":1,
                          "parent_id":10,
                          "unit":"人/天",
                          "sort":1,
                          "child":null
                      },
                      {
                          "id":72,
                          "cate_name":"初级开发-L2",
                          "enabled":1,
                          "parent_id":10,
                          "unit":"人/天",
                          "sort":1,
                          "child":null
                      },
                      {
                          "id":73,
                          "cate_name":"初级开发-L3",
                          "enabled":1,
                          "parent_id":10,
                          "unit":"人/天",
                          "sort":1,
                          "child":null
                      }
                  ]
              },
              {
                  "id":11,
                  "cate_name":"视觉设计",
                  "enabled":1,
                  "parent_id":2,
                  "unit":"",
                  "sort":1,
                  "child":[
                      {
                          "id":92,
                          "cate_name":"PC-普通专题-首页设计",
                          "enabled":1,
                          "parent_id":11,
                          "unit":"人/天",
                          "sort":1,
                          "child":null
                      },
                      {
                          "id":93,
                          "cate_name":"PC-普通专题-内页设计",
                          "enabled":1,
                          "parent_id":11,
                          "unit":"人/天",
                          "sort":1,
                          "child":null
                      },
                      {
                          "id":94,
                          "cate_name":"PC-普通专题-首页重构",
                          "enabled":1,
                          "parent_id":11,
                          "unit":"人/天",
                          "sort":1,
                          "child":null
                      }
                  ]
              },
              {
                  "id":12,
                  "cate_name":"机构科研项目",
                  "enabled":1,
                  "parent_id":2,
                  "unit":"",
                  "sort":1,
                  "child":[
                      {
                          "id":119,
                          "cate_name":"机构科研项目",
                          "enabled":1,
                          "parent_id":12,
                          "unit":"",
                          "sort":1,
                          "child":null
                      }
                  ]
              },
              {
                  "id":13,
                  "cate_name":"研发测试",
                  "enabled":1,
                  "parent_id":2,
                  "unit":"",
                  "sort":1,
                  "child":null
              },
              {
                  "id":14,
                  "cate_name":"其他",
                  "enabled":1,
                  "parent_id":2,
                  "unit":"",
                  "sort":1,
                  "child":null
              },
              {
                  "id":15,
                  "cate_name":"外包开发",
                  "enabled":1,
                  "parent_id":2,
                  "unit":"",
                  "sort":1,
                  "child":null
              },
              {
                  "id":17,
                  "cate_name":"高校合作",
                  "enabled":1,
                  "parent_id":2,
                  "unit":"",
                  "sort":1,
                  "child":null
              },
              {
                  "id":18,
                  "cate_name":"外包开发测试",
                  "enabled":1,
                  "parent_id":2,
                  "unit":"",
                  "sort":1,
                  "child":[
                      {
                          "id":120,
                          "cate_name":"外包开发或测试-其他",
                          "enabled":1,
                          "parent_id":18,
                          "unit":"",
                          "sort":1,
                          "child":null
                      }
                  ]
              }
          ]
      }
  ]
}

export default [
  {
    url: '/coscenter/list',
    type: 'get',
    response: _ => {
      return coscenter
    }
  },
  {
    url: '/material/category',
    type: 'get',
    response: _ => {
      return coscenter
    }
  }
]
