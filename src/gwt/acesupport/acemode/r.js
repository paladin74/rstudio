/*
 * r.js
 *
 * Copyright (C) 2009-11 by RStudio, Inc.
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * This program is licensed to you under the terms of version 3 of the
 * GNU Affero General Public License. This program is distributed WITHOUT
 * ANY EXPRESS OR IMPLIED WARRANTY, INCLUDING THOSE OF NON-INFRINGEMENT,
 * MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. Please refer to the
 * AGPL (http://www.gnu.org/licenses/agpl-3.0.txt) for more details.
 *
 */
define("mode/r", function(require, exports, module)
{
   var Editor = require("ace/editor").Editor;
   var EditSession = require("ace/edit_session").EditSession;
   var Range = require("ace/range").Range;
   var oop = require("ace/lib/oop");
   var TextMode = require("ace/mode/text").Mode;
   var Tokenizer = require("ace/tokenizer").Tokenizer;
   var TextHighlightRules = require("ace/mode/text_highlight_rules")
         .TextHighlightRules;
   var RHighlightRules = require("mode/r_highlight_rules").RHighlightRules;
   var RCodeModel = require("mode/r_code_model").RCodeModel;
   var MatchingBraceOutdent = require("ace/mode/matching_brace_outdent").MatchingBraceOutdent;
   var AutoBraceInsert = require("mode/auto_brace_insert").AutoBraceInsert;
   var unicode = require("ace/unicode");

   var Mode = function(suppressHighlighting, doc, session)
   {
      if (suppressHighlighting)
         this.$tokenizer = new Tokenizer(new TextHighlightRules().getRules());
      else
         this.$tokenizer = new Tokenizer(new RHighlightRules().getRules());
      this.$outdent = new MatchingBraceOutdent();

      this.codeModel = new RCodeModel(doc, this.$tokenizer, null);
      this.foldingRules = this.codeModel;
   };
   oop.inherits(Mode, TextMode);

   (function()
   {
      this.tokenRe = new RegExp("^["
          + unicode.packages.L
          + unicode.packages.Mn + unicode.packages.Mc
          + unicode.packages.Nd
          + unicode.packages.Pc + "._]+", "g"
      );

      this.nonTokenRe = new RegExp("^(?:[^"
          + unicode.packages.L
          + unicode.packages.Mn + unicode.packages.Mc
          + unicode.packages.Nd
          + unicode.packages.Pc + "._]|\s])+", "g"
      );

      this.$complements = {
               "(": ")",
               "[": "]",
               '"': '"',
               "'": "'",
               "{": "}"
            };
      this.$reOpen = /^[(["'{]$/;
      this.$reClose = /^[)\]"'}]$/;

      this.getNextLineIndent = function(state, line, tab, tabSize, row)
      {
         return this.codeModel.getNextLineIndent(row, line, state, tab, tabSize);
      };

      this.allowAutoInsert = this.smartAllowAutoInsert;

      this.checkOutdent = function(state, line, input) {
         if (! /^\s+$/.test(line))
            return false;

         return /^\s*[\{\}\)]/.test(input);
      };

      this.getIndentForOpenBrace = function(openBracePos)
      {
         return this.codeModel.getIndentForOpenBrace(openBracePos);
      };

      this.autoOutdent = function(state, doc, row) {
         if (row == 0)
            return 0;

         var line = doc.getLine(row);

         var match = line.match(/^(\s*[\}\)])/);
         if (match)
         {
            var column = match[1].length;
            var openBracePos = doc.findMatchingBracket({row: row, column: column});

            if (!openBracePos || openBracePos.row == row) return 0;

            var indent = this.codeModel.getIndentForOpenBrace(openBracePos);
            doc.replace(new Range(row, 0, row, column-1), indent);
         }

         match = line.match(/^(\s*\{)/);
         if (match)
         {
            var column = match[1].length;
            var indent = this.codeModel.getBraceIndent(row-1);
            doc.replace(new Range(row, 0, row, column-1), indent);
         }
      };

      this.$getIndent = function(line) {
         var match = line.match(/^(\s+)/);
         if (match) {
            return match[1];
         }

         return "";
      };

      this.transformAction = function(state, action, editor, session, text) {
         if (action === 'insertion' && text === "\n") {

            // If newline in a doxygen comment, continue the comment
            var pos = editor.getSelectionRange().start;
            var match = /^((\s*#+')\s*)/.exec(session.doc.getLine(pos.row));
            if (match && editor.getSelectionRange().start.column >= match[2].length) {
               return {text: "\n" + match[1]};
            }
         }
         return false;
      };
   }).call(Mode.prototype);
   exports.Mode = Mode;
});
