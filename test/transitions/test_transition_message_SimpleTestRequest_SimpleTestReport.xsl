<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : requestToReport.xsl
    Created on : November 08, 2012, 10:31 AM
    Author     : Ammit Heeramun <ammit.heeramun@idsoft.mu>
    Description: Transform a SEPAMail simple test request to a SEPAMail simple test report
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1206"
        xmlns:pain013="urn:iso:std:iso:20022:tech:xsd:pain.013.001.01"
        xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sepamail.eu/xsd/bleedingEdge ../../xsd/sepamail_missive.xsd">
            
    <xsl:output method="xml" cdata-section-elements="sem:Data"/>
    
    <xsl:template match="/">
        <sem:Report>
            <sem:TestId><xsl:value-of disable-output-escaping="yes" select="/sem:Request/sem:TestId"/></sem:TestId>
            <sem:Text><xsl:value-of disable-output-escaping="yes" select="/sem:Request/sem:Text"/></sem:Text>
            <sem:Data><xsl:value-of disable-output-escaping="yes" select="/sem:Request/sem:Data"/></sem:Data>
        </sem:Report>
    </xsl:template>

</xsl:stylesheet>
