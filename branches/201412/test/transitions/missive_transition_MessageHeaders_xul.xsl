<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : missive_transition_MessageHeaders.xsl
    Created on : October 24, 2012, 4:16 PM
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

		<xsl:variable name="senderQXBAN">
			<xsl:value-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvHdr/sem:Snd/sem:IBAN" disable-output-escaping="yes"/>
		</xsl:variable>

		<xsl:variable name="senderName">
			<xsl:value-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:Dbtr/pain013:Nm" disable-output-escaping="yes"/>
		</xsl:variable>

		<xsl:variable name="receiverQXBAN">
			<xsl:value-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvHdr/sem:Rcv/sem:IBAN" disable-output-escaping="yes"/>
		</xsl:variable>

		<xsl:variable name="receiverName">
			<xsl:value-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:CdtTrfTx/pain013:Cdtr/pain013:Nm" disable-output-escaping="yes"/>
		</xsl:variable>

        <hbox id="missiveHeaderBox">
            <vbox flex="1">
                <data id="sendSndDtTm"><xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvHdr/sem:SndDtTm"/></data>
                <data id="msgExpiry"><xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgHdr/sem:MsgExpiry"/></data>
                <hbox id="semHdrSummary" collapsed="false">
                    <box align="start" class="semModeToggleParentContainer" pack="center">
                        <box align="center" class="semModeToggleContainer" pack="center">
                            <image id="semHdrExpandButton" class="link-image" height="12" width="12">
                                <xsl:attribute name="src">
                                    <xsl:text disable-output-escaping="yes">chrome://smeth/skin/images/expand.png</xsl:text>
                                </xsl:attribute>
                                <xsl:attribute name="onclick">
                                    <xsl:text disable-output-escaping="yes">document.getElementById('semHdrSummary').collapsed=true;document.getElementById('semHdrDetails').collapsed=false; event.stopPropagation();</xsl:text>
                                </xsl:attribute>
                            </image>
                        </box>
                    </box>
                    <grid>
                        <columns>
                            <column/>
                            <column/>
                        </columns>
                        <rows>
                            <row align="center" class="grid-row">
                                <label id="semHdrSummaryMessageTypeLabel" value="Type de message"/>
                                <label id="semHdrSummaryMessageTypeValue">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgHdr/sem:MsgTyp"/>
                                    </xsl:attribute>
                                </label>
                            </row>
                        </rows>
                    </grid>
                    <spacer flex="1"/>
                    <grid>
                        <columns>
                            <column/>
                            <column/>
                        </columns>
                        <rows>
                            <row align="center" class="grid-row">
                                <label id="semHdrSummarySenderLabel" value="Expéditeur"/>
                                <label id="semHdrSummarySenderValue" class="left-align" flex="1">
                                	<xsl:attribute name="value"><xsl:if test="string-length($senderName) > 0"><xsl:value-of select="$senderName"/><xsl:text>&#160;</xsl:text></xsl:if><xsl:if test="string-length($senderQXBAN) > 0">QXBAN <xsl:value-of select="$senderQXBAN"/></xsl:if></xsl:attribute>
                                </label>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semHdrSummarySentLabel" value="Envoyé"/>
                                <label id="semHdrSummarySentValue" class="left-align" value="" flex="1"/>
                            </row>
                        </rows>
                    </grid>
                </hbox>
                <hbox id="semHdrDetails" collapsed="true">
                    <box align="start" class="semModeToggleParentContainer" pack="center">
                        <box align="center" class="semModeToggleContainer" pack="center">
                            <image id="semHdrCollapseButton" class="link-image" height="12" width="12">
                                <xsl:attribute name="src">
                                    <xsl:text disable-output-escaping="yes">chrome://smeth/skin/images/collapse.png</xsl:text>
                                </xsl:attribute>
                                <xsl:attribute name="onclick">
                                    <xsl:text disable-output-escaping="yes">document.getElementById('semHdrSummary').collapsed=false;document.getElementById('semHdrDetails').collapsed=true; event.stopPropagation();</xsl:text>
                                </xsl:attribute>
                            </image>
                        </box>
                    </box>
                    <grid>
                        <columns>
                            <column/>
                            <column/>
                        </columns>
                        <rows>
                            <row align="center" class="grid-row">
                                <label id="semHdrDetailsMessageTypeLabel" value="Type de message"/>
                                <label id="semHdrDetailsMessageTypeValue">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgHdr/sem:MsgTyp"/>
                                    </xsl:attribute>
                                </label>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semHdrDetailsSenderLabel" value="Expéditeur"/>
                                <label id="semHdrDetailsSenderValue">
                                	<xsl:attribute name="value"><xsl:if test="string-length($senderName) > 0"><xsl:value-of select="$senderName"/><xsl:text>&#160;</xsl:text></xsl:if><xsl:if test="string-length($senderQXBAN) > 0">QXBAN <xsl:value-of select="$senderQXBAN"/></xsl:if></xsl:attribute>
                                </label>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semHdrDetailsReceiverLabel" value="Destinataire"/>
                                <label id="semHdrDetailsReceiverValue">
                                	<xsl:attribute name="value"><xsl:if test="string-length($receiverName) > 0"><xsl:value-of select="$receiverName"/><xsl:text>&#160;</xsl:text></xsl:if><xsl:if test="string-length($receiverQXBAN) > 0">QXBAN <xsl:value-of select="$receiverQXBAN"/></xsl:if></xsl:attribute>
                                </label>
                            </row>
                        </rows>
                    </grid>
                    <spacer flex="1"/>
                    <grid>
                        <columns>
                            <column/>
                            <column/>
                        </columns>
                        <rows>
                            <row align="center" class="grid-row">
                                <label id="semHdrDetailsPriorityLabel" value="Priorité"/>
                                <label id="semHdrDetailsPriorityValue" class="left-align" flex="1">
                                    <xsl:attribute name="value">
                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvPri"/>
                                    </xsl:attribute>
                                </label>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semHdrDetailsSentLabel" value="Envoyé"/>
                                <label id="semHdrDetailsSentValue" class="left-align" value="" flex="1"/>
                            </row>
                            <row align="center" class="grid-row">
                                <label id="semHdrDetailsDistributedLabel" value="Distribué"/>
                                <label id="semHdrDetailsDistributedValue" class="left-align" value="" flex="1"/>
                            </row>
                        </rows>
                    </grid>
                </hbox>
            </vbox>
        </hbox>

    </xsl:template>

</xsl:stylesheet>
