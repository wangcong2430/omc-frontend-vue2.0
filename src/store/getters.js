const getters = {
  perms: state => state.user.perms,
  sidebar: state => state.app.sidebar,
  routes: state => state.permission.routes,
  productCodesOpt: state => state.budget.productCodesOpt,
  productNames: state => state.budget.productNames,
  coscenterLists: state => state.budget.coscenterLists,
  relateProject: state => state.budget.relateProject,
  contentForms: state => state.content.contentForms,
  categoryOpt: state => state.content.categoryOpt,
  researchForms: state => state.research.researchForms,
  materialOpt: state => state.research.materialOpt,
  materialData: state => state.research.materialData,
  outsourceTable: state => state.outsource.outsourceTable,
  researchIncreaseForms: state => state.researchIncrease.researchIncreaseForms,
  contentIncreaseForms: state => state.contentIncrease.contentIncreaseForms,
  detailForms: state => state.demand.detailForms,
  entrySetting: state => state.omc.entrySetting
}

export default getters
