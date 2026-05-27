function Header(el)
  if el.level ~= 3 then return nil end
  local id = el.identifier or ""
  if not (id:find("^chapter%-") or id:find("^final%-chapter%-")) then
    return nil
  end

  local emph_idx = nil
  for i, inline in ipairs(el.content) do
    if inline.t == "Emph" then
      emph_idx = i
      break
    end
  end
  if not emph_idx then return nil end

  local emph = el.content[emph_idx]
  local rest = pandoc.List({})
  for i = emph_idx + 1, #el.content do
    rest:insert(el.content[i])
  end
  while #rest > 0 and (rest[1].t == "Space" or rest[1].t == "SoftBreak") do
    rest:remove(1)
  end

  local span_content = pandoc.List({ emph, pandoc.LineBreak() })
  for _, x in ipairs(rest) do span_content:insert(x) end

  el.content = pandoc.List({
    pandoc.Span(span_content, pandoc.Attr("", { "cover-content" }))
  })
  return el
end
