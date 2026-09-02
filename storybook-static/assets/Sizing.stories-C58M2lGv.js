import{i as e,r as t}from"./iframe-Bs83xxEs.js";import{a as n,i as r,n as i,o as a,r as o,t as s}from"./ui-D9uDtfws.js";import{t as c}from"./rolldown-runtime-Dh6celcD.js";function l(e,t,r){let i=r===`square`?`width: var(--${e.name}); height: var(--${e.name});`:`width: 96px; height: var(--${e.name});`;return s(`div`,{class:`hds-card`},[s(`div`,{style:`padding: 16px; min-height: 88px; display: flex; align-items: center; justify-content: center; background: var(--semantic-color-bg-surfacesecondary);`},[s(`div`,{style:`${i} background: var(--semantic-color-bg-primary); border-radius: var(--core-border-radius-xs);`})]),s(`div`,{class:`hds-card-body`},[a(e.name),s(`div`,{class:`hds-value`,text:e.resolved[t]}),s(`div`,{class:`hds-desc`,text:n(e.description,140)})])])}var u,d,f;function p(){return(p=c((()=>{e(),o(),u={title:`Sizing`},d={name:`Icon and control sizes`,render:(e,n)=>{let{platform:a,theme:o}=n.globals,c=t(a,`size`),u=c.filter(e=>e.name.includes(`-icon-`)),d=c.filter(e=>e.name.includes(`-control-`)),f=c.filter(e=>!u.includes(e)&&!d.includes(e));return r({title:`Sizing`,intro:`Icon boxes and control heights. The control heights are measured from the master Figma file rather than invented — 36 for inputs, 44 for the common button, 52 for the large one.`,count:c.length,children:[u.length&&i(`Icon boxes`,s(`div`,{class:`hds-grid hds-cards`},u.map(e=>l(e,o,`square`)))),d.length&&i(`Control heights`,s(`div`,{class:`hds-grid hds-cards`},d.map(e=>l(e,o,`height`)))),f.length&&i(`Other`,s(`div`,{class:`hds-grid hds-cards`},f.map(e=>l(e,o,`height`))))].filter(Boolean)})}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'Icon and control sizes',
  render: (_args, ctx) => {
    const {
      platform,
      theme
    } = ctx.globals;
    const tokens = byCategory(platform, 'size');
    const icons = tokens.filter(t => t.name.includes('-icon-'));
    const controls = tokens.filter(t => t.name.includes('-control-'));
    const rest = tokens.filter(t => !icons.includes(t) && !controls.includes(t));
    return page({
      title: 'Sizing',
      intro: 'Icon boxes and control heights. The control heights are measured from the master Figma file rather than invented — 36 for inputs, 44 for the common button, 52 for the large one.',
      count: tokens.length,
      children: [icons.length && group('Icon boxes', el('div', {
        class: 'hds-grid hds-cards'
      }, icons.map(t => sizeCard(t, theme, 'square')))), controls.length && group('Control heights', el('div', {
        class: 'hds-grid hds-cards'
      }, controls.map(t => sizeCard(t, theme, 'height')))), rest.length && group('Other', el('div', {
        class: 'hds-grid hds-cards'
      }, rest.map(t => sizeCard(t, theme, 'height'))))].filter(Boolean)
    });
  }
}`,...d.parameters?.docs?.source}}},f=[`Sizes`]})))()}p();export{d as Sizes,f as __namedExportsOrder,u as default};