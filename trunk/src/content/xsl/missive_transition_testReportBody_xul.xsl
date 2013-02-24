<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : missive_transition_ReportBody.xsl
    Created on : October 30, 2012, 04:24 PM
    Author     : Ammit Heeramun <ammit.heeramun@idsoft.mu>
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
        <vbox id="missiveBodyView" flex="1" xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul">
            <separator class="thin" orient="horizontal"/>
            <hbox id="semBdy">
                <box align="start" class="semModeToggleParentContainer" pack="center">
                    <box align="center" class="semModeToggleContainer" pack="center">
                        <image id="semBdyToogleButton" class="link-image" height="12" width="12">
                        <xsl:attribute name="src">
                            <xsl:text disable-output-escaping="yes">chrome://smeth/skin/images/expand.png</xsl:text>
                        </xsl:attribute>
                        <xsl:attribute name="onclick">
                            <xsl:text disable-output-escaping="yes">
                                // Get the collapsible elements
                                var elements = document.getElementById('bdyGrid').getElementsByAttribute('collapsed', '*');

                                // Instantiate a variable to indicate whether the grid is in collapsed mode or not
                                var collapse = true;

                                // For each collapsible elements toogle its state
                                for(i = 0; i &lt; elements.length; i++) {

                                    if(elements[i].hasAttribute("collapsed")) {

                                        if(elements[i].collapsed) {
                                            collapse = false;
                                            elements[i].setAttribute('collapsed', 'false')
                                        } else {
                                            collapse = true;
                                            elements[i].setAttribute('collapsed', 'true')
                                        }
                                    }
                                }

                                // Set the image of the button as per our mode
                                if(collapse) {
                                    this.src = "chrome://smeth/skin/images/expand.png";
                                } else {
                                    this.src = "chrome://smeth/skin/images/collapse.png";
                                }

                                event.stopPropagation();
                            </xsl:text>
                        </xsl:attribute>
                        </image>
                    </box>
                </box>
                <vbox flex="1">
                    <grid align="stretch" id="bdyGrid">
                        <columns>
                            <column/>
                            <column flex="1"/>
                        </columns>
                        <rows>
                            <row align="center" class="grid-row" collapsed="true">
                                <label id="semBdyTestIdLabel" value="Test ID"/>
                                <textbox id="semBdyTestIdDataValue" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:SimpleTestReport/sem:TestId"/>
                                    </xsl:attribute>
                                </textbox>
                            </row>
                        </rows>
                    </grid>
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
                </vbox>
            </hbox>
        </vbox>
    </xsl:template>

</xsl:stylesheet>