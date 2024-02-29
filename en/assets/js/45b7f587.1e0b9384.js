"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[2201],{3905:(e,n,i)=>{i.d(n,{Zo:()=>u,kt:()=>m});var r=i(7294);function t(e,n,i){return n in e?Object.defineProperty(e,n,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[n]=i,e}function a(e,n){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),i.push.apply(i,r)}return i}function l(e){for(var n=1;n<arguments.length;n++){var i=null!=arguments[n]?arguments[n]:{};n%2?a(Object(i),!0).forEach((function(n){t(e,n,i[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):a(Object(i)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(i,n))}))}return e}function o(e,n){if(null==e)return{};var i,r,t=function(e,n){if(null==e)return{};var i,r,t={},a=Object.keys(e);for(r=0;r<a.length;r++)i=a[r],n.indexOf(i)>=0||(t[i]=e[i]);return t}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)i=a[r],n.indexOf(i)>=0||Object.prototype.propertyIsEnumerable.call(e,i)&&(t[i]=e[i])}return t}var d=r.createContext({}),s=function(e){var n=r.useContext(d),i=n;return e&&(i="function"==typeof e?e(n):l(l({},n),e)),i},u=function(e){var n=s(e.components);return r.createElement(d.Provider,{value:n},e.children)},c="mdxType",p={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},g=r.forwardRef((function(e,n){var i=e.components,t=e.mdxType,a=e.originalType,d=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),c=s(i),g=t,m=c["".concat(d,".").concat(g)]||c[g]||p[g]||a;return i?r.createElement(m,l(l({ref:n},u),{},{components:i})):r.createElement(m,l({ref:n},u))}));function m(e,n){var i=arguments,t=n&&n.mdxType;if("string"==typeof e||t){var a=i.length,l=new Array(a);l[0]=g;var o={};for(var d in n)hasOwnProperty.call(n,d)&&(o[d]=n[d]);o.originalType=e,o[c]="string"==typeof e?e:t,l[1]=o;for(var s=2;s<a;s++)l[s]=i[s];return r.createElement.apply(null,l)}return r.createElement.apply(null,i)}g.displayName="MDXCreateElement"},6732:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>d,contentTitle:()=>l,default:()=>p,frontMatter:()=>a,metadata:()=>o,toc:()=>s});var r=i(7462),t=(i(7294),i(3905));const a={sidebar_position:1},l="Teilnehmer einladen",o={unversionedId:"guide/Handbuch/Session anlegen/Teilnehmer_einladen",id:"guide/Handbuch/Session anlegen/Teilnehmer_einladen",title:"Teilnehmer einladen",description:"guide-erste-schritte-teilnehmer}",source:"@site/docs/guide/02-Handbuch/02-Session anlegen/04-Teilnehmer_einladen.md",sourceDirName:"guide/02-Handbuch/02-Session anlegen",slug:"/guide/Handbuch/Session anlegen/Teilnehmer_einladen",permalink:"/koala-app/en/docs/guide/Handbuch/Session anlegen/Teilnehmer_einladen",draft:!1,editUrl:"https://github.com/KoALa-MHF/koala-app/tree/main/website/docs/guide/02-Handbuch/02-Session anlegen/04-Teilnehmer_einladen.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"guideSidebar",previous:{title:"Marker erstellen",permalink:"/koala-app/en/docs/guide/Handbuch/Session anlegen/Marker_erstellen"},next:{title:"Session verwalten",permalink:"/koala-app/en/docs/guide/Handbuch/Sessionverwaltung"}},d={},s=[{value:"Einladung per Link oder QR-Code",id:"einladung-per-link-oder-qr-code",level:2},{value:"Einladung per Email",id:"einladung-per-email",level:2}],u={toc:s},c="wrapper";function p(e){let{components:n,...i}=e;return(0,t.kt)(c,(0,r.Z)({},u,i,{components:n,mdxType:"MDXLayout"}),(0,t.kt)("h1",{id:"guide-erste-schritte-teilnehmer"},"Teilnehmer einladen"),(0,t.kt)("p",null,"Jede Session in koala hat einen eigenen 7-stelligen Code, der auf der Startseite der App eingegeben werden kann. Dieser Code ist der Schl\xfcssel zur Session f\xfcr alle Teilnehmer","*","innen."),(0,t.kt)("p",null,"Um diesen Code zu verteilen bietet ",(0,t.kt)("em",{parentName:"p"},"Koala")," drei M\xf6glichkeiten."),(0,t.kt)("h2",{id:"einladung-per-link-oder-qr-code"},"Einladung per Link oder QR-Code"),(0,t.kt)("p",null,"In der Session\xfcbersicht k\xf6nnen Sie auf den Button in der Spalte Link/QRCode klicken. Es \xf6ffnet sich ein Fenster in dem sowohl ein QRCode als auch ein Link angezeigt werden. Beide k\xf6nnen genutzt werden um an Teilnehmer","*","innen verschickt zu werden. Der QR-Code bietet den Vorteil, dass der Code nicht abgeschrieben werden muss, der Link eignet sich gut zum Verschicken, wenn die Teilnehmer","*","innen auf ihn klicken k\xf6nnen."),(0,t.kt)("h2",{id:"einladung-per-email"},"Einladung per Email"),(0,t.kt)("p",null,"Au\xdferdem k\xf6nnen Sie in den Sessioneinstellungen neue Mitglieder hinzuf\xfcgen, indem Sie Einladungslinks per Email versenden."),(0,t.kt)("p",null,"Sie sehen hier auch eine Liste aller Mitglieder der Session. Hier k\xf6nnen Sie Mitglieder durch das Eingeben der Email-Adresse hinzuf\xfcgen und auch wieder l\xf6schen.\nAu\xdferdem k\xf6nnen Sie eine Nachricht an die eingeladenen Personen einf\xfcgen, die mit dem Einladungslink versendet wird. Wenn Sie keine eigene Nachricht hinzuf\xfcgen wird folgende vorgefertigte Nachricht versendet:"),(0,t.kt)("blockquote",null,(0,t.kt)("p",{parentName:"blockquote"},'"Sie wurden von ',"[Ihr Name]"," zur koala-Session ","[Titel der Session]"," eingeladen.\nBitte klicken Sie auf den folgenden Link, um der Session beizutreten: ","[","Session-Link","]",'"')))}p.isMDXComponent=!0}}]);