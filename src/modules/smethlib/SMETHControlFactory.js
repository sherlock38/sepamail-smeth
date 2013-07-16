/* ***** BEGIN LICENSE BLOCK *****
 * This file is part of smeth (https://code.google.com/p/sepamail-smeth/)
 *
 * Version: MPL 2.0/GPL 3.0/LGPL 3.0
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/2.0/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Initials Developers of the Original Code are :
 *  Ammit Heeramun, idSoft
 *  Bishan Kumar Madhoo, idSoft
 *  Manfred Sherlock Olm, deciBI & vizGet
 * Portions created by the Initials Developers are Copyright (C) 2012
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *  Ammit Heeramun
 *  Bishan Kumar Madhoo
 *  Manfred Sherlock Olm, smeth@decibi.fr
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 3 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 3.0 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

/**
 * @module smeth
 * @file SMETHControlFactory.js
 * @mvc controler
 * @version 1212
 * @since 1210
 * @author Ammit Heeramun
 * @description Controls class helps for the creation XUL and HTML controls
 */

/**
 * items exported from the module
 * @see https://developer.mozilla.org/en-US/docs/JavaScript_code_modules/Using
 */
var EXPORTED_SYMBOLS = ["SMETHControlFactory"];

/**
 * Strict mode for scripts
 * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Functions_and_function_scope/Strict_mode
 */
"use strict";

/**
 * Controls class helps for the creation XUL controls
 *
 * @class SMETHControlFactory
 *
 */
SMETHControlFactory = function(aDocument) {
    this._document = aDocument;
    this._xul_ns = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    this._html_ns = "http://www.w3.org/1999/xhtml";
};

/**
 * Controls class methods.
 *
 * @class SMETHControlFactory
 */
SMETHControlFactory.prototype = {

    /**
     * The document that we will use to create a XUL control.
     *
     * @attribute _header
     * @private
     * @default null
     */
    _document : null,

    /**
     * createBrowserXULElement creates a XUL browser element
     *
     * @return {Object} Generated XUL control object
     */
    createBrowserXULElement : function() {

        try {

            // Create the XUL browser
            var item = this._document.createElementNS(this._xul_ns, "browser");

            return item;

        } catch(e) {
            throw e;
        }
    },

    /**
     * createButtonXULElement creates a XUL button control having the given title
     *
     * @method createButtonXULElement
     * @param {String} anId ID of the XUL button
     * @param {String} aTitle Title of the XUL button
     * @return {Object} Generated XUL control object
     */
    createButtonXULElement : function(anId, aTitle) {

        try {

            // Create the XUL button
            var item = this._document.createElementNS(this._xul_ns, "button"); // create a new XUL button
            item.setAttribute("id", anId);
            item.setAttribute("label", aTitle);

            return item;

        } catch(e) {
            throw e;
        }
    },

   /**
    * createTextXULElement function creates a text XUL control containing the parametered text
    *
    * @method createTextXULElement
    * @param {String} aText Content Text for the control
    * @return {Object} Generated XUL control object
    */
    createTextXULElement : function(aText){
        try
        {
            return this._document.createTextNode(aText);
        }
        catch(ex)
        {
            throw ex;
        }
    },

   /**
    * createMultilineTextElement function split a text by \n and adds <br> elements
    *
    * @method createMultilineTextElement
    * @param {String} anId ID of the control
    * @param {String} aText Content Text for the control
    * @return {Object} Multiline Text Element
    */
    createMultilineTextElement : function(anId, aText){
        try
        {
            // Create a div container
            var divContainer = this.createDivHTMLElement(anId);

            // Split the text by "\n"
            var textArray = aText.split("\n");

            // If the array contains only one element
            if(1 == textArray.length)
            {
                // Add the the elementto the container
                divContainer.appendChild(this.createTextXULElement(aText));
            }
             // If the array contains more than one element
            else if(1 < textArray.length)
            {
                // Loop into the array
                for(i=0; i < textArray.length; i++)
                {
                    // Add the element to the container followed by a <br> element
                    divContainer.appendChild(this.createTextXULElement(textArray[i]));
                    divContainer.appendChild(this.createBRHTMLElement());
                }
            }

            return divContainer;
        }
        catch(ex)
        {
            throw ex;
        }
    },

   /**
    * createImageXULElement function creates an image XUL control with the prameters
    *
    * @method createImageXULElement
    * @param {String} anId ID of the control
    * @param {String} aSrc Source attribute value
    * @param {String} aWidth Width attribute value
    * @param {String} aHeight Height attribute value
    * @return {Object} Generated XUL control object
    */
    createImageXULElement : function(anId, aSrc, aWidth, aHeight){
        try
        {
            var item = this._document.createElementNS(this._xul_ns, "image"); // create a new XUL image
            item.setAttribute("id", anId);
            item.setAttribute("src", aSrc);
            item.setAttribute("width", aWidth);
            //item.setAttribute("height", aHeight);

            return item;
        }
        catch(ex)
        {
            throw ex;
        }

    },

   /**
    * createDescriptionXULElement function creates an description XUL control with the prameters
    *
    * @method createDescriptionXULElement
    * @param {String} anId ID of the control
    * @param {String} aText Content Text for the control
    * @param {String} aWidth Width attribute value
    * @return {Object} Generated XUL control object
    */
    createDescriptionXULElement : function(anId, aText, aWidth){
        try
        {
            var item = this._document.createElementNS(this._xul_ns, "description"); // create a new XUL decription
            item.setAttribute("id", anId);
            item.setAttribute("width", aWidth);
            item.setAttribute("style", "white-space: pre;")
            item.textContent = aText;

            return item;
        }
        catch(ex)
        {
            throw ex;
        }

    },

   /**
    * createListItemXULElement function creates a list item XUL control with the prameters
    *
    * @method createListItemXULElement
    * @param {String} aText Content Text for the control
    * @return {Object} Generated XUL control object
    */
    createListItemXULElement : function(aText){
        try
        {
            var item = this._document.createElementNS(this._xul_ns, "listitem");
            item.setAttribute("label", aText);

            return item;
        }
        catch(ex)
        {
            throw ex;
        }

    },

   /**
    * createBoxXULElement function creates a box XUL control with the prameters
    *
    * @method createBoxXULElement
    * @param {String} anId ID of the control
    * @return {Object} Generated XUL control object
    */
    createBoxXULElement : function(anId){
        try
        {
            var item = this._document.createElementNS(this._xul_ns, "box");
            item.setAttribute("id", anId);

            return item;
        }
        catch(ex)
        {
            throw ex;
        }

    },


   /**
    * createBoxXULElement function creates a hbox XUL control with the prameters
    *
    * @method createHBoxXULElement
    * @param {String} anId ID of the control
    * @return {Object} Generated XUL control object
    */
    createHBoxXULElement : function(anId){
        try
        {
            var item = this._document.createElementNS(this._xul_ns, "hbox");
            item.setAttribute("id", anId);

            return item;
        }
        catch(ex)
        {
            throw ex;
        }

    },

   /**
    * createVBoxXULElement function creates a vbox XUL control with the prameters
    *
    * @method createVBoxXULElement
    * @param {String} anId ID of the control
    * @return {Object} Generated XUL control object
    */
    createVBoxXULElement : function(anId){
        try
        {
            var item = this._document.createElementNS(this._xul_ns, "vbox");
            item.setAttribute("id", anId);

            return item;
        }
        catch(ex)
        {
            throw ex;
        }

    },

   /**
    * createSpacerXULElement function creates a space XUL control with the prameters
    *
    * @method createSpacerXULElement
    * @param {String} aFlex Flex attribute of the control
    * @return {Object} Generated XUL control object
    */
    createSpacerXULElement : function(aFlex){
        try
        {
            var item = this._document.createElementNS(this._xul_ns, "spacer");
            item.setAttribute("flex", aFlex);

            return item;
        }
        catch(ex)
        {
            throw ex;
        }

    },

   /**
    * createBRHTMLElement function creates an HTML br element
    *
    * @method createBRHTMLElement
    * @return {Object} Generated BR control object
    */
    createBRHTMLElement : function(){
        try
        {
            var item = this._document.createElementNS(this._html_ns, "br"); // create a new html br
            return item;
        }
        catch(ex)
        {
            throw ex;
        }
    },

   /**
    * createDivHTMLElement function creates an HTML div element
    *
    * @method createDivHTMLElement
    * @param {String} anId ID of the control
    * @return {Object} Generated div control object
    */
    createDivHTMLElement : function(anId){
        try
        {
            var item = this._document.createElementNS(this._html_ns, "div"); // create a new html div
            item.setAttribute("id", anId);
            return item;
        }
        catch(ex)
        {
            throw ex;
        }
    },

    /**
     * createTextboxXULElement creates a XUL textbox control having the given ID and multiline property
     *
     * @method createButtonXULElement
     * @param {String} anId ID of the XUL button
     * @param {Boolean} multiline Title of the XUL button
     * @return {Object} Generated XUL control object
     */
    createTextboxXULElement : function(anId, multiline) {

        try {

            // Create the XUL button
            var item = this._document.createElementNS(this._xul_ns, "textbox"); // create a new XUL textbox
            item.setAttribute("id", anId);
            item.setAttribute("multiline", multiline);

            return item;

        } catch(e) {
            throw e;
        }
    }
};


