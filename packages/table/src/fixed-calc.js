import { getFixedColumnsCellStyle } from './util';
import { mapStates } from './store/helper';

export const FixedCalc = {

  computed: {

    iTableLayout() {
      const layout = this.tableLayout;
      if (!layout) {
        throw new Error('Can not find table layout.');
      }
      return layout;
    },

    ...mapStates({
      fixedColumns: 'fixedColumns',
      rightFixedColumns: 'rightFixedColumns'
    }),

    rightFixedPatchWidth() {
      if (this.rightFixedColumns.length === 0) {
        return 0;
      }
      return this.iTableLayout.scrollY ? this.iTableLayout.gutterWidth : 0;
    },

    fixedColumnsCellStyles() {
      return getFixedColumnsCellStyle(this.fixedColumns || []);
    },

    rightFixedColumnsCellStyles() {
      return getFixedColumnsCellStyle(this.rightFixedColumns || [], {
        reverse: true,
        offset: this.rightFixedPatchWidth
      });
    },

    bodyRightFixedColumnsCellStyles() {
      return getFixedColumnsCellStyle(this.rightFixedColumns || [], {
        reverse: true
      });

    }

  }
};
