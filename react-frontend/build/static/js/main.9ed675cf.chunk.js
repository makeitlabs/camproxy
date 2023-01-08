(this["webpackJsonpgoogle-login-react"]=this["webpackJsonpgoogle-login-react"]||[]).push([[0],{121:function(e,t,n){},144:function(e,t,n){"use strict";n.r(t);var c=n(0),a=n(33),r=n.n(a),i=(n(121),n(11)),o=n(208),l=n(212),s=n(210),j=n(209),b=n(204),d=n(211),x=n(203),h=(n(78),n(2));var u=function(e){var t=Object(i.f)();return Object(c.useEffect)((function(){if(null!==localStorage.getItem("JWT"))return t("/home")}),[t]),Object(h.jsx)(x.a,{container:!0,spacing:0,direction:"column",alignItems:"center",justifyContent:"center",style:{minHeight:"100vh"},children:Object(h.jsxs)(o.a,{sx:{maxWidth:345},children:[Object(h.jsx)(j.a,{sx:{width:250,margin:"10px"},component:"img",alt:"MakeIt Labs",image:"/logo-2016-01.png"}),Object(h.jsx)(s.a,{children:Object(h.jsx)(d.a,{variant:"body2",color:"text.secondary",children:"Please log in with your MakeIt Labs Google Workspace account."})}),Object(h.jsx)(l.a,{children:Object(h.jsx)(b.a,{size:"small",onClick:function(t){return e.login(t)},children:"Login"})})]})})};var O=function(){var e=Object(i.f)();return Object(h.jsxs)("div",{style:{padding:"10px",border:"2px solid black",margin:"20px"},children:[Object(h.jsx)("h1",{children:"Login error, you must use the correct gmail account."}),Object(h.jsx)("button",{onClick:function(){return e("/login")},children:"Try Again"})]})},g=n(9),m=n(35),f=n.n(m),p=n(219),v=n(213),k=n(220),w=n(221),y=n(99),S=n.n(y),C=n(205),I=n(199),W=n(200),L=n(218),A=n(214),T=n(201),J=n(195),P=n(216),D=n(217),M=n(215),R=n(96),z=n.n(R),G=n(71),B=n.n(G),E=n(72),_=n.n(E),U=n(222);var F=function(e){var t=e.id,n=e.name,a=e.height,r=e.width,i=e.interval,o=e.smallThumb,l=e.clickCallback,s=Object(c.useState)(null),j=Object(g.a)(s,2),x=j[0],u=j[1],O=Object(c.useState)(null),m=Object(g.a)(O,2),p=m[0],k=m[1],w=Object(c.useState)(!1),y=Object(g.a)(w,2),S=y[0],C=y[1],I=Object(c.useRef)(null),W=function(e){if(e){var t="";void 0!==a?t="".concat(N,"/thumbnail?camera_id=").concat(e,"&height=").concat(a):void 0!==r&&(t="".concat(N,"/thumbnail?camera_id=").concat(e,"&width=").concat(r)),f.a.get(t,{responseType:"blob",cancelToken:I.current.token,headers:{Authorization:"Bearer ".concat(localStorage.getItem("JWT"))}}).then((function(e){u(URL.createObjectURL(e.data)),C(!1)})).catch((function(e){console.log(e)}))}};Object(c.useEffect)((function(){I.current=f.a.CancelToken.source();var e=I.current;null!==p&&(clearInterval(p),C(!0),W(t));var n=setInterval((function(){W(t)}),i);return k(n),function(){e.cancel(),clearInterval(p)}}),[t,i]);var L=(new Date).toLocaleString();return Object(h.jsxs)(v.a,{children:[null===x&&Object(h.jsxs)(v.a,{sx:{backgroundColor:"#eeeeee",width:r,height:9*r/16,display:"flex",justifyContent:"center",alignItems:"center"},children:[Object(h.jsx)(U.a,{disableShrink:!0}),!0!==o&&Object(h.jsx)(d.a,{variant:"h6",sx:{marginLeft:"10px"},children:"Loading..."})]}),null!==x&&Object(h.jsx)(v.a,{sx:{width:"100%",height:"100%",backgroundColor:"#aaaaaa",textAlign:"center"},children:Object(h.jsxs)(b.a,{sx:{p:0,m:0},onClick:function(e){void 0!==l&&l(e,t)},children:[Object(h.jsx)("img",{src:x,alt:""}),S&&Object(h.jsx)(v.a,{sx:{position:"absolute",bottom:0,right:0,width:"100%",height:"100%",background:"black",opacity:"50%",justifyContent:"center",alignItems:"center",display:"flex"},children:Object(h.jsx)(U.a,{disableShrink:!0})}),!0===o&&Object(h.jsx)(v.a,{sx:{position:"absolute",bottom:0,right:0,textShadow:"1px 3px 3px black",backgroundColor:"transparent",fontWeight:"bolder",color:"white",padding:"4px",margin:0},children:Object(h.jsx)(v.a,{sx:{justifyContent:"right"},children:Object(h.jsxs)("div",{children:[n," "]})})}),!0!==o&&Object(h.jsx)(v.a,{width:"100%",sx:{position:"absolute",bottom:0,textShadow:"1px 3px 3px black",backgroundColor:"black",fontWeight:"bolder",color:"white",padding:"4px",margin:0},children:Object(h.jsx)(v.a,{children:Object(h.jsxs)("div",{children:[n," ",L]})})})]})})]})},H="Single Camera",q="Multi Camera";var K=function(e){var t=e.window,n=Object(c.useState)(!1),a=Object(g.a)(n,2),r=a[0],o=a[1],l=Object(c.useState)(null),s=Object(g.a)(l,2),j=s[0],b=s[1],u=Object(c.useState)({}),O=Object(g.a)(u,2),m=O[0],y=O[1],R=Object(c.useState)({}),G=Object(g.a)(R,2),E=G[0],K=G[1],Q=Object(c.useState)(null),V=Object(g.a)(Q,2),X=V[0],Y=V[1],Z=Object(c.useState)(null),$=Object(g.a)(Z,2),ee=$[0],te=$[1],ne=Object(c.useState)(H),ce=Object(g.a)(ne,2),ae=ce[0],re=ce[1],ie=Object(c.useRef)(null),oe=Object(c.useState)(0),le=Object(g.a)(oe,2),se=le[0],je=le[1],be=Object(i.f)(),de=240,xe=function(){o(!r)},he=function(e){for(var t=0;t<m.length;t++)if(m[t].id===e)return m[t].name;return""},ue=function(e){re(e),localStorage.setItem("selectedPage",e)},Oe=function(e,t){var n=localStorage.getItem(e);return null===n||void 0===n?t:n};Object(c.useEffect)((function(){var e=ie.current.getBoundingClientRect().width;if(e>1280&&(e=1280),je(e),null==localStorage.getItem("JWT"))return be("/login");f.a.get("".concat(N,"/home"),{headers:{Authorization:"Bearer ".concat(localStorage.getItem("JWT"))}}).then((function(e){b(e.data)})).catch((function(e){return console.log(e)})),f.a.get("".concat(N,"/devices"),{headers:{Authorization:"Bearer ".concat(localStorage.getItem("JWT"))}}).then((function(e){var t=e.data;y(t);for(var n={},c=[],a=0;a<t.length;a++){var r=t[a].name.split("-");if(r.length>=2){var i=r[0],o=[];n.hasOwnProperty(i)&&(o=n[i]),o.push(t[a].id),n[i]=o,c.push(i)}}K(n);var l=Oe("selectedDevice",t[0].id);Y(l);var s=Oe("selectedArea",c[0]);te(s)})).catch((function(e){return console.log(e)}));var t=Oe("selectedPage",H);re(t)}),[be,y,ie]);var ge=function(e,t){Y(t),localStorage.setItem("selectedDevice",t),ue(H)},me=Object(h.jsxs)("div",{children:[ae===H&&Object(h.jsxs)(v.a,{children:[Object(h.jsx)(d.a,{variant:"button",sx:{marginLeft:2,fontWeight:"bold",color:"blue"},children:"Available Cameras"}),Object.keys(E).length>0&&Object(h.jsx)(A.a,{dense:!0,children:Object.keys(E).map((function(e){return Object(h.jsxs)(h.Fragment,{children:[Object(h.jsx)(M.a,{sx:{color:"green",fontWeight:"bold",backgroundColor:"#eeeeee"},children:e}),E[e].map((function(e){return Object(h.jsx)(T.a,{disablePadding:!0,selected:X===e,children:Object(h.jsxs)(J.a,{onClick:function(t){return Y(n=e),localStorage.setItem("selectedDevice",n),void o(!1);var n},children:[Object(h.jsx)(P.a,{sx:{minWidth:"12px",paddingRight:"2px",opacity:"50%"},children:Object(h.jsx)(B.a,{})}),Object(h.jsx)(D.a,{primary:he(e).split(" - ")[1]})]})},e)}))]})}))}),0===Object.keys(E).length&&Object(h.jsxs)(A.a,{dense:!0,children:[Object(h.jsx)(T.a,{children:Object(h.jsx)(U.a,{disableShrink:!0})}),Object(h.jsx)(T.a,{children:"Loading..."})]})]}),ae===q&&Object(h.jsxs)(v.a,{children:[Object(h.jsx)(d.a,{variant:"button",sx:{marginLeft:2,fontWeight:"bold",color:"blue"},children:"Available Areas"}),Object.keys(E).length>0&&Object(h.jsx)(A.a,{children:Object.keys(E).map((function(e){return Object(h.jsx)(T.a,{disablePadding:!0,selected:ee===e,children:Object(h.jsxs)(J.a,{onClick:function(t){return te(n=e),localStorage.setItem("selectedArea",n),void o(!1);var n},children:[Object(h.jsx)(P.a,{children:Object(h.jsx)(_.a,{})}),Object(h.jsx)(D.a,{primary:e,secondary:E[e].length+" cameras"})]})},e)}))}),0===Object.keys(E).length&&Object(h.jsxs)(A.a,{dense:!0,children:[Object(h.jsx)(T.a,{children:Object(h.jsx)(U.a,{disableShrink:!0})}),Object(h.jsx)(T.a,{children:"Loading..."})]})]})]}),fe=void 0!==t?function(){return t().document.body}:void 0;return Object(h.jsxs)(v.a,{sx:{display:"flex"},children:[Object(h.jsx)(L.a,{}),Object(h.jsx)(v.a,{children:Object(h.jsx)(p.a,{position:"fixed",sx:{width:{sm:"calc(100% - ".concat(de,"px)")},ml:{sm:"".concat(de,"px")}},ref:ie,children:Object(h.jsxs)(k.a,{children:[Object(h.jsx)(w.a,{color:"inherit","aria-label":"open drawer",edge:"start",onClick:xe,sx:{mr:2,display:{sm:"none"}},children:Object(h.jsx)(z.a,{})}),Object(h.jsx)(d.a,{variant:"h6",noWrap:!0,component:"a",sx:{mr:2,display:{xs:"none",md:"flex"},fontFamily:"sans-serif",fontWeight:700,letterSpacing:"-.05rem",color:"orange",textDecoration:"none"},children:"MakeIt Labs"}),Object(h.jsxs)(v.a,{sx:{flexGrow:1,display:{md:"flex"}},children:[Object(h.jsx)(w.a,{sx:{color:"white",backgroundColor:ae===H?"orange":"transparent"},onClick:function(){ue(H)},children:Object(h.jsx)(B.a,{})},H),Object(h.jsx)(w.a,{sx:{color:"white",backgroundColor:ae===q?"orange":"transparent"},onClick:function(){ue(q)},children:Object(h.jsx)(_.a,{})},q)]}),Object(h.jsx)(v.a,{sx:{flexGrow:0,display:{xs:"none"},marginRight:"10px"},children:Object(h.jsx)(I.a,{title:j?j.email:"",children:Object(h.jsx)(d.a,{variant:"button",children:j?j.name:""})})}),Object(h.jsxs)(v.a,{sx:{flexGrow:0},children:[Object(h.jsx)(w.a,{sx:{p:0},children:Object(h.jsx)(C.a,{alt:j?j.name:"",src:j?j.picture:""})}),Object(h.jsx)(I.a,{title:"Logout",children:Object(h.jsx)(w.a,{onClick:function(){return localStorage.removeItem("JWT"),be("/login")},color:"inherit",children:Object(h.jsx)(S.a,{})})})]})]})})}),Object(h.jsxs)(v.a,{component:"nav",sx:{width:{sm:de},flexShrink:{sm:0}},children:[Object(h.jsx)(W.a,{container:fe,variant:"temporary",open:r,onClose:xe,ModalProps:{keepMounted:!0},sx:{display:{xs:"block",sm:"none"},"& .MuiDrawer-paper":{boxSizing:"border-box",width:de}},children:me}),Object(h.jsx)(W.a,{variant:"permanent",sx:{display:{xs:"none",sm:"block"},"& .MuiDrawer-paper":{boxSizing:"border-box",width:de}},open:!0,children:me})]}),ae===H&&Object(h.jsx)("div",{children:Object(h.jsxs)(v.a,{component:"main",sx:{flexGrow:1,p:1},children:[Object(h.jsx)(k.a,{}),Object(h.jsx)(F,{id:X,name:he(X),width:se-20,interval:"1500",clickCallback:function(e,t){for(var n in E){if(E[n].includes(t))return te(n),localStorage.setItem("selectedArea",n),void ue(q)}}})]})}),ae===q&&Object(h.jsxs)(v.a,{component:"main",sx:{flexGrow:1},children:[Object(h.jsx)(k.a,{}),Object(h.jsx)(x.a,{container:!0,alignItems:"left",justifyContent:"left",rowSpacing:"1px",columnSpacing:"1px",sx:{p:1},children:Object.values(E.hasOwnProperty(ee)?E[ee]:[]).map((function(e){return Object(h.jsx)(x.a,{item:!0,sx:{minWidth:320,justifyContent:"center"},children:Object(h.jsx)(F,{id:e,name:he(e),width:"320",interval:"3000",smallThumb:!0,clickCallback:ge,user:j?j.email:""})})}))})]})]})},N=(n(143),"https://cams.makeitlabs.com/api");var Q=function(){var e=Object(i.f)(),t=function(e){e.preventDefault(),f.a.get("".concat(N,"/auth/google"),{headers:{"Access-Control-Allow-Origin":"* ","Access-Control-Allow-Headers":"Content-Type"}}).then((function(e){window.location.assign(e.data.auth_url)})).catch((function(e){return console.log(e)}))};return Object(c.useEffect)((function(){if(null==localStorage.getItem("JWT")){var t=new URLSearchParams(window.location.search).get("jwt");if(t)return localStorage.setItem("JWT",t),e("/home")}}),[e]),Object(h.jsxs)(i.c,{children:[Object(h.jsx)(i.a,{path:"/login",element:Object(h.jsx)(u,{login:t})}),Object(h.jsx)(i.a,{path:"/login_error",element:Object(h.jsx)(O,{})}),Object(h.jsx)(i.a,{path:"/home",element:Object(h.jsx)(K,{})}),Object(h.jsx)(i.a,{path:"*",element:Object(h.jsx)(u,{login:t})})]})},V=n(102);r.a.render(Object(h.jsx)(V.a,{children:Object(h.jsx)(Q,{})}),document.getElementById("root"))}},[[144,1,2]]]);
//# sourceMappingURL=main.9ed675cf.chunk.js.map