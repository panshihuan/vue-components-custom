<template>
  <ul class="m-pagination">
    <li
      class="m-pagination__tag"
      @click="selectPage(value - 1)"
    > < </li>
    <li
      class="m-pagination__item"
      :class="{ 'm-pagination--active': page.active }"
      v-for="page of pages"
      :key="page.num"
      @click="selectPage(page.number)"
    >{{page.text}}</li>
    <li
      class="m-pagination__tag"
      @click="selectPage(value + 1)"
    > > </li>
  </ul>
</template>

<script>
  import './index.scss'

  export default {
    props: {
      value: {
        type: Number,
        default: 1
      }, // 当前页
      pageCount: Number, // 总页数
      total: { // 总条数
        type: Number,
        default: 0
      },
      pageItemCount: {  // 每页显示条数
        type: Number,
        default: 10
      },
      showPageSize: {  // 最多显示的页码数
        type: Number,
        default: 3
      },
    },
    computed: {
      computedPageCount() { // 计算总页数
        const count = this.pageCount || Math.ceil(this.total / this.pageItemCount)
        return Math.max(1, count)
      },
      pages() {
        const pages = []
        const pageCount = this.computedPageCount;
        let startPage = 1;
        let endPage = pageCount;

        const isMaxSized = this.showPageSize && this.showPageSize < pageCount;

        if (isMaxSized) {
          startPage = Math.max(this.value - Math.floor(this.showPageSize / 2), 1);
          endPage = startPage + this.showPageSize - 1;

          if (endPage > pageCount) {
            endPage = pageCount;
            startPage = endPage - this.showPageSize + 1;
          }
        }

        // 组装数组
        for (let number = startPage; number <= endPage; number++) {
          const page = this.makePage(number, number, number === this.value);
          pages.push(page);
        }

        if (isMaxSized && this.showPageSize > 0) {
          if (startPage > 1) {
            const previousPageSet = this.makePage(startPage - 1, '...', false);
            pages.unshift(previousPageSet);
          }

          if (endPage < pageCount) {
            const nextPageSet = this.makePage(endPage + 1, '...', false);
            pages.push(nextPageSet);
          }
        }

        return pages
      }
    },
    methods: {
      makePage(number, text, active) {
        return { number, text, active }
      },
      selectPage(page) {
        page = Math.max(1, page);
        page = Math.min(this.computedPageCount, page);
        console.log(3333, this.value)
        if (this.value !== page) {
          this.$emit('input', page);
          this.$emit('change', page);
        }
        console.log(4444, page)
      },
    }
  }
</script>
