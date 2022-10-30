<template>
  <div v-if="isShowPop" class="version-container">
    <div class="version-pop">
      <div class="version-txt">
        <h3>2022设计制作品类海外供应商年度招募推荐公告</h3>
        <p>
          各位项目组同学们：
        </p>
        <p>
          IEG服务采购部2022年设计制作品类海外统一招募现已面向全球正式启动，此次海外供应商招募计划在7月4日23:59截止推荐，欢迎同学们推荐优质海外供应商资源。
        </p>
        <p class="red describe">*请注意！本次招募面向海外供应商，不包括在中国大陆注册的公司。详细招募海报请点击附件下载。 <a href="http://cos.ap-guangzhou.myqcloud.com/iomc-1258344700/public/46a605b54f66e115e61c592ad691eb8b/Tencent%20Video%20and%20Website%20Supplier%20Recruitment%20Invitation.jpg" download="http://cos.ap-guangzhou.myqcloud.com/iomc-1258344700/public/46a605b54f66e115e61c592ad691eb8b/Tencent%20Video%20and%20Website%20Supplier%20Recruitment%20Invitation.jpg" class="download">附件</a></p>
        <p class="describe">海外设计制作品类招募类别如下：</p>
        <table>
          <thead class="iomc-table-thead">
            <tr>
              <th class="type">招募品类</th>
              <th>品类描述</th>
            </tr>
          </thead>
          <tbody class="iomc-tables-tbody">
            <tr>
              <td>2D动画类</td>
              <td class="anima">
                <p>2D动画</p>
                <p>> 提供2D动画类视频服务，包含不限于2D绘制、剪辑、特效、音乐等动画制作。</p>
                <p>> 交付物如逐帧动画、spine动画、MG动画等。</p>
              </td>
            </tr>
            <tr>
              <td>3D动画类</td>
              <td class="anima">
                <p>高品质引擎动画（用于品牌宣传）</p>
                <p>> 提供不同类型的引擎动画类视频服务，包含不限于模型资产处理、引擎游戏资产优化、绑定动画制作、动态捕捉和镜头跟踪、剪辑、动画场景合成等。</p>
                <p>> 交付物如用于品牌推广的UE4/UE5/Unity/Maya等高品质引擎动画，不含CG/CGI动画。</p>
                <hr />
                <p>引擎流量动画（用于流量广告）</p>
                <p>> 提供不同类型的引擎动画类视频服务，包含不限于模型资产处理、引擎游戏资产优化、绑定动画制作、动态捕捉和镜头跟踪、剪辑、动画场景合成等。</p>
                <p>> 交付物如用于流量广告投放的UE4/UE5/Unity/Maya等引擎流量动画，不含CG/CGI动画。</p>
              </td>
            </tr>
            <tr>
              <td>实拍类</td>
              <td class="anima">
                <p>实拍TVC视频（用于品牌宣传）</p>
                <p>> 提供实拍类视频服务，包含不限于脚本制作、置景、实拍、包装、剪辑等；需要在海外本地拥有实拍资源，制作符合当地文化背景与游戏用户喜好的本地化实拍视频。</p>
                <p>> 交付物如TVC广告片，品牌宣传片，MV视频等。</p>
                <hr />
                <p>实拍流量广告（用于流量广告）</p>
                <p>提供实拍类视频服务，包含不限于脚本制作、置景、实拍、包装、剪辑等；需要在海外本地拥有实拍资源，制作符合当地文化背景与游戏用户喜好的本地化实拍视频。</p>
                <p>交付物如用于流量广告投放的真人实拍买量视频</p>
              </td>
            </tr>
            <tr>
              <td>后期包装类</td>
              <td class="anima">
                <p>后期包装</p>
                <p>> 提供后期包装类视频服务，包含不限于脚本制作、剪辑、包装、特效、剪辑、配音等。</p>
              </td>
            </tr>
            <tr>
              <td>网媒</td>
              <td class="anima">
                <p>网媒</p>
                <p>提供网媒服务需求，包含不限于网站设计/交互设计/用户体验/ HTML5设计</p>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="describe">报名方式有以下两种：</p>
        <p class="describe">1、 海外供应商直接通过外部渠道填写信息报名：<a target="_bank" href="https://wj.qq.com/s2/10368342/dbe7/">https://wj.qq.com/s2/10368342/dbe7/</a></p>
        <p class="describe">2、 业务方推荐渠道：如有推荐的供应商，可联系采购商务经理jianyixie（谢健仪）进行推荐，企业微信二维码如下所示</p>
        <section><img :src="explainImg"></section>
        <p class="describe">如有任何疑问，请联系采购商务经理jianyixie（谢健仪）</p>
        <a-button class="close-btn" @click="closePop">已知悉，关闭</a-button>
      </div>
    </div>
  </div>

</template>
<script>

export default {
  name: 'Version',
  data() {
    return {
      explainImg: require('@/assets/images/wechat.png'),
      isShowPop: true
    }
  },
  methods: {
    closePop() {
      this.isShowPop = !this.isShowPop
    }
  }
}
</script>
<style lang="less" scoped>
   .version-container{
    position:fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 666;
    left: 0px;
    top: 0px;
     .version-pop{
         background-color: #fff;
         width: 860px;
         margin: 0 auto;
         padding: 20px 20px 160px 20px;
         border-radius: 10px;
         margin-top: 40px;
         height: 860px;
         overflow:auto;
         h3{
             text-align: center;
             font-weight: 600;
             font-size: 20px;
         }
         p{
            line-height:22px;
            font-size: 14px;
            text-indent: 2em;
            margin-bottom: 10px;
            span{
                font-weight: 600;
            }
         }
         table{
           border: 1px solid #666;
           .iomc-table-thead{
              th{
                border-bottom:1px solid #666 ;
                border-right:1px solid #666 ;
              }
           }
           .iomc-tables-tbody{
             td{
               padding-left: 16px;
               border-right:1px solid #666 ;
               border-bottom:1px solid #666 ;
               p{text-indent: 0em;padding-left: 16px;}
             }
             .anima{
               padding-left: 0px;
             }
           }
           .type{
             width: 100px;
           }
         }
         .describe{
           text-indent:0em
         }
         section{
            margin-bottom: 10px;
            img{
              width:176px;
            }
            span{
              color:red;
            }
         }
         h5{
             font-weight: 600;
             font-size: 14px;
         }
         .close-btn{
            background-color: #6b5aed;
            color: #fff;
            margin-top: 16px;
            width: 160px;
         }
     }
  }
  .red{
    color: red;
  }

</style>
