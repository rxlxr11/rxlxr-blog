import{g as j,ak as V,u as q,O as h,v as x,l as w,aB as A,J as D,m as B,o,i as c,a as _,t as C,k as l,F as k,j as P,aC as E,c as $,w as g,f as R,d as p,an as K,D as N,aD as U,aj as F,au as T,av as O,as as W}from"./app-e4bd3734.js";import{_ as H}from"./YunCard.vue_vue_type_script_setup_true_lang-ea369bfd.js";import{_ as J}from"./YunPostCollapse.vue_vue_type_style_index_0_lang-726a55b3.js";import{_ as M}from"./YunPageHeader.vue_vue_type_script_setup_true_lang-8e472eef.js";const G={class:"category-list-item inline-flex items-center cursor-pointer"},Q={key:0,"i-ri-folder-add-line":""},X={key:1,style:{color:"var(--va-c-primary)"},"i-ri-folder-reduce-line":""},Z={key:0},I=_("div",{"i-ri-file-text-line":""},null,-1),ee={m:"l-1",font:"serif black"},te=j({__name:"YunCategory",props:{parentKey:{},category:{},level:{},collapsable:{type:Boolean,default:!0}},setup(b){const u=b,m=V(),n=q(),y=h(()=>{const e=n.query.category||"";return Array.isArray(e)?[e]:e.split("/")}),t=x(u.collapsable),{t:r}=w(),{locale:d}=w();function Y(e){const i=d.value==="zh-CN"?"zh":d.value;return e[`title_${i}`]?e[`title_${i}`]:e.title}const f=x(),{show:s}=A(f);function v(e){m.push({query:{category:e}}),s()}return D(()=>{const e=document.querySelector(".post-collapse-container");e&&(f.value=e)}),(e,i)=>{const z=B("YunCategory",!0),L=B("RouterLink");return o(),c(k,null,[_("li",G,[_("span",{class:"folder-action inline-flex",onClick:i[0]||(i[0]=a=>t.value=!t.value)},[t.value?(o(),c("div",Q)):(o(),c("div",X))]),_("span",{class:"category-name",m:"l-1",onClick:i[1]||(i[1]=a=>v(e.parentKey))},C(e.category.name==="Uncategorized"?l(r)("category.uncategorized"):e.category.name)+" ["+C(e.category.total)+"] ",1)]),t.value?R("v-if",!0):(o(),c("ul",Z,[(o(!0),c(k,null,P(e.category.children,(a,S)=>(o(),c("li",{key:S,class:"post-list-item",m:"l-4"},[l(E)(a)?(o(),$(z,{key:0,"parent-key":e.parentKey?`${e.parentKey}/${a.name}`:a.name,category:a,collapsable:!y.value.includes(a.name)},null,8,["parent-key","category","collapsable"])):(o(),c(k,{key:1},[a.title?(o(),$(L,{key:0,to:a.path||"",class:"inline-flex items-center"},{default:g(()=>[I,_("span",ee,C(Y(a)),1)]),_:2},1032,["to"])):R("v-if",!0)],64))]))),128))]))],64)}}}),oe=j({__name:"YunCategories",props:{categories:{},level:{default:0},collapsable:{type:Boolean,default:!0}},setup(b){const u=q(),m=h(()=>{const n=u.query.category||"";return Array.isArray(n)?[n]:n.split("/")});return(n,y)=>{const t=te;return o(!0),c(k,null,P(n.categories,r=>(o(),c("ul",{key:r.name,class:"category-list",m:"l-4"},[p(t,{"parent-key":r.name,category:r,level:n.level+1,collapsable:!m.value.includes(r.name)},null,8,["parent-key","category","level","collapsable"])]))),128)}}});const ne={text:"center",class:"yun-text-light",p:"2"},ie=j({__name:"categories",setup(b){const{t:u}=w(),m=K(),n=N(),y=q(),t=h(()=>y.query.category||""),r=U(),d=h(()=>m.postList.filter(s=>s.categories&&t.value!=="Uncategorized"?typeof s.categories=="string"?s.categories===t.value:s.categories.join("/").startsWith(t.value)&&s.categories[0]===t.value.split("/")[0]:!s.categories&&t.value==="Uncategorized"?s.categories===void 0:!1)),Y=F(n);return T([O({"@type":"CollectionPage"})]),(f,s)=>{const v=M,e=oe,i=B("RouterView"),z=J,L=H,a=W;return o(),$(a,null,{"main-header":g(()=>[p(v,{title:l(Y)||l(u)("menu.categories"),icon:l(n).icon||"i-ri-folder-2-line",color:l(n).color},null,8,["title","icon","color"])]),"main-content":g(()=>[_("div",ne,C(l(u)("counter.categories",l(r).children.length)),1),p(e,{categories:l(r).children},null,8,["categories"]),p(i)]),"main-nav-before":g(()=>[t.value?(o(),$(L,{key:0,class:"post-collapse-container",m:"t-4",w:"full"},{default:g(()=>[p(v,{title:t.value==="Uncategorized"?l(u)("category.uncategorized"):t.value.split("/").join(" / "),icon:"i-ri-folder-open-line"},null,8,["title"]),p(z,{w:"full",m:"b-4",p:"x-20 lt-sm:x-5",posts:d.value},null,8,["posts"])]),_:1})):R("v-if",!0)]),_:1})}}});export{ie as default};
