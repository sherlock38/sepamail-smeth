<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : missive_transition_ReportBody.xsl
    Created on : October 30, 2012, 04:24 PM
    Author     : Ammit Heeramun <ammit.heeramun@idsoft.mu>
    Edited     : Bishan Kumar Madhoo <bishan.madhoo@idsoft.mu>
    Last edited: February 21, 2013
    Description: Transforming an XML to XUL
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
    xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge"
    xmlns:pain013="urn:iso:std:iso:20022:tech:xsd:pain.013.001.01"
    xmlns:pain014="urn:iso:std:iso:20022:tech:xsd:pain.014.001.01"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sepamail.eu/xsd/bleedingEdge ../../../../xsd/sepamail_missive.xsd"
    xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"
    xmlns:str="http://exslt.org/strings"
    exclude-result-prefixes="sem pain013 xsi">

    <xsl:output method="xml" omit-xml-declaration="yes"/>

    <xsl:template match="/">
        <vbox class="report rubis" id="missiveBodyView" flex="1">
            <label id="semTestRequestTitle" value="Payment activation report details"/>
            <separator class="thin" orient="horizontal"/>
            <xsl:variable name="reportExecutionDate" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationReport/sem:RepCompl/sem:Report/pain014:OrgnlPmtInfAndSts/pain014:TxInfAndSts/pain014:OrgnlTxRef/pain014:ReqdExctnDt"/>
            <xsl:variable name="reportAmount" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationReport/sem:RepCompl/sem:Report/pain014:OrgnlPmtInfAndSts/pain014:TxInfAndSts/pain014:OrgnlTxRef/pain014:Amt/pain014:InstdAmt"/>
            <xsl:variable name="reportAmountCurrency" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationReport/sem:RepCompl/sem:Report/pain014:OrgnlPmtInfAndSts/pain014:TxInfAndSts/pain014:OrgnlTxRef/pain014:Amt/pain014:InstdAmt/attribute::Ccy"/>
            <xsl:variable name="reportPaymentMethod" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationReport/sem:RepCompl/sem:Report/pain014:OrgnlPmtInfAndSts/pain014:TxInfAndSts/pain014:OrgnlTxRef/pain014:PmtMtd"/>
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
                                    var elements = document.getElementById('vboxPaymentActivationReportDetails').getElementsByAttribute('collapsed', '*');

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
                <vbox align="stretch" flex="1" id="vboxPaymentActivationReportDetails">
                    <grid align="stretch" collapsed="true" id="gridReportIdElements">
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
                        </rows>
                    </grid>
                    <separator class="thin" collapsed="true" orient="horizontal"/>
                    <grid id="bdyGrid">
                        <columns>
                            <column/>
                            <column flex="1"/>
                            <column/>
                        </columns>
                        <rows>
                            <row align="center" class="grid-row">
                                <label id="semBdyReportDateLabel" value="Date de demande"/>
                                <datepicker type="popup" id="semBdyReportDataValue">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="str:tokenize($reportExecutionDate, 'T')"/>
                                    </xsl:attribute>
                                </datepicker>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semBdyReportAmountLabel" value="Montant demandé"/>
                                <textbox id="semBdyReportAmount" flex="1">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="$reportAmount"/>
                                    </xsl:attribute>
                                </textbox>
                                <label id="ccyLabel">
                                     <xsl:if test="$reportAmountCurrency = 'EUR'">
                                        <xsl:attribute name="value">€ (euros)</xsl:attribute>
                                     </xsl:if>
                                </label>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semBdyReportPaymentMethodLabel" value="Moyen de paiement"/>
                                <menulist id="semBdyReportPaymentMethod" flex="1">
                                    <menupopup>
                                        <menuitem id="semBdyReportPaymentMethodCheck" label="Cheque" value="CHK" >
                                            <xsl:if test="$reportPaymentMethod = 'CHK'">
                                                    <xsl:attribute name="selected">true</xsl:attribute>
                                            </xsl:if>
                                        </menuitem>
                                        <menuitem id="semBdyReportPaymentMethodTransfer" label="Transfer" value="TRF" >
                                            <xsl:if test="$reportPaymentMethod = 'TRF'">
                                                    <xsl:attribute name="selected">true</xsl:attribute>
                                            </xsl:if>
                                        </menuitem>
                                        <menuitem id="semBdyReportPaymentMethodDirectDebit" label="Direct Debit" value="DD" >
                                            <xsl:if test="$reportPaymentMethod = 'DD'">
                                                    <xsl:attribute name="selected">true</xsl:attribute>
                                            </xsl:if>
                                        </menuitem>
                                        <menuitem id="semBdyReportPaymentMethodPaymentCard" label="Payment Card" value="CARD" >
                                            <xsl:if test="$reportPaymentMethod = 'CARD'">
                                                    <xsl:attribute name="selected">true</xsl:attribute>
                                            </xsl:if>
                                        </menuitem>
                                    </menupopup>
                                </menulist>
                            </row>
                        </rows>
                    </grid>
                </vbox>
            </hbox>
        </vbox>
    </xsl:template>
</xsl:stylesheet>