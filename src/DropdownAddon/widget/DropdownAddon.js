define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-attr",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",
    "dojo/query",
    "dojo/aspect",

], function(declare, _WidgetBase, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoAttr, dojoArray, lang, dojoText, dojoHtml, dojoEvent, query, aspect) {
    "use strict";

    return declare("DropdownAddon.widget.DropdownAddon", [_WidgetBase], {


        widgetBase: null,
        referenceSelectorName: null,
        attributes: null,
        displayString: null,

        // Internal variables.

        constructor: function() {},

        postCreate: function() {
            logger.debug(this.id + ".postCreate");
            this._setupWidget();
        },

        update: function(obj, callback) {
            logger.debug(this.id + ".update");
            this._executeCallback(callback, "_update");
        },

        resize: function(box) {
            logger.debug(this.id + ".resize");
        },

        uninitialize: function() {
            logger.debug(this.id + ".uninitialize");
        },

        _setupWidget: function() {
            //find the referenceSelector (with react wrapper it is hierarchical)
            var selectors = query('.mx-name-' + this.referenceSelectorName + ' .mx-referenceselector');
            if (!selectors || selectors.length == 0) {
                //find reference selector without react wrapper (same level)
                selectors = query('.mx-name-' + this.referenceSelectorName + '.mx-referenceselector');
            }
            if (!selectors || selectors.length == 0) {
                console.log("referenceSelector was not found! Check the name: " + this.referenceSelectorName);
            } else {
                selectors.forEach(lang.hitch(this, function(selector) {
                    var wgt = dijit.byNode(selector);
                    //hook into the referenceSelector
                    aspect.after(wgt, "_renderOptions", lang.hitch(this, function(mxObjs) {
                        //param mxObjs contains array with the mxobjs of reference
                        //wgt._editNode contains childs with <option> elements. The value of each element contains the guid. We lookup the guid in the mxObjs array and replace the contents of the element
                        var parent = wgt._editNode;
                        var childs = parent.childNodes;
                        for (var i = 0; i < childs.length; i++) {
                            var child = childs[i];
                            var guid = dojoAttr.get(child, "value");
                            //find the guid in the mxObjs
                            var mxObj = mxObjs.find(function(item) { return item.getGuid() == guid; });
                            if (mxObj) {
                                //set the text on the option element
                                this._renderText(child, mxObj);
                            }
                        }

                    }), true);

                }));
            }
        },

        _renderText: function(childElement, mxObj) {
            var str = this.displayString;
            //get the object, so we don't miss out attributes (the dropdown will only parse the configured attribute)
            mx.data.get({
                guid: mxObj.getGuid(),
                callback: dojo.hitch(this, function(obj) {
                    //iterate the attributes list
                    dojoArray.forEach(this.attributes, lang.hitch(this, function(attrObj) {
                        //get attribute value from mxObj
                        var value = this._formatValue(obj, attrObj.attr, attrObj);
                        str = str.split("${" + attrObj.variableName + "}").join(value);
                        childElement.innerHTML = str;

                    }));
                })
            });
        },

        _formatValue(mxObj, attrName, attrObj) {
            //may be enhanced later with more formatting options for different datatypes
            if (mxObj.isDate(attrName)) {
                var options = {
                    datePattern: attrObj.datePattern !== "" ? attrObj.datePattern : undefined
                };
            }
            if (mxObj.isNumeric(attrName) || (mxObj.isCurrency && mxObj.isCurrency(attrName)) || mxObj.getAttributeType(attrName) === "AutoNumber") {
                var options = {
                    places: attrObj.decimalPrecision
                };
                if (attrObj.groupDigits) {
                    options.locale = dojo.locale;
                    options.groups = true;
                }
            }
            return window.mx.parser.formatAttribute(mxObj, attrName, options);
        },

        // Shorthand for executing a callback, adds logging to your inspector
        _executeCallback: function(cb, from) {
            logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(["DropdownAddon/widget/DropdownAddon"]);