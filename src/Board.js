// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      let counter = 0;
      let row = this.rows()[rowIndex];

      for (let i = 0; i < row.length; i++) {
        if (row[i] === 1) {
          counter++;
        } else if (counter === 2) {
          break;
        }
      }

      return Boolean(counter === 2);
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var hasConflict = false;

      this.rows().forEach((row, index) => {
        if (this.hasRowConflictAt(index)) {
          hasConflict = true;
        }
      });

      return hasConflict;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      let counter = 0;
      let matrix = this.rows();

      for (let i = 0; i < matrix.length; i++) {
        let columnValue = matrix[i][colIndex];

        if (columnValue === 1) {
          counter++;
        }

        if (counter === 2) {
          break;
        }
      }

      return Boolean(counter === 2);
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      let n = this.rows().length;

      for (let i = 0; i < n; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }

      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      let populatedNumTimes = 0;
      let matrix = this.rows();

      // (matrix.length - etc...)
      for (let i = 0; i < (matrix.length - majorDiagonalColumnIndexAtFirstRow); i++) {
        let currColumnValue = matrix[i][majorDiagonalColumnIndexAtFirstRow + i];

        if (currColumnValue) {
          populatedNumTimes += 1;
        }

        if (populatedNumTimes === 2) {
          break;
        }
      }

      return Boolean(populatedNumTimes === 2);
    },

    /*

    // PSEUDOCODE - EDIT :)

    // declare a variable called populatedNumTimes init with 0
    // declare a variable called matrix init with the matrix

    // NOTE: n is the amount of rows in the matrix (essentially length)
    // iterate over the first (n - majorDiagonalColumnIndexAtFirstRow) rows of the matrix

      // if
      // declare a variable called `currentColumnValue` init with...
      // ... the current row at column `majorDiagonalColumnIndexAtFirstRow` value
         ... + current iteration num (NOT ADDING THIS PART)

      // if the `currColumnValue` is populated (1)
        // increment the value of 'populatedNumTimes' by 1

      // if `populatedNumTimes` is 2
        // break out of loop

    // if populatedNumTimes is 2 or greater (maybe just 2  is fine since we're breaking out of loop)
      // return true (because we encountered a conflict)
    // else
      // return false (because there is no conflict).
    */

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      let hasConflict = false;
      let matrix = this.rows();

      for (let i = 0; i < matrix.length; i++) {
        hasConflict = this.hasMajorDiagonalConflictAt(i);

        if (hasConflict) {
          return true;
        }
      }

      // NOTE: May have to use -(matrix.length) + 1... maybe...

      // for (let i = -1; i > -matrix.length; i--) {
      //   hasConflict = this.hasMajorDiagonalConflictAt(i);

      //   if (hasConflict) {
      //     return true;
      //   }
      // }

      return false;



      // iterate starting from -1 and up to the negative matrix length
      //   init hasConflict with the below...
      //   ... invoke hasMajorDiagonalConflictAt, passing in the currentIndex
      //   if hasConflict is true
      //     return true

      // return false (because if we end up getting to this line then no conflict were
      //   encountered).
    },


    /*
    PSEUDO


    // NOTE THE BELOW ITERATIONS WILL BE ACCESSING THE DIAGONALS THAT
    // ARE AT POSTIVE INDEXES

    // declare a variable called hasConflict init with false
    // iterate over the length of the matrix
      // init hasConflict with the below...
         ... invoke hasMajorDiagonalConflictAt, passing in the currentIndex
      // if hasConflict is true
        // return true


    // NOTE THE BELOW ITERATIONS WILL BE ACCESSING THE DIAGONALS THAT
    // ARE AT NEGATIVE INDEXES


    // iterate starting from -1 and up to the matrix length, but negative
      // init hasConflict with the below...
         ... invoke hasMajorDiagonalConflictAt, passing in the currentIndex
      // if hasConflict is true
        // return true

    // return false (because if we end up getting to this line then no conflict were
       encountered).


    IOCE:

    in:
      - none
    out:
      - (Boolean): true if there is a conflict, false otherwise.
    cons:
      - none
    edge:
      - retu

    */

    /*
    checks all diagonals from top-left to bottom-right
    */



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
