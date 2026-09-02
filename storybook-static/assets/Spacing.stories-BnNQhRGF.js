import{i as e,r as t}from"./iframe-Bs83xxEs.js";import{a as n,i as r,n as i,o as a,r as o,t as s}from"./ui-D9uDtfws.js";import{t as c}from"./rolldown-runtime-Dh6celcD.js";function l(e,t){return s(`div`,{class:`hds-row`},[s(`div`,{},[a(e.name)]),s(`div`,{class:`hds-mono`,text:e.resolved[t]}),s(`div`,{},[s(`div`,{style:`width: var(--${e.name}); min-width: 1px; height: 16px; border-radius: 2px; background: var(--semantic-color-bg-primary);`}),e.description?s(`div`,{class:`hds-desc`,text:n(e.description,150)}):null])])}var u,d,f;function p(){return(p=c((()=>{e(),o(),u={title:`Spacing`},d={name:`Scale`,render:(e,n)=>{let{platform:a,theme:o}=n.globals,c=t(a,`spacing`),u=c.filter(e=>e.tier===`core`),d=c.filter(e=>e.tier===`semantic`);return r({title:`Spacing`,intro:`A 4 px base grid with a few deliberate half-steps. The core steps are the raw ladder; the semantic tokens name the jobs — inset, gap, stack — and are what product code should reference.`,count:c.length,children:[u.length&&i(`Core steps`,s(`div`,{class:`hds-rows`},u.map(e=>l(e,o))),`The ladder itself. Do not reference these directly.`),d.length&&i(`Semantic spacing`,s(`div`,{class:`hds-rows`},d.map(e=>l(e,o))),`Named by use. These alias the core steps.`)].filter(Boolean)})}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'Scale',
  render: (_args, ctx) => {
    const {
      platform,
      theme
    } = ctx.globals;
    const tokens = byCategory(platform, 'spacing');
    const core = tokens.filter(t => t.tier === 'core');
    const semantic = tokens.filter(t => t.tier === 'semantic');
    return page({
      title: 'Spacing',
      intro: 'A 4 px base grid with a few deliberate half-steps. The core steps are the raw ladder; the semantic tokens name the jobs — inset, gap, stack — and are what product code should reference.',
      count: tokens.length,
      children: [core.length && group('Core steps', el('div', {
        class: 'hds-rows'
      }, core.map(t => bar(t, theme))), 'The ladder itself. Do not reference these directly.'), semantic.length && group('Semantic spacing', el('div', {
        class: 'hds-rows'
      }, semantic.map(t => bar(t, theme))), 'Named by use. These alias the core steps.')].filter(Boolean)
    });
  }
}`,...d.parameters?.docs?.source}}},f=[`Scale`]})))()}p();export{d as Scale,f as __namedExportsOrder,u as default};