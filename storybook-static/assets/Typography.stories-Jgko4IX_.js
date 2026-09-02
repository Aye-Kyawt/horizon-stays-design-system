import{c as e,i as t,l as n,o as r,s as i}from"./iframe-Bs83xxEs.js";import{a,i as o,n as s,o as c,r as l,t as u}from"./ui-D9uDtfws.js";import{t as d}from"./rolldown-runtime-Dh6celcD.js";function f(e,t,n,o){let s=r(t),l=_.filter(([t])=>e.props[t]).map(([t,r])=>{let i=s.byName[e.props[t].name];return`${r} ${i?i.resolved[n]:`—`}`}).join(`  ·  `);return u(`div`,{class:`hds-row`},[u(`div`,{},[c(e.stem),u(`div`,{class:`hds-value`,text:l})]),u(`div`,{class:`hds-value`,text:`${e.tokens.length} tokens`}),u(`div`,{},[u(`div`,{style:i(e),text:o}),e.description?u(`div`,{class:`hds-desc`,text:a(e.description,150)}):null])])}function p({platform:t,theme:r,families:i,title:a,intro:c,sample:l}){let d=n(t).filter(t=>i.includes(e(t.stem))),p=i.map(n=>{let i=d.filter(t=>e(t.stem)===n);return i.length?s(n.replace(/-/g,` `),u(`div`,{class:`hds-rows`},i.map(e=>f(e,t,r,l(e))))):null});return o({title:a,intro:c,count:d.reduce((e,t)=>e+t.tokens.length,0),children:p.filter(Boolean)})}var m,h,g,_,v,y,b,x,S,C;function w(){return(w=d((()=>{t(),l(),m={title:`Typography`},h=`Horizon Stays — book a room by the sea`,g=`မင်္ဂလာပါ ဟိုတယ်ခန်း စာရင်းသွင်းရန်`,_=[[`font-size`,`size`],[`line-height`,`leading`],[`font-weight`,`weight`],[`letter-spacing`,`tracking`],[`font-family`,`family`]],v=e=>e.includes(`myanmar`)?g:h,y={name:`Type scale`,render:(e,t)=>p({platform:t.globals.platform,theme:t.globals.theme,families:[`scale-latin`,`scale-myanmar`],title:`Type scale`,intro:`The Material 3 typescale as this system implements it, in regular, semibold and bold. Myanmar styles carry their own line heights — Burmese shaping needs the extra leading and must never be letter-spaced.`,sample:e=>v(e.stem)})},b={name:`Semantic styles`,render:(e,t)=>p({platform:t.globals.platform,theme:t.globals.theme,families:[`semantic-latin`,`semantic-myanmar`],title:`Semantic type styles`,intro:`Named by the job rather than the size — page title, field label, price, badge. These alias the typescale, so a change to the scale flows through. Use these in product code.`,sample:e=>v(e.stem)})},x={name:`Document styles`,render:(e,t)=>p({platform:t.globals.platform,theme:t.globals.theme,families:[`document-latin`,`document-myanmar`],title:`Document styles`,intro:`The H1–H6 and body run used for long-form copy: help articles, policy pages, listing descriptions.`,sample:e=>v(e.stem)})},S={name:`Type primitives`,render:(e,t)=>{let n=t.globals.platform,i=t.globals.theme,l=r(n).tokens.filter(e=>e.category===`type-primitive`),d=new Map;for(let e of l){let t=e.name.split(`-`)[2]||`other`;d.has(t)||d.set(t,[]),d.get(t).push(e)}let f=[...d.entries()].map(([e,t])=>s(e,u(`table`,{class:`hds-table`},[u(`thead`,{},[u(`tr`,{},[u(`th`,{text:`Token`}),u(`th`,{text:`Value`}),u(`th`,{text:`Notes`})])]),u(`tbody`,{},t.map(e=>u(`tr`,{},[u(`td`,{},[c(e.name)]),u(`td`,{class:`hds-mono`,text:e.resolved[i]}),u(`td`,{text:a(e.description,160)})])))])));return o({title:`Type primitives`,intro:`Font families, sizes, line heights, trackings and weights. This is the layer the platform builds differ on — switch the Platform toolbar and the values change while the names stay put.`,count:l.length,children:f})}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: 'Type scale',
  render: (_args, ctx) => familyPage({
    platform: ctx.globals.platform,
    theme: ctx.globals.theme,
    families: ['scale-latin', 'scale-myanmar'],
    title: 'Type scale',
    intro: 'The Material 3 typescale as this system implements it, in regular, semibold and bold. Myanmar styles carry their own line heights — Burmese shaping needs the extra leading and must never be letter-spaced.',
    sample: s => sampleFor(s.stem)
  })
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: 'Semantic styles',
  render: (_args, ctx) => familyPage({
    platform: ctx.globals.platform,
    theme: ctx.globals.theme,
    families: ['semantic-latin', 'semantic-myanmar'],
    title: 'Semantic type styles',
    intro: 'Named by the job rather than the size — page title, field label, price, badge. These alias the typescale, so a change to the scale flows through. Use these in product code.',
    sample: s => sampleFor(s.stem)
  })
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: 'Document styles',
  render: (_args, ctx) => familyPage({
    platform: ctx.globals.platform,
    theme: ctx.globals.theme,
    families: ['document-latin', 'document-myanmar'],
    title: 'Document styles',
    intro: 'The H1–H6 and body run used for long-form copy: help articles, policy pages, listing descriptions.',
    sample: s => sampleFor(s.stem)
  })
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: 'Type primitives',
  render: (_args, ctx) => {
    const platform = ctx.globals.platform;
    const theme = ctx.globals.theme;
    const tokens = tokensFor(platform).tokens.filter(t => t.category === 'type-primitive');
    const buckets = new Map();
    for (const t of tokens) {
      // core-type-<facet>-<rest>
      const facet = t.name.split('-')[2] || 'other';
      if (!buckets.has(facet)) buckets.set(facet, []);
      buckets.get(facet).push(t);
    }
    const sections = [...buckets.entries()].map(([facet, list]) => group(facet, el('table', {
      class: 'hds-table'
    }, [el('thead', {}, [el('tr', {}, [el('th', {
      text: 'Token'
    }), el('th', {
      text: 'Value'
    }), el('th', {
      text: 'Notes'
    })])]), el('tbody', {}, list.map(t => el('tr', {}, [el('td', {}, [tokenName(t.name)]), el('td', {
      class: 'hds-mono',
      text: t.resolved[theme]
    }), el('td', {
      text: shortDesc(t.description, 160)
    })])))])));
    return page({
      title: 'Type primitives',
      intro: 'Font families, sizes, line heights, trackings and weights. This is the layer the platform builds differ on — switch the Platform toolbar and the values change while the names stay put.',
      count: tokens.length,
      children: sections
    });
  }
}`,...S.parameters?.docs?.source},description:{story:`The raw sizes, leadings, trackings and weights the styles are built from.`,...S.parameters?.docs?.description}}},C=[`Typescale`,`SemanticType`,`DocumentStyles`,`Primitives`]})))()}w();export{x as DocumentStyles,S as Primitives,b as SemanticType,y as Typescale,C as __namedExportsOrder,m as default};