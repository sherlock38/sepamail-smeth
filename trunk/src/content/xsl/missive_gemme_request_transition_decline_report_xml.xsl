<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : missive_gemme_request_transition_report_xml.xsl
    Created on : May 17, 2013, 12:38 PM
    Author     : Bishan Kumar Madhoo <bishan.madhoo@idsoft.mu>
    Description: Transform a SEPAMail GEMME mandate initiation request to an acceptance report
-->

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:p09="urn:iso:std:iso:20022:tech:xsd:pain.009.001.01"
        xmlns:p012="urn:iso:std:iso:20022:tech:xsd:pain.012.001.01"
        xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://xsd.sepamail.eu/1206/ ../xsd/sepamail_missive.xsd">

    <xsl:output method="xml" cdata-section-elements="sem:Data"/>

	<xsl:template match="/">
        <sem:Missive version="1206"
                xmlns:p09="urn:iso:std:iso:20022:tech:xsd:pain.009.001.01"
                xmlns:p012="urn:iso:std:iso:20022:tech:xsd:pain.012.001.01"
                xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xsi:schemaLocation="http://xsd.sepamail.eu/1206/ ../xsd/sepamail_missive.xsd">
            <sem:sepamail_missive_001>
                <sem:MsvId>
                    <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvId"/>
                </sem:MsvId>
                <sem:MsvTyp>
                    <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvTyp"/>
                </sem:MsvTyp>
                <sem:MsvOrd>
                    <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvOrd"/>
                </sem:MsvOrd>
                <sem:MsvPri>
                    <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvPri"/>
                </sem:MsvPri>
                <sem:MsvHdr>
                    <sem:Snd>
                        <sem:IBAN/>
                    </sem:Snd>
                    <sem:SndDtTm/>
                    <sem:Rcv>
                        <sem:IBAN/>
                    </sem:Rcv>
                </sem:MsvHdr>
                <sem:MsvBdy version="1206">
                    <sem:sepamail_message_001>
                        <sem:MsgHdr>
                            <sem:MsgId/>
                            <sem:MsgTyp>rapport@direct.debit</sem:MsgTyp>
                        </sem:MsgHdr>
                        <sem:MsgBdy>
                            <sem:DirectDebitMandateAcceptance>
                                <sem:sepamail_message_direct_debit_mandate_acceptance_001>
                                    <sem:Report>
                                        <p012:GrpHdr>
                                            <p012:MsgId/>
                                            <p012:CreDtTm/>
                                        </p012:GrpHdr>
                                        <p012:UndrlygAccptncDtls>
                                            <p012:OrgnlMsgInf>
                                                <p012:MsgId>
                                                    <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandat/sem:sepamail_message_direct_debit_mandat_001/sem:Mandat/p09:GrpHdr/p09:MsgId"/>
                                                </p012:MsgId>
                                                <p012:CreDtTm>
                                                    <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandat/sem:sepamail_message_direct_debit_mandat_001/sem:Mandat/p09:GrpHdr/p09:CreDtTm"/>
                                                </p012:CreDtTm>
                                            </p012:OrgnlMsgInf>
                                            <p012:AccptncRslt>
                                                <p012:Accptd>false</p012:Accptd>
                                                <p012:RjctRsn>
                                                    <p012:Cd/>
                                                </p012:RjctRsn>
                                                <p012:AddtlRjctRsnInf/>
                                            </p012:AccptncRslt>
                                            <p012:OrgnlMndt>
                                                <p012:OrgnlMndtId>
                                                    <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:DirectDebitMandat/sem:sepamail_message_direct_debit_mandat_001/sem:Mandat/p09:Mndt/p09:MndtId"/>
                                                </p012:OrgnlMndtId>
                                            </p012:OrgnlMndt>
                                        </p012:UndrlygAccptncDtls>
                                    </sem:Report>
                                </sem:sepamail_message_direct_debit_mandate_acceptance_001>
                            </sem:DirectDebitMandateAcceptance>
                        </sem:MsgBdy>
                    </sem:sepamail_message_001>
                </sem:MsvBdy>
            </sem:sepamail_missive_001>
        </sem:Missive>
	</xsl:template>
</xsl:stylesheet>