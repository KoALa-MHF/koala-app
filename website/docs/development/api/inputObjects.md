---
id: inputObjects
title: Input objects
slug: inputObjects
sidebar_position: 8
---

## AuthenticateSessionInput

<p style={{ marginBottom: "0.4em" }}><strong>Arguments</strong></p>

<table>
<thead><tr><th>Name</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>
code<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String!</code></a>
</td>
<td>
<p>Session Code</p>
</td>
</tr>
</tbody>
</table>

## AuthenticateUserSessionInput

<p style={{ marginBottom: "0.4em" }}><strong>Arguments</strong></p>

<table>
<thead><tr><th>Name</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>
code<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String!</code></a>
</td>
<td>
<p>User Session Code</p>
</td>
</tr>
</tbody>
</table>

## CreateAnnotationInput

<p style={{ marginBottom: "0.4em" }}><strong>Arguments</strong></p>

<table>
<thead><tr><th>Name</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>
start<br />
<a href="/koala-app/docs/development/api/scalars#int"><code>Int!</code></a>
</td>
<td>
<p>Annotation Start Seconds</p>
</td>
</tr>
<tr>
<td>
end<br />
<a href="/koala-app/docs/development/api/scalars#int"><code>Int</code></a>
</td>
<td>
<p>Annotation End Seconds</p>
</td>
</tr>
<tr>
<td>
markerId<br />
<a href="/koala-app/docs/development/api/scalars#int"><code>Int!</code></a>
</td>
<td>
<p>Associated Marker</p>
</td>
</tr>
<tr>
<td>
userSessionId<br />
<a href="/koala-app/docs/development/api/scalars#int"><code>Int!</code></a>
</td>
<td>
<p>Associated User Session</p>
</td>
</tr>
<tr>
<td>
note<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String</code></a>
</td>
<td>
<p>Annotation Note</p>
</td>
</tr>
</tbody>
</table>

## CreateMarkerInput

<p style={{ marginBottom: "0.4em" }}><strong>Arguments</strong></p>

<table>
<thead><tr><th>Name</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>
type<br />
<a href="/koala-app/docs/development/api/enums#markertype"><code>MarkerType!</code></a>
</td>
<td>
<p>Marker Type</p>
</td>
</tr>
<tr>
<td>
name<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String!</code></a>
</td>
<td>
<p>Marker Name</p>
</td>
</tr>
<tr>
<td>
abbreviation<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String</code></a>
</td>
<td>
<p>Marker Name Abbreviation (e.g. for small screen sizes</p>
</td>
</tr>
<tr>
<td>
description<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String</code></a>
</td>
<td>
<p>Marker Descritpion</p>
</td>
</tr>
<tr>
<td>
color<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String</code></a>
</td>
<td>
<p>Marker Color</p>
</td>
</tr>
<tr>
<td>
icon<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String</code></a>
</td>
<td>
<p>Marker Icon</p>
</td>
</tr>
</tbody>
</table>

## CreateMediaInput

<p style={{ marginBottom: "0.4em" }}><strong>Arguments</strong></p>

<table>
<thead><tr><th>Name</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>
file<br />
<a href="/koala-app/docs/development/api/scalars#upload"><code>Upload!</code></a>
</td>
<td>

</td>
</tr>
</tbody>
</table>

## CreateSessionInput

<p style={{ marginBottom: "0.4em" }}><strong>Arguments</strong></p>

<table>
<thead><tr><th>Name</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>
name<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String!</code></a>
</td>
<td>

</td>
</tr>
<tr>
<td>
description<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String</code></a>
</td>
<td>

</td>
</tr>
<tr>
<td>
status<br />
<a href="/koala-app/docs/development/api/enums#sessionstatus"><code>SessionStatus</code></a>
</td>
<td>

</td>
</tr>
<tr>
<td>
start<br />
<a href="/koala-app/docs/development/api/scalars#datetime"><code>DateTime</code></a>
</td>
<td>

</td>
</tr>
<tr>
<td>
end<br />
<a href="/koala-app/docs/development/api/scalars#datetime"><code>DateTime</code></a>
</td>
<td>

</td>
</tr>
<tr>
<td>
editable<br />
<a href="/koala-app/docs/development/api/scalars#boolean"><code>Boolean</code></a>
</td>
<td>

</td>
</tr>
<tr>
<td>
enablePlayer<br />
<a href="/koala-app/docs/development/api/scalars#boolean"><code>Boolean</code></a>
</td>
<td>

</td>
</tr>
<tr>
<td>
displaySampleSolution<br />
<a href="/koala-app/docs/development/api/scalars#boolean"><code>Boolean</code></a>
</td>
<td>

</td>
</tr>
<tr>
<td>
enableLiveAnalysis<br />
<a href="/koala-app/docs/development/api/scalars#boolean"><code>Boolean</code></a>
</td>
<td>

</td>
</tr>
<tr>
<td>
mediaId<br />
<a href="/koala-app/docs/development/api/scalars#int"><code>Int</code></a>
</td>
<td>
<p>Assigned Media</p>
</td>
</tr>
</tbody>
</table>

## CreateUserInput

<p style={{ marginBottom: "0.4em" }}><strong>Arguments</strong></p>

<table>
<thead><tr><th>Name</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>
email<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String</code></a>
</td>
<td>
<p>User Email</p>
</td>
</tr>
</tbody>
</table>

## CreateUserSessionInput

<p style={{ marginBottom: "0.4em" }}><strong>Arguments</strong></p>

<table>
<thead><tr><th>Name</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>
sessionId<br />
<a href="/koala-app/docs/development/api/scalars#int"><code>Int!</code></a>
</td>
<td>
<p>Associated Session</p>
</td>
</tr>
<tr>
<td>
note<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String</code></a>
</td>
<td>
<p>User Session Note</p>
</td>
</tr>
<tr>
<td>
owner<br />
<a href="/koala-app/docs/development/api/inputObjects#createuserinput"><code>CreateUserInput</code></a>
</td>
<td>
<p>User Assopciated to the User Session</p>
</td>
</tr>
</tbody>
</table>

## InviteUserSessionInput

<p style={{ marginBottom: "0.4em" }}><strong>Arguments</strong></p>

<table>
<thead><tr><th>Name</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>
userSessionIds<br />
<a href="/koala-app/docs/development/api/scalars#id"><code>[ID!]!</code></a>
</td>
<td>
<p>Associated Session</p>
</td>
</tr>
<tr>
<td>
message<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String</code></a>
</td>
<td>
<p>User Session Email</p>
</td>
</tr>
</tbody>
</table>

## UpdateAnnotationInput

<p style={{ marginBottom: "0.4em" }}><strong>Arguments</strong></p>

<table>
<thead><tr><th>Name</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>
note<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String</code></a>
</td>
<td>
<p>Annotation Note</p>
</td>
</tr>
</tbody>
</table>

## UpdateMarkerInput

<p style={{ marginBottom: "0.4em" }}><strong>Arguments</strong></p>

<table>
<thead><tr><th>Name</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>
type<br />
<a href="/koala-app/docs/development/api/enums#markertype"><code>MarkerType</code></a>
</td>
<td>
<p>Marker Type</p>
</td>
</tr>
<tr>
<td>
name<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String</code></a>
</td>
<td>
<p>Marker Name</p>
</td>
</tr>
<tr>
<td>
abbreviation<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String</code></a>
</td>
<td>
<p>Marker Name Abbreviation (e.g. for small screen sizes</p>
</td>
</tr>
<tr>
<td>
description<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String</code></a>
</td>
<td>
<p>Marker Descritpion</p>
</td>
</tr>
<tr>
<td>
color<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String</code></a>
</td>
<td>
<p>Marker Color</p>
</td>
</tr>
<tr>
<td>
icon<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String</code></a>
</td>
<td>
<p>Marker Icon</p>
</td>
</tr>
</tbody>
</table>

## UpdateSessionInput

<p style={{ marginBottom: "0.4em" }}><strong>Arguments</strong></p>

<table>
<thead><tr><th>Name</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>
name<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String</code></a>
</td>
<td>

</td>
</tr>
<tr>
<td>
description<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String</code></a>
</td>
<td>

</td>
</tr>
<tr>
<td>
status<br />
<a href="/koala-app/docs/development/api/enums#sessionstatus"><code>SessionStatus</code></a>
</td>
<td>

</td>
</tr>
<tr>
<td>
start<br />
<a href="/koala-app/docs/development/api/scalars#datetime"><code>DateTime</code></a>
</td>
<td>

</td>
</tr>
<tr>
<td>
end<br />
<a href="/koala-app/docs/development/api/scalars#datetime"><code>DateTime</code></a>
</td>
<td>

</td>
</tr>
<tr>
<td>
editable<br />
<a href="/koala-app/docs/development/api/scalars#boolean"><code>Boolean</code></a>
</td>
<td>

</td>
</tr>
<tr>
<td>
enablePlayer<br />
<a href="/koala-app/docs/development/api/scalars#boolean"><code>Boolean</code></a>
</td>
<td>

</td>
</tr>
<tr>
<td>
displaySampleSolution<br />
<a href="/koala-app/docs/development/api/scalars#boolean"><code>Boolean</code></a>
</td>
<td>

</td>
</tr>
<tr>
<td>
enableLiveAnalysis<br />
<a href="/koala-app/docs/development/api/scalars#boolean"><code>Boolean</code></a>
</td>
<td>

</td>
</tr>
<tr>
<td>
mediaId<br />
<a href="/koala-app/docs/development/api/scalars#int"><code>Int</code></a>
</td>
<td>
<p>Assigned Media</p>
</td>
</tr>
</tbody>
</table>

## UpdateToolbarInput

<p style={{ marginBottom: "0.4em" }}><strong>Arguments</strong></p>

<table>
<thead><tr><th>Name</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>
markers<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>[String!]</code></a>
</td>
<td>

</td>
</tr>
</tbody>
</table>

## UpdateUserInput

<p style={{ marginBottom: "0.4em" }}><strong>Arguments</strong></p>

<table>
<thead><tr><th>Name</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>
displayName<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String</code></a>
</td>
<td>
<p>User Displayname</p>
</td>
</tr>
</tbody>
</table>

## UpdateUserSessionInput

<p style={{ marginBottom: "0.4em" }}><strong>Arguments</strong></p>

<table>
<thead><tr><th>Name</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>
note<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String</code></a>
</td>
<td>
<p>User Session Note</p>
</td>
</tr>
</tbody>
</table>
