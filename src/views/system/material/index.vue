<template>
  <div class="col-right">
    <div class="omc-table">
      <div class="omc-table-toolbar">
        <div class="col-left">
          <h2 class="table-title">物料配置</h2>
        </div>
        <div class="col-right">
          <ul class="table-actions">
            <li>
              <a href="javascript:;" class="btn-second">
                过滤
                <i class="mdi-set mdi-filter-variant ml-5"></i>
              </a>
            </li>
            <li>
              <a href="javascript:;" class="btn-second">导出</a>
            </li>
            <li>
              <a href="javascript:;" class="btn-primary">新增</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="omc-table-content">
        <table class="table-default">
          <thead>
            <tr>
              <th>类型</th>
              <th>大类</th>
              <th>一级类别</th>
              <th>二级类别（单位）</th>
              <th width="130">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>内容制作</td>
              <td>美术类</td>
              <td>2D</td>
              <td>
                <ul class="opt-list">
                  <li>角色（人日）</li>
                  <li>场景（人日）</li>
                  <li>UI（人日）</li>
                </ul>
              </td>
              <td>
                <ul class="omc-inline-actions">
                  <li>
                    <a href="#" class="btn-second">编辑</a>
                  </li>
                  <li>
                    <a href="#" class="btn-icon">
                      <i class="mdi-set mdi-trash-can-outline"></i>
                      <span>删除</span>
                    </a>
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>内容制作</td>
              <td>美术类</td>
              <td>动特</td>
              <td>
                <ul class="opt-list">
                  <li>2D动画（人日）</li>
                  <li>3D动画（人日）</li>
                  <li>动作捕捉（件）</li>
                  <li>特效（人日）</li>
                </ul>
              </td>
              <td>
                <ul class="omc-inline-actions">
                  <li>
                    <a href="#" class="btn-second">编辑</a>
                  </li>
                  <li>
                    <a href="#" class="btn-icon">
                      <i class="mdi-set mdi-trash-can-outline"></i>
                      <span>删除</span>
                    </a>
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>内容制作</td>
              <td>文案类</td>
              <td>文字策划</td>
              <td>
                <ul class="opt-list">
                  <li>文本故事（个）</li>
                  <li>文案台词（个）</li>
                  <li>动画编剧（限动漫业务部）（个）</li>
                  <li>影视文案（个）</li>
                </ul>
              </td>
              <td>
                <ul class="omc-inline-actions">
                  <li>
                    <a href="#" class="btn-second">编辑</a>
                  </li>
                  <li>
                    <a href="#" class="btn-icon">
                      <i class="mdi-set mdi-trash-can-outline"></i>
                      <span>删除</span>
                    </a>
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>研发费</td>
              <td>研发费-项目外包</td>
              <td>外包开发测试</td>
              <td>
                <ul class="opt-list">
                  <li>初级开发-L1（人/天）</li>
                  <li>初级开发-L2（人/天）</li>
                  <li>初级开发-L3（人/天）</li>
                  <li>中级开发-L1（人/天）</li>
                  <li>中级开发-L2（人/天）</li>
                  <li>中级开发-L3（人/天）</li>
                  <li>项目经理-L1（人/天）</li>
                  <li>项目经理-L2（人/天）</li>
                  <li>项目经理-L3（人/天）</li>
                </ul>
              </td>
              <td>
                <ul class="omc-inline-actions">
                  <li>
                    <a href="#" class="btn-second">编辑</a>
                  </li>
                  <li>
                    <a href="#" class="btn-icon">
                      <i class="mdi-set mdi-trash-can-outline"></i>
                      <span>删除</span>
                    </a>
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>研发费</td>
              <td>研发费-其他</td>
              <td>翻译费</td>
              <td>
                <ul class="opt-list">
                  <li>简体中文->英文（元/字）</li>
                  <li>简体中文->繁体（元/字）</li>
                  <li>简体中文->日语（元/字）</li>
                  <li>简体中文->韩语（元/字）</li>
                </ul>
              </td>
              <td>
                <ul class="omc-inline-actions">
                  <li>
                    <a href="#" class="btn-second">编辑</a>
                  </li>
                  <li>
                    <a href="#" class="btn-icon">
                      <i class="mdi-set mdi-trash-can-outline"></i>
                      <span>删除</span>
                    </a>
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>研发费</td>
              <td>研发费-其他</td>
              <td>劳务合作</td>
              <td>
                <ul class="opt-list">
                  <li>博士（人/天）</li>
                  <li>硕士（人/天）</li>
                  <li>本科（人/天）</li>
                </ul>
              </td>
              <td>
                <ul class="omc-inline-actions">
                  <li>
                    <a href="#" class="btn-second">编辑</a>
                  </li>
                  <li>
                    <a href="#" class="btn-icon">
                      <i class="mdi-set mdi-trash-can-outline"></i>
                      <span>删除</span>
                    </a>
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>研发费</td>
              <td>研发费-项目外包</td>
              <td>视觉设计</td>
              <td>
                <ul class="opt-list">
                  <li>PC-普通专题-首页设计（人/天）</li>
                  <li>PC-普通专题-内页设计（人/天）</li>
                  <li>PC-普通专题-首页重构（人/天）</li>
                  <li>PC-普通专题-页面重构（人/天）</li>
                  <li>PC-官网-首页重构（人/天）</li>
                  <li>PC-官网-引导页重构（人/天）</li>
                  <li>PC-官网-静态创意（人/天）</li>
                </ul>
              </td>
              <td>
                <ul class="omc-inline-actions">
                  <li>
                    <a href="#" class="btn-second">编辑</a>
                  </li>
                  <li>
                    <a href="#" class="btn-icon">
                      <i class="mdi-set mdi-trash-can-outline"></i>
                      <span>删除</span>
                    </a>
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>内容制作</td>
              <td>美术类</td>
              <td>2D</td>
              <td>
                <ul class="opt-list">
                  <li>角色（人日）</li>
                  <li>场景（人日）</li>
                  <li>UI（人日）</li>
                </ul>
              </td>
              <td>
                <ul class="omc-inline-actions">
                  <li>
                    <a href="#" class="btn-second">编辑</a>
                  </li>
                  <li>
                    <a href="#" class="btn-icon">
                      <i class="mdi-set mdi-trash-can-outline"></i>
                      <span>删除</span>
                    </a>
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>内容制作</td>
              <td>美术类</td>
              <td>动特</td>
              <td>
                <ul class="opt-list">
                  <li>2D动画（人日）</li>
                  <li>3D动画（人日）</li>
                  <li>动作捕捉（件）</li>
                  <li>特效（人日）</li>
                </ul>
              </td>
              <td>
                <ul class="omc-inline-actions">
                  <li>
                    <a href="#" class="btn-second">编辑</a>
                  </li>
                  <li>
                    <a href="#" class="btn-icon">
                      <i class="mdi-set mdi-trash-can-outline"></i>
                      <span>删除</span>
                    </a>
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>内容制作</td>
              <td>文案类</td>
              <td>文字策划</td>
              <td>
                <ul class="opt-list">
                  <li>文本故事（个）</li>
                  <li>文案台词（个）</li>
                  <li>动画编剧（限动漫业务部）（个）</li>
                  <li>影视文案（个）</li>
                </ul>
              </td>
              <td>
                <ul class="omc-inline-actions">
                  <li>
                    <a href="#" class="btn-second">编辑</a>
                  </li>
                  <li>
                    <a href="#" class="btn-icon">
                      <i class="mdi-set mdi-trash-can-outline"></i>
                      <span>删除</span>
                    </a>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="omc-table-pagination">
          <ul class="pagination-default">
            <li>
              <a href="#">上一页</a>
            </li>
            <li>
              <a href="#">1</a>
            </li>
            <li>
              <a href="#">2</a>
            </li>
            <li>
              <a href="#" class="active">3</a>
            </li>
            <li>
              <a href="#">4</a>
            </li>
            <li>
              <a href="#">5</a>
            </li>
            <li>
              <a href="#">...</a>
            </li>
            <li>
              <a href="#">10</a>
            </li>
            <li>
              <a href="#">下一页</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MaterialSetting'
}
</script>
<style lang="less" scoped>
</style>
