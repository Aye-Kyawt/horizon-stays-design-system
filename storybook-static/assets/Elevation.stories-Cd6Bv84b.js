import{i as e,r as t}from"./iframe-Bs83xxEs.js";import{a as n,i as r,n as i,o as a,r as o,t as s}from"./ui-D9uDtfws.js";import{t as c}from"./rolldown-runtime-Dh6celcD.js";function l(e,t){return s(`div`,{style:`background: var(--semantic-color-bg-surfaceprimary); border-radius: var(--core-border-radius-md); padding: 20px; box-shadow: var(--`+e.name+`);`},[a(e.name),s(`div`,{class:`hds-value`,text:e.resolved[t]}),s(`div`,{class:`hds-desc`,text:n(e.description,180)})])}var u,d,f,p;function m(){return(m=c((()=>{e(),o(),u={title:`Elevation`},d=e=>e.name.includes(`elevation-shadow-`),f={name:`Shadows`,render:(e,o)=>{let{platform:c,theme:u}=o.globals,f=t(c,`elevation`),p=f.filter(d),m=f.filter(e=>!d(e));return r({title:`Elevation`,intro:`Five levels, each composed from an offset, a blur and the shadow ink. The ink is a semantic colour — 14% on light, 72% on dark — so the whole ladder re-tunes when you flip the Theme toolbar rather than washing out.`,count:f.length,children:[i(`Levels`,s(`div`,{style:`display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 32px; margin-top: 24px; padding: 8px;`},p.map(e=>l(e,u)))),i(`Parts`,s(`table`,{class:`hds-table`},[s(`thead`,{},[s(`tr`,{},[s(`th`,{text:`Token`}),s(`th`,{text:`Value`}),s(`th`,{text:`Notes`})])]),s(`tbody`,{},m.map(e=>s(`tr`,{},[s(`td`,{},[a(e.name)]),s(`td`,{class:`hds-mono`,text:e.resolved[u]}),s(`td`,{text:n(e.description,160)})])))]),`The offsets and blurs the composed shadows are built from.`)]})}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'Shadows',
  render: (_args, ctx) => {
    const {
      platform,
      theme
    } = ctx.globals;
    const tokens = byCategory(platform, 'elevation');
    const composed = tokens.filter(isComposed);
    const parts = tokens.filter(t => !isComposed(t));
    return page({
      title: 'Elevation',
      intro: 'Five levels, each composed from an offset, a blur and the shadow ink. The ink is a semantic colour — 14% on light, 72% on dark — so the whole ladder re-tunes when you flip the Theme toolbar rather than washing out.',
      count: tokens.length,
      children: [group('Levels', el('div', {
        style: 'display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 32px; margin-top: 24px; padding: 8px;'
      }, composed.map(t => shadowCard(t, theme)))), group('Parts', el('table', {
        class: 'hds-table'
      }, [el('thead', {}, [el('tr', {}, [el('th', {
        text: 'Token'
      }), el('th', {
        text: 'Value'
      }), el('th', {
        text: 'Notes'
      })])]), el('tbody', {}, parts.map(t => el('tr', {}, [el('td', {}, [tokenName(t.name)]), el('td', {
        class: 'hds-mono',
        text: t.resolved[theme]
      }), el('td', {
        text: shortDesc(t.description, 160)
      })])))]), 'The offsets and blurs the composed shadows are built from.')]
    });
  }
}`,...f.parameters?.docs?.source}}},p=[`Shadows`]})))()}m();export{f as Shadows,p as __namedExportsOrder,u as default};