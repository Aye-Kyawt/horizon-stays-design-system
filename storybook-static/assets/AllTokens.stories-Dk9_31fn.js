import{i as e,o as t}from"./iframe-Bs83xxEs.js";import{a as n,i as r,o as i,r as a,t as o}from"./ui-D9uDtfws.js";import{t as s}from"./rolldown-runtime-Dh6celcD.js";var c,l,u,d;function f(){return(f=s((()=>{e(),a(),c={title:`All tokens`},l={"core-color":`core colour`,"semantic-color":`semantic colour`,typography:`typography`,"type-primitive":`type primitive`,spacing:`spacing`,radius:`radius`,"border-width":`stroke width`,size:`size`,elevation:`elevation`,component:`component`,other:`other`},u={name:`Searchable index`,render:(e,a)=>{let{platform:s,theme:c}=a.globals,u=t(s).tokens,d=o(`tbody`,{},[]),f=o(`p`,{class:`hds-count`,text:`${u.length} tokens`}),p=e=>c===`dark`&&e.overriddenInDark?e.aliasDark:e.alias,m=e=>o(`tr`,{},[o(`td`,{},[i(e.name)]),o(`td`,{text:l[e.category]||e.category}),o(`td`,{class:`hds-mono`,text:p(e)?`--${p(e)}`:`—`}),o(`td`,{class:`hds-mono`,text:e.resolved[c]}),o(`td`,{text:n(e.description,120)})]),h=e=>{let t=e.trim().toLowerCase(),n=t?u.filter(e=>e.name.toLowerCase().includes(t)||e.resolved[c].toLowerCase().includes(t)||(e.description||``).toLowerCase().includes(t)):u;d.replaceChildren(...n.map(m)),f.textContent=t?`${n.length} of ${u.length} tokens match “${e.trim()}”`:`${u.length} tokens`},g=o(`input`,{class:`hds-search`,type:`search`,placeholder:`Filter by name, value or description…`,oninput:e=>h(e.target.value)});return h(``),r({title:`All tokens`,intro:`Every custom property in this platform build, resolved for the active theme. Click a name to copy its var() reference.`,children:[g,f,o(`table`,{class:`hds-table`},[o(`thead`,{},[o(`tr`,{},[o(`th`,{text:`Token`}),o(`th`,{text:`Category`}),o(`th`,{text:`Aliases`}),o(`th`,{text:`Resolves to`}),o(`th`,{text:`Notes`})])]),d])]})}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: 'Searchable index',
  render: (_args, ctx) => {
    const {
      platform,
      theme
    } = ctx.globals;
    const tokens = tokensFor(platform).tokens;
    const tbody = el('tbody', {}, []);
    const status = el('p', {
      class: 'hds-count',
      text: \`\${tokens.length} tokens\`
    });
    const aliasFor = t => theme === 'dark' && t.overriddenInDark ? t.aliasDark : t.alias;
    const rowFor = t => el('tr', {}, [el('td', {}, [tokenName(t.name)]), el('td', {
      text: CATEGORY_LABELS[t.category] || t.category
    }), el('td', {
      class: 'hds-mono',
      text: aliasFor(t) ? \`--\${aliasFor(t)}\` : '—'
    }), el('td', {
      class: 'hds-mono',
      text: t.resolved[theme]
    }), el('td', {
      text: shortDesc(t.description, 120)
    })]);
    const render = query => {
      const q = query.trim().toLowerCase();
      const matches = q ? tokens.filter(t => t.name.toLowerCase().includes(q) || t.resolved[theme].toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q)) : tokens;
      tbody.replaceChildren(...matches.map(rowFor));
      status.textContent = q ? \`\${matches.length} of \${tokens.length} tokens match “\${query.trim()}”\` : \`\${tokens.length} tokens\`;
    };
    const search = el('input', {
      class: 'hds-search',
      type: 'search',
      placeholder: 'Filter by name, value or description…',
      oninput: e => render(e.target.value)
    });
    render('');
    return page({
      title: 'All tokens',
      intro: 'Every custom property in this platform build, resolved for the active theme. Click a name to copy its var() reference.',
      children: [search, status, el('table', {
        class: 'hds-table'
      }, [el('thead', {}, [el('tr', {}, [el('th', {
        text: 'Token'
      }), el('th', {
        text: 'Category'
      }), el('th', {
        text: 'Aliases'
      }), el('th', {
        text: 'Resolves to'
      }), el('th', {
        text: 'Notes'
      })])]), tbody])]
    });
  }
}`,...u.parameters?.docs?.source},description:{story:`The whole set in one filterable table — the page to reach for when you\r
 know part of a token name and want the rest of it.`,...u.parameters?.docs?.description}}},d=[`Index`]})))()}f();export{u as Index,d as __namedExportsOrder,c as default};