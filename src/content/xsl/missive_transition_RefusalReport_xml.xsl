<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : requestToReport.xsl
    Created on : November 08, 2012, 11:08 AM
    Author     : Ammit Heeramun <ammit.heeramun@idsoft.mu>
    Description: Transform a SEPAMail request to a SEPAMail report
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1206"
                xmlns:pain014="urn:iso:std:iso:20022:tech:xsd:pain.014.001.01"
                xmlns:pain013="urn:iso:std:iso:20022:tech:xsd:pain.013.001.01"
                xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xsi:schemaLocation="http://www.sepamail.eu/xsd/bleedingEdge ../../xsd/sepamail_missive.xsd"
                xmlns:ex="http://exslt.org/dates-and-times"
                extension-element-prefixes="ex">
            
    <xsl:output method="xml" indent="yes"/>
    
    <xsl:template match="/">
        <xsl:variable name="currentDateTime" select="ex:date-time()"/>
        <xsl:variable name="immPmtProposed" select="//sem:ImmPmtProposed"/>
        <sem:Missive xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1206"
                     xmlns:pain014="urn:iso:std:iso:20022:tech:xsd:pain.014.001.01"
                     xmlns:pain013="urn:iso:std:iso:20022:tech:xsd:pain.013.001.01"
                     xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xsi:schemaLocation="http://www.sepamail.eu/xsd/bleedingEdge ../../xsd/sepamail_missive.xsd"
                     xmlns:ex="http://exslt.org/dates-and-times"
                     extension-element-prefixes="ex">
            <sem:sepamail_missive_001>
                <sem:MsvId>
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
                        <sem:IBAN>
                            <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvHdr/sem:Rcv/sem:IBAN"/>
                        </sem:IBAN>
                    </sem:Snd>
                    <sem:SndDtTm><xsl:value-of select="$currentDateTime"/></sem:SndDtTm>
                    <sem:Rcv>
                        <sem:IBAN>
                            <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvHdr/sem:Snd/sem:IBAN"/>
                        </sem:IBAN>
                    </sem:Rcv>
                </sem:MsvHdr>
                <sem:MsvBdy version="1206">
                    <sem:sepamail_message_001>
                        <sem:MsgHdr>
                            <sem:MsgId>
                                <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgHdr/sem:MsgId"/>
                            </sem:MsgId>
                            <sem:MsgTyp>activation.report@payment.activation</sem:MsgTyp>
                            <sem:MsgExpiry>
                                <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgHdr/sem:MsgExpiry"/>
                            </sem:MsgExpiry>
                        </sem:MsgHdr>
                        <sem:MsgBdy>
                        <sem:ActivationReport>
                            <sem:Header>
                                    <sem:CreDtTm><xsl:value-of select="$currentDateTime"/></sem:CreDtTm>
                                    <sem:NbOfReports></sem:NbOfReports>
                            </sem:Header>
                            <sem:RepCompl>
                                <sem:Report>
                                    <pain014:GrpHdr>
                                        <pain014:MsgId> 
                                        </pain014:MsgId>
                                        <pain014:CreDtTm><xsl:value-of select="$currentDateTime"/></pain014:CreDtTm>
                                        <pain014:InitgPty>
                                            <pain014:Nm>
                                            </pain014:Nm>
                                        </pain014:InitgPty>
                                        <pain014:DbtrAgt>
                                            <pain014:FinInstnId>
                                                    <pain014:BICFI>
                                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:DbtrAgt/pain013:FinInstnId/pain013:BICFI"/>
                                                    </pain014:BICFI>
                                            </pain014:FinInstnId>
                                        </pain014:DbtrAgt>
                                        <pain014:CdtrAgt>
                                            <pain014:FinInstnId>
                                                    <pain014:BICFI>
                                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:CdtTrfTx/pain013:CdtrAgt/pain013:FinInstnId/pain013:BICFI"/>
                                                    </pain014:BICFI>
                                            </pain014:FinInstnId>
                                        </pain014:CdtrAgt>
                                    </pain014:GrpHdr>
                                    <pain014:OrgnlGrpInfAndSts>
                                            <pain014:OrgnlMsgId>
                                                <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:GrpHdr/pain013:MsgId"/>
                                            </pain014:OrgnlMsgId>
                                            <pain014:OrgnlMsgNmId>pain.013.001.01</pain014:OrgnlMsgNmId>
                                            <pain014:OrgnlCreDtTm>
                                                <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:GrpHdr/pain013:CreDtTm"/>
                                            </pain014:OrgnlCreDtTm>
                                            <pain014:OrgnlNbOfTxs>
                                                <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:GrpHdr/pain013:NbOfTxs"/>
                                            </pain014:OrgnlNbOfTxs>
                                            <pain014:OrgnlCtrlSum>
                                                <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:GrpHdr/pain013:CtrlSum"/>
                                            </pain014:OrgnlCtrlSum>
                                    </pain014:OrgnlGrpInfAndSts>
                                    <pain014:OrgnlPmtInfAndSts>
                                            <pain014:OrgnlPmtInfId>
                                                <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:PmtInfId"/>
                                            </pain014:OrgnlPmtInfId>
                                            <pain014:TxInfAndSts>
                                                    <pain014:OrgnlInstrId>
                                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:CdtTrfTx/pain013:PmtId/pain013:InstrId"/>
                                                    </pain014:OrgnlInstrId>
                                                    <pain014:OrgnlEndToEndId>
                                                        <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:CdtTrfTx/pain013:PmtId/pain013:EndToEndId"/>
                                                    </pain014:OrgnlEndToEndId>
                                                    <pain014:TxSts>RJCT</pain014:TxSts> 
                                                    <pain014:OrgnlTxRef>
                                                            <pain014:Amt>
                                                                <pain014:InstdAmt Ccy="EUR">
                                                                    <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:CdtTrfTx/pain013:Amt/pain013:InstdAmt"/>
                                                                </pain014:InstdAmt>
                                                            </pain014:Amt>
                                                            <pain014:ReqdColltnDt>
                                                                <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:ReqdExctnDt"/>
                                                            </pain014:ReqdColltnDt>
                                                            <pain014:ReqdExctnDt>
                                                                <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:ReqdExctnDt"/>
                                                            </pain014:ReqdExctnDt>
                                                            <pain014:PmtTpInf>
                                                                <pain014:CtgyPurp>
                                                                    <xsl:copy-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:PmtTpInf/node()"/>
                                                                </pain014:CtgyPurp>
                                                            </pain014:PmtTpInf>
                                                            <pain014:PmtMtd>
                                                                <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:PmtMtd"/>
                                                            </pain014:PmtMtd>
                                                            <pain014:RmtInf>
                                                                <xsl:copy-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:CdtTrfTx/pain013:RmtInf/node()"/>
                                                            </pain014:RmtInf>
                                                            <pain014:UltmtDbtr>
                                                                <xsl:copy-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:UltmtDbtr/node()"/>
                                                            </pain014:UltmtDbtr>
                                                            <pain014:Dbtr>
                                                                <xsl:copy-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:Dbtr/node()"/>
                                                            </pain014:Dbtr>
                                                            <pain014:DbtrAcct>
                                                                <xsl:copy-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:DbtrAcct/node()"/>
                                                            </pain014:DbtrAcct>
                                                            <pain014:DbtrAgt>
                                                                <xsl:copy-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:DbtrAgt/node()"/>
                                                            </pain014:DbtrAgt>
                                                            <pain014:CdtrAgt>
                                                                <xsl:copy-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:CdtrAgt/node()"/>
                                                            </pain014:CdtrAgt>
                                                            <pain014:Cdtr>
                                                                <xsl:copy-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:Cdtr/node()"/>
                                                            </pain014:Cdtr>
                                                            <pain014:CdtrAcct>
                                                                <xsl:copy-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:CdtrAcct/node()"/>
                                                            </pain014:CdtrAcct>
                                                            <pain014:UltmtCdtr>
                                                                <xsl:copy-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Request/pain013:PmtInf/pain013:UltmtCdtr/node()"/>
                                                            </pain014:UltmtCdtr>
                                                    </pain014:OrgnlTxRef>
                                            </pain014:TxInfAndSts>
                                    </pain014:OrgnlPmtInfAndSts>
                                </sem:Report>
                                <sem:Complements>
                                    <xsl:if test="$immPmtProposed = 'false'">
                                        <sem:ImmPmt>false</sem:ImmPmt>
                                    </xsl:if>
                                    <xsl:if test="not($immPmtProposed = 'false')">
                                        <sem:ImmPmt>true</sem:ImmPmt>
                                    </xsl:if>
                                    <xsl:copy-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Complements/sem:TrfNature"/>
                                    <xsl:copy-of select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:ActivationRequest/sem:ReqCompl/sem:Complements/sem:CustRef"/>
                                </sem:Complements>
                            </sem:RepCompl>
                        </sem:ActivationReport>
                        </sem:MsgBdy>
                    </sem:sepamail_message_001>
                </sem:MsvBdy>
            </sem:sepamail_missive_001>
        </sem:Missive>
    </xsl:template>
</xsl:stylesheet>