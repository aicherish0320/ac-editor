import { pick } from 'lodash-es'
import { computed } from 'vue'
import { textStylePropNames } from '../common/defaultProps'

const useComponentCommon = <T extends { [key: string]: any }>(props: T) => {
  const styleProps = computed(() => pick(props, textStylePropNames))
  const handleClick = () => {
    if (props.actionType === 'url' && props.url) {
      window.location.href = props.url
    }
  }

  return {
    styleProps,
    handleClick
  }
}

export default useComponentCommon
