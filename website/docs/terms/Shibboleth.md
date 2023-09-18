---
id: shibboleth
title: Shibboleth
hoverText: Sicherheitsprotokoll zur Authentifizierung und Autorisierung von Benutzern in verteilten Netzwerken und Web-Anwendungen
---

Um sich bei *koala* anzumelden, wird das Shibboleth-Verfahren zur Authentifizierung verwendet. Dabei handelt es sich um ein Sicherheitsprotokoll, das den Zugriff auf die Anwendung sicher und geschützt macht.

Wenn Sie sich bei *koala* anmelden möchten, werden Sie möglicherweise auf eine separate Login-Seite weitergeleitet, auf der Sie Ihre Zugangsdaten eingeben. Anstatt ein neues Benutzerkonto zu erstellen, können Sie in vielen Fällen Ihr bestehendes Konto einer anderen vertrauenswürdigen Organisation verwenden, wie zum Beispiel einer Universität oder einer Forschungseinrichtung.

Sobald Sie Ihre Anmeldedaten eingegeben haben, leitet Sie die Web-App automatisch an Ihren Identity Provider (IdP) weiter. Der IdP ist die Organisation, die Ihre Identität überprüft und bestätigt. Dort werden Sie möglicherweise aufgefordert, sich erneut anzumelden, um Ihre Identität zu verifizieren.

Sobald der IdP Ihre Identität bestätigt hat, erhalten Sie ein sogenanntes SAML-Token, das eine digitale Signatur enthält und Informationen über Ihre Berechtigungen und Attribute enthält. Dieses Token wird dann sicher an die Web-App zurückgegeben.

*koala* überprüft das SAML-Token und authentifiziert Sie auf Basis der darin enthaltenen Informationen. Wenn alles erfolgreich verläuft, werden Sie in die Web-App weitergeleitet und können die angebotenen Funktionen und Dienste nutzen.

Die Verwendung von Shibboleth bietet Ihnen mehrere Vorteile, wie zum Beispiel die Verwendung eines einzigen Anmeldevorgangs (Single Sign-On) für verschiedene Dienste, den Schutz Ihrer persönlichen Daten und die sichere Bereitstellung von Ressourcen. Es ermöglicht auch die nahtlose Integration mit anderen Organisationen, die das Shibboleth-Verfahren unterstützen.
