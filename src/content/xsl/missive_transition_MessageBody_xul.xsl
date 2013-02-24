<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : missive_transition_MessageBody.xsl
    Created on : October 30, 2012, 5:03 PM
    Author     : Ammit Heeramun <ammit.heeramun@idsoft.mu>
    Description: Transforming an XML to XUL
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
    xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge"
    xmlns:pain013="urn:iso:std:iso:20022:tech:xsd:pain.013.001.01"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sepamail.eu/xsd/bleedingEdge ../../../../xsd/sepamail_missive.xsd"
    xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"
    xmlns:str="http://exslt.org/strings"
    exclude-result-prefixes="sem pain013 xsi">

    <xsl:output method="xml" omit-xml-declaration="yes"/>

    <xsl:template match="/">

            <hbox id="missiveBodyView" flex="1" xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul">
                <vbox flex="1">
                    <xsl:variable name="requestExecutionDate" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:ReqdExctnDt"/>
                    <xsl:variable name="requestAmount" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:CdtTrfTx/pain013:Amt/pain013:InstdAmt"/>
                    <xsl:variable name="requestAmountCurrency" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:CdtTrfTx/pain013:Amt/pain013:InstdAmt/attribute::Ccy"/>
                    <xsl:variable name="requestPaymentMethod" >
                            <xsl:choose>
                                <xsl:when test="count(/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Complements/sem:OtherPmtMtd) > 0">
                                    <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Complements/sem:OtherPmtMtd"/>
                                </xsl:when>
                                <xsl:otherwise>
                                    <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:PmtMtd"/>
                                </xsl:otherwise>
                            </xsl:choose>
                    </xsl:variable>
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
                        <grid id="bdyGrid">
                            <columns>
                                <column/>
                                <column flex="1"/>
                                <column/>
                            </columns>
                            <rows>
                                <row align="center" class="grid-row">
                                    <label id="semBdyRequestDateLabel" value="Date de demande"/>
                                    <datepicker type="popup" id="semBdyRequestDataValue" disabled="true">
                                        <xsl:attribute name="value">
                                            <xsl:value-of disable-output-escaping="yes" select="str:tokenize($requestExecutionDate, 'T')"/>
                                        </xsl:attribute>
                                    </datepicker>
                                </row>
                                <row align="center" class="grid-row">
                                    <label id="semBdyRequestAmountLabel" value="Montant demandé"/>
                                    <textbox id="semBdyRequestAmount" flex="1" readonly="true">
                                        <xsl:attribute name="value">
                                            <xsl:value-of disable-output-escaping="yes" select="$requestAmount"/>
                                        </xsl:attribute>
                                    </textbox>
                                    <label id="ccyLabel">
                                         <xsl:if test="$requestAmountCurrency = 'EUR'">
                                            <xsl:attribute name="value">€ (euros)</xsl:attribute>
                                         </xsl:if>
                                    </label>
                                </row>
                                <row align="center" class="grid-row">
                                    <label id="semBdyRequestPaymentMethodLabel" value="Moyen de paiement"/>
                                    <menulist id="semBdyRequestMethodType" flex="1" disabled="true">
                                        <menupopup>
                                            <menuitem id="semBdyRequestPaymentMethodCheck" label="Check" value="CHK" >
                                                <xsl:if test="$requestPaymentMethod = 'CHK'">
                                                        <xsl:attribute name="selected">true</xsl:attribute>
                                                </xsl:if>
                                            </menuitem>
                                            <menuitem id="semBdyRequestPaymentMethodTransfer" label="Transfer" value="TRF" >
                                                <xsl:if test="$requestPaymentMethod = 'TRF'">
                                                        <xsl:attribute name="selected">true</xsl:attribute>
                                                </xsl:if>
                                            </menuitem>
                                            <menuitem id="semBdyRequestPaymentMethodDirectDebit" label="Direct Debit" value="DD" >
                                                <xsl:if test="$requestPaymentMethod = 'DD'">
                                                        <xsl:attribute name="selected">true</xsl:attribute>
                                                </xsl:if>
                                            </menuitem>
                                            <menuitem id="semBdyRequestPaymentMethodPaymentCard" label="Payment Card" value="CARD" >
                                                <xsl:if test="$requestPaymentMethod = 'CARD'">
                                                        <xsl:attribute name="selected">true</xsl:attribute>
                                                </xsl:if>
                                            </menuitem>
                                        </menupopup>
                                    </menulist>
                                </row>
                                <row align="center" class="grid-row">
                                    <label id="semBdyRequestSubjectLabel" value="Intitulé"/>
                                    <textbox id="semBdyRequestSubject" flex="1" readonly="true">
                                        <xsl:attribute name="value">
                                            <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Complements/sem:Title"/>
                                        </xsl:attribute>
                                    </textbox>
                                </row>
                            </rows>
                        </grid>
                    </vbox>
                    <spacer flex="1"/>
                    </hbox>
                    <hbox id="semBdyOperations">
                        <button id="semBdyRefuseRequestButton" class="body-button" label="Refuser" oncommand="SMETHReadMessageController.handleReportButtonClick('missive_transition_RefusalReport_xml.xsl');"/>
                        <button id="semBdyAcceptRequestButton" class="body-button" label="Accepter le règlement" oncommand="SMETHReadMessageController.handleReportButtonClick('missive_transition_AcceptationReport_xml.xsl');"/>
                    </hbox>
                </vbox>
            </hbox>

    </xsl:template>

</xsl:stylesheet>