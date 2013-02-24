<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : requestToReport.xsl
    Created on : October 17, 2012, 11:02 AM
    Author     : Bishan Kumar Madhoo <bishan.madhoo@idsoft.mu>
    Description: Transform a SEPAMail request to a SEPAMail report
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
    xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sepamail.eu/xsd/bleedingEdge ../../../xsd/sepamail_message_test_SimpleTestRequest.xsd">
    <xsl:output method="xml" indent="yes" cdata-section-elements="sem:Data"/>

    <xsl:template match="/sem:Request">
        <xsl:variable name="rootElementName" select="local-name()"/>
        <xsl:if test="not('Request'=$rootElementName)">
            <xsl:message terminate="yes">Error : Unknown document</xsl:message>
        </xsl:if>
        <sem:Report xmlns:sem="http://www.sepamail.eu/xsd/bleedingEdge"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xsi:schemaLocation="http://www.sepamail.eu/xsd/bleedingEdge ../../../xsd/sepamail_message_test_SimpleTestReport.xsd">
            <xsl:for-each select="/sem:Request/*">
                <xsl:copy>
                    <xsl:apply-templates/>
                </xsl:copy>
            </xsl:for-each>
        </sem:Report>
    </xsl:template>

</xsl:stylesheet>
