<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : missive_transition_AcknowledgementBody_xul.xsl
    Created on : March 18, 2013, 11:24 AM
    Author     : Bishan Kumar Madhoo <bishan.madhoo@idsoft.mu>
    Description: Transforming an acknowledgement XML to XUL
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
    xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge"
    xmlns:pain013="urn:iso:std:iso:20022:tech:xsd:pain.013.001.01"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sepamail.eu/xsd/bleedingEdge ../../../../xsd/sepamail_missive.xsd"
    xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul">

    <xsl:output method="xml" omit-xml-declaration="yes"/>

    <xsl:template match="/">
        <vbox class="acknowledgement" id="missiveBodyView" flex="1" xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul">
            <separator class="thin" orient="horizontal"/>
            <hbox flex="1" id="semBdy">
                <grid flex="1" id="bdyGrid">
                    <columns>
                        <column/>
                        <column flex="1"/>
                    </columns>
                    <rows>
                        <row align="center" class="grid-row">
                            <label value="Statut"/>
                            <textbox flex="1" readonly="true">
                                <xsl:attribute name="value">
                                    <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvAcq/sem:AcqSta"/>
                                </xsl:attribute>
                            </textbox>
                        </row>
                        <row align="center" class="grid-row">
                            <label value="Classe"/>
                            <textbox flex="1" readonly="true">
                                <xsl:attribute name="value">
                                    <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvAcq/sem:AcqCla"/>
                                </xsl:attribute>
                            </textbox>
                        </row>
                        <row align="center" class="grid-row">
                            <label value="Sujet"/>
                            <textbox flex="1" readonly="true">
                                <xsl:attribute name="value">
                                    <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvAcq/sem:AcqSub"/>
                                </xsl:attribute>
                            </textbox>
                        </row>
                        <row align="center" class="grid-row">
                            <label value="Détail"/>
                            <textbox flex="1" readonly="true">
                                <xsl:attribute name="value">
                                    <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvAcq/sem:AcqDet"/>
                                </xsl:attribute>
                            </textbox>
                        </row>
                        <row flex="1">
                            <vbox align="start">
                                <box align="center" class="multiline_field-label-container">
                                    <label value="Description"/>
                                </box>
                            </vbox>
                            <textbox align="stretch" flex="1" multiline="true" readonly="true">
                                <xsl:attribute name="value">
                                    <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvAcq/sem:AcqDes"/>
                                </xsl:attribute>
                            </textbox>
                        </row>
                    </rows>
                </grid>
            </hbox>
        </vbox>
    </xsl:template>

</xsl:stylesheet>