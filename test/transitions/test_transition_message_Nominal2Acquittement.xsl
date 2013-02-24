<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : test_transition_message_Nominal2Acquittement.xsl
    Created on : October 18, 2012, 9:20 AM
    Author     : Bishan Kumar Madhoo <bishan.madhoo@idsoft.mu>
    Description: Transforming a nominal XML to an acknowledgement message
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
    xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sepamail.eu/xsd/bleedingEdge ../../xsd/sepamail_missive.xsd">

    <xsl:output method="xml" indent="yes"/>

    <!-- Current date and time in required format using java.util.Calendar -->
	<xsl:template name="currentDateTime" xmlns:cal="xalan://java.util.Calendar">
		<xsl:variable name="now" select="cal:getInstance()"/>
		<xsl:variable name="year" select="substring-before(substring-after($now, 'YEAR='), ',')"/>
		<xsl:variable name="month" select="substring-before(substring-after($now, 'MONTH='), ',') + 1"/>
		<xsl:variable name="date" select="substring-before(substring-after($now, 'DAY_OF_MONTH='), ',')"/>
		<xsl:variable name="hour" select="substring-before(substring-after($now, 'HOUR_OF_DAY='), ',')"/>
		<xsl:variable name="minutes" select="substring-before(substring-after($now, 'MINUTE='), ',')"/>
		<xsl:variable name="seconds" select="substring-before(substring-after($now, 'SECOND='), ',')"/>

		<xsl:value-of
			select="$year"/>-<xsl:if test="string-length($month) = 1"
			><xsl:value-of select="0"/></xsl:if><xsl:value-of
			select="$month"/>-<xsl:if test="string-length($date) = 1"
			><xsl:value-of select="0"/></xsl:if><xsl:value-of
			select="$date"/>T<xsl:if test="string-length($hour) = 1"
			><xsl:value-of select="0"/></xsl:if><xsl:value-of
			select="$hour"/>:<xsl:if test="string-length($minutes) = 1"
			><xsl:value-of select="0"/></xsl:if><xsl:value-of
			select="$minutes"/>:<xsl:if test="string-length($seconds) = 1"
			><xsl:value-of select="0"/></xsl:if><xsl:value-of
			select="$seconds"/>
	</xsl:template>

    <xsl:template match="sem:sepamail_missive_001">
        <sem:MsvId><xsl:apply-templates select="sem:MsvId"/></sem:MsvId>
        <sem:MsvTyp>Acquittement</sem:MsvTyp>
        <sem:MsvOrd><xsl:apply-templates select="sem:MsvOrd"/></sem:MsvOrd>
        <sem:MsvPri><xsl:apply-templates select="sem:MsvPri"/></sem:MsvPri>
        <sem:MsvHdr>
            <sem:Snd>
                <sem:IBAN>
                    <xsl:apply-templates select="sem:MsvHdr/sem:Rcv/sem:IBAN"/>
                </sem:IBAN>
            </sem:Snd>
            <sem:SndDtTm><xsl:call-template name="currentDateTime"/></sem:SndDtTm>
            <sem:Rcv>
                <sem:IBAN>
                    <xsl:apply-templates select="sem:MsvHdr/sem:Snd/sem:IBAN"/>
                </sem:IBAN>
            </sem:Rcv>
        </sem:MsvHdr>
        <sem:MsvAcq>
            <sem:AcqSta>ACK</sem:AcqSta>
        </sem:MsvAcq>
    </xsl:template>

    <xsl:template match="/">
        <sem:Missive version="1206"
            xmlns:pain013="urn:iso:std:iso:20022:tech:xsd:pain.013.001.01"
            xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://www.sepamail.eu/xsd/bleedingEdge ../../xsd/sepamail_missive.xsd">
            <sem:sepamail_missive_001>
                <xsl:apply-templates/>
            </sem:sepamail_missive_001>
        </sem:Missive>
    </xsl:template>

</xsl:stylesheet>
