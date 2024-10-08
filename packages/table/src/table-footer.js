import LayoutObserver from './layout-observer';
import {FixedCalc} from './fixed-calc';

import { mapStates } from './store/helper';

export default {
  name: 'ElTableFooter',

  mixins: [LayoutObserver, FixedCalc],

  render(h) {
    let sums = [];
    if (this.summaryMethod) {
      sums = this.summaryMethod({ columns: this.columns, data: this.store.states.data });
    } else {
      this.columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = this.sumText;
          return;
        }
        const values = this.store.states.data.map(item => Number(item[column.property]));
        const precisions = [];
        let notNumber = true;
        values.forEach(value => {
          if (!isNaN(value)) {
            notNumber = false;
            let decimal = ('' + value).split('.')[1];
            precisions.push(decimal ? decimal.length : 0);
          }
        });
        const precision = Math.max.apply(null, precisions);
        if (!notNumber) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toFixed(Math.min(precision, 20)));
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = '';
        }
      });
    }

    return (
      <table
        class="el-table__footer"
        cellspacing="0"
        cellpadding="0"
        border="0">
        <colgroup>
          {
            this.columns.map(column => <col name={column.id} key={column.id} />)
          }
          {
            this.hasGutter ? <col name="gutter" /> : ''
          }
        </colgroup>
        <tbody class={[{ 'has-gutter': this.hasGutter }]}>
          <tr>
            {
              this.columns.map((column, cellIndex) => <td
                key={cellIndex}
                colspan={column.colSpan}
                rowspan={column.rowSpan}
                style={this.getCellStyle(column, cellIndex)}
                class={[...this.getRowClasses(column, cellIndex), 'el-table__cell']}>
                <div class={['cell', column.labelClassName]}>
                  {
                    sums[cellIndex]
                  }
                </div>
              </td>)
            }
            {
              this.hasGutter ? <th class="el-table__cell gutter"></th> : ''
            }
          </tr>
        </tbody>
      </table>
    );
  },

  props: {

    store: {
      required: true
    },
    summaryMethod: Function,
    sumText: String,
    border: Boolean,
    defaultSort: {
      type: Object,
      default() {
        return {
          prop: '',
          order: ''
        };
      }
    }
  },

  computed: {
    table() {
      return this.$parent;
    },

    hasGutter() {
      return this.tableLayout.gutterWidth;
    },

    ...mapStates({
      columns: 'columns',
      isAllSelected: 'isAllSelected',
      leftFixedLeafCount: 'fixedLeafColumnsLength',
      rightFixedLeafCount: 'rightFixedLeafColumnsLength',
      columnsCount: states => states.columns.length,
      leftFixedCount: states => states.fixedColumns.length,
      rightFixedCount: states => states.rightFixedColumns.length
    })
  },

  methods: {

    getFixedColumnCellStyle(column) {

      const leftColumn = this.fixedColumnsCellStyles[column.id];
      if (leftColumn) {
        return {
          left: leftColumn.offset + 'px'
        };
      }
      const rightColumn = this.rightFixedColumnsCellStyles[column.id];
      if (rightColumn) {
        return {
          right: rightColumn.offset + 'px'
        };
      }
      return null;

    },
    getCellStyle(column, cellIndex) {
      return this.getFixedColumnCellStyle(column);
    },

    isColumnFixed(column) {
      return (this.fixedColumnsCellStyles[column.id] || this.rightFixedColumnsCellStyles[column.id]);
    },

    getRowClasses(column, cellIndex) {
      const classes = [column.id, column.align, column.labelClassName];
      if (column.className) {
        classes.push(column.className);
      }

      if (this.isColumnFixed(column)) {
        classes.push('is-fixed-cell');
      }
      if (!column.children) {
        classes.push('is-leaf');
      }
      return classes;
    }
  }
};
