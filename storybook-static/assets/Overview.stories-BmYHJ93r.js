import{i as e,n as t,o as n}from"./iframe-Bs83xxEs.js";import{i as r,n as i,o as a,r as o,t as s}from"./ui-D9uDtfws.js";import{t as c}from"./rolldown-runtime-Dh6celcD.js";var l,u,d,f,p;function m(){return(m=c((()=>{e(),o(),l={title:`Overview`},u=[[`core-color`,`Core colour primitives`,`Colour → Core primitives`],[`semantic-color`,`Semantic colours`,`Colour → Semantic`],[`typography`,`Typography sub-properties`,`Typography`],[`type-primitive`,`Type primitives`,`Typography → Type primitives`],[`spacing`,`Spacing`,`Spacing`],[`radius`,`Corner radius`,`Borders → Radius`],[`border-width`,`Stroke width`,`Borders → Stroke width`],[`size`,`Icon and control sizes`,`Sizing`],[`elevation`,`Elevation`,`Elevation`],[`component`,`Component tokens`,`Components`],[`other`,`Everything else`,`All tokens`]],d={name:`Read me`,render:(e,t)=>{let{platform:a}=t.globals,o=n(a),c=new Map;for(let e of o.tokens)c.set(e.category,(c.get(e.category)||0)+1);let l=u.filter(([e])=>c.get(e)).map(([e,t,n])=>s(`tr`,{},[s(`td`,{text:t}),s(`td`,{class:`hds-mono`,text:String(c.get(e))}),s(`td`,{text:n})]));return r({title:`Horizon Stays design tokens`,intro:`Everything here is generated. The token files in tokens/ are exported from Figma and owned by the plugin; build-tokens.js turns them into one CSS file per platform; these stories read that CSS back and render it. Nothing in this Storybook is a hand-maintained copy of a token value, so what you see is what ships.`,children:[i(`How to use it`,s(`div`,{class:`hds-intro`},[s(`p`,{text:`Two toolbar controls drive every page. Platform swaps which of the three generated CSS builds is mounted — web, mobile and back-office share token names but differ on type and border values. Theme switches the [data-theme="dark"] block on and off.`}),s(`p`,{text:`Click any token name to copy its var() reference to the clipboard.`}),s(`p`,{text:`Reach for semantic tokens in product code. Core primitives are pigments, not decisions — they are documented so you can trace where a colour came from, not so you can use them directly.`})])),i(`What is in the ${a} build`,s(`table`,{class:`hds-table`},[s(`thead`,{},[s(`tr`,{},[s(`th`,{text:`Group`}),s(`th`,{text:`Tokens`}),s(`th`,{text:`Where`})])]),s(`tbody`,{},l)]),`${o.tokens.length} custom properties in :root, and ${o.darkOverrideCount} semantic colours overridden in the dark block.`)]})}},f={name:`Platform differences`,render:(e,o)=>{let c=o.globals.theme,l=Object.fromEntries(t.map(e=>[e,n(e)])),u=l[t[0]].tokens.filter(e=>{let n=t.map(t=>l[t].byName[e.name]?.resolved[c]);return new Set(n).size>1}),d=u.map(e=>s(`tr`,{},[s(`td`,{},[a(e.name)]),...t.map(t=>s(`td`,{class:`hds-mono`,text:l[t].byName[e.name]?.resolved[c]??`—`}))]));return r({title:`Platform differences`,intro:`Type and border are the only collections with per-platform modes. Every other token — colour, spacing, component, elevation — is identical across web, mobile and back office. These are the names that actually move.`,count:u.length,children:u.length?i(`Values by platform`,s(`table`,{class:`hds-table`},[s(`thead`,{},[s(`tr`,{},[s(`th`,{text:`Token`}),...t.map(e=>s(`th`,{text:e}))])]),s(`tbody`,{},d)])):s(`p`,{class:`hds-empty`,text:`No token resolves differently across the three platform builds.`})})}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'Read me',
  render: (_args, ctx) => {
    const {
      platform
    } = ctx.globals;
    const set = tokensFor(platform);
    const counts = new Map();
    for (const t of set.tokens) counts.set(t.category, (counts.get(t.category) || 0) + 1);
    const rows = CATEGORY_ORDER.filter(([key]) => counts.get(key)).map(([key, label, where]) => el('tr', {}, [el('td', {
      text: label
    }), el('td', {
      class: 'hds-mono',
      text: String(counts.get(key))
    }), el('td', {
      text: where
    })]));
    return page({
      title: 'Horizon Stays design tokens',
      intro: 'Everything here is generated. The token files in tokens/ are exported from Figma and owned by the plugin; build-tokens.js turns them into one CSS file per platform; these stories read that CSS back and render it. Nothing in this Storybook is a hand-maintained copy of a token value, so what you see is what ships.',
      children: [group('How to use it', el('div', {
        class: 'hds-intro'
      }, [el('p', {
        text: 'Two toolbar controls drive every page. Platform swaps which of the three generated CSS builds is mounted — web, mobile and back-office share token names but differ on type and border values. Theme switches the [data-theme="dark"] block on and off.'
      }), el('p', {
        text: 'Click any token name to copy its var() reference to the clipboard.'
      }), el('p', {
        text: 'Reach for semantic tokens in product code. Core primitives are pigments, not decisions — they are documented so you can trace where a colour came from, not so you can use them directly.'
      })])), group(\`What is in the \${platform} build\`, el('table', {
        class: 'hds-table'
      }, [el('thead', {}, [el('tr', {}, [el('th', {
        text: 'Group'
      }), el('th', {
        text: 'Tokens'
      }), el('th', {
        text: 'Where'
      })])]), el('tbody', {}, rows)]), \`\${set.tokens.length} custom properties in :root, and \${set.darkOverrideCount} semantic colours overridden in the dark block.\`)]
    });
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'Platform differences',
  render: (_args, ctx) => {
    const theme = ctx.globals.theme;
    const sets = Object.fromEntries(PLATFORMS.map(p => [p, tokensFor(p)]));
    const base = sets[PLATFORMS[0]];
    const differing = base.tokens.filter(t => {
      const values = PLATFORMS.map(p => sets[p].byName[t.name]?.resolved[theme]);
      return new Set(values).size > 1;
    });
    const rows = differing.map(t => el('tr', {}, [el('td', {}, [tokenName(t.name)]), ...PLATFORMS.map(p => el('td', {
      class: 'hds-mono',
      text: sets[p].byName[t.name]?.resolved[theme] ?? '—'
    }))]));
    return page({
      title: 'Platform differences',
      intro: 'Type and border are the only collections with per-platform modes. Every other token — colour, spacing, component, elevation — is identical across web, mobile and back office. These are the names that actually move.',
      count: differing.length,
      children: differing.length ? group('Values by platform', el('table', {
        class: 'hds-table'
      }, [el('thead', {}, [el('tr', {}, [el('th', {
        text: 'Token'
      }), ...PLATFORMS.map(p => el('th', {
        text: p
      }))])]), el('tbody', {}, rows)])) : el('p', {
        class: 'hds-empty',
        text: 'No token resolves differently across the three platform builds.'
      })
    });
  }
}`,...f.parameters?.docs?.source},description:{story:`Tokens whose value is not the same in all three platform builds. This is\r
 the whole point of the per-platform type and border modes, so it is worth\r
 having a page that shows exactly which names move.`,...f.parameters?.docs?.description}}},p=[`ReadMe`,`PlatformDifferences`]})))()}m();export{f as PlatformDifferences,d as ReadMe,p as __namedExportsOrder,l as default};