<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : requestToReport.xsl
    Created on : November 08, 2012, 10:31 AM
    Author     : Ammit Heeramun <ammit.heeramun@idsoft.mu>
    Description: Transform a SEPAMail simple test request to a SEPAMail simple test report
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1206"
        xmlns:pain013="urn:iso:std:iso:20022:tech:xsd:pain.013.001.01"
        xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sepamail.eu/xsd/bleedingEdge ../../xsd/sepamail_missive.xsd">

    <xsl:output method="xml" cdata-section-elements="sem:Data"/>

    <xsl:template match="/">
        <sem:Missive version="1206"
                xmlns:pain013="urn:iso:std:iso:20022:tech:xsd:pain.013.001.01"
                xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xsi:schemaLocation="http://www.sepamail.eu/xsd/bleedingEdge ../../xsd/sepamail_missive.xsd">
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
                        <sem:IBAN>
                            <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvHdr/sem:Rcv/sem:IBAN"/>
                        </sem:IBAN>
                    </sem:Snd>
                    <sem:SndDtTm/>
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
                            <sem:MsgTyp>simple.report@test</sem:MsgTyp>
                            <sem:MsgExpiry>
                                <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgHdr/sem:MsgExpiry"/>
                            </sem:MsgExpiry>
                        </sem:MsgHdr>
                        <sem:MsgBdy>
                            <sem:SimpleTestReport>
                                <sem:TestId>
                                    <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:SimpleTestRequest/sem:TestId"/>
                                </sem:TestId>
                                <xsl:for-each select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:SimpleTestRequest/sem:Text">
                                    <sem:Text>
                                        <xsl:value-of disable-output-escaping="yes" select="."/>
                                    </sem:Text>
                                </xsl:for-each>
                                <xsl:for-each select="/sem:Missive/sem:sepamail_missive_001/sem:MsvBdy/sem:sepamail_message_001/sem:MsgBdy/sem:SimpleTestRequest/sem:Data">
                                    <sem:Data>
                                        <xsl:value-of disable-output-escaping="yes" select="."/>
                                    </sem:Data>
                                </xsl:for-each>
                            </sem:SimpleTestReport>
                        </sem:MsgBdy>
                    </sem:sepamail_message_001>
                </sem:MsvBdy>
            </sem:sepamail_missive_001>
        </sem:Missive>
    </xsl:template>
</xsl:stylesheet>
