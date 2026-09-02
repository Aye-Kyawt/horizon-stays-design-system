import{i as e,r as t}from"./iframe-Bs83xxEs.js";import{a as n,i as r,n as i,o as a,r as o,t as s}from"./ui-D9uDtfws.js";import{t as c}from"./rolldown-runtime-Dh6celcD.js";function l(e,t){return s(`div`,{class:`hds-card`},[s(`div`,{style:`padding: 16px; display: flex; align-items: center; justify-content: center; background: var(--semantic-color-bg-surfacesecondary);`},[s(`div`,{style:`width: 100%; height: 56px; background: var(--semantic-color-bg-primary); border-radius: var(--${e.name});`})]),s(`div`,{class:`hds-card-body`},[a(e.name),s(`div`,{class:`hds-value`,text:e.resolved[t]}),e.alias?s(`div`,{class:`hds-value`,text:`→ --${e.alias}`}):null,s(`div`,{class:`hds-desc`,text:n(e.description,110)})])])}function u(e,t){return s(`div`,{class:`hds-row`},[s(`div`,{},[a(e.name)]),s(`div`,{class:`hds-mono`,text:e.resolved[t]}),s(`div`,{},[s(`div`,{style:`height: 0; border-top: var(--${e.name}) solid var(--semantic-color-border-strong); width: 100%;`}),s(`div`,{class:`hds-desc`,text:n(e.description,150)})])])}function d(e,t){return s(`div`,{class:`hds-row`},[s(`div`,{},[a(e.name)]),s(`div`,{class:`hds-mono`,text:e.resolved[t]}),s(`div`,{},[s(`div`,{style:`height: 40px; border: 2px solid var(--${e.name}); border-radius: var(--core-border-radius-sm); background: var(--semantic-color-bg-surfaceprimary);`}),s(`div`,{class:`hds-desc`,text:n(e.description,150)})])])}function f(e,n){let r=t(e,n);return{tokens:r,core:r.filter(e=>e.tier===`core`),semantic:r.filter(e=>e.tier===`semantic`)}}var p,m,h,g,_;function v(){return(v=c((()=>{e(),o(),p={title:`Borders`},m={name:`Radius`,render:(e,t)=>{let{platform:n,theme:a}=t.globals,{tokens:o,core:c,semantic:u}=f(n,`radius`);return r({title:`Corner radius`,intro:`Radius is one of the two collections that differ per platform — the back office squares off where web and mobile round. Switch the Platform toolbar to compare; the semantic names stay put while the values move.`,count:o.length,children:[c.length&&i(`Core steps`,s(`div`,{class:`hds-grid hds-cards`},c.map(e=>l(e,a))),`The raw ladder, shared across platforms.`),u.length&&i(`Semantic radius`,s(`div`,{class:`hds-grid hds-cards`},u.map(e=>l(e,a))),`What product code should use. These remap per platform — semantic lg points at a different core step in the back office than on web.`)].filter(Boolean)})}},h={name:`Stroke width`,render:(e,t)=>{let{platform:n,theme:a}=t.globals,{tokens:o,core:c,semantic:l}=f(n,`border-width`);return r({title:`Stroke width`,intro:`Border weights. 1 px carries almost every stroke in the product; 2 px is reserved for focus rings and selected states.`,count:o.length,children:[c.length&&i(`Core widths`,s(`div`,{class:`hds-rows`},c.map(e=>u(e,a)))),l.length&&i(`Semantic widths`,s(`div`,{class:`hds-rows`},l.map(e=>u(e,a))))].filter(Boolean)})}},g={name:`Border colours`,render:(e,n)=>{let{platform:a,theme:o}=n.globals,c=t(a,`semantic-color`).filter(e=>e.group===`border`);return r({title:`Border colours`,intro:`The stroke colours, by role. These are semantic colours, so they follow the light/dark override — flip the Theme toolbar.`,count:c.length,children:c.length?i(`Roles`,s(`div`,{class:`hds-rows`},c.map(e=>d(e,o)))):s(`p`,{class:`hds-empty`,text:`No border colour tokens in this build.`})})}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: 'Radius',
  render: (_args, ctx) => {
    const {
      platform,
      theme
    } = ctx.globals;
    const {
      tokens,
      core,
      semantic
    } = tiered(platform, 'radius');
    return page({
      title: 'Corner radius',
      intro: 'Radius is one of the two collections that differ per platform — the back office squares off where web and mobile round. Switch the Platform toolbar to compare; the semantic names stay put while the values move.',
      count: tokens.length,
      children: [core.length && group('Core steps', el('div', {
        class: 'hds-grid hds-cards'
      }, core.map(t => radiusCard(t, theme))), 'The raw ladder, shared across platforms.'), semantic.length && group('Semantic radius', el('div', {
        class: 'hds-grid hds-cards'
      }, semantic.map(t => radiusCard(t, theme))), 'What product code should use. These remap per platform — semantic lg points at a different core step in the back office than on web.')].filter(Boolean)
    });
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: 'Stroke width',
  render: (_args, ctx) => {
    const {
      platform,
      theme
    } = ctx.globals;
    const {
      tokens,
      core,
      semantic
    } = tiered(platform, 'border-width');
    return page({
      title: 'Stroke width',
      intro: 'Border weights. 1 px carries almost every stroke in the product; 2 px is reserved for focus rings and selected states.',
      count: tokens.length,
      children: [core.length && group('Core widths', el('div', {
        class: 'hds-rows'
      }, core.map(t => widthRow(t, theme)))), semantic.length && group('Semantic widths', el('div', {
        class: 'hds-rows'
      }, semantic.map(t => widthRow(t, theme))))].filter(Boolean)
    });
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: 'Border colours',
  render: (_args, ctx) => {
    const {
      platform,
      theme
    } = ctx.globals;
    const tokens = byCategory(platform, 'semantic-color').filter(t => t.group === 'border');
    return page({
      title: 'Border colours',
      intro: 'The stroke colours, by role. These are semantic colours, so they follow the light/dark override — flip the Theme toolbar.',
      count: tokens.length,
      children: tokens.length ? group('Roles', el('div', {
        class: 'hds-rows'
      }, tokens.map(t => colourRow(t, theme)))) : el('p', {
        class: 'hds-empty',
        text: 'No border colour tokens in this build.'
      })
    });
  }
}`,...g.parameters?.docs?.source}}},_=[`Radius`,`Width`,`BorderColours`]})))()}v();export{g as BorderColours,m as Radius,h as Width,_ as __namedExportsOrder,p as default};