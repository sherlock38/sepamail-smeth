<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document    : missive_transition_Acknowledgement_xul.xsl
    Created on  : November 16, 2012, 11:12 AM
    Version     : based on standard version 1206
    Author      : Bishan Kumar Madhoo <bishan.madhoo@idsoft.mu>
    Description : Transforming an acknowledgement missive XML to XUL form
    TODO MSO    : see if pain013 is necessary
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

        <vbox id="semAcknowledgementFormContainer" flex="1">
            <label id="semAcknowledgementTitle" value="Acknowledgement details"/>
            <separator class="thin" orient="horizontal"/>
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

    </xsl:template>

</xsl:stylesheet>
