<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document    : missive_transition_Acknowledgement.xsl
    Created on  : November 14, 2012, 4:16 PM
    Version     : based on standard version 1206
    Author      : Bishan Kumar Madhoo <bishan.madhoo@idsoft.mu>
    Description : Transforming a nominal missive to a aknowledgment missive
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
    xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sepamail.eu/xsd/bleedingEdge ../../../../xsd/sepamail_missive.xsd">

    <xsl:output method="xml" omit-xml-declaration="yes"/>

    <xsl:template match="/">
        <sem:Missive version="1206"
            xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://www.sepamail.eu/xsd/bleedingEdge ../../xsd/sepamail_missive.xsd">
            <sem:sepamail_missive_001>
                <sem:MsvId>
                    <xsl:value-of disable-output-escaping="yes" select="/sem:Missive/sem:sepamail_missive_001/sem:MsvId"/>
                </sem:MsvId>
                <sem:MsvTyp>Acquittement</sem:MsvTyp>
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
                    <sem:SndDtTm></sem:SndDtTm>
                    <sem:Rcv>
                        <sem:IBAN/>
                    </sem:Rcv>
                </sem:MsvHdr>
                <sem:MsvAcq>
                    <sem:AcqSta>ACK</sem:AcqSta>
                    <sem:AcqChk></sem:AcqChk>
                </sem:MsvAcq>
            </sem:sepamail_missive_001>
        </sem:Missive>
    </xsl:template>

</xsl:stylesheet>