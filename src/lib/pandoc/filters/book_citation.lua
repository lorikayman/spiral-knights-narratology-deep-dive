-- see ./dist/ .native
--
-- , BlockQuote
--     [ Para
--         [ Emph
--             [ Str "Psychology"
--             , Space
--             , Str "and"
--             , Space
--             , Str "Alchemy"
--             ]
--         , Str ","
--         , Space
--         , Emph [ Str "Carl" , Space , Str "Jung" ]
--         ]
--     , Para
--         [ Str "Citation Text" ...

function BlockQuote(el)
  -- filter non-BlockQuote elements
  if el.t ~= "BlockQuote" then
    return el
  end

  -- check for 2 elements at min.: head (para - emph) and body (para)
  if #el.content < 2 then
    return el
  end

  -- check 1st elemnt - it must be para
  local first = el.content[1]
  if first.t ~= "Para" then
    return el
  end

  -- Header reads: Emph(source), Str(","), Space, Emph/Strong(author).
  --
  -- Collect every Emph/Strong in the first Para and accept iff exactly two are
  -- found and the first is Emph.
  -- Strong for author marks the .citation-admin variant.
  local styled = {}
  for _, inline in ipairs(first.content) do
    if inline.t == "Emph" or inline.t == "Strong" then
      table.insert(styled, inline)
    end
  end

  if #styled ~= 2 or styled[1].t ~= "Emph" then
    return el
  end

  local source = pandoc.utils.stringify(styled[1].content)
  local author = pandoc.utils.stringify(styled[2].content)
  local is_admin = styled[2].t == "Strong"
  -- set classes as above noted
  local bg_class = is_admin and "citation-bg citation-admin" or "citation-bg"

  local body_blocks = {}
  for i = 2, #el.content do
    table.insert(body_blocks, el.content[i])
  end

  local body_html = pandoc.write(pandoc.Pandoc(body_blocks), "html5")
  local html = string.format(
    [[
      <div class="book-citation">
        <div class="%s">
          <div class="citation-source">
            <span class="citation-source-name">%s</span>
            <span class="citation-separator">—</span>
            <span class="citation-author">%s</span>
          </div>
          <div class="citation-content">
            %s
          </div>
        </div>
      </div>
    ]],
    bg_class, source, author, body_html
  )

  return pandoc.RawBlock("html", html)
end
