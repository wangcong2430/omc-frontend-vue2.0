import { toNumber } from 'lodash/lang'
import { groupBy } from 'lodash/collection'

export default {
  data() {
    return {
      isBaseOptions: [
        { label: '基地需求', value: 1 },
        { label: '非基地需求', value: 2 },
        { label: '代理画师', value: 3 },
        { label: '整包需求', value: 4 }
      ]
    }
  },
  methods: {
    sumAmount(form) {
      if (Array.isArray(form) && form.length > 0) {
        return form.reduce((accumulator, currentValue) => {
          return accumulator + toNumber(currentValue.workload_amount)
        }, 0)
      } else {
        return 0
      }
    },
    groupByDetailType(form) {
      const groups = groupBy(form, 'type')
      const result = []
      for (const key in groups) {
        result.push({
          type: key,
          typeName: groups[key][0].type_name,
          amount: this.sumAmount(groups[key]),
          quantity: groups[key].length
        })
      }
      return result
    }
  }
}
