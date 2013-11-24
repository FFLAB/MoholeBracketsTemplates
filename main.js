/*
* Copyright (c) 2012 Travis Almand. All rights reserved.
*
* Permission is hereby granted, free of charge, to any person obtaining a
* copy of this software and associated documentation files (the "Software"),
* to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense,
* and/or sell copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
* DEALINGS IN THE SOFTWARE.
*/

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, browser: true */
/*global define, brackets, $ */

define(function (require, exports, module) {
    
    'use strict';

    var CommandManager = brackets.getModule("command/CommandManager"),
        EditorManager  = brackets.getModule("editor/EditorManager"),
        Menus          = brackets.getModule("command/Menus");
    
    // load up modal content, don't forget text! at beginning of file name
    var modal = require("text!html/modal.html");
   
    function action() {
        
        // add our modal window to the body
        $("body").append(modal);
        
        // show new elements
        $('#templates_modalBackdrop').css('opacity', 0.5);
        $('#templates_modal').css({
            'position': 'absolute',
            'top': 'calc(50% - ' + ($('#templates_modal').height() / 2) + 'px)',
            'left': 'calc(50% - ' + ($('#templates_modal').width() / 2) + 'px)'
        });
        
        // pressing esc key closes modal and backdrop
        $(document).keyup(function (e) {
            if (e.keyCode === 27) {
                $("#templates_modal, #templates_modalBackdrop").remove();
            }
        });
        
        // clicking close button, x header button, or backdrop removes modal from body
        $("#templates_modalBtn, #templates_modalBackdrop, #templates_modal a.close").on("click", function (e) {
            e.preventDefault();
            $("#templates_modal, #templates_modalBackdrop").remove();
        });
    
        var editor = EditorManager.getCurrentFullEditor();
        if (editor) {
            if (editor._codeMirror.getValue().length > 0) {
                // file has content, show warning
                $("#templates_warning").show();
            }
        } else {
            // no file is open, show error
            $("#templates_error").show();
            $(".modal-body").hide();
        }
        
        // result of clicking a template choice
        // selector is very specific to avoid cross-extension contamination, just in case
        $('#templates_modal select#standard, #templates_modal select#frameworks').on('change', function () {
            // send the chosen template
            chosenTemplate($(this).val());            
        });
        
        var chosenTemplate = function (choice) {
            // grab the html to be inserted into file
            var template;
            switch (choice) {
                // standard
                case "html":
                    template = require("text!html/html5.html");
                    break;
                case "hcss":
                    template = require("text!html/hcss.html");
                    break;
                case "hcssjs":
                    template = require("text!html/hcssjs.html");
                    break;
                case "hcssjquery":
                    template = require("text!html/hjquery.html");
                    break;
                case "php":
                    template = require("text!html/base.php");
                    break;
                case "phphtml":
                    template = require("text!html/html.php");
                    break;
                default:
                    template = "Something went wrong somewhere. Not horribly wrong, just wrong.";
            }
            
            // insert html into file, this will overwrite whatever content happens to be there already
            EditorManager.getCurrentFullEditor()._codeMirror.setValue(template);
            
            // automatically close the modal window
            $("#templates_modalBtn").click();
        };

    }
    
    // Register the commands and insert in the File menu
    CommandManager.register("Template HTML Mohole", "templates", action);
    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    menu.addMenuDivider();
    menu.addMenuItem("templates");
    
});