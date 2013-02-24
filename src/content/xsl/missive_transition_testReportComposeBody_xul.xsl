<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : missive_transition_testReportComposeBody_xul.xsl
    Created on : Febuary 05, 2013,
    Author     : Bishan Kumar Madhoo <bishan.madhoo@idsoft.mu>
    Description: Transforming an XML to XUL
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
    xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge"
    xmlns:pain013="urn:iso:std:iso:20022:tech:xsd:pain.013.001.01"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sepamail.eu/xsd/bleedingEdge ../../../../xsd/sepamail_missive.xsd"
    xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"
    exclude-result-prefixes="sem pain013 xsi">

    <xsl:output method="xml" omit-xml-declaration="yes"/>

    <xsl:template match="/">
        <vbox id="missiveBodyViewWithAttachments" flex="1">
            <vbox id="missiveBodyView" flex="1">
                <label id="semTestRequestTitle" value="Test report details"/>
                <separator class="thin" orient="horizontal"/>
                <hbox id="semBdy" flex="1">
                    <box align="start" class="semModeToggleParentContainer" pack="center">
                        <box align="center" class="semModeToggleContainer" pack="center">
                            <image id="semBdyToogleButton" class="link-image" height="12" width="12">
                                <xsl:attribute name="src">
                                    <xsl:text disable-output-escaping="yes">chrome://smeth/skin/images/expand.png</xsl:text>
                                </xsl:attribute>
                                <xsl:attribute name="onclick">
                                    <xsl:text disable-output-escaping="yes">

                                        // Array of elements that are displayed / hidden between display modes
                                        var elements = document.getElementById('vboxTestRequestDetails').getElementsByAttribute('collapsed', '*');

                                        // Show collapsed elements if form is collapsed
                                        if (this.getAttribute('src') == 'chrome://smeth/skin/images/expand.png') {

                                            // Scan the array of collapsed elements
                                            for (var i = 0; i &lt; elements.length; i++) {
                                                elements[i].setAttribute('collapsed', false);
                                            }

                                            // Set the image of the collapse button
                                            this.setAttribute('src', 'chrome://smeth/skin/images/collapse.png');

                                        } else {

                                            // Scan the array of visible elements
                                            for (var i = 0; i &lt; elements.length; i++) {
                                                elements[i].setAttribute('collapsed', true);
                                            }

                                            // Set the image of the collapse button
                                            this.setAttribute('src', 'chrome://smeth/skin/images/expand.png');
                                        }

                                    </xsl:text>
                                </xsl:attribute>
                            </image>
                        </box>
                    </box>
                    <vbox align="stretch" flex="1" id="vboxTestRequestDetails">
                        <grid align="stretch" collapsed="true" id="gridTestIdElements">
                            <columns>
                                <column/>
                                <column/>
                                <column flex="1"/>
                                <column/>
                                <column/>
                            </columns>
                            <rows>
                                <row align="center" class="grid-row">
                                    <label id="semBdyMissiveIdLabel" value="Missive ID"/>
                                    <separator class="thin" orient="vertical"/>
                                    <textbox id="missiveIdTextbox" flex="1" readonly="true"/>
                                    <separator class="thin" orient="vertical"/>
                                    <button id="semMissiveIdButton" label="Generate">
                                        <xsl:attribute name="onclick">
                                            <xsl:text disable-output-escaping="yes">

                                                // UUID generator instance
                                                var uuidGenerator = Components.classes["@mozilla.org/uuid-generator;1"]
                                                                              .getService(Components.interfaces.nsIUUIDGenerator);

                                                // Get a new UUID and assign it to the missive ID textbox
                                                var testId = ((uuidGenerator.generateUUID().toString().replace(/-/g, "")).substring(1, 17)).toUpperCase();
                                                document.getElementById('missiveIdTextbox').setAttribute('value', testId);

                                            </xsl:text>
                                        </xsl:attribute>
                                    </button>
                                </row>
                                <row align="center" class="grid-row">
                                    <label id="semBdyTypeMissiveLabel" value="Missive Type"/>
                                    <separator class="thin" orient="vertical"/>
                                    <textbox id="typeMissiveTextbox" flex="1">
                                        <xsl:attribute name="value">
                                            <xsl:value-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvTyp"/>
                                        </xsl:attribute>
                                    </textbox>
                                </row>
                                <row align="center" class="grid-row">
                                    <label id="semBdyOrderMissiveLabel" value="Missive Order"/>
                                    <separator class="thin" orient="vertical"/>
                                    <textbox id="orderMissiveTextbox" flex="1">
                                        <xsl:attribute name="value">
                                            <xsl:value-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvOrd"/>
                                        </xsl:attribute>
                                    </textbox>
                                </row>
                                <row align="center" class="grid-row">
                                    <label id="semBdyPriorityLabel" value="Priority"/>
                                    <separator class="thin" orient="vertical"/>
                                    <textbox id="priorityTextbox" flex="1">
                                        <xsl:attribute name="value">
                                            <xsl:value-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvPri"/>
                                        </xsl:attribute>
                                    </textbox>
                                </row>
                                <row align="center" class="grid-row">
                                    <label id="semBdyMessageIdLabel" value="Message ID"/>
                                    <separator class="thin" orient="vertical"/>
                                    <textbox id="messageIdTextbox" flex="1" readonly="true"/>
                                    <separator class="thin" orient="vertical"/>
                                    <button id="semMessageIdButton" label="Generate">
                                        <xsl:attribute name="onclick">
                                            <xsl:text disable-output-escaping="yes">

                                                // UUID generator instance
                                                var uuidGenerator = Components.classes["@mozilla.org/uuid-generator;1"]
                                                                              .getService(Components.interfaces.nsIUUIDGenerator);

                                                // Get a new UUID and assign it to the missive ID textbox
                                                var testId = ((uuidGenerator.generateUUID().toString().replace(/-/g, "")).substring(1, 33)).toUpperCase();
                                                document.getElementById('messageIdTextbox').setAttribute('value', testId);

                                            </xsl:text>
                                        </xsl:attribute>
                                    </button>
                                </row>
                                <row align="center" class="grid-row">
                                    <label id="semBdyTestIdLabel" value="Test ID"/>
                                    <separator class="thin" orient="vertical"/>
                                    <textbox id="requestTestIdTextbox" flex="1" readonly="true">
                                        <xsl:attribute name="value">
                                            <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:SimpleTestReport/sem:TestId"/>
                                        </xsl:attribute>
                                    </textbox>
                                    <separator class="thin" orient="vertical"/>
                                    <button id="semTestIdButton" label="Generate">
                                        <xsl:attribute name="onclick">
                                            <xsl:text disable-output-escaping="yes">

                                                // UUID generator instance
                                                var uuidGenerator = Components.classes["@mozilla.org/uuid-generator;1"]
                                                                              .getService(Components.interfaces.nsIUUIDGenerator);

                                                // Get a new UUID and assign it to the Test ID textbox
                                                var testId = ((uuidGenerator.generateUUID().toString().replace(/-/g, "")).substring(1, 17)).toUpperCase();
                                                document.getElementById('requestTestIdTextbox').setAttribute('value', testId);

                                            </xsl:text>
                                        </xsl:attribute>
                                    </button>
                                </row>
                            </rows>
                        </grid>
                        <separator class="thin" collapsed="true" orient="horizontal"/>
                        <groupbox flex="1" id="groupboxTestRequestContent">
                            <caption id="groupboxTestRequestContentCaption" label="Test report content"/>
                            <separator class="thin" orient="horizontal"/>
                            <listbox id="listboxTestRequestText" flex="1" seltype="single" suppressOnSelect="false">
                                <listhead>
                                    <listheader id="listboxTestRequestTextHeader" label="Text"/>
                                </listhead>
                                <xsl:for-each select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:SimpleTestReport/sem:Text">
                                    <listitem>
                                        <xsl:attribute name="label">
                                            <xsl:value-of disable-output-escaping="yes" select="."/>
                                        </xsl:attribute>
                                        <xsl:attribute name="value">
                                            <xsl:value-of disable-output-escaping="yes" select="."/>
                                        </xsl:attribute>
                                    </listitem>
                                </xsl:for-each>
                            </listbox>
                            <separator class="thin" orient="horizontal"/>
                            <hbox align="stretch" pack="end">
                                <button id="semAddTextButton" label="Add text">
                                    <xsl:attribute name="oncommand">
                                        <xsl:text disable-output-escaping="yes">

                                            // Prompt service instance
                                            var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                                                    .getService(Components.interfaces.nsIPromptService);

                                            // Promt service defaults
                                            var checkInput = {value: false};
                                            var text = {value: ""};

                                            // Prompt user for test message text
                                            var result = prompts.prompt(null, "SEPAmail test request", "Test report text",
                                                text, null, checkInput);

                                            // Check if we need to add the text
                                            if (result) {

                                                // Add text to list of test request text content
                                                document.getElementById('listboxTestRequestText').appendItem(text.value,
                                                    text.value);
                                            }

                                        </xsl:text>
                                    </xsl:attribute>
                                </button>
                                <button id="semRemoveTextButton" disabled="false" label="Remove text">
                                    <xsl:attribute name="oncommand">
                                        <xsl:text disable-output-escaping="yes">

                                            // Listbox of text content
                                            var listboxText = document.getElementById('listboxTestRequestText');

                                            // Check if an item is selected in the list of text
                                            if (listboxText.selectedItem != null) {

                                                // Remove the selected text content
                                                listboxText.removeItemAt(listboxText.selectedIndex);
                                            }

                                        </xsl:text>
                                    </xsl:attribute>
                                </button>
                            </hbox>
                        </groupbox>
                    </vbox>
                </hbox>
            </vbox>
        </vbox>
    </xsl:template>
</xsl:stylesheet>