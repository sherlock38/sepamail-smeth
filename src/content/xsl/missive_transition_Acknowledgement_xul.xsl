<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document    : missive_transition_Acknowledgement_xul.xsl
    Created on  : November 16, 2012, 11:12 AM
    Version     : based on standard version 1206
    Author      : Bishan Kumar Madhoo <bishan.madhoo@idsoft.mu>
    Description : Transforming an acknowledgement missive XML to XUL form
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
    xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sepamail.eu/xsd/bleedingEdge ../../../../xsd/sepamail_missive.xsd"
    xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul">

    <xsl:output method="xml" omit-xml-declaration="yes"/>

    <xsl:template match="/">

        <xsl:variable name="status">
            <xsl:value-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvAcq/sem:AcqSta" disable-output-escaping="yes"/>
        </xsl:variable>

        <xsl:variable name="class">
            <xsl:value-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvAcq/sem:AcqCla" disable-output-escaping="yes"/>
        </xsl:variable>

        <xsl:variable name="subject">
            <xsl:value-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvAcq/sem:AcqSub" disable-output-escaping="yes"/>
        </xsl:variable>

        <xsl:variable name="detail">
            <xsl:value-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvAcq/sem:AcqDet" disable-output-escaping="yes"/>
        </xsl:variable>

        <xsl:variable name="description">
            <xsl:value-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvAcq/sem:AcqDes" disable-output-escaping="yes"/>
        </xsl:variable>

        <vbox class="acknowledgement" id="semAcknowledgementFormContainer" flex="1">
            <label id="semAcknowledgementTitle" value="Acknowledgement details"/>
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
                                    var elements = document.getElementById('vboxAcknowledgementDetails').getElementsByAttribute('collapsed', '*');

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
                <vbox align="stretch" flex="1" id="vboxAcknowledgementDetails">
                    <grid align="stretch" collapsed="true" id="gridHeaderElements">
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
                                <textbox id="typeMissiveTextbox" flex="1" readonly="true">
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
                        </rows>
                    </grid>
                    <separator class="thin" collapsed="true" orient="horizontal"/>
                    <grid flex="1">
                        <columns>
                            <column/>
                            <column flex="1"/>
                        </columns>
                        <rows>
                            <row align="center">
                                <label id="semAcknowledgementStatus" value="Status"/>
                                <menulist id="semAcknowledgementStatusValueList">
                                    <menupopup>
                                        <menuitem label="ACK" value="ACK">
                                            <xsl:if test="$status = 'ACK'">
                                                <xsl:attribute name="selected">true</xsl:attribute>
                                            </xsl:if>
                                        </menuitem>
                                        <menuitem label="NAK" value="NAK">
                                            <xsl:if test="$status = 'NAK'">
                                                <xsl:attribute name="selected">true</xsl:attribute>
                                            </xsl:if>
                                        </menuitem>
                                    </menupopup>
                                </menulist>
                            </row>
                            <row align="center">
                                <label id="semAcknowledgementClass" value="Return Class"/>
                                <textbox id="semAcknowledgementClassValue" align="stretch" flex="1" multiline="false">
                                    <xsl:attribute name="value"><xsl:value-of select="$class"/></xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center">
                                <label id="semAcknowledgementSub" value="Return Subject"/>
                                <textbox id="semAcknowledgementSubValue" align="stretch" flex="1" multiline="false">
                                    <xsl:attribute name="value"><xsl:value-of select="$subject"/></xsl:attribute>
                                </textbox>
                            </row>
                            <row align="center">
                                <label id="semAcknowledgementDet" value="Return Detail"/>
                                <textbox id="semAcknowledgementDetValue" align="stretch" flex="1" multiline="false">
                                    <xsl:attribute name="value"><xsl:value-of select="$detail"/></xsl:attribute>
                                </textbox>
                            </row>
                            <row flex="1">
                                <vbox align="start">
                                    <box align="center" class="multiline_field-label-container">
                                        <label id="semAcknowledgementDescription" value="Description"/>
                                    </box>
                                </vbox>
                                <textbox id="semAcknowledgementDescriptionValue" align="stretch" flex="1" multiline="true">
                                    <xsl:attribute name="value"><xsl:value-of select="$description"/></xsl:attribute>
                                </textbox>
                            </row>
                        </rows>
                    </grid>
                </vbox>
            </hbox>
        </vbox>

    </xsl:template>

</xsl:stylesheet>
