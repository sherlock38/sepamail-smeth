<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : missive_transition_paymentActivationReportBody_xul.xsl
    Created on : February 21, 2013, 03:53 PM
    Author     : Bishan Kumar Madhoo <bishan.madhoo@idsoft.mu>
    Description: Transforming an activation.report@payment.activation message to XUL interface
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
        <vbox class="report rubis" id="missiveBodyView" flex="1" xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul">
            <separator class="thin" orient="horizontal"/>
            <xsl:variable name="reportExecutionDate" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationReport/sem:RepCompl/sem:Report/pain014:OrgnlPmtInfAndSts/pain014:TxInfAndSts/pain014:OrgnlTxRef/pain014:ReqdExctnDt"/>
            <xsl:variable name="reportAmount" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationReport/sem:RepCompl/sem:Report/pain014:OrgnlPmtInfAndSts/pain014:TxInfAndSts/pain014:OrgnlTxRef/pain014:Amt/pain014:InstdAmt"/>
            <xsl:variable name="reportAmountCurrency" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationReport/sem:RepCompl/sem:Report/pain014:OrgnlPmtInfAndSts/pain014:TxInfAndSts/pain014:OrgnlTxRef/pain014:Amt/pain014:InstdAmt/attribute::Ccy"/>
            <xsl:variable name="reportPaymentMethod" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationReport/sem:RepCompl/sem:Report/pain014:OrgnlPmtInfAndSts/pain014:TxInfAndSts/pain014:OrgnlTxRef/pain014:PmtMtd"/>
            <xsl:variable name="reportStatus" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationReport/sem:RepCompl/sem:Report/pain014:OrgnlPmtInfAndSts/pain014:TxInfAndSts/pain014:TxSts"/>
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
                            <column/>
                        </columns>
                        <rows>
                            <row align="center" class="grid-row">
                                <label id="semBdyReportStatusLabel" value="Statut"/>
                                <label id="semBdyReportStatus">
                                    <xsl:attribute name="value">
                                        <xsl:if test="$reportStatus = 'ACSP'">Accepté</xsl:if>
                                        <xsl:if test="$reportStatus = 'RJCT'">Refusé</xsl:if>
                                    </xsl:attribute>
                                </label>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semBdyReportDateLabel" value="Date de demande"/>
                                <datepicker class="report" type="popup" id="semBdyReportDataValue" readonly="true">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="str:tokenize($reportExecutionDate, 'T')"/>
                                    </xsl:attribute>
                                </datepicker>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semBdyReportAmountLabel" value="Montant demandé"/>
                                <textbox id="semBdyReportAmount" flex="1" readonly="true">
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
                                <label id="semBdyReportPaymentMethod" flex="1">
                                    <xsl:attribute name="value">
                                        <xsl:if test="$reportPaymentMethod = 'CHK'">Cheque</xsl:if>
                                        <xsl:if test="$reportPaymentMethod = 'TRF'">Transfer</xsl:if>
                                        <xsl:if test="$reportPaymentMethod = 'DD'">Direct Debit</xsl:if>
                                        <xsl:if test="$reportPaymentMethod = 'CARD'">Payment Card</xsl:if>
                                    </xsl:attribute>
                                </label>
                            </row>
                        </rows>
                    </grid>
                </vbox>
            </hbox>
        </vbox>
    </xsl:template>

</xsl:stylesheet>