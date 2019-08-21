import Sort from './src'
import DragItem from './src/components/dragItem'

Sort.install = Vue => {
  Vue.components(Sort.name, Sort)
  Vue.components(DragItem.name, DragItem)
}
