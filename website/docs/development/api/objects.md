---
id: objects
title: Objects
slug: objects
sidebar_position: 4
---

## Annotation

<p style={{ marginBottom: "0.4em" }}><strong>Fields</strong></p>

<table>
<thead><tr><th>Name</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>
createdAt<br />
<a href="/koala-app/docs/development/api/scalars#datetime"><code>DateTime!</code></a>
</td>
<td>
<p>Creation Date</p>
</td>
</tr>
<tr>
<td>
updatedAt<br />
<a href="/koala-app/docs/development/api/scalars#datetime"><code>DateTime!</code></a>
</td>
<td>
<p>Date of Last Update</p>
</td>
</tr>
<tr>
<td>
id<br />
<a href="/koala-app/docs/development/api/scalars#int"><code>Int!</code></a>
</td>
<td>
<p>ID for Annotation</p>
</td>
</tr>
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
marker<br />
<a href="/koala-app/docs/development/api/objects#marker"><code>Marker!</code></a>
</td>
<td>
<p>Associated Marker</p>
</td>
</tr>
<tr>
<td>
userSession<br />
<a href="/koala-app/docs/development/api/objects#usersession"><code>UserSession!</code></a>
</td>
<td>
<p>Associated UserSession</p>
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

## Authentication

<p style={{ marginBottom: "0.4em" }}><strong>Fields</strong></p>

<table>
<thead><tr><th>Name</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>
accessToken<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String!</code></a>
</td>
<td>
<p>JWT Bearer Token</p>
</td>
</tr>
<tr>
<td>
user<br />
<a href="/koala-app/docs/development/api/objects#user"><code>User!</code></a>
</td>
<td>
<p>Authenticated user</p>
</td>
</tr>
</tbody>
</table>

## Marker

<p style={{ marginBottom: "0.4em" }}><strong>Fields</strong></p>

<table>
<thead><tr><th>Name</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>
createdAt<br />
<a href="/koala-app/docs/development/api/scalars#datetime"><code>DateTime!</code></a>
</td>
<td>
<p>Creation Date</p>
</td>
</tr>
<tr>
<td>
updatedAt<br />
<a href="/koala-app/docs/development/api/scalars#datetime"><code>DateTime!</code></a>
</td>
<td>
<p>Date of Last Update</p>
</td>
</tr>
<tr>
<td>
id<br />
<a href="/koala-app/docs/development/api/scalars#int"><code>Int!</code></a>
</td>
<td>
<p>ID for Marker</p>
</td>
</tr>
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
<p>Marker Description</p>
</td>
</tr>
<tr>
<td>
color<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String!</code></a>
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

## Media

<p style={{ marginBottom: "0.4em" }}><strong>Fields</strong></p>

<table>
<thead><tr><th>Name</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>
createdAt<br />
<a href="/koala-app/docs/development/api/scalars#datetime"><code>DateTime!</code></a>
</td>
<td>
<p>Creation Date</p>
</td>
</tr>
<tr>
<td>
updatedAt<br />
<a href="/koala-app/docs/development/api/scalars#datetime"><code>DateTime!</code></a>
</td>
<td>
<p>Date of Last Update</p>
</td>
</tr>
<tr>
<td>
id<br />
<a href="/koala-app/docs/development/api/scalars#id"><code>ID!</code></a>
</td>
<td>
<p>ID for Media</p>
</td>
</tr>
<tr>
<td>
name<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String!</code></a>
</td>
<td>
<p>Media Name</p>
</td>
</tr>
<tr>
<td>
mimeType<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String!</code></a>
</td>
<td>
<p>Media Mime Type</p>
</td>
</tr>
</tbody>
</table>

## Session

<p style={{ marginBottom: "0.4em" }}><strong>Fields</strong></p>

<table>
<thead><tr><th>Name</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>
createdAt<br />
<a href="/koala-app/docs/development/api/scalars#datetime"><code>DateTime!</code></a>
</td>
<td>
<p>Creation Date</p>
</td>
</tr>
<tr>
<td>
updatedAt<br />
<a href="/koala-app/docs/development/api/scalars#datetime"><code>DateTime!</code></a>
</td>
<td>
<p>Date of Last Update</p>
</td>
</tr>
<tr>
<td>
id<br />
<a href="/koala-app/docs/development/api/scalars#id"><code>ID!</code></a>
</td>
<td>
<p>ID for Session</p>
</td>
</tr>
<tr>
<td>
name<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String!</code></a>
</td>
<td>
<p>Session Name</p>
</td>
</tr>
<tr>
<td>
description<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String</code></a>
</td>
<td>
<p>Description</p>
</td>
</tr>
<tr>
<td>
status<br />
<a href="/koala-app/docs/development/api/enums#sessionstatus"><code>SessionStatus</code></a>
</td>
<td>
<p>Session Status</p>
</td>
</tr>
<tr>
<td>
start<br />
<a href="/koala-app/docs/development/api/scalars#datetime"><code>DateTime</code></a>
</td>
<td>
<p>Start of Session</p>
</td>
</tr>
<tr>
<td>
end<br />
<a href="/koala-app/docs/development/api/scalars#datetime"><code>DateTime</code></a>
</td>
<td>
<p>End of Session</p>
</td>
</tr>
<tr>
<td>
editable<br />
<a href="/koala-app/docs/development/api/scalars#boolean"><code>Boolean</code></a>
</td>
<td>
<p>Default for Session - Editable for Participants</p>
</td>
</tr>
<tr>
<td>
enablePlayer<br />
<a href="/koala-app/docs/development/api/scalars#boolean"><code>Boolean</code></a>
</td>
<td>
<p>Default for Session - Player Enabled for Participants</p>
</td>
</tr>
<tr>
<td>
displaySampleSolution<br />
<a href="/koala-app/docs/development/api/scalars#boolean"><code>Boolean</code></a>
</td>
<td>
<p>Default for Session - Sample Solution Displayed</p>
</td>
</tr>
<tr>
<td>
enableLiveAnalysis<br />
<a href="/koala-app/docs/development/api/scalars#boolean"><code>Boolean</code></a>
</td>
<td>
<p>Default for Session - Annotations are Directly Displayed in Analysis</p>
</td>
</tr>
<tr>
<td>
media<br />
<a href="/koala-app/docs/development/api/objects#media"><code>Media</code></a>
</td>
<td>
<p>Associated Media File</p>
</td>
</tr>
<tr>
<td>
code<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String!</code></a>
</td>
<td>

</td>
</tr>
<tr>
<td>
toolbars<br />
<a href="/koala-app/docs/development/api/objects#toolbar"><code>[Toolbar!]!</code></a>
</td>
<td>
<p>Associated Session</p>
</td>
</tr>
<tr>
<td>
userSessions<br />
<a href="/koala-app/docs/development/api/objects#usersession"><code>[UserSession!]!</code></a>
</td>
<td>
<p>Associated User Sessions</p>
</td>
</tr>
</tbody>
</table>

## Toolbar

<p style={{ marginBottom: "0.4em" }}><strong>Fields</strong></p>

<table>
<thead><tr><th>Name</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>
createdAt<br />
<a href="/koala-app/docs/development/api/scalars#datetime"><code>DateTime!</code></a>
</td>
<td>
<p>Creation Date</p>
</td>
</tr>
<tr>
<td>
updatedAt<br />
<a href="/koala-app/docs/development/api/scalars#datetime"><code>DateTime!</code></a>
</td>
<td>
<p>Date of Last Update</p>
</td>
</tr>
<tr>
<td>
id<br />
<a href="/koala-app/docs/development/api/scalars#id"><code>ID!</code></a>
</td>
<td>
<p>ID for Media</p>
</td>
</tr>
<tr>
<td>
session<br />
<a href="/koala-app/docs/development/api/objects#session"><code>Session!</code></a>
</td>
<td>
<p>Associated Session</p>
</td>
</tr>
<tr>
<td>
markers<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>[String!]!</code></a>
</td>
<td>

</td>
</tr>
</tbody>
</table>

## User

<p style={{ marginBottom: "0.4em" }}><strong>Fields</strong></p>

<table>
<thead><tr><th>Name</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>
createdAt<br />
<a href="/koala-app/docs/development/api/scalars#datetime"><code>DateTime!</code></a>
</td>
<td>
<p>Creation Date</p>
</td>
</tr>
<tr>
<td>
updatedAt<br />
<a href="/koala-app/docs/development/api/scalars#datetime"><code>DateTime!</code></a>
</td>
<td>
<p>Date of Last Update</p>
</td>
</tr>
<tr>
<td>
id<br />
<a href="/koala-app/docs/development/api/scalars#id"><code>ID!</code></a>
</td>
<td>
<p>ID for User</p>
</td>
</tr>
<tr>
<td>
displayName<br />
<a href="/koala-app/docs/development/api/scalars#string"><code>String</code></a>
</td>
<td>
<p>User Display Name</p>
</td>
</tr>
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

## UserSession

<p style={{ marginBottom: "0.4em" }}><strong>Fields</strong></p>

<table>
<thead><tr><th>Name</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>
createdAt<br />
<a href="/koala-app/docs/development/api/scalars#datetime"><code>DateTime!</code></a>
</td>
<td>
<p>Creation Date</p>
</td>
</tr>
<tr>
<td>
updatedAt<br />
<a href="/koala-app/docs/development/api/scalars#datetime"><code>DateTime!</code></a>
</td>
<td>
<p>Date of Last Update</p>
</td>
</tr>
<tr>
<td>
id<br />
<a href="/koala-app/docs/development/api/scalars#int"><code>Int!</code></a>
</td>
<td>
<p>ID for User Session</p>
</td>
</tr>
<tr>
<td>
status<br />
<a href="/koala-app/docs/development/api/enums#usersessionstatus"><code>UserSessionStatus!</code></a>
</td>
<td>
<p>User Session Status</p>
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
session<br />
<a href="/koala-app/docs/development/api/objects#session"><code>Session!</code></a>
</td>
<td>
<p>Associated Session</p>
</td>
</tr>
<tr>
<td>
owner<br />
<a href="/koala-app/docs/development/api/objects#user"><code>User!</code></a>
</td>
<td>
<p>Associated User</p>
</td>
</tr>
<tr>
<td>
invitedAt<br />
<a href="/koala-app/docs/development/api/scalars#datetime"><code>DateTime!</code></a>
</td>
<td>
<p>Invitation Date</p>
</td>
</tr>
<tr>
<td>
annotations<br />
<a href="/koala-app/docs/development/api/objects#annotation"><code>[Annotation!]!</code></a>
</td>
<td>
<p>Associated Annotations</p>
</td>
</tr>
</tbody>
</table>
